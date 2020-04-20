const today = new Date();
const tomorrow = new Date(today);
const dayAfterTomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('Entries', [{
      id: 1,
      title: 'Task',
      type: 'TASK',
      body: 'This is a the description of a task.',
      priority: true,
      position: 0,
      occursAt: null,
      completedAt: today.toISOString(),
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      UserId: 1,
    }, {
      id: 2,
      title: 'Event',
      type: 'EVENT',
      body: null,
      priority: false,
      position: null,
      occursAt: tomorrow.toISOString(),
      completedAt: null,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      UserId: 1,
    }, {
      id: 3,
      title: 'Note',
      type: 'NOTE',
      body: 'This is a note.',
      priority: false,
      position: null,
      occursAt: null,
      completedAt: null,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      UserId: 1,
    }, {
      id: 4,
      title: 'Another Event',
      type: 'EVENT',
      body: 'Description of event',
      priority: true,
      position: null,
      occursAt: dayAfterTomorrow.toISOString(),
      completedAt: null,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      UserId: 2,
    }, {
      id: 5,
      title: 'Task for other user',
      type: 'TASK',
      body: 'Description of task.',
      priority: false,
      position: 0,
      occursAt: dayAfterTomorrow.toISOString(),
      completedAt: null,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      UserId: 2,
    }], {});
  },

  down: function down(queryInterface) {
    return queryInterface.bulkDelete('Entries', null, {});
  },
};
