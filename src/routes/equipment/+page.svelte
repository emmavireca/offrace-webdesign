<script>
  import { Canvas } from '@threlte/core'
  import Scene from '$lib/components/Scene.svelte'
  import { config } from '$lib/config.svelte.js'
  import { goto } from '$app/navigation' 
  import { slide } from 'svelte/transition'
  import { onMount } from 'svelte'

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
      ? 'Fluorocarbon wax is built on a carbon-fluorine molecular structure, one of the strongest chemical bonds in organic chemistry. PFAS molecules do not degrade, do not absorb water, and create a near-perfectly hydrophobic surface regardless of snow temperature or humidity. This chemical stability is what made fluorocarbon wax dominant across all conditions with no significant performance drop between extremes. It is also what makes PFAS compounds environmentally persistent and toxic when inhaled during application. Banned by FIS in 2022, its friction coefficient remains the lowest ever recorded in competitive alpine skiing.'
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

  let hover = $state(null)
  let fissi = $state({ length: false, width: false, radius: false })

  function toggleFisso(nome) {
    fissi[nome] = !fissi[nome]
  }
  function attivo(nome) {
    return hover === nome || fissi[nome]
  }

  function startZoom(key) { config.zoomTarget = key }

  onMount(() => {
    const rilascia = () => { config.zoomTarget = null }
    window.addEventListener('pointerup', rilascia)
    return () => window.removeEventListener('pointerup', rilascia)
  })

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

  let accordionOpen = $state('geometry')
</script>

