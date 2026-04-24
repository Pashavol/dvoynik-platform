// BudgetPage.jsx — project budget breakdown

const BUDGET_TOTAL = 24800;

const SUMMARY = [
  { label: 'Контракт',    value: '24 800',  unit: 'млн ₽', sub: '100%',         kind: 'neutral' },
  { label: 'Освоено',     value: '16 616',  unit: 'млн ₽', sub: '67% от плана', kind: 'ok'      },
  { label: 'Остаток',     value: '8 184',   unit: 'млн ₽', sub: '33% бюджета',  kind: 'neutral' },
  { label: 'Прогноз ЗПЗ', value: '25 640', unit: 'млн ₽', sub: '+840 млн ₽ к плану', kind: 'warn' },
];

const LINES = [
  { discipline: 'Строительно-монтажные работы', code: 'СМР',   budget: 11200, spent: 7504, committed: 2100 },
  { discipline: 'Оборудование и материалы',      code: 'ОиМ',   budget:  7400, spent: 5920, committed:  480 },
  { discipline: 'Проектирование',                code: 'ПИР',   budget:  2800, spent: 2660, committed:   80 },
  { discipline: 'Пуско-наладочные работы',       code: 'ПНР',   budget:  1600, spent:  480, committed:  320 },
  { discipline: 'Управление проектом',           code: 'УП',    budget:   992, spent:  664, committed:   96 },
  { discipline: 'Резерв',                        code: 'RES',   budget:   808, spent:    0, committed:    0 },
];

const fmt = (n) => n.toLocaleString('ru-RU');

const BudgetPage = () => {
  const totalSpent     = LINES.reduce((s, l) => s + l.spent, 0);
  const totalCommitted = LINES.reduce((s, l) => s + l.committed, 0);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Бюджет проекта</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>Актуально на 24.04.2026</div>
        </div>
        <Button variant="outline" size="sm"><Icon name="download" size={14} />Экспорт</Button>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {SUMMARY.map(s => (
          <div key={s.label} style={{ padding: '16px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24 }}>{s.value}</span>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{s.unit}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <Badge variant={s.kind === 'ok' ? 'ok' : s.kind === 'warn' ? 'warn' : 'default'}>
                {s.kind === 'ok' && <StatusDot kind="ok" />}
                {s.kind === 'warn' && <StatusDot kind="warn" />}
                {s.sub}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div style={{ padding: '16px 20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>Общее освоение бюджета</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)' }}>{fmt(totalSpent)} / {fmt(BUDGET_TOTAL)} млн ₽</span>
        </div>
        <div style={{ height: 10, background: 'var(--muted)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
          {/* committed */}
          <div style={{
            position: 'absolute', left: (totalSpent / BUDGET_TOTAL * 100) + '%',
            width: (totalCommitted / BUDGET_TOTAL * 100) + '%',
            height: '100%', background: 'color-mix(in oklch, var(--primary) 35%, transparent)',
          }} />
          {/* spent */}
          <div style={{
            position: 'absolute', left: 0,
            width: (totalSpent / BUDGET_TOTAL * 100) + '%',
            height: '100%', background: 'var(--primary)', borderRadius: 5,
            transition: 'width .4s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--muted-foreground)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--primary)', display: 'inline-block' }} />
            Освоено {(totalSpent / BUDGET_TOTAL * 100).toFixed(1)}%
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'color-mix(in oklch, var(--primary) 35%, transparent)', display: 'inline-block' }} />
            Законтрактовано {(totalCommitted / BUDGET_TOTAL * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Breakdown table */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ background: 'var(--muted)', position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              {['Статья', 'Бюджет, млн ₽', 'Освоено, млн ₽', 'Законтрактовано', 'Остаток', 'Выполнение', 'Статус'].map((h, i) => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: i >= 1 && i <= 4 ? 'right' : 'left',
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  color: 'var(--muted-foreground)', borderBottom: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LINES.map((l, i) => {
              const pct      = l.budget > 0 ? l.spent / l.budget : 0;
              const remaining = l.budget - l.spent - l.committed;
              const overrun  = pct > 0.95 && l.code !== 'RES';
              const status   = l.code === 'RES' ? 'inactive' : overrun ? 'warn' : 'ok';

              return (
                <tr key={l.code}
                  style={{ borderBottom: i < LINES.length - 1 ? '1px solid var(--border)' : 'none', background: 'var(--card)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500 }}>{l.discipline}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{l.code}</div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{fmt(l.budget)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{fmt(l.spent)}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--muted-foreground)' }}>{l.committed > 0 ? fmt(l.committed) : '—'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: remaining < 0 ? 'var(--status-crit)' : 'var(--muted-foreground)' }}>
                    {l.code === 'RES' ? fmt(l.budget) : fmt(remaining)}
                  </td>
                  <td style={{ padding: '14px 16px', minWidth: 140 }}>
                    {l.code !== 'RES' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'var(--muted)', borderRadius: 2 }}>
                          <div style={{
                            height: '100%', borderRadius: 2,
                            width: Math.min(pct * 100, 100) + '%',
                            background: overrun ? 'var(--status-warn)' : 'var(--primary)',
                            transition: 'width .3s',
                          }} />
                        </div>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', flexShrink: 0 }}>
                          {(pct * 100).toFixed(0)}%
                        </span>
                      </div>
                    ) : <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Badge variant={status} uppercase>
                      <StatusDot kind={status} />
                      {status === 'ok' ? 'В норме' : status === 'warn' ? 'Внимание' : 'Резерв'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer totals */}
          <tfoot>
            <tr style={{ background: 'var(--muted)', borderTop: '2px solid var(--border)' }}>
              <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13 }}>Итого</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmt(BUDGET_TOTAL)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmt(totalSpent)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmt(totalCommitted)}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{fmt(BUDGET_TOTAL - totalSpent - totalCommitted)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

window.BudgetPage = BudgetPage;
