export class AttendanceDto {
  private constructor(public readonly eventId: number, public readonly qrGuest: string) {}

  static body(object: { [key: string]: any }): [string?, AttendanceDto?] {
    const { eventId, qrGuest } = object;

    if (!eventId) return ['El evento es obligatorio'];
    if (!qrGuest) return ['El el qr del invitado es obligatorio'];

    return [undefined, new AttendanceDto(eventId, qrGuest)];
  }
}
