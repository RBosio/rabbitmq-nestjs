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
  UseGuards,
} from '@nestjs/common';
import { USER_SERVICE } from '../constants/services';
import { ClientRMQ } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { UpdateUserDto } from '@app/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('user')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'unauthorized',
})
@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UsersController {
  constructor(@Inject(USER_SERVICE) private userClient: ClientRMQ) {}

  @Get()
  @ApiOperation({ summary: 'find all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get users',
  })
  findUsers() {
    return this.userClient.send({ cmd: 'findUsers' }, {});
  }

  @Get(':userId')
  @ApiOperation({ summary: 'find one user' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found',
  })
  findUser(@Param('userId') userId: number) {
    return this.userClient.send({ cmd: 'findUser' }, userId).pipe(
      catchError((val) => {
        if (val.status === 404) {
          throw new NotFoundException(val.message);
        }

        return of(val);
      }),
    );
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'update user' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found',
  })
  updateUser(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userClient
      .send({ cmd: 'updateUser' }, { userId, updateUserDto })
      .pipe(
        catchError((val) => {
          if (val.status === 404) {
            throw new NotFoundException(val.message);
          }

          return of(val);
        }),
      );
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'delete user' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    example: 1,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user not found',
  })
  deleteUser(@Param('userId') userId: number) {
    return this.userClient.send({ cmd: 'deleteUser' }, userId).pipe(
      catchError((val) => {
        if (val.status === 404) {
          throw new NotFoundException(val.message);
        }

        return of(val);
      }),
    );
  }
}
