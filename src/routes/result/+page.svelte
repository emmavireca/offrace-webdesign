<script>
  import { config } from '$lib/config.svelte.js'
  import { onMount } from 'svelte'
  import { calcola } from '$lib/algoritmo.js'

  config.fase = 4

  const r = calcola(config)
  const { dtTotale, dtAtleta, dtEquip, dnfRate, scenario, isFluoro, spider } = r

  // ─── LOADING SCREEN ───────────────────────────────────────────────────
  let videoFinito = $state(false)
  let videoEl = $state(null)

  const playbackRate = Math.max(0.25, Math.min(3.0, Math.pow(2, -dtTotale * 1.2)))

  $effect(() => {
    if (!videoEl) return
    const applyRate = () => { videoEl.playbackRate = playbackRate }
    if (videoEl.readyState >= 1) applyRate()
    else videoEl.addEventListener('loadedmetadata', applyRate, { once: true })
  })

  // ─── COLORI ───────────────────────────────────────────────────────────
  const accent = scenario === 'DNF' ? '#000000' : '#BDF522'

  const verdicts = {
    CLEAN:          'VALID RUN',
    DNF:            'YOU DIED',
    BANNED:         'DISQUALIFIED',
    'RESOURCE GAP': 'RESOURCE GAP',
  }
  const verdict = verdicts[scenario]

  const sign = dtTotale <= 0 ? '' : '+'
  const dtFormatted     = `Δt= ${sign}${dtTotale.toFixed(2)}s`
  const dtFormattedFull = `${sign}${dtTotale.toFixed(2)}s`

  const introText = {
    CLEAN: 'Your configuration is within FIS compliance parameters across all three axes of the simulation — and within the portion of that legal space that does not require exceptional resources to reach.',
    DNF: 'Your configuration is within FIS compliance parameters, but your physical profile generates a DNF risk above the threshold sustainable at elite level. The race does not finish.',
    BANNED: 'Your configuration does not comply with FIS regulations. Fluorocarbon wax has been banned since the 2022/23 season. This run is invalid.',
    'RESOURCE GAP': 'Your configuration is within FIS compliance parameters, but the combination of materials and wax protocol required to assemble it places it outside what most national programs can replicate without significant sponsorship infrastructure.',
  }

  // ─── SPIDER CHART ─────────────────────────────────────────────────────
  const spiderParams = [
    {
      key: 'SPEED\nPOTENTIAL',
      value: spider.speedPotential,
      desc: 'How much gravitational and mechanical force your configuration can convert into straight-line acceleration.',
      from: 'Body mass + ski geometry'
    },
    {
      key: 'TECHNICAL\nCONTROL',
      value: spider.technicalControl,
      desc: 'Your capacity to maintain the optimal racing line through technical sections without accumulating trajectory error.',
      from: 'Trajectory deviation + RFD'
    },
    {
      key: 'EQUIPMENT\nCOMPLIANCE',
      value: spider.equipmentCompliance,
      desc: 'How far your equipment sits from the regulatory boundary. Legal does not mean central.',
      from: 'Wax protocol + ski geometry'
    },
    {
      key: 'DNF RISK',
      value: spider.dnfRisk,
      desc: 'The probability that this configuration does not cross the finish line.',
      from: 'Trajectory deviation + RFD (combined)'
    },
    {
      key: 'EDGE GRIP',
      value: spider.edgeGrip,
      desc: 'The ski\'s ability to hold a clean edge on hard, icy snow under lateral load.',
      from: 'Ski material + radius'
    },
    {
      key: 'RESOURCE\nACCESS',
      value: spider.resourceAccess,
      desc: 'Where your configuration sits in the economic ecosystem of competitive skiing. Not a performance metric — a structural one.',
      from: 'Ski material + wax protocol'
    },
  ]

  const N  = spiderParams.length
  const CX = 250
  const CY = 250
  const R  = 160

  function polarPt(i, r) {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
  }

  function polyPoints(values) {
    return values.map((v, i) => {
      const p = polarPt(i, v * R)
      return `${p.x},${p.y}`
    }).join(' ')
  }

  const levels   = [0.25, 0.5, 0.75, 1]
  const labelPts = spiderParams.map((p, i) => ({ ...p, ...polarPt(i, R + 36) }))
  const dataPoly = polyPoints(spiderParams.map(p => p.value))

  function anchor(x) {
    if (x < CX - 10) return 'end'
    if (x > CX + 10) return 'start'
    return 'middle'
  }

  let mounted = $state(false)
  let hoveredParam = $state(null)
  onMount(() => { setTimeout(() => { mounted = true }, 100) })
</script>

