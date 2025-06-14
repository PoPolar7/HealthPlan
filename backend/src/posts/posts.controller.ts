import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Req() req: Request,
    @Body() body: { title: string; content: string },
  ) {
    const email = (req.user as any).email;
    return this.postsService.create(body.title, body.content, email);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() body: { title: string; content: string },
  ) {
    return this.postsService.update(id, body.title, body.content);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }

  @Patch(':id/comments')
  @UseGuards(AuthGuard('jwt'))
  addComment(
    @Param('id') postId: string,
    @Body('comment') comment: string,
    @Req() req: Request,
  ) {
    const userEmail = (req.user as any).email;
    return this.postsService.addComment(postId, userEmail, comment);
  }

  @Delete(':id/comments')
  @UseGuards(AuthGuard('jwt'))
  deleteComment(
    @Param('id') postId: string,
    @Body('createdAt') createdAt: string,
  ) {
    return this.postsService.deleteComment(postId, createdAt);
  }

  @Patch(':id/like')
  @UseGuards(AuthGuard('jwt'))
  likePost(@Param('id') id: string, @Req() req: Request) {
    const userEmail = (req.user as any).email;
    return this.postsService.likePost(id, userEmail);
  }

  @Patch(':id/dislike')
  @UseGuards(AuthGuard('jwt'))
  dislikePost(@Param('id') id: string, @Req() req: Request) {
    const userEmail = (req.user as any).email;
    return this.postsService.dislikePost(id, userEmail);
  }

  @Patch(':id/comments/:commentIndex/replies')
  addReply(
    @Param('id') postId: string,
    @Param('commentIndex') commentIndex: number,
    @Body() body: { email: string; comment: string },
  ) {
    return this.postsService.addReply(postId, Number(commentIndex), body);
  }
}
