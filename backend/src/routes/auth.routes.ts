import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authValidators, profileValidators } from '../utils/validators';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';

const router = Router();
const controller = new AuthController();

// public endpoints
router.post('/register', authLimiter, authValidators.register, validate, controller.register.bind(controller));
router.post('/login', authLimiter, authValidators.login, validate, controller.login.bind(controller));
router.post('/refresh-token', authLimiter, controller.refreshToken.bind(controller));
router.post('/forgot-password', passwordResetLimiter, controller.forgotPassword.bind(controller));
router.post('/reset-password',  passwordResetLimiter, controller.resetPassword.bind(controller));

// endpoints requiring auth
router.post('/logout', authenticate, controller.logout.bind(controller));
router.get('/me', authenticate, controller.getCurrentUser.bind(controller));
router.put('/profile', authenticate, profileValidators.update, validate, controller.updateProfile.bind(controller));
router.put('/password', authenticate, authValidators.changePassword, validate, controller.updatePassword.bind(controller));

export default router;
