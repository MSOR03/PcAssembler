import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEnsambles() {
  try {
    const ensambles = await prisma.ensamble.findMany({
      include: {
        Ensamble_Componente: true
      }
    });
    console.log('Ensambles encontrados:', ensambles.length);
    if (ensambles.length > 0) {
      console.log('Primer ensamble:', JSON.stringify(ensambles[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnsambles();
