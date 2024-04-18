import { AvailabilityEntity, UserEntity } from '..';

export class RequestEntity {
  constructor(public id: number, public user?: UserEntity, public availability?: AvailabilityEntity) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, user, availability } = object;
    const userEntity = user ? UserEntity.fromObject(user) : undefined;
    const availabilityEntity = availability ? AvailabilityEntity.fromObject(availability) : undefined;
    return new RequestEntity(id, userEntity, availabilityEntity);
  }
}
