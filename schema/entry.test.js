import test from 'ava';
import EasyGraphQLTester from 'easygraphql-tester';

import schema from './index';

let tester;
test.before(() => {
  tester = new EasyGraphQLTester(schema);
});

test('Should pass if entry query is valid', (t) => {
  const entry = `
    query entry ($id: ID!) {
      entry (id: $id) {
        createdAt
        id
        title
        user {
          name
        }
        type
      }
    }
  `;

  try {
    tester.test(true, entry, { id: 1 });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if entries query is valid', (t) => {
  const entries = `
    query entries ($cursor: String!, $limit: Int) {
      entries (cursor: $cursor, limit: $limit) {
        edges {
          createdAt
          id
          title
          user {
            name
          }
          type
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    tester.test(true, entries, { cursor: 'string', limit: 20 });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if createEntry mutation is valid', (t) => {
  const createEntry = `
    mutation createEntry ($title: String!) {
      createEntry (title: $title) {
        createdAt
        id
        title
        user {
          name
        }
        type
      }
    }
  `;

  try {
    tester.test(true, createEntry, { title: 'Entry Title' });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if deleteEntry mutation is valid', (t) => {
  const deleteEntry = `
    mutation deleteEntry ($id: ID!) {
      deleteEntry (id: $id)
    }
  `;

  try {
    tester.test(true, deleteEntry, { id: 1 });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if entryCreated subscription is valid', (t) => {
  const entryCreated = `
    subscription {
      entryCreated {
        entry {
          title
        }
      }
    }
  `;

  try {
    tester.test(true, entryCreated);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});
