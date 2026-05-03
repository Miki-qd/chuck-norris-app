import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Represents a saved Joke in the database
@Entity()
export class Joke {
  @PrimaryGeneratedColumn()
  id: number;
  // The email of the user who saved the joke
  @Column()
  email: string;
  // The actual text content of the saved joke
  @Column()
  jokeText: string;
}