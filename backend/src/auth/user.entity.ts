import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Represents a User in the authentication system
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  // The user's unique email address, used for login
  @Column({ unique: true })
  email!: string; 

  // The user's password (should be securely hashed in production)
  @Column()
  password!: string; 
}