import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Req() req, @Body() body: CreatePostDto) {
    return this.postService.createPost(body, req.user.userId);
  }

  @Get('findAll')
  findAll() {
    return this.postService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:postId')
  update(
    @Body() body: UpdatePostDto,
    @Param('postId') postId: string,
    @Req() req,
  ) {
    return this.postService.updatePost(body, postId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:postId')
  delete(@Req() req, @Param('postId') postId: string) {
    return this.postService.deletePost(req.user.userId, postId);
  }
}
