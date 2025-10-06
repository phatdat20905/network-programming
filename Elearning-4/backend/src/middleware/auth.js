import JWTUtils from '../utils/jwt.js';
import apiResponse from '../utils/apiResponse.js';

const authMiddleware = {
  // Xác thực JWT access token
  authenticate: async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return apiResponse.error(res, 'Access denied. No token provided.', 401);
      }

      const token = authHeader.replace('Bearer ', '');
      
      const decoded = JWTUtils.verifyAccessToken(token);
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      
      if (error.message.includes('expired')) {
        return apiResponse.error(res, 'Access token expired', 401);
      } else if (error.message.includes('Invalid')) {
        return apiResponse.error(res, 'Invalid access token', 401);
      } else {
        return apiResponse.error(res, 'Authentication failed', 401);
      }
    }
  },

  // Phân quyền admin
  authorizeAdmin: (req, res, next) => {
    if (req.user.role !== 'admin') {
      return apiResponse.error(res, 'Admin access required', 403);
    }
    next();
  },

  // Kiểm tra quyền sở hữu
  checkOwnership: (model, idField = 'id') => {
    return async (req, res, next) => {
      try {
        const resourceId = req.params[idField];
        const resource = await model.findByPk(resourceId);
        
        if (!resource) {
          return apiResponse.error(res, 'Resource not found', 404);
        }

        // Kiểm tra nếu user là owner hoặc admin
        const ownerId = resource.author_id || resource.user_id;
        if (ownerId !== req.user.id && req.user.role !== 'admin') {
          return apiResponse.error(res, 'Access denied. You are not the owner of this resource.', 403);
        }

        req.resource = resource;
        next();
      } catch (error) {
        console.error('Ownership check error:', error);
        return apiResponse.error(res, 'Server error during ownership check', 500);
      }
    };
  },

  // Optional authentication (không bắt buộc đăng nhập)
  optionalAuth: async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        const decoded = JWTUtils.verifyAccessToken(token);
        req.user = decoded;
      }
      
      next();
    } catch (error) {
      // Nếu token không hợp lệ, vẫn tiếp tục mà không có user
      next();
    }
  }
};

export default authMiddleware;