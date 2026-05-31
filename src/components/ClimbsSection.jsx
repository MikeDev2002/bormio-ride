import { useState, useEffect, useRef, useMemo } from 'react'
import { CLIMBS, difficultyLabel } from '../climbs.js'
import { sliceElevPoints } from '../utils/gpxParser.js'

// Warm orange → deep maroon scale matching climbfinder
function gradColor(pct) {
  if (pct <= 2)  return '#FDBA74'
  if (pct <= 4)  return '#F97316'
  if (pct <= 6)  return '#EA580C'
  if (pct <= 8)  return '#DC2626'
  if (pct <= 10) return '#B91C1C'
  if (pct <= 13) return '#991B1B'
  if (pct <= 16) return '#7F1D1D'
  return '#450A0A'
}

function calcSegments(points, segSize) {
  if (!points || points.length < 2) return []
  const totalKm = points[points.length - 1].dist
  const n = Math.floor(totalKm / segSize)
  const out = []
  for (let i = 0; i < n; i++) {
    const s0 = i * segSize
    const s1 = (i + 1) * segSize
    const p0 = points.reduce((b, p) => Math.abs(p.dist - s0) < Math.abs(b.dist - s0) ? p : b)
    const p1 = points.reduce((b, p) => Math.abs(p.dist - s1) < Math.abs(b.dist - s1) ? p : b)
    const dEle  = p1.ele - p0.ele
    const dDist = (p1.dist - p0.dist) * 1000
    const g = dDist > 20 ? Math.round((dEle / dDist) * 100 * 10) / 10 : 0
    out.push({ endKm: s1, endEle: p1.ele, gradient: Math.max(0, g) })
  }
  return out
}

const PAD_TOP = 20
const PAD_BOT = 26
const Y_W     = 50   // right-side Y axis label area

