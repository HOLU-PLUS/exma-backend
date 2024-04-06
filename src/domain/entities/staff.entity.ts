import { EventEntity, UserEntity } from "..";

export class StaffEntity {
  constructor(
    public id: number,
    public role?: EventEntity,
    public user?: UserEntity,
  ) { }

  static fromObjectAuth(object: { [key: string]: any; }) {
    const { id, role} = object;
    return new StaffEntity(id, EventEntity.fromObject(role));
  }
  static fromObject(object: { [key: string]: any; }) {
    const { id, role, user} = object;

    const roleEntity = role ? EventEntity.fromObject(role) : undefined;
    const userEntity = user ? UserEntity.fromObject(user) : undefined;

    return new StaffEntity(id, roleEntity,userEntity);
  }
}