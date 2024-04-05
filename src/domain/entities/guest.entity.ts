import { UserEntity } from "..";

export class StudentEntity {
  constructor(
    public id: number,
    public codeQr: string,
    public user?: UserEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, codeQr, user } = object;

    const userEntity = user ? UserEntity.fromObject(user) : undefined;

    return new StudentEntity(id, codeQr, userEntity);
  }
}
