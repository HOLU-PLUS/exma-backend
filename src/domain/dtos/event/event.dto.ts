import { ActivityDto } from './activity.dto';

export class EventDto {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly start: Date,
    public readonly end: Date,
    public readonly activities: ActivityDto[]
  ) {}

  static async body(object: { [key: string]: any }): Promise<[string?, EventDto?]> {
    const { name, description, price, start, end, activities } = object;

    if (!name) return ['El nombre es obligatorio'];
    if (!description) return ['La descripción es obligatorio'];
    // if (!price) return ['El precio es obligatorio'];
    if (!start) return ['La fecha inicio es obligatorio'];
    if (!end) return ['La fecha fin es obligatorio'];
    if (!activities) return ['Los permisos son obligatorios'];
    if (activities.length == 0) return ['Debe ver almenos una actividad'];
    for (const activity of activities) {
      const [error] = await ActivityDto.body(activity);
      if (error) return [error];
    }

    return [undefined, new EventDto(name, description, price, start, end, activities)];
  }
}
