import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  authorEmail: string;

  @Prop({
    type: [
      {
        comment: String,
        email: String,
        createdAt: Date,
        replies: [
          {
            comment: String,
            email: String,
            createdAt: Date,
          },
        ],
      },
    ],
    default: [],
  })
  comments: {
    comment: string;
    email: string;
    createdAt: Date;
    replies: {
      comment: string;
      email: string;
      createdAt: Date;
    }[];
  }[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 0 })
  dislikes: number;

  // ✅ 유저별 중복 투표 방지용
  @Prop({
    type: [
      {
        email: String,
        vote: { type: String, enum: ['like', 'dislike'] },
      },
    ],
    default: [],
  })
  voters: { email: string; vote: 'like' | 'dislike' }[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
