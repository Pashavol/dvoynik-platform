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

const InspectorPanel = ({ selected, onClose, onOpenCard }) => {
  const [tab, setTab] = useInspectorState('props');
  const [passportOpen, setPassportOpen] = useInspectorState(false);
  useInspectorEffect(() => { setTab('props'); }, [selected]);

  const data = MOCK_PROPS[selected];

  if (!data) {
    const PROJECT = {
      name: 'ЭЛОУ-АВТ-6 · Блок 2',
      client: 'ПАО «Нефтехим-Волга»',
      phase: 'Текущая · v2.14',
      date: 'Апр 2026',
      progress: 68,
      daysLeft: 62,
      status: 'warn',
    };

    const PROJ_DEVS = [
      { tag: 'E-4401', text: 'Трещина в сварном шве',    date: '23.04', kind: 'crit' },
      { tag: 'V-1208', text: 'Толщина стенки −0,8 мм',   date: '12.03', kind: 'warn' },
      { tag: 'V-1208', text: 'Смещение по оси X +45 мм', date: '08.03', kind: 'warn' },
    ];

    const PROJ_EVENTS = [
      { date: '23.04', kind: 'crit', text: 'Зафиксирована трещина E-4401',  author: 'Система' },
      { date: '12.03', kind: 'warn', text: 'Расхождение толщины стенки V-1208', author: 'Петров Д.К.' },
      { date: '01.02', kind: 'ok',   text: 'BIM-модель обновлена: v1.3→v1.4', author: 'BIM-отдел' },
      { date: '14.01', kind: 'ok',   text: 'Импорт IFC завершён',           author: 'Импорт' },
    ];

    const TEAM = [
      { name: 'Иванов А.В.',  role: 'BIM-менеджер' },
      { name: 'Петров Д.К.',  role: 'Контроль качества' },
      { name: 'ПКБ-3',        role: 'Проектный институт' },
    ];

    const Sec = ({ label }) => (
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase',
        color: 'var(--muted-foreground)', marginBottom: 10 }}>{label}</div>
    );

    return (
      <aside style={{ width: 320, background: 'var(--card)', borderLeft: '1px solid var(--border)',
        flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* ── Project header ─────────────────────────────────────── */}
        <div style={{ padding: '18px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase',
            color: 'var(--muted-foreground)', marginBottom: 4 }}>Проект</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>{PROJECT.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>{PROJECT.client}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <Badge variant="warn" uppercase><StatusDot kind="warn" />Внимание</Badge>
            <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              {PROJECT.phase} · {PROJECT.date}
            </span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>

          {/* ── Progress ─────────────────────────────────────────── */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <Sec label="Готовность BIM-модели" />
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--foreground)' }}>
                {PROJECT.progress}%
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--muted)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${PROJECT.progress}%`, borderRadius: 3,
                background: 'var(--primary)', transition: 'width .4s ease' }}/>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              Этап 5 из 8 · Оборудование смонтировано
            </div>
          </div>

          {/* ── KPI grid ─────────────────────────────────────────── */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { val: '4',  label: 'Объекта в модели', color: 'var(--foreground)' },
              { val: '9',  label: 'Документов',        color: 'var(--foreground)' },
              { val: '3',  label: 'Отклонения',        color: 'var(--status-warn)' },
              { val: `${PROJECT.daysLeft}д`, label: 'До пуска', color: 'var(--primary)' },
            ].map(({ val, label, color }) => (
              <div key={label} style={{ padding: '10px 12px', background: 'var(--background)',
                borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── Active deviations ────────────────────────────────── */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <Sec label="Активные отклонения" />
            {PROJ_DEVS.map((d, i) => {
              const crit = d.kind === 'crit';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px',
                  borderRadius: 'var(--radius)', marginBottom: 6,
                  border: `1px solid ${crit ? 'color-mix(in oklch, var(--status-crit) 38%, transparent)' : 'var(--border)'}`,
                  background: crit ? 'color-mix(in oklch, var(--status-crit) 5%, transparent)' : 'var(--background)',
                }}>
                  <div style={{ marginTop: 3, flexShrink: 0 }}><StatusDot kind={d.kind} size={8} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: crit ? 600 : 400, lineHeight: 1.3 }}>{d.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                      {d.tag} · {d.date}.2026
                    </div>
                  </div>
                  {crit && <Badge variant="crit" uppercase style={{ flexShrink: 0 }}>Крит.</Badge>}
                </div>
              );
            })}
          </div>

          {/* ── Recent events ────────────────────────────────────── */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <Sec label="Последние события" />
            {PROJ_EVENTS.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, position: 'relative' }}>
                {i < PROJ_EVENTS.length - 1 && (
                  <div style={{ position: 'absolute', left: 5, top: 16, bottom: 0, width: 1, background: 'var(--border)' }}/>
                )}
                <div style={{ flexShrink: 0, marginTop: 3, zIndex: 1 }}><StatusDot kind={e.kind} size={11} /></div>
                <div style={{ paddingBottom: 14, flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, lineHeight: 1.4 }}>{e.text}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 2,
                    fontFamily: 'var(--font-mono)' }}>{e.date}.2026 · {e.author}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Team ─────────────────────────────────────────────── */}
          <div style={{ padding: '16px 20px' }}>
            <Sec label="Ответственные" />
            {TEAM.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--muted-foreground)', flexShrink: 0 }}>
                  {m.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => setPassportOpen(true)}>
            <Icon name="file-text" size={14} />Паспорт
          </Button>
          <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => onOpenCard && onOpenCard()}>
            Карточка проекта
          </Button>
        </div>

        {/* ── Passport modal ───────────────────────────────────────── */}
        {passportOpen && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end', zIndex: 100,
          }} onClick={() => setPassportOpen(false)}>
            <div style={{
              background: 'var(--card)', width: '100%', borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              padding: '20px 20px 28px', boxShadow: 'var(--shadow-lg)',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="file-text" size={16} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Паспорт проекта</span>
                </div>
                <IconBtn onClick={() => setPassportOpen(false)}><Icon name="x" size={15} /></IconBtn>
              </div>
              {[
                ['Наименование',   'ЭЛОУ-АВТ-6 · Блок 2'],
                ['Заказчик',       'ПАО «Нефтехим-Волга»'],
                ['Генподрядчик',   'ООО «СтройКомплекс»'],
                ['Шифр проекта',   'НХВ-2340-ЭЛОУ'],
                ['Стадия',         'Рабочая документация'],
                ['BIM-стандарт',   'ГОСТ Р 10.0.02-2021'],
                ['Версия модели',  'v2.14 от 22.04.2026'],
                ['Дата ввода',     'Июнь 2026 (план)'],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
                }}>
                  <span style={{ color: 'var(--muted-foreground)', flexShrink: 0, marginRight: 12 }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Button variant="outline" size="sm" style={{ flex: 1 }}><Icon name="download" size={13} />Скачать PDF</Button>
                <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => setPassportOpen(false)}>Закрыть</Button>
              </div>
            </div>
          </div>
        )}
      </aside>
    );
  }

  const TABS = [
    { key: 'props',   label: 'Свойства' },
    { key: 'docs',    label: `Документы${data.docs.length ? ` (${data.docs.length})` : ''}` },
    { key: 'history', label: 'История' },
  ];

  return (
    <aside style={{ width: 320, background: 'var(--card)', borderLeft: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

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
        <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => setPassportOpen(true)}>
          <Icon name="file-text" size={14} />Паспорт
        </Button>
        <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => onOpenCard && onOpenCard()}>
          Открыть карточку
        </Button>
      </div>

      {/* Object passport modal */}
      {passportOpen && (() => {
        const passportDoc = data.docs.find(d => d.name.toLowerCase().includes('паспорт'));
        return (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end', zIndex: 100,
          }} onClick={() => setPassportOpen(false)}>
            <div style={{
              background: 'var(--card)', width: '100%', borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              padding: '20px 20px 28px', boxShadow: 'var(--shadow-lg)',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="file-text" size={16} />
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>
                    Паспорт оборудования
                  </span>
                </div>
                <IconBtn onClick={() => setPassportOpen(false)}><Icon name="x" size={15} /></IconBtn>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 12,
                fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Badge variant={data.status} uppercase>
                  <StatusDot kind={data.status} />
                  {data.status === 'ok' ? 'Активен' : data.status === 'warn' ? 'Внимание' : data.status === 'crit' ? 'Проблема' : 'Офлайн'}
                </Badge>
                <span>{data.type} · {data.name}</span>
              </div>
              {data.props.map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
                }}>
                  <span style={{ color: 'var(--muted-foreground)', flexShrink: 0, marginRight: 12 }}>{k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
              {passportDoc && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--background)',
                  borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                  <DocBadge type="PDF" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{passportDoc.name}</div>
                    <div style={{ color: 'var(--muted-foreground)', marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                      {passportDoc.date} · {passportDoc.author} · {passportDoc.size}
                    </div>
                  </div>
                </div>
              )}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Button variant="outline" size="sm" style={{ flex: 1 }}><Icon name="download" size={13} />Скачать PDF</Button>
                <Button variant="primary" size="sm" style={{ flex: 1 }} onClick={() => setPassportOpen(false)}>Закрыть</Button>
              </div>
            </div>
          </div>
        );
      })()}
    </aside>
  );
};

window.InspectorPanel = InspectorPanel;
