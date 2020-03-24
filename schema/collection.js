import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    collection(id: ID!): Collection!
    collections(cursor: String, limit: Int): CollectionConnection!
  }

  extend type Mutation {
    createCollection(name: String!): Collection!
    deleteCollection(id: ID!): Boolean!
  }

  type CollectionConnection {
    edges: [Collection!]!
    pageInfo: PageInfo!
  }

  type Collection {
    createdAt: Date!
    id: ID!
    name: String!
    user: User!
  }
`;
