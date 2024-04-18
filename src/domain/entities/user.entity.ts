import { GuestAuthEntity, SpeakerAuthEntity, SpeakerEntity, StaffAuthEntity, StaffEntity } from '..';
import { CustomError } from '../responses/custom.error';

export class UserEntity {
  constructor(
    public id: number,
    public name: string,
    public lastName: string,
    public email: string,
    public emailValidated?: boolean,
    public password?: string,
    public codeValidation?: string,
    public image?: string,
    public staff?: StaffAuthEntity,
    public guest?: GuestAuthEntity,
    public speaker?: SpeakerAuthEntity
  ) {}

  static fromObjectAuth(object: { [key: string]: any }) {
    const { id, name, lastName, email, emailValidated, password, codeValidation, image, staff, guest, speaker } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    if (!email) throw CustomError.badRequest('Falta el correo');
    if (!emailValidated) throw CustomError.badRequest('Falta la validación del correo');
    if (!password) throw CustomError.badRequest('Falta la contraseña');

    const staffAuthEntity = staff ? StaffAuthEntity.fromObject(staff) : undefined;
    const guestAuthEntity = guest ? GuestAuthEntity.fromObject(guest) : undefined;
    const speakerAuthEntity = speaker ? SpeakerAuthEntity.fromObject(speaker) : undefined;

    return new UserEntity(
      id,
      name,
      lastName,
      email,
      emailValidated,
      password,
      codeValidation,
      image,
      staffAuthEntity,
      guestAuthEntity,
      speakerAuthEntity
    );
  }

  static fromObject(object: { [key: string]: any }) {
    const { id, name, lastName, email } = object;

    if (!id) throw CustomError.badRequest('Falta id');
    if (!name) throw CustomError.badRequest('Falta el nombre');
    if (!lastName) throw CustomError.badRequest('Falta el apellido');
    if (!email) throw CustomError.badRequest('Falta el correo');
  

    return new UserEntity(id, name, lastName, email);
  }
}
