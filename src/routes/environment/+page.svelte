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
        <img src={piste[pistaMostrata].img} alt={piste[piste[pistaMostrata].nome]} />
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
    bottom: 64px; /* Lascia lo spazio esatto per l'altezza del footer layout */
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  /* ── SINISTRA ── */
  .col-sx {
    border-right: 1.5px solid black; /* Uniformato a 1.5px */
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sx-top {
    padding: 40px; /* Uniformato a 40px (coerente con i 2.5rem/40px di tutto il progetto) */
    border-bottom: 1.5px solid black; /* Uniformato a 1.5px */
  }

  .sx-top h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-top: 0;
    margin-bottom: 24px; /* Uniformato a multiplo */
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
    padding: 40px; /* Uniformato a 40px */
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
    padding-bottom: 40px; /* Evita collisioni visive con il fondo o con il footer */
  }

  .dx-header {
    padding: 24px 40px; /* Uniformato l'allineamento orizzontale a 40px */
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-bottom: 1.5px solid black; /* Uniformato a 1.5px */
  }

  .pista {
    border: none;
    border-bottom: 1.5px solid black; /* Uniformato a 1.5px */
    background: transparent;
    padding: 28px 40px; /* Allineato orizzontalmente a 40px */
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px; /* Arrotondato a multiplo preciso */
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
    margin: 0;
  }

  .track-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 8px; /* Uniformato */
    margin-bottom: 0;
  }

  .track-desc {
    font-size: 0.72rem;
    line-height: 1.55;
    opacity: 0.7;
    max-width: 42ch;
    margin-top: 0;
    margin-bottom: 8px; /* Uniformato */
  }

  /* STATS */
  .stats {
    display: flex;
    flex-direction: column;
    gap: 4px; /* Arrotondato a multiplo di 4 */
    margin-top: 8px; /* Uniformato */
  }

  .stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: black;
    color: white;
    padding: 8px 16px; /* Uniformato a pixel puliti */
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
    gap: 8px; /* Arrotondato */
  }

  .dot {
    width: 8px; /* Arrotondato */
    height: 8px; /* Arrotondato */
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
    margin-left: 8px; /* Uniformato */
    opacity: 0.8;
  }
</style>