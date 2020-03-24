import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    entry(id: ID!): Entry!
    entries(cursor: String, limit: Int): EntryConnection!
  }

  extend type Mutation {
    createEntry(title: String!): Entry!
    deleteEntry(id: ID!): Boolean!
  }

  extend type Subscription {
    entryCreated: EntryCreated!
  }

  type EntryConnection {
    edges: [Entry!]!
    pageInfo: PageInfo!
  }

  type Entry {
    createdAt: Date!
    id: ID!
    title: String!
    user: User!
    type: String
  }

  type EntryCreated {
    entry: Entry!
  }
`;
