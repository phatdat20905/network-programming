import { DataTypes } from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      content: {
        type: DataTypes.TEXT('long'),
        allowNull: false
      },
      featured_image: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('blogs', ['author_id']);
    await queryInterface.addIndex('blogs', ['category_id']);
    await queryInterface.addIndex('blogs', ['slug']);
    await queryInterface.addIndex('blogs', ['is_published', 'published_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blogs');
  }
};