<script>
  import { config } from '$lib/config.svelte.js'

  // Range per venue
  const ranges = config.venue === 'bormio'
    ? { lunMin: 218, lunMax: 226, radMin: 45, radMax: 55 }
    : { lunMin: 210, lunMax: 218, radMin: 40, radMax: 50 }

  // Semicerchio radius
  let angolo = $derived(Math.PI - ((config.raggio - ranges.radMin) / (ranges.radMax - ranges.radMin)) * Math.PI)
  let handleX = $derived(100 + 90 * Math.cos(angolo))
  let handleY = $derived(100 - 90 * Math.sin(angolo))

  let dragging = false
  function startDrag() { dragging = true }
  function stopDrag() { dragging = false }

  function onDrag(e) {
    if (!dragging) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const svgX = (e.clientX - rect.left) / rect.width * 200 - 100
    const svgY = (e.clientY - rect.top) / rect.height * 110 - 100
    let ang = Math.atan2(-svgY, svgX)
    if (ang < 0) ang = 0
    if (ang > Math.PI) ang = Math.PI
    config.raggio = Math.round(ranges.radMin + (1 - ang / Math.PI) * (ranges.radMax - ranges.radMin))
  }
</script>

<div class="configuratore">
  <p class="section-title">Geometry</p>

  <div class="griglia">

    <!-- LENGTH -->
    <div class="cella">
      <p class="dim-title">Length</p>
      <input
        type="range"
        orient="vertical"
        min={ranges.lunMin} max={ranges.lunMax} step={1}
        bind:value={config.lunghezza}
        class="slider-verticale"
      />
      <p class="valore">{config.lunghezza} cm</p>
    </div>

    <!-- WIDTH -->
    <div class="cella">
      <p class="dim-title">Width</p>
      <input
        type="range"
        min={63} max={68} step={1}
        bind:value={config.larghezza}
        class="slider-orizzontale"
      />
      <p class="valore">{config.larghezza} mm</p>
    </div>

    <!-- RADIUS -->
    <div class="cella">
      <p class="dim-title">Radius</p>
      <svg viewBox="0 0 200 110" class="radius-svg"
        onmousedown={startDrag}
        onmousemove={onDrag}
        onmouseup={stopDrag}
      >
        <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#333" stroke-width="2"/>
        <circle cx={handleX} cy={handleY} r="8" fill="var(--mc-copper)" style="cursor:grab"/>
      </svg>
      <p class="valore">{config.raggio} m</p>
    </div>

  </div>
</div>

<style>
  .configuratore {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--mc-text);
    margin: 0 0 0.5rem 0;
  }

  .griglia {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .cella {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .dim-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--mc-text);
    margin: 0;
  }

  .valore {
    font-size: 0.75rem;
    color: var(--mc-text);
    letter-spacing: 0.05em;
  }

  .slider-verticale {
    -webkit-appearance: none;
    appearance: none;
    writing-mode: vertical-lr;
    direction: rtl;
    height: 120px;
    width: 2px;
    background: #000000;
    cursor: pointer;
  }

  .slider-orizzontale {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 2px;
    background: #000000;
    cursor: pointer;
  }

  .slider-verticale::-webkit-slider-thumb,
  .slider-orizzontale::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--mc-copper);
    cursor: grab;
  }

  .radius-svg {
    width: 100%;
  }
</style>