<script>
  import { config } from '$lib/config.svelte.js'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  config.fase = 4

  // ─── FORMULA ──────────────────────────────────────────────────────────
  function norm(x, xMin, xMax) {
    return 2 * (x - xMin) / (xMax - xMin) - 1
  }

  const isMale   = config.venue === 'bormio'
  const massaMin = isMale ? 85 : 65
  const massaMax = isMale ? 100 : 75
  const rfdMin   = isMale ? 3000 : 2800
  const rfdMax   = isMale ? 6000 : 5000

  const nMassa = norm(config.massa ?? 70, massaMin, massaMax)
  const nRfd   = norm(config.rfd ?? 3500, rfdMin, rfdMax)
  const nDev   = -norm(config.deviazione ?? 20, 5, 40)
  const nGeo   = norm(config.lunghezza ?? 214, isMale ? 218 : 210, isMale ? 226 : 218)
  const matMap  = { wood: -1, carbon: 0, titanal: 1 }
  const nMat   = matMap[config.materiale] ?? -1

  function ceraToNorm(c) {
    if (c === 'fluoro' || c === 'fluoro formula') return 1
    if (c === 'race' || c === 'graphite' || c === 'silicone') return 0.33
    return -1
  }
  const nCera = ceraToNorm(config.cera)

  const D = {
    massa:      { neg: -0.3, pos: 0.2 },
    rfd:        { neg: -0.4, pos: 0.3 },
    consistenza:{ neg: -0.7, pos: 0.2 },
    geometria:  { neg: -0.3, pos: 0.2 },
    materiale:  { neg: 0.0,  pos: 0.3 },
    cera:       { neg: -0.3, pos: 0.4 },
  }

  function contrib(n, d) {
    return n >= 0 ? n * d.pos : n * Math.abs(d.neg)
  }

  const dtMassa   = contrib(nMassa, D.massa)
  const dtRfd     = contrib(nRfd, D.rfd)
  const dtConsist = contrib(nDev, D.consistenza)
  const dtGeo     = contrib(nGeo, D.geometria)
  const dtMat     = contrib(nMat, D.materiale)
  const dtCera    = contrib(nCera, D.cera)
  const dtAtleta  = dtMassa + dtRfd + dtConsist
  const dtEquip   = dtGeo + dtMat + dtCera
  const dtTotale  = dtAtleta + dtEquip

  const nConsistNorm01 = (nDev + 1) / 2
  const nRfdNorm01     = (nRfd + 1) / 2
  const dnfRate = 0.25 * (1 - nConsistNorm01) + 0.10 * nRfdNorm01 * (1 - nConsistNorm01)

  const isFluoro = config.cera === 'fluoro' || config.cera === 'fluoro formula'
  const techFlags = (config.materiale === 'titanal' ? 1 : 0) +
    (config.cera === 'race' || config.cera === 'graphite' || config.cera === 'silicone' ? 1 : 0)

  // FIX 1: const invece di let scenario
  const scenario = isFluoro ? 'DISQUALIFIED'
    : dnfRate > 0.25 ? 'DNF'
    : dtTotale > 0.5 && techFlags >= 2 ? 'UNFAIR'
    : 'VALID'

  // ─── COLORI ───────────────────────────────────────────────────────────
  const colors = {
    VALID:        '#BDF522',
    DNF:          '#FA51A2',
    DISQUALIFIED: '#A609F0',
    UNFAIR:       '#7B46F8',
  }
  const accent = colors[scenario]

  const verdicts = {
    VALID:        'VALID RUN',
    DNF:          'DNF',
    DISQUALIFIED: 'DISQUALIFIED',
    UNFAIR:       'NOT FAIR',
  }
  const verdict = verdicts[scenario]

  const sign = dtTotale >= 0 ? '+' : ''
  const dtFormatted = `Δt= ${sign}${dtTotale.toFixed(2)}s`
  const dtFormattedFull = `${sign}${dtTotale.toFixed(2)}s`

  // ─── TESTI SCENARIO ───────────────────────────────────────────────────
  const introText = {
    VALID:        'Your configuration is within FIS compliance parameters across all three axes of the simulation.',
    DNF:          'Your configuration is within FIS compliance parameters, but your physical profile generates a DNF risk above the threshold sustainable at elite level.',
    DISQUALIFIED: 'Your configuration does not comply with FIS regulations. Fluorocarbon wax has been banned since 2022. This run is invalid.',
    UNFAIR:       'Your configuration is within FIS compliance parameters, but the resource access required to assemble it places it outside what most national programs can replicate.',
  }

  const paragraphs = [
    `The number you are looking at is the time your configuration adds or removes from a reference descent. A negative value means you are faster. A positive value means you are slower. The reference is not a real athlete. It is a structural midpoint.`,
    `The combination you have assembled produces a measurable time advantage over that midpoint within accessible resources.`,
  ]

  // ─── TESTI RIEPILOGO BOTTOM ───────────────────────────────────────────
  const venueLabel = config.venue === 'bormio' ? 'STELVIO — BORMIO' : 'OLYMPIA DELLE TOFANE'
  const genderLabel = config.venue === 'bormio' ? 'MALE' : 'FEMALE'
  const trackLen    = config.venue === 'bormio' ? '2300m' : '2200m'
  const speedPeak   = config.venue === 'bormio' ? '140 km/h' : '130 km/h'

  const materiali = { wood: 'WOOD', carbon: 'CARBON FIBER', titanal: 'TITANAL' }
  const cere      = { training: 'TRAINING', race: 'RACE FORMULA', fluoro: 'FLUORO', graphite: 'GRAPHITE', silicone: 'SILICONE' }
  const tute      = { 0: 'STANDARD', 1: 'LEGAL', 2: 'BORDERLINE', 3: 'DOPING' }

  const geoLabel = `L ${config.lunghezza ?? '—'}cm  R ${config.raggio ?? '—'}m  W ${config.larghezza ?? '—'}mm`

  // ─── SPIDER CHART ─────────────────────────────────────────────────────
  const spiderParams = [
    { key: 'SPEED\nPOTENTIAL',     value: Math.max(0, Math.min(1, ((nMassa + nGeo) / 2 + 1) / 2)) },
    { key: 'TECHNICAL\nCONTROL',   value: Math.max(0, Math.min(1, nConsistNorm01 * 0.6 + nRfdNorm01 * 0.4)) },
    { key: 'EQUIPMENT\nCOMPLIANCE',value: Math.max(0, Math.min(1, isFluoro ? 0.05 : (1 - nCera * 0.4 - Math.max(0, nMat) * 0.2))) },
    { key: 'DNF RISK',             value: Math.max(0, Math.min(1, 1 - dnfRate / 0.35)) },
    { key: 'EDGE GRIP',            value: Math.max(0, Math.min(1, (nMat + 1) / 2 * 0.6 + (1 - Math.abs(nGeo)) * 0.4)) },
    { key: 'RESOURCE\nACCESS',     value: Math.max(0, Math.min(1, ((nMat + 1) / 2 * 0.5 + (nCera + 1) / 2 * 0.5))) },
  ]

  const N  = spiderParams.length
  const CX = 250
  const CY = 250
  const R  = 160

  function polarPt(i, r) {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  }

  function polyPoints(values, scale = R) {
    return values.map((v, i) => {
      const p = polarPt(i, v * scale)
      return `${p.x},${p.y}`
    }).join(' ')
  }

  const levels    = [0.25, 0.5, 0.75, 1]
  const labelPts  = spiderParams.map((p, i) => ({ ...p, ...polarPt(i, R + 36) }))
  const dataPoly  = polyPoints(spiderParams.map(p => p.value))

  function anchor(x) {
    if (x < CX - 10) return 'end'
    if (x > CX + 10) return 'start'
    return 'middle'
  }

  let mounted = $state(false)
  let hoveredParam = $state(null)
  onMount(() => { setTimeout(() => { mounted = true }, 100) })
