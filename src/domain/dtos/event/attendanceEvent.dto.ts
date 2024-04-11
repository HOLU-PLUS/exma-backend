export class AttendanceEventDto {
  private constructor(public readonly eventId: number, public readonly qrGuest: string) {}

  static body(object: { [key: string]: any }): [string?, AttendanceEventDto?] {
    const { eventId, qrGuest } = object;

    if (!eventId) return ['El evento es obligatorio'];
    if (!qrGuest) return ['El el qr del invitado es obligatorio'];
    // if ( activities.length == 0 ) return ['Debe ver almenos un permiso'];

    return [undefined, new AttendanceEventDto(eventId, qrGuest)];
  }
}
