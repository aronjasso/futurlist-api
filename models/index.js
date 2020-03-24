import dotenv from 'dotenv';
import Sequelize from 'sequelize';

if (process.env.NODE_ENV !== 'production') dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { dialect: 'postgres' },
);
const models = {
  Collection: sequelize.import('./collection'),
  Entry: sequelize.import('./entry'),
  User: sequelize.import('./user'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) models[key].associate(models);
});

export { sequelize };
export default models;
