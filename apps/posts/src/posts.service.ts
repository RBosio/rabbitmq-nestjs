import { CreatePostDto, PostRepository, UserResponseDto } from '@app/common';
import { UpdatePostDto } from '@app/common/dto/post/update-post.dto';
import { Post } from '@app/common/entities/post.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PostsService {
  constructor(private postRepository: PostRepository) {}

  async findPosts(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async findPost(id: number): Promise<Post> {
    const postFounded = await this.postRepository.findOneById(id);
    if (!postFounded)
      throw new RpcException({
        message: 'post not found',
        status: HttpStatus.NOT_FOUND,
      });

    return postFounded;
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: UserResponseDto,
  ): Promise<Post> {
    const postCreated = this.postRepository.create(createPostDto);
    postCreated.user = user;

    return this.postRepository.save(postCreated);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const postFounded = await this.findPost(id);

    const postUpdated = Object.assign(postFounded, updatePostDto);

    return this.postRepository.save(postUpdated);
  }

  async deletePost(id: number): Promise<Post> {
    const postFounded = await this.findPost(id);
    await this.postRepository.delete(id);

    return postFounded;
  }
}
