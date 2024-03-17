import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Post } from './post.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post[];
}
