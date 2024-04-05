import { StaffEntity } from '..';
import { CustomError } from '../errors/custom.error';

export class UserEntity {

  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public email: string,
    public emailValidated?: boolean,
    public password?: string,
    public image?: string,
    public staffs?: StaffEntity,
  ) { }

  static fromObjectAuth(object: { [key: string]: any; }) {
    const { id, name, lastName, email, emailValidated, password, image, staffs } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    if (!email) throw CustomError.badRequest('Falta el correo');
    if (!emailValidated) throw CustomError.badRequest('Falta la validación del correo');
    if (!password) throw CustomError.badRequest('Falta la contraseña');

    const staffsEntity = staffs ? StaffEntity.fromObjectAuth(staffs) : undefined;

    return new UserEntity(id, name, lastName, email, emailValidated, password, image, staffsEntity);
  }

  static fromObject(object: { [key: string]: any; }) {
    const { id, name, lastName, email } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    if (!email) throw CustomError.badRequest('Falta el correo');

    return new UserEntity(id, name, lastName, email);
  }
}
