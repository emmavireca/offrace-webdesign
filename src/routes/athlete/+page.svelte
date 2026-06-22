<script>
  import { goto } from '$app/navigation'
  import { config } from '$lib/config.svelte.js'
  import AtletaViewer from '$lib/components/AtletaViewer.svelte'

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
</script>

<div class="page">
  <main class="content">
    
    <div class="left">
      <div class="left-intro">
        <h1>Athlete</h1>
        <p class="desc">The athlete is not a fixed variable. Body composition, neuromuscular capacity, and technical precision are not equal across competitors — and none of them are regulated. While equipment is subject to FIS specifications and wax protocols are enforced at the gate, the physical profile of the athlete remains entirely outside the compliance system.</p>
      </div>

      <div class="pannelli">
        <div class="pannelli-row">
          <div class="pannello pannello-small">
            <div class="pannello-header">BODY MASS</div>
            <div class="pannello-body">
              <div class="mass-control">
                <button class="mass-btn" onclick={() => { if (config.massa > massaMin) config.massa-- }}>−</button>
                <span class="mass-value">{config.massa} <span class="mass-unit">kg</span></span>
                <button class="mass-btn" onclick={() => { if (config.massa < massaMax) config.massa++ }}>+</button>
              </div>
              <p class="pannello-desc">Body mass determines the amount of potential energy an athlete carries into the descent. A higher mass accelerates faster on straight sections where gravitational pull dominates, but increases joint load in technical sections and reduces responsiveness in direction changes.</p>
            </div>
          </div>

          <div class="pannello pannello-large">
            <div class="pannello-header">TRAJECTORY DEVIATION</div>
            <div class="pannello-body">
              <div class="ruler-wrap">
                <div class="ruler-labels">
                  <span style="left: 0%">0</span>
                  <span style="left: 12.5%">5cm</span>
                  <span style="left: 25%">10cm</span>
                  <span style="left: 50%">20cm</span>
                  <span style="left: 100%">40cm</span>
                </div>
                <div class="ruler-container">
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
                    <polygon
                      points="{config.deviazione * 10},1 {config.deviazione * 10 - 7},14 {config.deviazione * 10 + 7},14"
                      fill="#BDF522"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <input type="range" min="5" max="40" step="1" bind:value={config.deviazione} class="ruler-input" />
                </div>
              </div>
              <p class="pannello-desc">Trajectory deviation measures the average distance between the athlete's actual line and the optimal racing trajectory across a full descent. A deviation of 10–15 cm at high speed does not stay isolated: it alters the entry angle into the next gate, forces a micro-correction, and compounds across every subsequent section. It is the single strongest predictor of final race time — and the primary driver of DNF risk when combined with high force output.</p>
            </div>
          </div>
        </div>

        <div class="pannello">
          <div class="pannello-header">RDF — RATE OF FORCE DEVELOPMENT</div>
          <div class="pannello-body rdf-body">
            <div class="rdf-gauge">
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
                <polygon
                  points="100,25 92,100 108,100"
                  fill="var(--mc-copper)"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                  transform="rotate({rfdRotation}, 100, 100)"
                />
              </svg>
            </div>
            <p class="pannello-desc">RDF — Rate of Force Development — measures how quickly the athlete can generate and apply muscular force, expressed in Newtons per second. It is not the same as maximum strength: two athletes can have identical peak force but entirely different RFD values, meaning one reaches that peak in 150 milliseconds and the other in 300. In alpine skiing, those 150 milliseconds are the difference between a clean edge engagement and a lost gate.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="right">
      <p class="right-label">CONFIGURE YOUR ATHLETE</p>
      <AtletaViewer {modello} />
      {#if staEscendo && tutaPrecedente}
        <img class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} esce-{direzione}" src={tutaPrecedente} alt="tuta precedente" />
      {/if}
      {#key tutaIndex}
        {#if tute[tutaIndex]}
          <img class="tuta {config.venue === 'bormio' ? 'tuta-uomo' : 'tuta-donna'} animazione-{direzione}" src={tute[tutaIndex]} alt="tuta" />
        {/if}
      {/key}
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  .left {
    padding: 40px 40px 104px 40px; /* Uniformato a 40px. Il bottom è calcolato (40px + 64px di footer) per non far coprire l'ultimo pannello dallo scroll */
    display: flex;
    flex-direction: column;
    gap: 24px; /* Mantenuto originale */
    overflow-y: auto;
    min-height: 0;
  }

  .left-intro {
    display: flex;
    flex-direction: column;
    gap: 16px; /* Mantenuto originale */
  }

  .desc {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    line-height: 1.7;
  }

  .pannelli {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1.5px solid black;
    margin-bottom: 0; /* Rimosso perché gestito dal padding-bottom di .left per uno scroll pulito */
  }

  .pannelli-row {
    display: grid;
    grid-template-columns: 1fr 2fr;
    border-bottom: 1.5px solid black;
  }

  .pannello {
    display: flex;
    flex-direction: column;
  }

  .pannello-small {
    border-right: 1.5px solid black;
  }

  .pannello-header {
    background: black;
    color: white;
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    padding: 8px 24px; /* Mantenuto originale */
  }

  .pannello-body {
    padding: 24px; /* Mantenuto originale */
    display: flex;
    flex-direction: column;
    gap: 16px; /* Mantenuto originale */
  }

  .pannello-desc {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    line-height: 1.7;
    margin: 0;
  }

  .mass-control {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px; /* Mantenuto originale */
  }

  .mass-btn {
    width: 32px;
    height: 32px;
    border: 1.5px solid black;
    background: transparent;
    font-size: 18px;
    cursor: pointer;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mass-btn:hover {
    background: black;
    color: white;
  }

  .mass-value {
    font-family: 'Geist Mono', monospace;
    font-size: 20px;
    font-weight: 500;
  }

  .mass-unit {
    font-size: 12px;
    font-weight: 400;
    color: #666;
  }

  .ruler-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px; /* Arrotondato a multiplo */
    width: 100%;
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
    width: 100%;
  }

  .ruler-svg {
    width: 100%;
    height: 20px;
    display: block;
    overflow: visible;
  }

  .ruler-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    margin: 0;
  }

  .rdf-body {
    display: flex;
    flex-direction: row;
    align-items: center; /* Centrato verticalmente l'allineamento con il testo */
    gap: 40px; /* Uniformato alla colonna */
    padding: 24px; /* Mantenuto originale */
  }

  .rdf-gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px; /* Arrotondato a multiplo */
    flex-shrink: 0;
  }

  .rdf-svg {
    width: 160px;
    height: 90px;
    cursor: crosshair;
    user-select: none;
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

  .right {
    position: relative;
    border-left: 1.5px solid black;
  }

  .right-label {
    position: absolute;
    top: 40px; /* Allineato verticalmente al padding di .left (40px) */
    left: 40px; /* Allineato orizzontalmente al padding di .left (40px) */
    font-family: 'Geist', sans-serif;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    z-index: 10;
    margin: 0;
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
  .esce-destra         { animation: vai-sinistra  0.8s ease-in  forwards; }
  .esce-sinistra       { animation: vai-destra    0.8s ease-in  forwards; }
</style>