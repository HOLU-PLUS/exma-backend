import { Router } from 'express';
import { EventController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { EventService } from '../services';

export class EventRoutes {
  static get routes(): Router {
    const router = Router();
    const eventService = new EventService();
    const controller = new EventController(eventService);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getEvents);
    router.post('/', [AuthMiddleware.validateJWT], controller.createEvent);
    router.post('/attendance', [AuthMiddleware.validateJWT], controller.attendance);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateEvent);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteEvent);
    return router;
  }
}
