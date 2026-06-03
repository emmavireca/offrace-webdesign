<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { config } from '$lib/config.svelte.js'
  import OcchialiDither from '$lib/components/OcchialiDither.svelte'

  let fase = $state('scorre')
  let regulationsAperta = $state(false)

  onMount(() => {
    setTimeout(() => { fase = 'ritorna' }, 5000)
    setTimeout(() => {
      config.introFinita = true
      fase = 'home'
    }, 6500)
  })
</script>

{#if fase === 'scorre'}
  <div class="intro">
    <span class="intro-title">OFFRACE</span>
  </div>
{:else if fase === 'ritorna'}
  <div class="intro">
    <span class="intro-piccola">OFFRACE</span>
  </div>
{:else}
  <div class="home">

    <!-- COLONNA SINISTRA -->
    <div class="col-sx">
      <div class="sx-top">
        <h1>Performance</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>

      <div class="fasi-barra">
        <span>ENVIRONMENT</span>
        <span class="segno">+</span>
        <span>ATHLETE</span>
        <span class="segno">+</span>
        <span>EQUIPMENT</span>
        <span class="segno">=</span>
        <span class="attiva">PERFORMANCE</span>
      </div>

      <div class="sx-bottom">
        <div class="sx-bottom-testo">
          <h2>More than<br>an athlete</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet consectetur.</p>
        </div>
        <div class="sx-bottom-vuoto"></div>
      </div>
    </div>

    <!-- COLONNA DESTRA -->
    <div class="col-dx">
      <div class="dx-top">
        <h2>Technodoping</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.</p>
      </div>

      <button class="accordion-header" onclick={() => regulationsAperta = !regulationsAperta}>
        <span>REGULATIONS</span>
        <span class="chevron" class:ruotato={regulationsAperta}>∨</span>
      </button>
      {#if regulationsAperta}
        <div class="accordion-body">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      {/if}

      <div class="occhiali-box">
        <OcchialiDither />
      </div>
    </div>

  </div>
{/if}

<style>
  /* ── INTRO — NON TOCCARE ── */
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
    font-size: 120vh;
    font-weight: 700;
    letter-spacing: -0.05em;
    white-space: nowrap;
    line-height: 1;
    animation: scorra 5s linear forwards;
  }

  @keyframes scorra {
    0%   { transform: translateX(100vw); }
    100% { transform: translateX(-400vw); }
  }

  .intro-piccola {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    position: fixed;
    bottom: 0;
    height: 64px;
    display: flex;
    align-items: center;
    padding-left: 1rem;
    z-index: 101;
    animation: entra-piccola 1.2s ease forwards;
  }

  @keyframes entra-piccola {
    0%   { transform: translateX(-300px); opacity: 0; }
    100% { transform: translateX(2rem); opacity: 1; }
  }

  /* ── HOME ── */
  .home {
    position: fixed;
    inset: 0;
    bottom: 64px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    animation: fadeIn 0.6s ease forwards;
    overflow: hidden;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── COLONNA SINISTRA ── */
  .col-sx {
    border-right: 1.5px solid black;
    display: flex;
    flex-direction: column;
  }

  .sx-top {
    padding: 2rem 2.5rem;
    border-bottom: 1.5px solid black;
  }

  .sx-top h1 {
    font-size: clamp(2.5rem, 4vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 1rem;
  }

  .sx-top p {
    font-size: 0.75rem;
    line-height: 1.6;
    color: #444;
  }

  .fasi-barra {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 2.5rem;
    border-bottom: 1.5px solid black;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #999;
  }

  .fasi-barra .segno { color: #bbb; }
  .fasi-barra .attiva { color: #BDF522; }

  .sx-bottom {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  .sx-bottom-testo {
    padding: 2rem 2rem 2rem 2.5rem;
    border-right: 1.5px solid black;
    overflow-y: auto;
  }

  .sx-bottom-testo h2 {
    font-size: clamp(1.8rem, 3vw, 2.8rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.05;
    margin-bottom: 1rem;
  }

  .sx-bottom-testo p {
    font-size: 0.75rem;
    line-height: 1.6;
    color: #444;
  }

  .sx-bottom-vuoto { /* vuoto come nel prototipo */ }

  /* ── COLONNA DESTRA ── */
  .col-dx {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .dx-top {
    padding: 2rem 2.5rem;
    border-bottom: 1.5px solid black;
  }

  .dx-top h2 {
    font-size: clamp(2.5rem, 4vw, 4rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-bottom: 1rem;
  }

  .dx-top p {
    font-size: 0.75rem;
    line-height: 1.6;
    color: #444;
  }

  .accordion-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2.5rem;
    background: black;
    color: white;
    border: none;
    border-bottom: 1.5px solid black;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
  }

  .chevron { transition: transform 0.3s; }
  .chevron.ruotato { transform: rotate(180deg); }

  .accordion-body {
    padding: 1.5rem 2.5rem;
    border-bottom: 1.5px solid black;
  }

  .accordion-body p {
    font-size: 0.75rem;
    line-height: 1.6;
    color: #444;
  }

  .occhiali-box {
    flex: 1;
    padding: 1.5rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid black;
    margin: 1.5rem;
  }
</style>