<script>
  import { Canvas } from '@threlte/core'
  import PistaScene from '$lib/components/PistaScene.svelte'
  import { config } from '$lib/config.svelte.js'
  config.fase = 1

  let hover = $state(null)

  function scegli(venue) {
    config.venue = venue
  }

  let pistaMostrata = $derived(config.venue)

  const piste = {
    olympia: {
      nome: 'Olympia',
      luogo: "Cortina d'Ampezzo",
      track: "Women's Track",
      lunghezza: '2,26 km',
      angolo: 'AVERAGE 30% PEAK 65%',
      terrain: 'technical difficulty',
      descrizione: "A highly technical course demanding extreme precision, alternating high-speed gliding with steep, selective sections that test athlete endurance.",
      glb: '/models/olympia.glb',
    },
    bormio: {
      nome: 'Bormio',
      luogo: 'Stelvio — Bormio',
      track: "Men's Track",
      lunghezza: '3,27 km',
      angolo: 'AVERAGE 30% PEAK 73%',
      terrain: 'high intensity',
      descrizione: "An elite, high-intensity course defined by unrelenting steepness and icy terrain, requiring exceptional strength and tactical control.",
      glb: '/models/bormio.glb',
    },
  }
</script>

<div class="page">

  <div class="col-sx">
    <div class="sx-top">
      <h1>Environment</h1>
      <p class="desc">The environment where the race takes place dictates its physical characteristics and unique challenges. To face them, the athlete must be fully prepared, combining physical endurance with a strategic study of the most advantageous trajectories.</p>
    </div>
    <div class="sx-img">
      {#if pistaMostrata}
        <Canvas>
          <PistaScene src={piste[pistaMostrata].glb} />
        </Canvas>
      {/if}
    </div>
  </div>

  <div class="col-dx">
    <div class="dx-header">CHOOSE YOUR TRACK</div>

    {#each Object.entries(piste) as [id, p]}
      <button
        class="pista"
        class:attiva={config.venue === id}
        onclick={() => scegli(id)}
      >
        <div class="pista-title-row">
          <h2>{p.nome}</h2>
          <div class="radio-circle"></div>
        </div>
        <p class="track-label">{p.track}</p>
        <p class="track-desc">{p.descrizione}</p>

        <div class="stats">
          <div class="stat">
            <span class="stat-label">LENGTH</span>
            <span class="stat-val">{p.lunghezza}</span>
          </div>
          <div class="stat">
            <span class="stat-label">ANGLE</span>
            <span class="stat-val">{p.angolo}</span>
          </div>
          <div class="stat">
            <span class="stat-label">TERRAIN</span>
            <span class="stat-terrain">
              <span class="dot piena"></span>
              <span class="dot piena"></span>
              <span class="dot piena"></span>
              <span class="terrain-txt">{p.terrain}</span>
            </span>
          </div>
        </div>
      </button>
    {/each}
  </div>

</div>

<style>
  .page {
    position: fixed;
    inset: 0;
    bottom: 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  .col-sx {
    border-right: 1.5px solid black;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sx-top {
    padding: 40px;
    border-bottom: 1.5px solid black;
  }

  .sx-top h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-top: 0;
    margin-bottom: 24px;
  }

  .desc {
    font-size: 0.78rem;
    line-height: 1.6;
    color: #444;
    max-width: 54ch;
    margin: 0;
  }

  .sx-img {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    min-height: 0;
  }

  .col-dx {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding-bottom: 40px;
  }

  .dx-header {
    padding: 24px 40px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-bottom: 1.5px solid black;
  }

  .pista {
    border: none;
    border-bottom: 1.5px solid black;
    background: transparent;
    padding: 28px 40px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
    font-family: inherit;
    transition: background 0.2s, color 0.2s;
  }

  .pista:hover {
    background: #fafafa;
  }

  .pista.attiva {
    background: var(--mc-muted);
    color: black;
  }

  .pista-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .pista h2 {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
    margin: 0;
  }

  .radio-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1.5px solid black;
    background: transparent;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    flex-shrink: 0;
  }

  .pista:hover .radio-circle {
    transform: scale(1.15);
  }

  .pista.attiva .radio-circle {
    background: #BDF522;
    border-color: black;
  }

  .pista.attiva:hover .radio-circle {
    background: black;
    border-color: #BDF522;
  }

  .track-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 8px;
    margin-bottom: 0;
  }

  .track-desc {
    font-size: 0.72rem;
    line-height: 1.55;
    opacity: 0.7;
    max-width: 42ch;
    margin-top: 0;
    margin-bottom: 8px;
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: black;
    color: white;
    padding: 8px 16px;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
  }

  .pista.attiva .stat {
    background: black;
    color: white;
  }

  .stat-label {
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
  }

  .stat-val {
    font-weight: 600;
    margin: 0;
  }

  .stat-terrain {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid currentColor;
    display: inline-block;
  }

  .dot.piena {
    background: currentColor;
  }

  .terrain-txt {
    font-size: 0.55rem;
    text-transform: lowercase;
    letter-spacing: 0.05em;
    margin-left: 8px;
    opacity: 0.8;
  }
</style>