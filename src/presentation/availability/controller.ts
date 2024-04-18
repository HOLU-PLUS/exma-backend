import { Response, Request } from 'express';
import { CustomError, PaginationDto, AvailabilityDto } from '../../domain';
import { AvailabilityService } from '../services';

export class AvailabilityController {
  constructor(private readonly eventService: AvailabilityService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };
  
  getAvailabilitiesByGuest = async (req: Request, res: Response) => {
    this.eventService
      .getAvailabilitiesByGuest(req.params.codeQr)
      .then((availabilities) => res.json(availabilities))
      .catch((error) => this.handleError(error, res));
  };

  createAvailability = async (req: Request, res: Response) => {
    const [error, createAvailabilityDto] = await AvailabilityDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.eventService
      .createAvailability(createAvailabilityDto!, req.body.user)
      .then((availability) => res.status(201).json(availability))
      .catch((error) => this.handleError(error, res));
  };

  deleteAvailability = (req: Request, res: Response) => {
    this.eventService
      .deleteAvailability(req.body.user, parseInt(req.params.id))
      .then((availability) => res.status(201).json(availability))
      .catch((error) => this.handleError(error, res));
  };
}
