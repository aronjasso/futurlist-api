import test from 'ava';
import EasyGraphQLTester from 'easygraphql-tester';

import schema from './index';

let tester;
test.before(() => {
  tester = new EasyGraphQLTester(schema);
});

test('Should pass if collection query is valid', (t) => {
  const collection = `
    query collection ($id: ID!) {
      collection (id: $id) {
        createdAt
        id
        name
        user {
          name
        }
      }
    }
  `;

  try {
    tester.test(true, collection, { id: 1 });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if collections query is valid', (t) => {
  const collections = `
    query collections ($cursor: String, $limit: Int) {
      collections (cursor: $cursor, limit: $limit) {
        edges {
          createdAt
          id
          name
          user {
            name
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    tester.test(true, collections, { cursor: 'string', limit: 20 });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if createCollection mutation is valid', (t) => {
  const createCollection = `
    mutation createCollection ($name: String!) {
      createCollection (name: $name) {
        createdAt
        id
        name
        user {
          name
        }
      }
    }
  `;

  try {
    tester.test(true, createCollection, { name: 'Collection Name' });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if deleteCollection mutation is valid', (t) => {
  const deleteCollection = `
    mutation deleteCollection ($id: ID!) {
      deleteCollection (id: $id)
    }
  `;

  try {
    tester.test(true, deleteCollection, { id: 1 });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});
