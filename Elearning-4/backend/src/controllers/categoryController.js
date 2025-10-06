import { validationResult } from 'express-validator';
import { Category, Blog } from '../models/index.js';
import apiResponse from '../utils/apiResponse.js';
import { paginate } from '../utils/helpers.js';
import { PAGINATION } from '../config/constants.js';

const categoryController = {
  // Lấy danh sách categories
  getAllCategories: async (req, res) => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        includeBlogs = 'false'
      } = req.query;

      const includeConditions = includeBlogs === 'true' ? [{
        model: Blog,
        as: 'blogs',
        attributes: ['id', 'title', 'slug', 'created_at'],
        where: { is_published: true },
        required: false
      }] : [];

      // Get total count
      const total = await Category.count();

      // Pagination
      const pagination = paginate(page, limit, total);

      // Get categories
      const categories = await Category.findAll({
        include: includeConditions,
        order: [['name', 'ASC']],
        limit: pagination.limit,
        offset: pagination.offset
      });

      apiResponse.paginated(res, 'Categories retrieved successfully', categories, {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: total,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.hasNext,
        hasPrevPage: pagination.hasPrev
      });

    } catch (error) {
      console.error('Get categories error:', error);
      apiResponse.error(res, 'Failed to retrieve categories', 500);
    }
  },

  // Lấy category theo ID
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id, {
        include: [{
          model: Blog,
          as: 'blogs',
          attributes: ['id', 'title', 'slug', 'summary', 'created_at'],
          where: { is_published: true },
          required: false
        }]
      });

      if (!category) {
        return apiResponse.error(res, 'Category not found', 404);
      }

      apiResponse.success(res, 'Category retrieved successfully', { category });

    } catch (error) {
      console.error('Get category error:', error);
      apiResponse.error(res, 'Failed to retrieve category', 500);
    }
  },

  // Tạo category mới (Admin only)
  createCategory: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { name, description } = req.body;

      const category = await Category.create({
        name,
        description
      });

      apiResponse.success(res, 'Category created successfully', { category }, 201);

    } catch (error) {
      console.error('Create category error:', error);
      apiResponse.error(res, 'Failed to create category', 500);
    }
  },

  // Cập nhật category (Admin only)
  updateCategory: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) {
        return apiResponse.error(res, 'Category not found', 404);
      }

      await category.update({
        name: name || category.name,
        description: description !== undefined ? description : category.description
      });

      apiResponse.success(res, 'Category updated successfully', { category });

    } catch (error) {
      console.error('Update category error:', error);
      apiResponse.error(res, 'Failed to update category', 500);
    }
  },

  // Xóa category (Admin only)
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findByPk(id);
      if (!category) {
        return apiResponse.error(res, 'Category not found', 404);
      }

      // Check if category has blogs
      const blogCount = await Blog.count({ where: { category_id: id } });
      if (blogCount > 0) {
        return apiResponse.error(res, 'Cannot delete category with existing blogs', 400);
      }

      await category.destroy();

      apiResponse.success(res, 'Category deleted successfully');

    } catch (error) {
      console.error('Delete category error:', error);
      apiResponse.error(res, 'Failed to delete category', 500);
    }
  }
};

export default categoryController;