import { Router } from 'express';
import { envs } from '../../config/envs';
import { AuthController } from './controller';
import { AuthService, EmailService } from './../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class Authroutes {

  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const authService = new AuthService(emailService);

    const controller = new AuthController(authService);
    
    // Definir las rutas
    router.post('/', controller.loginUser );
    router.post('/guest', controller.loginGuest );
    
    router.post('/validate-email',[AuthMiddleware.validateJWT],controller.validateEmail);

    return router;
  }

}

