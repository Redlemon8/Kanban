import { User, RefreshToken } from "../models/association.js";
import { notFound } from "../utils/error.js";
import { Op } from 'sequelize';

const authService = {
  async generateTokens(user) {
    const accessToken = user.generateAccessToken();
    
    const refreshTokenData = RefreshToken.generateToken(user.id);
    const refreshToken = await RefreshToken.create(refreshTokenData);

    return {
      accessToken,
      refreshToken: refreshToken.token,
      expiresIn: 15 * 60,
    };
  },

  async refreshAccessToken(refreshTokenValue) {
    const refreshToken = await RefreshToken.findOne({
      where: { 
        token: refreshTokenValue,
        isRevoked: false
      },
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    if (refreshToken.isExpired()) {
      await refreshToken.revoke();
      throw new Error('Refresh token expired');
    }

    const user = refreshToken.user;
    if (!user) {
      throw new Error('User not found');
    }

    await refreshToken.revoke();

    return this.generateTokens(user);
  },

  async revokeRefreshToken(refreshTokenValue) {
    const refreshToken = await RefreshToken.findOne({
      where: { 
        token: refreshTokenValue,
        isRevoked: false
      }
    });

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    await refreshToken.revoke();
    return true;
  },

  async revokeAllUserTokens(userId) {
    await RefreshToken.update(
      { isRevoked: true },
      { 
        where: { 
          userId,
          isRevoked: false
        }
      }
    );
    return true;
  },

  async cleanupExpiredTokens() {
    const expiredTokens = await RefreshToken.findAll({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });

    for (const token of expiredTokens) {
      await token.revoke();
    }

    return expiredTokens.length;
  }
};

export default authService;