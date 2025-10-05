import { sequelize } from '../config/database.js';

// Import models
import User from './User.js';
import Blog from './Blog.js';
import Category from './Category.js';
import Tag from './Tag.js';
import BlogTag from './BlogTag.js';
import RefreshToken from './RefreshToken.js';

// Gắn sequelize vào model
const models = {
  User: User.init(sequelize),
  Blog: Blog.init(sequelize),
  Category: Category.init(sequelize),
  Tag: Tag.init(sequelize),
  BlogTag: BlogTag.init(sequelize),
  RefreshToken: RefreshToken.init(sequelize),
};

// Associations
if (models.User && models.Blog) {
  models.User.hasMany(models.Blog, {
    foreignKey: 'author_id',
    as: 'blogs',
    onDelete: 'CASCADE'
  });
  models.Blog.belongsTo(models.User, {
    foreignKey: 'author_id',
    as: 'author'
  });
}

if (models.Category && models.Blog) {
  models.Category.hasMany(models.Blog, {
    foreignKey: 'category_id',
    as: 'blogs',
    onDelete: 'SET NULL'
  });
  models.Blog.belongsTo(models.Category, {
    foreignKey: 'category_id',
    as: 'category'
  });
}

if (models.Blog && models.Tag && models.BlogTag) {
  models.Blog.belongsToMany(models.Tag, {
    through: models.BlogTag,
    foreignKey: 'blog_id',
    otherKey: 'tag_id',
    as: 'tags',
    onDelete: 'CASCADE'
  });
  models.Tag.belongsToMany(models.Blog, {
    through: models.BlogTag,
    foreignKey: 'tag_id',
    otherKey: 'blog_id',
    as: 'blogs',
    onDelete: 'CASCADE'
  });
}

if (models.User && models.RefreshToken) {
  models.User.hasMany(models.RefreshToken, {
    foreignKey: 'user_id',
    as: 'refreshTokens',
    onDelete: 'CASCADE'
  });
  models.RefreshToken.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
}

export { sequelize };
export default models;
