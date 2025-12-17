import { ValidationError } from '../utils/errors';
import { hashPassword, verifyPassword } from '../utils/password';
import { createJwt } from '../utils/jwt';
import { UserRepository } from '../repositories/userRepository';
import type { RegisterDto, LoginDto } from '../dto/auth';

export class AuthService {
  static async register(payload: RegisterDto) {
    const existing = await UserRepository.findByEmail(payload.email);
    if (existing) {
      throw new ValidationError('Email already registered');
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await UserRepository.createUser({
      email: payload.email,
      name: payload.name,
      passwordHash
    });

    const token = createJwt({ userId: user.id, email: user.email, name: user.name });
    return { user, token };
  }

  static async login(payload: LoginDto) {
    const user = await UserRepository.findByEmail(payload.email);
    if (!user) {
      throw new ValidationError('Invalid credentials');
    }

    const isValid = await verifyPassword(payload.password, user.passwordHash);
    if (!isValid) {
      throw new ValidationError('Invalid credentials');
    }

    const token = createJwt({ userId: user.id, email: user.email, name: user.name });
    return { user, token };
  }
}
