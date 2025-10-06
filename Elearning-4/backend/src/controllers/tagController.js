import { validationResult } from 'express-validator';
import { Tag, Blog, BlogTag } from '../models/index.js';
import apiResponse from '../utils/apiResponse.js';
import { paginate, generateSlug } from '../utils/helpers.js';
import { PAGINATION } from '../config/constants.js';

const tagController = {
  // Lấy danh sách tags với phân trang
  getAllTags: async (req, res) => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search = '',
        sortBy = 'name',
        sortOrder = 'ASC',
        includeBlogs = 'false'
      } = req.query;

      // Build where condition
      const whereCondition = {};
      if (search) {
        whereCondition.name = { [require('sequelize').Op.like]: `%${search}%` };
      }

      // Build include conditions
      const includeConditions = includeBlogs === 'true' ? [{
        model: Blog,
        as: 'blogs',
        through: { attributes: [] },
        attributes: ['id', 'title', 'slug', 'created_at'],
        where: { is_published: true },
        required: false
      }] : [];

      // Get total count
      const total = await Tag.count({ where: whereCondition });

      // Pagination
      const pagination = paginate(page, limit, total);

      // Get tags
      const tags = await Tag.findAll({
        where: whereCondition,
        include: includeConditions,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: pagination.limit,
        offset: pagination.offset
      });

      apiResponse.paginated(res, 'Tags retrieved successfully', tags, {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: total,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.hasNext,
        hasPrevPage: pagination.hasPrev
      });

    } catch (error) {
      console.error('Get tags error:', error);
      apiResponse.error(res, 'Failed to retrieve tags', 500);
    }
  },

  // Lấy tag theo ID
  getTagById: async (req, res) => {
    try {
      const { id } = req.params;

      const tag = await Tag.findByPk(id, {
        include: [{
          model: Blog,
          as: 'blogs',
          through: { attributes: [] },
          attributes: ['id', 'title', 'slug', 'summary', 'created_at'],
          where: { is_published: true },
          required: false
        }]
      });

      if (!tag) {
        return apiResponse.error(res, 'Tag not found', 404);
      }

      apiResponse.success(res, 'Tag retrieved successfully', { tag });

    } catch (error) {
      console.error('Get tag error:', error);
      apiResponse.error(res, 'Failed to retrieve tag', 500);
    }
  },

  // Lấy tag theo slug
  getTagBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      const tag = await Tag.findOne({
        where: { slug },
        include: [{
          model: Blog,
          as: 'blogs',
          through: { attributes: [] },
          attributes: ['id', 'title', 'slug', 'summary', 'created_at'],
          where: { is_published: true },
          required: false
        }]
      });

      if (!tag) {
        return apiResponse.error(res, 'Tag not found', 404);
      }

      apiResponse.success(res, 'Tag retrieved successfully', { tag });

    } catch (error) {
      console.error('Get tag by slug error:', error);
      apiResponse.error(res, 'Failed to retrieve tag', 500);
    }
  },

  // Tạo tag mới (Admin only)
  createTag: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { name } = req.body;

      // Check if tag already exists
      const existingTag = await Tag.findOne({ 
        where: { 
          [require('sequelize').Op.or]: [
            { name },
            { slug: generateSlug(name) }
          ]
        } 
      });

      if (existingTag) {
        return apiResponse.error(res, 'Tag with this name already exists', 400);
      }

      const tag = await Tag.create({ name });

      apiResponse.success(res, 'Tag created successfully', { tag }, 201);

    } catch (error) {
      console.error('Create tag error:', error);
      apiResponse.error(res, 'Failed to create tag', 500);
    }
  },

  // Cập nhật tag (Admin only)
  updateTag: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const { name } = req.body;

      const tag = await Tag.findByPk(id);
      if (!tag) {
        return apiResponse.error(res, 'Tag not found', 404);
      }

      // Check if new name conflicts with existing tag
      if (name && name !== tag.name) {
        const existingTag = await Tag.findOne({ 
          where: { 
            name,
            id: { [require('sequelize').Op.ne]: id }
          } 
        });

        if (existingTag) {
          return apiResponse.error(res, 'Tag with this name already exists', 400);
        }
      }

      await tag.update({
        name: name || tag.name
      });

      apiResponse.success(res, 'Tag updated successfully', { tag });

    } catch (error) {
      console.error('Update tag error:', error);
      apiResponse.error(res, 'Failed to update tag', 500);
    }
  },

  // Xóa tag (Admin only)
  deleteTag: async (req, res) => {
    try {
      const { id } = req.params;

      const tag = await Tag.findByPk(id);
      if (!tag) {
        return apiResponse.error(res, 'Tag not found', 404);
      }

      // Check if tag has associated blogs
      const blogCount = await BlogTag.count({ where: { tag_id: id } });
      if (blogCount > 0) {
        return apiResponse.error(res, 'Cannot delete tag with associated blogs. Please remove tag from blogs first.', 400);
      }

      await tag.destroy();

      apiResponse.success(res, 'Tag deleted successfully');

    } catch (error) {
      console.error('Delete tag error:', error);
      apiResponse.error(res, 'Failed to delete tag', 500);
    }
  },

  // Thêm tags vào blog
  addTagsToBlog: async (req, res) => {
    try {
      const { blogId } = req.params;
      const { tags } = req.body; // Array of tag names or IDs

      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return apiResponse.error(res, 'Tags array is required', 400);
      }

      const blog = await Blog.findByPk(blogId);
      if (!blog) {
        return apiResponse.error(res, 'Blog not found', 404);
      }

      // Check ownership or admin role
      if (blog.author_id !== req.user.id && req.user.role !== 'admin') {
        return apiResponse.error(res, 'Access denied', 403);
      }

      const tagInstances = [];
      
      // Process each tag
      for (const tagName of tags) {
        let tag;
        
        // Check if tag exists by name
        tag = await Tag.findOne({ where: { name: tagName } });
        
        // If not exists, create new tag
        if (!tag) {
          tag = await Tag.create({ name: tagName });
        }
        
        tagInstances.push(tag);
      }

      // Add tags to blog
      await blog.addTags(tagInstances);

      // Get updated blog with tags
      const updatedBlog = await Blog.findByPk(blogId, {
        include: [{
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug']
        }]
      });

      apiResponse.success(res, 'Tags added to blog successfully', { blog: updatedBlog });

    } catch (error) {
      console.error('Add tags to blog error:', error);
      apiResponse.error(res, 'Failed to add tags to blog', 500);
    }
  },

  // Xóa tag khỏi blog
  removeTagFromBlog: async (req, res) => {
    try {
      const { blogId, tagId } = req.params;

      const blog = await Blog.findByPk(blogId);
      if (!blog) {
        return apiResponse.error(res, 'Blog not found', 404);
      }

      const tag = await Tag.findByPk(tagId);
      if (!tag) {
        return apiResponse.error(res, 'Tag not found', 404);
      }

      // Check ownership or admin role
      if (blog.author_id !== req.user.id && req.user.role !== 'admin') {
        return apiResponse.error(res, 'Access denied', 403);
      }

      // Remove tag from blog
      await blog.removeTag(tag);

      // Get updated blog with tags
      const updatedBlog = await Blog.findByPk(blogId, {
        include: [{
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug']
        }]
      });

      apiResponse.success(res, 'Tag removed from blog successfully', { blog: updatedBlog });

    } catch (error) {
      console.error('Remove tag from blog error:', error);
      apiResponse.error(res, 'Failed to remove tag from blog', 500);
    }
  }
};

export default tagController;