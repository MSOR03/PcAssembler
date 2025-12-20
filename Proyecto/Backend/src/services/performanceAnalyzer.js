/**
 * Servicio de análisis de rendimiento basado SOLO en especificaciones
 * NO usa IA - Todo es lógica pura basada en datos
 */

/**
 * Extrae valores numéricos de strings con unidades
 */
const parseNumeric = (value) => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;
  const match = value.replace(/,/g, '').match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
};

/**
 * Analiza CPU y calcula tier/score
 */
export const analyzeCPU = (cpu) => {
  if (!cpu?.especificaciones) {
    return { score: 0, tier: 'F', status: 'error', message: '❌ Sin información de CPU' };
  }

  const specs = cpu.especificaciones;
  let score = 0;
  const issues = [];

  // Cores (0-35 puntos)
  const cores = parseNumeric(specs['Core Count'] || specs['# of CPU Cores'] || '0');
  if (cores >= 16) score += 35;
  else if (cores >= 12) score += 30;
  else if (cores >= 8) score += 25;
  else if (cores >= 6) score += 18;
  else if (cores >= 4) score += 12;
  else { score += 5; issues.push('Pocos núcleos para multitarea'); }

  // Frecuencia (0-30 puntos)
  const boostFreq = parseNumeric(specs['Performance Core Boost Clock'] || specs['Boost Clock'] || specs['Max Turbo Frequency'] || '0');
  if (boostFreq >= 5.0) score += 30;
  else if (boostFreq >= 4.5) score += 25;
  else if (boostFreq >= 4.0) score += 20;
  else if (boostFreq >= 3.5) score += 15;
  else { score += 8; issues.push('Frecuencia limitada'); }

  // TDP - Thermal Analysis (0-20 puntos)
  const tdp = parseNumeric(specs['TDP'] || '0');
  let thermalRisk = 'bajo';
  if (tdp > 180) {
    score += 8;
    thermalRisk = 'extremo';
    issues.push('⚠️ TDP EXTREMO - Riesgo alto de thermal throttling');
  } else if (tdp > 140) {
    score += 12;
    thermalRisk = 'severo';
    issues.push('⚠️ TDP Alto - Requiere enfriamiento premium');
  } else if (tdp > 105) {
    score += 16;
    thermalRisk = 'medio';
    // No agregar issue, es normal para CPUs modernos
  } else {
    score += 20;
    thermalRisk = 'bajo';
  }

  // Cache (0-15 puntos)
  const l3Cache = parseNumeric(specs['L3 Cache'] || '0');
  if (l3Cache >= 32) score += 15;
  else if (l3Cache >= 16) score += 12;
  else if (l3Cache >= 8) score += 9;
  else score += 5;

  // Tier calculation
  let tier = 'F';
  let status = 'error';
  if (score >= 85) { tier = 'S'; status = 'excelente'; }
  else if (score >= 75) { tier = 'A'; status = 'muy_bueno'; }
  else if (score >= 60) { tier = 'B'; status = 'bueno'; }
  else if (score >= 45) { tier = 'C'; status = 'aceptable'; }
  else if (score >= 30) { tier = 'D'; status = 'limitado'; }

  return {
    score: Math.round(score),
    tier,
    status,
    message: getStatusMessage(status, 'CPU'),
    thermalRisk,
    issues,
    specs: { cores, boostFreq, tdp, l3Cache }
  };
};

/**
 * Analiza GPU y calcula tier/score
 */
