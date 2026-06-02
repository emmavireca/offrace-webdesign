<script>
  import { Canvas } from '@threlte/core'
  import Scene from '$lib/components/Scene.svelte'
  import { config } from '$lib/config.svelte.js'

  config.fase = 3

  const materiali = [
    { id: 'wood',    label: 'Wood Core',    img: '/textures/wood.png' },
    { id: 'carbon',  label: 'Carbon Fiber', img: '/textures/carbon.png' },
    { id: 'titanal', label: 'Titanal',      img: '/textures/titanal.png' },
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
      ? 'Fluorocarbon wax is built on a carbon-fluorine molecular structure. Banned by FIS in 2022, its friction coefficient remains the lowest ever recorded in competitive alpine skiing.'
      : ceraIndex < 1.33
        ? config.venue === 'bormio'
          ? 'Graphite-based compound. Optimized for dry, cold snow conditions. Standard choice for Stelvio hardpack.'
          : 'Silicone-based compound. Optimized for wet, humid snow. Ideal for Olympia delle Tofane spring conditions.'
        : 'Paraffin is a saturated hydrocarbon. Training-grade paraffin provides basic protection but offers no condition-specific advantage.'
  )

  let waxMu = $derived(
    ceraIndex < 0.66 ? 'μ=0.012' : ceraIndex < 1.33 ? 'μ=0.018' : 'μ=0.035'
  )

  $effect(() => {
    if (ceraIndex < 0.66) config.cera = 'fluoro'
    else if (ceraIndex < 1.33) config.cera = config.venue === 'bormio' ? 'graphite' : 'silicone'
    else config.cera = 'training'
  })

  let tooltip = $state(null)
  let tooltipFisso = $state(null)

  function toggleTooltip(nome) {
    tooltipFisso = tooltipFisso === nome ? null : nome
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

      <!-- GEOMETRY -->
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
              <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#000" stroke-width="4"/>
              <circle cx={handleX} cy={handleY} r="8" fill="var(--mc-copper)" stroke="black" stroke-width="1.5" style="cursor:grab"/>
            </svg>
          </div>

        </div>
      </div>

      <!-- MATERIALS -->
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
            {#if config.materiale === 'wood'}Wood core absorbs vibration along the full length of the ski and defines its base flex profile.
            {:else if config.materiale === 'carbon'}Carbon fiber provides exceptional stiffness-to-weight ratio, improving power transfer.
            {:else}Titanal alloy layers increase torsional rigidity and dampen high-frequency vibrations.{/if}
          </p>
        </div>
      </div>

      <!-- WAX -->
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
      {#if tooltip || tooltipFisso}
        {@const nome = tooltipFisso || tooltip}
        <div class="tooltip-box">
          <p class="tooltip-title">{nome.toUpperCase()}</p>
          <p class="tooltip-desc">{descrizioni[nome]}</p>
        </div>
      {/if}
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
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    border-right: 2px solid black;
  }

  .desc {
    font-size: 0.8rem;
    line-height: 1.6;
    color: #444;
  }

  .sezione { border: 2px solid black; }

  .sezione-header {
    background: black;
    color: white;
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
  }

  .sezione-body { padding: 0.75rem; }

  /* GEOMETRY */
  .tre-col {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0.75rem 0.5rem;
    border-right: 1px solid black;
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
  }

  .val-live {
    color: var(--mc-copper);
    font-size: 0.65rem;
    font-weight: 600;
  }

  .range-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .range-label {
    font-size: 0.5rem;
    color: #666;
    letter-spacing: 0.05em;
  }

  .slider-h {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 14px;
    background: transparent;
    cursor: pointer;
    margin: 0;
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
    outline: 2px solid black;
    margin-top: -6px;
  }

  .radius-svg {
    width: 100%;
    height: 60px;
  }

  /* MATERIALS */
  .materiali-grid {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .mat-card {
    border: 2px solid transparent;
    background: none;
    cursor: pointer;
    padding: 0;
    width: 175px;
    height: 64px;
    overflow: hidden;
    flex-shrink: 0;
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
    margin-bottom: 0.25rem;
  }

  .mat-desc {
    font-size: 0.75rem;
    line-height: 1.5;
    color: #444;
  }

  /* WAX */
  .wax-row {
    display: flex;
    align-items: flex-end;
    gap: 0;
  }

  .wax-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    white-space: nowrap;
    width: 140px;
    flex-shrink: 0;
  }

  .wax-label::after {
    content: '';
    display: block;
    height: 5px;
    width: 155px;
    background: black;
    transform: skewX(-12deg);
    transform-origin: left;
  }

  .wax-track-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: fit-content;
    margin-left: 1rem;
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
    margin-left: 1rem;
    padding-bottom: 4px;
  }

  .wax-desc {
    font-size: 0.75rem;
    line-height: 1.5;
    color: #444;
    margin-top: 0.75rem;
    border-left: 2px solid black;
    padding-left: 0.75rem;
  }

  /* DESTRA */
  .right-info {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }

  .right-subtitle {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .tooltip-box {
    background: white;
    border: 2px solid black;
    padding: 1rem;
    max-width: 280px;
  }

  .tooltip-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    margin-bottom: 0.5rem;
  }

  .tooltip-desc {
    font-size: 0.75rem;
    line-height: 1.6;
  }
</style>
