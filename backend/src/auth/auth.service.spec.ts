import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';


 // Unit tests for the AuthService.
 
describe('AuthService', () => {
  let service: AuthService;
  
   // Initialize the testing module before each test.
   
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
