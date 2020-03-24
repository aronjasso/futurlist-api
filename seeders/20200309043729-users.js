module.exports = {
  up: (queryInterface) => {
    queryInterface.bulkInsert('Users', [{
      firstName: 'Aron',
      lastName: 'Jasso',
      email: 'aron.jasso@gmail.com',
      password: '$2b$10$Tb.6iAKftFTg0NLpf1CZteWAMVPo192OO4tPky1wwjF.RmwjWGYE2',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'ADMIN',
    }, {
      firstName: 'Sarah',
      lastName: 'Mack',
      email: 'retrogirl1990@gmail.com',
      password: '$2b$10$Tb.6iAKftFTg0NLpf1CZteWAMVPo192OO4tPky1wwjF.RmwjWGYE2',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'DEFAULT',
    }], {});
  },
  down: (queryInterface) => {
    queryInterface.bulkDelete('Users', null, {});
  },
};
