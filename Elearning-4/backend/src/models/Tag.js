import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      name: 'tags_name_unique',
      msg: 'Tag name already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Tag name cannot be empty'
      },
      len: {
        args: [1, 50],
        msg: 'Tag name must be between 1 and 50 characters'
      }
    }
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      name: 'tags_slug_unique',
      msg: 'Tag slug already exists'
    },
    validate: {
      notEmpty: {
        msg: 'Tag slug cannot be empty'
      }
    }
  }
}, {
  tableName: 'tags',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: (tag) => {
      if (tag.name && !tag.slug) {
        tag.slug = tag.name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
    }
  }
});

export default Tag;