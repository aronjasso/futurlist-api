import { gql } from 'apollo-server-express';

import collectionSchema from './collection';
import entrySchema from './entry';
import userSchema from './user';

export const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }
`;

export default [
  linkSchema,
  collectionSchema,
  entrySchema,
  userSchema,
];
