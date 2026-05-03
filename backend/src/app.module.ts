import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JokesModule } from './jokes/jokes.module'; 
 // App module
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true, 
      synchronize: true,
    }),
    AuthModule,
    JokesModule, 
  ],
})
export class AppModule {}