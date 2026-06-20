<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { config } from '$lib/config.svelte.js'
  import OcchialiDither from '$lib/components/OcchialiDither.svelte'

  let fase = $state('scorre')

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

    <!-- ── FASCIA ALTA : due celle ── -->
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

    <!-- ── BANDA EQUAZIONE ── -->
    <div class="banda">
      <span>ENVIRONMENT</span>
      <span class="op">+</span>
      <span>ATHLETE</span>
      <span class="op">+</span>
      <span>EQUIPMENT</span>
      <span class="op">=</span>
      <span>PERFORMANCE</span>
    </div>

    <!-- ── FASCIA BASSA : tre colonne ── -->
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
    grid-template-rows: auto auto 1fr;
    animation: fadeIn 0.6s ease forwards;
    overflow: hidden;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .bordo-r { border-right: 1.5px solid black; }

  .num-title {
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    font-weight: 800;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .cella p {
    font-size: 0.74rem;
    line-height: 1.6;
    color: #444;
    margin-bottom: 0.75rem;
  }

  /* FASCIA ALTA */
  .riga-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1.5px solid black;
  }

  .riga-top .cella {
    padding: 2.25rem 2.5rem;
  }

  /* BANDA */
  .banda {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 2.5rem;
    border-bottom: 1.5px solid black;
    font-size: clamp(1.1rem, 2.6vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .banda .op {
    font-weight: 400;
    opacity: 0.5;
  }

  /* FASCIA BASSA */
  .riga-bottom {
    display: grid;
    grid-template-columns: 0.8fr 2fr 0.8fr;
    overflow: hidden;
  }

  .riga-bottom .cella {
    padding: 2rem 2.25rem;
    overflow-y: auto;
  }

  .cella-occhiali {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  z-index: 5;
}

  /* TABELLA REGULATIONS */
  .reg-list {
    margin-top: 1.5rem;
    border-top: 1.5px solid black;
  }

  .reg-row {
    display: grid;
    grid-template-columns: 42px 1fr;
    border-bottom: 1.5px solid black;
  }

  .reg-num {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1.5px solid black;
    font-weight: 700;
    font-size: 0.85rem;
  }

  .reg-row p {
    padding: 0.85rem;
    font-size: 0.7rem;
    line-height: 1.5;
    color: #444;
    margin: 0;
  }
</style>