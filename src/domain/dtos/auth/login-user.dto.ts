import { regularExps } from "../../../config";

export class LoginUserDto {

  private constructor(
    public email: string,
    public password: string,
  ) {}

  static create( object: { [key:string]:any } ): [string?, LoginUserDto?] {
    const { email, password } = object;

    if ( !email ) return ['El email es obligatorio'];
    if ( !regularExps.email.test( email ) ) return ['el correo no es valido'];
    if ( !password ) return ['El password es obligatorio'];
    if ( password.length < 6 ) return ['La contraseña debe de ser más de 5 caracteres'];

    return [undefined, new LoginUserDto(email, password)];

  }


}