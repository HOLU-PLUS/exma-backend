import { Response, Request } from 'express';
import { EventDto, CustomError, PaginationDto, AttendanceDto } from '../../domain';
import { EventService } from '../services';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getEvents = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.eventService
      .getEvents(paginationDto!)
      .then((roles) => res.json(roles))
      .catch((error) => this.handleError(error, res));
  };

  getAllGuest = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });
    this.eventService
      .getAllGuest(paginationDto!,req.body.user, parseInt(req.params.id))
      .then((event) => res.status(201).json(event))
      .catch((error) => this.handleError(error, res));
  };

  createEvent = async (req: Request, res: Response) => {
    const [error, createEventDto] = await EventDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.eventService
      .createEvent(createEventDto!, req.body.user)
      .then((event) => res.status(201).json(event))
      .catch((error) => this.handleError(error, res));
  };

  attendance = (req: Request, res: Response) => {
    const [error, createAttendanceEvent] = AttendanceDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.eventService
      .createAttendance(createAttendanceEvent!, req.body.user)
      .then((attendanceEvent) => res.status(201).json(attendanceEvent))
      .catch((error) => this.handleError(error, res));
  };

  updateEvent = async (req: Request, res: Response) => {
    const [error, createEventDto] = await EventDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.eventService
      .updateEvent(createEventDto!, req.body.user, parseInt(req.params.id))
      .then((event) => res.status(201).json(event))
      .catch((error) => this.handleError(error, res));
  };

  deleteEvent = (req: Request, res: Response) => {
    this.eventService
      .deleteEvent(req.body.user, parseInt(req.params.id))
      .then((event) => res.status(201).json(event))
      .catch((error) => this.handleError(error, res));
  };
}
