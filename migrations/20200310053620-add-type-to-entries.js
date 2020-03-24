module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Entries', 'type', {
      type: Sequelize.ENUM,
      values: ['TASK', 'EVENT', 'NOTE', 'THOUGHT'],
      allowNull: false,
      defaultValue: 'TASK',
    })
  ),
  down: (queryInterface) => (
    queryInterface.removeColumn(
      'Entries',
      'type',
    )
  ),
};
