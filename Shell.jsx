// Shell.jsx — top-level router
const { useState: useShellState, useEffect: useShellEffect, useRef: useShellRef } = React;

// ─── Portfolio-level recommendations page ──────────────────────────────────────
const ALL_RECOMMENDATIONS = [
  { tag: 'Безопасность', tagKind: 'crit', project: 'ЭЛОУ-АВТ-6 · Блок 2',      title: 'Температурное отклонение датчика TI-1208-01',           body: 'Значение 342 °C превышает порог 335 °C. Требуется внеплановая проверка термопары и теплоизоляции V-1208.',                            action: 'Открыть карту объекта',    source: 'Телеметрия',             updatedAt: '25.04.2026' },
  { tag: 'Риск',         tagKind: 'warn', project: 'НПЗ Кстово',                 title: 'Отклонение графика монтажа на 14 дней',                 body: 'Задержка поставки арматуры DN500 сдвигает монтажный этап. Бригада Б-04 освобождается с Ванкора 12 апреля — перевести на Кстово.',    action: 'Назначить бригаду',        source: 'Анализ поставок',        updatedAt: '25.04.2026' },
  { tag: 'Риск',         tagKind: 'warn', project: 'Усть-Луга ХБ-2',             title: 'Истекает срок 3 разрешений на высотные работы',         body: 'Разрешения истекают 30 апреля. Необходимо продление через Ростехнадзор — иначе остановка работ.',                                    action: 'Открыть реестр документов',source: 'Реестр документов',      updatedAt: '22.04.2026' },
  { tag: 'Риск',         tagKind: 'warn', project: 'Ванкорский кластер',          title: 'Перегрузка бригады Б-01 на следующей неделе',           body: 'Бригада назначена на три параллельных фронта. Рекомендуется перераспределить одну задачу на бригаду Б-03.',                         action: 'Открыть расписание бригад',source: 'Планирование ресурсов',  updatedAt: '23.04.2026' },
  { tag: 'Оптимизация',  tagKind: 'info', project: 'Ванкорский кластер',          title: 'Экономия 340 млн ₽: замена поставщика трубопровода',    body: 'АО «ТМК» предлагает Ду-1200 дешевле на 8,2% при сроке поставки на 6 недель меньше.',                                                 action: 'Открыть спецификацию',     source: 'Анализ бюджета',         updatedAt: '24.04.2026' },
  { tag: 'Оптимизация',  tagKind: 'info', project: 'ЭЛОУ-АВТ-6 · Блок 2',       title: 'Дублирование позиций в заказе стальных конструкций',    body: 'Оптимизация номенклатуры сократит расходы на 48 млн ₽ (8,4%) без снижения качества.',                                               action: 'Открыть спецификацию',     source: 'Анализ бюджета',         updatedAt: '24.04.2026' },
  { tag: 'Оптимизация',  tagKind: 'info', project: 'Амурский ГПЗ · Очередь 3',   title: 'Консолидация закупок арматуры — экономия 90 млн ₽',     body: '4 проекта в одном регионе закупают арматуру у разных поставщиков. Единый лот снизит стоимость на 12%.',                             action: 'Создать сводный заказ',    source: 'Анализ закупок',         updatedAt: '23.04.2026' },
  { tag: 'Прогноз',      tagKind: 'ok',   project: 'Усть-Луга ХБ-2',             title: 'Досрочный ввод 23 сентября — на 11 дней раньше плана',  body: 'При текущем темпе бетонирования плит №4–7 объект выйдет на пусконаладку раньше срока.',                                             action: 'Скорректировать план',     source: 'Мониторинг прогресса',   updatedAt: '25.04.2026' },
  { tag: 'Прогноз',      tagKind: 'ok',   project: 'НПЗ Кстово',                  title: 'Этап «Обвязка» завершится 3 мая — досрочно на 8 дней',  body: 'Бригада Б-02 сохраняет высокий темп. Рекомендуется заблаговременно согласовать акт КС-2.',                                          action: 'Подготовить КС-2',         source: 'Мониторинг прогресса',   updatedAt: '25.04.2026' },
  { tag: 'Прогноз',      tagKind: 'ok',   project: 'Амурский ГПЗ · Очередь 3',   title: 'Готовность BIM-модели достигнет 95% к 1 мая',           body: 'Текущий прогресс верификации опережает план на 4%. Модель будет готова к сдаче за неделю до контрольной точки.',                      action: 'Открыть модель',           source: 'BIM-платформа',           updatedAt: '24.04.2026' },
];

const PortfolioRecommendationsPage = ({ onBack }) => {
  const [filter, setFilter]   = useShellState('all');
  const [search, setSearch]   = useShellState('');

  const FILTERS = [
    { key: 'all',  label: 'Все'            },
    { key: 'crit', label: 'Критичные'      },
    { key: 'warn', label: 'Предупреждения' },
    { key: 'info', label: 'Оптимизация'    },
    { key: 'ok',   label: 'Прогнозы'       },
  ];

  const COUNTS = {
    crit: ALL_RECOMMENDATIONS.filter(r => r.tagKind === 'crit').length,
    warn: ALL_RECOMMENDATIONS.filter(r => r.tagKind === 'warn').length,
    info: ALL_RECOMMENDATIONS.filter(r => r.tagKind === 'info').length,
    ok:   ALL_RECOMMENDATIONS.filter(r => r.tagKind === 'ok').length,
  };

  const q = search.toLowerCase();
  const filtered = ALL_RECOMMENDATIONS.filter(r => {
    if (filter !== 'all' && r.tagKind !== filter) return false;
    if (q && !r.title.toLowerCase().includes(q) && !r.project.toLowerCase().includes(q) && !r.body.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--muted)' }}>

      {/* Hero header */}
      <div style={{
        background: 'linear-gradient(135deg, color-mix(in oklch, var(--primary) 10%, var(--card)) 0%, var(--card) 55%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20,
        position: 'relative', overflow: 'hidden', marginBottom: 20,
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'color-mix(in oklch, var(--primary) 14%, transparent)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="sparkles" size={20} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Рекомендации AI-ассистента</div>
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>Обновлено сегодня, 09:42 · проанализировано 125 проектов</div>
          </div>
          <Button variant="outline" size="sm"><Icon name="refresh" size={13} />Обновить</Button>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16, position: 'relative' }}>
          {[
            { label: 'Критичных',      count: COUNTS.crit, kind: 'crit', icon: 'alert-octagon'  },
            { label: 'Предупреждений', count: COUNTS.warn, kind: 'warn', icon: 'alert-triangle'  },
            { label: 'Оптимизаций',    count: COUNTS.info, kind: 'info', icon: 'zap'             },
            { label: 'Прогнозов',      count: COUNTS.ok,   kind: 'ok',   icon: 'trending-up'     },
          ].map(s => (
            <div key={s.kind} onClick={() => setFilter(s.kind)} style={{
              background: 'var(--background)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '12px 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              outline: filter === s.kind ? '2px solid var(--primary)' : 'none', outlineOffset: 1,
            }}>
              <StatusDot kind={s.kind} size={8} />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22 }}>{s.count}</span>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.3 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '5px 14px', borderRadius: 'var(--radius)', border: '1px solid',
            borderColor: filter === f.key ? 'var(--primary)' : 'var(--border)',
            background: filter === f.key ? 'var(--primary)' : 'var(--card)',
            color: filter === f.key ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 13, cursor: 'pointer', fontWeight: filter === f.key ? 600 : 400,
          }}>{f.label}</button>
        ))}
        <div style={{ position: 'relative', marginLeft: 8 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none' }}>
            <Icon name="search" size={13} />
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по проекту или теме…"
            style={{
              paddingLeft: 30, paddingRight: 12, height: 32, border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', background: 'var(--card)', color: 'var(--foreground)',
              fontSize: 13, outline: 'none', width: 220,
            }}
          />
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} из {ALL_RECOMMENDATIONS.length} рекомендаций
        </span>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {filtered.map((r, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant={r.tagKind} uppercase>{r.tag}</Badge>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{r.source}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="folder" size={11} />{r.project}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{r.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', lineHeight: 1.55, flex: 1 }}>{r.body}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{r.updatedAt}</span>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: 0, background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--primary)', fontSize: 13, fontWeight: 500,
              }}>{r.action}<Icon name="arrow-right" size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-foreground)' }}>
          <Icon name="search" size={32} />
          <div style={{ marginTop: 12, fontWeight: 500 }}>Рекомендации не найдены</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Попробуйте изменить фильтр или поисковый запрос</div>
        </div>
      )}
    </div>
  );
};

