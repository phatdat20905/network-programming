export async function up(queryInterface) {
  await queryInterface.bulkInsert('tags', [
    { name: 'JavaScript', slug: 'javascript', created_at: new Date(), updated_at: new Date() },
    { name: 'NodeJS', slug: 'nodejs', created_at: new Date(), updated_at: new Date() },
    { name: 'React', slug: 'react', created_at: new Date(), updated_at: new Date() }
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('tags', null, {});
}
