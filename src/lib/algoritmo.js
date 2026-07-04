// algoritmo.js — Off Race performance calculator
// Convenzione segni: Δt negativo = più veloce del riferimento, positivo = più lento

// ─── NORMALIZZAZIONE ────────────────────────────────────────────────────────
// Restituisce un valore tra -1 (peggiore) e +1 (migliore)
function norm(x, xMin, xMax) {
  return 2 * (x - xMin) / (xMax - xMin) - 1
}

// ─── CONTRIBUTO PARAMETRO ───────────────────────────────────────────────────
// n in [-1, +1]: positivo = buono, negativo = cattivo
// delta.fast: guadagno massimo (negativo, rende più veloci)
// delta.slow: perdita massima (positivo, rende più lenti)
function contrib(n, delta) {
  return n >= 0
    ? n * delta.fast   // n positivo → accelera → Δt negativo
    : -n * delta.slow  // n negativo → decelera → Δt positivo
}

// ─── RANGES PER GENERE ──────────────────────────────────────────────────────
export function getRanges(isMale) {
  return {
    massa:  { min: isMale ? 85 : 65,   max: isMale ? 100 : 75  },
    rfd:    { min: isMale ? 3000 : 2800, max: isMale ? 6000 : 5000 },
    dev:    { min: 5, max: 40 }, // deviazione: min = meglio
    lungh:  { min: isMale ? 218 : 210, max: isMale ? 226 : 218 },
    raggio: { min: isMale ? 45 : 40,   max: isMale ? 55 : 50  },
    largh:  { min: 63, max: 68 },
  }
}

// ─── DELTA MASSIMI PER PARAMETRO ────────────────────────────────────────────
// fast = guadagno massimo (s) — negativo = si è più veloci
// slow = perdita massima (s) — positivo = si è più lenti
const DELTA = {
  massa:      { fast: -0.20, slow: 0.30 },
  rfd:        { fast: -0.30, slow: 0.40 },
  consistenza:{ fast: -0.70, slow: 0.20 },
  geometria:  { fast: -0.20, slow: 0.30 },
  materiale:  { fast: -0.30, slow: 0.00 }, // wood = 0, titanal/carbon = più veloci
  cera:       { fast: -0.40, slow: 0.30 }, // fluoro = più veloce, training = più lento
}

// ─── NORMALIZZAZIONE CERA ───────────────────────────────────────────────────
// +1 = fluoro (più veloce), 0 = race/graphite/silicone, -1 = training (più lento)
function normCera(cera) {
  if (cera === 'fluoro') return 1
  if (cera === 'graphite' || cera === 'silicone' || cera === 'race') return 0.5
  return -1 // training
}

// ─── NORMALIZZAZIONE MATERIALE ──────────────────────────────────────────────
// +1 = titanal (più veloce), +0.5 = carbon, -1 = wood
function normMat(mat) {
  if (mat === 'titanal') return 1
  if (mat === 'carbon') return 0.5
  return -1 // wood
}

// ─── CALCOLO PRINCIPALE ─────────────────────────────────────────────────────
export function calcola(config) {
  const isMale = config.venue === 'bormio'
  const ranges = getRanges(isMale)

  // Normalizzazione parametri atleta
  const nMassa  = norm(config.massa ?? 70, ranges.massa.min, ranges.massa.max)
  const nRfd    = norm(config.rfd ?? 3500, ranges.rfd.min, ranges.rfd.max)
  // deviazione: bassa = buona → invertiamo il segno
  const nDev    = -norm(config.deviazione ?? 20, ranges.dev.min, ranges.dev.max)

  // Normalizzazione geometria — combinazione pesata
  const nLungh  = norm(config.lunghezza ?? 214, ranges.lungh.min, ranges.lungh.max)
  const nRaggio = norm(config.raggio ?? 45, ranges.raggio.min, ranges.raggio.max)
  const nLargh  = norm(config.larghezza ?? 65, ranges.largh.min, ranges.largh.max)
  const nGeo    = 0.5 * nLungh + 0.3 * nRaggio + 0.2 * nLargh

  // Normalizzazione materiale e cera
  const nMat    = normMat(config.materiale)
  const nCera   = normCera(config.cera)

  // Contributi Δt
  const dtMassa    = contrib(nMassa,  DELTA.massa)
  const dtRfd      = contrib(nRfd,    DELTA.rfd)
  const dtConsist  = contrib(nDev,    DELTA.consistenza)
  const dtGeo      = contrib(nGeo,    DELTA.geometria)
  const dtMat      = contrib(nMat,    DELTA.materiale)
  const dtCera     = contrib(nCera,   DELTA.cera)

  const dtAtleta   = dtMassa + dtRfd + dtConsist
  const dtEquip    = dtGeo + dtMat + dtCera
  const dtTotale   = dtAtleta + dtEquip

  // DNF rate
  const nDevNorm01 = (nDev + 1) / 2   // 0-1, 1 = perfetta consistenza
  const nRfdNorm01 = (nRfd + 1) / 2   // 0-1, 1 = RFD massimo
  const dnfRate    = 0.25 * (1 - nDevNorm01) + 0.10 * nRfdNorm01 * (1 - nDevNorm01)

  // Compliance flags
  const isFluoro   = config.cera === 'fluoro'
  const techFlags  = (config.materiale === 'titanal' ? 1 : 0) +
                     (config.materiale === 'carbon'  ? 1 : 0) +
                     (normCera(config.cera) > 0      ? 1 : 0)

  // Scenario
  let scenario
  if (isFluoro)              scenario = 'BANNED'
  else if (dnfRate > 0.25)   scenario = 'DNF'
  else if (dtTotale < -0.8 && techFlags >= 2) scenario = 'RESOURCE GAP'
  else                       scenario = 'CLEAN'

  // Spider chart values (0-1, 1 = migliore)
  const spider = {
    speedPotential:      clamp01((nMassa + nGeo) / 2 * 0.5 + 0.5),
    technicalControl:    clamp01(nDevNorm01 * 0.6 + nRfdNorm01 * 0.4),
    equipmentCompliance: clamp01(isFluoro ? 0.05 : (1 - Math.max(0, nCera) * 0.4 - Math.max(0, nMat) * 0.2)),
    dnfRisk:             clamp01(1 - dnfRate / 0.35),
    edgeGrip:            clamp01((nMat + 1) / 2 * 0.6 + (1 - Math.abs(nGeo)) * 0.4),
    resourceAccess:      clamp01((nMat + 1) / 2 * 0.5 + (nCera + 1) / 2 * 0.5),
  }

  return {
    dtTotale,
    dtAtleta,
    dtEquip,
    dtMassa, dtRfd, dtConsist,
    dtGeo, dtMat, dtCera,
    dnfRate,
    scenario,
    isFluoro,
    techFlags,
    spider,
  }
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v))
}