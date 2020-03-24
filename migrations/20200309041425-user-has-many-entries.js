module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Entries', 'UserId', {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })
  ),
  down: (queryInterface) => (
    queryInterface.removeColumn(
      'Entries',
      'UserId',
    )
  ),
};
