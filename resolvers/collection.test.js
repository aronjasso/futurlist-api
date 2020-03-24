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
  t.log(models.Collection.$clearQueue());
});

// Query: collection (id)
const collectionQuery = `query COLLECTION($id: ID!) {
  collection(id: $id) {
    id
    name
  }
}`;

test('Should return a collection when ID is passed.', async (t) => {
  const result = await tester.graphql(
    collectionQuery,
    undefined,
    { models },
    { id: 1 },
  );
  t.deepEqual(result.data.collection, { id: '1', name: 'Tasks' });
});

test('Should return error if ID is not passed for collection.', async (t) => {
  const result = await tester.graphql(
    collectionQuery,
    undefined,
    { models },
  );
  t.is(result.data, undefined);
  t.truthy('errors' in result);
});

// Query: collection (cursor, limit)
const collectionsQuery = `query COLLECTIONS($cursor: String, $limit: Int) {
  collections(cursor: $cursor, limit: $limit) {
    edges {
      name
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

test('Should return paginated list of collections.', async (t) => {
  const result = await tester.graphql(
    collectionsQuery,
    undefined,
    { models },
  );
  t.truthy(Array.isArray(result.data.collections.edges));
  t.truthy(result.data.collections.edges.length > 0);
  t.truthy('hasNextPage' in result.data.collections.pageInfo);
  t.truthy('endCursor' in result.data.collections.pageInfo);
});

// Mutation: createCollection (name)
const createCollectionMutation = `mutation CREATE_COLLECTION($name: String!) {
  createCollection(name: $name) {
    id
    name
  }
}`;

test('Should return collection after successful collection creation.', async (t) => {
  const me = { id: 1 };
  const result = await tester.graphql(
    createCollectionMutation,
    undefined,
    { models, me },
    { name: 'New Collection' },
  );
  t.is(
    Object.prototype.toString.call(result.data.createCollection),
    '[object Object]',
  );
  t.truthy('id' in result.data.createCollection);
  t.truthy('name' in result.data.createCollection);
  t.is(result.data.createCollection.name, 'New Collection');
});

test('Should return errors after collection creation failure.', async (t) => {
  const me = { id: 1 };
  const result = await tester.graphql(
    createCollectionMutation,
    undefined,
    { models, me },
  );
  t.is(result.data, undefined);
  t.truthy('errors' in result);
});

// Mutation: deleteCollection (id)
const deleteCollectionMutation = `mutation DELETE_COLLECTION($id: ID!) {
  deleteCollection(id: $id)
}`;

test('Should return true if collection successfully deleted.', async (t) => {
  const me = { id: 1 };
  const result = await tester.graphql(
    deleteCollectionMutation,
    undefined,
    { models, me },
    { id: 1 },
  );
  t.truthy(result.data.deleteCollection);
});

test('Should return errors if collection failed to delete.', async (t) => {
  const me = { id: 1 };
  const result = await tester.graphql(
    deleteCollectionMutation,
    undefined,
    { models, me },
  );
  t.is(result.data, undefined);
  t.truthy('errors' in result);
});

test('Should return errors if non-owner tried to delete collection.', async (t) => {
  const me = { id: 2 };
  const result = await tester.graphql(
    deleteCollectionMutation,
    undefined,
    { models, me },
    { id: 1 },
  );
  t.is(result.data, null);
  t.truthy('errors' in result);
});
