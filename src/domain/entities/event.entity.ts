import { ActivitieEntity, PermissionEntity } from "..";

export class EventEntity {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public start: Date,
    public end: Date,
    public activities?: PermissionEntity[],
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, price, start, end, activities } = object;

    const activitieEntity = activities ? activities.map((e: ActivitieEntity) => ActivitieEntity.fromObject(e)) : undefined;

    return new EventEntity(id, name, price, start, end, activitieEntity);
  }
}
 