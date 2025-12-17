import { TaskService } from '../services/taskService';
import { UserRepository } from '../repositories/userRepository';
import { TaskRepository } from '../repositories/taskRepository';
import { NotificationRepository } from '../repositories/notificationRepository';
import { TaskAuditRepository } from '../repositories/taskAuditRepository';
import { socketService } from '../sockets/socketService';
import { ValidationError, ForbiddenError } from '../utils/errors';

jest.mock('../repositories/userRepository');
jest.mock('../repositories/taskRepository');
jest.mock('../repositories/notificationRepository');
jest.mock('../repositories/taskAuditRepository');

describe('TaskService', () => {
  const baseTask = {
    id: 'task-1',
    title: 'Test task',
    description: 'desc',
    dueDate: new Date(),
    priority: 'MEDIUM',
    status: 'TO_DO',
    creatorId: 'creator-1',
    assignedToId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(socketService, 'emitTaskUpdated').mockImplementation(() => {});
    jest.spyOn(socketService, 'emitTaskAssigned').mockImplementation(() => {});
  });

  it('throws when assignee does not exist', async () => {
    jest.spyOn(UserRepository, 'findById').mockResolvedValue(null as any);

    await expect(
      TaskService.create(
        {
          ...baseTask,
          dueDate: new Date().toISOString(),
          assignedToId: 'missing-user'
        } as any,
        'creator-1'
      )
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('sends a notification when assigning to someone else', async () => {
    jest.spyOn(UserRepository, 'findById').mockResolvedValue({ id: 'assignee-1' } as any);
    jest.spyOn(TaskRepository, 'createTask').mockResolvedValue({
      ...baseTask,
      assignedToId: 'assignee-1'
    } as any);
    jest.spyOn(TaskAuditRepository, 'createEntry').mockResolvedValue({} as any);
    jest
      .spyOn(NotificationRepository, 'createNotification')
      .mockResolvedValue({ id: 'notif-1', userId: 'assignee-1' } as any);
    const emitAssigned = jest.spyOn(socketService, 'emitTaskAssigned');

    await TaskService.create(
      {
        ...baseTask,
        dueDate: new Date().toISOString(),
        assignedToId: 'assignee-1'
      } as any,
      'creator-1'
    );

    expect(emitAssigned).toHaveBeenCalledTimes(1);
  });

  it('prevents updates from non-creator/non-assignee', async () => {
    jest.spyOn(TaskRepository, 'findById').mockResolvedValue({
      ...baseTask,
      creatorId: 'creator-1',
      assignedToId: 'assignee-1'
    } as any);

    await expect(
      TaskService.update('task-1', { title: 'New title' } as any, 'other-user')
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