<div class="viewport">
  <Canvas renderMode="always">
    <Scene />
  </Canvas>

  <div class="overlay">
    <div class="left">
      <div class="left-intro">
        <h1>Equipment</h1>
        <p class="desc">Every race is decided before the start. The equipment an athlete carries onto the slope is the result of years of research.</p>
      </div>

      <div class="accordion-group">
        <div class="sezione">
          <button class="sezione-header" onclick={() => accordionOpen = 'geometry'}>
            <span>GEOMETRY</span>
            <span class="accordion-icon">{accordionOpen === 'geometry' ? '−' : '+'}</span>
          </button>
          
          {#if accordionOpen === 'geometry'}
            <div class="sezione-body tre-col" transition:slide>
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
                  onpointerdown={() => startZoom('length')}
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
                  onpointerdown={() => startZoom('width')}
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
                  onmousedown={() => { dragging = true; startZoom('radius') }}
                  onmousemove={onDrag}
                  onmouseup={() => { dragging = false }}
                  onmouseleave={() => { dragging = false }}
                >
                  <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#000" stroke-width="3.5"/>
                  <g transform="translate({handleX}, {handleY})">
                    <circle class="radius-thumb" cx="0" cy="0" r="12" stroke-width="3"/>
                  </g>
                </svg>
              </div>
            </div>
          {/if}
        </div>

        <div class="sezione">
          <button class="sezione-header" onclick={() => accordionOpen = 'materials'}>
            <span>MATERIALS</span>
            <span class="accordion-icon">{accordionOpen === 'materials' ? '−' : '+'}</span>
          </button>
          
          {#if accordionOpen === 'materials'}
            <div class="sezione-body" transition:slide>
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
          {/if}
        </div>

        <div class="sezione">
          <button class="sezione-header" onclick={() => accordionOpen = 'wax'}>
            <span>WAX PROTOCOL</span>
            <span class="accordion-icon">{accordionOpen === 'wax' ? '−' : '+'}</span>
          </button>
          
          {#if accordionOpen === 'wax'}
            <div class="sezione-body" transition:slide>
              <div class="wax-row">
                <p class="wax-label">{waxLabel}</p>
                <div class="wax-track-wrap">
                  <input type="range" min={0} max={2} step={0.01}
                    bind:value={ceraIndex}
                    class="wax-input"
                  />
                  <div class="wax-track">
                    {#each Array(10) as _, i}
                      {@const isPiena = i / 10 < (ceraIndex + 0.2) / 2}
                      <div 
                        class="wax-bacchetta" 
                        class:piena={isPiena}
                        style="--index: {i};"
                      ></div>
                    {/each}
                  </div>
                </div>
                <p class="wax-mu">{waxMu}</p>
              </div>
              <p class="wax-desc">{waxDesc}</p>
            </div>
          {/if}
        </div>
      </div> </div>

    <div class="right-col">
      <div class="dx-header">CONFIGURE YOUR SKI SYSTEM</div>
      
      <div class="right-info">
        <div class="sci-overlay">
          {#if !config.zoomAttivo}
            {#if attivo('length')}
              <div class="linea v-up" style="left: 52%; top: 0%; height: 90%;"></div>
              <div class="linea h-right" style="left: 52%; top: 0%; width: 10%;"></div>
            {/if}
            <button class="pallino" style="left: 52%; top: 90%"
              onmouseenter={() => hover = 'length'}
              onmouseleave={() => hover = null}
              onclick={() => toggleFisso('length')}
              class:attivo={attivo('length')}>
            </button>
            <div class="tooltip-box" class:visibile={attivo('length')} style="left: 58%; top: -15%; cursor: pointer;" onclick={() => goto('/athlete')}>
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
            <div class="tooltip-box width-box" class:visibile={attivo('width')} style="left: 3.5%; top: 8%; cursor: pointer;" onclick={() => goto('/environment')}>
              <p class="tooltip-title">WIDTH</p>
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
            <div class="tooltip-box" class:visibile={attivo('radius')} style="left: 50%; top: 210%; cursor: pointer;" onclick={() => goto('/athlete')}>
              <p class="tooltip-title">RADIUS</p>
              <p class="tooltip-desc">{descrizioni.radius}</p>
              <p class="tooltip-valore">{config.raggio} M</p>
            </div>
          {/if}
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
    background: var(--mc-bg);
  }

  .left-intro {
    display: block; 
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1;
    margin-top: 0;
    margin-bottom: 24px;
  }

  .desc {
    font-size: 0.78rem;
    line-height: 1.6;
    color: #444;
    max-width: 54ch;
    margin: 0;
  }

  /* ── NUOVO GRUPPO ACCORDION ── */
  .accordion-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sezione { 
    border: 1.5px solid black; 
    margin-bottom: 0;
    background: var(--mc-bg);
  }

  .sezione-header {
    background: black;
    color: white;
    padding: 8px 24px;
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
    background: #1a1a1a;
  }

  .accordion-icon {
    color: #BDF522; 
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1;
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
  font-family: 'Geist Mono', monospace;
  font-weight: 500;
  font-size: 16pt;
  letter-spacing: 0.02em;
  margin: 0;
}

.val-live {
  font-family: 'Geist Mono', monospace;
  font-weight: 500;
  font-size: 16pt;
  color: var(--mc-copper);
  margin: 0;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
}

.range-label {
  font-family: 'Geist Mono', monospace;
  font-weight: 400;
  font-size: 8pt;
  color: #666;
  letter-spacing: 0.05em;
  margin: 0;
}

  /* ── SLIDER LENGTH E WIDTH ── */
  .slider-h {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 14px;
    background: transparent;
    cursor: grab;
    margin: 4px 0 0 0;
    padding: 0;
  }

  .slider-h:active {
    cursor: grabbing;
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
    outline: 1.5px solid black; 
    margin-top: -6px;
    transition: transform 0.2s, background 0.2s, outline-color 0.2s;
  }

  .slider-h:hover::-webkit-slider-thumb,
  .slider-h:active::-webkit-slider-thumb {
    transform: scale(1.3);
    background: black;
    outline-color: var(--mc-copper);
  }

  /* ── SLIDER RADIUS ── */
  .radius-svg {
    width: 100%;
    height: 60px;
    margin-top: 4px;
    cursor: grab;
  }

  .radius-svg:active {
    cursor: grabbing;
  }

  .radius-thumb {
    fill: var(--mc-copper);
    stroke: black;
    transition: fill 0.2s, stroke 0.2s, transform 0.2s;
  }

  .radius-svg:hover .radius-thumb,
  .radius-svg:active .radius-thumb {
    fill: black;
    stroke: var(--mc-copper);
    transform: scale(1.3);
  }

  /* ── CARDS MATERIALI ── */
  .materiali-grid {
    display: flex;
    flex-direction: row;
    gap: 12px; 
    margin-top: 0;
    margin-bottom: 16px;
  }
  .mat-label {
  font-family: 'Geist Mono', monospace;
  font-weight: 500;
  font-size: 16pt;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 8px;
}

  .mat-card {
  flex: 1;
  position: relative;
  border: 2px solid transparent;
  background: none;
  cursor: pointer;
  padding: 0;
  height: 80px;
  overflow: hidden;
  transition: border 0.2s, box-shadow 0.2s;
}

.mat-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(189, 245, 34, 0.5);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.mat-card:hover:not(.selezionato)::after {
  opacity: 1;
}

.mat-card.selezionato {
  border: 2px solid black;
  box-shadow: 0 0 0 2px var(--mc-copper);
}

.mat-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(100%);
  transition: filter 0.2s;
}
.mat-desc {
  font-family: 'Geist Mono', monospace;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.7;
  color: #444;
  margin: 0;
}


.mat-card.selezionato .mat-img {
  filter: grayscale(0%);
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
    position: relative;
  }

  /* ── SLIDER WAX ── */
  .wax-input {
    width: 120px;
    -webkit-appearance: none;
    appearance: none;
    height: 12px;
    background: transparent;
    cursor: grab;
    position: relative;
    z-index: 5;
    margin: 0;
  }

  .wax-input:active {
    cursor: grabbing;
  }

  .wax-input::-webkit-slider-runnable-track {
    background: transparent !important;
    border: none !important;
    height: 0px !important;
  }
  .wax-input::-moz-range-track {
    background: transparent !important;
    border: none !important;
    height: 0px !important;
  }

  .wax-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 12px;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 12'><polygon points='7,11 1,1 13,1' fill='%23BDF522' stroke='black' stroke-width='1.5' stroke-linejoin='round'/></svg>") no-repeat center;
    border: none;
    transition: transform 0.2s;
  }

  .wax-input:hover::-webkit-slider-thumb,
  .wax-input:active::-webkit-slider-thumb {
    transform: scale(1.3);
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 12'><polygon points='7,11 1,1 13,1' fill='black' stroke='%23BDF522' stroke-width='1.5' stroke-linejoin='round'/></svg>") no-repeat center;
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
    height: 12px;
    background: #ccc;
    transform: skewX(-12deg);
    flex: none;
    transition: height 0.2s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.2s ease;
  }

  .wax-bacchetta.piena { 
    background: black; 
    height: calc(14px + var(--index) * 1.4px);
  }

  .wax-mu {
  font-family: 'Geist Mono', monospace;
  font-size: 20pt;
  font-weight: 500;
  white-space: nowrap;
  margin-left: 16px;
  padding-bottom: 4px;
  margin-top: 0;
  margin-bottom: 0;
}

 .wax-desc {
  font-family: 'Geist Mono', monospace;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.7;
  color: #444;
  margin-top: 16px;
  margin-bottom: 0;
}

  .right-col {
    display: flex;
    flex-direction: column;
  }

  .dx-header {
    padding: 24px 40px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-bottom: 1.5px solid black;
    margin: 0;
  }

  .right-info {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 40px; 
    gap: 24px; 
    flex: 1; 
    overflow: hidden;
  }

  .sci-overlay {
    position: relative;
    width: 100%;
    height: 200px;
    margin: 0;
  }

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

  .tooltip-box {
    position: absolute;
    background: white;
    border: 1.5px solid black; 
    padding: 16px; 
    width: 280px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s, transform 0.2s; 
    z-index: 20;
    margin: 0;
  }

  .tooltip-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .tooltip-box.visibile {
    opacity: 1;
    pointer-events: auto;
    transition-delay: 1.4s;
  }

  .tooltip-box.visibile:hover {
    transition-delay: 0s;
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