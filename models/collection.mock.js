module.exports = (sequelize) => {
  const Collection = sequelize.define('Collection', {
    name: 'Tasks',
    UserId: 1,
  }, {});

  Collection.findByPk = async (pk) => {
    const collection = await Collection.findById(pk);
    return collection;
  };

  return Collection;
};
