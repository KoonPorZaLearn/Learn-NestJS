import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.PostCreateInput, userId: string): Promise<any> {
    const newPost = await this.prisma.post.create({
      data: {
        ...data,
        author: { connect: { id: userId } },
      },
    });
    return newPost;
  }

  async findAll(): Promise<any> {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
