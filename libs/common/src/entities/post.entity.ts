import { Column, DeleteDateColumn, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Post extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