export const analyzeGPU = (gpu) => {
  if (!gpu?.especificaciones) {
    return { score: 0, tier: 'F', status: 'error', message: '❌ Sin información de GPU' };
  }

  const specs = gpu.especificaciones;
  let score = 0;
  const issues = [];

  // VRAM (0-40 puntos)
  const vram = parseNumeric(specs['Memory'] || specs['VRAM'] || specs['Video Memory'] || '0');
  if (vram >= 16) score += 40;
  else if (vram >= 12) score += 35;
  else if (vram >= 8) score += 28;
  else if (vram >= 6) score += 20;
  else if (vram >= 4) score += 12;
  else { score += 6; issues.push('VRAM insuficiente para gaming moderno'); }

  // Series/Generation (0-35 puntos)
  const name = gpu.nombre.toLowerCase();
  if (name.includes('rtx 4090') || name.includes('rx 7900 xtx')) score += 35;
  else if (name.includes('rtx 4080') || name.includes('rx 7900')) score += 32;
  else if (name.includes('rtx 4070') || name.includes('rtx 3090')) score += 28;
  else if (name.includes('rtx 4060') || name.includes('rtx 3080')) score += 24;
  else if (name.includes('rtx 3070') || name.includes('rx 6800')) score += 20;
  else if (name.includes('rtx 3060') || name.includes('rx 6700')) score += 16;
  else if (name.includes('rtx 3050') || name.includes('gtx 1660') || name.includes('rx 6600')) score += 13; // RTX 3050 es gama baja pero NO antigua
  else if (name.includes('gtx 1650') || name.includes('rx 5600')) score += 10;
  else { score += 6; issues.push('GPU de generación antigua'); }

  // Clock Speed (0-15 puntos)
  const boostClock = parseNumeric(specs['Boost Clock'] || '0');
  if (boostClock >= 2500) score += 15;
  else if (boostClock >= 2000) score += 12;
  else if (boostClock >= 1800) score += 9;
  else score += 5;

  // TDP/Power (0-10 puntos)
  const tdp = parseNumeric(specs['TDP'] || '0');
  let powerRisk = 'bajo';
  if (tdp > 400) {
    score += 4;
    powerRisk = 'extremo';
    issues.push('⚠️ Consumo EXTREMO - PSU de alto wattage requerida');
  } else if (tdp > 300) {
    score += 6;
    powerRisk = 'severo';
    issues.push('⚠️ Alto consumo - Verificar PSU');
  } else if (tdp > 200) {
    score += 8;
    powerRisk = 'medio';
  } else {
    score += 10;
    powerRisk = 'bajo';
  }

  let tier = 'F';
  let status = 'error';
  if (score >= 85) { tier = 'S'; status = 'excelente'; }
  else if (score >= 75) { tier = 'A'; status = 'muy_bueno'; }
  else if (score >= 60) { tier = 'B'; status = 'bueno'; }
  else if (score >= 45) { tier = 'C'; status = 'aceptable'; }
  else if (score >= 30) { tier = 'D'; status = 'limitado'; }

  return {
    score: Math.round(score),
    tier,
    status,
    message: getStatusMessage(status, 'GPU'),
    powerRisk,
    issues,
    specs: { vram, boostClock, tdp }
  };
};

/**
 * Detecta desperdicio de presupuesto (componentes sobredimensionados)
 */
export const detectBudgetWaste = (cpu, gpu, ram, psu) => {
  const issues = [];
  
  // RAM excesiva para gaming/uso estándar
  if (ram.specs.capacity >= 64 && gpu.score < 75) {
    issues.push('💸 RAM excesiva (64GB) para el nivel de GPU - considera 32GB y reinvertir en GPU');
  } else if (ram.specs.capacity >= 48 && gpu.score < 65) {
    issues.push('💸 RAM elevada para gaming estándar - 32GB es suficiente');
  }
  
  // PSU muy sobredimensionada
  if (psu.sufficient && psu.specs.wattage) {
    const overhead = ((psu.specs.wattage - psu.specs.totalTDP) / psu.specs.totalTDP) * 100;
    if (overhead > 150) {
      issues.push(`💸 PSU muy sobredimensionada (${psu.specs.wattage}W para ~${psu.specs.totalTDP}W) - considera 650-750W`);
    }
  }
  
  // CPU ultra gama con GPU gama media-baja
  if (cpu.score >= 85 && gpu.score < 70) {
    issues.push('💸 CPU de ultra gama desperdiciado con GPU de gama media - rebalancea presupuesto');
  } else if (cpu.score >= 80 && gpu.score < 60) {
    issues.push('💸 CPU premium con GPU básica - invierte más en GPU para mejor experiencia');
  }
  
  return {
    hasWaste: issues.length > 0,
    issues,
    severity: issues.length >= 3 ? 'alto' : issues.length >= 2 ? 'medio' : 'bajo'
  };
};

