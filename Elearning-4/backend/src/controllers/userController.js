import { validationResult } from 'express-validator';
import { User, Blog, RefreshToken } from '../models/index.js';
import apiResponse from '../utils/apiResponse.js';
import { paginate, sanitizeUser } from '../utils/helpers.js';
import { PAGINATION, USER_ROLES } from '../config/constants.js';
import JWTUtils from '../utils/jwt.js';

const userController = {
  // Lấy danh sách users (Admin only)
  getAllUsers: async (req, res) => {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        search = '',
        role = '',
        is_active = '',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;

      // Build where condition
      const whereCondition = {};
      
      if (search) {
        whereCondition[require('sequelize').Op.or] = [
          { username: { [require('sequelize').Op.like]: `%${search}%` } },
          { email: { [require('sequelize').Op.like]: `%${search}%` } },
          { full_name: { [require('sequelize').Op.like]: `%${search}%` } }
        ];
      }

      if (role) {
        whereCondition.role = role;
      }

      if (is_active !== '') {
        whereCondition.is_active = is_active === 'true';
      }

      // Get total count
      const total = await User.count({ where: whereCondition });

      // Pagination
      const pagination = paginate(page, limit, total);

      // Get users
      const users = await User.findAll({
        where: whereCondition,
        attributes: { exclude: ['password'] },
        order: [[sortBy, sortOrder.toUpperCase()]],
        limit: pagination.limit,
        offset: pagination.offset
      });

      apiResponse.paginated(res, 'Users retrieved successfully', users, {
        currentPage: pagination.page,
        totalPages: pagination.totalPages,
        totalItems: total,
        itemsPerPage: pagination.limit,
        hasNextPage: pagination.hasNext,
        hasPrevPage: pagination.hasPrev
      });

    } catch (error) {
      console.error('Get users error:', error);
      apiResponse.error(res, 'Failed to retrieve users', 500);
    }
  },

  // Lấy user theo ID (Admin only)
  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Blog,
          as: 'blogs',
          attributes: ['id', 'title', 'slug', 'is_published', 'created_at'],
          required: false
        }]
      });

      if (!user) {
        return apiResponse.error(res, 'User not found', 404);
      }

      apiResponse.success(res, 'User retrieved successfully', { user });

    } catch (error) {
      console.error('Get user error:', error);
      apiResponse.error(res, 'Failed to retrieve user', 500);
    }
  },

  // Cập nhật user (Admin only)
  updateUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { id } = req.params;
      const { username, email, full_name, role, is_active } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return apiResponse.error(res, 'User not found', 404);
      }

      // Check if username/email already exists (excluding current user)
      if (username && username !== user.username) {
        const existingUser = await User.findOne({ 
          where: { 
            username,
            id: { [require('sequelize').Op.ne]: id }
          } 
        });

        if (existingUser) {
          return apiResponse.error(res, 'Username already exists', 400);
        }
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ 
          where: { 
            email,
            id: { [require('sequelize').Op.ne]: id }
          } 
        });

        if (existingUser) {
          return apiResponse.error(res, 'Email already exists', 400);
        }
      }

      // Update user
      const updateData = {};
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (full_name !== undefined) updateData.full_name = full_name;
      if (role !== undefined) updateData.role = role;
      if (is_active !== undefined) updateData.is_active = is_active;

      await user.update(updateData);

      apiResponse.success(res, 'User updated successfully', { 
        user: sanitizeUser(user) 
      });

    } catch (error) {
      console.error('Update user error:', error);
      apiResponse.error(res, 'Failed to update user', 500);
    }
  },

  // Xóa user (Admin only)
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (parseInt(id) === req.user.id) {
        return apiResponse.error(res, 'Cannot delete your own account', 400);
      }

      const user = await User.findByPk(id);
      if (!user) {
        return apiResponse.error(res, 'User not found', 404);
      }

      // Revoke all user's refresh tokens
      await JWTUtils.revokeAllUserTokens(id);

      // Delete user (cascade will handle blogs and refresh tokens)
      await user.destroy();

      apiResponse.success(res, 'User deleted successfully');

    } catch (error) {
      console.error('Delete user error:', error);
      apiResponse.error(res, 'Failed to delete user', 500);
    }
  },

  // Kích hoạt/deactivate user (Admin only)
  toggleUserActive: async (req, res) => {
    try {
      const { id } = req.params;
      const { is_active } = req.body;

      if (typeof is_active !== 'boolean') {
        return apiResponse.error(res, 'is_active must be a boolean', 400);
      }

      // Prevent admin from deactivating themselves
      if (parseInt(id) === req.user.id && !is_active) {
        return apiResponse.error(res, 'Cannot deactivate your own account', 400);
      }

      const user = await User.findByPk(id);
      if (!user) {
        return apiResponse.error(res, 'User not found', 404);
      }

      await user.update({ is_active });

      // If deactivating, revoke all user's refresh tokens
      if (!is_active) {
        await JWTUtils.revokeAllUserTokens(id);
      }

      apiResponse.success(res, `User ${is_active ? 'activated' : 'deactivated'} successfully`, { 
        user: sanitizeUser(user) 
      });

    } catch (error) {
      console.error('Toggle user active error:', error);
      apiResponse.error(res, 'Failed to update user status', 500);
    }
  },

  // Thay đổi role user (Admin only)
  changeUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (![USER_ROLES.ADMIN, USER_ROLES.USER].includes(role)) {
        return apiResponse.error(res, 'Invalid role', 400);
      }

      // Prevent admin from changing their own role
      if (parseInt(id) === req.user.id) {
        return apiResponse.error(res, 'Cannot change your own role', 400);
      }

      const user = await User.findByPk(id);
      if (!user) {
        return apiResponse.error(res, 'User not found', 404);
      }

      await user.update({ role });

      apiResponse.success(res, `User role updated to ${role} successfully`, { 
        user: sanitizeUser(user) 
      });

    } catch (error) {
      console.error('Change user role error:', error);
      apiResponse.error(res, 'Failed to change user role', 500);
    }
  },

  // Lấy user statistics (Admin only)
  getUserStats: async (req, res) => {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { is_active: true } });
      const adminUsers = await User.count({ where: { role: USER_ROLES.ADMIN } });
      const recentUsers = await User.count({
        where: {
          created_at: {
            [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      });

      const stats = {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers,
        recentUsers
      };

      apiResponse.success(res, 'User statistics retrieved successfully', { stats });

    } catch (error) {
      console.error('Get user stats error:', error);
      apiResponse.error(res, 'Failed to retrieve user statistics', 500);
    }
  }
};

export default userController;