<script>
  import { goto } from '$app/navigation'
  import { config } from '$lib/config.svelte.js'
  config.fase = 1

  function scegli(venue) {
    config.venue = venue
  }
</script>

<div class="page">
  <main class="content">
    <p class="step">Step 01 — Environment</p>
    <h1>Scegli la pista</h1>

    <div class="scelte">
      <button class="pista" onclick={() => scegli('olympia')}>
        <span class="pista-nome">Olympia delle Tofane</span>
        <span class="pista-info">Cortina d'Ampezzo — Femminile</span>
      </button>
      <button class="pista" onclick={() => scegli('bormio')}>
        <span class="pista-nome">Stelvio</span>
        <span class="pista-info">Bormio — Maschile</span>
      </button>
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
    padding: 4rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .step {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #666;
  }

  .scelte {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }

  .pista {
    border: 2px solid black;
    background: transparent;
    padding: 3rem 2rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;
    font-family: inherit;
    transition: background 0.2s;
  }

  .pista:hover {
    background: black;
    color: white;
  }

  .pista-nome {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .pista-info {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.6;
  }
</style>