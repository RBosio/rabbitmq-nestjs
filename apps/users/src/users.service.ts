import { UpdateUserDto, UserRepository } from '@app/common';
import { User } from '@app/common/entities/user.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findUser(id: number): Promise<User> {
    const userFounded = await this.userRepository.findOneById(id);
    if (!userFounded)
      throw new RpcException({
        message: 'user not found',
        status: HttpStatus.NOT_FOUND,
      });

    return userFounded;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userFounded = await this.findUser(id);

    const userUpdated = Object.assign(userFounded, updateUserDto);

    return this.userRepository.save(userUpdated);
  }

  async delete(id: number): Promise<User> {
    const userFounded = await this.findUser(id);
    await this.userRepository.delete(id);

    return userFounded;
  }
}