// ─── Projects list ─────────────────────────────────────────────────────────────
const ProjectsListPage = ({ onOpenProject }) => {
  const projects = window.PROJECTS || [];
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Проекты</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>{projects.length} объектов в портфеле</div>
        </div>
        <Button variant="primary" size="sm"><Icon name="plus" size={14} />Добавить проект</Button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Проект', 'Заказчик', 'Регион', 'Бюджет', 'Готовность', 'Риски', 'Статус'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted-foreground)', fontWeight: 500, fontSize: 12, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}
              onClick={() => onOpenProject(p.id)}
              style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ padding: '12px' }}>
                <div style={{ fontWeight: 500 }}>{p.name}</div>
              </td>
              <td style={{ padding: '12px', color: 'var(--muted-foreground)', fontSize: 13, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.client}</td>
              <td style={{ padding: '12px', color: 'var(--muted-foreground)', fontSize: 13, whiteSpace: 'nowrap' }}>{p.region}</td>
              <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 13, whiteSpace: 'nowrap' }}>{p.budget}</td>
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 60, height: 4, background: 'var(--muted)', borderRadius: 2, flexShrink: 0 }}>
                    <div style={{ height: '100%', width: p.progress + '%', background: p.status === 'crit' ? 'var(--status-crit)' : p.status === 'warn' ? 'var(--status-warn)' : 'var(--primary)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>{p.progress}%</span>
                </div>
              </td>
              <td style={{ padding: '12px' }}>
                {p.risks > 0
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: p.risks >= 3 ? 'var(--status-crit)' : 'var(--status-warn)', fontFamily: 'var(--font-mono)' }}><Icon name="alert-triangle" size={12} />{p.risks}</span>
                  : <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>—</span>
                }
              </td>
              <td style={{ padding: '12px' }}>
                <Badge variant={p.status} uppercase>
                  <StatusDot kind={p.status} />
                  {p.status === 'ok' ? 'Активен' : p.status === 'warn' ? 'Внимание' : p.status === 'crit' ? 'Проблема' : 'Завершён'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Per-project telemetry tab ─────────────────────────────────────────────────
const PROJ_BASE_EVENTS = [
  {
    id: 'pe1', date: '23.04.2026', time: '14:32', kind: 'warn',
    text: 'Расхождение: толщина стенки V-1208 −0,8 мм',
    author: 'Петров Д.К.', location: 'V-1208 · Секция 4',
    media: { type: 'photo', count: 3 },
    sensor: { tag: 'TI-1208-01', value: '342°C', delta: '+7°C', status: 'warn' },
  },
  {
    id: 'pe2', date: '22.04.2026', time: '09:12', kind: 'ok',
    text: 'Модель обновлена до версии v2.14',
    author: 'BIM-отдел', location: null,
    media: null, sensor: null,
  },
  {
    id: 'pe3', date: '21.04.2026', time: '16:05', kind: 'ok',
    text: 'Документ добавлен: Паспорт P-2340-A',
    author: 'Иванов А.В.', location: 'P-2340-A',
    media: { type: 'photo', count: 7 }, sensor: null,
  },
  {
    id: 'pe4', date: '20.04.2026', time: '10:00', kind: 'warn',
    text: 'Расхождение: смещение по оси X +45 мм',
    author: 'Сидоров В.П.', location: 'V-1208 · Ось X',
    media: { type: 'video', duration: '1:14' },
    sensor: { tag: 'PI-1208-02', value: '0,89 МПа', delta: '+0,05', status: 'warn' },
  },
  {
    id: 'pe5', date: '18.04.2026', time: '15:30', kind: 'ok',
    text: 'Этап «Обвязка» закрыт, акт КС-2 подписан',
    author: 'ОТК', location: null,
    media: { type: 'photo', count: 11 }, sensor: null,
  },
  {
    id: 'pe6', date: '15.04.2026', time: '08:48', kind: 'ok',
    text: 'Новый объект добавлен в реестр: E-4401',
    author: 'BIM-отдел', location: 'E-4401',
    media: null, sensor: null,
  },
  {
    id: 'pe7', date: '10.04.2026', time: '12:20', kind: 'warn',
    text: 'Плановый срок монтажа насосной под угрозой',
    author: 'Система', location: 'Насосная Н-101',
    media: null, sensor: null,
  },
  {
    id: 'pe8', date: '05.04.2026', time: '09:55', kind: 'ok',
    text: 'Модель BIM v2.0 загружена и верифицирована',
    author: 'BIM-отдел', location: null,
    media: null, sensor: null,
  },
];

const PROJ_LIVE_EVENTS = [
  {
    kind: 'crit',
    text: 'Аварийный сигнал: превышение давления в E-4401 — 2,4 МПа',
    author: 'Авт. мониторинг', location: 'E-4401',
    media: null,
    sensor: { tag: 'PI-4401-01', value: '2,4 МПа', delta: '+0,3', status: 'crit' },
  },
  {
    kind: 'warn',
    text: 'Задержка монтажа: секция 5-В сдвинута на 2 дня',
    author: 'Бригада Б-01', location: 'Секция 5-В',
    media: { type: 'photo', count: 2 }, sensor: null,
  },
  {
    kind: 'ok',
    text: 'Инспекция сварных швов секции 7 завершена успешно',
    author: 'ОТК', location: 'Секция 7',
    media: { type: 'photo', count: 6 }, sensor: null,
  },
];

let _projEvtId = 300;

const ProjectTelemetry = () => {
  const [subTab,        setSubTab]        = useShellState('events');
  const [events,        setEvents]        = useShellState(PROJ_BASE_EVENTS);
  const [newCount,      setNewCount]      = useShellState(0);
  const [selectedEvent, setSelectedEvent] = useShellState(null);
  const streamIdxRef = useShellRef(0);

  const SUB_TABS = [{ key: 'events', label: 'События' }, { key: 'sensors', label: 'Датчики' }];

  useShellEffect(() => {
    const id = setInterval(() => {
      if (streamIdxRef.current >= PROJ_LIVE_EVENTS.length) return;
      const tmpl = PROJ_LIVE_EVENTS[streamIdxRef.current++];
      const now = new Date();
      const hh  = String(now.getHours()).padStart(2, '0');
      const mm  = String(now.getMinutes()).padStart(2, '0');
      const newEv = { ...tmpl, id: `pl${++_projEvtId}`, date: '26.04.2026', time: `${hh}:${mm}`, isNew: true };
      setEvents(prev => [newEv, ...prev]);
      setNewCount(prev => prev + 1);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const MediaThumb       = window.MediaThumb;
  const SensorChip       = window.SensorChip;
  const EventDetailModal = window.EventDetailModal;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ display: 'flex', gap: 4, padding: '12px 24px 0', borderBottom: '1px solid var(--border)', background: 'var(--background)', flexShrink: 0 }}>
        {SUB_TABS.map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)} style={{
            padding: '7px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: subTab === t.key ? 600 : 400,
            color: subTab === t.key ? 'var(--foreground)' : 'var(--muted-foreground)',
            borderBottom: subTab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
        {subTab === 'events' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4, gap: 8 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 8px', borderRadius: 10,
              background: 'color-mix(in oklch, var(--status-ok) 14%, var(--muted))',
              border: '1px solid color-mix(in oklch, var(--status-ok) 28%, var(--border))',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--status-ok)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-ok)', animation: 'live-pulse 1.8s ease-in-out infinite', display: 'inline-block' }} />
              Live
            </span>
          </div>
        )}
      </div>

      {subTab === 'events' && (
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

          {newCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 14px', marginBottom: 16,
              background: 'color-mix(in oklch, var(--primary) 7%, var(--card))',
              border: '1px solid color-mix(in oklch, var(--primary) 28%, var(--border))',
              borderRadius: 'var(--radius)',
              animation: 'tel-slide-in 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="bell" size={13} /></span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {newCount} {newCount === 1 ? 'новое событие' : newCount < 5 ? 'новых события' : 'новых событий'}
                </span>
              </div>
              <button onClick={() => setNewCount(0)} style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>Скрыть</button>
            </div>
          )}

          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--card)' }}>
            {events.map((e, i) => (
              <div
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                style={{
                  display: 'flex', gap: 14, padding: '14px 16px',
                  borderBottom: i < events.length - 1 ? '1px solid var(--border)' : 'none',
                  background: e.isNew ? 'color-mix(in oklch, var(--primary) 4%, var(--card))' : 'var(--card)',
                  animation: e.isNew ? 'tel-slide-in 0.35s ease' : 'none',
                  cursor: 'pointer', transition: 'background .1s',
                }}
                onMouseEnter={ev => ev.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={ev => ev.currentTarget.style.background = e.isNew ? 'color-mix(in oklch, var(--primary) 4%, var(--card))' : 'var(--card)'}
              >
                <div style={{ marginTop: 4, flexShrink: 0 }}><StatusDot kind={e.kind} size={8} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
                    {e.isNew && (
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, flexShrink: 0, marginTop: 1, background: 'color-mix(in oklch, var(--primary) 18%, transparent)', color: 'var(--primary)' }}>NEW</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: e.kind !== 'ok' ? 500 : 400 }}>{e.text}</span>
                  </div>
                  {e.location && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, fontSize: 11, color: 'var(--muted-foreground)' }}>
                      <Icon name="map-pin" size={10} />
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{e.location}</span>
                    </div>
                  )}
                  {(e.media || e.sensor) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {MediaThumb && <MediaThumb media={e.media} />}
                      {SensorChip && <SensorChip sensor={e.sensor} />}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
                    {e.date} {e.time && `· ${e.time}`} · {e.author}
                  </div>
                </div>
                <span style={{ flexShrink: 0, color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  <Icon name="chevron-right" size={13} />
                </span>
              </div>
            ))}
          </div>

          {selectedEvent && EventDetailModal && (
            <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          )}
        </div>
      )}

      {subTab === 'sensors' && <SensorsPage />}
    </div>
  );
};

