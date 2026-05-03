import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Joke {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  jokeText: string;
}