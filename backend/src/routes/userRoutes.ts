import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { updateProfileSchema } from '../dto/user';

const router = Router();

router.use(requireAuth);

router.get('/', UserController.list);
router.get('/me', UserController.getProfile);
router.patch('/me', validate(updateProfileSchema), UserController.updateProfile);

export default router;
