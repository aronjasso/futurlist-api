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
        id
        title
        type
        body
        priority
        position
        occursAt
        completedAt
        user { id }
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
    query (
      $search: String,
      $filter: EntryInput,
      $cursor: String,
      $limit: Int,
    ) {
      entries (
        search: $search,
        filter: $filter,
        cursor: $cursor,
        limit: $limit,
      ) {
        edges {
          id
          title
          type
          body
          priority
          position
          occursAt
          completedAt
          user { id }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  try {
    tester.test(true, entries, {
      search: 'Hello',
      filter: {
        type: 'TASK',
        priority: true,
        occursAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      cursor: 'string',
      limit: 20,
    });
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('Should pass if createEntry mutation is valid', (t) => {
  const createEntry = `
    mutation createEntry (
      $title: String!
      $type: String
      $body: String
      $occursAt: Date
    ) {
      createEntry (
        title: $title
        type: $type
        body: $body
        occursAt: $occursAt
      ) {
        title
        type
        body
        occursAt
        completedAt
        user {
          id
        }
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

test('Should pass if editEntry mutation is valid', (t) => {
  const editEntry = `
    mutation (
      $id: ID!
      $title: String
      $type: String
      $body: String
      $occursAt: Date
      $completedAt: Date
    ) {
      editEntry (
        id: $id
        title: $title
        type: $type
        body: $body
        occursAt: $occursAt
        completedAt: $completedAt
      ) {
        title
        type
        body
        occursAt
        completedAt
        user { id }
      }
    }
  `;

  try {
    tester.test(true, editEntry, {
      id: 1,
      title: 'Edited Title',
      type: 'EVENT',
      body: 'Edited body',
      occursAt: 'Edited Date',
      completedAt: 'Edited Date',
    });
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
