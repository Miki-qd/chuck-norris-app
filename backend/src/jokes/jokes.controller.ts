import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Joke } from './joke.entity';
 // Jokes controller
@Controller('jokes')
export class JokesController {
  constructor(
    @InjectRepository(Joke)
    private jokeRepository: Repository<Joke>,
  ) {}
 // Save joke
  @Post()
  async saveJoke(@Body() body: { email: string; jokeText: string }) {
    const newJoke = this.jokeRepository.create({
      email: body.email,
      jokeText: body.jokeText,
    });
    return this.jokeRepository.save(newJoke);
  }
  // Get jokes for user
  @Get(':email')
  async getJokes(@Param('email') email: string) {
    return this.jokeRepository.find({ where: { email: email } });
  }
 // Delete joke
  @Delete(':id')
  async deleteJoke(@Param('id') id: string) {
    return this.jokeRepository.delete(id);
  }
}