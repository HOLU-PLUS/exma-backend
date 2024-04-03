import { RoleEntity, UserEntity } from "..";

export class StaffEntity {
  constructor(
    public id: number,
    public role?: RoleEntity,
    public user?: UserEntity,
  ) { }

  static fromObjectAuth(object: { [key: string]: any; }) {
    const { id, role} = object;
    return new StaffEntity(id, RoleEntity.fromObject(role));
  }
  static fromObject(object: { [key: string]: any; }) {
    const { id, role, user} = object;

    const roleEntity = role ? RoleEntity.fromObject(role) : undefined;
    const userEntity = user ? UserEntity.fromObject(user) : undefined;

    return new StaffEntity(id, roleEntity,userEntity);
  }
}