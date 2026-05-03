import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JokesController } from './jokes.controller';
import { Joke } from './joke.entity';

// Jokes module
@Module({
  imports: [TypeOrmModule.forFeature([Joke])],
  controllers: [JokesController],
})
export class JokesModule {}