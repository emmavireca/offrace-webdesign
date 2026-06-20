<script>
  import { goto } from '$app/navigation'
  import { config } from '$lib/config.svelte.js'
  import AtletaViewer from '$lib/components/AtletaViewer.svelte'
config.fase = 2
  const massaMin = config.venue === 'bormio' ? 85 : 65
  const massaMax = config.venue === 'bormio' ? 100 : 75
  const rfdMin = config.venue === 'bormio' ? 3000 : 2800
  const rfdMax = config.venue === 'bormio' ? 6000 : 5000  
  const modello = config.venue === 'bormio' ? '/models/atleta_m.glb' : '/models/atleta_f.glb'

  const tute = config.venue === 'bormio' 
    ? [null, '/tute/uomo_pink.svg', '/tute/uomo_viola.svg', '/tute/uomo_giallo.svg']
    : [null, '/tute/donna_pink.svg', '/tute/donna_viola.svg', '/tute/donna_giallo.svg']

  let direzione = $state('destra')
let tutaIndex = $state(0)
let tutaPrecedente = $state(null)
let staEscendo = $state(false)

function avanti() { 
  if (tutaIndex < tute.length - 1) {
    direzione = 'destra'
    tutaPrecedente = tute[tutaIndex]
    staEscendo = true
    setTimeout(() => { staEscendo = false }, 800)
    tutaIndex++
    config.tutaIndex = tutaIndex
  }
}

function indietro() { 
  if (tutaIndex > 0) {
    direzione = 'sinistra'
    tutaPrecedente = tute[tutaIndex]
    staEscendo = true
    setTimeout(() => { staEscendo = false }, 800)
    tutaIndex--
    config.tutaIndex = tutaIndex
  }
}

const descrizioni = [
  '',
  'La tuta standard è completamente legale e rispetta tutti i parametri FIS. Nessun vantaggio aerodinamico oltre la norma.',
  'Questa tuta si avvicina ai limiti regolamentari. Tecnicamente legale, ma offre un vantaggio aerodinamico significativo.',
  'Questa tuta supera i limiti FIS. Classificata come techno-doping — vantaggio sleale e non ammesso in gara.'
]
</script>

<div class="page">


<main class="content">
  <div class="left">
    <div class="left-intro">
      <h1>Athlete</h1>
      <p class="desc">The athlete is not a fixed variable. Body composition, neuromuscular capacity, and technical precision are not equal across competitors — and none of them are regulated. While equipment is subject to FIS specifications and wax protocols are enforced at the gate, the physical profile of the athlete remains entirely outside the compliance system.</p>
    </div>

    <div class="pannelli">

      <div class="pannelli-row">
        <div class="pannello pannello-small">
          <div class="pannello-header">BODY MASS</div>
          <div class="pannello-body">
          <div class="mass-control">
          <button class="mass-btn" onclick={() => { if (config.massa > massaMin) config.massa-- }}>−</button>
          <span class="mass-value">{config.massa} <span class="mass-unit">kg</span></span>
          <button class="mass-btn" onclick={() => { if (config.massa < massaMax) config.massa++ }}>+</button>
          </div>
          <p class="pannello-desc">Body mass determines the amount of potential energy an athlete carries into the descent. A higher mass accelerates faster on straight sections where gravitational pull dominates, but increases joint load in technical sections and reduces responsiveness in direction changes.</p>
          </div>
        </div>

        <div class="pannello pannello-large">
          <div class="pannello-header">TRAJECTORY DEVIATION</div>
          <div class="pannello-body">
            <div class="ruler-wrap">
              <div class="ruler-labels">
                <span>0</span><span>5cm</span><span>10cm</span><span>20cm</span><span>40cm</span>
              </div>
              <input type="range" min="5" max="40" step="1" bind:value={config.deviazione} class="ruler-slider" />
            </div>
            <p class="pannello-desc">Trajectory deviation measures the average distance between the athlete's actual line and the optimal racing trajectory across a full descent. A deviation of 10–15 cm at high speed does not stay isolated: it alters the entry angle into the next gate, forces a micro-correction, and compounds across every subsequent section. It is the single strongest predictor of final race time — and the primary driver of DNF risk when combined with high force output.</p>
          </div>
        </div>
      </div>

      <div class="pannello">
        <div class="pannello-header">RDF — RATE OF FORCE DEVELOPMENT</div>
        <div class="pannello-body rdf-body">
          <div class="rdf-gauge">
            <svg viewBox="0 0 120 80" width="120" height="80">
              <path d="M10,70 A60,60 0 0,1 110,70" fill="none" stroke="#ddd" stroke-width="8" stroke-linecap="round"/>
              <path d="M10,70 A60,60 0 0,1 110,70" fill="none" stroke="black" stroke-width="8" stroke-linecap="round"
                stroke-dasharray="188.5"
                stroke-dashoffset={188.5 - (188.5 * ((config.rfd - rfdMin) / (rfdMax - rfdMin)))}
              />
              <text x="60" y="65" text-anchor="middle" font-size="10" font-family="Geist Mono">{config.rfd}</text>
              <text x="60" y="76" text-anchor="middle" font-size="6" font-family="Geist Mono" fill="#666">N/s</text>
            </svg>
            <input type="range" min={rfdMin} max={rfdMax} step="100" bind:value={config.rfd} class="rdf-slider" />
          </div>
          <p class="pannello-desc">RFD — Rate of Force Development — measures how quickly the athlete can generate and apply muscular force, expressed in Newtons per second. It is not the same as maximum strength: two athletes can have identical peak force but entirely different RFD values, meaning one reaches that peak in 150 milliseconds and the other in 300. In alpine skiing, those 150 milliseconds are the difference between a clean edge engagement and a lost gate.</p>
        </div>
      </div>

    </div>
  </div>

  <div class="right">
    <p class="right-label">CONFIGURE YOUR ATHLETE</p>
    <AtletaViewer {modello} />
    {#if staEscendo && tutaPrecedente}
      <img class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} esce-{direzione}" src={tutaPrecedente} alt="tuta precedente" />
    {/if}
    {#key tutaIndex}
      {#if tute[tutaIndex]}
        <img class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} animazione-{direzione}" src={tute[tutaIndex]} alt="tuta" />
      {/if}
    {/key}
  </div>
</main>
</div>

<style>
 .page {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
}

 

  .content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  .left {
    padding: 36px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    min-height: 0;
  }
  .right {
    position: relative;
  }

  .carosello {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
  }

  .tuta {
  position: absolute;
  pointer-events: none;
}

.tuta-donna {
  width: 76%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -47.8%);
}

