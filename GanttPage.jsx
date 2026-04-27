// GanttPage.jsx — project implementation Gantt chart

const G_TOTAL = 24; // Jan 2025 – Dec 2026

const G_toIdx = (str) => {
  const [y, m] = str.split('-').map(Number);
  return (y - 2025) * 12 + (m - 1);
};

const G_barPct = (start, end) => ({
  left:  (G_toIdx(start) / G_TOTAL) * 100,
  width: ((G_toIdx(end) - G_toIdx(start) + 1) / G_TOTAL) * 100,
});

const G_TODAY_LEFT = ((G_toIdx('2026-04') + 25 / 30) / G_TOTAL) * 100;

const G_PHASES = [
  { id: 1, name: 'Проектирование',              code: 'ПИР', color: '#6366f1', start: '2025-01', end: '2025-04', progress: 100, status: 'done'    },
  { id: 2, name: 'Закупка оборудования',         code: 'ОиМ', color: '#f59e0b', start: '2025-03', end: '2025-11', progress: 100, status: 'done'    },
  { id: 3, name: 'Строительно-монтажные работы', code: 'СМР', color: '#3b82f6', start: '2025-05', end: '2026-09', progress: 67,  status: 'active'  },
  { id: 4, name: 'Пуско-наладочные работы',      code: 'ПНР', color: '#10b981', start: '2026-08', end: '2026-11', progress: 0,   status: 'pending' },
  { id: 5, name: 'Сдача объекта',                code: 'СДА', color: '#8b5cf6', start: '2026-11', end: '2026-12', progress: 0,   status: 'pending' },
];

const G_MONTHS_RU = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];

const G_MONTHS = Array.from({ length: G_TOTAL }, (_, i) => ({
  year:  2025 + Math.floor(i / 12),
  month: (i % 12) + 1,
  idx:   i,
}));

const G_STATUS = {
  done:    { label: 'Завершён',     bg: '#dcfce7', color: '#16a34a' },
  active:  { label: 'В работе',    bg: '#fef9c3', color: '#ca8a04' },
  pending: { label: 'Запланирован', bg: '#f1f5f9', color: '#64748b' },
};

const G_KPI = [
  { label: 'Всего этапов',  value: G_PHASES.length,                                   sub: 'в проекте',  color: 'var(--foreground)'      },
  { label: 'Завершено',     value: G_PHASES.filter(p => p.status === 'done').length,    sub: 'этапов',    color: '#16a34a'                 },
  { label: 'В работе',      value: G_PHASES.filter(p => p.status === 'active').length,  sub: 'этапов',    color: '#ca8a04'                 },
  { label: 'Запланировано', value: G_PHASES.filter(p => p.status === 'pending').length, sub: 'этапов',    color: 'var(--muted-foreground)' },
];

const GanttPage = () => (
  <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>График реализации</h2>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>Диаграмма Ганта · 2025 – 2026</p>
      </div>
      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--foreground)' }}>
        <Icon name="download" size={14} />Экспорт
      </button>
    </div>

    {/* KPI Strip */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
      {G_KPI.map((k, i) => (
        <div key={i} style={{ padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--card)' }}>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 6 }}>{k.label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>{k.sub}</div>
        </div>
      ))}
    </div>

    {/* Gantt Chart */}
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--card)' }}>

      {/* Column headers */}
      <div style={{ display: 'flex', background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 240, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)' }}>
          Этап
        </div>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {G_MONTHS.map((m) => (
            <div key={m.idx} style={{
              flex: 1, textAlign: 'center', padding: '10px 0',
              fontSize: 10, color: 'var(--muted-foreground)',
              borderRight: m.idx < G_TOTAL - 1 ? '1px solid var(--border)' : 'none',
              fontWeight: m.month === 1 ? 700 : 400,
            }}>
              {m.month === 1 ? m.year : G_MONTHS_RU[m.month - 1]}
            </div>
          ))}
        </div>
        <div style={{ width: 72, flexShrink: 0, borderLeft: '1px solid var(--border)', padding: '10px 8px', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textAlign: 'center' }}>%</div>
        <div style={{ width: 116, flexShrink: 0, borderLeft: '1px solid var(--border)', padding: '10px 8px', fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textAlign: 'center' }}>Статус</div>
      </div>

      {/* Phase rows */}
      {G_PHASES.map((phase, idx) => {
        const { left, width } = G_barPct(phase.start, phase.end);
        const st = G_STATUS[phase.status];
        return (
          <div key={phase.id} style={{ display: 'flex', borderBottom: idx < G_PHASES.length - 1 ? '1px solid var(--border)' : 'none', minHeight: 60 }}>

            {/* Name */}
            <div style={{ width: 240, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '0 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{phase.name}</span>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{phase.code}</span>
            </div>

            {/* Bar area */}
            <div style={{ flex: 1, position: 'relative' }}>
              {/* Month grid lines */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
                {G_MONTHS.map((m) => (
                  <div key={m.idx} style={{ flex: 1, borderRight: m.idx < G_TOTAL - 1 ? '1px solid var(--border)' : 'none', opacity: 0.45 }} />
                ))}
              </div>

              {/* Today line */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${G_TODAY_LEFT}%`, width: 2, background: '#ef4444', zIndex: 3, opacity: 0.85, borderRadius: 1 }} />

              {/* Phase bar */}
              <div style={{
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                left: `${left}%`, width: `${width}%`, height: 26,
                background: phase.color, borderRadius: 4, overflow: 'hidden', zIndex: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,.15)',
              }}>
                {/* Unfinished overlay */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${phase.progress}%`, right: 0, background: 'rgba(0,0,0,.28)' }} />
                {/* Progress label */}
                {width > 8 && phase.progress > 0 && (
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', paddingLeft: 8, fontSize: 11, fontWeight: 700, color: '#fff', zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,.35)' }}>
                    {phase.progress}%
                  </span>
                )}
              </div>
            </div>

            {/* Progress % */}
            <div style={{ width: 72, flexShrink: 0, borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: phase.progress === 100 ? '#16a34a' : phase.progress > 0 ? '#ca8a04' : 'var(--muted-foreground)' }}>
                {phase.progress}%
              </span>
            </div>

            {/* Status badge */}
            <div style={{ width: 116, flexShrink: 0, borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
              <span style={{ padding: '3px 10px', borderRadius: 99, background: st.bg, color: st.color, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {st.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Footer legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 2, background: '#ef4444', borderRadius: 1 }} />
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Сегодня · 25 апр 2026</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 10, background: '#3b82f6', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '67%', right: 0, background: 'rgba(0,0,0,.28)' }} />
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Выполнено / остаток</span>
        </div>
      </div>
    </div>
  </div>
);
