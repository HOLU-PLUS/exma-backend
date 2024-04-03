import { PrismaClient } from '@prisma/client';
import { GuestDto, CustomError, PaginationDto, UserEntity, StudentEntity, } from '../../domain';
import { bcryptAdapter } from '../../config';

const prisma = new PrismaClient();

export class GuestService {

  constructor() { }

  async getGuests(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, students] = await Promise.all([
        prisma.guests.count({ where: { state: true } }),
        prisma.guests.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
          }
        }),
      ]);
      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/student?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/student?page=${(page - 1)}&limit=${limit}` : null,
        students: students.map(student => {
          const { ...studentEntity } = StudentEntity.fromObject(student);
          return studentEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createGuest(createStudentDto: GuestDto, user: UserEntity) {

    try {

      const userExists = await prisma.users.findFirst({
        where: {
          email: createStudentDto.email
        }
      });

      let userId: number;
      if (!userExists) {
        const user = await prisma.users.create({
          data: {
            name: createStudentDto.name,
            lastName: createStudentDto.lastName,
            email: createStudentDto.email,
            phone: '5917373566',
            password: await bcryptAdapter.hash(createStudentDto.email), // Hasheamos la contraseña
          },
        });
        userId = user.id;
      } else {
        userId = userExists.id;
      }

      const staffExists = await prisma.guests.findFirst({
        where: {
          user: {
            email: createStudentDto.email
          },
          state: true
        }
      });

      if (staffExists) throw CustomError.badRequest('El estudiante ya existe');

      const student = await prisma.guests.create({
        data: {
          codeQr:createStudentDto.codeQr,
          userId: userId,
        },
        include: {
          user: true,
        }
      });
      console.log(student)


      const { ...studentEntity } = StudentEntity.fromObject(student);
      return studentEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateGuest(updateStudentDto: GuestDto, user: UserEntity, studentId: number) {
    const studentExists = await prisma.guests.findFirst({
      where: { id: studentId },
      include: {
        user: true,
      }
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');

    try {

      await prisma.users.update({
        where: { id: studentExists.userId },
        data: {
          ...updateStudentDto,
          password: await bcryptAdapter.hash(studentExists.user.password),
        }
      });

      const staff = await prisma.guests.update({
        where: { id: studentId },
        data: {
          ...updateStudentDto,
        },
        include: {
          user: true,
        }
      });

      return StudentEntity.fromObject(staff);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteGuest(user: UserEntity, categoryId: number) {
    const studentExists = await prisma.guests.findFirst({
      where: { id: categoryId },
    });
    if (!studentExists) throw CustomError.badRequest('El estudiante no existe');
    try {
      await prisma.guests.update({
        where: { id: categoryId },
        data: {
          state: false,
        },
      });
      return { msg: 'estudiante eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