/**
 * Detecta BOTTLENECK entre CPU y GPU
 */
export const detectBottleneck = (cpuAnalysis, gpuAnalysis) => {
  if (!cpuAnalysis || !gpuAnalysis) {
    return { level: 'ninguno', severity: 'ninguno', message: '' };
  }

  const diff = Math.abs(cpuAnalysis.score - gpuAnalysis.score);
  const weak = cpuAnalysis.score < gpuAnalysis.score ? 'CPU' : 'GPU';
  
  // Umbrales más realistas: 10-15% es normal, no un problema
  if (diff > 35) {
    return {
      level: 'extremo',
      severity: 'extremo',
      component: weak,
      message: `🚨 BOTTLENECK EXTREMO: ${weak} limitará severamente el rendimiento`,
      recommendation: `${weak} es muy débil para el resto del sistema. Considera actualizar urgentemente.`
    };
  } else if (diff > 25) {
    return {
      level: 'severo',
      severity: 'severo',
      component: weak,
      message: `⚠️ BOTTLENECK SEVERO: ${weak} reducirá notablemente el rendimiento`,
      recommendation: `${weak} creará cuello de botella significativo. Actualización recomendada.`
    };
  } else if (diff > 15) {
    return {
      level: 'medio',
      severity: 'medio',
      component: weak,
      message: `⚠️ Desbalance Moderado: ${weak} podría limitar en cargas pesadas`,
      recommendation: `Sistema funcional pero ${weak} es el punto más débil.`
    };
  } else if (diff > 8) {
    return {
      level: 'bajo',
      severity: 'bajo',
      component: weak,
      message: `✅ Balance bueno con ligera diferencia natural`,
      recommendation: 'Diferencia normal y esperada en sistemas reales.'
    };
  }

  return {
    level: 'ninguno',
    severity: 'ninguno',
    message: '✅ Balance Óptimo entre CPU y GPU',
    recommendation: 'Excelente equilibrio de componentes.'
  };
};

/**
 * Analiza RAM
 */
