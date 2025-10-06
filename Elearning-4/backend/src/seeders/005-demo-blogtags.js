export async function up(queryInterface) {
  await queryInterface.bulkInsert('blog_tags', [
    { blog_id: 1, tag_id: 1 },
    { blog_id: 1, tag_id: 2 },
    { blog_id: 2, tag_id: 3 }
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('blog_tags', null, {});
}
