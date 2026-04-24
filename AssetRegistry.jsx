// AssetRegistry.jsx — dense telemetry table view
const ROWS = [
  { tag: 'V-1208',   type: 'Колонна разделения', discipline: 'Технология', p: '0,842', t: '342,0', status: 'warn' },
  { tag: 'E-4401',   type: 'Теплообменник',      discipline: 'Технология', p: '—',     t: '—',     status: 'inactive' },
  { tag: 'P-2340-A', type: 'Насос центробежный', discipline: 'Технология', p: '3,247', t: '187,4', status: 'ok' },
  { tag: 'P-2340-B', type: 'Насос центробежный', discipline: 'Технология', p: '3,251', t: '188,1', status: 'ok' },
];

const AssetRegistry = ({ onSelect, selected }) => {
  const rowRefs = React.useRef({});

  React.useEffect(() => {
    if (selected && rowRefs.current[selected]) {
      rowRefs.current[selected].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selected]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative', width: 280 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
            <Icon name="search" size={14} />
          </span>
          <Input placeholder="Поиск по тегу или типу…" style={{ paddingLeft: 36 }} />
        </div>
        <Button variant="outline" size="sm"><Icon name="filter" size={14} />Фильтр</Button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{ROWS.length} объекта в модели</span>
        <Button variant="outline" size="sm"><Icon name="download" size={14} />Экспорт</Button>
        <Button variant="primary" size="sm"><Icon name="plus" size={14} />Добавить</Button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--background)', zIndex: 1 }}>
            <tr>
              {['Тег', 'Тип', 'Дисциплина', 'Давление, МПа', 'Температура, °C', 'Статус', ''].map((h, i) => (
                <th key={i} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted-foreground)', textAlign: i >= 3 && i <= 4 ? 'right' : 'left', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(r => {
              const isSel = r.tag === selected;
              return (
                <tr
                  key={r.tag}
                  ref={el => { rowRefs.current[r.tag] = el; }}
                  onClick={() => onSelect(r.tag)}
                  style={{ cursor: 'pointer', background: isSel ? 'color-mix(in oklch, var(--primary) 10%, var(--background))' : 'transparent' }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isSel ? 'color-mix(in oklch, var(--primary) 10%, var(--background))' : 'transparent'; }}
                >
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', borderLeft: isSel ? '2px solid var(--primary)' : '2px solid transparent', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: isSel ? 700 : 500, color: isSel ? 'var(--primary)' : 'inherit' }}>{r.tag}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>{r.type}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', color: 'var(--muted-foreground)' }}>{r.discipline}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{r.p}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{r.t}</td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <Badge variant={r.status} uppercase>
                      <StatusDot kind={r.status} />
                      {r.status === 'ok' ? 'Активен' : r.status === 'warn' ? 'Внимание' : r.status === 'crit' ? 'Авария' : 'Офлайн'}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                    <IconBtn><Icon name="more" size={16} /></IconBtn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.AssetRegistry = AssetRegistry;
