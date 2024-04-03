import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export class AuthService {

  // DI
  constructor(
    // DI - Email Service
    // private readonly emailService: EmailService,
  ) { }


  public async registerUser(registerUserDto: RegisterUserDto) {

    // const existUser = await UserModel.findOne({ email: registerUserDto.email });
    // if ( existUser ) throw CustomError.badRequest('Email already exist');

    // try {
    //   const user = new UserModel(registerUserDto);

    //   // Encriptar la contraseña
    //   user.password = bcryptAdapter.hash( registerUserDto.password );

    //   await user.save();

    //   // Email de confirmación
    //   await this.sendEmailValidationLink( user.email );

    //   const { password, ...userEntity } = UserEntity.fromObject(user);

    //   const token = await JwtAdapter.generateToken({ id: user.id });
    //   if ( !token ) throw CustomError.internalServer('Error while creating JWT');

    //   return { 
    //     user: userEntity, 
    //     token: token,
    //   };

    // } catch (error) {
    //   throw CustomError.internalServer(`${ error }`);
    // }

  }


  public async loginUser(loginUserDto: LoginUserDto) {

    const user = await prisma.users.findFirst({
      where: {
        email: loginUserDto.email
      },
      include: {
        staffs: {
          include: {
            role:{
              include:{
                permissions:true
              }
            }
          }
        }
      }
    });
    console.log(user)
    if (!user) throw CustomError.badRequest('El Correo no existe');

    const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw CustomError.badRequest('La Contraseña no es valida');

    const { emailValidated,password, ...userEntity } = UserEntity.fromObjectAuth(user);

    const token = await JwtAdapter.generateToken({ id: user.id });
    if (!token) throw CustomError.internalServer('Error al crear la llave');

    return {
      user: userEntity,
      token: token,
    }

  }


  private sendEmailValidationLink = async (email: string) => {

    // const token = await JwtAdapter.generateToken({ email });
    // if ( !token ) throw CustomError.internalServer('Error getting token');

    // const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
    // const html = `
    //   <h1>Validate your email</h1>
    //   <p>Click on the following link to validate your email</p>
    //   <a href="${ link }">Validate your email: ${ email }</a>
    // `;

    // const options = {
    //   to: email,
    //   subject: 'Validate your email',
    //   htmlBody: html,
    // }

    // const isSent = await this.emailService.sendEmail(options);
    // if ( !isSent ) throw CustomError.internalServer('Error sending email');

    // return true;
  }


  public validateEmail = async (token: string) => {

    // const payload = await JwtAdapter.validateToken(token);
    // if ( !payload ) throw CustomError.unauthorized('Invalid token');

    // const { email } = payload as { email: string };
    // if ( !email ) throw CustomError.internalServer('Email not in token');

    // const user = await UserModel.findOne({ email });
    // if ( !user ) throw CustomError.internalServer('Email not exists');

    // user.emailValidated = true;
    // await user.save();

    // return true;
  }


}