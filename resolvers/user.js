import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import jwt from 'jsonwebtoken';

import { isAdmin } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const {
    id, email, username, role,
  } = user;
  const token = await jwt.sign({
    id, email, username, role,
  }, secret, { expiresIn });
  return token;
};

export default {
  Query: {
    me: async (parents, args, { models, me }) => {
      if (!me) return null;
      const user = await models.User.findByPk(me.id);
      return user;
    },
    user: async (parent, { id }, { models }) => {
      const user = await models.User.findByPk(id);
      return user;
    },
    users: async (parents, args, { models }) => {
      const users = await models.User.findAll();
      return users;
    },
  },
  Mutation: {
    signUp: async (parent, { email, password }, { models, secret }) => {
      try {
        const user = await models.User.create({ email, password });
        return { token: createToken(user, secret, '30m') };
      } catch (error) {
        throw new Error(error);
      }
    },
    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login);
      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);
      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },
    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const deleted = await models.User.destroy({ where: { id } });
        return deleted;
      },
    ),
  },
  User: {
    entries: async (user, args, { models }) => {
      const entries = await models.Entry.findAll({ where: { UserId: user.id } });
      return entries;
    },
    name: (user) => {
      const spaceBetween = (user.firstName && user.lastName) ? ' ' : '';
      return `${user.firstName || ''}${spaceBetween}${user.lastName || ''}`;
    },
  },
};
