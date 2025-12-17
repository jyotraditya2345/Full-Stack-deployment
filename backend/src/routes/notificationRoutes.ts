import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', NotificationController.list);
router.patch('/:id/read', NotificationController.markRead);

export default router;
