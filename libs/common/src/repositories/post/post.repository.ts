import { Post } from '@app/common/entities/post.entity';
import { BaseRepository } from '../base.repository';
import { PostRepositoryInterface } from '@app/common/interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PostRepository
  extends BaseRepository<Post>
  implements PostRepositoryInterface
{
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {
    super(postRepository);
  }
}
