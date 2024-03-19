import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { POST_SERVICE } from '../constants/services';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { CreatePostDto, UpdatePostDto } from '@app/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('post')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'unauthorized',
})
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('post')
export class PostsController {
  constructor(@Inject(POST_SERVICE) private postClient: ClientRMQ) {}

  @Get()
  @ApiOperation({ summary: 'find all posts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get posts',
  })
  findPosts() {
    return this.postClient.send({ cmd: 'findPosts' }, {});
  }

  @Get(':postId')
  @ApiOperation({ summary: 'find one post' })
  @ApiParam({
    name: 'postId',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get post',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'post not found',
  })
  findPost(@Param('postId') postId: number) {
    return this.postClient.send({ cmd: 'findPost' }, postId).pipe(
      catchError((val) => {
        if (val.status === 404) {
          throw new NotFoundException(val.message);
        }

        return of(val);
      }),
    );
  }

  @Post()
  @ApiOperation({ summary: 'create post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'post created',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found',
  })
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postClient.send({ cmd: 'createPost' }, createPostDto).pipe(
      catchError((val) => {
        if (val.status === 404) {
          throw new NotFoundException(val.message);
        }

        return of(val);
      }),
    );
  }

  @Patch(':postId')
  @ApiOperation({ summary: 'update post' })
  @ApiParam({
    name: 'postId',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'post updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'post not found',
  })
  updatePost(
    @Param('postId') postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postClient
      .send({ cmd: 'updatePost' }, { postId, updatePostDto })
      .pipe(
        catchError((val) => {
          if (val.status === 404) {
            throw new NotFoundException(val.message);
          }

          return of(val);
        }),
      );
  }

  @Delete(':postId')
  @ApiOperation({ summary: 'delete post' })
  @ApiParam({
    name: 'postId',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'post deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'post not found',
  })
  deletePost(@Param('postId') postId: number) {
    return this.postClient.send({ cmd: 'deletePost' }, postId).pipe(
      catchError((val) => {
        if (val.status === 404) {
          throw new NotFoundException(val.message);
        }

        return of(val);
      }),
    );
  }
}
