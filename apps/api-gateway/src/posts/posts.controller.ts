import {
  Body,
  Controller,
  Delete,
  Get,
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

@UseGuards(AuthGuard)
@Controller('post')
export class PostsController {
  constructor(@Inject(POST_SERVICE) private postClient: ClientRMQ) {}

  @Get()
  findPosts() {
    return this.postClient.send({ cmd: 'findPosts' }, {});
  }

  @Get(':postId')
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
