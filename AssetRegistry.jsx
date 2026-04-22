// AssetRegistry.jsx — dense telemetry table view
const ROWS = [
  { tag: 'P-2340-A', type: 'Насос центробежный', discipline: 'Технология', p: '3,247', t: '187,4', status: 'ok' },
  { tag: 'P-2340-B', type: 'Насос центробежный', discipline: 'Технология', p: '3,251', t: '188,1', status: 'ok' },
  { tag: 'V-1208',   type: 'Колонна разделения', discipline: 'Технология', p: '0,842', t: '342,0', status: 'warn' },
  { tag: 'E-4401',   type: 'Теплообменник',      discipline: 'Технология', p: '—',     t: '—',     status: 'inactive' },
  { tag: 'T-5502',   type: 'Резервуар',          discipline: 'Хранение',   p: '0,098', t: '24,5',  status: 'ok' },
  { tag: 'C-1100',   type: 'Компрессор',         discipline: 'Газовая',    p: '6,230', t: '68,9',  status: 'ok' },
  { tag: 'F-8820',   type: 'Фильтр',             discipline: 'Подготовка', p: '2,105', t: '42,0',  status: 'warn' },
  { tag: 'H-0420',   type: 'Печь',               discipline: 'Технология', p: '0,012', t: '820,0', status: 'crit' },
];

const AssetRegistry = ({ onSelect }) => (
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
      <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{ROWS.length} из 12 487 элементов</span>
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
          {ROWS.map(r => (
            <tr key={r.tag} onClick={() => onSelect(r.tag)} style={{ cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500 }}>{r.tag}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

window.AssetRegistry = AssetRegistry;