</script>

<div class="page" style="--accent: {accent};">

  <!-- ① VERDICT BANNER -->
  <div class="banner" aria-label={verdict}>
    <div class="banner-track">
      <span>{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;</span>
      <span aria-hidden="true">{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;</span>
    </div>
  </div>

  <!-- ② INTRO TEXT -->
  <div class="intro-row">
    <p class="intro-text">{introText[scenario]}</p>
  </div>

  <!-- ③ MAIN AREA: spider + delta + testo -->
  <div class="main-area">

    <!-- Spider chart -->
    <div class="spider-wrap">
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" class="spider-svg">
        <!-- Grid -->
        {#each levels as lvl}
          <polygon
            points={polyPoints(Array(N).fill(lvl))}
            fill="none" stroke="#000" stroke-width="0.5" opacity="0.15"
          />
        {/each}
        <!-- Axes -->
        {#each spiderParams as _, i}
          {@const a = polarPt(i, 0)}
          {@const b = polarPt(i, R)}
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#000" stroke-width="0.5" opacity="0.2"/>
        {/each}
        <!-- Data polygon -->
        <polygon
          points={dataPoly}
          fill={accent}
          fill-opacity={mounted ? 0.18 : 0}
          stroke={accent}
          stroke-width="2"
          stroke-linejoin="round"
          style="transition: fill-opacity 0.8s ease;"
        />
        <!-- FIX 2: role="img" su circle -->
        {#each spiderParams as p, i}
          {@const pt = polarPt(i, p.value * R)}
          <circle
            cx={pt.x} cy={pt.y}
            r={hoveredParam === i ? 7 : 5}
            fill={accent} stroke="white" stroke-width="1.5"
            style="transition: r 0.15s ease; cursor: pointer;"
            role="img"
            aria-label={spiderParams[i].key.replace('\n', ' ')}
            onmouseenter={() => hoveredParam = i}
            onmouseleave={() => hoveredParam = null}
          />
        {/each}
        <!-- Labels -->
        {#each labelPts as lp, i}
          {#each lp.key.split('\n') as line, li}
            <text
              x={lp.x}
              y={lp.y + (li - (lp.key.split('\n').length - 1) / 2) * 13}
              text-anchor={anchor(lp.x)}
              dominant-baseline="middle"
              font-size="9"
              font-family="Geist, sans-serif"
              font-weight="600"
              letter-spacing="0.08em"
              fill="#000"
              opacity={hoveredParam === i ? 1 : 0.55}
              style="transition: opacity 0.15s ease;"
            >{line}</text>
          {/each}
        {/each}
      </svg>

      <!-- Tooltip -->
      {#if hoveredParam !== null}
        <div class="tooltip">
          <span class="tt-key">{spiderParams[hoveredParam].key.replace('\n', ' ')}</span>
          <span class="tt-val">{(spiderParams[hoveredParam].value * 100).toFixed(0)}%</span>
        </div>
      {/if}
    </div>

    <!-- Delta + testo -->
    <div class="right-panel">
      <div class="delta-num">{scenario === 'DISQUALIFIED' ? 'Δt= —' : dtFormatted}</div>
      {#each paragraphs as para}
        <p class="right-para" style="margin-top: 12px;">{para}</p>
      {/each}
      <div class="breakdown-mini">
        <div class="bk-row">
          <span>Athlete</span>
          <span class="mono">{(dtAtleta >= 0 ? '+' : '')}{dtAtleta.toFixed(2)}s</span>
        </div>
        <div class="bk-row">
          <span>Equipment</span>
          <span class="mono">{(dtEquip >= 0 ? '+' : '')}{dtEquip.toFixed(2)}s</span>
        </div>
        <div class="bk-row total">
          <span>Total Δt</span>
          <span class="mono">{scenario === 'DISQUALIFIED' ? 'INVALID' : dtFormattedFull}</span>
        </div>
        <div class="bk-row">
          <span>DNF</span>
          <span class="mono" class:danger={dnfRate > 0.25}>{(dnfRate * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>

  </div>

</div>

<style>
  .page {
    display: grid;
    grid-template-rows: auto auto 1fr;
    height: calc(100vh - 76px);
    overflow: hidden;
    background: #fff;
    color: #000;
  }

  /* ① BANNER */
  .banner {
    background: var(--accent);
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1.5px solid #000;
  }
  .banner-track {
    display: inline-block;
    animation: marquee 10s linear infinite;
  }
  .banner-track span {
    display: inline-block;
    font-size: clamp(52px, 8vw, 110px);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.05;
    text-transform: uppercase;
    padding: 8px 0;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ② INTRO ROW */
  .intro-row {
    border-bottom: 1.5px solid #000;
    padding: 12px 40px;
  }
  .intro-text {
    font-size: 0.72rem;
    line-height: 1.6;
    max-width: 900px;
    color: #444;
    font-family: 'Geist Mono', monospace;
  }

  /* ③ MAIN AREA */
  .main-area {
    display: grid;
    grid-template-columns: 1fr 260px;
    border-bottom: 1.5px solid #000;
    overflow: hidden;
    min-height: 0;
  }

  /* Spider */
  .spider-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 32px;
    position: relative;
    min-height: 0;
  }
  .spider-svg {
    width: 100%;
    height: 100%;
    max-height: 100%;
  }
  .tooltip {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: #fff;
    padding: 8px 14px;
    display: flex;
    align-items: baseline;
    gap: 12px;
    pointer-events: none;
  }
  .tt-key {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .tt-val {
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Geist Mono', monospace;
  }

  /* Right panel */
  .right-panel {
    width: 260px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: none;
    border-left: 1.5px solid #000;
  }
  .right-panel::-webkit-scrollbar { display: none; }
  .delta-num {
    font-size: clamp(22px, 2.5vw, 36px);
    font-weight: 700;
    font-family: 'Geist Mono', monospace;
    letter-spacing: -0.02em;
    line-height: 1.1;
    padding: 16px 16px 12px;
    border-bottom: 1.5px solid #000;
    flex-shrink: 0;
  }
  .right-para {
    font-size: 0.62rem;
    line-height: 1.6;
    color: #444;
    padding: 0 16px;
  }

  /* Breakdown mini */
  .breakdown-mini {
    margin: 12px 16px 16px;
    border: 1.5px solid #000;
    display: flex;
    flex-direction: column;
  }
  .bk-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 10px;
    font-size: 0.62rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  .bk-row:last-child { border-bottom: none; }
  .bk-row.total { background: #000; color: #fff; font-weight: 700; }
  .bk-row.total .mono { color: var(--accent); filter: brightness(1.2); }
  .mono { font-family: 'Geist Mono', monospace; }
  .danger { color: #FF3B30; font-weight: 700; }
</style>