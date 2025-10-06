import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Op } from 'sequelize';
import { RefreshToken, User } from '../models/index.js';

class JWTUtils {
  // Generate access token (short-lived)
  static generateAccessToken(payload) {
    return jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
        issuer: 'blog-app',
        audience: 'blog-app-users'
      }
    );
  }

  // Generate refresh token (long-lived) - random string
  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  // Verify access token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  // Calculate refresh token expiration
  static getRefreshTokenExpiry() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 
      parseInt(process.env.JWT_REFRESH_EXPIRE_DAYS || '7'));
    return expiresAt;
  }

  // Save refresh token to database
  static async saveRefreshToken(userId, token, transaction = null) {
    const expiresAt = this.getRefreshTokenExpiry();

    // Optional: Revoke all existing tokens for this user for better security
    if (process.env.ENABLE_TOKEN_ROTATION === 'true') {
      await RefreshToken.update(
        { is_revoked: true },
        { 
          where: { 
            user_id: userId, 
            is_revoked: false 
          },
          transaction
        }
      );
    }

    return await RefreshToken.create({
      user_id: userId,
      token: token,
      expires_at: expiresAt
    }, { transaction });
  }

  // Verify refresh token from database
  static async verifyRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({
      where: { 
        token: token,
        is_revoked: false,
        expires_at: { 
          [Op.gt]: new Date() 
        }
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'role', 'is_active']
      }]
    });

    if (!refreshToken) {
      throw new Error('Invalid or expired refresh token');
    }

    if (!refreshToken.user || !refreshToken.user.is_active) {
      await this.revokeRefreshToken(token);
      throw new Error('User account is inactive');
    }

    return refreshToken;
  }

  // Revoke specific refresh token
  static async revokeRefreshToken(token) {
    const result = await RefreshToken.update(
      { is_revoked: true },
      { where: { token: token } }
    );
    
    if (result[0] === 0) {
      throw new Error('Refresh token not found');
    }
  }

  // Revoke all refresh tokens for user
  static async revokeAllUserTokens(userId) {
    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: userId } }
    );
  }

  // Get active tokens for user (for management)
  static async getUserActiveTokens(userId) {
    return await RefreshToken.findAll({
      where: { 
        user_id: userId,
        is_revoked: false,
        expires_at: { 
          [Op.gt]: new Date() 
        }
      },
      order: [['created_at', 'DESC']]
    });
  }

  // Clean up expired tokens (cron job)
  static async cleanupExpiredTokens() {
    const result = await RefreshToken.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date()
        }
      }
    });
    return result;
  }
}

export default JWTUtils;