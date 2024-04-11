import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { PermissionRoutes } from './permission/routes';
import { RoleRoutes } from './role/routes';
import { StaffRoutes } from './staff/routes';
import { GuestRoutes } from './guest/routes';
import { TeacherRoutes } from './speaker/routes';
import { EventRoutes } from './event/routes';
import { AvailabilityRoutes } from './availability/routes';
import { RequestRoutes } from './request/routes';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    router.use('/api/auth', Authroutes.routes);
    router.use('/api/permission', PermissionRoutes.routes);
    router.use('/api/role', RoleRoutes.routes);
    router.use('/api/staff', StaffRoutes.routes);
    router.use('/api/guest', GuestRoutes.routes);
    router.use('/api/speaker', TeacherRoutes.routes);
    router.use('/api/event', EventRoutes.routes);
    router.use('/api/availability', AvailabilityRoutes.routes);
    router.use('/api/request',RequestRoutes.routes);

    return router;
  }
}
