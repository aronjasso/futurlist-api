import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email is required.',
        },
        isEmail: {
          args: true,
          msg: 'Must be a valid email.',
        },
      },
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password is required.',
        },
        len: {
          args: [7, 42],
          msg: 'Password must between 7 to 42 charactors long.',
        },
      },
    },
    role: DataTypes.STRING,
  }, {});

  User.associate = (models) => {
    User.hasMany(models.Entry, { onDelete: 'CASCADE' });
    User.hasMany(models.Collection, { onDelete: 'CASCADE' });
  };

  User.findByLogin = async (login) => {
    const user = await User.findOne({
      where: { email: login },
    });
    return user;
  };

  User.beforeCreate(async (user) => {
    const password = await user.generatePasswordHash();
    return { ...user, password };
  });

  User.prototype.generatePasswordHash = async function genPassHash() {
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(this.password, saltRounds);
    return hashPass;
  };

  User.prototype.validatePassword = async function validatePass(password) {
    const validate = await bcrypt.compare(password, this.password);
    return validate;
  };

  return User;
};
