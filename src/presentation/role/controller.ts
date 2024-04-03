import { Response, Request } from 'express';
import { RoleDto, CustomError, PaginationDto } from '../../domain';
import { RoleService } from '../services';




export class RoleController {

  constructor(
    private readonly roleService: RoleService,
  ) { }

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  getRoles = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.roleService.getRoles(paginationDto!)
      .then(roles => res.json(roles))
      .catch(error => this.handleError(error, res));
  };

  createRole = (req: Request, res: Response) => {

    const [error, createRoleDto] = RoleDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.roleService.createRole(createRoleDto!, req.body.user)
      .then(role => res.status(201).json(role))
      .catch(error => this.handleError(error, res));

  };

  updateRole = (req: Request, res: Response) => {

    const [error, createRoleDto] = RoleDto.body(req.body);
    if (error) return res.status(400).json({ error });

    this.roleService.updateRole(createRoleDto!, req.body.user, parseInt(req.params.id))
      .then(role => res.status(201).json(role))
      .catch(error => this.handleError(error, res));

  };

  deleteRole = (req: Request, res: Response) => {

    this.roleService.deleteRole(req.body.user, parseInt(req.params.id))
      .then(role => res.status(201).json(role))
      .catch(error => this.handleError(error, res));

  };
}