import { PrismaClient } from '@prisma/client';
import { RoleDto, CustomError, PaginationDto, RoleEntity, UserEntity } from '../../domain';

const prisma = new PrismaClient();

export class RoleService {

  constructor() { }

  async getRoles(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, roles] = await Promise.all([
        prisma.roles.count({ where: { state: true } }),
        prisma.roles.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where:{
            state:true
          },
          include: {
            permissions: true
          }
        }),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/role?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/role?page=${(page - 1)}&limit=${limit}` : null,
        roles: roles.map(role => {
          const { ...roleEntity } = RoleEntity.fromObject(role);
          return roleEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createRole(createRoleDto: RoleDto, user: UserEntity) {
    const { name, permissions } = createRoleDto;
    const roleExists = await prisma.roles.findFirst({ where: { name: name } });
    if (roleExists) throw CustomError.badRequest('El rol ya existe');

    try {
      const role = await prisma.roles.create({
        data: {
          name: name,
        },
      });
      // Asociar los permisos al nuevo rol
      if (permissions && permissions.length > 0) {
        await prisma.roles.update({
          where: { id: role.id },
          data: {
            permissions: {
              connect: permissions.map(permissionId => ({ id: permissionId })),
            },
          },
        });
      }
      const roleCreate = await prisma.roles.findFirst({
        where: {
          id: role.id
        },
        include: {
          permissions: true
        }
      });

      const { ...roleEntity } = RoleEntity.fromObject(roleCreate!);
      return roleEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateRole(createRoleDto: RoleDto, user: UserEntity, roleId: number) {
    const { name, permissions } = createRoleDto;
    const existingRoleWithName = await prisma.roles.findFirst({
      where: {
        AND: [
          { name: name },
          { NOT: { id: roleId } },
        ],
      },
    });
    if (existingRoleWithName) throw CustomError.badRequest('Ya existe un rol con el mismo nombre');
    const roleExists = await prisma.roles.findFirst({
      where: { id: roleId },
      include: {
        permissions: true
      }
    });
    if (!roleExists) throw CustomError.badRequest('El rol no existe');

    try {
      const role = await prisma.roles.update({
        where: { id: roleId },
        data: {
          name,
          permissions: {
            disconnect: roleExists.permissions.map(permission => ({ id: permission.id })),
            connect: permissions.map(permissionId => ({ id: permissionId }))
          },
        },
        include: {
          permissions: true
        }
      });
      return RoleEntity.fromObject(role);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteRole(user: UserEntity, roleId: number) {
    const roleExists = await prisma.roles.findFirst({
      where: { id: roleId },
      include: {
        permissions: true
      }
    });
    if (!roleExists) throw CustomError.badRequest('El rol no existe');
    try {
      await prisma.roles.update({
        where: { id: roleId },
        data: {
          state: false,
          permissions: {
            disconnect: roleExists.permissions.map(permission => ({ id: permission.id })),
          },
        },
        include: {
          permissions: true
        }
      });

      return { msg: 'Rol eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


