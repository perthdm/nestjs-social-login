import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '../schema/book.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookDto } from '../dto/create-book.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<Book>) {}

  async create(request: CreateBookDto): Promise<Book> {
    return await this.bookModel.create(request);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookModel.find();
  }

  async findOne(id: string): Promise<Book> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    return await this.bookModel.findOne({ _id: id });
  }

  async update(id: string, request: UpdateBookDto) {
    return await this.bookModel.findByIdAndUpdate(id, request, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string) {
    return await this.bookModel.findByIdAndDelete(id);
  }
}
