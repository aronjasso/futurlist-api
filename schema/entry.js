import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    entry(id: ID!): Entry!
    entries(
      search: String,
      filter: EntryInput,
      cursor: String,
      limit: Int,
    ): EntryConnection!
  }

  extend type Mutation {
    createEntry(
      title: String!,
      type: String,
      body: String,
      occursAt: Date,
    ): Entry!
    editEntry(
      id: ID!
      title: String,
      type: String,
      body: String,
      occursAt: Date,
      completedAt: Date,
    ): Entry!
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
    id: ID!
    title: String!
    type: String!
    body: String
    priority: Boolean!
    position: Int
    occursAt: Date
    completedAt: Date
    createdAt: Date!
    user: User!
  }

  type EntryCreated {
    entry: Entry!
  }

  input EntryInput {
    type: String
    priority: Boolean
    occursAt: Date
    completedAt: Date
  }
`;
