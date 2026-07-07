<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { config } from '$lib/config.svelte.js'
  import OcchialiDither from '$lib/components/OcchialiDither.svelte'

  let fase = $state('scorre')

  onMount(() => {
    setTimeout(() => {
      config.introFinita = true
      fase = 'home'
    }, 5000)
  })
</script>

{#if fase === 'scorre'}
  <div class="intro">
    <span class="intro-title">OFFRACE</span>
  </div>
{:else}
  <div class="home">

    <div class="riga-top">
      <div class="cella bordo-r">
        <h3 class="num-title">01_Performance</h3>
        <p>Alpine skiing performance is the outcome of a complex, interconnected system. It is driven by the athlete, the equipment, the environment, the regulations, and the timing and precision measurement systems.</p>
      </div>
      <div class="cella">
        <h3 class="num-title">02_More than an athlete</h3>
        <p>An athlete's success is about more than just talent and physical or mental preparation. While these are obviously essential, they are often not enough to reach the top. The equipment they use also plays a crucial role.</p>
      </div>
    </div>

    <div class="banda">
      <div class="marquee-track">
        {#each [1, 2, 3, 4] as i}
          <div class="marquee-item">
            <span>ENVIRONMENT</span>
            <span class="op">+</span>
            <span>ATHLETE</span>
            <span class="op">+</span>
            <span>EQUIPMENT</span>
            <span class="op">=</span>
            <span class="fluo">PERFORMANCE</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="riga-bottom">

      <div class="cella bordo-r">
        <h3 class="num-title">03_Technodoping</h3>
        <p>Technodoping is an interconnected system. It involves technologies that enhance performance to the point of challenging the very concept of sport as something comparable, merit-based, and governable. The core issue is determining whether performance can still be fundamentally credited to the athlete, or if it has simply become the product of a technical advantage gained through superior resources.</p>
      </div>

      <div class="cella-occhiali bordo-r">
        <OcchialiDither />
      </div>

      <div class="cella no-scroll">
        <h3 class="num-title">04_Regulations</h3>
        <p>The International Ski Federation's rules define the framework for what is possible in terms of performance.</p>

        <div class="reg-list">
          <div class="reg-row">
            <span class="reg-num">1</span>
            <p>Gender-specific ski geometry (male or female): length and turning radius.</p>
          </div>
          <div class="reg-row">
            <span class="reg-num">2</span>
            <p>The core and composite materials of the ski layers.</p>
          </div>
          <div class="reg-row">
            <span class="reg-num">3</span>
            <p>The type of ski wax applied to the base for snow contact.</p>
          </div>
        </div>
      </div>

    </div>

  </div>
{/if}

<style>
  /* ── INTRO ── */
  .intro {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center; 
    justify-content: flex-start;
    background: var(--mc-bg);
    overflow: hidden;
  }

  .intro-title {
    font-size: 125vh; 
    line-height: 0.72; 
    font-weight: 700;
    letter-spacing: -0.05em;
    white-space: nowrap;
    text-transform: uppercase;
    animation: scorra 5s linear forwards;
    color: black;
    margin: 0;
    padding: 0;
  }

  @keyframes scorra {
    0%   { transform: translateX(100vw); }
    100% { transform: translateX(-400vw); }
  }

  /* ── HOME ── */
  .home {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 76px; 
    display: grid;
    grid-template-rows: auto auto 1fr;
    overflow: hidden;
    
    opacity: 0;
    animation: fadeIn 0.8s ease 0.8s forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .bordo-r { border-right: 1.5px solid black; }

  /* ── TIPOGRAFIA & DISTANZE ── */
  .num-title {
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 24px;
    margin-top: 0;
  }

  .cella p {
    font-size: 0.78rem;
    line-height: 1.6;
    color: #444;
    margin-bottom: 16px;
    margin-top: 0;
  }

  .cella p:last-child {
    margin-bottom: 0;
  }

  /* FASCIA ALTA */
  .riga-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1.5px solid black;
  }

  .riga-top .cella {
    padding: 40px;
  }

  /* ── BANDA MARQUEE ── */
  .banda {
    background: black; 
    color: white; 
    overflow: hidden; 
    padding: 24px 0; 
    border-bottom: 1.5px solid black;
    display: flex;
    align-items: center;
  }

  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee 15s linear infinite; 
  }

  .marquee-item {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-right: 48px; 
    font-size: clamp(1.1rem, 2.6vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .marquee-item .op {
    font-weight: 400;
    opacity: 0.5;
  }

  .marquee-item .fluo {
    color: #BDF522;
  }

  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); } 
  }

  /* FASCIA BASSA */
  .riga-bottom {
    display: grid;
    grid-template-columns: 0.8fr 2fr 0.8fr;
    min-height: 0; 
    overflow: hidden;
  }

  .riga-bottom .cella {
    padding: 40px;
    height: 100%;
    overflow: hidden; /* Fissato: rimosso auto */
  }

  .cella-occhiali {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    z-index: 5;
    height: 100%;
    overflow: hidden;
  }

  /* ── TABELLA REGULATIONS ── */
  .reg-list {
    margin-top: 24px;
    margin-left: -40px;
    margin-right: -40px;
    border-top: 1.5px solid black;
  }

  .reg-row {
    display: flex;
    gap: 24px;
    padding: 16px 40px; 
    border-bottom: 1.5px solid black;
  }

  /* Rimuove il bordo dall'ultima riga */
  .reg-row:last-child {
    border-bottom: none;
  }

  .reg-num {
    flex-shrink: 0;
    font-family: 'Geist Mono', monospace;
    font-weight: 700;
    font-size: 0.85rem;
    padding-top: 1px;
  }

  .reg-row p {
    font-size: 0.78rem;
    line-height: 1.6;
    color: #444;
    margin: 0;
    padding: 0;
  }