// ─── Project detail with tabs ──────────────────────────────────────────────────
const SENSORS = [
  { tag: 'TI-1208-01', type: 'Термопара',        equipment: 'V-1208',   value: '342,0', unit: '°C',  status: 'warn'     },
  { tag: 'PI-1208-02', type: 'Манометр',          equipment: 'V-1208',   value: '0,842', unit: 'МПа', status: 'ok'       },
  { tag: 'FI-2340-01', type: 'Расходомер',        equipment: 'P-2340-A', value: '200,4', unit: 'м³/ч', status: 'ok'      },
  { tag: 'TI-2340-02', type: 'Термопара',         equipment: 'P-2340-A', value: '187,4', unit: '°C',  status: 'ok'       },
  { tag: 'FI-2340-03', type: 'Расходомер',        equipment: 'P-2340-B', value: '199,1', unit: 'м³/ч', status: 'ok'      },
  { tag: 'TI-4401-01', type: 'Термопара',         equipment: 'E-4401',   value: '—',     unit: '°C',  status: 'inactive' },
  { tag: 'PI-4401-02', type: 'Манометр',          equipment: 'E-4401',   value: '—',     unit: 'МПа', status: 'inactive' },
  { tag: 'LI-1208-03', type: 'Уровнемер',         equipment: 'V-1208',   value: '61,3',  unit: '%',   status: 'ok'       },
];

