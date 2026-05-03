import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }
  async login(email: string, password: string){
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
    }
    return null;
  }
  async validateUser(email: string, password: string){
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && user.password === password) {
        const { password, ...result } = user;
        return result;
    }
    return null;
  }
}
