import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blog_tags', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'blogs',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.addIndex('blog_tags', ['blog_id', 'tag_id'], {
      unique: true,
      name: 'blog_tags_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blog_tags');
  }
};