import jwt from 'jsonwebtoken';
import authService from '../services/authService.js';

export const handleTokenRefresh = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        const tokens = await authService.refreshAccessToken(refreshToken);
        
        res.setHeader('X-New-Access-Token', tokens.accessToken);
        res.setHeader('X-New-Refresh-Token', tokens.refreshToken);
        
        const decoded = jwt.decode(tokens.accessToken);
        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name
        };
        
        next();
      } catch (refreshError) {
        return res.status(401).json({ 
          error: 'Token expired and refresh failed',
          code: 'REFRESH_FAILED'
        });
      }
    } else {
      return res.status(403).json({ 
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
  }
};