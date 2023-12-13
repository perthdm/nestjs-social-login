import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from '../schema/book.schema';
import mongoose, { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { CreateBookDto } from '../dto/create-book.dto';

describe('BookService', () => {
  let service: BookService;
  let model: Model<Book>;

  const mockBook = {
    _id: '6579a986047092e6d7c1ae69',
    name: 'Test',
    price: 200,
    description: 'Description',
    author: 'Author',
    createdAt: '2023-12-13T12:54:30.252Z',
    updatedAt: '2023-12-13T12:54:30.252Z',
    __v: 0,
  };

  const mockBookService = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookService,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findOne', () => {
    it('should find and return a book by ID', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockBook);

      const result = await service.findOne(mockBook._id);

      expect(result).toEqual(mockBook);
    });

    it('should throw BadRequestException if invalid ID is provided', async () => {
      const id = 'invalid-id';

      const isValidObjectIDMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(service.findOne(id)).rejects.toThrow(BadRequestException);

      expect(isValidObjectIDMock).toHaveBeenCalledWith(id);
      isValidObjectIDMock.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [mockBook];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const newBook = {
        name: 'new_book',
        price: 300,
        description: 'new_book_description',
        author: 'new_book author',
      };

      jest
        .spyOn(service, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockBook));

      const result = await service.create(newBook as CreateBookDto);

      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update and return a book', async () => {
      const updatedBook = {
        ...mockBook,
        name: 'Updated name',
      };
      const book = { name: 'Updated name' };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedBook);

      const result = await service.update(mockBook._id, book as any);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockBook._id, book, {
        new: true,
        runValidators: true,
      });

      expect(result.name).toEqual(book.name);
    });
  });

  describe('delete', () => {
    it('should delete and return a book', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockBook);

      const result = await service.delete(mockBook._id);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockBook._id);

      expect(result).toEqual(mockBook);
    });
  });
});
