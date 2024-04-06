
export class ActivitieEntity {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public start: Date,
    public end: Date,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, price, start, end } = object;

    return new ActivitieEntity(id, name, price, start, end);
  }
}
