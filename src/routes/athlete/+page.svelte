<script>
  import { goto } from '$app/navigation'
  import { config } from '$lib/config.svelte.js'
  import AtletaViewer from '$lib/components/AtletaViewer.svelte'
  import { slide } from 'svelte/transition'

  config.fase = 2
  const massaMin = config.venue === 'bormio' ? 85 : 65
  const massaMax = config.venue === 'bormio' ? 100 : 75
  const rfdMin = config.venue === 'bormio' ? 3000 : 2800
  const rfdMax = config.venue === 'bormio' ? 6000 : 5000  
  
  let rfdRotation = $derived(((config.rfd - rfdMin) / (rfdMax - rfdMin)) * 180 - 90)
  let rfdDragging = $state(false)

  function onRdfPointerDown(e) {
    rfdDragging = true
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onRdfPointerMove(e) {
    if (!rfdDragging) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const svgX = (e.clientX - rect.left) / rect.width * 200
    const svgY = (e.clientY - rect.top) / rect.height * 110
    const dx = svgX - 100
    const dy = 100 - svgY
    let ang = Math.atan2(dy, dx)
    if (ang < 0) ang = 0
    if (ang > Math.PI) ang = Math.PI
    config.rfd = Math.round(rfdMin + (1 - ang / Math.PI) * (rfdMax - rfdMin))
  }

  function onRdfPointerUp() { rfdDragging = false }
  
  const modello = config.venue === 'bormio' ? '/models/atleta_m.glb' : '/models/atleta_f.glb'

  const tute = config.venue === 'bormio' 
    ? [null, '/tute/uomo_pink.svg', '/tute/uomo_viola.svg', '/tute/uomo_giallo.svg']
    : [null, '/tute/donna_pink.svg', '/tute/donna_viola.svg', '/tute/donna_giallo.svg']

  let direzione = $state('destra')
  let tutaIndex = $state(0)
  let tutaPrecedente = $state(null)
  let staEscendo = $state(false)

  function avanti() { 
    if (tutaIndex < tute.length - 1) {
      direzione = 'destra'
      tutaPrecedente = tute[tutaIndex]
      staEscendo = true
      setTimeout(() => { staEscendo = false }, 800)
      tutaIndex++
      config.tutaIndex = tutaIndex
    }
  }

  function indietro() { 
    if (tutaIndex > 0) {
      direzione = 'sinistra'
      tutaPrecedente = tute[tutaIndex]
      staEscendo = true
      setTimeout(() => { staEscendo = false }, 800)
      tutaIndex--
      config.tutaIndex = tutaIndex
    }
  }

  const descrizioni = [
    '',
    'La tuta standard è completamente legale e rispetta tutti i parametri FIS. Nessun vantaggio aerodinamico oltre la norma.',
    'Questa tuta si avvicina ai limiti regolamentari. Tecnicamente legale, ma offre un vantaggio aerodinamico significativo.',
    'Questa tuta supera i limiti FIS. Classificata come techno-doping — vantaggio sleale e non ammesso in gara.'
  ]

  // Gestione stato Accordion
  let accordionOpen = $state('mass')
</script>

<div class="page">
  <main class="content">
    
    <div class="left">
      <div class="left-intro">
        <h1>Athlete</h1>
        <p class="desc">The athlete is not a fixed variable. Body composition, neuromuscular capacity, and technical precision are not equal across competitors — and none of them are regulated. While equipment is subject to FIS specifications and wax protocols are enforced at the gate, the physical profile of the athlete remains entirely outside the compliance system.</p>
      </div>

      <div class="accordion-group">
        
        <div class="sezione">
          <button class="sezione-header" onclick={() => accordionOpen = 'mass'}>
            <span>BODY MASS</span>
            <span class="accordion-icon">{accordionOpen === 'mass' ? '−' : '+'}</span>
          </button>
          
          {#if accordionOpen === 'mass'}
            <div class="sezione-body" transition:slide>
              <div class="mass-row">
                <div class="mass-control">
                  <button class="mass-btn" onclick={() => { if (config.massa > massaMin) config.massa-- }}>−</button>
                  <span class="mass-value">{config.massa} <span class="mass-unit">kg</span></span>
                  <button class="mass-btn" onclick={() => { if (config.massa < massaMax) config.massa++ }}>+</button>
                </div>
              </div>
              <p class="pannello-desc">Body mass determines the amount of potential energy an athlete carries into the descent. A higher mass accelerates faster on straight sections where gravitational pull dominates, but increases joint load in technical sections and reduces responsiveness in direction changes.</p>
            </div>
          {/if}
        </div>

        <div class="sezione">
          <button class="sezione-header" onclick={() => accordionOpen = 'trajectory'}>
            <span>TRAJECTORY DEVIATION</span>
            <span class="accordion-icon">{accordionOpen === 'trajectory' ? '−' : '+'}</span>
          </button>
          
          {#if accordionOpen === 'trajectory'}
            <div class="sezione-body" transition:slide>
              <div class="ruler-wrap">
                <div class="ruler-header">
                   <span class="val-live">{config.deviazione} CM</span>
                </div>
                <div class="ruler-labels">
                  <span style="left: 0%">0</span>
                  <span style="left: 12.5%">5cm</span>
                  <span style="left: 25%">10cm</span>
                  <span style="left: 50%">20cm</span>
                  <span style="left: 100%">40cm</span>
                </div>
                <div class="ruler-container">
                  <input type="range" min="5" max="40" step="1" bind:value={config.deviazione} class="ruler-input" />
                  <svg class="ruler-svg" viewBox="0 0 400 24" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="1" x2="400" y2="1" stroke="black" stroke-width="1.5"/>
                    {#each Array(41) as _, i}
                      <line
                        x1={i * 10} y1="1"
                        x2={i * 10} y2={[0,5,10,20,40].includes(i) ? 18 : (i % 5 === 0 ? 12 : 7)}
                        stroke="black"
                        stroke-width={[0,5,10,20,40].includes(i) ? 1.5 : 1}
                      />
                    {/each}
                    <g transform="translate({config.deviazione * 10}, 0)">
                      <polygon
                        class="ruler-thumb"
                        points="0,1 -7,14 7,14"
                        stroke-width="1.5"
                        stroke-linejoin="round"
                      />
                    </g>
                  </svg>
                </div>
              </div>
              <p class="pannello-desc">Trajectory deviation measures the average distance between the athlete's actual line and the optimal racing trajectory across a full descent. A deviation of 10–15 cm at high speed does not stay isolated: it alters the entry angle into the next gate, forces a micro-correction, and compounds across every subsequent section. It is the single strongest predictor of final race time — and the primary driver of DNF risk when combined with high force output.</p>
            </div>
          {/if}
        </div>

        <div class="sezione">
          <button class="sezione-header" onclick={() => accordionOpen = 'rdf'}>
            <span>RDF — RATE OF FORCE DEVELOPMENT</span>
            <span class="accordion-icon">{accordionOpen === 'rdf' ? '−' : '+'}</span>
          </button>
          
          {#if accordionOpen === 'rdf'}
            <div class="sezione-body rdf-layout" transition:slide>
              <div class="rdf-gauge-box">
                <p class="rdf-value">{config.rfd} <span class="rdf-unit">N/s</span></p>
                <svg viewBox="0 0 200 110" class="rdf-svg"
                  onpointerdown={onRdfPointerDown}
                  onpointermove={onRdfPointerMove}
                  onpointerup={onRdfPointerUp}
                  onpointerleave={onRdfPointerUp}
                >
                  <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="black" stroke-width="2.5"/>
                  {#each Array(10) as _, i}
                    {@const a = (Math.PI * i) / 9}
                    {@const isMajor = i % 3 === 0}
                    {@const x1 = 100 - 90 * Math.cos(a)}
                    {@const y1 = 100 - 90 * Math.sin(a)}
                    {@const x2 = 100 - (isMajor ? 74 : 81) * Math.cos(a)}
                    {@const y2 = 100 - (isMajor ? 74 : 81) * Math.sin(a)}
                    <line {x1} {y1} {x2} {y2} stroke="black" stroke-width={isMajor ? 2 : 1}/>
                  {/each}
                  <g transform="rotate({rfdRotation}, 100, 100)">
                    <polygon
                      class="rdf-thumb"
                      points="100,25 92,100 108,100"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p class="pannello-desc">RDF — Rate of Force Development — measures how quickly the athlete can generate and apply muscular force, expressed in Newtons per second. It is not the same as maximum strength: two athletes can have identical peak force but entirely different RFD values, meaning one reaches that peak in 150 milliseconds and the other in 300. In alpine skiing, those 150 milliseconds are the difference between a clean edge engagement and a lost gate.</p>
            </div>
          {/if}
        </div>

      </div>

    </div>

    <div class="right">
      <div class="dx-header">CONFIGURE YOUR ATHLETE</div>
      <div class="viewer-container">
        <AtletaViewer {modello} rfd={config.rfd} deviazione={config.deviazione}/>
        {#if staEscendo && tutaPrecedente}
          <img class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} esce-{direzione}" src={tutaPrecedente} alt="" />
        {/if}
        {#key tutaIndex}
          {#if tute[tutaIndex]}
            <img class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} animazione-{direzione}" src={tute[tutaIndex]} alt="" />
          {/if}
        {/key}
      </div>
    </div>

  </main>
</div>

<style>
  .page {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    background: var(--mc-bg);
  }

  .content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  .left {
    padding: 40px 40px 104px 40px; 
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    border-right: 1.5px solid black;
    background: var(--mc-bg);
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    line-height: 1;
    margin: 0 0 24px 0;
    letter-spacing: -0.03em;
  }

  .desc {
    font-size: 0.78rem;
    line-height: 1.6;
    color: #444;
    max-width: 54ch;
    margin: 0;
  }

  /* ACCORDION GROUP CONTENITORE */
  .accordion-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ACCORDION STYLES (Copiati fedelmente da Equipment) */
  .sezione { 
    border: 1.5px solid black; 
    margin-bottom: 0;
    background: var(--mc-bg);
  }

  .sezione-header {
    background: black;
    color: white;
    padding: 8px 24px; /* Esatto valore del modello */
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
  }

  .sezione-header:hover {
    background: #1a1a1a; /* Esatto valore del modello */
  }

  .accordion-icon {
    color: #BDF522; 
    font-size: 1.2rem;
    font-weight: 400; /* Esatto valore del modello */
    line-height: 1;   /* Esatto valore del modello */
  }

  .sezione-body { 
    padding: 24px; 
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pannello-desc {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    line-height: 1.7;
    color: #444;
    margin: 0;
  }

  /* CONTROLLI SPECIFICI */
  .mass-row {
    display: flex;
    align-items: center;
  }

  .mass-control {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .mass-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1.5px solid black;
    background: #BDF522;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    padding: 0;
  }

  .mass-btn:hover {
    background: black;
    color: #BDF522;
    transform: scale(1.1);
  }

  .mass-value {
    font-family: 'Geist Mono', monospace;
    font-size: 24px;
    font-weight: 500;
  }

  .mass-unit {
    font-size: 12px;
    font-weight: 400;
    color: #666;
  }

  .val-live {
    font-family: 'Geist Mono', monospace;
    font-size: 18px;
    color: var(--mc-copper, #cc5500);
    font-weight: 600;
  }

  .ruler-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ruler-header {
    display: flex;
    justify-content: flex-end;
  }

  .ruler-labels {
    position: relative;
    height: 14px;
    width: 100%;
  }

  .ruler-labels span {
    position: absolute;
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    transform: translateX(-50%);
    white-space: nowrap;
  }

  .ruler-labels span:first-child { transform: translateX(0); }
  .ruler-labels span:last-child { transform: translateX(-100%); }

  .ruler-container {
    position: relative;
    height: 24px;
    width: 100%;
  }

  .ruler-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
    margin: 0;
    inset: 0;
  }

  .ruler-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    display: block;
  }

  .ruler-thumb {
    fill: #BDF522;
    stroke: black;
    transition: fill 0.2s, stroke 0.2s, transform 0.2s;
    transform-origin: 0px 7.5px;
  }

  .ruler-input:hover + .ruler-svg .ruler-thumb,
  .ruler-input:active + .ruler-svg .ruler-thumb {
    fill: black;
    stroke: #BDF522;
    transform: scale(1.3);
  }

  .rdf-layout {
    flex-direction: row;
    align-items: center;
    gap: 40px;
  }

  .rdf-gauge-box {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .rdf-svg {
    width: 160px;
    height: 90px;
    cursor: pointer;
  }

  .rdf-thumb {
    fill: var(--mc-copper, #cc5500);
    stroke: black;
    transform-origin: 100px 100px;
    transition: fill 0.2s, stroke 0.2s, transform 0.2s;
  }

  .rdf-svg:hover .rdf-thumb,
  .rdf-svg:active .rdf-thumb {
    fill: black;
    stroke: var(--mc-copper, #cc5500);
    transform: scale(1.15);
  }

  .rdf-value {
    font-family: 'Geist Mono', monospace;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    margin: 0;
  }

  .rdf-unit {
    font-size: 12px;
    font-weight: 400;
    color: #666;
  }

  /* COLONNA DESTRA */
  .right {
    display: flex;
    flex-direction: column;
  }

  .dx-header {
    padding: 24px 40px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    border-bottom: 1.5px solid black;
    margin: 0;
    text-transform: uppercase;
  }

  .viewer-container {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tuta {
    position: absolute;
    pointer-events: none;
    top: 50%;
    left: 50%;
  }

  .tuta-donna {
    width: 76%;
    height: auto;
    transform: translate(-50%, -47.8%);
  }

  .tuta-uomo {
    width: 67.5%;
    height: auto;
    transform: translate(-50%, -49%);
  }

  /* ANIMAZIONI TUTE */
  @keyframes da-destra {
    from { transform: translate(150%, -47.8%); opacity: 0; }
    to   { transform: translate(-50%, -47.8%); opacity: 1; }
  }

  @keyframes da-sinistra {
    from { transform: translate(-150%, -47.8%); opacity: 0; }
    to   { transform: translate(-50%, -47.8%); opacity: 1; }
  }

  @keyframes vai-sinistra {
    from { transform: translate(-50%, -47.8%); opacity: 1; }
    60%  { transform: translate(-110%, -47.8%); opacity: 0; }
    to   { transform: translate(-150%, -47.8%); opacity: 0; }
  }

  @keyframes vai-destra {
    from { transform: translate(-50%, -47.8%); opacity: 1; }
    60%  { transform: translate(70%, -47.8%); opacity: 0; }
    to   { transform: translate(150%, -47.8%); opacity: 0; }
  }

  .animazione-destra   { animation: da-destra    0.8s ease-out forwards; }
  .animazione-sinistra { animation: da-sinistra  0.8s ease-out forwards; }
  .esce-destra         { animation: vai-sinistra 0.8s ease-in  forwards; }
  .esce-sinistra       { animation: vai-destra   0.8s ease-in  forwards; }
</style>