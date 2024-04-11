import { PrismaClient } from '@prisma/client';
import {
  EventDto,
  CustomError,
  PaginationDto,
  EventEntity,
  UserEntity,
  AttendanceEventDto,
  CustomSuccessful,
  AttendanceEventEntity,
} from '../../domain';

const prisma = new PrismaClient();

export class EventService {
  constructor() {}

  async getEvents(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {
      const [total, events] = await Promise.all([
        prisma.events.count({ where: { state: true } }),
        prisma.events.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true,
          },
          include: {
            activities: true,
            attendanceEvents: {
              include: {
                guest: {
                  include:{
                    user:true
                  }
                },
                staff: {
                  include:{
                    user:true
                  }
                },
              },
            },
          },
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/event?page=${page + 1}&limit=${limit}`,
          prev: page - 1 > 0 ? `/api/event?page=${page - 1}&limit=${limit}` : null,
          events: events.map((event) => {
            const { ...eventEntity } = EventEntity.fromObject(event);
            return eventEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createaAttendanceEvent(createAttendanceEventDto: AttendanceEventDto, user: UserEntity) {
    const { eventId, qrGuest } = createAttendanceEventDto;
    const eventExists = await prisma.attendanceEvents.findFirst({
      where: {
        eventId: eventId,
        guest: {
          codeQr: qrGuest,
        },
      },
      include: {
        guest: true,
      },
    });
    if (eventExists) throw CustomError.badRequest('El el registro ya existe');
    const guest = await prisma.guests.findFirst({
      where: {
        codeQr: qrGuest,
      },
    });
    if (!guest) throw CustomError.badRequest('No se pudo encontrar al invitado');
    try {
      const attendanceEvent = await prisma.attendanceEvents.create({
        data: {
          eventId: eventId,
          guestId: guest!.id,
          staffId: user.id,
        },
        include: {
          guest: {
            include:{
              user:true
            }
          },
          staff: {
            include:{
              user:true
            }
          },
        },
      });
      const { ...attendanceEventEntity } = AttendanceEventEntity.fromObject(attendanceEvent);
      return CustomSuccessful.response({ result: attendanceEventEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async createEvent(createEventDto: EventDto, user: UserEntity) {
    const { name, activities } = createEventDto;
    const eventExists = await prisma.events.findFirst({ where: { name: name } });
    if (eventExists) throw CustomError.badRequest('El evento ya existe');

    try {
      const event = await prisma.events.create({
        data: {
          ...createEventDto,
          activities: {
            create: activities,
          },
        },
        include: {
          activities: true,
          attendanceEvents: {
            include: {
              guest: {
                include:{
                  user:true
                }
              },
              staff: {
                include:{
                  user:true
                }
              },
            },
          },
        },
      });

      const { ...eventEntity } = EventEntity.fromObject(event);
      return CustomSuccessful.response({ result: eventEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateEvent(createEventDto: EventDto, user: UserEntity, eventId: number) {
    const { name, activities } = createEventDto;
    const existingEventWithName = await prisma.events.findFirst({
      where: {
        AND: [{ name: name }, { NOT: { id: eventId } }],
      },
    });
    if (existingEventWithName) throw CustomError.badRequest('Ya existe un evento con el mismo nombre');
    const eventExists = await prisma.events.findFirst({
      where: { id: eventId },
      include: {
        activities: true,
      },
    });
    if (!eventExists) throw CustomError.badRequest('El evento no existe');

    try {
      const event = await prisma.events.update({
        where: { id: eventId },
        data: {
          name,
          activities: {
            // disconnect: roleExists.permissions.map(permission => ({ id: permission.id })),
            // connect: permissions.map(permissionId => ({ id: permissionId }))
          },
        },
        include: {
          activities: true,
        },
      });
      const { ...eventEntity } = EventEntity.fromObject(event);
      return CustomSuccessful.response({ result: eventEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteEvent(user: UserEntity, eventId: number) {
    const eventExists = await prisma.events.findFirst({
      where: { id: eventId },
      include: {
        activities: true,
      },
    });
    if (!eventExists) throw CustomError.badRequest('El evento no existe');
    try {
      await prisma.events.update({
        where: { id: eventId },
        data: {
          state: false,
        },
        include: {
          activities: true,
        },
      });
      return CustomSuccessful.response({ message: 'Evento eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
