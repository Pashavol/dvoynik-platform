// TelemetryPage.jsx — global activity log across all projects

const GLOBAL_EVENTS = [
  { date: '23.04.2026', time: '14:32', project: 'ЭЛОУ-АВТ-6 · Блок 2',    kind: 'warn', text: 'Расхождение: толщина стенки V-1208 −0,8 мм',                  author: 'Петров Д.К.' },
  { date: '23.04.2026', time: '11:15', project: 'НПЗ Кстово, установка-3', kind: 'crit', text: 'Нарушение допуска: отклонение арматуры +120 мм по оси Z',      author: 'Авт. мониторинг' },
  { date: '22.04.2026', time: '17:48', project: 'Ванкорский кластер',       kind: 'warn', text: 'Риск задержки: монтаж секции 4-Б отстаёт от графика на 3 дня', author: 'Система' },
  { date: '22.04.2026', time: '09:20', project: 'Газоперерабатывающий-2',   kind: 'ok',   text: 'Модель обновлена: версия v2.8 загружена успешно',              author: 'BIM-отдел' },
  { date: '21.04.2026', time: '16:05', project: 'ЭЛОУ-АВТ-6 · Блок 2',    kind: 'ok',   text: 'Документ добавлен: Паспорт оборудования P-2340-A',              author: 'Иванов А.В.' },
  { date: '21.04.2026', time: '13:30', project: 'Терминал Усть-Луга',       kind: 'ok',   text: 'Этап «Фундамент» закрыт, акт КС-2 подписан',                   author: 'ОТК' },
  { date: '20.04.2026', time: '10:00', project: 'ЭЛОУ-АВТ-6 · Блок 2',    kind: 'warn', text: 'Расхождение зафиксировано: смещение по оси X +45 мм',           author: 'Сидоров В.П.' },
  { date: '19.04.2026', time: '15:22', project: 'Астраханский ГПЗ',         kind: 'ok',   text: 'Проект переведён в статус «Завершён»',                         author: 'Система' },
  { date: '18.04.2026', time: '11:10', project: 'Ванкорский кластер',       kind: 'warn', text: 'Качество сварных швов ниже нормы на участке B-11',             author: 'ОТК' },
  { date: '17.04.2026', time: '09:45', project: 'НПЗ Кстово, установка-3', kind: 'crit', text: 'Срок сдачи под угрозой: задержка поставки колонны K-3',        author: 'Система' },
  { date: '16.04.2026', time: '14:00', project: 'Газоперерабатывающий-2',   kind: 'ok',   text: 'Осмотр завершён, замечания не выявлены',                       author: 'СУ-17' },
  { date: '15.04.2026', time: '08:30', project: 'Терминал Усть-Луга',       kind: 'ok',   text: 'Версия модели v1.9 одобрена, передана заказчику',              author: 'BIM-отдел' },
];

const TelemetryPage = () => {
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? GLOBAL_EVENTS : GLOBAL_EVENTS.filter(e => e.kind === filter);
  const counts = GLOBAL_EVENTS.reduce((a, e) => { a[e.kind] = (a[e.kind] || 0) + 1; return a; }, {});

  const STAT_CARDS = [
    { kind: 'crit', label: 'Критичных',  icon: 'alert-circle',   color: 'var(--status-crit)' },
    { kind: 'warn', label: 'Внимание',   icon: 'alert-triangle', color: 'var(--status-warn)' },
    { kind: 'ok',   label: 'Успешных',   icon: 'check-circle',   color: 'var(--status-ok)'   },
  ];

  const FILTERS = [['all', 'Все события'], ['crit', 'Критичные'], ['warn', 'Внимание'], ['ok', 'Успешные']];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Телеметрия</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>Лог событий по всем проектам</div>
        </div>
        <Button variant="outline" size="sm"><Icon name="download" size={14} />Экспорт</Button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {STAT_CARDS.map(({ kind, label, icon, color }) => (
          <div key={kind} onClick={() => setFilter(filter === kind ? 'all' : kind)} style={{
            flex: 1, padding: '16px 20px', cursor: 'pointer', background: 'var(--card)',
            border: '1px solid ' + (filter === kind ? 'var(--primary)' : 'var(--border)'),
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28 }}>{counts[kind] || 0}</div>
              <span style={{ color }}><Icon name={icon} size={18} /></span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {FILTERS.map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
            background: filter === f ? 'var(--primary)' : 'transparent',
            color: filter === f ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 12, cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
          }}>{label}</button>
        ))}
      </div>

      {/* Event list */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {filtered.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            background: 'var(--card)',
          }}>
            <div style={{ marginTop: 3, flexShrink: 0 }}><StatusDot kind={e.kind} size={8} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13 }}>{e.text}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 3, fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                <span>{e.project}</span><span>·</span><span>{e.author}</span>
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
              <div>{e.date}</div>
              <div>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.TelemetryPage = TelemetryPage;
