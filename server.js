import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

if (process.env.NODE_ENV !== 'production') dotenv.config();

const app = express();
const getMe = async (req) => {
  const token = req.headers['x-token'];
  let me;
  if (token) {
    try {
      me = await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
  return me;
};
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) return { models };
    if (req) {
      const me = await getMe(req);
      const secret = process.env.SECRET;
      return { models, me, secret };
    }
    return {};
  },
});

app.use(cors());
server.applyMiddleware({ app, path: '/api' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

sequelize.sync({ force: false }).then(() => {
  httpServer.listen({ port: process.env.PORT });
});
