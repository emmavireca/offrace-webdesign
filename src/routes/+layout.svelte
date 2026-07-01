<script>
  import '../app.css'
  import { config } from '$lib/config.svelte.js'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  let { children } = $props()

  let isHome = $derived($page.url.pathname === '/')

  // Tiene traccia della fase massima raggiunta per mantenere i dati visibili se si torna indietro
  let maxFase = $state(0)

  $effect(() => {
    if (isHome) {
      config.introFinita = false
      maxFase = 0 // Resetta quando si torna alla home
    } else if (config.fase > maxFase) {
      maxFase = config.fase // Aggiorna il traguardo massimo raggiunto
    }
  })

  let mostraBarra = $derived(!isHome || config.introFinita)
</script>

{@render children()}

<footer class="barra" class:nascosta={!mostraBarra} class:home={isHome}>
  
  <!-- RETTANGOLO 1 -->
  <button type="button" class="brand" onclick={() => { config.fase = 0; config.introFinita = false; maxFase = 0; goto('/'); }}>
    OFFRACE
  </button>
  
  <div class="fasi">
    {#if !isHome}
      
      <!-- FASE 1 (RETTANGOLI 2 E 3) -->
      <button type="button" class="fase" class:attiva={config.fase === 1} disabled={maxFase < 1} onclick={() => goto('/environment')}>
        <div class="fase-label">
          <span class="fase-num">Phase 1</span>
          <span class="fase-nome">Environment</span>
        </div>
        {#if maxFase >= 1}
          <div class="fase-info">
            <div class="info-block">
              <span class="info-label">TRACK</span>
              <span class="info-valore">{config.venue === 'bormio' ? 'STELVIO — BORMIO' : 'OLYMPIA DELLE TOFANE'}</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-block">
                <span class="info-label">TYPE</span>
                <span class="info-valore">{config.venue === 'bormio' ? 'MALE TRACK' : 'FEMALE TRACK'}</span>
              </div>
            </div>
          </div>
        {/if}
      </button>
      
      <!-- FASE 2 (RETTANGOLI 4 E 5) -->
      <button type="button" class="fase" class:attiva={config.fase === 2} disabled={maxFase < 2} onclick={() => goto('/athlete')}>
        <div class="fase-label">
          <span class="fase-num">Phase 2</span>
          <span class="fase-nome">Athlete</span>
        </div>
        {#if maxFase >= 2}
          <div class="fase-info">
            <div class="info-block">
              <span class="info-label">TRAJ. DEV & RFD</span>
              <span class="info-valore">DEV {config.deviazione || '—'}CM &nbsp; RFD {config.rfd || '—'}N/S</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-block">
                <span class="info-label">MASS</span>
                <span class="info-valore">{config.massa || '—'} KG</span>
              </div>
              <div class="info-block">
                <span class="info-label">SUIT</span>
                <span class="info-valore">{config.tutaIndex ? (config.tutaIndex === 1 ? 'LEGAL' : config.tutaIndex === 2 ? 'BORDERLINE' : 'DOPING') : 'STANDARD'}</span>
              </div>
            </div>
          </div>
        {/if}
      </button>

      <!-- FASE 3 (RETTANGOLI 6 E 7) -->
      <button type="button" class="fase" class:attiva={config.fase === 3} disabled={maxFase < 3} onclick={() => goto('/equipment')}>
        <div class="fase-label">
          <span class="fase-num">Phase 3</span>
          <span class="fase-nome">Equipment</span>
        </div>
        {#if maxFase >= 3}
          <div class="fase-info">
            <div class="info-block">
              <span class="info-label">GEOMETRY</span>
              <span class="info-valore">L{config.lunghezza || '—'} R{config.raggio || '—'} W{config.larghezza || '—'}</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-block">
                <span class="info-label">MATERIAL</span>
                <span class="info-valore">{config.materiale ? config.materiale : '—'}</span>
              </div>
              <div class="info-block">
                <span class="info-label">WAX</span>
                <span class="info-valore">{config.cera ? config.cera : '—'}</span>
              </div>
            </div>
          </div>
        {/if}
      </button>

    {/if}
  </div>
  
  <!-- RETTANGOLO 8 -->
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
    
    transform: translateX(-100%);
    animation: slideRightBar 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  }

  @keyframes slideRightBar {
    to { transform: translateX(0); }
  }

  .barra.nascosta { display: none !important; }

  .barra.home {
    background: #BDF522; border-top: none; display: grid; grid-template-columns: 0.8fr 2fr 0.8fr;
  }

  /* --- RETTANGOLO 1 E 8 IDENTICI --- */
  .brand, .next {
    flex: 0 0 160px; /* Misura fissa identica per i lati */
    display: flex; align-items: center; justify-content: center; padding: 0 20px; /* Testo centrato per entrambi */
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; 
    border: none; background: transparent; color: black; white-space: nowrap; 
    cursor: pointer; transition: background 0.2s;
  }
  
  .brand {
    /* Rimosso justify-content: flex-start; per permettere l'allineamento centrale ereditato sopra */
    border-right: 1.5px solid black;
    opacity: 0; animation: slideRightBrand 0.6s ease 0.4s forwards;
  }
  
  .next {
    background: black; color: white; flex-shrink: 0; 
    border-left: 1.5px solid white; /* Linea verticale bianca che separa il rettangolo 7 dall'8 */
    opacity: 0; animation: fadeInText 0.6s ease 0.4s forwards;
  }

  @keyframes slideRightBrand {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeInText {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .brand:hover { background: rgba(0, 0, 0, 0.05); }
  .next:hover { background: #333; }

  /* --- ZONA CENTRALE: GRID MADRE A 3 COLONNE --- */
  .fasi { 
    flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); 
    overflow: hidden; opacity: 0; animation: fadeInText 0.6s ease 0.4s forwards;
  }

  /* --- LA FASE: GRID FIGLIA A 2 COLONNE IDENTICHE (Così creiamo i 6 rettangoli) --- */
  .fase {
    width: 100%; min-width: 0; 
    color: black; border: none; background: transparent; font-family: inherit; 
    text-align: left; cursor: pointer; padding: 0; border-right: 1.5px solid black;
    transition: background 0.2s, color 0.3s;
    /* Divide ESATTAMENTE a metà: Label e Info occupano lo stesso spazio */
    display: grid; grid-template-columns: 1fr 1fr;
  }

  .fase:last-child { border-right: none; }
  .fase:not(:disabled):not(.attiva):hover { background: #e8e8e8; }
  .fase:disabled { color: #777; cursor: default; pointer-events: none; }
  .fase.attiva { background: black; color: white; cursor: default;}

  /* --- RETTANGOLI PARI (2, 4, 6): LE LABEL --- */
  .fase-label { 
    display: flex; flex-direction: column; justify-content: space-between; 
    padding: 12px 16px; /* Padding interno, sostituisce il gap */
    min-width: 0; overflow: hidden;
  }
  
  .fase-num { font-size: 0.8rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; line-height: 1; opacity: 0.7; }
  .fase-nome { font-size: 1.05rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* --- RETTANGOLI DISPARI (3, 5, 7): I DATI --- */
  .fase-info {
    border-left: 1.5px solid currentColor; padding: 12px 16px; 
    display: flex; flex-direction: column; justify-content: space-between; 
    min-width: 0; overflow: hidden;
  }
  
  .info-row-bottom { display: flex; gap: 12px; min-width: 0; }
  .info-block { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; overflow: hidden; }
  
  .info-label { font-size: 0.55rem; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.5; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  
  .info-valore { 
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.02em; 
    text-transform: uppercase; line-height: 1; 
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; 
  }

  /* Regole Home */
  .barra.home .brand { flex: none; width: 100%; border-right: 1.5px solid black; }
  .barra.home .next { flex: none; width: 100%; padding: 0; border-left: 1.5px solid black; } /* Mantiene la linea nera sulla home */
</style>