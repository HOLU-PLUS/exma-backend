import { PrismaClient } from '@prisma/client';
import { AvailabilityEntity, CustomError, PaginationDto, UserEntity, CustomSuccessful, AvailabilityDto } from '../../domain';

const prisma = new PrismaClient();

export class AvailabilityService {
  constructor() {}

  async getAvailabilities(paginationDto: PaginationDto, userId: number) {
    const { page, limit } = paginationDto;
    try {
      const [total, availabilities] = await Promise.all([
        prisma.availabilities.count({ where: { userId } }),
        prisma.availabilities.findMany({
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/availavility?page=${page + 1}&limit=${limit}`,
          prev: page - 1 > 0 ? `/api/availavility?page=${page - 1}&limit=${limit}` : null,
          availabilities: availabilities.map((role) => {
            const { ...availabilityEntity } = AvailabilityEntity.fromObject(role);
            return availabilityEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createAvailability(createAvailabilityDto: AvailabilityDto, user: UserEntity) {
    const { start, end } = createAvailabilityDto;
    const availabilityExists = await prisma.availabilities.findFirst({ where: { start, end } });
    if (availabilityExists) throw CustomError.badRequest('La disponibilidad ya existe');

    try {
      const availability = await prisma.availabilities.create({
        data: {
          userId: user.id,
          ...createAvailabilityDto,
        },
      });

      const { ...availabilityEntity } = AvailabilityEntity.fromObject(availability);
      return CustomSuccessful.response({ result: availabilityEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteAvailability(user: UserEntity, availabilityId: number) {
    const availabilityExists = await prisma.availabilities.findFirst({
      where: { userId: user.id, id: availabilityId },
    });
    if (!availabilityExists) throw CustomError.badRequest('El rol no existe');
    try {
      await prisma.availabilities.delete({
        where: { id: availabilityId },
      });
      return CustomSuccessful.response({ message: 'Rol eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
