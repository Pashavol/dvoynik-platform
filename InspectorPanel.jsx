// InspectorPanel.jsx — right properties panel with tabs
const { useState: useInspectorState, useEffect: useInspectorEffect } = React;

const MOCK_PROPS = {
  'V-1208': {
    name: 'Колонна разделения', type: 'Колонна', status: 'warn',
    props: [
      ['Тег', 'V-1208'],
      ['Класс', 'ГОСТ 12.2.085'],
      ['Диаметр, мм', '3 200'],
      ['Высота, м', '42,8'],
      ['Раб. давление, МПа', '0,842'],
      ['Материал', '09Г2С'],
      ['Дисциплина', 'Технология'],
      ['Подрядчик', 'СУ-17'],
    ],
    deviations: [
      { text: 'Толщина стенки −0,8 мм', date: '12.03' },
      { text: 'Смещение по оси X +45 мм', date: '08.03' },
    ],
    docs: [
      { type: 'PDF', name: 'Паспорт оборудования V-1208', date: '14.03.2026', author: 'Иванов А.В.', size: '2,4 МБ' },
      { type: 'DWG', name: 'Чертёж общего вида', date: '02.02.2026', author: 'ПКБ-3', size: '18,1 МБ' },
      { type: 'IFC', name: 'Модель BIM v1.4', date: '28.01.2026', author: 'BIM-отдел', size: '64,3 МБ' },
      { type: 'PDF', name: 'Лист HAZOP — колонна K-1', date: '15.01.2026', author: 'СУ-17', size: '0,8 МБ' },
      { type: 'PDF', name: 'Сертификат материала 09Г2С', date: '10.12.2025', author: 'ОТК', size: '1,1 МБ' },
    ],
    history: [
      { date: '12.03.2026', kind: 'warn', text: 'Расхождение зафиксировано: толщина стенки −0,8 мм', author: 'Петров Д.К.' },
      { date: '08.03.2026', kind: 'warn', text: 'Расхождение зафиксировано: смещение по оси X +45 мм', author: 'Сидоров В.П.' },
      { date: '28.02.2026', kind: 'info', text: 'Статус изменён на «Внимание»', author: 'Система' },
      { date: '15.02.2026', kind: 'ok', text: 'Документ добавлен: Паспорт оборудования', author: 'Иванов А.В.' },
      { date: '01.02.2026', kind: 'ok', text: 'Версия модели обновлена: v1.3 → v1.4', author: 'BIM-отдел' },
      { date: '14.01.2026', kind: 'ok', text: 'Объект создан, импортирован из IFC', author: 'Импорт' },
    ],
  },
  'P-2340-A': {
    name: 'Насос центробежный', type: 'Насос', status: 'ok',
    props: [
      ['Тег', 'P-2340-A'],
      ['Модель', 'НПС-200/700'],
      ['Производительность, м³/ч', '200'],
      ['Давление, МПа', '3,247'],
      ['Мощность, кВт', '75'],
      ['Температура среды, °C', '187,4'],
    ],
    deviations: [],
    docs: [
      { type: 'PDF', name: 'Паспорт насоса НПС-200/700', date: '18.02.2026', author: 'Завод-изготовитель', size: '3,2 МБ' },
      { type: 'PDF', name: 'Схема обвязки P&ID', date: '11.01.2026', author: 'ПКБ-3', size: '5,6 МБ' },
    ],
    history: [
      { date: '18.02.2026', kind: 'ok', text: 'Паспорт загружен', author: 'Иванов А.В.' },
      { date: '05.02.2026', kind: 'ok', text: 'Объект создан, импортирован из IFC', author: 'Импорт' },
    ],
  },
  'P-2340-B': {
    name: 'Насос центробежный', type: 'Насос', status: 'ok',
    props: [['Тег', 'P-2340-B'], ['Модель', 'НПС-200/700'], ['Давление, МПа', '3,251']],
    deviations: [],
    docs: [],
    history: [
      { date: '05.02.2026', kind: 'ok', text: 'Объект создан, импортирован из IFC', author: 'Импорт' },
    ],
  },
  'E-4401': {
    name: 'Теплообменник', type: 'Аппарат', status: 'crit',
    props: [
      ['Тег', 'E-4401'],
      ['Площадь теплообмена, м²', '1 240'],
      ['Тип', 'Кожухотрубный'],
      ['Рабочее давление, МПа', '2,1'],
      ['Температура среды, °C', '240'],
      ['Материал корпуса', '12Х18Н10Т'],
      ['Подрядчик', 'ПКБ-3'],
    ],
    deviations: [
      { text: 'Трещина в сварном шве', date: '23.04', kind: 'crit' },
    ],
    docs: [
      { type: 'PDF', name: 'Паспорт E-4401', date: '20.11.2025', author: 'ОТК', size: '1,8 МБ' },
    ],
    history: [
      { date: '23.04.2026', kind: 'crit', text: 'Критическое расхождение: трещина в сварном шве', author: 'Система' },
      { date: '20.11.2025', kind: 'ok',   text: 'Объект переведён в статус «Завершён»', author: 'Система' },
      { date: '01.10.2025', kind: 'ok',   text: 'Объект создан, импортирован из IFC', author: 'Импорт' },
    ],
  },
};

