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
            <div class="info-row">
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
              <span class="info-valore">DEV {config.deviazione || '—'}CM / RFD {config.rfd || '—'}N/S</span>
            </div>
            <div class="info-row">
              <div class="info-block">
                <span class="info-label">MASS</span>
                <span class="info-valore">{config.massa || '—'} KG</span>
              </div>
              <div class="info-block">
                <span class="info-label">SUIT</span>
                <span class="info-valore">{config.tutaIndex === 1 ? 'LEGAL' : config.tutaIndex === 2 ? 'BORDERLINE' : 'DOPING'}</span>
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
            <div class="info-row">
              <div class="info-block">
                <span class="info-label">MATERIAL</span>
                <span class="info-valore">{config.materiale || '—'}</span>
              </div>
              <div class="info-block">
                <span class="info-label">WAX PROTOCOL</span>
                <span class="info-valore">{config.cera || '—'}</span>
              </div>
            </div>
          </div>
        {/if}
      </button>

    </div>
  {/if}
  
  <button type="button" class="next" onclick={() => {
      const rotte = ['/environment', '/athlete', '/equipment', '/result'];
      goto(rotte[config.fase] || '/result');
    }}>
    {config.fase === 0 ? 'START SIMULATION →' : 'NEXT PHASE →'}
  </button>
</footer>

<style>
  .barra {
    position: fixed; bottom: 0; left: 0; right: 0; height: 76px;
    border-top: 1.5px solid black; background: white;
    display: flex; align-items: stretch; z-index: 100;
  }
  .brand {
    padding: 0 2rem; display: flex; align-items: center;
    border-right: 1.5px solid black; font-weight: 600; font-size: 0.7rem;
  }
  .fasi { flex: 1; display: flex; align-items: stretch; overflow: hidden; }

  .fase {
    flex: 1; border: none; border-right: 1.5px solid black;
    background: transparent; padding: 0 24px;
    display: flex; align-items: center; gap: 20px;
    cursor: pointer; min-width: 0; transition: background 0.3s;
  }
  
  /* Testo grigio scuro (#777) per fasi non ancora raggiunte */
  .fase:disabled { 
    color: #777; 
    cursor: default; 
    pointer-events: none; 
  }
  
  .fase.attiva { background: black; color: white; }

  .fase-label { width: 100px; flex-shrink: 0; display: flex; flex-direction: column; gap: 4px; text-align: left; }
  .fase-num { font-size: 0.65rem; opacity: 0.7; text-transform: uppercase; }
  .fase-nome { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }

  .fase-info {
    flex: 1; border-left: 1.5px solid currentColor; padding-left: 16px;
    display: flex; flex-direction: column; justify-content: center; gap: 6px;
    overflow: hidden; text-align: left;
  }
  .info-row { display: flex; gap: 16px; }
  .info-block { display: flex; flex-direction: column; gap: 1px; min-width: 0; text-align: left; }
  .info-label { font-size: 0.5rem; opacity: 0.5; text-transform: uppercase; }
  .info-valore { font-size: 0.75rem; font-weight: 500; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .next {
    padding: 0 2.5rem; background: black; color: white; border: none;
    font-size: 0.75rem; font-weight: 600; cursor: pointer; text-transform: uppercase;
  }
</style>