const SensorsPage = () => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--background)', overflow: 'hidden' }}>
    <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
      <div style={{ position: 'relative', display: 'flex', width: 280 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }}>
          <Icon name="search" size={14} />
        </span>
        <Input placeholder="Поиск по тегу или типу…" style={{ paddingLeft: 36 }} />
      </div>
      <Button variant="outline" size="sm"><Icon name="filter" size={14} />Фильтр</Button>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{SENSORS.length} датчиков</span>
      <Button variant="outline" size="sm"><Icon name="download" size={14} />Экспорт</Button>
      <Button variant="primary" size="sm"><Icon name="plus" size={14} />Добавить</Button>
    </div>
    <div style={{ flex: 1, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead style={{ position: 'sticky', top: 0, background: 'var(--background)', zIndex: 1 }}>
          <tr>
            {['Тег', 'Тип', 'Оборудование', 'Значение', 'Статус'].map((h, i) => (
              <th key={i} style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted-foreground)', textAlign: i === 3 ? 'right' : 'left', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SENSORS.map(s => (
            <tr key={s.tag}
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500 }}>{s.tag}</td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>{s.type}</td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.equipment}</td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                {s.value !== '—' ? <>{s.value} <span style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>{s.unit}</span></> : '—'}
              </td>
              <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                <Badge variant={s.status} uppercase>
                  <StatusDot kind={s.status} />
                  {s.status === 'ok' ? 'Активен' : s.status === 'warn' ? 'Внимание' : s.status === 'crit' ? 'Авария' : 'Офлайн'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Project recommendations tab ──────────────────────────────────────────────
const PROJ_RECOMMENDATIONS = [
  {
    tag: 'Безопасность', tagKind: 'crit',
    title: 'Температурное отклонение датчика TI-1208-01',
    body: 'Значение 342 °C превышает регламентный порог 335 °C. Рекомендуется внеплановая проверка термопары и теплоизоляции сосуда V-1208 до начала следующего рабочего дня.',
    action: 'Открыть карту объекта', source: 'Телеметрия', updatedAt: '25.04.2026',
  },
  {
    tag: 'Риск', tagKind: 'warn',
    title: 'Отклонение графика монтажа на 14 дней',
    body: 'Задержка поставки трубопроводной арматуры DN500 от подрядчика «МеталлТорг» сдвигает начало монтажного этапа. Рекомендуется рассмотреть альтернативных поставщиков.',
    action: 'Открыть календарный план', source: 'Анализ поставок', updatedAt: '25.04.2026',
  },
  {
    tag: 'Документация', tagKind: 'warn',
    title: 'Истекает срок действия 3 разрешений',
    body: 'Разрешения на высотные работы (3 шт.) истекают 30 апреля. Необходимо продление через Ростехнадзор для предотвращения остановки работ на объекте.',
    action: 'Открыть реестр документов', source: 'Реестр документов', updatedAt: '22.04.2026',
  },
  {
    tag: 'Оптимизация', tagKind: 'info',
    title: 'Потенциальная экономия 48 млн ₽ на материалах',
    body: 'Анализ спецификаций выявил дублирование позиций в заказе стальных конструкций. Оптимизация номенклатуры позволит сократить расходы на 8,4% без снижения качества.',
    action: 'Открыть спецификацию', source: 'Анализ бюджета', updatedAt: '24.04.2026',
  },
  {
    tag: 'Ресурсы', tagKind: 'info',
    title: 'Перегрузка бригады Б-01 на следующей неделе',
    body: 'По данным планировщика, бригада Б-01 назначена на три параллельных фронта работ. Рекомендуется перераспределить одну задачу на бригаду Б-03.',
    action: 'Открыть расписание бригад', source: 'Планирование ресурсов', updatedAt: '23.04.2026',
  },
  {
    tag: 'Прогноз', tagKind: 'ok',
    title: 'Досрочное завершение этапа «Обвязка» на 8 дней',
    body: 'При сохранении текущего темпа работ бригады Б-02 этап будет закрыт 3 мая вместо планового 11 мая. Рекомендуется заблаговременно согласовать КС-2.',
    action: 'Скорректировать план', source: 'Мониторинг прогресса', updatedAt: '25.04.2026',
  },
];

const ProjectRecommendationsTab = () => {
  const [filter, setFilter] = React.useState('all');

  const FILTERS = [
    { key: 'all',  label: 'Все'           },
    { key: 'crit', label: 'Критичные'     },
    { key: 'warn', label: 'Предупреждения' },
    { key: 'info', label: 'Оптимизация'   },
    { key: 'ok',   label: 'Прогнозы'      },
  ];

  const filtered = filter === 'all'
    ? PROJ_RECOMMENDATIONS
    : PROJ_RECOMMENDATIONS.filter(r => r.tagKind === filter);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      {/* Header card */}
      <div style={{
        background: 'linear-gradient(135deg, color-mix(in oklch, var(--primary) 10%, var(--card)) 0%, var(--card) 55%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20,
        position: 'relative', overflow: 'hidden', marginBottom: 20,
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'color-mix(in oklch, var(--primary) 14%, transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="sparkles" size={18} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>Рекомендации AI-ассистента</div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Обновлено сегодня, 09:42 · на основе телеметрии, графиков и бюджета проекта</div>
          </div>
          <Button variant="outline" size="sm"><Icon name="refresh" size={13} />Обновить</Button>
        </div>
      </div>

      {/* Filter strip */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '5px 14px', borderRadius: 'var(--radius)', border: '1px solid',
            borderColor: filter === f.key ? 'var(--primary)' : 'var(--border)',
            background: filter === f.key ? 'var(--primary)' : 'var(--card)',
            color: filter === f.key ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 13, cursor: 'pointer', fontWeight: filter === f.key ? 600 : 400,
          }}>{f.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} рекомендаций
        </span>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {filtered.map((r, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant={r.tagKind} uppercase>{r.tag}</Badge>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{r.source}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{r.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', lineHeight: 1.55, flex: 1 }}>{r.body}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{r.updatedAt}</span>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: 0, background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--primary)', fontSize: 13, fontWeight: 500,
              }}>{r.action}<Icon name="arrow-right" size={13} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Context-aware AI assistant panel ────────────────────────────────────────
const PANEL_RECS = {
  overview: {
    title: 'Рекомендации по портфелю',
    subtitle: 'На основе данных 125 проектов',
    items: [
      { tag: 'Риск',         tagKind: 'warn', title: 'НПЗ Кстово: отклонение графика на 14 дней',    body: 'Бригада Б-04 освобождается с Ванкора 12 апреля — рекомендуется перевести для закрытия разрыва.',  action: 'Назначить бригаду'    },
      { tag: 'Безопасность', tagKind: 'crit', title: 'Температурное отклонение TI-1208-01',          body: '342 °C превышает порог 335 °C по V-1208. Требуется внеплановая проверка термопары.',              action: 'Открыть объект'       },
      { tag: 'Оптимизация',  tagKind: 'info', title: 'Ванкорский кластер: экономия 340 млн ₽',       body: 'Замена поставщика Ду-1200 — срок поставки короче на 6 нед., стоимость ниже на 8,2%.',             action: 'Открыть спецификацию' },
    ],
  },
  projects: {
    title: 'Портфельный анализ',
    subtitle: 'Сводные риски и возможности',
    items: [
      { tag: 'Риск',        tagKind: 'warn', title: '3 проекта с отставанием по срокам',          body: 'ЭЛОУ-АВТ-6, НПЗ Кстово и Ванкорский кластер требуют оперативного вмешательства.',           action: 'Перейти к проектам'   },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Консолидация закупок арматуры: −90 млн ₽',   body: '4 проекта закупают арматуру раздельно. Единый лот сократит расходы на 12%.',                 action: 'Создать сводный заказ' },
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'Усть-Луга: ввод раньше срока на 11 дней',   body: 'При текущем темпе бетонирования плит №4–7 объект выйдет на пусконаладку досрочно.',         action: 'Скорректировать план'  },
    ],
  },
  'project:model': {
    title: 'Рекомендации по объекту',
    subtitle: 'BIM-модель и оборудование',
    items: [
      { tag: 'Безопасность', tagKind: 'crit', title: 'TI-1208-01: +7 °C выше нормы',              body: 'Датчик V-1208 — 342 °C при пороге 335 °C. Требуется осмотр до начала следующей смены.',      action: 'Открыть на карте' },
      { tag: 'Риск',         tagKind: 'warn', title: 'Расхождение оси X: +45 мм на V-1208',        body: 'Зафиксировано при геодезической съёмке. Необходима корректировка до монтажа обвязки.',      action: 'Открыть акт'      },
      { tag: 'BIM',          tagKind: 'info', title: 'Верификация модели v2.14: 91%',               body: 'Рекомендуется завершить позиции E-4401 до конца недели для сдачи в срок.',                  action: 'Открыть модель'   },
    ],
  },
  'project:registry': {
    title: 'Рекомендации по оборудованию',
    subtitle: 'Реестр и техническое обслуживание',
    items: [
      { tag: 'Риск',          tagKind: 'warn', title: 'E-4401: плановое ТО просрочено на 12 дней', body: 'Теплообменник не проходил обслуживание с 14 апреля. Требуется назначить дату.',             action: 'Назначить ТО'    },
      { tag: 'Документация',  tagKind: 'warn', title: 'Паспорт P-2340-A требует обновления',        body: 'Документ актуален на версию v1.8, текущая — v2.0. Расхождение в спецификации.',            action: 'Обновить паспорт' },
      { tag: 'Оптимизация',   tagKind: 'info', title: '3 позиции дублируются в реестре',            body: 'Рекомендуется объединить FI-2340-01/02/03 в один агрегированный объект.',                  action: 'Открыть реестр'  },
    ],
  },
  'project:brigades': {
    title: 'Рекомендации по бригадам',
    subtitle: 'Планирование ресурсов',
    items: [
      { tag: 'Риск',        tagKind: 'warn', title: 'Б-01 перегружена: 3 фронта на нед. 18',     body: 'Рекомендуется перенести монтаж насосной на Б-03 — у неё 40% свободной ёмкости.',          action: 'Перераспределить'  },
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'Б-04 освобождается с Ванкора 12 апреля',    body: 'Срочно перевести на НПЗ Кстово для закрытия разрыва в монтаже колонны.',                  action: 'Назначить бригаду' },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Б-02: КПД 112% от плана',                   body: 'Высокая эффективность — рассмотрите расширение фронта для ускорения этапа.',              action: 'Открыть план'      },
    ],
  },
  'project:telemetry': {
    title: 'Рекомендации по телеметрии',
    subtitle: 'Датчики и аномалии',
    items: [
      { tag: 'Безопасность', tagKind: 'crit', title: 'TI-1208-01: +7 °C выше регламента',         body: 'Значение 342 °C в V-1208 превышает порог 335 °C. Требуется немедленная проверка.',         action: 'Открыть датчик'   },
      { tag: 'Риск',         tagKind: 'warn', title: 'PI-1208-02: давление растёт +0,05 МПа',      body: 'Тенденция роста за последние 48 часов. Рекомендуется плановый осмотр уплотнений.',        action: 'Открыть тренд'    },
      { tag: 'Прогноз',      tagKind: 'ok',   title: 'TI-4401-01 вернётся из ТО 28 апреля',       body: 'Перерыв в данных по плановому ТО — некритичен. Возобновление в штатном режиме.',          action: 'Открыть график'   },
    ],
  },
  'project:media': {
    title: 'Рекомендации по фото/видео',
    subtitle: 'Фиксация и верификация',
    items: [
      { tag: 'Документация', tagKind: 'warn', title: 'Секция 5-В без фотофиксации',               body: 'Для закрытия этапа монтажа требуется фотографическое подтверждение выполненных работ.',    action: 'Назначить съёмку' },
      { tag: 'Оптимизация',  tagKind: 'info', title: '23 фото ожидают верификации ОТК',            body: 'Назначьте ответственного для ускорения приёмки и закрытия этапа.',                        action: 'Открыть очередь'  },
      { tag: 'Прогноз',      tagKind: 'ok',   title: 'Покрытие объекта: 87% завершено',            body: 'Остались секции 5-В и 6-А. Плановая съёмка назначена на 28 апреля.',                     action: 'Открыть карту'    },
    ],
  },
  'project:team': {
    title: 'Рекомендации по команде',
    subtitle: 'Ресурсы и нагрузка',
    items: [
      { tag: 'Оптимизация', tagKind: 'info', title: 'Иванов А.В.: загрузка 140%',                 body: '3 задачи можно делегировать Петрову Д.К. — у него 45% свободной ёмкости.',               action: 'Перераспределить'  },
      { tag: 'Риск',        tagKind: 'warn', title: 'BIM-специалист в отпуске с 28 апреля',        body: 'Дмитрий Сидоров отсутствует в период верификации модели. Необходима замена.',            action: 'Назначить замену'  },
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'ОТК укомплектован на 100% до конца мая',     body: 'Все плановые проверки обеспечены ресурсами — риска срыва нет.',                          action: 'Открыть план'      },
    ],
  },
  'project:plan': {
    title: 'Рекомендации по плану',
    subtitle: 'Отклонения и возможности',
    items: [
      { tag: 'Риск',        tagKind: 'warn', title: 'Монтажный этап сдвинут на 14 дней',          body: 'Задержка поставки арматуры DN500. Пересмотрите ресурсный план и назначьте резервную бригаду.', action: 'Пересчитать план' },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Б-01: три параллельных фронта на нед. 18',   body: 'Перенести одну задачу на Б-03, чтобы снизить риск отставания.',                          action: 'Открыть бригады'  },
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'Этап «Обвязка»: досрочно 3 мая',             body: 'Б-02 опережает план. Заблаговременно согласуйте акт КС-2 с заказчиком.',                 action: 'Подготовить КС-2' },
    ],
  },
  'project:budget': {
    title: 'Рекомендации по бюджету',
    subtitle: 'Анализ затрат и экономия',
    items: [
      { tag: 'Оптимизация', tagKind: 'info', title: 'Экономия 48 млн ₽ на стальных конструкциях', body: 'Дублирование позиций в заказе. Оптимизация номенклатуры без снижения качества.',          action: 'Открыть спецификацию' },
      { tag: 'Риск',        tagKind: 'warn', title: 'Перерасход раздела «Монтаж»: +12%',           body: 'Прогнозируемый перерасход 145 млн ₽. Рекомендуется пересмотреть объёмы субподряда.',     action: 'Открыть бюджет'       },
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'Освоение: 62% при плане 59%',                 body: 'Проект опережает плановое освоение. Высвободится ресурс для перераспределения в Q4.',     action: 'Открыть аналитику'    },
    ],
  },
  'project:tasks': {
    title: 'Рекомендации по задачам',
    subtitle: 'Приоритеты и узкие места',
    items: [
      { tag: 'Риск',        tagKind: 'warn', title: '5 задач просрочено на этой неделе',           body: 'Задачи по разделу ИД и согласованию КС-2 требуют немедленного внимания.',                action: 'Открыть просроченные' },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Иванов А.В.: перегрузка — 12 задач',          body: 'Делегируйте 3 задачи Петрову Д.К. — у него 4 свободных слота.',                         action: 'Перераспределить'      },
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'Этап «Обвязка» закроется 3 мая',              body: 'При текущем темпе закрытия задач — досрочно на 8 дней относительно плана.',              action: 'Открыть план'          },
    ],
  },
  'project:documents': {
    title: 'Рекомендации по документам',
    subtitle: 'Сроки и соответствие',
    items: [
      { tag: 'Документация', tagKind: 'warn', title: '3 разрешения истекают 30 апреля',            body: 'Разрешения на высотные работы. Требуется продление через Ростехнадзор — иначе остановка.', action: 'Открыть реестр' },
      { tag: 'Риск',         tagKind: 'crit', title: 'КС-2 по этапу «Обвязка» не подписан',        body: 'Акт готов, но не прошёл согласование. Задержка влияет на оплату субподрядчику.',          action: 'Открыть акт'    },
      { tag: 'Оптимизация',  tagKind: 'info', title: '8 документов ожидают верификации',            body: 'Назначьте ответственного — документы блокируют закрытие этапа.',                          action: 'Назначить'      },
    ],
  },
  'project:analytics': {
    title: 'Аналитические выводы',
    subtitle: 'Ключевые инсайты по проекту',
    items: [
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'КПД проекта: 89% (+3 п.п. к плану)',         body: 'Ключевые драйверы — ускорение монтажа Б-02 и снижение брака ОТК.',                       action: 'Детализировать'   },
      { tag: 'Риск',        tagKind: 'warn', title: 'Индекс рисков вырос на 2 пункта',             body: 'Причины: задержки поставок и перегрузка Б-01. Рекомендуется совещание с PM.',            action: 'Открыть риски'    },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Параллельная приёмка: −14 дней',              body: 'Совместить приёмку этапов 3 и 4 — сократит общий срок сдачи на 2 недели.',               action: 'Пересмотреть план' },
    ],
  },
  'project:chat': {
    title: 'Рекомендации по коммуникации',
    subtitle: 'Активность и ответы',
    items: [
      { tag: 'Риск',        tagKind: 'warn', title: 'Запрос подрядчика без ответа 3 дня',          body: 'СтройМонтаж ООО ожидает подтверждение допуска бригады. Промедление задержит выезд.',      action: 'Ответить сейчас'      },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Согласование КС-2 ведётся в чате',             body: 'Перенесите решение в «Документы» — это требует официальной фиксации.',                   action: 'Перейти к документам' },
    ],
  },
  'project:recommendations': {
    title: 'Сводные рекомендации',
    subtitle: 'Все выводы по проекту',
    items: [
      { tag: 'Безопасность', tagKind: 'crit', title: 'TI-1208-01: +7 °C выше нормы',              body: '342 °C превышает порог 335 °C. Требуется осмотр термопары до начала следующей смены.',    action: 'Открыть объект'       },
      { tag: 'Риск',         tagKind: 'warn', title: '3 разрешения истекают 30 апреля',             body: 'Разрешения на высотные работы. Необходимо продление через Ростехнадзор.',                 action: 'Открыть документы'    },
      { tag: 'Оптимизация',  tagKind: 'info', title: 'Экономия 48 млн ₽ на материалах',            body: 'Дублирование позиций в заказе стальных конструкций — оптимизация без потери качества.',  action: 'Открыть спецификацию' },
    ],
  },
  tasks: {
    title: 'Рекомендации по задачам',
    subtitle: 'Приоритеты по всем проектам',
    items: [
      { tag: 'Риск',        tagKind: 'warn', title: '12 задач просрочено по портфелю',             body: 'ЭЛОУ-АВТ-6 (5), НПЗ Кстово (4), Ванкор (3). Рекомендуется ежедневный статус-колл.',    action: 'Открыть просроченные' },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Иванов А.В.: 18 задач — перегрузка',          body: '6 задач можно делегировать — подходящие исполнители определены системой.',               action: 'Перераспределить'     },
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'Этап «Обвязка» закроется досрочно',           body: 'При текущем темпе — 3 мая вместо 11 мая. Согласуйте КС-2 заблаговременно.',             action: 'Открыть план'         },
    ],
  },
  documents: {
    title: 'Рекомендации по документам',
    subtitle: 'Реестр и сроки по портфелю',
    items: [
      { tag: 'Документация', tagKind: 'warn', title: '3 разрешения истекают 30 апреля',            body: 'Разрешения на высотные работы по проекту Усть-Луга. Необходимо продление.',               action: 'Открыть реестр'       },
      { tag: 'Риск',         tagKind: 'crit', title: 'КС-2 по 2 объектам не подписаны',             body: 'Задержка оплаты субподрядчикам — риск приостановки работ на площадке.',                  action: 'Открыть акты'         },
      { tag: 'Оптимизация',  tagKind: 'info', title: '31 документ ожидает верификации',             body: 'Автоматическая маршрутизация сократит время обработки на 40%.',                          action: 'Настроить маршруты'   },
    ],
  },
  telemetry: {
    title: 'Рекомендации по телеметрии',
    subtitle: 'Системные алерты и тренды',
    items: [
      { tag: 'Безопасность', tagKind: 'crit', title: '2 критичных алерта по датчикам',             body: 'TI-1208-01 (ЭЛОУ-АВТ-6) и PI-4401-01 (НПЗ Кстово) превышают пороговые значения.',       action: 'Открыть алерты'     },
      { tag: 'Риск',         tagKind: 'warn', title: '7 датчиков переведены в офлайн',              body: 'Плановое ТО. Проверьте сроки восстановления до начала активной фазы монтажа.',           action: 'Открыть список'     },
      { tag: 'Оптимизация',  tagKind: 'info', title: 'PI-1208-02: порог можно пересмотреть',        body: 'Рабочий диапазон стабильно ниже текущего порога на 15% — можно снизить ложные алерты.',  action: 'Настроить порог'    },
    ],
  },
  analytics: {
    title: 'Аналитические инсайты',
    subtitle: 'Ключевые выводы по портфелю',
    items: [
      { tag: 'Прогноз',     tagKind: 'ok',   title: 'Эффективность портфеля: 89%',                 body: 'Рост +3 п.п. к плану. Ключевые драйверы: Усть-Луга и Газоперерабатывающий-2.',           action: 'Открыть детали'  },
      { tag: 'Риск',        tagKind: 'warn', title: 'Перерасход в 3 проектах: 380 млн ₽',          body: 'Основная причина — задержки поставок. Рекомендуется пересмотр контрактов.',              action: 'Открыть анализ'  },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Консолидация закупок: −430 млн ₽',            body: '4 проекта могут объединить закупки арматуры и трубопровода в единый лот.',               action: 'Создать заявку'  },
    ],
  },
  contractors: {
    title: 'Рекомендации по подрядчикам',
    subtitle: 'Производительность и договоры',
    items: [
      { tag: 'Риск',         tagKind: 'warn', title: 'СтройМонтаж: задержка 14 дней',              body: 'Просроченный этап монтажа по договору №СМ-2024-18. Возможны штрафные санкции.',           action: 'Открыть договор'   },
      { tag: 'Прогноз',      tagKind: 'ok',   title: 'ТехноСтрой: КПД 108% от плана',              body: 'Субподрядчик опережает план. Рассмотрите расширение фронта работ.',                      action: 'Открыть карточку'  },
      { tag: 'Документация', tagKind: 'info', title: '2 договора требуют пролонгации в мае',        body: 'Начните согласование сейчас, чтобы избежать простоя при истечении срока.',               action: 'Открыть договоры'  },
    ],
  },
  contractor: {
    title: 'Рекомендации по подрядчику',
    subtitle: 'Показатели и риски',
    items: [
      { tag: 'Риск',         tagKind: 'warn', title: 'Задержка этапа монтажа на 14 дней',          body: 'Просроченный этап по договору. Уточните причины и скорректируйте план-график.',           action: 'Открыть договор'   },
      { tag: 'Оптимизация',  tagKind: 'info', title: 'Договор истекает в мае — начните продление', body: 'Заблаговременное согласование исключит риск простоя бригады.',                           action: 'Открыть договор'   },
    ],
  },
  chat: {
    title: 'Рекомендации по коммуникации',
    subtitle: 'Срочные ответы и задачи',
    items: [
      { tag: 'Риск',        tagKind: 'warn', title: '3 диалога без ответа более суток',            body: 'СтройМонтаж ООО, Алексей Козлов и BIM-отдел ожидают реакции — возможна задержка работ.', action: 'Открыть сообщения' },
      { tag: 'Оптимизация', tagKind: 'info', title: 'Ключевые решения не зафиксированы',           body: '4 договорённости приняты в чате, но не перенесены в задачи или документы.',              action: 'Создать задачи'    },
    ],
  },
};

