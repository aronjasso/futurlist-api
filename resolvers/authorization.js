import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (parent, args, { me }) => (
  me ? skip : new ForbiddenError('Not authenticated as user.')
);

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) => {
    if (role === 'ADMIN') return skip;
    return new ForbiddenError('Not authorized as admin.');
  },
);

export const isOwner = (modelName) => {
  const acceptedModels = ['Collection', 'Entry'];
  if (!acceptedModels.includes(modelName)) {
    return new Error('Not an accepted model name.');
  }

  return combineResolvers(
    isAuthenticated,
    async (parent, { id }, { models, me }) => {
      const item = await models[modelName].findByPk(id, { raw: true });
      if (item && item.UserId !== me.id) {
        return new ForbiddenError('Not authenticated as owner.');
      }
      return skip;
    },
  );
};
