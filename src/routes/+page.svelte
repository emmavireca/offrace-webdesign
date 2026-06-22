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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
      </div>
      <div class="cella">
        <h3 class="num-title">02_More than an athlete</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.</p>
      </div>

      <div class="cella-occhiali bordo-r">
        <OcchialiDither />
      </div>

      <div class="cella">
        <h3 class="num-title">04_Regulations</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>

        <div class="reg-list">
          <div class="reg-row">
            <span class="reg-num">1</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div class="reg-row">
            <span class="reg-num">2</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
          </div>
          <div class="reg-row">
            <span class="reg-num">3</span>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
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

  /* ── TIPOGRAFIA & DISTANZE (Standardizzate a 40px/24px) ── */
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
    overflow-y: auto; 
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

  /* ── TABELLA REGULATIONS (Estesa) ── */
  .reg-list {
    margin-top: 24px;
    /* I margini negativi estendono la riga coprendo esattamente il padding di 40px della cella */
    margin-left: -40px;
    margin-right: -40px;
    border-top: 1.5px solid black;
  }

  .reg-row {
    display: flex;
    gap: 24px; /* Stessa distanza logica del resto del sito */
    /* Rimettiamo i 40px orizzontali per riallineare il contenuto col resto della cella */
    padding: 16px 40px; 
    border-bottom: 1.5px solid black;
  }

  .reg-num {
    flex-shrink: 0;
    font-family: 'Geist Mono', monospace;
    font-weight: 700;
    font-size: 0.85rem;
    padding-top: 1px; /* Riallineamento ottico col testo */
  }

  .reg-row p {
    font-size: 0.78rem;
    line-height: 1.6;
    color: #444;
    margin: 0;
    padding: 0; /* Il padding ora è gestito direttamente dalla riga */
  }
</style>