export const analyzeRAM = (ram) => {
  if (!ram?.especificaciones) {
    return { score: 0, tier: 'F', status: 'error', message: '❌ Sin información de RAM' };
  }

  const specs = ram.especificaciones;
  const name = (ram.nombre || '').toLowerCase();
  let score = 0;
  const issues = [];

  // Capacity (0-35 puntos) - Buscar en múltiples campos y en el nombre
  let capacity = 0;
  const capacityField = specs['Capacity'] || specs['Total Capacity'] || specs['capacity'] || '';
  
  // Intentar primero el campo directo
  if (capacityField) {
    const match = capacityField.match(/(\d+)\s*GB/i);
    if (match) capacity = parseFloat(match[1]);
  }
  
  // Si no hay campo directo, calcular desde Modules (ej: "2 x 16GB")
  if (capacity === 0 && specs['Modules']) {
    const modulesMatch = specs['Modules'].match(/(\d+)\s*x\s*(\d+)\s*GB/i);
    if (modulesMatch) {
      capacity = parseInt(modulesMatch[1]) * parseInt(modulesMatch[2]);
    }
  }
  
  // Si aún no se encontró, buscar en el nombre
  if (capacity === 0 && name) {
    const capacityMatch = name.match(/(\d+)\s*gb/i);
    if (capacityMatch) capacity = parseFloat(capacityMatch[1]);
  }
  if (capacity >= 64) { score += 35; }
  else if (capacity >= 32) { score += 32; } // 32GB es excelente para gaming/trabajo
  else if (capacity >= 16) { score += 28; } // 16GB es estándar bueno
  else if (capacity >= 8 && capacity > 0) { score += 16; issues.push('8GB es mínimo, considera 16GB'); }
  else if (capacity > 0) { score += 6; issues.push('⚠️ RAM insuficiente'); }
  else { score += 25; } // Si no se detecta capacity, dar puntos promedio sin issue

  // Speed (0-35 puntos) - Buscar en múltiples campos y en el nombre
  let speed = 0;
  const speedField = specs['Speed'] || specs['Memory Speed'] || specs['speed'] || '';
  
  // Intentar extraer velocidad de formato "DDR5-6000" o "6000 MHz"
  if (speedField) {
    const speedMatch = speedField.match(/DDR[345]-(\d{4,5})|(\d{4,5})\s*MHz/i);
    if (speedMatch) {
      speed = parseFloat(speedMatch[1] || speedMatch[2]);
    }
  }
  
  // Si no se encontró en specs, buscar en el nombre
  if (speed === 0 && name) {
    const speedMatch = name.match(/-(\d{4,5})|\s(\d{4,5})\s*mhz/i);
    if (speedMatch) speed = parseFloat(speedMatch[1] || speedMatch[2]);
  }
  if (speed >= 6000) score += 35; // DDR5-6000+ es óptimo para AM5
  else if (speed >= 5200) score += 32;
  else if (speed >= 4800) score += 29;
  else if (speed >= 3600) score += 26; // DDR4-3600 es óptimo para AM4
  else if (speed >= 3200) score += 22; // DDR4-3200 es estándar AM4
  else if (speed >= 2666) score += 18;
  else if (speed >= 2400) score += 14;
  else if (speed >= 2133 && speed > 0) { score += 10; issues.push('Velocidad RAM limitada para estándares actuales'); }
  else if (speed > 0) { score += 6; issues.push('Velocidad RAM muy baja'); }
  else { score += 15; } // Si no se detecta speed, dar puntos promedio sin issue

  // Type (0-30 puntos) - Buscar en specs y en nombre
  let type = '';
  const typeField = (specs['Type'] || specs['Memory Type'] || specs['type'] || '').toLowerCase();
  const formFactor = (specs['Form Factor'] || '').toLowerCase();
  
  // Buscar DDR en los campos de specs
  if (typeField.includes('ddr5')) type = 'ddr5';
  else if (typeField.includes('ddr4')) type = 'ddr4';
  else if (typeField.includes('ddr3')) type = 'ddr3';
  
  // Si no se encontró, buscar en Form Factor (ej: "288-pin DIMM (DDR5)")
  if (!type && formFactor) {
    if (formFactor.includes('ddr5')) type = 'ddr5';
    else if (formFactor.includes('ddr4')) type = 'ddr4';
    else if (formFactor.includes('ddr3')) type = 'ddr3';
  }
  
  // Si aún no se encontró, buscar en el nombre
  if (!type && name) {
    if (name.includes('ddr5')) type = 'ddr5';
    else if (name.includes('ddr4')) type = 'ddr4';
    else if (name.includes('ddr3')) type = 'ddr3';
  }
  if (type.includes('ddr5')) score += 30;
  else if (type.includes('ddr4')) score += 20; // DDR4 sigue siendo bueno
  else if (type.includes('ddr3')) { score += 8; issues.push('Tecnología RAM antigua (DDR3)'); }
  else if (speed >= 4800) { score += 24; } // Si no encuentra tipo pero velocidad >4800, probablemente DDR5
  else if (speed >= 2400) { score += 18; } // Si velocidad >2400, probablemente DDR4
  else { score += 5; }

  let tier = 'F';
  let status = 'error';
  if (score >= 85) { tier = 'S'; status = 'excelente'; }
  else if (score >= 75) { tier = 'A'; status = 'muy_bueno'; }
  else if (score >= 60) { tier = 'B'; status = 'bueno'; }
  else if (score >= 45) { tier = 'C'; status = 'aceptable'; }
  else if (score >= 30) { tier = 'D'; status = 'limitado'; }

  return {
    score: Math.round(score),
    tier,
    status,
    message: getStatusMessage(status, 'RAM'),
    issues,
    specs: { capacity, speed, type: type || 'detectado por velocidad' }
  };
};

