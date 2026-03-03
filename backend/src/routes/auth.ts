import { Router } from 'express';
import { AuthController } from '@/controllers/auth';
import { authValidators } from '@/utils/validators';
import { validate } from '@/middleware/validate';
import { authenticate } from '@/middleware/auth';
import { authLimiter } from '@/middleware/rateLimiter';

const router = Router();
const controller = new AuthController();

// public endpoints
router.post('/register', authLimiter, authValidators.register, validate, controller.register.bind(controller));
router.post('/login', authLimiter, authValidators.login, validate, controller.login.bind(controller));
router.post('/refresh-token', controller.refreshToken.bind(controller));

// endpoints requiring auth
router.post('/logout', authenticate, controller.logout.bind(controller));
router.get('/me', authenticate, controller.getCurrentUser.bind(controller));
router.put('/profile', authenticate, controller.updateProfile.bind(controller));
router.put('/password', authenticate, authValidators.changePassword, validate, controller.updatePassword.bind(controller));

export default router;
