import test from 'ava';
import EasyGraphQLTester from 'easygraphql-tester';

import schema from './index';

let tester;
test.before(() => {
  tester = new EasyGraphQLTester(schema);
});

test('Should pass if me query is valid', (t) => {
  const me = `
    {
      me {
        createdAt
        email
        entries {
          title
        }
        firstName
        id
        lastName
        name
        role
      }
    }
  `;

  try {
    tester.test(true, me);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if user query is valid', (t) => {
  const user = `
    {
      user (id: 1) {
        createdAt
        email
        entries {
          title
        }
        firstName
        id
        lastName
        name
        role
      }
    }
  `;

  try {
    tester.test(true, user);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if users query is valid', (t) => {
  const users = `
    {
      users {
        createdAt
        email
        entries {
          title
        }
        firstName
        id
        lastName
        name
        role
      }
    }
  `;

  try {
    tester.test(true, users);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if signUp mutation is valid', (t) => {
  const signUp = `
    mutation signUp ($email: String!, $password: String!) {
      signUp (email: $email, password: $password) {
        token
      }
    }
  `;

  try {
    tester.test(
      true,
      signUp,
      { email: 'aron.jasso@gmail.com', password: 'password' },
    );
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if signIn mutation is valid', (t) => {
  const signIn = `
    mutation signIn ($login: String!, $password: String!) {
      signIn (login: $login, password: $password) {
        token
      }
    }
  `;

  try {
    tester.test(
      true,
      signIn,
      { login: 'aron.jasso@gmail.com', password: 'password' },
    );
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if deleteUser mutation is valid', (t) => {
  const deleteUser = `
    mutation deleteUser ($id: ID!) {
      deleteUser (id: $id)
    }
  `;

  try {
    tester.test(
      true,
      deleteUser,
      { id: 1 },
    );
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});
