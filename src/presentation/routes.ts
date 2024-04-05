import { Router } from 'express';

import { Authroutes } from './auth/routes';
import { PermissionRoutes } from './permission/routes';
import { RoleRoutes } from './role/routes';
import { StaffRoutes } from './staff/routes';
import { GuestRoutes } from './guest/routes';
import { TeacherRoutes } from './speaker/routes';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    router.use('/api/auth', Authroutes.routes);
    router.use('/api/permission', PermissionRoutes.routes);
    router.use('/api/role', RoleRoutes.routes);
    router.use('/api/staff', StaffRoutes.routes);
    router.use('/api/guest', GuestRoutes.routes);
    router.use('/api/speaker', TeacherRoutes.routes);

    return router;
  }
}
