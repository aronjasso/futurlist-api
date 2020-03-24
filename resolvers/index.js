import { GraphQLDateTime } from 'graphql-iso-date';

import collectionResolvers from './collection';
import entryResolvers from './entry';
import userResolvers from './user';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  collectionResolvers,
  entryResolvers,
  userResolvers,
];
