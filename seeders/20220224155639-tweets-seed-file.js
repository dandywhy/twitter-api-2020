'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Tweets',
      Array.from({ length: users.length*10 }, (_,i) => ({
        description: faker.lorem.text(140),
        createdAt: new Date(),
        updatedAt: new Date(),
        UserId: users[Math.floor(i/10)].id,
        replyCount: 3,
        likeCount: 0
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tweets', null, {})
  }
}