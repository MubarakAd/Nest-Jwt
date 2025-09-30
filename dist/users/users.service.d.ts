import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpAuthDto } from 'src/auth/auth.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    private hashPassword;
    create(createUserDto: SignUpAuthDto): Promise<any>;
    setDefaultPasswordForExistingUsers(defaultPassword: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    findOne(email: string): Promise<any>;
    findById(id: string): Promise<any>;
}
