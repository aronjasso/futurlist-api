import { PubSub } from 'apollo-server';

import * as ENTRY_EVENTS from './entry';

export const EVENTS = {
  ENTRY: ENTRY_EVENTS,
};

export default new PubSub();
