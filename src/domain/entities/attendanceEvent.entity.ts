import { EventEntity, GuestEntity, StaffEntity } from "..";

export class AttendanceEvent {
  constructor(
    public id: number,
    public evnent: EventEntity,
    public staff: StaffEntity,
    public guest: GuestEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, event, staff, guest, } = object;

    const eventEntity = EventEntity.fromObject(event);
    const staffEntity = StaffEntity.fromObject(staff);
    const guestEntity = GuestEntity.fromObject(guest);

    return new AttendanceEvent(id, eventEntity, staffEntity, guestEntity);
  }
}
