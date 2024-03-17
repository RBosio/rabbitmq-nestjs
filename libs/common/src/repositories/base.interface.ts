import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm';

export interface BaseRepositoryInterface<T> {
  findAll(options?: FindManyOptions): Promise<T[]>;

  findOneById(id: any): Promise<T>;

  findOneByOptions(options: FindOneOptions): Promise<T>;

  create(data: DeepPartial<T>): T;

  save(data: DeepPartial<T>): Promise<T>;

  delete(id: any): Promise<UpdateResult>;
}
