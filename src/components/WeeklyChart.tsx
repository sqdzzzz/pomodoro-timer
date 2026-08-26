import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useTranslation } from '@/hooks/useTranslation'
import { getLast7Days, getWeekdayLabel } from '@/utils/date'

export function WeeklyChart() {
  const { records, language } = usePomodoroStore((state) => ({
    records: state.records,
    language: state.language,
  }))
  const t = useTranslation()

  const days = getLast7Days()
  const data = days.map((date) => ({
    date,
    label: getWeekdayLabel(date, language),
    count: records.find((r) => r.date === date)?.count ?? 0,
  }))

  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="glass rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{t.chart.last7Days}</h3>
        <span className="text-xs text-[var(--text-muted)]">{t.chart.pomodoros}</span>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              allowDecimals={false}
              domain={[0, Math.max(1, Math.ceil(maxCount * 1.2))]}
            />
            <Tooltip
              cursor={{ fill: 'var(--bg-secondary)', radius: 8 }}
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
              }}
              labelStyle={{ color: 'var(--text-secondary)' }}
              itemStyle={{ color: 'var(--accent)' }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.count > 0 ? 'url(#barGradient)' : 'var(--border-color)'}
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff8787" />
                <stop offset="100%" stopColor="#ff6b6b" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