/**
 * Analiza Almacenamiento
 */
export const analyzeStorage = (storage) => {
  if (!storage?.especificaciones) {
    return { score: 0, tier: 'F', status: 'error', message: '❌ Sin información de almacenamiento' };
  }

  const specs = storage.especificaciones;
  const name = (storage.nombre || '').toLowerCase();
  let score = 0;
  const issues = [];

  // Capacity (0-25 puntos) - Buscar en múltiples campos y en nombre
  let capacity = 0;
  const capacityField = specs['Capacity'] || specs['Total Capacity'] || specs['capacity'] || '';
  
  // Intentar extraer capacidad de formato "4 TB" o "960GB"
  if (capacityField) {
    const tbMatch = capacityField.match(/(\d+\.?\d*)\s*TB/i);
    const gbMatch = capacityField.match(/(\d+)\s*GB/i);
    if (tbMatch) capacity = parseFloat(tbMatch[1]) * 1000;
    else if (gbMatch) capacity = parseFloat(gbMatch[1]);
  }
  
  // Si no se encontró en specs, buscar en el nombre
  if (capacity === 0 && name) {
    const tbMatch = name.match(/(\d+\.?\d*)\s*tb/i);
    const gbMatch = name.match(/(\d+)\s*gb/i);
    if (tbMatch) capacity = parseFloat(tbMatch[1]) * 1000;
    else if (gbMatch) capacity = parseFloat(gbMatch[1]);
  }
  if (capacity >= 4000) score += 25;
  else if (capacity >= 2000) score += 25; // 2TB es excelente
  else if (capacity >= 1000) score += 22; // 1TB es bueno, suficiente para mayoría
  else if (capacity >= 500) score += 18;  // 500GB es justo
  else if (capacity >= 250 && capacity > 0) { score += 12; issues.push('Espacio limitado - considera más capacidad'); }
  else if (capacity >= 128 && capacity > 0) { score += 8; issues.push('Poco espacio de almacenamiento'); }
  else if (capacity > 0) { score += 4; issues.push('Espacio crítico de almacenamiento'); }
  else { score += 18; } // Si no se detecta capacidad, dar puntos promedio sin issue

  // Type (0-60 puntos)
  const type = (specs['Type'] || specs['Form Factor'] || '').toLowerCase();
  // SATA SSD también incluye "sata" en el nombre, asegurarnos de detectarlo
  if (type.includes('nvme') || name.includes('nvme')) {
    score += 60; // NVMe es excelente
  } else if (type.includes('ssd') || name.includes('ssd') || name.includes('sata')) {
    score += 45; // SSD/SATA SSD sigue siendo muy bueno
  } else if (type.includes('hdd')) {
    score += 15;
    issues.push('⚠️ HDD es lento, considera SSD/NVMe');
  } else {
    score += 10;
  }

  // Speed (0-15 puntos)
  const readSpeed = parseNumeric(specs['Sequential Read'] || '0');
  if (readSpeed >= 7000) score += 15;
  else if (readSpeed >= 5000) score += 12;
  else if (readSpeed >= 3500) score += 10;
  else if (readSpeed >= 500) score += 6;
  else score += 3; // Default si no hay info

  let tier = 'F';
  let status = 'error';
  if (score >= 85) { tier = 'S'; status = 'excelente'; }
  else if (score >= 75) { tier = 'A'; status = 'muy_bueno'; }
  else if (score >= 60) { tier = 'B'; status = 'bueno'; }
  else if (score >= 45) { tier = 'C'; status = 'aceptable'; }
  else if (score >= 30) { tier = 'D'; status = 'limitado'; }

  return {
    score: Math.round(score),
    tier,
    status,
    message: getStatusMessage(status, 'Almacenamiento'),
    issues,
    specs: { capacity, type, readSpeed }
  };
};

