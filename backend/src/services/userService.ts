import { NotFoundError } from '../utils/errors';
import { UserRepository } from '../repositories/userRepository';
import type { UpdateProfileDto } from '../dto/user';

export class UserService {
  static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  static async updateProfile(userId: string, payload: UpdateProfileDto) {
    await this.getProfile(userId);
    return UserRepository.updateProfile(userId, payload.name);
  }

  static async listUsers() {
    return UserRepository.listUsers();
  }
}
