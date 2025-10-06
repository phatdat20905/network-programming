// models/index.js
import { sequelize } from '../config/database.js';

// Import models (chúng đã được định nghĩa bằng sequelize.define)
import User from './User.js';
import Blog from './Blog.js';
import Category from './Category.js';
import Tag from './Tag.js';
import BlogTag from './BlogTag.js';
import RefreshToken from './RefreshToken.js';

// Thiết lập quan hệ giữa các model

// 1️⃣ User - Blog (1-N)
User.hasMany(Blog, {
  foreignKey: 'author_id',
  as: 'blogs',
  onDelete: 'CASCADE'
});
Blog.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

// 2️⃣ Category - Blog (1-N)
Category.hasMany(Blog, {
  foreignKey: 'category_id',
  as: 'blogs',
  onDelete: 'SET NULL'
});
Blog.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// 3️⃣ Blog - Tag (N-N) qua BlogTag
Blog.belongsToMany(Tag, {
  through: BlogTag,
  foreignKey: 'blog_id',
  otherKey: 'tag_id',
  as: 'tags',
  onDelete: 'CASCADE'
});
Tag.belongsToMany(Blog, {
  through: BlogTag,
  foreignKey: 'tag_id',
  otherKey: 'blog_id',
  as: 'blogs',
  onDelete: 'CASCADE'
});

// 4️⃣ User - RefreshToken (1-N)
User.hasMany(RefreshToken, {
  foreignKey: 'user_id',
  as: 'refreshTokens',
  onDelete: 'CASCADE'
});
RefreshToken.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// ✅ Export tất cả models
export {
  sequelize,
  User,
  Blog,
  Category,
  Tag,
  BlogTag,
  RefreshToken
};

// ✅ Xuất mặc định object models
export default {
  sequelize,
  User,
  Blog,
  Category,
  Tag,
  BlogTag,
  RefreshToken
};
