import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { User, RefreshToken, sequelize } from '../models/index.js';
import apiResponse from '../utils/apiResponse.js';
import JWTUtils from '../utils/jwt.js';
import { hashPassword, validatePassword, sanitizeUser } from '../utils/helpers.js';

const authController = {
  // Đăng ký user mới
  register: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { username, email, password, full_name } = req.body;

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Tạo user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        full_name
      }, { transaction });

      // Tạo tokens
      const accessToken = JWTUtils.generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      const refreshToken = JWTUtils.generateRefreshToken();
      await JWTUtils.saveRefreshToken(user.id, refreshToken, transaction);

      // Commit transaction
      await transaction.commit();

      apiResponse.success(res, 'User registered successfully', {
        user: sanitizeUser(user),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
        }
      }, 201);

    } catch (error) {
      await transaction.rollback();
      console.error('Register error:', error);
      apiResponse.error(res, 'Registration failed', 500);
    }
  },

  // Đăng nhập
  login: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return apiResponse.error(res, 'Validation failed', 400, errors.array());
      }

      const { email, password } = req.body;

      // Tìm user với email
      const user = await User.findOne({ where: { email } });

      if (!user) {
        await transaction.rollback();
        return apiResponse.error(res, 'Invalid credentials', 401);
      }

      if (!user.is_active) {
        await transaction.rollback();
        return apiResponse.error(res, 'Account is deactivated', 401);
      }

      // Kiểm tra password
      const isValidPassword = await validatePassword(password, user.password);
      if (!isValidPassword) {
        await transaction.rollback();
        return apiResponse.error(res, 'Invalid credentials', 401);
      }

      // Tạo tokens
      const accessToken = JWTUtils.generateAccessToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });

      const refreshToken = JWTUtils.generateRefreshToken();
      await JWTUtils.saveRefreshToken(user.id, refreshToken, transaction);

      // Commit transaction
      await transaction.commit();

      apiResponse.success(res, 'Login successful', {
        user: sanitizeUser(user),
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Login error:', error);
      apiResponse.error(res, 'Login failed', 500);
    }
  },

  // Refresh token endpoint
  refreshToken: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        await transaction.rollback();
        return apiResponse.error(res, 'Refresh token is required', 400);
      }

      // Verify refresh token từ database
      const storedToken = await JWTUtils.verifyRefreshToken(refreshToken);
      
      // Tạo access token mới
      const newAccessToken = JWTUtils.generateAccessToken({
        id: storedToken.user.id,
        username: storedToken.user.username,
        email: storedToken.user.email,
        role: storedToken.user.role
      });

      let newRefreshToken = refreshToken;

      // Token rotation: tạo refresh token mới và revoke token cũ
      if (process.env.ENABLE_TOKEN_ROTATION === 'true') {
        newRefreshToken = JWTUtils.generateRefreshToken();
        
        // Revoke token cũ
        await JWTUtils.revokeRefreshToken(refreshToken);
        
        // Lưu token mới
        await JWTUtils.saveRefreshToken(storedToken.user.id, newRefreshToken, transaction);
      }

      await transaction.commit();

      apiResponse.success(res, 'Token refreshed successfully', {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Refresh token error:', error);
      
      if (error.message.includes('Invalid') || error.message.includes('expired')) {
        return apiResponse.error(res, 'Invalid or expired refresh token', 401);
      }
      
      apiResponse.error(res, 'Token refresh failed', 500);
    }
  },

  // Đăng xuất
  logout: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return apiResponse.error(res, 'Refresh token is required', 400);
      }

      // Revoke refresh token
      await JWTUtils.revokeRefreshToken(refreshToken);

      apiResponse.success(res, 'Logout successful');

    } catch (error) {
      console.error('Logout error:', error);
      
      // Vẫn trả về success nếu token không tìm thấy (có thể đã bị revoke trước đó)
      if (error.message.includes('not found')) {
        return apiResponse.success(res, 'Logout successful');
      }
      
      apiResponse.error(res, 'Logout failed', 500);
    }
  },

  // Đăng xuất toàn bộ devices
  logoutAll: async (req, res) => {
    try {
      await JWTUtils.revokeAllUserTokens(req.user.id);
      
      apiResponse.success(res, 'Logged out from all devices successfully');

    } catch (error) {
      console.error('Logout all error:', error);
      apiResponse.error(res, 'Logout failed', 500);
    }
  },

  // Lấy thông tin user hiện tại
  getMe: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return apiResponse.error(res, 'User not found', 404);
      }

      apiResponse.success(res, 'User data retrieved successfully', { 
        user: sanitizeUser(user) 
      });

    } catch (error) {
      console.error('Get me error:', error);
      apiResponse.error(res, 'Failed to get user data', 500);
    }
  },

  // Lấy danh sách active tokens của user (cho management)
  getMyTokens: async (req, res) => {
    try {
      const tokens = await JWTUtils.getUserActiveTokens(req.user.id);
      
      apiResponse.success(res, 'Active tokens retrieved successfully', { tokens });

    } catch (error) {
      console.error('Get tokens error:', error);
      apiResponse.error(res, 'Failed to get tokens', 500);
    }
  },

  // Revoke specific token (cho user tự quản lý)
  revokeToken: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return apiResponse.error(res, 'Token is required', 400);
      }

      // Verify token thuộc về user này
      const refreshToken = await RefreshToken.findOne({
        where: { 
          token: token,
          user_id: req.user.id
        }
      });

      if (!refreshToken) {
        return apiResponse.error(res, 'Token not found', 404);
      }

      await JWTUtils.revokeRefreshToken(token);

      apiResponse.success(res, 'Token revoked successfully');

    } catch (error) {
      console.error('Revoke token error:', error);
      apiResponse.error(res, 'Failed to revoke token', 500);
    }
  }
};

export default authController;