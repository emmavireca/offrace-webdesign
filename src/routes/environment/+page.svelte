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

  <div class="col-sx">
    <div class="sx-top">
      <h1>Environment</h1>
      <p class="desc">Every race is decided before the start. The equipment an athlete carries onto the slope is the result of years of research, proprietary materials, and technical expertise that most teams cannot access. Geometry, construction, and surface treatment are not neutral choices — they are variables that directly affect speed and stability.</p>
    </div>
    <div class="sx-img">
      {#if pistaMostrata}
        <img src={piste[pistaMostrata].img} alt={piste[piste[pistaMostrata].nome]} />
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
    bottom: 64px; /* Lascia lo spazio esatto per l'altezza del footer layout */
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  /* ── SINISTRA ── */
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

  /* NUOVO: Raggruppamento per titolo e pallino indicatore */
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

  /* NUOVO: Pallino di selezione stile slider */
  .radio-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1.5px solid black;
    background: transparent;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    flex-shrink: 0;
  }

  /* Ingrandimento al passaggio del mouse sulla card */
  .pista:hover .radio-circle {
    transform: scale(1.15);
  }

  /* Stato attivo: riempimento fluo */
  .pista.attiva .radio-circle {
    background: #BDF522;
    border-color: black;
  }

  /* Inversione dei colori al passaggio del mouse sulla card attiva */
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

  /* STATS */
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

/* ── RESPONSIVE PER MOBILE ── */
@media (max-width: 768px) {
  
  :global(html), :global(body) {
    overflow-y: auto !important;
    height: auto !important;
  }

  .page {
    position: relative;
    inset: auto;
    display: flex;
    flex-direction: column;
    
    overflow-y: auto !important; 
    overflow-x: hidden;
    height: auto !important;
    min-height: 100vh;
  }

  .col-sx {
    border-right: none;
    border-bottom: 1.5px solid black;
    height: auto !important;
    overflow: visible !important;
    order: 1;
  }

  .sx-top {
    padding: 24px;
  }

  .sx-img {
    padding: 16px;
    height: 300px; 
    background: #fcfcfc;
  }

  .sx-img img {
    max-height: 100%;
    width: auto;
    object-fit: contain;
  }

  .col-dx {
    height: auto !important;
    overflow-y: visible !important;
    padding-bottom: 120px;
    order: 2;
  }

  .dx-header {
    padding: 16px 24px;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .pista {
    padding: 24px;
  }

  .desc, .track-desc {
    max-width: 100%;
  }
}
</style>