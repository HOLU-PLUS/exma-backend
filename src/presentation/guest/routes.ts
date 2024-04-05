import { Router } from 'express';
import { GuestController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { GuestService } from '../services';

export class GuestRoutes {
  static get routes(): Router {

    const router = Router();
    const guestService = new GuestService();
    const controller = new GuestController(guestService);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getGuests);
    router.post('/', controller.createGuest);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateGuest);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteGuest)
    return router;
  }
}

