import { EventEntity, GuestEntity, SpeakerEntity, StaffEntity } from '..';

export class AttendanceEntity {
  constructor(public id: number, public event?: EventEntity, public staff?: StaffEntity, public guest?: GuestEntity) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, events, staff, guests } = object;

    const eventEntity = event ? EventEntity.fromObject(event) : undefined;
    const staffEntity = staff ? StaffEntity.fromObject(staff) : undefined;
    const guestEntity = guests ? guests.map((e: GuestEntity) => GuestEntity.fromObject(e)) : undefined;

    return new AttendanceEntity(id, eventEntity, staffEntity, guestEntity);
  }
}
