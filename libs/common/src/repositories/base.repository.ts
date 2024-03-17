import {
  FindOneOptions,
  DeepPartial,
  UpdateResult,
  Repository,
  FindManyOptions,
} from 'typeorm';
import { BaseRepositoryInterface } from './base.interface';

interface HasId {
  id: number;
}

export abstract class BaseRepository<T extends HasId>
  implements BaseRepositoryInterface<T>
{
  private entity: Repository<T>;
  constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(options);
  }

  findOneById(id: any): Promise<T> {
    return this.entity.findOne({
      where: {
        id,
      },
    });
  }

  findOneByOptions(options: FindOneOptions<any>): Promise<T> {
    return this.entity.findOne(options);
  }

  create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  save(data: DeepPartial<T>): Promise<T> {
    return this.entity.save(data);
  }

  delete(id: any): Promise<UpdateResult> {
    return this.entity.softDelete(id);
  }
}