const AIAssistantPanel = ({ context, onClose, onAllRecs }) => {
  const data = PANEL_RECS[context] || PANEL_RECS.overview;
  return (
    <div style={{
      width: 312, flexShrink: 0,
      borderLeft: '1px solid var(--border)',
      background: 'var(--background)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg, color-mix(in oklch, var(--primary) 8%, var(--card)) 0%, var(--card) 70%)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 'var(--radius-sm)',
            background: 'var(--primary)', color: 'var(--primary-foreground)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon name="sparkles" size={14} />
          </span>
          <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>AI-ассистент</span>
          <IconBtn onClick={onClose} title="Закрыть"><Icon name="x" size={14} /></IconBtn>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{data.title}</div>
        <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2 }}>{data.subtitle}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.items.map((r, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: 14,
            display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'start',
          }}>
            <Badge variant={r.tagKind} uppercase>{r.tag}</Badge>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{r.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.55, flex: 1 }}>{r.body}</div>
            <button style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: 0, background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--primary)', fontSize: 12, fontWeight: 500,
            }}>{r.action}<Icon name="arrow-right" size={12} /></button>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={onAllRecs} style={{
          width: '100%', padding: '7px 0',
          background: 'transparent', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', fontSize: 12, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          color: 'var(--muted-foreground)', fontWeight: 500,
          transition: 'background .15s, color .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
        >
          Все рекомендации <Icon name="arrow-right" size={12} />
        </button>
      </div>
    </div>
  );
};

