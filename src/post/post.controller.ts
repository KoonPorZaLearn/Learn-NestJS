import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Req() req, @Body() body: Prisma.PostCreateInput) {
    return this.postService.create(body, req.user.userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }
}
