const today = new Date();
const tomorrow = new Date(today);
const dayAfterTomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

module.exports = {
  up: function up(queryInterface) {
    return queryInterface.bulkInsert('Entries', [{
      body: 'This is a the description of a task.',
      completedAt: today,
      createdAt: today,
      id: 1,
      occursAt: null,
      title: 'Task',
      type: 'TASK',
      updatedAt: today,
      UserId: 1,
    }, {
      body: null,
      completedAt: null,
      createdAt: today,
      id: 2,
      occursAt: tomorrow,
      title: 'Event',
      type: 'EVENT',
      updatedAt: today,
      UserId: 1,
    }, {
      body: 'This is a note.',
      completedAt: null,
      createdAt: today,
      id: 3,
      occursAt: null,
      title: 'Note',
      type: 'NOTE',
      updatedAt: today,
      UserId: 1,
    }, {
      body: 'Description of event',
      completedAt: null,
      createdAt: today,
      id: 4,
      occursAt: dayAfterTomorrow,
      title: 'Another Event',
      type: 'EVENT',
      updatedAt: today,
      UserId: 2,
    }], {});
  },

  down: function down(queryInterface) {
    return queryInterface.bulkDelete('Entries', null, {});
  },
};
