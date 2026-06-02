<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { config } from '$lib/config.svelte.js'

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
    <main class="hero">
      <h1>OFFRACE</h1>
      <p class="subtitle">Milano-Cortina 2026 - Winter Olympic Games</p>
      <button class="cta" onclick={() => goto('/environment')}>
        Discover
      </button>
    </main>
  </div>
{/if}

<style>
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

  .home {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.6s ease forwards;
    padding-bottom: 64px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 4rem;
    gap: 2rem;
  }

  .subtitle {
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #666;
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
  }

  .cta:hover {
    background: #333;
  }
</style>
