import { Module } from '@nestjs/common';
import { PostService } from './service/post.service';
import { PostController } from './controller/post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/post/schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
