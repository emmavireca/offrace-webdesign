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
  introFinita: false
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
}


