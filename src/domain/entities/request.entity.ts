import { AvailabilityEntity, UserEntity } from "..";

export class RequestEntity {
  constructor(
    public id: number,
    public availability:AvailabilityEntity,
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, availability } = object;
    return new RequestEntity(id, availability);
  }
}
