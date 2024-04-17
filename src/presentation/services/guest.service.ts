import { PrismaClient } from '@prisma/client';
import { GuestDto, CustomError, PaginationDto, UserEntity, SpeakerEntity, CustomSuccessful, GuestEntity } from '../../domain';
import { JwtAdapter, bcryptAdapter } from '../../config';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '.';

const prisma = new PrismaClient();

export class GuestService {
  constructor(public readonly authService: AuthService) {}

  async getGuests(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, guests] = await Promise.all([
        prisma.guests.count({ where: { state: true } }),
        prisma.guests.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
          },
        }),
      ]);
      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/guest?page=${page + 1}&limit=${limit}`,
          prev: page - 1 > 0 ? `/api/guest?page=${page - 1}&limit=${limit}` : null,
          students: guests.map((guest) => {
            const { ...guestEntity } = GuestEntity.fromObject(guest);
            return guestEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async getGuest(codeQr: string) {
    try {
      const guest = await prisma.guests.findFirst({
        where: { codeQr },
        include: {
          user: true,
        },
      });
      if (!guest) throw CustomError.badRequest('No existe el invitado');
      const { ...guestEntity } = GuestEntity.fromObject(guest);
      return CustomSuccessful.response({ result: guestEntity });
    } catch (error) {
      console.log(error)
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createGuest(createStudentDto: GuestDto) {
    try {
      const userExists = await prisma.users.findFirst({
        where: {
          email: createStudentDto.email,
        },
      });

      let userId: number;
      if (!userExists) {
        const user = await prisma.users.create({
          data: {
            name: createStudentDto.name,
            lastName: createStudentDto.lastName,
            email: createStudentDto.email,
            phone: '5917373566',
            password: await bcryptAdapter.hash(createStudentDto.email),
          },
        });
        userId = user.id;
      } else {
        userId = userExists.id;
      }

      const guestExists = await prisma.guests.findFirst({
        where: {
          user: {
            email: createStudentDto.email,
          },
          state: true,
        },
      });

      if (guestExists) throw CustomError.badRequest('La cuenta ya existe');

      const guest = await prisma.guests.create({
        data: {
          codeQr: uuidv4(),
          userId: userId,
        },
        include: {
          user: true,
        },
      });
      if (!guest.user.emailValidated) {
        const token = await JwtAdapter.generateToken({ id: guest.user.id });
        if (!token) throw CustomError.internalServer('Error al crear la llave');
        const codeValidation = await this.authService.sendEmailValidationLink(guest.user.email);
        await prisma.users.update({
          where: { id: guest.user.id },
          data: { codeValidation: await bcryptAdapter.hash(codeValidation) },
        });
        return CustomSuccessful.response({
          statusCode: 1,
          message: 'Es necesario validar la cuenta',
          result: { token },
        });
      }
      const { ...guestEntity } = GuestEntity.fromObject(guest);
      return CustomSuccessful.response({ result: guestEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateGuest(updateStudentDto: GuestDto, user: UserEntity, studentId: number) {
    const studentExists = await prisma.guests.findFirst({
      where: { id: studentId },
      include: {
        user: true,
      },
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');

    try {
      await prisma.users.update({
        where: { id: studentExists.userId },
        data: {
          ...updateStudentDto,
          password: await bcryptAdapter.hash(studentExists.user.password),
        },
      });

      const guest = await prisma.guests.update({
        where: { id: studentId },
        data: {
          codeQr: 'asdasds',
          ...updateStudentDto,
        },
        include: {
          user: true,
        },
      });

      const { ...guestEntity } = GuestEntity.fromObject(guest);
      return CustomSuccessful.response({ result: guestEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteGuest(user: UserEntity, guestId: number) {
    const studentExists = await prisma.guests.findFirst({
      where: { id: guestId },
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');
    try {
      await prisma.guests.update({
        where: { id: guestId },
        data: {
          state: false,
        },
      });
      return CustomSuccessful.response({ message: 'Invitado eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
