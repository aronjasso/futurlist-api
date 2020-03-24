module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define('Entry', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Title is required.',
        },
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: ['TASK', 'EVENT', 'NOTE', 'THOUGHT'],
      defaultValue: 'TASK',
    },
  }, {});

  Entry.associate = (models) => {
    Entry.belongsTo(models.User);
  };

  return Entry;
};
