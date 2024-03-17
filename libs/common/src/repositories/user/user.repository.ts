import { User } from '@app/common/entities/user.entity';
import { BaseRepository } from '../base.repository';
import { UserRepositoryInterface } from '@app/common/interfaces/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository
  extends BaseRepository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
