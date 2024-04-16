import { JwtAdapter, bcryptAdapter } from '../../config';
import { CustomError, CustomSuccessful, LoginUserDto, UserEntity, ValidateUserDto } from '../../domain';
import { EmailService } from './email.service';

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await prisma.users.findFirst({
      where: {
        email: loginUserDto.email,
      },
      include: {
        staff: {
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });
    console.log(user);
    if (!user) throw CustomError.badRequest('El Correo no existe');

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw CustomError.badRequest('La Contraseña no es valida');

    const { emailValidated, password, ...userEntity } = UserEntity.fromObjectAuth(user);

    const token = await JwtAdapter.generateToken({
      id: user.id,
    });
    if (!token) throw CustomError.internalServer('Error al crear la llave');

    return {
      user: userEntity,
      token: token,
    };
  }

  public async loginGuest(loginUserDto: LoginUserDto) {
    const user = await prisma.users.findFirst({
      where: {
        email: loginUserDto.email,
      },
      include: {
        guest: true,
      },
    });
    console.log(user);
    if (!user) throw CustomError.badRequest('El Correo no existe');

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw CustomError.badRequest('La Contraseña no es valida');
    const token = await JwtAdapter.generateToken({
      id: user.id,
    });
    if (!token) throw CustomError.internalServer('Error al crear la llave');

    if (!user.emailValidated) {
      const codeValidation = await this.sendEmailValidationLink(loginUserDto.email);
      await prisma.users.update({
        where: { id: user.id },
        data: { codeValidation: await bcryptAdapter.hash(codeValidation) },
      });

      return CustomSuccessful.response({
        statusCode: 1,
        message: 'Es necesario validar la cuenta',
        result: { token },
      });
    }
    const { emailValidated, password, ...userEntity } = UserEntity.fromObjectAuth(user);

    return {
      user: userEntity,
      token: token,
    };
  }

  public validateEmail = async (validateUserDto: ValidateUserDto, user: UserEntity) => {
    try {
      const isMatching = bcryptAdapter.compare(validateUserDto.code, user.codeValidation!);
      if (!isMatching) throw CustomError.badRequest('El código es incorrecto');
      await prisma.users.update({
        where: { id: user.id },
        data: { emailValidated: true },
      });

      return CustomSuccessful.response({ message: 'Verificación correcta' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  };

  public sendEmailValidationLink = async (email: string) => {
    const codeg = uuidv4().substring(0, 4);
    let verificationLink = `código: ${codeg}`;
    const html = `
      <h1>Valida tu correo electrónico</h1>
      <p>Inserte el siguiente código para completar el proceso</p>
      <br>
      <h1>${verificationLink}</h1>
    `;
    const options = {
      to: email,
      subject: 'Código de verificación',
      htmlBody: html,
    };
    const isSent = await this.emailService.sendEmail(options);
    if (!isSent) throw CustomError.internalServer('Error al enviar el correo');

    return codeg;
  };
}
