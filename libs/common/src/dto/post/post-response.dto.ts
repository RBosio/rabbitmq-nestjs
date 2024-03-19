import { UserResponseDto } from '@app/common';

export class PostResponseDto {
  id: number;
  title: string;
  description: string;
  user: UserResponseDto;
  deleted_at: Date;
}
