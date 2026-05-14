import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Joke } from './joke.entity';

@Injectable()
export class JokesService {
  constructor(
    @InjectRepository(Joke)
    private jokeRepository: Repository<Joke>,
  ) {}

  async createJoke(email: string, jokeText: string) {
    const newJoke = this.jokeRepository.create({ email, jokeText });
    return this.jokeRepository.save(newJoke);
  }

  async getJokes(email: string) {
    return this.jokeRepository.find({ where: { email } });
  }

  async deleteJoke(id: number, email: string) {
    const joke = await this.jokeRepository.findOne({ where: { id } });
    
    if (!joke) {
      throw new NotFoundException('Joke not found');
    }
    
    if (joke.email !== email) {
      throw new ForbiddenException('You can only delete your own jokes');
    }

    return this.jokeRepository.delete(id);
  }
}
