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
  const colors = {
    CLEAN:        '#BDF522',
    DNF:          '#FA51A2',
    BANNED:       '#A609F0',
    'RESOURCE GAP': '#7B46F8',
  }
  const accent = colors[scenario] ?? '#BDF522'

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

  <!-- ③ MAIN AREA: spider + delta + breakdown -->
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
        <!-- Dots -->
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

      {#if hoveredParam !== null}
        <div class="tooltip">
          <span class="tt-key">{spiderParams[hoveredParam].key.replace('\n', ' ')}</span>
          <span class="tt-val">{(spiderParams[hoveredParam].value * 100).toFixed(0)}%</span>
        </div>
      {/if}
    </div>

    <!-- Right panel: delta + breakdown -->
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
    color: var(--accent);
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
  .bk-row.total .mono { color: var(--accent); }
  .mono { font-family: 'Geist Mono', monospace; }
  .danger { color: #FF3B30; font-weight: 700; }

/* ── RESPONSIVE PER MOBILE (SPIDERCHART PRIMA DEL TESTO) ── */
@media (max-width: 768px) {
  
  /* Sblocchiamo l'altezza fissa della pagina desktop */
  .page {
    position: relative !important;
    height: auto !important;
    min-height: 100vh;
    display: flex !important;
    flex-direction: column !important;
    overflow-y: visible !important;
  }

  /* Il banner scorrevole rimane in cima (nativamente primo nel DOM) */
  .banner-track span {
    font-size: clamp(38px, 10vw, 56px) !important; /* Ridimensioniamo il testo del marquee */
    padding: 4px 0 !important;
  }

  /* Testo introduttivo subito sotto il marquee */
  .intro-row {
    padding: 16px !important;
  }
  .intro-text {
    font-size: 0.75rem !important;
  }

  /* Sganciamo la griglia desktop e usiamo un flusso Flex verticale */
  .main-area {
    display: flex !important;
    flex-direction: column !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* ① LA SPIDERCHART DIVENTA LA PROTAGONISTA (Subito sotto l'intro) */
  .spider-wrap {
    order: 1 !important; /* La forziamo in cima al flusso della main-area */
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1 / 1; /* Mantiene il grafico perfettamente quadrato */
    padding: 16px !important;
    box-sizing: border-box !important;
  }

  .spider-svg {
    max-height: 380px !important; /* Gli impediamo di allargarsi troppo sui tablet */
    margin: 0 auto;
  }

  /* Spostiamo il tooltip nero in modo che non si sovrapponga */
  .tooltip {
    bottom: 0px !important;
  }

  /* ② IL PANNELLO DESTRO CON IL PARAGRAFO E IL COSTRUTTO DEI DELTA */
  .right-panel {
    order: 2 !important; /* Scende sotto la spiderchart */
    width: 100% !important;
    border-left: none !important; /* Rimuove il bordo verticale del desktop */
    border-top: 1.5px solid #000; /* Aggiunge una divisione orizzontale pulita */
    overflow-y: visible !important;
    height: auto !important;
    padding-bottom: 40px; /* Spazio di respiro finale per lo scroll */
  }

  /* Il blocco col grande Delta numerico live (es: Δt= +0.45s) */
  .delta-num {
    padding: 20px 16px 12px !important;
    font-size: 28px !important;
  }

  /* Il paragrafo descrittivo che volevi subito sotto il grafico */
  .right-para {
    font-size: 0.72rem !important;
    padding: 16px !important;
  }

  /* La tabellina dei breakdown finali (Athlete, Equipment, ecc.) */
  .breakdown-mini {
    margin: 0 16px !important;
  }
  
  .bk-row {
    padding: 8px 12px !important; /* Leggermente più alti per l'interazione touch su mobile */
    font-size: 0.7rem !important;
  }
}
</style>