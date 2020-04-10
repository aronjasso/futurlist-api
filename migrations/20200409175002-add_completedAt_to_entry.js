module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Entries', 'completedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  ),
  down: (queryInterface) => (
    queryInterface.removeColumn(
      'Entries',
      'completedAt',
    )
  ),
};
