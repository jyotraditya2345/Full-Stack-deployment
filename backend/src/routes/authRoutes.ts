import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../middleware/validateMiddleware';
import { loginSchema, registerSchema } from '../dto/auth';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/me', requireAuth, AuthController.me);
router.post('/logout', requireAuth, AuthController.logout);

export default router;
