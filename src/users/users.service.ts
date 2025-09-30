/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpAuthDto } from 'src/auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: SignUpAuthDto): Promise<any> {
    // Ensure password exists
    if (!createUserDto.password) {
      throw new Error('Password is required');
      // OR set a default password:
      // createUserDto.password = 'DefaultPassword123!';
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
      },
    });

    return user;
  }

  // Optional: Update old users without passwords
  async setDefaultPasswordForExistingUsers(defaultPassword: string) {
    const hashed = await this.hashPassword(defaultPassword);
    return this.prisma.user.updateMany({
      where: { password: null },
      data: { password: hashed },
    });
  }
  async findOne(email: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findById(id: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}

// findAll() {
//   return `This action returns all users`;
// }

// update(id: number, updateUserDto: UpdateUserDto) {
//   return `This action updates a #${id} user`;
// }

// remove(id: number) {
//   return `This action removes a #${id} user`;
// }
