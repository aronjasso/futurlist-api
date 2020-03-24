module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define('Collection', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name is required.',
        },
      },
    },
  }, {});

  Collection.associate = (models) => {
    Collection.belongsTo(models.User);
  };

  return Collection;
};
