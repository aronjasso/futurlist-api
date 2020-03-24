module.exports = (sequelize) => {
  const Entry = sequelize.define('Entry', {
    title: 'Entry Title',
    type: 'TASK',
    UserId: 1,
  }, {});

  Entry.findByPk = async (pk) => {
    const entry = await Entry.findById(pk, { raw: true });
    return entry;
  };

  Entry.associate = (models) => {
    Entry.belongsTo(models.User);
  };

  return Entry;
};
