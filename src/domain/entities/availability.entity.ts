import { RequestEntity } from './request.entity';

export class AvailabilityEntity {
  constructor(public id: number, public start: Date, public end: Date, public requests: RequestEntity) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, start, end, requests } = object;
    const requestEntity = requests ? requests.map((e: RequestEntity) => RequestEntity.fromObject(e)) : [];
    return new AvailabilityEntity(id, start, end, requestEntity);
  }
}
