import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Script para actualizar la tabla de compatibilidad sin duplicar registros
// Primero limpia la tabla y luego inserta los nuevos datos

const compatibilidadData = [
  // ==================== AMD SOCKETS ====================
  
  // AM1 (2014-2015) - APU de bajo consumo
  { socket: 'AM1', chipset: 'AMD FS1b' },
  
  // AM3 (2009-2011) - Phenom II, Athlon II
  { socket: 'AM3', chipset: 'AMD 760G' },
  { socket: 'AM3', chipset: 'AMD 770' },
  { socket: 'AM3', chipset: 'AMD 785G' },
  { socket: 'AM3', chipset: 'AMD 790GX' },
  { socket: 'AM3', chipset: 'AMD 790FX' },
  { socket: 'AM3', chipset: 'AMD 870' },
  { socket: 'AM3', chipset: 'AMD 880G' },
  { socket: 'AM3', chipset: 'AMD 890GX' },
  { socket: 'AM3', chipset: 'AMD 890FX' },
  
  // AM3+ (2011-2014) - FX series
  { socket: 'AM3+', chipset: 'AMD 970' },
  { socket: 'AM3+', chipset: 'AMD 990X' },
  { socket: 'AM3+', chipset: 'AMD 990FX' },
  
  // AM4 (2016-2022) - Ryzen 1000-5000 series
  { socket: 'AM4', chipset: 'AMD A320' },
  { socket: 'AM4', chipset: 'AMD A520' },
  { socket: 'AM4', chipset: 'AMD B350' },
  { socket: 'AM4', chipset: 'AMD B450' },
  { socket: 'AM4', chipset: 'AMD B550' },
  { socket: 'AM4', chipset: 'AMD X370' },
  { socket: 'AM4', chipset: 'AMD X470' },
  { socket: 'AM4', chipset: 'AMD X570' },
  { socket: 'AM4', chipset: 'AMD X570S' },
  
  // AM5 (2022-presente) - Ryzen 7000, 9000 series
  { socket: 'AM5', chipset: 'AMD A620' },
  { socket: 'AM5', chipset: 'AMD B650' },
  { socket: 'AM5', chipset: 'AMD B650E' },
  { socket: 'AM5', chipset: 'AMD B840' },
  { socket: 'AM5', chipset: 'AMD B850' },
  { socket: 'AM5', chipset: 'AMD X670' },
  { socket: 'AM5', chipset: 'AMD X670E' },
  { socket: 'AM5', chipset: 'AMD X870' },
  { socket: 'AM5', chipset: 'AMD X870E' },
  
  // FM1 (2011) - APU A-Series
  { socket: 'FM1', chipset: 'AMD A55' },
  { socket: 'FM1', chipset: 'AMD A75' },
  
  // FM2 (2012-2014) - APU A-Series
  { socket: 'FM2', chipset: 'AMD A55' },
  { socket: 'FM2', chipset: 'AMD A75' },
  { socket: 'FM2', chipset: 'AMD A85X' },
  
  // FM2+ (2014-2015) - APU A-Series mejorados
  { socket: 'FM2+', chipset: 'AMD A55' },
  { socket: 'FM2+', chipset: 'AMD A68H' },
  { socket: 'FM2+', chipset: 'AMD A78' },
  { socket: 'FM2+', chipset: 'AMD A88X' },
  
  // TR4 / sTR4 (2017-2019) - Threadripper 1000-2000 series
  { socket: 'TR4', chipset: 'AMD X399' },
  { socket: 'sTR4', chipset: 'AMD X399' },
  
  // sTRX4 (2019-2020) - Threadripper 3000 series
  { socket: 'sTRX4', chipset: 'AMD TRX40' },
  
  // sWRX8 (2020-presente) - Threadripper PRO
  { socket: 'sWRX8', chipset: 'AMD WRX80' },
  
  // ==================== INTEL SOCKETS ====================
  
  // LGA775 (2004-2011) - Pentium 4, Core 2 Duo/Quad
  { socket: 'LGA775', chipset: 'Intel 945' },
  { socket: 'LGA775', chipset: 'Intel 965' },
  { socket: 'LGA775', chipset: 'Intel G31' },
  { socket: 'LGA775', chipset: 'Intel G33' },
  { socket: 'LGA775', chipset: 'Intel G35' },
  { socket: 'LGA775', chipset: 'Intel G41' },
  { socket: 'LGA775', chipset: 'Intel G43' },
  { socket: 'LGA775', chipset: 'Intel G45' },
  { socket: 'LGA775', chipset: 'Intel P35' },
  { socket: 'LGA775', chipset: 'Intel P43' },
  { socket: 'LGA775', chipset: 'Intel P45' },
  { socket: 'LGA775', chipset: 'Intel Q33' },
  { socket: 'LGA775', chipset: 'Intel Q35' },
  { socket: 'LGA775', chipset: 'Intel Q43' },
  { socket: 'LGA775', chipset: 'Intel Q45' },
  { socket: 'LGA775', chipset: 'Intel X38' },
  { socket: 'LGA775', chipset: 'Intel X48' },
  
  // LGA1150 (2013-2015) - 4th gen (Haswell), 5th gen (Broadwell)
  { socket: 'LGA1150', chipset: 'Intel H81' },
  { socket: 'LGA1150', chipset: 'Intel B85' },
  { socket: 'LGA1150', chipset: 'Intel Q85' },
  { socket: 'LGA1150', chipset: 'Intel Q87' },
  { socket: 'LGA1150', chipset: 'Intel H87' },
  { socket: 'LGA1150', chipset: 'Intel H97' },
  { socket: 'LGA1150', chipset: 'Intel Z87' },
  { socket: 'LGA1150', chipset: 'Intel Z97' },
  
  // LGA1151 (2015-2019) - 6th, 7th gen (Skylake, Kaby Lake) y 8th, 9th gen (Coffee Lake)
  { socket: 'LGA1151', chipset: 'Intel H110' },
  { socket: 'LGA1151', chipset: 'Intel B150' },
  { socket: 'LGA1151', chipset: 'Intel B250' },
  { socket: 'LGA1151', chipset: 'Intel B360' },
  { socket: 'LGA1151', chipset: 'Intel B365' },
  { socket: 'LGA1151', chipset: 'Intel H170' },
  { socket: 'LGA1151', chipset: 'Intel H270' },
  { socket: 'LGA1151', chipset: 'Intel H310' },
  { socket: 'LGA1151', chipset: 'Intel H370' },
  { socket: 'LGA1151', chipset: 'Intel Q150' },
  { socket: 'LGA1151', chipset: 'Intel Q170' },
  { socket: 'LGA1151', chipset: 'Intel Q250' },
  { socket: 'LGA1151', chipset: 'Intel Q270' },
  { socket: 'LGA1151', chipset: 'Intel Q370' },
  { socket: 'LGA1151', chipset: 'Intel Z170' },
  { socket: 'LGA1151', chipset: 'Intel Z270' },
  { socket: 'LGA1151', chipset: 'Intel Z370' },
  { socket: 'LGA1151', chipset: 'Intel Z390' },
  
  // LGA1155 (2011-2013) - 2nd gen (Sandy Bridge), 3rd gen (Ivy Bridge)
  { socket: 'LGA1155', chipset: 'Intel H61' },
  { socket: 'LGA1155', chipset: 'Intel B65' },
  { socket: 'LGA1155', chipset: 'Intel B75' },
  { socket: 'LGA1155', chipset: 'Intel Q65' },
  { socket: 'LGA1155', chipset: 'Intel Q67' },
  { socket: 'LGA1155', chipset: 'Intel Q75' },
  { socket: 'LGA1155', chipset: 'Intel Q77' },
  { socket: 'LGA1155', chipset: 'Intel H67' },
  { socket: 'LGA1155', chipset: 'Intel H77' },
  { socket: 'LGA1155', chipset: 'Intel P67' },
  { socket: 'LGA1155', chipset: 'Intel Z68' },
  { socket: 'LGA1155', chipset: 'Intel Z75' },
  { socket: 'LGA1155', chipset: 'Intel Z77' },
  
  // LGA1156 (2009-2011) - 1st gen (Nehalem, Clarkdale)
  { socket: 'LGA1156', chipset: 'Intel H55' },
  { socket: 'LGA1156', chipset: 'Intel H57' },
  { socket: 'LGA1156', chipset: 'Intel P55' },
  { socket: 'LGA1156', chipset: 'Intel Q57' },
  
  // LGA1200 (2020-2021) - 10th gen (Comet Lake), 11th gen (Rocket Lake)
  { socket: 'LGA1200', chipset: 'Intel H410' },
  { socket: 'LGA1200', chipset: 'Intel B460' },
  { socket: 'LGA1200', chipset: 'Intel B560' },
  { socket: 'LGA1200', chipset: 'Intel H470' },
  { socket: 'LGA1200', chipset: 'Intel H510' },
  { socket: 'LGA1200', chipset: 'Intel H570' },
  { socket: 'LGA1200', chipset: 'Intel Q470' },
  { socket: 'LGA1200', chipset: 'Intel W480' },
  { socket: 'LGA1200', chipset: 'Intel Z490' },
  { socket: 'LGA1200', chipset: 'Intel Z590' },
  
  // LGA1700 (2021-presente) - 12th, 13th, 14th gen (Alder Lake, Raptor Lake)
  { socket: 'LGA1700', chipset: 'Intel B660' },
  { socket: 'LGA1700', chipset: 'Intel B760' },
  { socket: 'LGA1700', chipset: 'Intel H610' },
  { socket: 'LGA1700', chipset: 'Intel H670' },
  { socket: 'LGA1700', chipset: 'Intel H770' },
  { socket: 'LGA1700', chipset: 'Intel Q670' },
  { socket: 'LGA1700', chipset: 'Intel W680' },
  { socket: 'LGA1700', chipset: 'Intel Z690' },
  { socket: 'LGA1700', chipset: 'Intel Z790' },
  
  // LGA1851 (2024-futuro) - 15th gen (Arrow Lake) y posteriores
  { socket: 'LGA1851', chipset: 'Intel B860' },
  { socket: 'LGA1851', chipset: 'Intel H810' },
  { socket: 'LGA1851', chipset: 'Intel Z890' },
  
  // LGA2011 (2011-2014) - Sandy Bridge-E, Ivy Bridge-E
  { socket: 'LGA2011', chipset: 'Intel X79' },
  
  // LGA2011-3 (2014-2016) - Haswell-E, Broadwell-E
  { socket: 'LGA2011-3', chipset: 'Intel X99' },
  
  // LGA2066 (2017-2019) - Skylake-X, Cascade Lake-X
  { socket: 'LGA2066', chipset: 'Intel X299' },
  
  // LGA3647 (2017-presente) - Xeon Scalable (Server)
  { socket: 'LGA3647', chipset: 'Intel C621' },
  { socket: 'LGA3647', chipset: 'Intel C622' },
  { socket: 'LGA3647', chipset: 'Intel C624' },
  { socket: 'LGA3647', chipset: 'Intel C627' },
  { socket: 'LGA3647', chipset: 'Intel C628' },
  { socket: 'LGA3647', chipset: 'Intel C629' }
];

async function updateCompatibilidad() {
  try {
    console.log('🗑️  Limpiando tabla de compatibilidad anterior...');
    
    // Eliminar todos los registros existentes
    const deleted = await prisma.compatibilidadSocketChipset.deleteMany({});
    console.log(`✅ ${deleted.count} registros eliminados`);

    console.log('📥 Insertando nueva tabla de compatibilidad...');
    
    // Insertar los nuevos registros
    for (const data of compatibilidadData) {
      await prisma.compatibilidadSocketChipset.create({
        data,
      });
    }
    
    console.log(`✅ ${compatibilidadData.length} registros insertados exitosamente`);
    console.log('🎉 Tabla de compatibilidad actualizada correctamente');
    
    // Mostrar resumen por socket
    const sockets = [...new Set(compatibilidadData.map(d => d.socket))];
    console.log(`\n📊 Resumen: ${sockets.length} sockets con compatibilidad definida`);
    console.log('Sockets incluidos:', sockets.sort().join(', '));
    
  } catch (error) {
    console.error('❌ Error al actualizar la tabla de compatibilidad:', error);
    throw error;
  }
}

updateCompatibilidad()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
