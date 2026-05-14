import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateJokeDto } from './dto/joke.dto';

// Jokes controller
@Controller('jokes')
@UseGuards(JwtAuthGuard)
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  // Save joke
  @Post()
  async saveJoke(@Request() req: any, @Body() body: CreateJokeDto) {
    // Extract email from authenticated user token instead of body
    return this.jokesService.createJoke(req.user.email, body.jokeText);
  }

  // Get jokes for user
  @Get()
  async getJokes(@Request() req: any) {
    // Only get jokes for the currently logged-in user
    return this.jokesService.getJokes(req.user.email);
  }

  // Delete joke
  @Delete(':id')
  async deleteJoke(@Request() req: any, @Param('id') id: string) {
    // Pass user email to ensure they own the joke
    return this.jokesService.deleteJoke(Number(id), req.user.email);
  }
}