import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { SignInUserDto } from '../dto/sign-in.user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // async signIn(request: SignInUserDto): Promise<User> {
  //   return await this.userModel.create(request);
  // }

  async create(request: CreateUserDto): Promise<User> {
    let current_user = await this.findByUsername(request.username);
    console.log(request.username);
    
    if (current_user) return current_user;
    return await this.userModel.create(request);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    return await this.userModel.findOne({ _id: id });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username });
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
