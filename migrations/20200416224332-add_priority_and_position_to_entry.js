module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('Entries', 'priority', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
      await queryInterface.addColumn('Entries', 'position', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('Entries', 'priority');
      await queryInterface.removeColumn('Entries', 'position');
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
