import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async createPost(data: CreatePostDto, userId: string): Promise<any> {
    return this.prisma.post.create({
      data: {
        ...data,
        author: { connect: { id: userId } },
      },
    });
  }

  async findAll(): Promise<any> {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async updatePost(
    data: UpdatePostDto,
    postId: string,
    userId: string,
  ): Promise<any> {
    // Check if user is author of post
    await this.checkUserIsAuthor(userId, postId);
    // Update post
    return this.prisma.post.update({
      where: {
        id: postId,
        authorId: userId,
      },
      data: {
        ...data,
      },
    });
  }

  async deletePost(
    userId: string,
    postId: string,
  ): Promise<{ message: string }> {
    // Check if user is author of post
    await this.checkUserIsAuthor(userId, postId);
    // Delete post
    await this.prisma.post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    return { message: 'Post deleted successfully' };
  }

  async checkUserIsAuthor(userId: string, postId: string): Promise<any> {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });
    if (!post) {
      throw new ConflictException('Post not found');
    }
    if (post.authorId !== userId) {
      throw new ConflictException('You are not the author of this post');
    }
  }
}
