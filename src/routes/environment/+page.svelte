<script>
  import { config } from '$lib/config.svelte.js'
  config.fase = 1

  // hover per anteprima immagine, click per selezione definitiva
  let hover = $state(null)

  function scegli(venue) {
    config.venue = venue
  }

  // l'immagine mostrata segue: hover > selezione > default olympia
  let pistaMostrata = $derived(config.venue)

  const piste = {
    olympia: {
      nome: 'Olympia',
      luogo: "Cortina d'Ampezzo",
      track: "Women's Track",
      lunghezza: '2,8 km',
      angolo: '31%',
      terrain: 'very bumpy',
      img: '/piste/olympia.png',
    },
    bormio: {
      nome: 'Bormio',
      luogo: 'Stelvio — Bormio',
      track: "Men's Track",
      lunghezza: '3,2 km',
      angolo: '31%',
      terrain: 'very bumpy',
      img: '/piste/bormio.png',
    },
  }
</script>

<div class="page">

  <!-- ── COLONNA SINISTRA ── -->
  <div class="col-sx">
    <div class="sx-top">
      <h1>Environment</h1>
      <p class="desc">Every race is decided before the start. The equipment an athlete carries onto the slope is the result of years of research, proprietary materials, and technical expertise that most teams cannot access. Geometry, construction, and surface treatment are not neutral choices — they are variables that directly affect speed and stability.</p>
    </div>
    <div class="sx-img">
      {#if pistaMostrata}
        <img src={piste[pistaMostrata].img} alt={piste[pistaMostrata].nome} />
      {/if}
    </div>
  </div>

  <!-- ── COLONNA DESTRA ── -->
  <div class="col-dx">
    <div class="dx-header">CHOOSE YOUR TRACK</div>

    {#each Object.entries(piste) as [id, p]}
      <button
        class="pista"
        class:attiva={config.venue === id}
        onclick={() => scegli(id)}
      >
        <h2>{p.nome}</h2>
        <p class="track-label">{p.track}</p>
        <p class="track-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>

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

  /* ── SINISTRA ── */
  .col-sx {
    border-right: 2px solid black;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sx-top {
    padding: 2.5rem;
    border-bottom: 2px solid black;
  }

  .sx-top h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 1.25rem;
  }

  .desc {
    font-size: 0.78rem;
    line-height: 1.6;
    color: #444;
    max-width: 54ch;
  }

  .sx-img {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .sx-img img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  /* ── DESTRA ── */
  .col-dx {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .dx-header {
    padding: 1.5rem 2.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-bottom: 2px solid black;
  }

  .pista {
    border: none;
    border-bottom: 2px solid black;
    background: transparent;
    padding: 1.75rem 2.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
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

  .pista h2 {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .track-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 0.5rem;
  }

  .track-desc {
    font-size: 0.72rem;
    line-height: 1.55;
    opacity: 0.7;
    max-width: 42ch;
    margin-bottom: 0.5rem;
  }

  /* STATS */
  .stats {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 0.5rem;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: black;
    color: white;
    padding: 0.5rem 0.9rem;
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
  }

  .stat-val {
    font-weight: 600;
  }

  .stat-terrain {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .dot {
    width: 7px;
    height: 7px;
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
    margin-left: 0.4rem;
    opacity: 0.8;
  }
</style>