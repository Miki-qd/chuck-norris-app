import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JokesController } from './jokes.controller';
import { JokesService } from './jokes.service';
import { Joke } from './joke.entity';

// Jokes module
@Module({
  imports: [TypeOrmModule.forFeature([Joke])],
  providers: [JokesService],
  controllers: [JokesController],
})
export class JokesModule {}