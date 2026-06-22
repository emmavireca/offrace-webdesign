<script>
  import { Canvas } from '@threlte/core'
  import Scene from '$lib/components/Scene.svelte'
  import { config } from '$lib/config.svelte.js'

  config.fase = 3

  const materiali = [
    { id: 'wood',    label: 'Wood Core',    img: '/textures/WOOD.png' },
    { id: 'carbon',  label: 'Carbon Fiber', img: '/textures/CARBON F.png' },
    { id: 'titanal', label: 'Titanal',      img: '/textures/TITANAL.png' },
  ]

  let ceraIndex = $state(0)

  let waxLabel = $derived(
    ceraIndex < 0.66
      ? 'FLUORO FORMULA'
      : ceraIndex < 1.33
        ? (config.venue === 'bormio' ? 'GRAPHITE FORMULA' : 'SILICONE FORMULA')
        : 'PARAFFIN FORMULA'
  )

  let waxDesc = $derived(
    ceraIndex < 0.66
      ? 'Fluorocarbon wax is built on a carbon-fluorine molecular structure, one of the strongest chemical bonds in organic chemistry. PFAS molecules do not degrade, do not absorb water, and create a near-perfectly hydrophobic surface regardless of snow temperature or humidity. This chemical stability is what made fluorocarbon wax dominant across all conditions with no significant performance drop between extremes. It is also what makes PFAS compounds environmentally persistent and toxic when inhaled during application. Banned by FIS in 2022, its  friction coefficient remains the lowest ever recorded in competitive alpine skiing.'
      : ceraIndex < 1.33
        ? config.venue === 'bormio'
          ? 'High-purity paraffin with additives graphite. Graphite is a form of carbon with a layered molecular structure : the layers slide over each other with almost no resistance, which is why graphite is used as a dry lubricant in industrial applications. When incorporated into race wax, graphite particles embed in the base surface and reduce static friction at the ski-snow contact point. It is most effective on cold, dry snow where the water film is minimal and mechanical friction dominates. At temperatures close to 0°C, where the water film becomes abundant, graphite loses its advantage and silicone-based additives perform better.'
          : 'Silicone is a synthetic polymer built on a silicon-oxygen backbone rather than carbon, which gives it an unusually low surface energy, meaning liquids, including water, struggle to adhere to it. When incorporated into race wax as an additive, silicone molecules migrate to the outermost layer of the base surface and create a hydrophobic barrier that repels the water film forming at the ski-snow interface. It is most effective on wet, warm snow near 0°C, where the water film is thick and viscous drag dominates friction. On cold, dry snow, where the water film is minimal, silicone provides little advantage over standard paraffin.'
        : 'Paraffin is a saturated hydrocarbon derived from petroleum refining, the same base compound used in candles and industrial lubricants. In its wax form, it is applied to the ski base to create a thin protective layer between the polyethylene sole and the snow surface. Training-grade paraffin is unrefined and broadly formulated, designed for repeated application and removal during practice sessions rather than performance optimisation. It provides basic protection against base oxidation and drying, but offers no condition-specific advantage. Friction remains high compared to race-grade alternatives.'
  )

  let waxMu = $derived(
    ceraIndex < 0.66 ? 'μ=0.012' : ceraIndex < 1.33 ? 'μ=0.018' : 'μ=0.035'
  )

  $effect(() => {
    if (ceraIndex < 0.66) config.cera = 'fluoro'
    else if (ceraIndex < 1.33) config.cera = config.venue === 'bormio' ? 'graphite' : 'silicone'
    else config.cera = 'training'
  })

  // ── TOOLTIP: hover + click (fisso) ──
  let hover = $state(null)
  let fissi = $state({ length: false, width: false, radius: false })

  function toggleFisso(nome) {
    fissi[nome] = !fissi[nome]
  }
  function attivo(nome) {
    return hover === nome || fissi[nome]
  }

  const descrizioni = {
    length: 'Affects load distribution along the edge contact area. A longer ski increases stability at high speed and improves edge hold on hardpack, but reduces responsiveness.',
    width: 'Determines the contact area between base and snow. A narrower waist reduces lateral friction on icy snow. A wider waist increases the gliding surface.',
    radius: 'Determines the natural arc of the ski when tilted on edge. A shorter radius produces tighter turns, but reduces stability at high speed.'
  }

  const radMin = config.venue === 'bormio' ? 45 : 40
  const radMax = config.venue === 'bormio' ? 55 : 50

  let angolo = $derived(Math.PI - ((config.raggio - radMin) / (radMax - radMin)) * Math.PI)
  let handleX = $derived(100 + 90 * Math.cos(angolo))
  let handleY = $derived(100 - 90 * Math.sin(angolo))
  let dragging = $state(false)

  function onDrag(e) {
    if (!dragging) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const svgX = (e.clientX - rect.left) / rect.width * 200 - 100
    const svgY = (e.clientY - rect.top) / rect.height * 110 - 100
    let ang = Math.atan2(-svgY, svgX)
    if (ang < 0) ang = 0
    if (ang > Math.PI) ang = Math.PI
    config.raggio = Math.round(radMin + (1 - ang / Math.PI) * (radMax - radMin))
  }
