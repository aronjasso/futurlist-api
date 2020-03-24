import test from 'ava';

import models from '../models/mocks';

import {
  isAuthenticated,
  isAdmin,
  isOwner,
} from './authorization';

// isAuthenticated
// TODO: Should probably check if user token is still valid
test('Should return undefined if current user is in context.', (t) => {
  const me = { id: 1 };
  const result = isAuthenticated({}, {}, { me });
  t.is(result, undefined);
});

test('Should return ForbiddenError if current user is not in context.', (t) => {
  const result = isAuthenticated({}, {}, {});
  t.is(result.extensions.code, 'FORBIDDEN');
});

// isAdmin (me { role })
test('Should return undefined if current auth user is admin.', async (t) => {
  const me = { id: 1, role: 'ADMIN' };
  const result = await isAdmin({}, {}, { me });
  t.is(result, undefined);
});

test('Should return ForbiddenError if current auth user is not admin.', async (t) => {
  const me = { id: 1, role: 'DEFAULT' };
  const result = await isAdmin({}, {}, { me });
  t.is(result.extensions.code, 'FORBIDDEN');
});

// isOwner (modelName: String!)(id, me)
test('Should skip if current auth user is owner', async (t) => {
  const me = { id: 1 };
  const result = await isOwner('Entry')({}, { id: 1 }, { models, me });
  t.is(result, undefined);
});

test('Should return ForbiddenError if current auth user is not owner.', async (t) => {
  const me = { id: 2 };
  const result = await isOwner('Entry')({}, { id: 1 }, { models, me });
  t.is(result.extensions.code, 'FORBIDDEN');
});

test('Should return error on isOwner if modalName does not exist.', (t) => {
  const result = isOwner('Unknown');
  t.is(result.message, 'Not an accepted model name.');
});
