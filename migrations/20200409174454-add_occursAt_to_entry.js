module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Entries', 'occursAt', {
      type: Sequelize.DATE,
      allowNull: true,
    })
  ),
  down: (queryInterface) => (
    queryInterface.removeColumn(
      'Entries',
      'occursAt',
    )
  ),
};
