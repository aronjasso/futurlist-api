import test from 'ava';
import EasyGraphQLTester from 'easygraphql-tester';

import models from '../models/mocks';
import resolvers from './index';
import schema from '../schema';

const me = { id: 1, role: 'DEFAULT' };
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

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
const createEntryMutation = `mutation createEntry(
  $title: String!, $type: String, $body: String, $occursAt: Date
) {
  createEntry(
    title: $title,
    type: $type,
    body: $body,
    occursAt: $occursAt
  ) {
    title
    type
    body
    occursAt
    user {
      id
    }
  }
}`;

test('Should return task on entry task creation.', async (t) => {
  const result = await tester.graphql(
    createEntryMutation,
    undefined,
    { models, me },
    {
      title: 'New Task',
      body: 'Task description',
      occursAt: tomorrow.toISOString(),
    },
  );

  if ('errors' in result) t.fail(result.errors);

  const task = result.data.createEntry;
  t.is(task.title, 'New Task');
  t.is(task.type, 'TASK');
  t.is(task.body, 'Task description');
  t.is(task.occursAt, tomorrow.toISOString());
  t.is(task.user.id, '1');
});

test('Should return event on entry event creation.', async (t) => {
  const result = await tester.graphql(
    createEntryMutation,
    undefined,
    { models, me },
    {
      title: 'New Event',
      type: 'EVENT',
      body: 'Event description',
      occursAt: tomorrow.toISOString(),
    },
  );

  if ('errors' in result) t.fail(result.errors);

  const event = result.data.createEntry;
  t.is(event.title, 'New Event');
  t.is(event.type, 'EVENT');
  t.is(event.body, 'Event description');
  t.is(event.occursAt, tomorrow.toISOString());
  t.is(event.user.id, '1');
});

test('Should return note on entry note creation.', async (t) => {
  const result = await tester.graphql(
    createEntryMutation,
    undefined,
    { models, me },
    {
      title: 'New Note',
      type: 'NOTE',
      body: 'Note description',
    },
  );

  if ('errors' in result) t.fail(result.errors);

  const note = result.data.createEntry;
  t.is(note.title, 'New Note');
  t.is(note.type, 'NOTE');
  t.is(note.body, 'Note description');
  t.is(note.user.id, '1');
});

// Mutation: deleteEntry (id)
const deleteEntryMutation = `mutation DELETEENTRY($id: ID!) {
  deleteEntry(id: $id)
}`;

test('Should return true when entry is deleted by owner.', async (t) => {
  const result = await tester.graphql(
    deleteEntryMutation,
    undefined,
    { models, me },
    { id: 1 },
  );
  t.truthy(result.data.deleteEntry);
});

test('Should return error when entry is deleted by a non-owner.', async (t) => {
  const nonOwner = { ...me, id: 2 };
  const result = await tester.graphql(
    deleteEntryMutation,
    undefined,
    { models, me: nonOwner },
    { id: 1 },
  );
  t.is(result.data, null);
  t.truthy('errors' in result);
});
