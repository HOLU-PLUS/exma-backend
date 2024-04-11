import { UserEntity } from './user.entity';

export class AvailabilityEntity {
  constructor(public id: number, public start: Date, public end: Date) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, start, end } = object;

    return new AvailabilityEntity(id, start, end);
  }
}
