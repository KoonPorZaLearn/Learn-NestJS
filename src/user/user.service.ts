import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateUserDto): Promise<{ message: string }> {
    // Check if user already exists
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (user)
      throw new ConflictException('User with this email already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

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

  async findAll(): Promise<any> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: false,
      },
    });
  }

  async findOne(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