.tuta-uomo {
  width: 67.5%;
  height: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -49%);
}

.tuta-desc {
  font-size: 0.85rem;
  line-height: 1.7;
  color: #444;
  max-width: 320px;
  border-left: 3px solid black;
  padding-left: 1rem;
}

  .freccia {
    pointer-events: all;
    background: transparent;
    border: 2px solid black;
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 10;
    font-family: inherit;
  }

  .freccia:hover {
    background: black;
    color: white;
  }

  .cta {
    width: fit-content;
    padding: 1rem 2.5rem;
    background: black;
    color: white;
    border: none;
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    margin-top: auto;
  }

@keyframes da-destra {
  from { transform: translate(150%, -47.8%); opacity: 0; }
  to   { transform: translate(-50%, -47.8%); opacity: 1; }
}

@keyframes da-sinistra {
  from { transform: translate(-150%, -47.8%); opacity: 0; }
  to   { transform: translate(-50%, -47.8%); opacity: 1; }
}

@keyframes vai-sinistra {
  from { transform: translate(-50%, -47.8%); opacity: 1; }
  60%  { transform: translate(-110%, -47.8%); opacity: 0; }
  to   { transform: translate(-150%, -47.8%); opacity: 0; }
}

@keyframes vai-destra {
  from { transform: translate(-50%, -47.8%); opacity: 1; }
   60%  { transform: translate(70%, -47.8%); opacity: 0; }
  to   { transform: translate(150%, -47.8%); opacity: 0; }
}

.animazione-destra  { animation: da-destra    0.8s ease-out forwards; }
.animazione-sinistra { animation: da-sinistra  0.8s ease-out forwards; }
.esce-destra        { animation: vai-sinistra  0.8s ease-in  forwards; }
.esce-sinistra      { animation: vai-destra    0.8s ease-in  forwards; }
.left {
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.left-intro {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.desc {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  line-height: 1.7;
}

.pannelli {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1.5px solid black;
}

.pannelli-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  border-bottom: 1.5px solid black;
}

.pannello {
  display: flex;
  flex-direction: column;
}

.pannello-small {
  border-right: 1.5px solid black;
}

.pannello-header {
  background: black;
  color: white;
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  padding: 8px 24px;
}

.pannello-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pannello-desc {
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  line-height: 1.7;
}

.mass-control {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.mass-btn {
  width: 32px;
  height: 32px;
  border: 1.5px solid black;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mass-btn:hover {
  background: black;
  color: white;
}

.mass-value {
  font-family: 'Geist Mono', monospace;
  font-size: 20px;
  font-weight: 500;
}

.mass-unit {
  font-size: 12px;
  font-weight: 400;
  color: #666;
}

.ruler-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ruler-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: #666;
}

.ruler-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 14px;
  background: transparent;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.ruler-slider::-webkit-slider-runnable-track {
  height: 2px;
  background: black;
  border-radius: 0;
}

.ruler-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--mc-copper);
  cursor: grab;
  outline: 2px solid black;
  margin-top: -6px;
}

.rdf-body {
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
}

.rdf-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.rdf-slider {
  width: 100%;
  cursor: pointer;
}

.right {
  position: relative;
  border-left: 1.5px solid black;
}

.right-label {
  position: absolute;
  top: 80px;
  left: 36px;
  font-family: 'Geist', sans-serif;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  z-index: 10;
} 
</style>