/**
 * Analiza PSU y verifica suficiencia
 */
export const analyzePSU = (psu, cpuAnalysis, gpuAnalysis) => {
  if (!psu?.especificaciones) {
    return { score: 0, tier: 'F', status: 'error', message: '❌ Sin información de PSU', sufficient: false };
  }

  const specs = psu.especificaciones;
  let score = 0;
  const issues = [];

  const wattage = parseNumeric(specs['Wattage'] || specs['Output Wattage'] || '0');
  const cpuTDP = cpuAnalysis?.specs?.tdp || 100;
  const gpuTDP = gpuAnalysis?.specs?.tdp || 150;
  const overhead = 100;
  const totalTDP = cpuTDP + gpuTDP + overhead;
  const recommended = (cpuTDP + gpuTDP + overhead) * 1.25;

  // Wattage Sufficiency (0-50 puntos)
  const ratio = wattage / recommended;
  let powerLevel = 'bajo';
  if (ratio >= 1.4) {
    score += 50;
    powerLevel = 'bajo';
  } else if (ratio >= 1.15) {
    score += 42;
    powerLevel = 'bajo';
  } else if (ratio >= 1.0) {
    score += 32;
    powerLevel = 'medio';
    issues.push('⚠️ PSU justa - Sin margen para upgrades');
  } else if (ratio >= 0.85) {
    score += 18;
    powerLevel = 'severo';
    issues.push('⚠️ PSU INSUFICIENTE - Sistema inestable posible');
  } else {
    score += 8;
    powerLevel = 'extremo';
    issues.push('🚨 PSU CRÍTICA - Sistema NO arrancará o se apagará');
  }

  // Efficiency (0-30 puntos)
  const efficiency = (specs['Efficiency Rating'] || specs['Efficiency'] || '').toLowerCase();
  if (efficiency.includes('titanium')) score += 30;
  else if (efficiency.includes('platinum')) score += 25;
  else if (efficiency.includes('gold')) score += 20;
  else if (efficiency.includes('silver')) score += 15;
  else if (efficiency.includes('bronze')) score += 10;
  else { score += 5; issues.push('Sin certificación 80+'); }

  // Modular (0-20 puntos)
  const modular = (specs['Modular'] || specs['Type'] || '').toLowerCase();
  if (modular.includes('full')) score += 20;
  else if (modular.includes('semi')) score += 15;
  else score += 10;

  let tier = 'F';
  let status = 'error';
  if (score >= 85) { tier = 'S'; status = 'excelente'; }
  else if (score >= 75) { tier = 'A'; status = 'muy_bueno'; }
  else if (score >= 60) { tier = 'B'; status = 'bueno'; }
  else if (score >= 45) { tier = 'C'; status = 'aceptable'; }
  else if (score >= 30) { tier = 'D'; status = 'limitado'; }

  return {
    score: Math.round(score),
    tier,
    status,
    message: getStatusMessage(status, 'PSU'),
    powerLevel,
    sufficient: ratio >= 1.0,
    issues,
    specs: { wattage, efficiency, recommended: Math.ceil(recommended), totalTDP: Math.ceil(totalTDP) }
  };
};

/**
 * Análisis completo del sistema
 */
