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
              <span class="info-label">TRAJECTORY DEV & RFD</span>
              <span class="info-valore">DEV {config.deviazione || '—'}CM &nbsp; RFD {config.rfd || '—'}N/S</span>
            </div>
            <div class="info-row-bottom">
              <div class="info-block">
                <span class="info-label">MASS</span>
                <span class="info-valore">{config.massa || '—'} KG</span>
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
  
  <button type="button" class="next" class:is-home={isHome} onclick={() => {
      if (isHome) goto('/environment')
      else {
        if (config.fase === 4) goto('/')
        else {
          const rotte = ['/environment', '/athlete', '/equipment', '/result'];
          goto(rotte[config.fase] || '/result');
        }
      }
    }}>
   {isHome ? 'START SIMULATION' : config.fase === 4 ? 'TRY AGAIN →' : 'NEXT PHASE →'}
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

  /* ── LAYOUT IN HOME PAGE ── */
  .barra.home {
    background: var(--mc-bg, #fff); 
    border-top: 1.5px solid black; 
    display: grid; 
    grid-template-columns: 0.8fr 2fr 0.8fr; 
  }

  .barra.home .fasi {
    grid-column: 2 / 3; 
    display: block;
    border: none;
  }

  /* --- RETTANGOLO 1 E 8 --- */
  .brand, .next {
    flex: 0 0 160px; 
    display: flex; align-items: center; justify-content: center; padding: 0 20px; 
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; 
    border: none; background: transparent; color: black; white-space: nowrap; 
    cursor: pointer; transition: background 0.2s, color 0.2s;
  }
  
  .brand {
    border-right: 1.5px solid black;
    opacity: 0; animation: slideRightBrand 0.6s ease 0.4s forwards;
  }
  
  .next {
    background: black; color: white; flex-shrink: 0; 
    border-left: 1.5px solid white; 
    opacity: 0; animation: fadeInText 0.6s ease 0.4s forwards;
  }

  /* ── MODIFICHE PULSANTE "START SIMULATION" IN HOME ── */
  .barra.home .brand {
    grid-column: 1 / 2;
    width: 100%;
    flex: none;
  }

  .next.is-home {
    grid-column: 3 / 4; 
    width: 100%;
    flex: none;
    background: #BDF522; 
    color: black;        
    font-weight: 800;
    border-left: 1.5px solid black; 
    border-top: none;
    border-bottom: none;
    border-right: none;
    border-radius: 0;
    outline: none;
    margin: 0;
    padding: 0;
  }

  .brand:hover { background: rgba(0, 0, 0, 0.05); }
  .next:hover { background: #333; }
  .next.is-home:hover { background: black; color: #BDF522; } 

  @keyframes slideRightBrand {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeInText {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* --- ZONA CENTRALE: GRID MADRE A 3 COLONNE (Layout non-home) --- */
  .fasi { 
    flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); 
    overflow: hidden; opacity: 0; animation: fadeInText 0.6s ease 0.4s forwards;
  }

  /* --- LA FASE: GRID FIGLIA A 2 COLONNE IDENTICHE --- */
  .fase {
    width: 100%; min-width: 0; 
    color: black; border: none; background: transparent; font-family: inherit; 
    text-align: left; cursor: pointer; padding: 0; border-right: 1.5px solid black;
    transition: background 0.2s, color 0.3s;
    display: grid; grid-template-columns: 1fr 1fr;
  }

  .fase:last-child { border-right: none; }
  .fase:not(:disabled):not(.attiva):hover { background: #e8e8e8; }
  .fase-info { border-left: 1.5px solid currentColor; }
  .fase:disabled { color: #777; cursor: default; pointer-events: none; }
  .fase.attiva { background: black; color: white; cursor: default;}

  /* --- ALLINEAMENTO SUPERIORE CORRETTO E PUSH IN BASSO --- */
  .fase-label, .fase-info { 
    display: flex; 
    flex-direction: column; 
    justify-content: flex-start; 
    gap: 6px;                    
    padding: 12px 16px;          
    min-width: 0; 
    overflow: hidden;
  }

  .fase-num { font-size: 0.8rem; font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase; line-height: 1; opacity: 0.7; }
  
  .fase-nome { 
    font-size: 1.05rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1; 
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
    
    /* MODIFICA: spinge la scritta in basso allineando il lato superiore con le label di destra (TYPE, MASS) */
    margin-top: auto; 
    margin-bottom: 6px; 
  }

  .info-row-bottom { display: flex; gap: 12px; min-width: 0; margin-top: auto; } 
  .info-block { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; overflow: hidden; }
  
  .info-label { font-size: 0.55rem; font-weight: 400; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.5; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  
  .info-valore { 
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.02em; 
    text-transform: uppercase; line-height: 1; 
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; 
  }
  .barra.nascosta {
    display: none !important;
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

/* ── FOOTER & LAYOUT RESPONSIVE PER MOBILE ── */
@media (max-width: 768px) {
  
  /* Se la barra è nascosta durante l'intro, spariamo tutto */
  .barra.nascosta, 
  .barra.nascosta .brand, 
  .barra.nascosta .next { 
    display: none !important; 
  }

  /* 1. Contenitore neutro */
  .barra {
    position: static;
    height: auto;
    border-top: none;
    display: block;
    transform: none;
    animation: none;
  }

  /* 2. RETTANGOLO 1 (OFFRACE): Allineato a sinistra e fisso in alto */
  .brand {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 64px;
    width: 100% !important;
    max-width: 100%;
    flex: none;
    background: #BDF522 !important;
    color: black !important;
    border: none;
    border-bottom: 1.5px solid black !important;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    z-index: 110;
    animation: none;
    opacity: 1;
    
    /* MODIFICA: Allineamento a sinistra con spazio dal bordo */
    display: flex;
    align-items: center;
    justify-content: flex-start !important; 
    padding-left: 24px !important; 
  }

  /* 3. Nascondiamo le fasi centrali */
  .fasi {
    display: none !important;
  }

  /* 4. RETTANGOLO 8 (NEXT / START): Fisso in basso */
  .next {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 64px;
    width: 100% !important;
    max-width: 100%;
    flex: none;
    background: black !important;
    color: #BDF522 !important;
    border: none;
    border-top: 1.5px solid black;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    z-index: 110;
    animation: none;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Configurazione specifica Home */
  .barra.home {
    display: block !important;
    background: transparent;
  }
  
  .barra.home .brand {
    background: #BDF522 !important;
    border-bottom: 1.5px solid black !important;
  }

  .barra.home .next {
    background: black !important;
    color: #BDF522 !important;
    border-top: 1.5px solid black !important;
  }

  /* 5. Sicurezza scroll spazi grafici */
  :global(body) {
    padding-top: 64px !important;    
    padding-bottom: 64px !important; 
  }
}
</style>