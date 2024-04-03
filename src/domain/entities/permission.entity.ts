export class PermissionEntity {
  constructor(
    public id: number,
    public name: string,
    public module: string,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, module } = object;
    return new PermissionEntity(id, name, module);
  }
}