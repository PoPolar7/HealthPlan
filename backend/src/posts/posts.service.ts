import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(title: string, content: string, authorEmail: string) {
    const created = new this.postModel({ title, content, authorEmail });
    return created.save();
  }

  async findAll() {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    return post;
  }

  async update(id: string, title: string, content: string) {
    return this.postModel.findByIdAndUpdate(
      id,
      { title, content },
      { new: true },
    );
  }

  async delete(id: string) {
    return this.postModel.findByIdAndDelete(id);
  }

  // 댓글 추가
  async addComment(postId: string, email: string, comment: string) {
    return this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            email,
            comment,
            createdAt: new Date(),
          },
        },
      },
      { new: true },
    );
  }

  // 댓글 삭제
  async deleteComment(postId: string, createdAt: string) {
    return this.postModel.findByIdAndUpdate(
      postId,
      {
        $pull: {
          comments: { createdAt: new Date(createdAt) },
        },
      },
      { new: true },
    );
  }

  async likePost(id: string, userEmail: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');

    const alreadyVoted = post.voters.find((v) => v.email === userEmail);
    if (alreadyVoted) {
      return {
        voted: true,
        voteType: alreadyVoted.vote,
        likes: post.likes,
        dislikes: post.dislikes,
      };
    }

    post.likes += 1;
    post.voters.push({ email: userEmail, vote: 'like' });
    await post.save();

    return {
      voted: true,
      voteType: 'like',
      likes: post.likes,
      dislikes: post.dislikes,
    };
  }

  async dislikePost(id: string, userEmail: string) {
    const post = await this.postModel.findById(id);
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');

    const alreadyVoted = post.voters.find((v) => v.email === userEmail);
    if (alreadyVoted) {
      return {
        voted: true,
        voteType: alreadyVoted.vote,
        likes: post.likes,
        dislikes: post.dislikes,
      };
    }

    post.dislikes += 1;
    post.voters.push({ email: userEmail, vote: 'dislike' });
    await post.save();

    return {
      voted: true,
      voteType: 'dislike',
      likes: post.likes,
      dislikes: post.dislikes,
    };
  }

  async addReply(
    postId: string,
    commentIndex: number,
    reply: { email: string; comment: string },
  ) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    const now = new Date();
    post.comments[commentIndex].replies.push({
      comment: reply.comment,
      email: reply.email,
      createdAt: now,
    });

    await post.save();
    return post.comments[commentIndex];
  }
}
