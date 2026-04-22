// KpiStrip.jsx
const KpiCard = ({ label, value, delta, deltaKind = 'ok', unit }) => (
  <div style={{
    background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
    padding: '14px 16px', flex: 1, minWidth: 0,
  }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{value}</span>
      {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>{unit}</span>}
    </div>
    {delta && (
      <div style={{ marginTop: 4, fontSize: 12, color: deltaKind === 'ok' ? 'var(--status-ok)' : deltaKind === 'warn' ? 'oklch(0.45 0.15 70)' : 'var(--destructive)', fontVariantNumeric: 'tabular-nums' }}>
        {delta}
      </div>
    )}
  </div>
);

const KpiStrip = () => (
  <div style={{ display: 'flex', gap: 12, padding: 16, background: 'var(--muted)' }}>
    <KpiCard label="Синхронизация" value="98,4" unit="%" delta="+0,3% за неделю" deltaKind="ok" />
    <KpiCard label="Расхождения" value="14" delta="+2 новых" deltaKind="warn" />
    <KpiCard label="Датчиков онлайн" value="247 / 251" delta="4 офлайн" deltaKind="warn" />
    <KpiCard label="Готовность, LoD" value="LoD 400" delta="из 500 плановых" deltaKind="ok" />
    <KpiCard label="Ход строительства" value="67,2" unit="%" delta="по графику" deltaKind="ok" />
  </div>
);

window.KpiStrip = KpiStrip;
