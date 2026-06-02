<script>
  import '../app.css'
  import { config } from '$lib/config.svelte.js'
  import { goto } from '$app/navigation'

  let { children } = $props()
</script>

{@render children()}

<footer class="barra" class:nascosta={!config.introFinita}>
  <span class="brand">OFFRACE</span>
  {#if config.fase > 0}
    <div class="fasi">
      <div class="fase" class:attiva={config.fase === 1}>
        <div class="fase-label">
          <span class="fase-num">Phase 1</span>
          <span class="fase-nome">Environment</span>
        </div>
        {#if config.fase === 1 && config.venue}
          <div class="fase-info">
            <span>{config.venue === 'bormio' ? 'Stelvio — Bormio' : 'Olympia — Cortina'}</span>
          </div>
        {/if}
      </div>
      <div class="fase" class:attiva={config.fase === 2}>
        <div class="fase-label">
          <span class="fase-num">Phase 2</span>
          <span class="fase-nome">Athlete</span>
        </div>
        {#if config.fase === 2 && config.venue}
          <div class="fase-info">
            <div class="info-riga">
              <span class="info-label">venue</span>
              <span>{config.venue === 'bormio' ? 'Uomo' : 'Donna'}</span>
            </div>
            <div class="info-riga">
              <span class="info-label">suit</span>
              <span>{config.tutaIndex === 0 ? '—' : config.tutaIndex === 1 ? 'Legal' : config.tutaIndex === 2 ? 'Borderline' : 'Tech Doping'}</span>
            </div>
          </div>
        {/if}
      </div>
      <div class="fase" class:attiva={config.fase === 3}>
        <div class="fase-label">
          <span class="fase-num">Phase 3</span>
          <span class="fase-nome">Equipment</span>
        </div>
        {#if config.fase === 3}
          <div class="fase-info">
            <div class="info-riga">
              <span class="info-label">geometry</span>
              <span>L {config.lunghezza}cm R {config.raggio}m W {config.larghezza}mm</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-riga">
                <span class="info-label">material</span>
                <span>{config.materiale}</span>
              </div>
              <div class="info-riga">
                <span class="info-label">wax protocol</span>
                <span>{config.cera}</span>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
    <button class="next" onclick={() => {
      if (config.fase === 1) goto('/athlete')
      if (config.fase === 2) goto('/equipment/geometry')
      if (config.fase === 3) goto('/result')
    }}>NEXT PHASE →</button>
  {/if}
</footer>

<style>
  .barra {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    border-top: 2px solid black;
    background: var(--mc-bg);
    display: flex;
    align-items: stretch;
    z-index: 100;
    transition: opacity 0.5s;
  }

  .barra.nascosta {
    opacity: 0;
    pointer-events: none;
  }

  .brand {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    border-right: 2px solid black;
    white-space: nowrap;
  }

  .fasi {
    flex: 1;
    display: flex;
    align-items: stretch;
  }

  .fase {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 1.5rem;
    border-right: 2px solid black;
    transition: background 0.3s;
  }

  .fase.attiva {
    background: black;
    color: white;
  }

  .fase-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .fase-num {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.6;
  }

  .fase-nome {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .fase-info {
    border-left: 1px solid rgba(255,255,255,0.3);
    padding-left: 1rem;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .info-riga {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .info-label {
    opacity: 0.6;
    font-size: 0.6rem;
  }

  .info-row-bottom {
    display: flex;
    gap: 1.5rem;
  }

  .next {
    padding: 0 2rem;
    background: black;
    color: white;
    border: none;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
  }

  .next:hover {
    background: #333;
  }
</style>
