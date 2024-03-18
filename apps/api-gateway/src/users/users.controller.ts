import {
  Body,
  Controller,
  Delete,
  Get,
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

@UseGuards(AuthGuard)
@Controller('user')
export class UsersController {
  constructor(@Inject(USER_SERVICE) private userClient: ClientRMQ) {}

  @Get()
  findUsers() {
    return this.userClient.send({ cmd: 'findUsers' }, {});
  }

  @Get(':userId')
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
