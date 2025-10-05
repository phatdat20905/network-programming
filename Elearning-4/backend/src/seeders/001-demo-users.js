import bcrypt from 'bcryptjs';

export default {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Password123', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@blog.com',
        password: hashedPassword,
        full_name: 'Administrator',
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
        full_name: 'John Doe',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'sarahsmith',
        email: 'sarah@example.com',
        password: hashedPassword,
        full_name: 'Sarah Smith',
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};