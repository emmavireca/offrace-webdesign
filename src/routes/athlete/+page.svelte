<script>
  import { goto } from '$app/navigation'
  import { config } from '$lib/config.svelte.js'
  import AtletaViewer from '$lib/components/AtletaViewer.svelte'
config.fase = 2
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
  <header class="top-bar">
    <span class="brand">OFFRACE</span>
  </header>

  <main class="content">
    <div class="left">
      <p class="step">Step 03 — Athlete</p>
      <h1>Athlete</h1>
      <p class="desc">Lorem ipsum dolor sit amet consectetur.</p>
      {#if tutaIndex > 0}
  <p class="tuta-desc">{descrizioni[tutaIndex]}</p>
{/if}
    </div>

    <div class="right">
      <AtletaViewer {modello} />

      <div class="carosello">
        {#if tutaIndex > 0}
          <button class="freccia" onclick={indietro}>←</button>
        {:else}
          <div></div>
        {/if}

        {#if staEscendo && tutaPrecedente}
  <img
    class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} esce-{direzione}"
    src={tutaPrecedente}
    alt="tuta precedente"
  />
{/if}

{#key tutaIndex}
  {#if tute[tutaIndex]}
    <img 
      class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} animazione-{direzione}" 
      src={tute[tutaIndex]} 
      alt="tuta" 
    />
  {/if}
{/key}

        {#if tutaIndex < tute.length - 1}
          <button class="freccia" onclick={avanti}>→</button>
        {:else}
          <div></div>
        {/if}
      </div>
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

  .top-bar {
    padding: 1.5rem 4rem;
    border-bottom: 2px solid black;
  }

  .brand {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .left {
    padding: 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .step {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #666;
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
</style>