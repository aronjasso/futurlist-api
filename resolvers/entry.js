import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';

import { isAuthenticated, isOwner } from './authorization';
import pubsub, { EVENTS } from '../subscription';

const toCursorHash = (string) => Buffer.from(string).toString('base64');
const fromCursorHash = (string) => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    entry: combineResolvers(
      isOwner('Entry'),
      async (parent, { id }, { models }) => {
        const entry = await models.Entry.findByPk(id);
        return entry;
      },
    ),
    entries: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor ? {
        where: { createdAt: { [Sequelize.Op.lt]: fromCursorHash(cursor) } },
      } : {};

      const entries = await models.Entry.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = entries.length > limit;
      const edges = hasNextPage ? entries.slice(0, -1) : entries;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
  },
  Mutation: {
    createEntry: combineResolvers(
      isAuthenticated,
      async (parent, {
        title,
        type,
        body,
        occursAt,
      }, { models, me }) => {
        try {
          const entry = await models.Entry.create({
            title,
            ...(type && { type }),
            ...(body && { body }),
            ...(occursAt && { occursAt }),
            UserId: me.id,
          });

          // pubsub.publish(EVENTS.ENTRY.CREATED, { entryCreated: { entry } });

          return entry;
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
    deleteEntry: combineResolvers(
      isOwner('Entry'),
      async (parent, { id }, { models }) => {
        const deleted = await models.Entry.destroy({ where: { id } });
        return deleted;
      },
    ),
  },
  Subscription: {
    entryCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.ENTRY.CREATED),
    },
  },
  Entry: {
    user: async (entry, args, { models }) => {
      const user = await models.User.findByPk(entry.UserId);
      return user;
    },
  },
};
