import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { validate } from '../middleware/validateMiddleware';
import { createTaskSchema, updateTaskSchema } from '../dto/task';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', TaskController.list);
router.get('/dashboard', TaskController.dashboard);
router.get('/:id', TaskController.getById);
router.post('/', validate(createTaskSchema), TaskController.create);
router.patch('/:id', validate(updateTaskSchema), TaskController.update);
router.delete('/:id', TaskController.delete);

export default router;
