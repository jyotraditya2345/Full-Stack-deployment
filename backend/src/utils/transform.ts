import type { User } from '@prisma/client';

type SafeUserSource = Pick<User, 'id' | 'email' | 'name' | 'createdAt' | 'updatedAt'>;

export const toSafeUser = (user: SafeUserSource) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});
