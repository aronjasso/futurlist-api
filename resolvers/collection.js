import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';

import { isAuthenticated, isOwner } from './authorization';

const toCursorHash = (string) => Buffer.from(string).toString('base64');
const fromCursorHash = (string) => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    collection: async (parent, { id }, { models }) => {
      const collection = await models.Collection.findByPk(id);
      return collection;
    },
    collections: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor ? {
        where: { createdAt: { [Sequelize.Op.lt]: fromCursorHash(cursor) } },
      } : {};

      const collections = await models.Collection.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = collections.length > limit;
      const edges = hasNextPage ? collections.slice(0, -1) : collections;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            ((edges[edges.length - 1] || {}).createdAt || {}).toString(),
          ),
        },
      };
    },
  },
  Mutation: {
    createCollection: combineResolvers(
      isAuthenticated,
      async (parent, { name }, { models, me }) => {
        try {
          const collection = await models.Collection.create({ name, UserId: me.id });
          return collection;
        } catch (error) {
          throw new Error(error);
        }
      },
    ),
    deleteCollection: combineResolvers(
      isOwner('Collection'),
      async (parent, { id }, { models }) => {
        const deleted = await models.Collection.destroy({ where: { id } });
        return deleted;
      },
    ),
  },
  Collection: {
    user: async (collection, args, { models }) => {
      const user = await models.User.findByPk(collection.UserId);
      return user;
    },
  },
};
