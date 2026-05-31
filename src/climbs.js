// Climb data derived from GPX analysis.
// startKm / endKm = distance along the route (cumulative km from route start).
// maxGradient = known value for each classic climb.

export const CLIMBS = {
  Stelvio_from_Bormio_both_sides: [
    {
      id: 'stelvio-prato',
      name: 'Passo dello Stelvio',
      subtitle: 'from Prato allo Stelvio',
      startKm: 54.2,
      endKm: 80.2,
      lengthKm: 26.0,
      elevationGain: 1857,
      startElevation: 904,
      summitElevation: 2762,
      avgGradient: 7.1,
      maxGradient: 12,
      description: 'One of the highest paved roads in the Alps. 48 legendary hairpins from the Prato side. A bucket-list climb.',
    },
  ],

  Motirolo_gavia: [
    {
      id: 'mortirolo',
      name: 'Passo del Mortirolo',
      subtitle: 'from Mazzo di Valtellina',
      startKm: 28.8,
      endKm: 39.6,
      lengthKm: 10.8,
      elevationGain: 1183,
      startElevation: 548,
      summitElevation: 1731,
      avgGradient: 11.0,
      maxGradient: 18,
      description: 'Widely considered the hardest climb in the Giro d\'Italia. Unrelenting gradients with no respite. Marco Pantani\'s mountain.',
    },
    {
      id: 'gavia',
      name: 'Passo di Gavia',
      subtitle: 'from Ponte di Legno',
      startKm: 65.7,
      endKm: 85.6,
      lengthKm: 19.9,
      elevationGain: 1457,
      startElevation: 1165,
      summitElevation: 2622,
      avgGradient: 7.3,
      maxGradient: 16,
      description: 'A brutal Alpine classic. Made famous by the 1988 Giro snowstorm stage. Long, remote and relentless.',
    },
  ],

  Tirrano_Livigno_Loop: [
    {
      id: 'foscagno',
      name: 'Passo di Foscagno',
      subtitle: 'from the valley',
      startKm: 54.4,
      endKm: 74.4,
      lengthKm: 20.0,
      elevationGain: 1329,
      startElevation: 989,
      summitElevation: 2318,
      avgGradient: 6.6,
      maxGradient: 9,
      description: 'A long high-altitude pass connecting the Livigno plateau. Exposed and dramatic with views across the border into Switzerland.',
    },
    {
      id: 'eira',
      name: 'Passo d\'Eira',
      subtitle: 'from Livigno',
      startKm: 86.3,
      endKm: 99.6,
      lengthKm: 13.3,
      elevationGain: 442,
      startElevation: 1849,
      summitElevation: 2291,
      avgGradient: 3.3,
      maxGradient: 8,
      description: 'The gateway out of Livigno. A quieter climb after the Foscagno, with panoramic views over the tax-free resort.',
    },
  ],
}

export function difficultyLabel(gain, avgGrad) {
  const score = (gain * avgGrad) / 100
  if (score >= 100) return { label: 'Extreme', color: '#9B1C24' }
  if (score >= 50)  return { label: 'Hard',    color: '#CE2B37' }
  if (score >= 20)  return { label: 'Moderate', color: '#C8960C' }
  return                   { label: 'Easy',    color: '#009246' }
}
