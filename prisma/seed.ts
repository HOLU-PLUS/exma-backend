import { PrismaClient } from '@prisma/client';
import { bcryptAdapter } from '../src/config';


async function main() {
  const prisma = new PrismaClient();

  try {

    const user = await prisma.users.create({
      data: {
        name: 'Moises',
        lastName: 'Ochoa',
        email: 'moisic.mo@gmail.com',
        phone: '59173735766',
        password: bcryptAdapter.hash('8312915'),
        emailValidated: true,
      },
    });

    const role = await prisma.roles.create({
      data: {
        name: 'administrador',
        permissions: {
          create: [
            {
              name: 'crear',
              module: 'crear'
            },
            {
              name: 'editar',
              module: 'editar'
            }
          ]
        }
      }
    });

    await prisma.staffs.create({
      data: {
        userId: user.id,
        roleId: role.id,
        superStaff: true
      },
    });

    console.log('Datos de semilla insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos de semilla:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
