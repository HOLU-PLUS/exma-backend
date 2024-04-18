import { PrismaClient } from '@prisma/client';
import { CustomError, PaginationDto, UserEntity, CustomSuccessful, RequestEntity, RequestDto } from '../../domain';

const prisma = new PrismaClient();

export class RequestService {
  constructor() {}

  async getRequestsByGuest(paginationDto: PaginationDto, user: UserEntity) {
    const { page, limit } = paginationDto;
    try {
      const [total, requests] = await Promise.all([
        prisma.requests.count({ where: { userId: user.id } }),
        prisma.requests.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: { userId: user.id },
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/request?page=${page + 1}&limit=${limit}`,
          prev: page - 1 > 0 ? `/api/request?page=${page - 1}&limit=${limit}` : null,
          requests: requests.map((role) => {
            const { ...requestEntity } = RequestEntity.fromObject(role);
            return requestEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createRequest(createRequestDto: RequestDto, user: UserEntity) {
    const { availabilityId } = createRequestDto;
    const requestsExists = await prisma.requests.findFirst({ where: { availabilityId: availabilityId } });
    if (requestsExists) throw CustomError.badRequest('La solicitud ya existe');

    try {
      const request = await prisma.requests.create({
        data: {
          userId: user.id,
          ...createRequestDto,
        },
        include: {
          user: true,
          avalavility: true,
        },
      });

      const { ...requestEntity } = RequestEntity.fromObject(request);
      return CustomSuccessful.response({ result: requestEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteRequest(user: UserEntity, requestId: number) {
    const requestExists = await prisma.requests.findFirst({
      where: { userId: user.id, id: requestId },
    });
    if (!requestExists) throw CustomError.badRequest('La solicitud no existe');
    try {
      await prisma.requests.delete({
        where: { id: requestId },
      });
      return CustomSuccessful.response({ message: 'Solicitud eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