</script>

<div class="viewport">
  <Canvas renderMode="always">
    <Scene />
  </Canvas>

  <div class="overlay">

    <div class="left">
      <h1>Equipment</h1>
      <p class="desc">Every race is decided before the start. The equipment an athlete carries onto the slope is the result of years of research.</p>

      <div class="sezione">
        <div class="sezione-header">GEOMETRY</div>
        <div class="sezione-body tre-col">

          <div class="col">
            <div class="col-header">
              <span class="col-title">LENGTH:</span>
              <span class="val-live">{config.lunghezza} CM</span>
            </div>
            <div class="range-labels">
              <span class="range-label">MIN {config.venue === 'bormio' ? '218' : '210'}</span>
              <span class="range-label">MAX {config.venue === 'bormio' ? '226' : '218'}</span>
            </div>
            <input type="range"
              min={config.venue === 'bormio' ? 218 : 210}
              max={config.venue === 'bormio' ? 226 : 218}
              step={1}
              bind:value={config.lunghezza}
              class="slider-h"
            />
          </div>

          <div class="col">
            <div class="col-header">
              <span class="col-title">WIDTH:</span>
              <span class="val-live">{config.larghezza} MM</span>
            </div>
            <div class="range-labels">
              <span class="range-label">MIN 63</span>
              <span class="range-label">MAX 68</span>
            </div>
            <input type="range"
              min={63} max={68} step={1}
              bind:value={config.larghezza}
              class="slider-h"
            />
          </div>

          <div class="col">
            <div class="col-header">
              <span class="col-title">RADIUS:</span>
              <span class="val-live">{config.raggio} M</span>
            </div>
            <div class="range-labels">
              <span class="range-label">MIN {config.venue === 'bormio' ? '45' : '40'}</span>
              <span class="range-label">MAX {config.venue === 'bormio' ? '55' : '50'}</span>
            </div>
            <svg viewBox="0 -5 200 100" class="radius-svg"
              onmousedown={() => { dragging = true }}
              onmousemove={onDrag}
              onmouseup={() => { dragging = false }}
            >
              <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#000" stroke-width="3.5"/>
              <circle cx={handleX} cy={handleY} r="12" fill="var(--mc-copper)" stroke="black" stroke-width="3" style="cursor:grab"/>
            </svg>
          </div>

        </div>
      </div>

      <div class="sezione">
        <div class="sezione-header">MATERIALS</div>
        <div class="sezione-body">
          <div class="materiali-grid">
            {#each materiali as mat}
              <button
                class="mat-card"
                class:selezionato={config.materiale === mat.id}
                onclick={() => config.materiale = mat.id}
              >
                <img src={mat.img} alt={mat.label} class="mat-img" />
              </button>
            {/each}
          </div>
          <p class="mat-label">{materiali.find(m => m.id === config.materiale)?.label}</p>
          <p class="mat-desc">
            {#if config.materiale === 'wood'}Wood core is the structural foundation of almost every race ski. Lightweight and naturally dampening, it absorbs vibration along the full length of the ski and defines its base flex profile. Accessible across all budget levels.
            {:else if config.materiale === 'carbon'}Carbon fiber is layered into specific zones of the ski to reduce mass and increase longitudinal stiffness. Lighter than titanal, with less dampening, optimised for power transfer rather than vibration absorption.
            {:else}Titanal is an aluminium alloy laminated into the ski's core structure. It increases torisional stiffness and dampens high frequency vibrations at speed, reducing energy loss on hard, uneven snow.{/if}
          </p>
        </div>
      </div>

      <div class="sezione">
        <div class="sezione-header">WAX PROTOCOL</div>
        <div class="sezione-body">
          <div class="wax-row">
            <p class="wax-label">{waxLabel}</p>
            <div class="wax-track-wrap">
              <input type="range" min={0} max={2} step={0.01}
                bind:value={ceraIndex}
                class="wax-input"
              />
              <div class="wax-track">
                {#each Array(10) as _, i}
                  <div class="wax-bacchetta" class:piena={i / 10 < (ceraIndex + 0.2) / 2}></div>
                {/each}
              </div>
            </div>
            <p class="wax-mu">{waxMu}</p>
          </div>
          <p class="wax-desc">{waxDesc}</p>
        </div>
      </div>

    </div>

    <div class="right-info">
      <p class="right-subtitle">Configure your ski system</p>

      <div class="sci-overlay">

        {#if attivo('length')}
          <div class="linea v-up" style="left: 52%; top: -15%; height: 105%;"></div>
          <div class="linea h-right" style="left: 52%; top: -15%; width: 18%;"></div>
        {/if}
        <button class="pallino" style="left: 52%; top: 90%"
          onmouseenter={() => hover = 'length'}
          onmouseleave={() => hover = null}
          onclick={() => toggleFisso('length')}
          class:attivo={attivo('length')}>
        </button>
        <div class="tooltip-box" class:visibile={attivo('length')} style="left: 66%; top: -25%">
          <p class="tooltip-title">LENGTH</p>
          <p class="tooltip-desc">{descrizioni.length}</p>
          <p class="tooltip-valore">{config.lunghezza} CM</p>
        </div>

        {#if attivo('width')}
          <div class="linea v-up" style="left: 20%; top: 88%; height: 62%;"></div>
        {/if}
        <button class="pallino" style="left: 20%; top: 150%"
          onmouseenter={() => hover = 'width'}
          onmouseleave={() => hover = null}
          onclick={() => toggleFisso('width')}
          class:attivo={attivo('width')}>
        </button>
       <div class="tooltip-box width-box" class:visibile={attivo('width')} style="left: 3.5%; top: 0%">
          <p class="tooltip-desc">{descrizioni.width}</p>
          <p class="tooltip-valore">{config.larghezza} MM</p>
        </div>

        {#if attivo('radius')}
          <div class="linea v-down" style="left: 28%; top: 200%; height: 33%;"></div>
          <div class="linea h-right" style="left: 28%; top: 232%; width: 22%;"></div>
        {/if}
        <button class="pallino" style="left: 28%; top: 200%"
          onmouseenter={() => hover = 'radius'}
          onmouseleave={() => hover = null}
          onclick={() => toggleFisso('radius')}
          class:attivo={attivo('radius')}>
        </button>
        <div class="tooltip-box" class:visibile={attivo('radius')} style="left: 50%; top: 222%">
          <p class="tooltip-title">RADIUS</p>
          <p class="tooltip-desc">{descrizioni.radius}</p>
          <p class="tooltip-valore">{config.raggio} M</p>
        </div>

      </div>
    </div>

  </div>
</div>

<style>
  .viewport {
    position: fixed;
    inset: 0;
    background: var(--mc-bg);
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-bottom: 64px;
  }

  .left {
    padding: 40px 40px 104px 40px; 
    display: flex;
    flex-direction: column;
    gap: 24px; 
    overflow-y: auto;
    border-right: 1.5px solid black; 
  }

  .desc {
    font-size: 0.8rem;
    line-height: 1.6;
    color: #444;
    margin-top: 0;
    margin-bottom: 8px;
  }

  .sezione { 
    border: 1.5px solid black; 
    margin-bottom: 0;
  }

  .sezione-header {
    background: black;
    color: white;
    padding: 8px 24px; 
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
  }

  .sezione-body { padding: 24px; } 

  .tre-col {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
    padding: 0;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 8px; 
    padding: 16px 12px;
    border-right: 1.5px solid black; 
  }

  .col:last-child { border-right: none; }

  .col-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    width: 100%;
  }

  .col-title {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin: 0;
  }

  .val-live {
    color: var(--mc-copper);
    font-size: 0.65rem;
    font-weight: 600;
    margin: 0;
  }

  .range-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 4px;
  }

  .range-label {
    font-size: 0.5rem;
    color: #666;
    letter-spacing: 0.05em;
    margin: 0;
  }

  .slider-h {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 14px;
    background: transparent;
    cursor: pointer;
    margin: 4px 0 0 0;
    padding: 0;
  }

  .slider-h::-webkit-slider-runnable-track {
    height: 2px;
    background: black;
    border-radius: 0;
  }

  .slider-h::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--mc-copper);
    cursor: grab;
    outline: 1.5px solid black; 
    margin-top: -6px;
  }

  .radius-svg {
    width: 100%;
    height: 60px;
    margin-top: 4px;
  }

  .materiali-grid {
    display: flex;
    flex-direction: row;
    gap: 12px; 
    margin-top: 0;
    margin-bottom: 16px;
  }

  .mat-card {
    border: 1.5px solid transparent; 
    background: none;
    cursor: pointer;
    padding: 0;
    width: 175px;
    height: 64px;
    overflow: hidden;
    flex-shrink: 0;
    margin: 0;
  }

  .mat-card.selezionato { border-color: var(--mc-copper); }

  .mat-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mat-label {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 8px;
  }

  .mat-desc {
    font-size: 0.75rem;
    line-height: 1.5;
    color: #444;
    margin: 0;
  }

  .wax-row {
    display: flex;
    align-items: flex-end;
    gap: 0;
    margin: 0;
  }

  .wax-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    white-space: nowrap;
    width: 140px;
    flex-shrink: 0;
    margin: 0;
  }

  .wax-label::after {
    content: '';
    display: block;
    height: 5px;
    width: 155px;
    background: black;
    transform: skewX(-12deg);
    transform-origin: left;
    margin-top: 4px;
  }

  .wax-track-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: fit-content;
    margin-left: 16px; 
  }

  .wax-input {
    width: 120px;
    -webkit-appearance: none;
    appearance: none;
    height: 2px;
    background: transparent;
    cursor: pointer;
    margin: 0;
  }

  .wax-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 12px;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 12'><polygon points='7,11 1,1 13,1' fill='%23BDF522' stroke='black' stroke-width='1.5' stroke-linejoin='round'/></svg>") no-repeat center;
    border: none;
    cursor: pointer;
  }

  .wax-track {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 28px;
    pointer-events: none;
    width: 120px;
    margin: 0;
  }

  .wax-bacchetta {
    width: 5px;
    height: 16px;
    background: #ccc;
    transform: skewX(-12deg);
    flex: none;
  }

  .wax-bacchetta.piena { background: black; }

  .wax-mu {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    white-space: nowrap;
    margin-left: 16px; 
    padding-bottom: 4px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .wax-desc {
    font-size: 0.75rem;
    line-height: 1.5;
    color: #444;
    margin-top: 16px; 
    border-left: 1.5px solid black; 
    padding-left: 16px; 
    margin-bottom: 0;
  }

  /* ── DESTRA ── */
  .right-info {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40px; 
    gap: 24px; 
  }

  .right-subtitle {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin: 0;
  }

  .sci-overlay {
    position: relative;
    width: 100%;
    height: 200px;
    margin: 0;
  }

  /* PALLINI */
  .pallino {
    position: absolute;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: #BDF522;
    border: 1.5px solid black; 
    animation: pulse 2s ease-out infinite;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    transition: background 0.2s, transform 0.2s;
    z-index: 10;
    margin: 0;
    padding: 0;
  }

  .pallino:hover, .pallino.attivo {
    background: black;
    color: #BDF522;
    transform: translate(-50%, -50%) scale(1.15);
  }

  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(189, 245, 34, 0.6); }
    70%  { box-shadow: 0 0 0 12px rgba(189, 245, 34, 0); }
    100% { box-shadow: 0 0 0 0 rgba(189, 245, 34, 0); }
  }

  /* ── LINEE CONNETTRICI ── */
  .linea {
    position: absolute;
    background: black;
    z-index: 5;
  }

  .linea.v-up {
    width: 1.5px; 
    transform: translateX(-50%) scaleY(0);
    transform-origin: bottom;
    animation: growV 0.7s ease forwards;
  }

  .linea.v-down {
    width: 1.5px; 
    transform: translateX(-50%) scaleY(0);
    transform-origin: top;
    animation: growV 0.7s ease forwards;
  }

  .linea.h-right {
    height: 1.5px; 
    transform: scaleX(0);
    transform-origin: left;
    animation: growH 0.7s ease 0.7s forwards;
  }

  @keyframes growV {
    to { transform: translateX(-50%) scaleY(1); }
  }
  @keyframes growH {
    to { transform: scaleX(1); }
  }

  /* ── BOX ── */
  .tooltip-box {
    position: absolute;
    background: white;
    border: 1.5px solid black; 
    padding: 16px; 
    width: 220px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s;
    z-index: 20;
    margin: 0;
  }

  .tooltip-box.visibile {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 1.4s;
  }

  .tooltip-box.width-box.visibile {
    transition-delay: 0.7s;
  }

  .tooltip-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    margin-top: 0;
    margin-bottom: 8px; 
  }

  .tooltip-desc {
    font-size: 0.75rem;
    line-height: 1.6;
    margin: 0;
  }

  .tooltip-valore {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--mc-copper);
    margin-top: 8px; 
    margin-bottom: 0;
  }
</style>