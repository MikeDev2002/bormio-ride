import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 8, padding: '6px 10px', fontSize: '0.8rem' }}>
      <div style={{ fontWeight: 700 }}>{payload[0].value} m</div>
      <div style={{ color: '#888' }}>{payload[0].payload.dist} km</div>
    </div>
  )
}

export default function ElevationProfile({ elevPoints }) {
  const minEle = Math.min(...elevPoints.map(p => p.ele))
  const yMin = Math.max(0, minEle - 100)

  return (
    <div className="elev-card" style={{ background: 'white', paddingBottom: 8 }}>
      <div className="elev-title">Elevation Profile</div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={elevPoints} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#009246" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#009246" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="dist"
            tick={{ fontSize: 10, fill: '#aaa' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}km`}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, 'auto']}
            tick={{ fontSize: 10, fill: '#aaa' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}m`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="ele"
            stroke="#009246"
            strokeWidth={2}
            fill="url(#elevGrad)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
