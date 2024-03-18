import { PostResponseDto } from '../post/post-response.dto';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  password: string;
  deleted_at: Date;
  posts: PostResponseDto[];
}
