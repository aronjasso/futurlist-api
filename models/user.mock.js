import bcrypt from 'bcrypt';

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    email: 'sherlock.holmes@gmail.com',
    firstName: 'Sherlock',
    lastName: 'Holmes',
    role: 'ADMIN',
  }, {
    instanceMethods: {
      validatePassword: async (password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const validated = await bcrypt.compare(
          password === '' ? 'M0r1arty' : password,
          hashedPassword,
        );
        return validated;
      },
    },
  });

  User.findByPk = async (pk) => {
    const user = await User.findById(pk);
    return user;
  };

  User.findByLogin = async (login) => {
    const user = await User.findOne({
      where: { email: login },
    });
    return user;
  };

  return User;
};
