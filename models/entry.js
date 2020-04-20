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
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['TASK', 'EVENT', 'NOTE'],
      defaultValue: 'TASK',
    },
    priority: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    occursAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {});

  Entry.associate = (models) => {
    Entry.belongsTo(models.User);
  };

  return Entry;
};
