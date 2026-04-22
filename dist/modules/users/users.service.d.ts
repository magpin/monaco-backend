import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData, UserResponse } from './types/user-response.type';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updateFailedAttempts(userId: string, attempts: number, lockedUntil: Date | null): Promise<void>;
    createReceptionist(createUserDto: CreateUserDto): Promise<UserResponse>;
    findAll(): Promise<UserResponse>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse>;
    deactivateUser(id: string): Promise<UserResponse>;
    mapToUserData(user: User): UserData;
}
