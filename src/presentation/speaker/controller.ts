import { Response, Request } from 'express';
import { CustomError, PaginationDto, SpeakerDto } from '../../domain';
import { SpeakerService } from '../services';

export class SpeakerController {

  constructor(
    private readonly speakerService: SpeakerService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getSpeakers = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.speakerService.getSpeakers(paginationDto!)
      .then(speakers => res.json(speakers))
      .catch(error => this.handleError(error, res));
  };

  createSpeaker = (req: Request, res: Response) => {

    const [error, createTeacherDto] = SpeakerDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.speakerService.createSpeaker(createTeacherDto!, req.body.user)
      .then(speaker => res.status(201).json(speaker))
      .catch(error => this.handleError(error, res));

  };

  updateSpeaker = (req: Request, res: Response) => {

    const [error, updateTeacherDto] = SpeakerDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.speakerService.updateSpeaker(updateTeacherDto!, req.body.user, parseInt(req.params.id))
      .then(speaker => res.status(201).json(speaker))
      .catch(error => this.handleError(error, res));

  };

  deleteSpeaker = (req: Request, res: Response) => {

    this.speakerService.deleteSpeaker(req.body.user, parseInt(req.params.id))
      .then(speaker => res.status(201).json(speaker))
      .catch(error => this.handleError(error, res));

  };
}