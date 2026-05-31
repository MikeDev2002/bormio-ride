import { useState, useEffect, useRef, useMemo } from 'react'
import { CLIMBS, difficultyLabel } from '../climbs.js'
import { sliceElevPoints } from '../utils/gpxParser.js'

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

function calcSegs(points, segSize) {
  if (!points || points.length < 2) return []
  const totalKm = points[points.length - 1].dist
  const n = Math.floor(totalKm / segSize)
  return Array.from({ length: n }, (_, i) => {
    const s0 = i * segSize, s1 = (i + 1) * segSize
    const p0 = points.reduce((b, p) => Math.abs(p.dist - s0) < Math.abs(b.dist - s0) ? p : b)
    const p1 = points.reduce((b, p) => Math.abs(p.dist - s1) < Math.abs(b.dist - s1) ? p : b)
    const dEle  = p1.ele - p0.ele
    const dDist = (p1.dist - p0.dist) * 1000
    const g = dDist > 20 ? Math.round((dEle / dDist) * 100 * 10) / 10 : 0
    return { endKm: s1, endEle: p1.ele, gradient: Math.max(0, g) }
  })
}

const CHART_H  = 210   // px — height of the bar area
const Y_AXIS_W = 50    // px — right padding for y-axis labels

function ClimbChart({ points, climb }) {
  const wrapRef  = useRef(null)
  const [ctnrW, setCtnrW] = useState(320)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    setCtnrW(el.offsetWidth)
    const ro = new ResizeObserver(() => setCtnrW(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const segSize = climb.lengthKm <= 15 ? 0.5 : 1
  const segs    = useMemo(() => calcSegs(points, segSize), [points, segSize])

  if (!points || points.length === 0 || segs.length === 0) {
    return (
      <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.85rem', background: '#f8f8f8', borderRadius: 10 }}>
        Assign this route to a day to unlock the profile
      </div>
    )
  }

  // Use actual GPX elevations — baseline = first point in slice, not hardcoded
  const baseline = Math.min(...segs.map(s => s.endEle)) - 20
  const maxEle   = Math.max(...segs.map(s => s.endEle))
  const domain   = (maxEle - baseline) * 1.12   // headroom above peak
  const totalKm  = segs[segs.length - 1].endKm

  // CSS height % for a bar
  const toHeightPct = ele => Math.max(0, ((ele - baseline) / domain) * 100)

  // Y-axis ticks (absolute elevation)
  const tickStep = (maxEle - baseline) > 1200 ? 400 : (maxEle - baseline) > 600 ? 200 : 100
  const yTicks = []
  for (let e = Math.ceil(baseline / tickStep) * tickStep; e <= maxEle + tickStep; e += tickStep) {
    yTicks.push(e)
  }

  const barAreaW = ctnrW - Y_AXIS_W

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>

      {/* ── Bars (CSS divs — flexbox centering is bulletproof) ── */}
      <div style={{
        height: CHART_H,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1.5,
        paddingRight: Y_AXIS_W,
        position: 'relative',
        zIndex: 1,
      }}>
        {segs.map((seg, i) => {
          const hPct     = toHeightPct(seg.endEle)
          const barPxH   = (hPct / 100) * CHART_H
          const showText = barPxH > 22

          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${hPct}%`,
                background: gradColor(seg.gradient),
                borderRadius: '2px 2px 0 0',
                display: 'flex',
                alignItems: 'center',      // vertical centre (CSS)
                justifyContent: 'center',  // horizontal centre (CSS)
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {showText && seg.gradient > 0 && (
                <span style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: 'white',
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  userSelect: 'none',
                }}>
                  {Math.round(seg.gradient)}%
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── SVG overlay: profile line + y-axis + x-axis ── */}
      <svg
        width={ctnrW}
        height={CHART_H + 22}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        {/* Horizontal grid lines */}
        {yTicks.map(e => {
          const pct = (e - baseline) / domain
          const y   = CHART_H - Math.max(0, Math.min(1, pct)) * CHART_H
          if (y < 0 || y > CHART_H) return null
          return <line key={e} x1={0} y1={y} x2={barAreaW} y2={y} stroke="#ebebeb" strokeWidth={1} />
        })}

        {/* Smooth profile line */}
        <polyline
          points={points
            .filter(p => p.dist >= 0 && p.dist <= totalKm + 0.3)
            .map(p => {
              const x   = (p.dist / totalKm) * barAreaW
              const pct = Math.max(0, (p.ele - baseline) / domain)
              const y   = CHART_H - Math.min(1, pct) * CHART_H
              return `${x},${y}`
            })
            .join(' ')}
          fill="none"
          stroke="#111"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Y-axis labels — right of bars */}
        {yTicks.map(e => {
          const pct = (e - baseline) / domain
          const y   = CHART_H - Math.max(0, Math.min(1, pct)) * CHART_H
          if (y < 0 || y > CHART_H + 4) return null
          return (
            <text key={e} x={barAreaW + 4} y={y + 4} fontSize={10} fill="#999" fontWeight="600">
              {e}m
            </text>
          )
        })}

        {/* X-axis: one label centred under every bar */}
        {(() => {
          const gap      = 1.5
          const n        = segs.length
          const barW     = (barAreaW - (n - 1) * gap) / n
          return segs.map((seg, i) => {
            const cx = i * (barW + gap) + barW / 2
            const label = segSize < 1
              ? (Number.isInteger(seg.endKm) ? `${seg.endKm}` : `${seg.endKm}`)
              : `${seg.endKm}`
            return (
              <text
                key={i}
                x={cx}
                y={CHART_H + 16}
                textAnchor="middle"
                fontSize={barW >= 14 ? 10 : 8}
                fill="#aaa"
                fontWeight="600"
              >
                {label}
              </text>
            )
          })
        })()}
      </svg>
    </div>
  )
}

function ClimbModal({ climb, elevPoints, onClose }) {
  const diff     = difficultyLabel(climb.elevationGain, climb.avgGradient)
  const climbPts = useMemo(
    () => sliceElevPoints(elevPoints, climb.startKm, climb.endKm),
    [elevPoints, climb]
  )

  return (
    <div className="climb-overlay" onClick={onClose}>
      <div className="climb-modal" onClick={e => e.stopPropagation()}>

        <div className="climb-modal-header">
          <div>
            <div className="climb-modal-name">{climb.name}</div>
            <div className="climb-modal-subtitle">{climb.subtitle}</div>
          </div>
          <button className="climb-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="climb-modal-badge" style={{ background: diff.color }}>{diff.label}</div>

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

        <div style={{ margin: '16px 0 12px' }}>
          <ClimbChart points={climbPts} climb={climb} />
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
