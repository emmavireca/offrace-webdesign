<script>
  import { config } from '$lib/config.svelte.js'
  import { onMount } from 'svelte'
  import { calcola } from '$lib/algoritmo.js'
  import { slide } from 'svelte/transition'

  config.fase = 4

  const r = calcola(config)
  const { dtTotale, dtAtleta, dtEquip, dnfRate, scenario, spider } = r

  // ─── LOADING SCREEN ───────────────────────────────────────────────────
  const videoSrc = scenario === 'DNF' ? '/videos/result_died.webm' : '/videos/result_alpha.webm'
  let videoFinito = $state(false)
  let videoEl = $state(null)

  const playbackRate = Math.max(0.25, Math.min(3.0, Math.pow(2, -dtTotale * 1.2)))

  $effect(() => {
    if (!videoEl) return

    const applyRate = () => {
      videoEl.playbackRate = playbackRate
    }

    if (videoEl.readyState >= 1) applyRate()
    else videoEl.addEventListener('loadedmetadata', applyRate, { once: true })
  })

  $effect(() => {
    const barra = document.querySelector('.barra')
    if (barra) barra.classList.toggle('nascosta', !videoFinito)
  })

  // ─── COLORI ───────────────────────────────────────────────────────────
  const accent = scenario === 'DNF' ? '#000000' : '#BDF522'

  const verdicts = {
    CLEAN: 'VALID RUN',
    DNF: 'YOU DIED',
    BANNED: 'DISQUALIFIED',
    'RESOURCE GAP': 'RESOURCE GAP',
  }

  const verdict = verdicts[scenario]

  const sign = dtTotale <= 0 ? '' : '+'
  const dtFormatted = `Δt= ${sign}${dtTotale.toFixed(2)}s`
  const dtFormattedFull = `${sign}${dtTotale.toFixed(2)}s`

  const introText = {
    CLEAN:
      'The simulation translates your choices into a measurable race profile. The data shows how environment, athlete and equipment have shaped the final descent: where time was gained, where stability was compromised, and how close the configuration sits to the regulatory and resource limits of the sport. This run remains within FIS compliance parameters across all three axes.',

    DNF:
      'The simulation translates your choices into a measurable race profile. In this configuration, the data shows a physical setup pushed beyond a sustainable threshold: force output, trajectory control and accumulated risk combine into a descent that cannot be completed at elite level. The race ends before the finish line.',

    BANNED:
      'The simulation translates your choices into a measurable race profile. In this configuration, the data exposes a breach in the equipment system: the selected wax protocol falls outside current FIS regulations. Fluorocarbon wax has been banned since the 2022/23 season, making this run invalid at the gate.',

    'RESOURCE GAP':
      'The simulation translates your choices into a measurable race profile. The data shows a legal configuration built around materials, tuning and wax protocols that require exceptional technical infrastructure. The run remains within FIS compliance parameters, while revealing a level of resource access that most national programs cannot reproduce.',
  }

  // ─── SPIDER CHART ─────────────────────────────────────────────────────
  const spiderParams = [
    {
      key: 'SPEED\nPOTENTIAL',
      value: spider.speedPotential,
      desc: 'How much gravitational and mechanical force your configuration can convert into straight-line acceleration.',
      from: 'Body mass + ski geometry',
    },
    {
      key: 'TECHNICAL\nCONTROL',
      value: spider.technicalControl,
      desc: 'Your capacity to maintain the optimal racing line through technical sections without accumulating trajectory error.',
      from: 'Trajectory deviation + RFD',
    },
    {
      key: 'EQUIPMENT\nCOMPLIANCE',
      value: spider.equipmentCompliance,
      desc: 'How far your equipment sits from the regulatory boundary. Legal does not mean central.',
      from: 'Wax protocol + ski geometry',
    },
    {
      key: 'DNF RISK',
      value: spider.dnfRisk,
      desc: 'The probability that this configuration does not cross the finish line.',
      from: 'Trajectory deviation + RFD combined',
    },
    {
      key: 'EDGE GRIP',
      value: spider.edgeGrip,
      desc: "The ski's ability to hold a clean edge on hard, icy snow under lateral load.",
      from: 'Ski material + radius',
    },
    {
      key: 'RESOURCE\nACCESS',
      value: spider.resourceAccess,
      desc: 'Where your configuration sits in the economic ecosystem of competitive skiing. Not a performance metric — a structural one.',
      from: 'Ski material + wax protocol',
    },
  ]

  const N = spiderParams.length
  const CX = 250
  const CY = 250
  const R = 160

  function polarPt(i, r) {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2
    return {
      x: CX + r * Math.cos(a),
      y: CY + r * Math.sin(a),
    }
  }

  function polyPoints(values) {
    return values
      .map((v, i) => {
        const p = polarPt(i, v * R)
        return `${p.x},${p.y}`
      })
      .join(' ')
  }

  const levels = [0.25, 0.5, 0.75, 1]
  const labelPts = spiderParams.map((p, i) => ({ ...p, ...polarPt(i, R + 36) }))
  const dataPoly = polyPoints(spiderParams.map((p) => p.value))

  function anchor(x) {
    if (x < CX - 10) return 'end'
    if (x > CX + 10) return 'start'
    return 'middle'
  }

  let mounted = $state(false)
  let hoveredParam = $state(null)
  let dnfOpen = $state(false)

  onMount(() => {
    setTimeout(() => {
      mounted = true
    }, 100)
  })