{#if !videoFinito}
  <!-- ── LOADING SCREEN ── -->
  <div class="loading-screen" class:you-died={scenario === 'DNF'}>
    <video
      bind:this={videoEl}
      src="/videos/result_alpha.webm"
      autoplay
      muted
      playsinline
      onended={() => videoFinito = true}
      class="loading-video"
    ></video>
    <div class="loading-overlay">
      <span class="loading-label">Loading...</span>
      <div class="loading-bar-outer">
        <div class="loading-bar-inner" style="animation-duration: {(2 / playbackRate).toFixed(1)}s"></div>
      </div>
    </div>
  </div>

{:else}
  <!-- ── RESULT PAGE ── -->
  <div class="page" style="
    --accent: {accent};
    --accent-text: {scenario === 'DNF' ? '#ffffff' : '#BDF522'};
    --banner-text: {scenario === 'DNF' ? '#ffffff' : '#000000'};
  ">

    <div class="banner" aria-label={verdict}>
      <div class="banner-track">
        <span>{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;</span>
        <span aria-hidden="true">{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;{verdict}&nbsp;&nbsp;</span>
      </div>
    </div>

    <div class="intro-row">
      <p class="intro-text">{introText[scenario]}</p>
    </div>

    <div class="main-area">

      <div class="spider-wrap">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" class="spider-svg">
          {#each levels as lvl}
            <polygon points={polyPoints(Array(N).fill(lvl))} fill="none" stroke="#000" stroke-width="0.5" opacity="0.15"/>
          {/each}
          {#each spiderParams as _, i}
            {@const a = polarPt(i, 0)}
            {@const b = polarPt(i, R)}
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#000" stroke-width="0.5" opacity="0.2"/>
          {/each}
          <polygon
            points={dataPoly}
            fill={accent}
            fill-opacity={mounted ? 0.18 : 0}
            stroke={accent}
            stroke-width="2"
            stroke-linejoin="round"
            style="transition: fill-opacity 0.8s ease;"
          />
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

        {#if hoveredParam !== null}
          <div class="tooltip">
            <div class="tt-header">
              <span class="tt-key">{spiderParams[hoveredParam].key.replace('\n', ' ')}</span>
              <span class="tt-val">{(spiderParams[hoveredParam].value * 100).toFixed(0)}%</span>
            </div>
            <p class="tt-desc">{spiderParams[hoveredParam].desc}</p>
            <p class="tt-from">Derived from: {spiderParams[hoveredParam].from}</p>
          </div>
        {/if}
      </div>

      <div class="right-panel">
        <div class="delta-num">{dtFormatted}</div>
        <p class="right-para">The number you are looking at is the time your configuration adds or removes from a reference descent. A negative value means you are faster. A positive value means you are slower. The reference is not a real athlete — it is a structural midpoint.</p>
        <div class="breakdown-mini">
          <div class="bk-row">
            <span>Athlete</span>
            <span class="mono">{dtAtleta <= 0 ? '' : '+'}{dtAtleta.toFixed(2)}s</span>
          </div>
          <div class="bk-row">
            <span>Equipment</span>
            <span class="mono">{dtEquip <= 0 ? '' : '+'}{dtEquip.toFixed(2)}s</span>
          </div>
          <div class="bk-row total">
            <span>Total Δt</span>
            <span class="mono">{dtFormattedFull}</span>
          </div>
          <div class="bk-row">
            <span>{scenario === 'DNF' ? 'YOU DIED' : 'DNF risk'}</span>
            <span class="mono" class:danger={dnfRate > 0.25}>{(dnfRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

    </div>
  </div>
{/if}

<style>
  /* ── LOADING SCREEN ── */
  .loading-screen {
    position: fixed;
    inset: 0;
    background: white;
    z-index: 200;
  }

  .loading-screen.you-died {
    animation: flickerViolet 0.12s steps(2) infinite;
  }

  @keyframes flickerViolet {
    0%   { background-color: white; }
    49%  { background-color: white; }
    50%  { background-color: rgba(166, 9, 240, 0.25); }
    100% { background-color: rgba(166, 9, 240, 0.25); }
  }

  .loading-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .loading-overlay {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 200px;
    z-index: 10;
  }

  .loading-label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #000;
  }

  .loading-bar-outer {
    width: 100%;
    height: 2px;
    background: #e0e0e0;
    overflow: hidden;
  }

  .loading-bar-inner {
    height: 100%;
    background: #000;
    animation: loadfill 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes loadfill {
    0%   { width: 0%; }
    70%  { width: 80%; }
    90%  { width: 95%; }
    100% { width: 100%; }
  }

  /* ── RESULT PAGE ── */
  .page {
    display: grid;
    grid-template-rows: auto auto 1fr;
    height: calc(100vh - 64px);
    overflow: hidden;
    background: #fff;
    color: #000;
  }

  .banner {
    background: var(--accent);
    color: var(--banner-text);
    overflow: hidden;
    white-space: nowrap;
    border-bottom: 1.5px solid #000;
  }
  .banner-track {
    display: inline-block;
    animation: marquee 30s linear infinite;
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
    to   { transform: translateX(-25%); }
  }

  .intro-row {
    border-bottom: 1.5px solid #000;
    padding: 12px 40px;
  }
  .intro-text {
    font-family: 'Geist Mono', monospace;
    font-size: 0.72rem;
    line-height: 1.6;
    max-width: 900px;
    color: #444;
  }

  .main-area {
    display: grid;
    grid-template-columns: 1fr 260px;
    overflow: hidden;
    min-height: 0;
  }

  .spider-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 32px;
    position: relative;
    min-height: 0;
  }
  .spider-svg { width: 100%; height: 100%; max-height: 100%; }

  .tooltip {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: #fff;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    pointer-events: none;
    max-width: 320px;
    width: max-content;
  }

  .tt-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
  }

  .tt-key {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent-text);
  }

  .tt-val {
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Geist Mono', monospace;
    flex-shrink: 0;
  }

  .tt-desc {
    font-family: 'Geist Mono', monospace;
    font-size: 0.6rem;
    line-height: 1.5;
    color: #aaa;
    margin: 0;
  }

  .tt-from {
    font-family: 'Geist Mono', monospace;
    font-size: 0.55rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--accent-text);
    opacity: 0.7;
    margin: 0;
  }

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
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    line-height: 1.6;
    color: #444;
    padding: 12px 16px;
  }

  .breakdown-mini {
    margin: 0 16px 16px;
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
  .bk-row.total .mono { color: var(--accent-text); }
  .mono { font-family: 'Geist Mono', monospace; }
  .danger { color: #FF3B30; font-weight: 700; }
</style>