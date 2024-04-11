import { ActivitieEntity, AttendanceEventEntity } from '..';

export class EventEntity {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public start: Date,
    public end: Date,
    public activities?: ActivitieEntity[],
    public attendanceEvents?: AttendanceEventEntity[]
  ) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, name, description, price, start, end, activities, attendanceEvents } = object;

    const activitieEntity = activities ? activities.map((e: ActivitieEntity) => ActivitieEntity.fromObject(e)) : undefined;
    const attendanceEventEntity = attendanceEvents
      ? attendanceEvents.map((e: AttendanceEventEntity) => AttendanceEventEntity.fromObject(e))
      : undefined;

    return new EventEntity(id, name, description, price, start, end, activitieEntity, attendanceEventEntity);
  }
}
