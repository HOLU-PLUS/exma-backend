import { UserEntity } from "..";

export class GuestEntity {
  constructor(
    public id: number,
    public codeQr: string,
    public user?: UserEntity,
  ) { }

  static fromObject(object: { [key: string]: any; }) {
    const { id, codeQr, user } = object;

    const userEntity = user ? UserEntity.fromObject(user) : undefined;

    return new GuestEntity(id, codeQr, userEntity);
  }
}
