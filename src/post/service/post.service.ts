import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../schema/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(request: CreatePostDto) {
    return await this.postModel.create({
      ...request,
      user_created: request.userId,
    });
  }

  async findMyPost(userId: string) {
    let postList = await this.postModel.aggregate([
      {
        $match: { user_created: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_created',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          title: 1,
          content: 1,
          type: 1,
          user_created: '$user',
          createdAt: 1,
          commentCount: 1,
        },
      },
    ]);

    return postList;
  }

  async findAll() {
    let postList = await this.postModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_created',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          title: 1,
          content: 1,
          type: 1,
          createdAt: 1,
          user_created: '$user',
          commentCount: 1,
        },
      },
    ]);

    return postList;
  }

  findOne(id: number) {
    console.log('TEST');

    return `This action returns a #${id} post`;
  }

  async update(id: string, request: UpdatePostDto) {
    return await this.postModel.findOneAndUpdate({ _id: id }, request);
  }

  async remove(id: string) {
    return await this.postModel.deleteOne({ _id: id });
  }
}