const TAB_STYLE = (active) => ({
  padding: '10px 14px',
  background: 'transparent', border: 'none', cursor: 'pointer',
  fontSize: 13, fontWeight: active ? 600 : 400,
  color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
  marginBottom: -1,
  transition: 'color .15s',
  whiteSpace: 'nowrap',
});

const DocBadge = ({ type }) => {
  const styles = {
    PDF: { background: 'color-mix(in oklch, var(--status-crit) 12%, transparent)', color: 'var(--status-crit)' },
    DWG: { background: 'color-mix(in oklch, var(--brand) 12%, transparent)', color: 'var(--brand)' },
    IFC: { background: 'color-mix(in oklch, var(--status-ok) 12%, transparent)', color: 'var(--status-ok)' },
  };
  const s = styles[type] || { background: 'var(--muted)', color: 'var(--muted-foreground)' };
  return (
    <span style={{ ...s, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
      {type}
    </span>
  );
};

const InspectorPanel = ({ selected, onClose }) => {
  const [tab, setTab] = useInspectorState('props');
  useInspectorEffect(() => { setTab('props'); }, [selected]);

  const data = MOCK_PROPS[selected];

  if (!data) {
    return (
      <aside style={{ width: 320, background: 'var(--card)', borderLeft: '1px solid var(--border)', padding: 24, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ color: 'var(--muted-foreground)', fontSize: 13, lineHeight: 1.5 }}>
          Выберите элемент на модели — здесь появятся его свойства, документы и история изменений.
        </div>
      </aside>
    );
  }

  const TABS = [
    { key: 'props',   label: 'Свойства' },
    { key: 'docs',    label: `Документы${data.docs.length ? ` (${data.docs.length})` : ''}` },
    { key: 'history', label: 'История' },
  ];

  return (
    <aside style={{ width: 320, background: 'var(--card)', borderLeft: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>{data.type}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginTop: 4 }}>{data.name}</div>
          <div style={{ marginTop: 8 }}>
            <Badge variant={data.status} uppercase>
              <StatusDot kind={data.status} />
              {data.status === 'ok' ? 'Активен' : data.status === 'warn' ? 'Внимание' : data.status === 'crit' ? 'Проблема' : 'Офлайн'}
            </Badge>
          </div>
        </div>
        <IconBtn onClick={onClose}><Icon name="x" size={16} /></IconBtn>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 8px' }}>
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} style={TAB_STYLE(tab === key)}>{label}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Свойства */}
        {tab === 'props' && (
          <>
            <div style={{ padding: 20 }}>
              {data.props.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted-foreground)', flexShrink: 0, marginRight: 12 }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            {data.deviations.length > 0 && (
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 10 }}>Расхождения</div>
                {data.deviations.map((d, i) => {
                  const isCrit = d.kind === 'crit';
                  return (
                    <div key={i} style={{
                      padding: 12, borderRadius: 'var(--radius)', marginBottom: 8,
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                      border: `1px solid ${isCrit ? 'color-mix(in oklch, var(--status-crit) 40%, transparent)' : 'var(--border)'}`,
                      background: isCrit ? 'color-mix(in oklch, var(--status-crit) 6%, transparent)' : 'transparent',
                    }}>
                      <div style={{ marginTop: 3, flexShrink: 0 }}><StatusDot kind={d.kind || 'warn'} size={8} /></div>
                      <div style={{ flex: 1, fontSize: 13 }}>
                        <div style={{ fontWeight: isCrit ? 600 : 400 }}>{d.text}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{d.date}.2026</div>
                      </div>
                      {isCrit && <Badge variant="crit" uppercase>Критично</Badge>}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Документы */}
        {tab === 'docs' && (
          <div style={{ padding: 16 }}>
            {data.docs.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13, padding: '40px 0', lineHeight: 1.5 }}>
                Документы не прикреплены.
              </div>
            ) : data.docs.map((doc, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                marginBottom: 8, background: 'var(--background)',
              }}>
                <DocBadge type={doc.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                    {doc.date} · {doc.author} · {doc.size}
                  </div>
                </div>
                <IconBtn style={{ width: 28, height: 28, flexShrink: 0 }}>
                  <Icon name="download" size={14} />
                </IconBtn>
              </div>
            ))}
          </div>
        )}

        {/* История */}
        {tab === 'history' && (
          <div style={{ padding: '20px 16px 20px 20px' }}>
            {data.history.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                {i < data.history.length - 1 && (
                  <div style={{ position: 'absolute', left: 6, top: 18, bottom: 0, width: 1, background: 'var(--border)' }} />
                )}
                <div style={{ flexShrink: 0, marginTop: 4, zIndex: 1 }}>
                  <StatusDot kind={h.kind} size={13} />
                </div>
                <div style={{ paddingBottom: 20, flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{h.text}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 3, fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                    <span>{h.date}</span><span>·</span><span>{h.author}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm" style={{ flex: 1 }}><Icon name="file-text" size={14} />Паспорт</Button>
        <Button variant="primary" size="sm" style={{ flex: 1 }}>Открыть карточку</Button>
      </div>
    </aside>
  );
};

window.InspectorPanel = InspectorPanel;
