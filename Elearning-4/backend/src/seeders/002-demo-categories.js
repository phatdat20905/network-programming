export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Articles about technology and programming',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Lifestyle and personal development',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Travel',
        slug: 'travel',
        description: 'Travel experiences and guides',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Food',
        slug: 'food',
        description: 'Recipes and food reviews',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};