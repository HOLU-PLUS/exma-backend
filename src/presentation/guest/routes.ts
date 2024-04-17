import { Router } from 'express';
import { GuestController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AuthService, EmailService, GuestService } from '../services';
import { envs } from '../../config';

export class GuestRoutes {
  static get routes(): Router {
    const router = Router();
    
    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const authService = new AuthService(emailService);
    const guestService = new GuestService(authService);
    const controller = new GuestController(guestService);

    // rutas
    router.get('/', [AuthMiddleware.validateJWT], controller.getGuests);
    router.get('/:codeQr',controller.getGuest)
    router.post('/', controller.createGuest);
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateGuest);
    router.delete('/:id', [AuthMiddleware.validateJWT], controller.deleteGuest);
    return router;
  }
}
