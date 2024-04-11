import { Response, Request } from 'express';
import { CustomError, PaginationDto, RequestDto } from '../../domain';
import { RequestService } from '../services';

export class RequestController {
  constructor(private readonly eventService: RequestService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getRequests = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.eventService
      .getRequests(paginationDto!,req.body.user)
      .then((requests) => res.json(requests))
      .catch((error) => this.handleError(error, res));
  };

  createRequest = async (req: Request, res: Response) => {
    const [error, createRequestDto] = await RequestDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.eventService
      .createRequest(createRequestDto!, req.body.user)
      .then((request) => res.status(201).json(request))
      .catch((error) => this.handleError(error, res));
  };

  deleteRequest = (req: Request, res: Response) => {
    this.eventService
      .deleteRequest(req.body.user, parseInt(req.params.id))
      .then((request) => res.status(201).json(request))
      .catch((error) => this.handleError(error, res));
  };
}
