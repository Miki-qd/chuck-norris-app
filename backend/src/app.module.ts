import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JokesModule } from './jokes/jokes.module'; // <-- Dodaj ten import

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true, // <-- To jest kluczowe! Dzięki temu baza sama znajdzie Joke.entity
      synchronize: true,
    }),
    AuthModule,
    JokesModule, // <-- Dodaj to tutaj
  ],
})
export class AppModule {}