function ClimbChart({ points, climb }) {
  const wrapRef = useRef(null)
  const [svgW, setSvgW] = useState(320)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(e => setSvgW(e[0].contentRect.width))
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const svgH   = 280
  const chartW = svgW - Y_W
  const chartH = svgH - PAD_TOP - PAD_BOT

  // Use 0.5km segments for short climbs, 1km for long
  const segSize = climb.lengthKm <= 15 ? 0.5 : 1
  const segs    = useMemo(() => calcSegments(points, segSize), [points, segSize])

  const minEle = climb.startElevation - 30
  const maxEle = climb.summitElevation + 80
  const eRange = maxEle - minEle
  const totalKm = segs.length > 0 ? segs[segs.length - 1].endKm : climb.lengthKm

  const eToY = e => PAD_TOP + chartH - Math.max(0, Math.min(chartH, (e - minEle) / eRange * chartH))
  const kToX = k => (k / totalKm) * chartW
  const barW  = chartW / (segs.length || 1)
  const showPct = barW >= 13

  // Horizontal grid lines every 200m
  const yTicks = []
  for (let e = Math.ceil(minEle / 200) * 200; e <= maxEle; e += 200) yTicks.push(e)

  // X axis labels
  const xStep = totalKm <= 12 ? 1 : totalKm <= 22 ? 2 : 5
  const xTicks = []
  for (let k = xStep; k < totalKm + xStep * 0.5; k += xStep) xTicks.push(Math.round(k * 10) / 10)

  if (!points || points.length === 0) {
    return (
      <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.85rem', background: '#f5f5f5', borderRadius: 10 }}>
        Assign this route to a day to unlock the profile
      </div>
    )
  }

  return (
    <div ref={wrapRef} style={{ width: '100%', overflow: 'hidden' }}>
      <svg width={svgW} height={svgH} style={{ display: 'block', overflow: 'visible' }}>

        {/* Grid lines */}
        {yTicks.map(e => {
          const y = eToY(e)
          if (y < PAD_TOP - 2 || y > PAD_TOP + chartH + 2) return null
          return <line key={e} x1={0} y1={y} x2={chartW} y2={y} stroke="#e5e5e5" strokeWidth={1} />
        })}

        {/* Gradient bars — fill from chart floor to elevation */}
        {segs.map((seg, i) => {
          const x  = i * barW
          const y  = eToY(seg.endEle)
          const bh = (PAD_TOP + chartH) - y
          if (bh <= 0) return null
          const cx = x + barW / 2
          const ty = y + bh * 0.42
          return (
            <g key={i}>
              <rect x={x} y={y} width={Math.max(0, barW - 1.5)} height={bh} fill={gradColor(seg.gradient)} rx={1} />
              {showPct && seg.gradient > 0 && (
                <text
                  x={cx} y={ty}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="white"
                  fontSize={barW >= 24 ? 13 : barW >= 18 ? 11 : 9}
                  fontWeight="900"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {seg.gradient}%
                </text>
              )}
            </g>
          )
        })}

        {/* Smooth black elevation profile line */}
        <polyline
          points={points.map(p => `${kToX(p.dist)},${eToY(p.ele)}`).join(' ')}
          fill="none"
          stroke="#111"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Y axis labels — right side */}
        {yTicks.map(e => {
          const y = eToY(e)
          if (y < PAD_TOP - 2 || y > PAD_TOP + chartH + 2) return null
          return (
            <text key={e} x={chartW + 6} y={y + 4} fontSize={10} fill="#999" fontWeight="600">
              {e}m
            </text>
          )
        })}

        {/* Start elevation label — bottom left */}
        <text x={3} y={PAD_TOP + chartH + 16} fontSize={10} fill="#777" fontWeight="700">
          {climb.startElevation}m
        </text>

        {/* X axis km labels */}
        {xTicks.map(km => {
          const x = kToX(km)
          if (x > chartW + 2) return null
          return (
            <text key={km} x={x} y={PAD_TOP + chartH + 16} textAnchor="middle" fontSize={10} fill="#aaa" fontWeight="600">
              {km}km
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function ClimbModal({ climb, elevPoints, onClose }) {
  const diff      = difficultyLabel(climb.elevationGain, climb.avgGradient)
  const climbPts  = useMemo(
    () => sliceElevPoints(elevPoints, climb.startKm, climb.endKm),
    [elevPoints, climb]
  )

  return (
    <div className="climb-overlay" onClick={onClose}>
      <div className="climb-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="climb-modal-header">
          <div>
            <div className="climb-modal-name">{climb.name}</div>
            <div className="climb-modal-subtitle">{climb.subtitle}</div>
          </div>
          <button className="climb-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Difficulty badge */}
        <div className="climb-modal-badge" style={{ background: diff.color }}>{diff.label}</div>

        {/* Stats */}
        <div className="climb-modal-stats">
          {[
            { v: `${climb.lengthKm} km`,                     l: 'Length' },
            { v: `${climb.elevationGain.toLocaleString()} m`, l: 'Gain'   },
            { v: `${climb.avgGradient}%`,                     l: 'Avg'    },
            { v: `${climb.maxGradient}%`,                     l: 'Max'    },
          ].map(({ v, l }) => (
            <div key={l} className="climb-modal-stat">
              <div className="climb-modal-stat-value">{v}</div>
              <div className="climb-modal-stat-label">{l}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ margin: '12px 0 8px' }}>
          <ClimbChart points={climbPts} climb={climb} />
        </div>

        {/* Gradient legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', marginBottom: 14 }}>
          {[
            { l: '< 4%', c: '#F97316' },
            { l: '4–6%', c: '#EA580C' },
            { l: '6–8%', c: '#DC2626' },
            { l: '8–10%', c: '#B91C1C' },
            { l: '> 10%', c: '#7F1D1D' },
          ].map(({ l, c }) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
              <span style={{ fontSize: '0.62rem', color: '#888', fontWeight: 600 }}>{l}</span>
            </div>
          ))}
        </div>

        <p className="climb-description">{climb.description}</p>
      </div>
    </div>
  )
}

export default function ClimbsSection({ routeKey, elevPoints }) {
  const [selected, setSelected] = useState(null)
  const climbs = CLIMBS[routeKey]
  if (!climbs || climbs.length === 0) return null

  return (
    <div className="climbs-section">
      <div className="section-label" style={{ paddingTop: 4 }}>Key Climbs</div>
      <div className="climbs-scroll">
        {climbs.map(climb => {
          const diff = difficultyLabel(climb.elevationGain, climb.avgGradient)
          return (
            <div key={climb.id} className="climb-card" onClick={() => setSelected(climb)}>
              <div className="climb-card-badge" style={{ background: diff.color }}>{diff.label}</div>
              <div className="climb-card-name">{climb.name}</div>
              <div className="climb-card-subtitle">{climb.subtitle}</div>
              <div className="climb-card-stats">
                <span>📏 {climb.lengthKm} km</span>
                <span>⛰️ {climb.elevationGain.toLocaleString()} m</span>
                <span>📐 avg {climb.avgGradient}%  max {climb.maxGradient}%</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 8 }}>
                Summit {climb.summitElevation.toLocaleString()} m · tap for profile →
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <ClimbModal
          climb={selected}
          elevPoints={elevPoints || []}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
