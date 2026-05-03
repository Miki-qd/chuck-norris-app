import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

// Controller handling authentication endpoints (/auth)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // Endpoint for user registration
  @Post('register')
  async register(@Body() body: any) {
    if (!body.password || body.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    return this.authService.register(body.email, body.password);
  }
  // Endpoint for user login
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.login(body.email, body.password);
    if (!user) {
      return { message: 'Invalid email or password' };
    }
    return user;
  }
}
