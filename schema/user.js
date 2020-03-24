import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  extend type Mutation {
    signUp(
      email: String!
      password: String!
    ): Token!
    signIn(login: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    createdAt: Date!
    email: String!
    entries: [Entry!]
    firstName: String
    id: ID!
    lastName: String
    name: String
    role: String!
  }
`;
