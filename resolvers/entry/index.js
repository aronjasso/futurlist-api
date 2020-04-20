import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isOwner } from '../authorization';

import { getEntry, getEntries } from './queries';
import { createEntry, editEntry, deleteEntry } from './mutations';
import entryCreated from './subscriptions';

export default {
  Query: {
    entry: combineResolvers(
      isOwner('Entry'),
      getEntry,
    ),
    entries: combineResolvers(
      isAuthenticated,
      getEntries,
    ),
  },
  Mutation: {
    createEntry: combineResolvers(
      isAuthenticated,
      createEntry,
    ),
    editEntry: combineResolvers(
      isOwner('Entry'),
      editEntry,
    ),
    deleteEntry: combineResolvers(
      isOwner('Entry'),
      deleteEntry,
    ),
  },
  Subscription: { entryCreated },
  Entry: {
    user: async (entry, args, { models }) => {
      try {
        const user = await models.User.findByPk(entry.UserId);
        if (!user) return new Error('User not found.');
        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
