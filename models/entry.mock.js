module.exports = (sequelize) => {
  const Entry = sequelize.define('Entry', {
    title: 'Entry Title',
    type: 'TASK',
    body: 'Description of task.',
    priority: true,
    position: 0,
    occursAt: null,
    completedAt: null,
    UserId: 1,
  }, {});

  Entry.findByPk = async (pk) => {
    if (parseInt(pk, 10) === 0) return Promise.resolve(null);
    const entry = await Entry.findById(pk, { raw: true });
    return entry;
  };

  Entry.destroy = ({ where: { id } }) => {
    const affectedRows = parseInt(id, 10) === 0 ? 0 : 1;
    return Promise.resolve(affectedRows);
  };

  Entry.associate = (models) => {
    Entry.belongsTo(models.User);
  };

  return Entry;
};
