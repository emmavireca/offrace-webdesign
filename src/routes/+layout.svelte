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
      
      <button type="button" class="fase" class:attiva={config.fase === 1} disabled={config.fase < 1} onclick={() => goto('/environment')}>
        <div class="fase-label">
          <span class="fase-num">Phase 1</span>
          <span class="fase-nome">Environment</span>
        </div>
        {#if config.fase >= 1 && config.venue}
          <div class="fase-info">
            <div class="info-block">
              <span class="info-label">TRACK</span>
              <span class="info-valore">{config.venue === 'bormio' ? 'STELVIO — BORMIO' : 'OLYMPIA DELLE TOFANE'}</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-block">
                <span class="info-label">GENDER</span>
                <span class="info-valore">{config.venue === 'bormio' ? 'MALE' : 'FEMALE'}</span>
              </div>
            </div>
          </div>
        {/if}
      </button>
      
      <button type="button" class="fase" class:attiva={config.fase === 2} disabled={config.fase < 2} onclick={() => goto('/athlete')}>
        <div class="fase-label">
          <span class="fase-num">Phase 2</span>
          <span class="fase-nome">Athlete</span>
        </div>
        {#if config.fase >= 2}
          <div class="fase-info">
            <div class="info-block">
              <span class="info-label">TRAJECTORY DEVIATION & RFD</span>
              <span class="info-valore">DEV {config.deviazione || '—'}CM &nbsp; RFD {config.rfd || '—'}N/S</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-block">
                <span class="info-label">MASS</span>
                <span class="info-valore">{config.massa || '—'} KG</span>
              </div>
              <div class="info-block">
                <span class="info-label">SUIT</span>
                <span class="info-valore">{config.tutaIndex ? (config.tutaIndex === 1 ? 'LEGAL' : config.tutaIndex === 2 ? 'BORDERLINE' : 'DOPING') : '—'}</span>
              </div>
            </div>
          </div>
        {/if}
      </button>

      <button type="button" class="fase" class:attiva={config.fase === 3} disabled={config.fase < 3} onclick={() => goto('/equipment')}>
        <div class="fase-label">
          <span class="fase-num">Phase 3</span>
          <span class="fase-nome">Equipment</span>
        </div>
        {#if config.fase >= 3}
          <div class="fase-info">
            <div class="info-block">
              <span class="info-label">GEOMETRY</span>
              <span class="info-valore">L {config.lunghezza || '—'}CM R {config.raggio || '—'}M W {config.larghezza || '—'}MM</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-block">
                <span class="info-label">MATERIAL</span>
                <span class="info-valore">{config.materiale ? config.materiale : '—'}</span>
              </div>
              <div class="info-block">
                <span class="info-label">WAX PROTOCOL</span>
                <span class="info-valore">{config.cera ? config.cera : '—'}</span>
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
    position: fixed; bottom: 0; left: 0; right: 0; height: 72px;
    border-top: 1.5px solid black; background: var(--mc-bg, #fff);
    display: flex; align-items: stretch; z-index: 100;
  }
  .brand {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; padding: 0 2.5rem;
    display: flex; align-items: center; border-right: 1.5px solid black;
  }
  .fasi { flex: 1; display: flex; align-items: stretch; overflow: hidden; }

  .fase {
    flex: 1; color: black; border: none; background: transparent;
    font-family: inherit; text-align: left; cursor: pointer;
    display: flex; align-items: center; gap: 24px; padding: 0 24px;
    border-right: 1.5px solid black; transition: all 0.3s ease;
  }

  /* Logica fasi disabilitate (grigie) */
  .fase:disabled {
    background: #f0f0f0 !important;
    opacity: 0.6;
    filter: grayscale(1);
    cursor: default;
    pointer-events: none;
  }

  .fase.attiva { background: black; color: white; }

  .fase-label { display: flex; flex-direction: column; justify-content: center; gap: 20px; flex-shrink: 0; }
  .fase-num { font-size: 0.8rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.7; }
  .fase-nome { font-size: 1.05rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }

  .fase-info {
    border-left: 1.5px solid currentColor; padding-left: 16px;
    display: flex; flex-direction: column; justify-content: center;
    gap: 8px; height: 100%; flex: 1; overflow: hidden;
  }
  .info-row-bottom { display: flex; gap: 24px; }
  .info-block { display: flex; flex-direction: column; gap: 2px; }
  .info-label { font-size: 0.55rem; opacity: 0.5; text-transform: uppercase; }
  .info-valore { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .next {
    padding: 0 2.5rem; background: black; color: white; border: none;
    font-size: 0.75rem; font-weight: 600; text-transform: uppercase; cursor: pointer;
  }
</style>