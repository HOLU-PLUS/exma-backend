import { Router } from 'express';
import { StaffController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { StaffService } from '../services';

export class StaffRoutes {
  static get routes(): Router {

    const router = Router();
    const staffService = new StaffService();
    const controller = new StaffController(staffService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getStaffs );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createStaff );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateStaff );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteStaff )
    return router;
  }
}

