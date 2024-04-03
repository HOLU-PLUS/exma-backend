import { PrismaClient } from '@prisma/client';
import { StaffDto, CustomError, PaginationDto, StaffEntity, UserEntity, } from '../../domain';
import { bcryptAdapter } from '../../config';

const prisma = new PrismaClient();

export class StaffService {

  constructor() { }

  async getStaffs(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, staffs] = await Promise.all([
        prisma.staffs.count({ where: { state: true } }),
        prisma.staffs.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
            role: true
          }
        }),
      ]);
      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/staff?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/staff?page=${(page - 1)}&limit=${limit}` : null,
        staffs: staffs.map(staff => {
          const { ...staffEntity } = StaffEntity.fromObject(staff);
          return staffEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createStaff(createStaffDto: StaffDto, user: UserEntity) {

    try {

      const userExists = await prisma.users.findFirst({
        where: {
          email: createStaffDto.email
        }
      });

      let userId: number;
      if (!userExists) {
        const user = await prisma.users.create({
          data: {
            name: createStaffDto.name,
            lastName: createStaffDto.lastName,
            email: createStaffDto.email,
            phone: '5917373566',
            password: await bcryptAdapter.hash(createStaffDto.email), // Hasheamos la contraseña
          },
        });
        userId = user.id;
      } else {
        userId = userExists.id;
      }

      const staffExists = await prisma.staffs.findFirst({
        where: {
          user: {
            email: createStaffDto.email
          },
          state: true
        }
      });

      if (staffExists) throw CustomError.badRequest('El staff ya existe');

      const staff = await prisma.staffs.create({
        data: {
          userId: userId,
          roleId: createStaffDto.roleId
        },
        include: {
          user: true,
          role: true,
        }
      });
      console.log(staff)


      const { ...staffEntity } = StaffEntity.fromObject(staff);
      return staffEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateStaff(updateStaffDto: StaffDto, user: UserEntity, staffId: number) {
    const staffExists = await prisma.staffs.findFirst({
      where: { id: staffId },
      include: {
        user: true,
        role: true,
      }
    });
    if (!staffExists) throw CustomError.badRequest('El staff no existe');

    try {

      await prisma.users.update({
        where: { id: staffExists.userId },
        data: {
          ...updateStaffDto,
          password: await bcryptAdapter.hash(staffExists.user.password),
        }
      });

      const staff = await prisma.staffs.update({
        where: { id: staffId },
        data: {
          ...updateStaffDto,
          roleId: updateStaffDto.roleId
        },
        include: {
          user: true,
          role: true,
        }
      });

      return StaffEntity.fromObject(staff);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteStaff(user: UserEntity, categoryId: number) {
    const staffExists = await prisma.staffs.findFirst({
      where: { id: categoryId },
    });
    if (!staffExists) throw CustomError.badRequest('El staff no existe');
    try {
      await prisma.staffs.update({
        where: { id: categoryId },
        data: {
          state: false,
        },
      });
      return { msg: 'Staff eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


