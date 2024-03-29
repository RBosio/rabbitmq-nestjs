import { CreateUserDto, LoginUserDto, User, UserRepository } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto, user: User): Promise<User> {
    const userCreated = this.userRepository.create(createUserDto);
    if (user)
      throw new RpcException({
        message: 'email already exists',
        status: HttpStatus.BAD_REQUEST,
      });

    userCreated.password = await hash(createUserDto.password, 12);

    return this.userRepository.save(userCreated);
  }

  async login(loginUserDto: LoginUserDto, user: User): Promise<User> {
    if (!user)
      throw new RpcException({
        message: 'email or password wrong',
        status: HttpStatus.UNAUTHORIZED,
      });

    const validPassword = await compare(loginUserDto.password, user.password);
    if (!validPassword)
      throw new RpcException({
        message: 'email or password wrong',
        status: HttpStatus.UNAUTHORIZED,
      });

    return user;
  }
}
