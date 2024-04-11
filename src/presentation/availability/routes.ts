import { Router } from 'express';
import { AvailabilityController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AvailabilityService } from '../services';

export class AvailabilityRoutes {
  static get routes(): Router {
    const router = Router();
    const availabilityService = new AvailabilityService();
    const controller = new AvailabilityController(availabilityService);

    // rutas
    router.get('/:id', [AuthMiddleware.validateJWT], controller.getAvailabilities);
    router.post('/', [AuthMiddleware.validateJWT], controller.createAvailability);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteAvailability);
    return router;
  }
}
