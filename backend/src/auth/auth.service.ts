import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

// Service responsible for user authentication and management
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Registers a new user with the provided email and password
  async register(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }
  // Attempts to log in a user by verifying their email and password
  async login(email: string, password: string){
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
    }
    return null;
  }
  // Validates a user's credentials against the database
  async validateUser(email: string, password: string){
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
    }
    return null;
  }
}
