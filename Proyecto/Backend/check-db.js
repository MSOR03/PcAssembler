import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    const count = await prisma.componente.count();
    console.log('Total components in database:', count);

    if (count > 0) {
      const sample = await prisma.componente.findFirst({
        select: {
          id_componente: true,
          nombre: true,
          categoria: true,
          precio: true
        }
      });
      console.log('Sample component:', sample);
    } else {
      console.log('Database is empty. Run the data insertion scripts.');
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
