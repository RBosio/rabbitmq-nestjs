import { Post } from '../entities/post.entity';
import { BaseRepositoryInterface } from '../repositories/base.interface';

export interface PostRepositoryInterface
  extends BaseRepositoryInterface<Post> {}
