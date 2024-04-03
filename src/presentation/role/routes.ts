import { Router } from 'express';
import { RoleController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleService } from '../services';

export class RoleRoutes {
  static get routes(): Router {

    const router = Router();
    const roleService = new RoleService();
    const controller = new RoleController(roleService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getRoles );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createRole );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateRole );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteRole )
    return router;
  }
}

