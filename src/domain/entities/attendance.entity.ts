import { EventEntity, GuestEntity, SpeakerEntity, StaffEntity } from '..';

export class AttendanceEntity {
  constructor(public id: number, public event?: EventEntity, public staff?: StaffEntity, public guest?: GuestEntity) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, event, staff, guest } = object;

    const eventEntity = event ? EventEntity.fromObject(event) : undefined;
    const staffEntity = staff ? StaffEntity.fromObject(staff) : undefined;
    const guestEntity = guest ? GuestEntity.fromObject(guest) : undefined;

    return new AttendanceEntity(id, eventEntity, staffEntity, guestEntity);
  }
}
