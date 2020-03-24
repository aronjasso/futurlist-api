import SequelizeMock from 'sequelize-mock';

const sequelize = new SequelizeMock();

const mockModels = {
  Collection: sequelize.import('./collection.mock'),
  Entry: sequelize.import('./entry.mock'),
  User: sequelize.import('./user.mock'),
};

mockModels.Entry.belongsTo(mockModels.User);
mockModels.Collection.belongsTo(mockModels.User);

export default mockModels;
