import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const BlogTag = sequelize.define('BlogTag', {
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
    }
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id'
    }
  }
}, {
  tableName: 'blog_tags',
  timestamps: false,
  underscored: true
});

export default BlogTag;