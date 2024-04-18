import { PrismaClient } from '@prisma/client';
import { AvailabilityEntity, CustomError, PaginationDto, UserEntity, CustomSuccessful, AvailabilityDto } from '../../domain';

const prisma = new PrismaClient();

export class AvailabilityService {
  constructor() {}

  async getAvailabilitiesByGuest(codeQr: string) {
    try {
      const availabilities = await prisma.availabilities.findMany({
        where: {
          user: {
            guest: {
              codeQr: codeQr,
            },
          },
        },
        include:{
          requests:{
            where:{
              accepted:true,
            },
            include:{
              user:{
                include:{
                  guest:true
                }
              }
            }
          }
        }
      });
      if(!availabilities)throw CustomError.badRequest('No existe la disponibilidad para el invitado');
      return CustomSuccessful.response({
        result: {
          availabilities: availabilities.map((availability) => {
            const { ...availabilityEntity } = AvailabilityEntity.fromObject(availability);
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