/* ── RESPONSIVE PER MOBILE ── */
@media (max-width: 768px) {
  
  /* Sblocchiamo i tag globali del telefono per permettere lo scroll */
  :global(html), :global(body) {
    overflow-y: auto !important;
    height: auto !important;
  }

  /* ── INTRO MOBILE ── */
  .intro-title {
    font-size: 70vh;
    line-height: 0.8;
  }

  /* ── STRUTTURA HOME MOBILE ── */
  .home {
    position: relative;
    inset: auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 100px; /* Spazio di sicurezza per il footer del layout */
    
    /* Forziamo l'altezza dinamica e abilitiamo lo scroll */
    height: auto !important;
    overflow-y: auto !important;
    overflow-x: hidden;
  }

  .bordo-r {
    border-right: none;
    border-bottom: 1.5px solid black; /* Il bordo destro diventa inferiore */
  }

  /* Ottimizziamo i padding delle celle per i display più piccoli */
  .riga-top .cella, 
  .riga-bottom .cella,
  .cella-occhiali {
    padding: 24px !important;
    height: auto !important; /* Rimuove i blocchi rigidi di altezza */
    overflow-y: visible !important; /* Rimuove mini-scroll interni fastidiosi */
  }

  /* ── FASCIA ALTA (01 e 02 si incolonnano) ── */
  .riga-top {
    grid-template-columns: 1fr;
    height: auto !important;
  }

  /* ── BANDA MARQUEE RESPONSIVE ── */
  .banda {
    padding: 16px 0;
  }

  .marquee-item {
    font-size: 5vw; /* Scala in base alla larghezza dello schermo */
    gap: 16px;
    padding-right: 32px;
  }

  /* ── FASCIA BASSA (Ordine personalizzato tramite Flexbox) ── */
  .riga-bottom {
    display: flex;
    flex-direction: column;
    min-height: auto !important; 
    height: auto !important;
    overflow: visible !important; 
  }

  /* Posizione 1: Gli occhiali subito sotto il marquee */
  .cella-occhiali {
    height: 250px !important; 
    border-bottom: 1.5px solid black;
    order: 1; 
    padding-top: 40px !important; 
  }

  /* Posizione 2: Segue Technodoping (03) */
  .riga-bottom .cella:nth-child(1) {
    order: 2;
  }

  /* Posizione 3: Segue Regulations (04) */
  .riga-bottom .cella:nth-child(3) {
    order: 3;
    border-bottom: none; /* L'ultimo blocco chiude la lista senza bordi extra */
  }

  /* ── TABELLA REGULATIONS PER MOBILE ── */
  .reg-list {
    margin-left: -24px;
    margin-right: -24px;
  }

  .reg-row {
    padding: 16px 24px;
    gap: 16px;
  }
}
</style>