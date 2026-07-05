<script>
  import { config } from '$lib/config.svelte.js'
  import { onMount } from 'svelte'
  import { calcola } from '$lib/algoritmo.js'

  config.fase = 4

  const r = calcola(config)
  const {
    dtTotale, dtAtleta, dtEquip,
    dnfRate, scenario, isFluoro, spider
  } = r

  // ─── COLORI ───────────────────────────────────────────────────────────
  // Nero se il caso è DNF ("You Died"), altrimenti il verde per tutti gli altri
  const accent = scenario === 'DNF' ? '#000000' : '#BDF522'

  const verdicts = {
    CLEAN:          'VALID RUN',
    DNF:            'DNF',
    BANNED:         'DISQUALIFIED',
    'RESOURCE GAP': 'RESOURCE GAP',
  }
  const verdict = verdicts[scenario]

  const sign = dtTotale <= 0 ? '' : '+'
  const dtFormatted     = isFluoro ? 'Δt= —' : `Δt= ${sign}${dtTotale.toFixed(2)}s`
  const dtFormattedFull = isFluoro ? 'INVALID' : `${sign}${dtTotale.toFixed(2)}s`

  // ─── TESTI SCENARIO ───────────────────────────────────────────────────
  const introText = {
    CLEAN: 'Your configuration is within FIS compliance parameters across all three axes of the simulation — and within the portion of that legal space that does not require exceptional resources to reach.',
    DNF: 'Your configuration is within FIS compliance parameters, but your physical profile generates a DNF risk above the threshold sustainable at elite level. The race does not finish.',
    BANNED: 'Your configuration does not comply with FIS regulations. Fluorocarbon wax has been banned since the 2022/23 season. This run is invalid.',
    'RESOURCE GAP': 'Your configuration is within FIS compliance parameters, but the combination of materials and wax protocol required to assemble it places it outside what most national programs can replicate without significant sponsorship infrastructure.',
  }

  // ─── SPIDER CHART ─────────────────────────────────────────────────────
  const spiderParams = [
    { key: 'SPEED\nPOTENTIAL',      value: spider.speedPotential },
    { key: 'TECHNICAL\nCONTROL',    value: spider.technicalControl },
    { key: 'EQUIPMENT\nCOMPLIANCE', value: spider.equipmentCompliance },
    { key: 'DNF RISK',              value: spider.dnfRisk },
    { key: 'EDGE GRIP',             value: spider.edgeGrip },
    { key: 'RESOURCE\nACCESS',      value: spider.resourceAccess },
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
          <polygon
            points={polyPoints(Array(N).fill(lvl))}
            fill="none" stroke="#000" stroke-width="0.5" opacity="0.15"
          />
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
          <span class="tt-key">{spiderParams[hoveredParam].key.replace('\n', ' ')}</span>
          <span class="tt-val">{(spiderParams[hoveredParam].value * 100).toFixed(0)}%</span>
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
          <span>DNF risk</span>
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
    color: var(--accent-text); 
  }
  .tt-val {
    font-size: 1.1rem;
    font-weight: 700;
    font-family: 'Geist Mono', monospace;
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