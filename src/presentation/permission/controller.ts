import { Response, Request } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { PermissionService } from '../services';




export class PermissionController {

  constructor(
    private readonly permissionService: PermissionService,
  ) { }

  private handleError = ( error: unknown, res: Response ) => {
    if ( error instanceof CustomError ) {
      return res.status( error.statusCode ).json( { error: error.message } );
    }

    console.log( `${ error }` );
    return res.status( 500 ).json( { error: 'Internal server error' } );
  };

  getPermissions = async ( req: Request, res: Response ) => {

    const { page = 1, limit = 10 } = req.query;
    const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
    if ( error ) return res.status(400).json({ error });
    
    this.permissionService.getPermissions( paginationDto! )
      .then( permissions => res.json( permissions ))
      .catch( error => this.handleError( error, res ) );

  };
}