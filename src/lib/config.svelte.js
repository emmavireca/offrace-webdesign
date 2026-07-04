// config.svelte.js — stato globale reattivo

function percentualeToValore(percentuale, min, max) {
  return min + (percentuale / 100) * (max - min)
}

// config.svelte.js — stato globale reattivo

const _config = $state({
  lunghezza: 214,   // cm — valore iniziale medio
  larghezza: 65,    // mm
  raggio: 45,       // m
  materiale: 'wood',    // 'wood' | 'carbon' | 'titanal'
  cera: 'training',     // 'training' | 'race' | 'fluoro'
  venue: null,
  fase: 0,
  tutaIndex: 0,
  introFinita: true,
  massa: 70,
  rfd: 3500,
  deviazione: 20,
})

export const config = {
  get lunghezza() { return _config.lunghezza },
  set lunghezza(v) { _config.lunghezza = v },
  get larghezza() { return _config.larghezza },
  set larghezza(v) { _config.larghezza = v },
  get raggio() { return _config.raggio },
  set raggio(v) { _config.raggio = v },
  get materiale() { return _config.materiale },
  set materiale(v) { _config.materiale = v },
  get cera() { return _config.cera },
  set cera(v) { _config.cera = v },
  get venue() { return _config.venue },
  set venue(v) { _config.venue = v },
  get fase() { return _config.fase },
  set fase(v) { _config.fase = v },
  get tutaIndex() { return _config.tutaIndex },
  set tutaIndex(v) { _config.tutaIndex = v },
  get introFinita() { return _config.introFinita },
set introFinita(v) { _config.introFinita = v },
get massa() { return _config.massa },
set massa(v) { _config.massa = v },
get rfd() { return _config.rfd },
set rfd(v) { _config.rfd = v },
get deviazione() { return _config.deviazione },
set deviazione(v) { _config.deviazione = v },
get zoomAttivo() { return _config.zoomAttivo },
set zoomAttivo(v) { _config.zoomAttivo = v },
get zoomTarget() { return _config.zoomTarget },
set zoomTarget(v) { _config.zoomTarget = v },
}


