import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateUserDto): Promise<{ message: string }> {
    // Check if user already exists
    const user = await this.findOne(data.email);
    if (user)
      throw new ConflictException('User with this email already exists');

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Save user in database
    await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // Return created user
    return { message: 'User created successfully' };
  }

  async findOne(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: false,
        posts: true,
      },
    });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async findAll(): Promise<any> {
    return this.prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }
}
