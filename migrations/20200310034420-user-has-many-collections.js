module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('Collections', 'UserId', {
      type: Sequelize.INTEGER,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    })
  ),
  down: (queryInterface) => (
    queryInterface.removeColumn(
      'Collections',
      'UserId',
    )
  ),
};
