module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Entries', 'body', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  ),
  down: (queryInterface) => (
    queryInterface.removeColumn(
      'Entries',
      'body',
    )
  ),
};
