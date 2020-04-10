import test from 'ava';
import EasyGraphQLTester from 'easygraphql-tester';

import models from '../models/mocks';
import resolvers from './index';
import schema from '../schema';

let tester;
test.before(() => {
  tester = new EasyGraphQLTester(schema, resolvers);
});

test.afterEach((t) => {
  t.log(models.Entry.$clearQueue());
});

// Query: entry (id: ID!)
const entryQuery = `query ENTRY($id: ID!) {
  entry(id: $id) {
    body
    completedAt
    id
    occursAt
    title
    type
    user {
      id
      name
    }
  }
}`;

test('Should return an entry when ID is passed.', async (t) => {
  const me = { id: 1 };
  const result = await tester.graphql(
    entryQuery,
    undefined,
    { models, me },
    { id: 1 },
  );
  t.is(result.data.entry.id, '1');
  t.truthy('title' in result.data.entry);
  t.truthy('type' in result.data.entry);
  t.truthy('body' in result.data.entry);
  t.truthy('occursAt' in result.data.entry);
  t.truthy('completedAt' in result.data.entry);
  t.deepEqual(result.data.entry.user, { id: '1', name: 'Sherlock Holmes' });
});

// Query: entries (cursor, limit)
const entriesQuery = `query ENTRIES($cursor: String, $limit: Int) {
  entries(cursor: $cursor, limit: $limit) {
    edges {
      title
      type
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

test('Should return a paginated list of entries.', async (t) => {
  const result = await tester.graphql(
    entriesQuery,
    undefined,
    { models },
  );
  t.truthy(Array.isArray(result.data.entries.edges));
  t.truthy(result.data.entries.edges.length > 0);
  t.truthy('hasNextPage' in result.data.entries.pageInfo);
  t.truthy('endCursor' in result.data.entries.pageInfo);
});

// Mutation: createEntry (title)
const createEntryMutation = `mutation createEntry($title: String!) {
  createEntry(title: $title) {
    title
    type
  }
}`;

test('Should return entry on successful entry creation.', async (t) => {
  const me = { role: 'ADMIN' };
  const result = await tester.graphql(
    createEntryMutation,
    undefined,
    { models, me },
    { title: 'New Entry' },
  );
  t.truthy('title' in result.data.createEntry);
  t.truthy('type' in result.data.createEntry);
});

// Mutation: deleteEntry (id)
const deleteEntryMutation = `mutation DELETEENTRY($id: ID!) {
  deleteEntry(id: $id)
}`;

test('Should return true when entry is deleted by owner.', async (t) => {
  const me = { id: 1, role: 'DEFULT' };
  const result = await tester.graphql(
    deleteEntryMutation,
    undefined,
    { models, me },
    { id: 1 },
  );
  t.truthy(result.data.deleteEntry);
});

test('Should return error when entry is deleted by a non-owner.', async (t) => {
  const me = { id: 2, role: 'DEFULT' };
  const result = await tester.graphql(
    deleteEntryMutation,
    undefined,
    { models, me },
    { id: 1 },
  );
  t.is(result.data, null);
  t.truthy('errors' in result);
});
