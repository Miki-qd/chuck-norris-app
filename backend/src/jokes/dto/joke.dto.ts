import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJokeDto {
  @IsString()
  @IsNotEmpty({ message: 'Joke text cannot be empty' })
  jokeText!: string;
}
