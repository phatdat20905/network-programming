import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Blog, User, Category, Tag, sequelize } from '../models/index.js';
import apiResponse from '../utils/apiResponse.js';
import { paginate, generateSlug } from '../utils/helpers.js';
import { PAGINATION } from '../config/constants.js';

const blogController = {
  // Lấy danh sách blog với phân trang, tìm kiếm, sắp xếp
  getAllBlogs: async (req, res) => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search = '',
        category = '',
        author = '',
        sortBy = 'created_at',
        sortOrder = 'DESC',
        publishedOnly = 'true'
      } = req.query;

      // Build where condition
      const whereCondition = {};
      
      if (publishedOnly === 'true') {
        whereCondition.is_published = true;
      }

      if (search) {
        whereCondition[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { summary: { [Op.like]: `%${search}%` } },
          { content: { [Op.like]: `%${search}%` } }
        ];
      }

      // Build include conditions
      const includeConditions = [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'full_name', 'avatar'],
          where: author ? { username: author } : {}
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
          where: category ? { slug: category } : {}
        }
      ].filter(include => !(include.where && Object.keys(include.where).length === 0));

      // Get total count
      const total = await Blog.count({
        where: whereCondition,
        include: includeConditions,
        distinct: true
      });

      // Pagination
      const pagination = paginate(page, limit, total);

      // Get blogs
      const blogs = await Blog.findAll({
        where: whereCondition,
        include: includeConditions,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: pagination.limit,
        offset: pagination.offset,
        distinct: true
      });

      apiResponse.paginated(res, 'Blogs retrieved successfully', blogs, {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: total,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.hasNext,
        hasPrevPage: pagination.hasPrev
      });

    } catch (error) {
      console.error('Get blogs error:', error);
      apiResponse.error(res, 'Failed to retrieve blogs', 500);
    }
  },

  // Lấy blog theo ID
  getBlogById: async (req, res) => {
    try {
      const { id } = req.params;

      const blog = await Blog.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'full_name', 'avatar']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug', 'description']
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] },
            attributes: ['id', 'name', 'slug']
          }
        ]
      });

      if (!blog) {
        return apiResponse.error(res, 'Blog not found', 404);
      }

      // Tăng view count nếu published và không phải author
      if (blog.is_published && (!req.user || blog.author_id !== req.user.id)) {
        await blog.incrementViews();
      }

      apiResponse.success(res, 'Blog retrieved successfully', { blog });

    } catch (error) {
      console.error('Get blog error:', error);
      apiResponse.error(res, 'Failed to retrieve blog', 500);
    }
  },

  // Lấy blog theo slug
  getBlogBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      const blog = await Blog.findOne({
        where: { slug },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'full_name', 'avatar']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug', 'description']
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] },
            attributes: ['id', 'name', 'slug']
          }
        ]
      });

      if (!blog) {
        return apiResponse.error(res, 'Blog not found', 404);
      }

      // Tăng view count nếu published và không phải author
      if (blog.is_published && (!req.user || blog.author_id !== req.user.id)) {
        await blog.incrementViews();
      }

      apiResponse.success(res, 'Blog retrieved successfully', { blog });

    } catch (error) {
      console.error('Get blog by slug error:', error);
      apiResponse.error(res, 'Failed to retrieve blog', 500);
    }
  },

  // Tạo blog mới
  createBlog: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const {
        title,
        summary,
        content,
        category_id,
        tags = [],
        is_published = false
      } = req.body;

      // Tạo slug từ title
      const slug = generateSlug(title);

      const blogData = {
        title,
        slug,
        summary,
        content,
        category_id: category_id || null,
        author_id: req.user.id,
        is_published,
        featured_image: req.file ? `/uploads/${req.file.filename}` : null,
        published_at: is_published ? new Date() : null
      };

      const blog = await Blog.create(blogData, { transaction });

      // Xử lý tags nếu có
      if (tags.length > 0) {
        // Ở đây bạn có thể thêm logic xử lý tags
        console.log('Tags to be processed:', tags);
      }

      await transaction.commit();

      const newBlog = await Blog.findByPk(blog.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'full_name', 'avatar']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          }
        ]
      });

      apiResponse.success(res, 'Blog created successfully', { blog: newBlog }, 201);

    } catch (error) {
      await transaction.rollback();
      console.error('Create blog error:', error);
      apiResponse.error(res, 'Failed to create blog', 500);
    }
  },

  // Cập nhật blog
  updateBlog: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const {
        title,
        summary,
        content,
        category_id,
        tags = [],
        is_published
      } = req.body;

      const blog = await Blog.findByPk(id);
      if (!blog) {
        await transaction.rollback();
        return apiResponse.error(res, 'Blog not found', 404);
      }

      // Cập nhật dữ liệu
      if (title) {
        blog.title = title;
        blog.slug = generateSlug(title);
      }

      if (summary !== undefined) blog.summary = summary;
      if (content !== undefined) blog.content = content;
      if (category_id !== undefined) blog.category_id = category_id;
      
      if (is_published !== undefined) {
        blog.is_published = is_published;
        if (is_published && !blog.published_at) {
          blog.published_at = new Date();
        } else if (!is_published) {
          blog.published_at = null;
        }
      }

      if (req.file) {
        blog.featured_image = `/uploads/${req.file.filename}`;
      }

      await blog.save({ transaction });
      await transaction.commit();

      const updatedBlog = await Blog.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'full_name', 'avatar']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'slug']
          }
        ]
      });

      apiResponse.success(res, 'Blog updated successfully', { blog: updatedBlog });

    } catch (error) {
      await transaction.rollback();
      console.error('Update blog error:', error);
      apiResponse.error(res, 'Failed to update blog', 500);
    }
  },

  // Xóa blog
  deleteBlog: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      const blog = await Blog.findByPk(id);
      if (!blog) {
        await transaction.rollback();
        return apiResponse.error(res, 'Blog not found', 404);
      }

      await blog.destroy({ transaction });
      await transaction.commit();

      apiResponse.success(res, 'Blog deleted successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('Delete blog error:', error);
      apiResponse.error(res, 'Failed to delete blog', 500);
    }
  },

  // Lấy blog của user hiện tại
  getMyBlogs: async (req, res) => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search = '',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      const whereCondition = {
        author_id: req.user.id
      };

      if (search) {
        whereCondition[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { summary: { [Op.like]: `%${search}%` } }
        ];
      }

      const includeConditions = [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ];

      // Get total count
      const total = await Blog.count({
        where: whereCondition,
        include: includeConditions,
        distinct: true
      });

      // Pagination
      const pagination = paginate(page, limit, total);

      // Get blogs
      const blogs = await Blog.findAll({
        where: whereCondition,
        include: includeConditions,
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: pagination.limit,
        offset: pagination.offset,
        distinct: true
      });

      apiResponse.paginated(res, 'Your blogs retrieved successfully', blogs, {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: total,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.hasNext,
        hasPrevPage: pagination.hasPrev
      });

    } catch (error) {
      console.error('Get my blogs error:', error);
      apiResponse.error(res, 'Failed to retrieve your blogs', 500);
    }
  }
};

export default blogController;