import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

// Unit tests for the AuthController
describe('AuthController', () => {
  let controller: AuthController;
  
  // Initialize the testing module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
