import { prisma } from '../config/prisma';

export class UserRepository {
  static createUser(params: { email: string; name: string; passwordHash: string }) {
    return prisma.user.create({
      data: {
        email: params.email,
        name: params.name,
        passwordHash: params.passwordHash
      }
    });
  }

  static findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  static updateProfile(id: string, name: string) {
    return prisma.user.update({
      where: { id },
      data: { name }
    });
  }

  static listUsers() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });
  }
}
