import { UserEntity } from '..';

export class GuestAuthEntity {
  constructor(public id: number, public codeQr?: string) {}
  static fromObject(object: { [key: string]: any }) {
    const { id, codeQr } = object;
    return new GuestAuthEntity(id, codeQr);
  }
}

export class GuestEntity extends UserEntity {
  public readonly codeQr: string;

  constructor(id: number, codeQr: string, user: UserEntity) {
    super(user.id, user.name, user.lastName, user.email);
    this.id = id;
    this.codeQr = codeQr;
  }
  static fromObject(object: { [key: string]: any }) {
    const { id, codeQr, user } = object;

    const userEntity = UserEntity.fromObject(user);

    return new GuestEntity(id, codeQr, userEntity);
  }
}