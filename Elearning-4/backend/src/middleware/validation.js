import { body, param, query } from 'express-validator';
import { User } from '../models/index.js';
import { USER_ROLES } from '../config/constants.js';

export const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores')
    .custom(async (username) => {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('Username already exists');
      }
    }),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
    .custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already exists');
      }
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter and one number'),
  body('full_name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Full name must not exceed 100 characters')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const blogValidation = [
  body('title')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('summary')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Summary must not exceed 500 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('category_id')
    .optional()
    .isInt()
    .withMessage('Category ID must be an integer'),
  body('is_published')
    .optional()
    .isBoolean()
    .withMessage('is_published must be a boolean')
];

export const idParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export const logoutValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

export const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

export const tagValidation = [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Tag name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Tag name can only contain letters, numbers and spaces')
];

export const userUpdateValidation = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers and underscores'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('full_name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Full name must not exceed 100 characters'),
  body('role')
    .optional()
    .isIn([USER_ROLES.ADMIN, USER_ROLES.USER])
    .withMessage('Role must be either admin or user'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

export const userRoleValidation = [
  body('role')
    .isIn([USER_ROLES.ADMIN, USER_ROLES.USER])
    .withMessage('Role must be either admin or user')
];

export const userActiveValidation = [
  body('is_active')
    .isBoolean()
    .withMessage('is_active must be a boolean')
];

export const blogTagsValidation = [
  body('tags')
    .isArray({ min: 1 })
    .withMessage('Tags must be a non-empty array'),
  body('tags.*')
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Tag names can only contain letters, numbers and spaces')
];