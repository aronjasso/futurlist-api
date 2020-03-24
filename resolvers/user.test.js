import test from 'ava';
import dotenv from 'dotenv';
import EasyGraphQLTester from 'easygraphql-tester';
import jwt from 'jsonwebtoken';

import models from '../models/mocks';
import resolvers from './index';
import schema from '../schema';

if (process.env.NODE_ENV !== 'production') dotenv.config();

let tester;
test.before(() => {
  tester = new EasyGraphQLTester(schema, resolvers);
});

test.afterEach((t) => {
  t.log(models.User.$clearQueue());
});

// Query: me
const meQuery = `{
  me { id }
}`;

test('Should return current user when user is present in context.', async (t) => {
  const me = { id: 1 };
  const result = await tester.graphql(
    meQuery,
    undefined,
    { models, me },
  );
  t.deepEqual(result.data.me, { id: '1' });
});

test('Should return null when user is not present in context.', async (t) => {
  const result = await tester.graphql(meQuery, undefined, { models });
  t.is(result.data.me, null);
});

// Query: user (id: ID!)
const userQuery = `query USER($id: ID!) {
  user(id: $id) { id }
}`;

test('Should return user when ID param is passed.', async (t) => {
  const result = await tester.graphql(
    userQuery,
    undefined,
    { models },
    { id: 1 },
  );
  t.deepEqual(result.data.user, { id: '1' });
});

test('Should return errors when ID param is not passed.', async (t) => {
  const result = await tester.graphql(
    userQuery,
    undefined,
    { models },
  );
  t.is(result.data, undefined);
  t.truthy('errors' in result);
});

// Query: users
const usersQuery = `query USERS {
  users { id }
}`;

test('Should return all users.', async (t) => {
  // TODO: weak query and test... rethink
  const result = await tester.graphql(usersQuery, undefined, { models });
  t.truthy(result.data.users.length > 0);
});

// Mutation: signUp (email: String!, password: String!)
const signUpMutation = `mutation SIGNUP($email: String!, $password: String!) {
  signUp(email: $email, password: $password) {
    token
  }
}`;

test('Should return valid token on successful user sign up.', async (t) => {
  const result = await tester.graphql(
    signUpMutation,
    undefined,
    { models, secret: process.env.SECRET },
    { email: 'sherlock.holmes@gmail.com', password: 'M0r1arty' },
  );

  try {
    const token = await jwt.verify(result.data.signUp.token, process.env.SECRET);
    t.is(token.email, 'sherlock.holmes@gmail.com');
  } catch (err) {
    t.fail(err.message);
  }
});

// Mutation: signIn (login: String!, password: String!)
const signInMutation = `mutation SIGNIN($login: String!, $password: String!) {
  signIn(login: $login, password: $password) {
    token
  }
}`;

test('Should return valid token on successful user sign in.', async (t) => {
  const result = await tester.graphql(
    signInMutation,
    undefined,
    { models, secret: process.env.SECRET },
    { login: 'sherlock.holmes@gmail.com', password: 'M0r1arty' },
  );

  try {
    const token = await jwt.verify(result.data.signIn.token, process.env.SECRET);
    t.is(token.email, 'sherlock.holmes@gmail.com');
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should return error on failed user sign in.', async (t) => {
  const result = await tester.graphql(
    signInMutation,
    undefined,
    { models, secret: process.env.SECRET },
    { login: 'sherlock.holmes@gmail.com', password: '' },
  );

  t.is(result.data, null);
  t.truthy('errors' in result);
});

// Mutation: deleteUser(id: ID!)
const deleteUserMutation = `mutation DELETEUSER($id: ID!) {
  deleteUser(id: $id)
}`;

test('Should return true if authorized user deleted user successfuly.', async (t) => {
  const me = { role: 'ADMIN' };
  const result = await tester.graphql(
    deleteUserMutation,
    undefined,
    { models, me },
    { id: 2 },
  );

  t.truthy(result.data.deleteUser);
});

test('Should return errors if unauthorized user tries to delete user.', async (t) => {
  const me = { role: 'DEFAULT' };
  const result = await tester.graphql(
    deleteUserMutation,
    undefined,
    { models, me },
    { id: 2 },
  );

  t.is(result.data, null);
  t.truthy('errors' in result);
});
