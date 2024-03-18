import { Controller, Inject } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, RmqService, UserResponseDto } from '@app/common';
import {
  ClientRMQ,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { UpdatePostDto } from '@app/common/dto/post/update-post.dto';
import { USER_SERVICE } from 'apps/api-gateway/src/constants/services';
import { lastValueFrom } from 'rxjs';

@Controller()
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private rmqService: RmqService,
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
  ) {}

  @MessagePattern({ cmd: 'findPosts' })
  findPosts(@Ctx() context: RmqContext) {
    this.rmqService.acknowledgmentMessage(context);
    return this.postsService.findPosts();
  }

  @MessagePattern({ cmd: 'findPost' })
  findPost(@Ctx() context: RmqContext, @Payload() id: number) {
    this.rmqService.acknowledgmentMessage(context);
    return this.postsService.findPost(id);
  }

  @MessagePattern({ cmd: 'createPost' })
  async createPost(
    @Ctx() context: RmqContext,
    @Payload() createPostDto: CreatePostDto,
  ) {
    let user: UserResponseDto;

    this.rmqService.acknowledgmentMessage(context);

    try {
      user = await lastValueFrom(
        this.userClient.send({ cmd: 'findUser' }, createPostDto.userId),
      );
    } catch (error) {
      throw new RpcException(error);
    }

    return this.postsService.createPost(createPostDto, user);
  }

  @MessagePattern({ cmd: 'updatePost' })
  updatePost(
    @Ctx() context: RmqContext,
    @Payload() data: { postId: number; updatePostDto: UpdatePostDto },
  ) {
    this.rmqService.acknowledgmentMessage(context);
    return this.postsService.updatePost(data.postId, data.updatePostDto);
  }

  @MessagePattern({ cmd: 'deletePost' })
  deletePost(@Ctx() context: RmqContext, @Payload() id: number) {
    this.rmqService.acknowledgmentMessage(context);

    return this.postsService.deletePost(id);
  }
}
