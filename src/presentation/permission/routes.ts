import { Router } from 'express';
import { PermissionController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { PermissionService } from '../services';

export class PermissionRoutes {
  static get routes(): Router {

    const router = Router();
    const permissionService = new PermissionService();
    const controller = new PermissionController(permissionService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getPermissions );
    return router;
  }
}

