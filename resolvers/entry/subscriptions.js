import pubsub, { EVENTS } from '../../subscription';

const entryCreated = {
  subscribe: () => pubsub.asyncIterator(EVENTS.ENTRY.CREATED),
};
export default entryCreated;
