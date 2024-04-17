import { Response, Request } from 'express';
import { CustomError, PaginationDto, GuestDto } from '../../domain';
import { GuestService } from '../services';

export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getGuests = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.guestService
      .getGuests(paginationDto!)
      .then((guests) => res.json(guests))
      .catch((error) => this.handleError(error, res));
  };

  getGuest = async (req: Request, res: Response) => {
    this.guestService
      .getGuest(req.params.codeQr)
      .then((guest) => res.json(guest))
      .catch((error) => this.handleError(error, res));
  };

  createGuest = (req: Request, res: Response) => {
    const [error, createStudentDto] = GuestDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.guestService
      .createGuest(createStudentDto!)
      .then((guest) => res.status(201).json(guest))
      .catch((error) => this.handleError(error, res));
  };

  updateGuest = (req: Request, res: Response) => {
    const [error, updateStudentDto] = GuestDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.guestService
      .updateGuest(updateStudentDto!, req.body.user, parseInt(req.params.id))
      .then((guest) => res.status(201).json(guest))
      .catch((error) => this.handleError(error, res));
  };

  deleteGuest = (req: Request, res: Response) => {
    this.guestService
      .deleteGuest(req.body.user, parseInt(req.params.id))
      .then((guest) => res.status(201).json(guest))
      .catch((error) => this.handleError(error, res));
  };
}
