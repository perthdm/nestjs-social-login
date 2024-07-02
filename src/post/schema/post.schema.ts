import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Comment } from '../../comment/schema/comment.schema';
import { PostType } from 'src/enum/post-type';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({
    tag: String,
    enum: [
      PostType.EXERCISE,
      PostType.FASHION,
      PostType.FOOD,
      PostType.HEALTH,
      PostType.HISTORY,
      PostType.OTHER,
      PostType.PETS,
    ],
  })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_created?: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Comment.name }] })
  comments: Comment[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
