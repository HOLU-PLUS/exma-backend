export class ActivityDto {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly start: Date,
    public readonly end: Date,
  ) {}

  static body(object: { [key: string]: any }): [string?, ActivityDto?] {
    const { name, description, start, end } = object;

    if (!name) return ['El nombre de la actividad es obligatorio'];
    if (!description) return ['La descripción de la actividad es obligatorio'];
    if (!start) return ['La fecha inicio de la actividad es obligatorio'];
    if (!end) return ['La fecha fin de la actividad es obligatorio'];

    return [undefined, new ActivityDto(name, description, start, end)];
  }
}
