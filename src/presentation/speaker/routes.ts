import { Router } from 'express';
import { SpeakerController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { SpeakerService } from '../services';

export class TeacherRoutes {
  static get routes(): Router {

    const router = Router();
    const speakerService = new SpeakerService();
    const controller = new SpeakerController(speakerService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getSpeakers );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createSpeaker );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateSpeaker );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteSpeaker )
    return router;
  }
}

