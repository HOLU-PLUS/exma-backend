import { PrismaClient } from '@prisma/client';
import { EventDto, CustomError, PaginationDto, EventEntity, UserEntity, AttendanceEventDto, AttendanceEvent } from '../../domain';

const prisma = new PrismaClient();

export class EventService {

  constructor() { }

  async getEvents(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, events] = await Promise.all([
        prisma.events.count({ where: { state: true } }),
        prisma.events.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true
          },
          include: {
            activities: true
          }
        }),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/event?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/event?page=${(page - 1)}&limit=${limit}` : null,
        events: events.map(event => {
          const { ...eventEntity } = EventEntity.fromObject(event);
          return eventEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createaAttendanceEvent(createAttendanceEventDto: AttendanceEventDto, user: UserEntity) {
    const { eventId, qrGuest } = createAttendanceEventDto;
    const eventExists = await prisma.attendanceEvents.findFirst({
      where: {
        eventId: eventId,
        guests: {
          codeQr: qrGuest
        }
      },
      include:{
        guests:true
      }
    });
    if (eventExists) throw CustomError.badRequest('El el registro ya existe');
    console.log(eventExists)
    const guest = await prisma.guests.findFirst({
      where:{
        codeQr:qrGuest
      }
    })
    if(!guest)throw CustomError.badRequest('Esta mal el QR');
    try {
      
      const newAttendanceEvent = await prisma.attendanceEvents.create({
        data: {
          eventId:eventId,
          guestId: guest!.id,
          staffId: user.id
        },
        include:{
          guests:true,
          staff:true,
          event:true,
        }
      });
      // const { ...attendanceEvent } = AttendanceEvent.fromObject(newAttendanceEvent!);
      return newAttendanceEvent;

    } catch (error) {
      console.log('ERRORRRRR');
      console.log(error);
      throw CustomError.internalServer(`${error}`);
    }
  }

  async createEvent(createEventDto: EventDto, user: UserEntity) {
    const { name, price, start, end, activities } = createEventDto;
    const eventExists = await prisma.events.findFirst({ where: { name: name } });
    if (eventExists) throw CustomError.badRequest('El evento ya existe');

    try {
      const event = await prisma.events.create({
        data: {
          name,
          price,
          start,
          end,
        },
      });
      if (activities && activities.length > 0) {
        await prisma.events.update({
          where: { id: event.id },
          data: {
            activities: {
              connect: activities.map(activity => ({ id: activity })),
            },
          },
        });
      }
      const eventCreate = await prisma.events.findFirst({
        where: {
          id: event.id
        },
        include: {
          activities: true
        }
      });

      const { ...eventEntity } = EventEntity.fromObject(eventCreate!);
      return eventEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateEvent(createEventDto: EventDto, user: UserEntity, eventId: number) {
    const { name, activities } = createEventDto;
    const existingEventWithName = await prisma.events.findFirst({
      where: {
        AND: [
          { name: name },
          { NOT: { id: eventId } },
        ],
      },
    });
    if (existingEventWithName) throw CustomError.badRequest('Ya existe un evento con el mismo nombre');
    const eventExists = await prisma.events.findFirst({
      where: { id: eventId },
      include: {
        activities: true
      }
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
          activities: true
        }
      });
      return EventEntity.fromObject(event);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteEvent(user: UserEntity, eventId: number) {
    const eventExists = await prisma.events.findFirst({
      where: { id: eventId },
      include: {
        activities: true
      }
    });
    if (!eventExists) throw CustomError.badRequest('El evento no existe');
    try {
      await prisma.events.update({
        where: { id: eventId },
        data: {
          state: false,
          activities: {
            // disconnect: roleExists.permissions.map(permission => ({ id: permission.id })),
          },
        },
        include: {
          activities: true
        }
      });

      return { msg: 'Evento eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