const PROJECT_TABS = [
  { key: 'model',           label: 'Объект',          icon: 'box'            },
  { key: 'registry',        label: 'Оборудование',     icon: 'table'          },
  { key: 'brigades',        label: 'Бригады',          icon: 'hard-hat'       },
  { key: 'telemetry',       label: 'Телеметрия',       icon: 'activity'       },
  { key: 'media',           label: 'Фото/Видео',       icon: 'camera'         },
  { key: 'team',            label: 'Команда',          icon: 'users'          },
  { key: 'plan',            label: 'План',             icon: 'calendar'       },
  { key: 'budget',          label: 'Бюджет',           icon: 'trending-up'    },
  { key: 'tasks',           label: 'Задачи',           icon: 'check-square'   },
  { key: 'documents',       label: 'Документооборот',  icon: 'file-text'      },
  { key: 'analytics',       label: 'Аналитика',        icon: 'bar-chart'      },
  { key: 'recommendations', label: 'Рекомендации',     icon: 'sparkles'       },
  { key: 'whatif',          label: 'What-if',          icon: 'activity'       },
  { key: 'chat',            label: 'Чат',              icon: 'message-square' },
];

const ProjectDetailPage = ({ tab, onTabChange, selected, onSelect, projectId }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
    <KpiStrip />
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 16px', background: 'var(--background)', flexShrink: 0 }}>
      {PROJECT_TABS.map(t => (
        <button key={t.key} onClick={() => onTabChange(t.key)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '12px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: tab === t.key ? 600 : 400,
          color: tab === t.key ? 'var(--foreground)' : 'var(--muted-foreground)',
          borderBottom: tab === t.key ? '2px solid var(--primary)' : '2px solid transparent',
          marginBottom: -1,
        }}>
          <Icon name={t.icon} size={14} />{t.label}
        </button>
      ))}
    </div>
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      {tab === 'model' && (
        <React.Fragment>
          <ViewerCanvas selected={selected} onSelect={onSelect} />
          <InspectorPanel selected={selected} onClose={() => onSelect(null)} onOpenCard={() => onTabChange('analytics')} />
        </React.Fragment>
      )}
      {tab === 'registry'  && <AssetRegistry selected={selected} onSelect={(tag) => { onSelect(tag); onTabChange('model'); }} />}
      {tab === 'brigades'  && <BrigadesPage />}
      {tab === 'telemetry' && <ProjectTelemetry />}
      {tab === 'media'     && <MediaPage />}
      {tab === 'team'      && <TeamPage />}
      {tab === 'plan'      && <GanttPage />}
      {tab === 'budget'    && <BudgetPage />}
      {tab === 'tasks'           && <ProjectTasksTab projectId={projectId} />}
      {tab === 'documents'       && <ProjectDocumentsTab projectId={projectId} />}
      {tab === 'analytics'       && <ProjectAnalyticsTab />}
      {tab === 'recommendations' && <ProjectRecommendationsTab />}
      {tab === 'whatif'          && <ProjectWhatIfContent />}
      {tab === 'chat'            && <ProjectChatTab projectId={1} />}
    </div>
  </div>
);

