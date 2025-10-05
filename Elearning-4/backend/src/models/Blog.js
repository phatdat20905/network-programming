import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Title must be between 1 and 255 characters'
      }
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      name: 'blogs_slug_unique',
      msg: 'Slug already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Slug cannot be empty'
      }
    }
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Content cannot be empty'
      }
    }
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
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
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
  }
}, {
  tableName: 'blogs',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: (blog) => {
      if (blog.title && !blog.slug) {
        blog.slug = blog.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
      
      // Auto-set published_at if publishing
      if (blog.is_published && !blog.published_at) {
        blog.published_at = new Date();
      }
    }
  }
});

// Instance methods
Blog.prototype.incrementViews = async function() {
  this.view_count += 1;
  await this.save();
};

Blog.prototype.publish = async function() {
  this.is_published = true;
  this.published_at = new Date();
  await this.save();
};

Blog.prototype.unpublish = async function() {
  this.is_published = false;
  this.published_at = null;
  await this.save();
};

export default Blog;