</script>

{#if !videoFinito}
  <!-- ── LOADING SCREEN ── -->
  <div class="loading-screen" class:you-died={scenario === 'DNF'}>
    <video
      bind:this={videoEl}
      src={videoSrc}
      autoplay
      muted
      playsinline
      onended={() => (videoFinito = true)}
      class="loading-video"
    ></video>

    <div class="loading-overlay">
      <span class="loading-label">Loading...</span>

      <div class="loading-bar-outer">
        <div
          class="loading-bar-inner"
          style="animation-duration: {(2 / playbackRate).toFixed(1)}s"
        ></div>
      </div>
    </div>
  </div>
{:else}
  <!-- ── RESULT PAGE ── -->
  <div
    class="page"
    style="
      --accent: {accent};
      --accent-text: {scenario === 'DNF' ? '#ffffff' : '#BDF522'};
      --banner-text: {scenario === 'DNF' ? '#ffffff' : '#000000'};
    "
  >
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
      <div class="left-panel">
        <div class="left-title">About</div>

        <p class="left-para">
          This project was created by Emma Sodini, Rebecca di Taranto, Arianna Martorelli, Emma Vireca, Alessandro Polistena and Greta Francesca Pelusi as part of the Web and Digital Design course at Politecnico di Milano, academic year 2025/2026.
        </p>

        <p class="left-para">
          The research began from a brief centred on the theme of performance, contextualised within the Milano Cortina 2026 Winter Olympics. Starting from that prompt, the group developed a critical framework that examines alpine skiing not as a neutral athletic contest, but as a system shaped by equipment, biomechanics, regulation, and resource access.
        </p>
      </div>

      <div class="spider-wrap">
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" class="spider-svg">
          {#each levels as lvl}
            <polygon
              points={polyPoints(Array(N).fill(lvl))}
              fill="none"
              stroke="#000"
              stroke-width="0.5"
              opacity="0.15"
            />
          {/each}

          {#each spiderParams as _, i}
            {@const a = polarPt(i, 0)}
            {@const b = polarPt(i, R)}
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#000"
              stroke-width="0.5"
              opacity="0.2"
            />
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
              cx={pt.x}
              cy={pt.y}
              r={hoveredParam === i ? 7 : 5}
              fill={accent}
              stroke="white"
              stroke-width="1.5"
              style="transition: r 0.15s ease; cursor: pointer;"
              role="img"
              aria-label={spiderParams[i].key.replace('\n', ' ')}
              onmouseenter={() => (hoveredParam = i)}
              onmouseleave={() => (hoveredParam = null)}
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
              >
                {line}
              </text>
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

        <p class="right-para">
          This value measures the time difference generated by your configuration against a reference descent. Each choice contributes to the final result: the athlete defines force and control, the equipment mediates contact with the snow, and the selected environment determines how those variables are expressed on the track.
        </p>

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

          <button class="bk-row dnf-toggle" onclick={() => (dnfOpen = !dnfOpen)}>
            <span>{scenario === 'DNF' ? 'YOU DIED' : 'DNF risk'}</span>

            <span class="dnf-right">
              <span class="mono" class:danger={dnfRate > 0.25}>
                {(dnfRate * 100).toFixed(1)}%
              </span>
              <span class="dnf-arrow" class:open={dnfOpen}>⌄</span>
            </span>
          </button>

          {#if dnfOpen}
            <div class="dnf-dropdown" transition:slide>
              <p>
                DNF rate estimates the probability of not finishing the race. It rises when force output, trajectory deviation and track difficulty combine beyond a stable threshold. On steeper or more technical courses, even small errors can accumulate quickly, turning speed into loss of control.
              </p>
            </div>
          {/if}
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


  .loading-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .loading-overlay {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    0% {
      width: 0%;
    }

    70% {
      width: 80%;
    }

    90% {
      width: 95%;
    }

    100% {
      width: 100%;
    }
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
    from {
      transform: translateX(0);
    }

    to {
      transform: translateX(-25%);
    }
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
    margin: 0;
  }

  .main-area {
    display: grid;
    grid-template-columns: 260px 1fr 260px;
    overflow: hidden;
    min-height: 0;
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    width: 260px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: none;
    border-right: 1.5px solid #000;
  }

  .left-panel::-webkit-scrollbar {
    display: none;
  }

  .left-title {
    font-size: clamp(22px, 2.5vw, 36px);
    font-weight: 700;
    font-family: 'Geist Mono', monospace;
    letter-spacing: -0.02em;
    line-height: 1.1;
    padding: 16px 16px 12px;
    border-bottom: 1.5px solid #000;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .left-para {
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    line-height: 1.6;
    color: #444;
    padding: 12px 16px;
    margin: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* ── SPIDER ── */
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

  /* ── RIGHT PANEL ── */
  .right-panel {
    width: 260px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-width: none;
    border-left: 1.5px solid #000;
  }

  .right-panel::-webkit-scrollbar {
    display: none;
  }

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
    margin: 0;
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
    align-items: center;
    gap: 12px;
    padding: 5px 10px;
    font-size: 0.62rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .bk-row.total {
    background: #000;
    color: #fff;
    font-weight: 700;
  }

  .bk-row.total .mono {
    color: var(--accent-text);
  }

  .mono {
    font-family: 'Geist Mono', monospace;
  }

  .danger {
    color: #FF3B30;
    font-weight: 700;
  }

  .dnf-toggle {
    width: 100%;
    background: transparent;
    color: inherit;
    border-left: none;
    border-right: none;
    border-top: none;
    font-family: inherit;
    cursor: pointer;
  }

  .dnf-toggle:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .dnf-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .dnf-arrow {
    font-family: 'Geist Mono', monospace;
    font-size: 0.75rem;
    line-height: 1;
    transition: transform 0.2s ease;
  }

  .dnf-arrow.open {
    transform: rotate(180deg);
  }

  .dnf-dropdown {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 10px;
    box-sizing: border-box;
  }

  .dnf-dropdown p {
    font-family: 'Geist Mono', monospace;
    font-size: 0.62rem;
    line-height: 1.6;
    color: #444;
    margin: 0;
  }
</style>