// ─── Shell ─────────────────────────────────────────────────────────────────────
const Shell = () => {
  const [page,         setPage]         = useShellState('overview');
  const [projectId,    setProjectId]    = useShellState(null);
  const [projectTab,   setProjectTab]   = useShellState('model');
  const [contractorId, setContractorId] = useShellState(null);
  const [selected,     setSelected]     = useShellState(null);
  const [collapsed,    setCollapsed]    = useShellState(false);
  const [aiOpen,       setAiOpen]       = useShellState(false);
  const [viewport,     setViewport]     = useShellState(() => {
    const w = window.innerWidth;
    return w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
  });

  useShellEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setViewport(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop');
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isMobile = viewport === 'mobile';
  const isTablet  = viewport === 'tablet';

  const aiContext = page === 'project' ? `project:${projectTab}` : page;

  const navigate = (section) => { setPage(section); setProjectId(null); setContractorId(null); setProjectTab('model'); setSelected(null); };

  const openProject = (id) => { setPage('project'); setProjectId(id); setProjectTab('model'); setSelected(null); };

  const sidebarActive = page === 'project' ? 'projects' : page === 'contractor' ? 'contractors' : page === 'chat' ? 'chat' : page === 'allrecs' ? 'overview' : page === 'tasks' ? 'tasks' : page === 'documents' ? 'documents' : page === 'ontology' ? 'ontology' : page === 'whatif' ? 'whatif' : page;

  const crumbs = (() => {
    if (page === 'overview')     return [{ label: 'Обзор' }];
    if (page === 'allrecs')      return [{ label: 'Обзор', onClick: () => navigate('overview') }, { label: 'Все рекомендации' }];
    if (page === 'projects')     return [{ label: 'Проекты' }];
    if (page === 'project') {
      const p = (window.PROJECTS || []).find(x => x.id === projectId);
      return [{ label: 'Проекты', onClick: () => navigate('projects') }, { label: p ? p.name : '…' }];
    }
    if (page === 'contractors')  return [{ label: 'Подрядчики' }];
    if (page === 'contractor') {
      const c = (window.CONTRACTORS || []).find(x => x.id === contractorId);
      return [{ label: 'Подрядчики', onClick: () => navigate('contractors') }, { label: c ? c.name : '…' }];
    }
    if (page === 'tasks')        return [{ label: 'Задачи' }];
    if (page === 'documents')    return [{ label: 'Документооборот' }];
    if (page === 'telemetry')    return [{ label: 'Телеметрия' }];
    if (page === 'analytics')    return [{ label: 'Аналитика' }];
    if (page === 'chat')         return [{ label: 'Сообщения' }];
    if (page === 'notifications') return [{ label: 'Уведомления' }];
    if (page === 'settings')     return [{ label: 'Настройки' }];
    if (page === 'profile')      return [{ label: 'Мой профиль' }];
    if (page === 'ontology')     return [{ label: 'Онтология объектов' }];
    if (page === 'whatif')       return [{ label: 'What-if моделирование' }];
    return [{ label: page }];
  })();

  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--background)', color: 'var(--foreground)', overflow: 'hidden' }}>
      <Sidebar active={sidebarActive} onNav={navigate} collapsed={isTablet || collapsed} isMobile={isMobile} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={crumbs} onToggleSidebar={isMobile ? null : () => setCollapsed(c => !c)} collapsed={collapsed} onAvatarClick={() => navigate('profile')} onNotificationsClick={() => navigate('notifications')} aiOpen={aiOpen} onAiToggle={() => setAiOpen(o => !o)} isMobile={isMobile} />

        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden', paddingBottom: isMobile ? 64 : 0 }}>

            {page === 'overview' && <Portfolio onOpenProject={openProject} onAllRecs={() => setPage('allrecs')} />}

            {page === 'allrecs' && <PortfolioRecommendationsPage />}

            {page === 'projects' && <ProjectsListPage onOpenProject={openProject} />}

            {page === 'project' && (
              <ProjectDetailPage
                tab={projectTab}
                onTabChange={setProjectTab}
                selected={selected}
                onSelect={setSelected}
                projectId={projectId}
              />
            )}

            {page === 'contractors' && (
              <ContractorsPage contractorId={null} onSelect={(id) => { setContractorId(id); setPage('contractor'); }} />
            )}

            {page === 'contractor' && (
              <ContractorsPage contractorId={contractorId} onSelect={null} />
            )}

            {page === 'tasks'      && <TasksPage />}
            {page === 'documents'  && <DocumentsPage />}
            {page === 'telemetry'  && <TelemetryPage />}
            {page === 'analytics'  && <AnalyticsPage />}
            {page === 'chat'       && <ChatPage />}

            {page === 'notifications' && <NotificationsPage />}
            {page === 'settings'  && <SettingsPage />}
            {page === 'profile'   && <UserProfilePage onNavigateSettings={() => navigate('settings')} />}
            {page === 'ontology'  && <OntologyPage />}
            {page === 'whatif'    && <WhatIfPage onOpenProject={(id) => { setPage('project'); setProjectId(id); setProjectTab('whatif'); }} />}
          </div>

          {aiOpen && (
            <AIAssistantPanel
              context={aiContext}
              onClose={() => setAiOpen(false)}
              onAllRecs={() => { setPage('allrecs'); setAiOpen(false); }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

window.Shell = Shell;
