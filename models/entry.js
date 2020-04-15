module.exports = (sequelize, DataTypes) => {
  const Entry = sequelize.define('Entry', {
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    occursAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
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
      values: ['TASK', 'EVENT', 'NOTE'],
      defaultValue: 'TASK',
    },
  }, {});

  Entry.associate = (models) => {
    Entry.belongsTo(models.User);
  };

  return Entry;
};
