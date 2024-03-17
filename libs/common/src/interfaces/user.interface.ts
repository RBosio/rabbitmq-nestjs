import { User } from '../entities/user.entity';
import { BaseRepositoryInterface } from '../repositories/base.interface';

export interface UserRepositoryInterface
  extends BaseRepositoryInterface<User> {}