export const analyzeCompleteSystem = (components) => {
  const cpu = analyzeCPU(components.cpu);
  const gpu = analyzeGPU(components.gpu);
  const ram = analyzeRAM(components.ram);
  const storage = analyzeStorage(components.storage);
  const psu = analyzePSU(components.psu, cpu, gpu);
  const bottleneck = detectBottleneck(cpu, gpu);
  const budgetWaste = detectBudgetWaste(cpu, gpu, ram, psu);

  // Score general (promedio ponderado)
  const overallScore = Math.round(
    cpu.score * 0.25 +
    gpu.score * 0.25 +
    ram.score * 0.20 +
    storage.score * 0.15 +
    psu.score * 0.15
  );

  // Tier general
  let overallTier = 'F';
  if (overallScore >= 85) overallTier = 'S';
  else if (overallScore >= 75) overallTier = 'A';
  else if (overallScore >= 60) overallTier = 'B';
  else if (overallScore >= 45) overallTier = 'C';
  else if (overallScore >= 30) overallTier = 'D';

  // Determinar nivel de problemas GENERAL
  // SOLO considerar riesgos técnicos reales (térmicos, power), NO bottleneck
  const problemLevels = [
    cpu.thermalRisk || 'bajo',
    gpu.powerRisk || 'bajo',
    psu.powerLevel || 'bajo'
  ];

  let overallProblemLevel = 'bajo';
  if (problemLevels.includes('extremo')) overallProblemLevel = 'extremo';
  else if (problemLevels.includes('severo')) overallProblemLevel = 'severo';
  else if (problemLevels.includes('medio')) overallProblemLevel = 'medio';
  
  // Si solo hay bottleneck pero no problemas técnicos, ajustar nivel
  if (overallProblemLevel === 'bajo' && bottleneck.severity === 'severo') {
    overallProblemLevel = 'medio'; // Desbalance no es crítico
  } else if (overallProblemLevel === 'bajo' && bottleneck.severity === 'extremo') {
    overallProblemLevel = 'medio'; // Incluso extremo no es peligroso
  }

  // Recopilar todos los issues (incluyendo desperdicio de presupuesto)
  const allIssues = [
    ...cpu.issues || [],
    ...gpu.issues || [],
    ...ram.issues || [],
    ...storage.issues || [],
    ...psu.issues || [],
    ...budgetWaste.issues || []
  ];

  // Usos recomendados basados en GPU (realistas)
  const recommendedUses = [];
  if (gpu.score >= 85) { // Tier S
    recommendedUses.push('Gaming AAA 4K', 'Ray Tracing', 'Renderizado 3D');
  } else if (gpu.score >= 70) { // Tier A/B+
    recommendedUses.push('Gaming 1440p', 'Ray Tracing 1080p', 'Streaming');
  } else if (gpu.score >= 55) { // Tier B/C+
    recommendedUses.push('Gaming 1080p/1440p', 'Streaming');
  } else {
    recommendedUses.push('Gaming 1080p', 'eSports');
  }
  
  if (cpu.tier === 'S' || cpu.tier === 'A') {
    recommendedUses.push('Programación', 'Compilación', 'VMs');
  }

  if (ram.specs.capacity >= 32) {
    recommendedUses.push('Edición Video', 'Diseño 3D');
  }

  return {
    overallScore,
    overallTier,
    overallProblemLevel,
    components: { cpu, gpu, ram, storage, psu },
    bottleneck,
    budgetWaste,
    issues: allIssues,
    recommendedUses: recommendedUses.length > 0 ? recommendedUses : ['Uso General'],
    hasCriticalIssues: overallProblemLevel === 'extremo' || overallProblemLevel === 'severo'
  };
};

/**
 * Helper: Mensajes según status
 */
function getStatusMessage(status, component) {
  const messages = {
    excelente: `🌟 ${component} Excelente`,
    muy_bueno: `✅ ${component} Muy Bueno`,
    bueno: `✅ ${component} Bueno`,
    aceptable: `⚠️ ${component} Aceptable`,
    limitado: `⚠️ ${component} Limitado`,
    error: `❌ ${component} con Problemas`
  };
  return messages[status] || `${component} Evaluado`;
}
