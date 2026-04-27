// KpiStrip.jsx
const KpiCard = ({ label, value, delta, deltaKind = 'ok', unit, icon }) => {
  const deltaColor = deltaKind === 'ok' ? 'var(--status-ok)' : deltaKind === 'warn' ? 'oklch(0.55 0.15 70)' : 'var(--destructive)';
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
      padding: '16px 18px', minWidth: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--muted-foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{label}</div>
        {icon && <span style={{ color: 'var(--muted-foreground)', opacity: 0.45, display: 'flex', flexShrink: 0 }}><Icon name={icon} size={14} /></span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</span>
        {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted-foreground)' }}>{unit}</span>}
      </div>
      {delta && (
        <div style={{ marginTop: 5, fontSize: 12, color: deltaColor, fontVariantNumeric: 'tabular-nums', display: 'flex', alignItems: 'center', gap: 5 }}>
          <StatusDot kind={deltaKind} size={6} />{delta}
        </div>
      )}
    </div>
  );
};

const KpiStrip = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, padding: '12px 16px', background: 'var(--muted)', flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
    <KpiCard label="Синхронизация"    value="98,4"      unit="%" delta="+0,3% за неделю"   deltaKind="ok"   icon="refresh"        />
    <KpiCard label="Расхождения"      value="14"              delta="+2 новых"             deltaKind="warn" icon="alert-triangle"  />
    <KpiCard label="Датчиков онлайн"  value="247 / 251"       delta="4 офлайн"             deltaKind="warn" icon="activity"        />
    <KpiCard label="Готовность, LoD"  value="LoD 400"         delta="из 500 плановых"       deltaKind="ok"   icon="layers"          />
    <KpiCard label="Ход строительства" value="67,2"     unit="%" delta="по графику"         deltaKind="ok"   icon="hard-hat"        />
  </div>
);

window.KpiStrip = KpiStrip;
