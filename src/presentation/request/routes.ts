import { Router } from 'express';
import { RequestController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RequestService } from '../services';

export class RequestRoutes {
  static get routes(): Router {
    const router = Router();
    const requestService = new RequestService();
    const controller = new RequestController(requestService);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getRequests);
    router.post('/', [AuthMiddleware.validateJWT], controller.createRequest);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteRequest);
    return router;
  }
}
