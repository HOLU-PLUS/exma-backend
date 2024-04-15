export class ActivitieEntity {
  constructor(public id: number, public name: string, public description: string, public start: Date, public end: Date) {}

  static fromObject(object: { [key: string]: any }) {
    const { id, name, description, start, end } = object;

    return new ActivitieEntity(id, name, description, start, end);
  }
}
