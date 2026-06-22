<script>
  import '../app.css'
  import { config } from '$lib/config.svelte.js'
  import { goto } from '$app/navigation'

  let { children } = $props()

  // La barra si mostra se l'intro è finita o se siamo già dentro le pagine di simulazione
  let mostraBarra = $derived(config.introFinita || (config.fase && config.fase > 0))
</script>

{@render children()}

<footer class="barra" class:nascosta={!mostraBarra} class:home={config.fase === 0}>
  <span class="brand">OFFRACE</span>
  
  {#if config.fase && config.fase > 0}
    <div class="fasi">
      
      <button 
        type="button"
        class="fase" 
        class:attiva={config.fase === 1}
        disabled={config.fase < 1}
        onclick={() => goto('/environment')}
      >
        <div class="fase-label">
          <span class="fase-num">Phase 1</span>
          <span class="fase-nome">Environment</span>
        </div>
        {#if config.fase === 1 && config.venue}
          <div class="fase-info">
            <span class="info-valore">{config.venue === 'bormio' ? 'Stelvio — Bormio' : 'Olympia — Cortina'}</span>
          </div>
        {/if}
      </button>
      
      <button 
        type="button"
        class="fase" 
        class:attiva={config.fase === 2}
        disabled={config.fase < 2}
        onclick={() => goto('/athlete')}
      >
        <div class="fase-label">
          <span class="fase-num">Phase 2</span>
          <span class="fase-nome">Athlete</span>
        </div>
        {#if config.fase === 2}
          <div class="fase-info">
            <div class="info-riga">
              <span class="info-label">venue</span>
              <span class="info-valore">{config.venue ? (config.venue === 'bormio' ? 'Uomo' : 'Donna') : '—'}</span>
            </div>
            <div class="info-riga">
              <span class="info-label">suit</span>
              <span class="info-valore">{config.tutaIndex ? (config.tutaIndex === 1 ? 'Legal' : config.tutaIndex === 2 ? 'Borderline' : 'Tech Doping') : '—'}</span>
            </div>
          </div>
        {/if}
      </button>

      <button 
        type="button"
        class="fase" 
        class:attiva={config.fase === 3}
        disabled={config.fase < 3}
        onclick={() => goto('/equipment')}
      >
        <div class="fase-label">
          <span class="fase-num">Phase 3</span>
          <span class="fase-nome">Equipment</span>
        </div>
        {#if config.fase === 3}
          <div class="fase-info">
            <div class="info-riga">
              <span class="info-label">geometry</span>
              <span class="info-valore">L {config.lunghezza || '—'}cm R {config.raggio || '—'}m W {config.larghezza || '—'}mm</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-riga">
                <span class="info-label">material</span>
                <span class="info-valore">{config.materiale || '—'}</span>
              </div>
              <div class="info-riga">
                <span class="info-label">wax protocol</span>
                <span class="info-valore">{config.cera || '—'}</span>
              </div>
            </div>
          </div>
        {/if}
      </button>

    </div>
  {/if}
  
  <button type="button" class="next" onclick={() => {
      if (config.fase === 0) goto('/environment')
      if (config.fase === 1) goto('/athlete')
      if (config.fase === 2) goto('/equipment')
      if (config.fase === 3) goto('/result')
    }}>
      {config.fase === 0 ? 'START SIMULATION →' : 'NEXT PHASE →'}
    </button>
</footer>

<style>
  .barra {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    border-top: 1.5px solid black;
    background: var(--mc-bg, #fff);
    display: flex;
    align-items: stretch;
    z-index: 100;
    transition: opacity 0.5s, background-color 0.3s;
    pointer-events: auto;
  }

  .barra.nascosta {
    opacity: 0;
    pointer-events: none;
  }

  .barra.home {
    background: #BDF522;
    border-top: none;
  }

  .brand {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 0 2.5rem;
    display: flex;
    align-items: center;
    border-right: 1.5px solid black;
    white-space: nowrap;
    pointer-events: none;
    color: black;
  }

  .fasi {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  .fase {
    color: black;
    border: none;
    background: transparent;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0 2rem;
    border-right: 1.5px solid black;
    transition: background 0.3s, color 0.3s;
    pointer-events: auto;
  }

  /* Rimuove la manina se la fase è futura (disabilitata) */
  .fase:disabled {
    cursor: default;
  }

  .fase.attiva {
    background: black;
    color: white;
  }

  .fase-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
    flex-shrink: 0;
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
    border-left: 1px solid currentColor; 
    opacity: 0.8;
    padding-left: 1.5rem;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px; 
    height: 100%;
    overflow: hidden; 
  }

  .info-riga {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.1; 
  }

  .info-label {
    opacity: 0.6;
    font-size: 0.55rem;
  }
  
  .info-valore {
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
  }

  .info-row-bottom {
    display: flex;
    gap: 1rem;
  }

  .next {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding: 0 2.5rem;
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
    transition: background 0.2s;
    pointer-events: auto;
  }

  .next:hover {
    background: #222;
  }
</style>