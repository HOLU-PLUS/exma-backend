import { UserEntity } from '..';

export class SpeakerAuthEntity {
  constructor(public id: number, public codeQr?: string) {}
  static fromObject(object: { [key: string]: any }) {
    const { id, codeQr } = object;
    return new SpeakerAuthEntity(id, codeQr);
  }
}

export class SpeakerEntity extends UserEntity {
  public readonly ci: string;

  constructor(id: number, ci: string, user: UserEntity) {
    super(user.id, user.name, user.lastName, user.email);
    this.id = id;
    this.ci = ci;
  }
  static fromObject(object: { [key: string]: any }) {
    const { id, ci, user } = object;

    const userEntity = UserEntity.fromObject(user);
    return new SpeakerEntity(id, ci, userEntity);
  }
}
