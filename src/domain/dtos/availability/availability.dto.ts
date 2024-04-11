export class AvailabilityDto {
  private constructor(public readonly start: Date, public readonly end: Date) {}

  static body(object: { [key: string]: any }): [string?, AvailabilityDto?] {
    const { start, end } = object;

    if (!start) return ['La fecha inicio de la actividad es obligatorio'];
    if (!end) return ['La fecha fin de la actividad es obligatorio'];

    return [undefined, new AvailabilityDto(start, end)];
  }
}