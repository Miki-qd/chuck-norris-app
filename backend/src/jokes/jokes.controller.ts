// Added Get and Param to import at the top!
import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Joke } from './joke.entity';

@Controller('jokes')
export class JokesController {
  constructor(
    @InjectRepository(Joke)
    private jokeRepository: Repository<Joke>,
  ) {}

  @Post()
  async saveJoke(@Body() body: { email: string; jokeText: string }) {
    const newJoke = this.jokeRepository.create({
      email: body.email,
      jokeText: body.jokeText,
    });
    return this.jokeRepository.save(newJoke);
  }

  // --- NEW PART: Fetching jokes for a specific user ---
  @Get(':email')
  async getJokes(@Param('email') email: string) {
    // Searches the database for all jokes assigned to the given email
    return this.jokeRepository.find({ where: { email: email } });
  }

  // --- NEW PART: Deleting a joke from the database ---
  @Delete(':id')
  async deleteJoke(@Param('id') id: string) {
    return this.jokeRepository.delete(id);
  }
}