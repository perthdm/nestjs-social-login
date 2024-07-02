import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { User } from '../schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockBook = {
    _id: '6579a986047092e6d7c1ae69',
    name: 'Test',
    createdAt: '2023-12-13T12:54:30.252Z',
    updatedAt: '2023-12-13T12:54:30.252Z',
    __v: 0,
  };

  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn().mockResolvedValueOnce([mockBook]),
    findOne: jest.fn().mockResolvedValueOnce(mockBook),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValueOnce(mockBook),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all books', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockBook]);
    });
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      const newBook = {
        name: 'new_book',
        price: 300,
        description: 'new_book_description',
        author: 'new_book author',
      };

      mockBookService.create = jest.fn().mockResolvedValueOnce(mockBook);

      const result = await controller.create(newBook as CreateUserDto);

      expect(service.create).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('findOneBook', () => {
    it('should findOne a book By ID', async () => {
      const result = await controller.findOne(mockBook._id);

      expect(service.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book by ID', async () => {
      const result = await controller.delete(mockBook._id);

      expect(service.delete).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });
});
