<script>
  import '../app.css'
  import { config } from '$lib/config.svelte.js'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  let { children } = $props()

  let isHome = $derived($page.url.pathname === '/')

  $effect(() => {
    if (isHome) {
      config.introFinita = false;
    }
  });

  let mostraBarra = $derived(!isHome || config.introFinita)
</script>

{@render children()}

<footer class="barra" class:nascosta={!mostraBarra} class:home={isHome}>
  
  <button type="button" class="brand" onclick={() => { config.fase = 0; config.introFinita = false; goto('/'); }}>
    OFFRACE
  </button>
  
  <div class="fasi">
    {#if !isHome}
      
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

    {/if}
  </div>
  
  <button type="button" class="next" onclick={() => {
      if (isHome) goto('/environment')
      else {
        const rotte = ['/environment', '/athlete', '/equipment', '/result'];
        goto(rotte[config.fase] || '/result');
      }
    }}>
    {isHome ? 'START SIMULATION →' : 'NEXT PHASE →'}
  </button>
</footer>

<style>
  .barra {
    position: fixed; bottom: 0; left: 0; right: 0; height: 76px; 
    border-top: 1.5px solid black; background: var(--mc-bg, #fff);
    display: flex; align-items: stretch; z-index: 100;
    pointer-events: auto;
    
    /* MODIFICATO: La barra parte da sinistra (-100%) e scorre verso destra (0) */
    transform: translateX(-100%);
    animation: slideRightBar 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  @keyframes slideRightBar {
    to { transform: translateX(0); }
  }

  .barra.nascosta {
    display: none !important;
  }

  .barra.home {
    background: #BDF522;
    border-top: none;
    display: grid;
    grid-template-columns: 0.8fr 2fr 0.8fr;
  }

  .brand {
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em;
    text-transform: uppercase; padding: 0 40px; 
    display: flex; align-items: center; justify-content: flex-start;
    border: none; border-right: 1.5px solid black; background: transparent;
    color: black; white-space: nowrap; cursor: pointer; transition: background 0.2s;
    
    /* Parte trasparente e leggermente a sinistra, arriva dopo la barra */
    opacity: 0;
    animation: slideRightBrand 0.6s ease 0.4s forwards;
  }

  @keyframes slideRightBrand {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .brand:hover { background: rgba(0, 0, 0, 0.05); }

  .fasi { flex: 1; display: flex; align-items: stretch; overflow: hidden; opacity: 0; animation: fadeInText 0.6s ease 0.4s forwards;}

  .fase {
    flex: 1; color: black; border: none; background: transparent;
    font-family: inherit; text-align: left; cursor: pointer; display: flex;
    align-items: center; gap: 24px; padding: 0 24px; border-right: 1.5px solid black;
    transition: background 0.2s, color 0.3s; min-width: 0; 
  }

  .fase:not(:disabled):not(.attiva):hover { background: #e8e8e8; }
  .fase:disabled { color: #777; cursor: default; pointer-events: none; }
  .fase.attiva { background: black; color: white; cursor: default;}

  .fase-label { display: flex; flex-direction: column; justify-content: center; gap: 20px; flex-shrink: 0; width: 100px; }
  .fase-num { font-size: 0.8rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; line-height: 1; opacity: 0.7; }
  .fase-nome { font-size: 1.05rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1; }

  .fase-info {
    border-left: 1.5px solid currentColor; padding-left: 16px; display: flex;
    flex-direction: column; justify-content: center; gap: 8px; height: 100%; flex: 1; overflow: hidden; 
  }
  .info-row-bottom { display: flex; gap: 24px; }
  .info-block { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .info-label { font-size: 0.55rem; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.5; line-height: 1; }
  .info-valore { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.02em; text-transform: uppercase; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* ── PULSANTE DESTRO ── */
  .next {
    display: flex; align-items: center; justify-content: center; padding: 0 40px;
    background: black; color: white; border: none; font-size: 0.75rem;
    font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; font-family: inherit; white-space: nowrap; transition: background 0.2s; flex-shrink: 0; 
    
    /* Appare in dissolvenza insieme alla scritta OFFRACE */
    opacity: 0;
    animation: fadeInText 0.6s ease 0.4s forwards;
  }

  @keyframes fadeInText {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .next:hover { background: #333; }

  .barra.home .next {
    width: 100%; padding: 0; border-left: 1.5px solid black;
  }
</style>