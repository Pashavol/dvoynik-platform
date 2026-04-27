// NotificationsPage.jsx
const { useState: useNotifState } = React;

const ALL_NOTIFICATIONS = [
  {
    id: 1, kind: 'crit', read: false,
    title: 'Температурное отклонение датчика TI-1208-01',
    body: 'Значение 342 °C превышает регламентный порог 335 °C. Требуется внеплановая проверка термопары и теплоизоляции V-1208.',
    project: 'ЭЛОУ-АВТ-6 · Блок 2', source: 'Телеметрия',
    time: '09:42', date: '25.04.2026',
  },
  {
    id: 2, kind: 'warn', read: false,
    title: 'Истекает срок 3 разрешений на высотные работы',
    body: 'Разрешения истекают 30 апреля. Необходимо продление через Ростехнадзор — иначе остановка работ.',
    project: 'Усть-Луга ХБ-2', source: 'Реестр документов',
    time: '08:15', date: '25.04.2026',
  },
  {
    id: 3, kind: 'warn', read: false,
    title: 'Перегрузка бригады Б-01 на следующей неделе',
    body: 'Бригада назначена на три параллельных фронта работ. Рекомендуется перераспределить одну задачу на Б-03.',
    project: 'Ванкорский кластер', source: 'Планирование ресурсов',
    time: '07:50', date: '25.04.2026',
  },
  {
    id: 4, kind: 'warn', read: true,
    title: 'Отклонение графика монтажа на 14 дней',
    body: 'Задержка поставки трубопроводной арматуры DN500 от «МеталлТорг» сдвигает начало монтажного этапа.',
    project: 'НПЗ Кстово', source: 'Анализ поставок',
    time: '11:30', date: '24.04.2026',
  },
  {
    id: 5, kind: 'info', read: true,
    title: 'Экономия 340 млн ₽: замена поставщика трубопровода',
    body: 'АО «ТМК» предлагает Ду-1200 дешевле на 8,2% при сроке поставки на 6 недель меньше.',
    project: 'Ванкорский кластер', source: 'Анализ бюджета',
    time: '14:18', date: '24.04.2026',
  },
  {
    id: 6, kind: 'ok', read: true,
    title: 'Досрочный ввод 23 сентября — на 11 дней раньше плана',
    body: 'При текущем темпе бетонирования плит №4–7 объект выйдет на пусконаладку раньше срока.',
    project: 'Усть-Луга ХБ-2', source: 'Мониторинг прогресса',
    time: '10:05', date: '24.04.2026',
  },
  {
    id: 7, kind: 'info', read: true,
    title: 'Новый документ добавлен в реестр',
    body: 'Паспорт оборудования P-2340-A успешно загружен и прошёл верификацию.',
    project: 'ЭЛОУ-АВТ-6 · Блок 2', source: 'Реестр документов',
    time: '16:05', date: '23.04.2026',
  },
  {
    id: 8, kind: 'ok', read: true,
    title: 'BIM-модель обновлена до версии v2.14',
    body: 'Загрузка и верификация модели завершены. Расхождения по осям X и Y устранены.',
    project: 'ЭЛОУ-АВТ-6 · Блок 2', source: 'BIM-платформа',
    time: '10:22', date: '22.04.2026',
  },
  {
    id: 9, kind: 'ok', read: true,
    title: 'Готовность BIM-модели достигнет 95% к 1 мая',
    body: 'Текущий прогресс верификации опережает план на 4%. Модель будет готова к сдаче за неделю до контрольной точки.',
    project: 'Амурский ГПЗ · Очередь 3', source: 'BIM-платформа',
    time: '09:10', date: '22.04.2026',
  },
  {
    id: 10, kind: 'info', read: true,
    title: 'Консолидация закупок арматуры — экономия 90 млн ₽',
    body: '4 проекта в одном регионе закупают арматуру у разных поставщиков. Единый лот снизит стоимость на 12%.',
    project: 'Амурский ГПЗ · Очередь 3', source: 'Анализ закупок',
    time: '15:44', date: '21.04.2026',
  },
];

const KIND_ICON = { crit: 'alert-octagon', warn: 'alert-triangle', info: 'zap', ok: 'check-circle' };
const KIND_LABEL = { crit: 'Критичное', warn: 'Предупреждение', info: 'Оптимизация', ok: 'Прогноз' };

const NotificationsPage = () => {
  const [items, setItems] = useNotifState(ALL_NOTIFICATIONS);
  const [filter, setFilter] = useNotifState('all');

  const unread = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const FILTERS = [
    { key: 'all',   label: 'Все'             },
    { key: 'unread',label: 'Непрочитанные'   },
    { key: 'crit',  label: 'Критичные'       },
    { key: 'warn',  label: 'Предупреждения'  },
    { key: 'info',  label: 'Оптимизация'     },
    { key: 'ok',    label: 'Прогнозы'        },
  ];

  const visible = items.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter !== 'all') return n.kind === filter;
    return true;
  });

  const grouped = visible.reduce((acc, n) => {
    const key = n.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

  const groupKeys = Object.keys(grouped);

  const dateLabel = (d) => {
    if (d === '25.04.2026') return 'Сегодня';
    if (d === '24.04.2026') return 'Вчера';
    return d;
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24, background: 'var(--muted)' }}>

      {/* Header */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--primary)',
          color: 'var(--primary-foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="bell" size={18} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Уведомления</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>
            {unread > 0 ? `${unread} непрочитанных · ` : 'Все прочитаны · '}{items.length} всего
          </div>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Icon name="check" size={13} />Отметить все прочитанными
          </Button>
        )}
      </div>

      {/* Filter strip */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '5px 14px', borderRadius: 'var(--radius)', border: '1px solid',
            borderColor: filter === f.key ? 'var(--primary)' : 'var(--border)',
            background: filter === f.key ? 'var(--primary)' : 'var(--card)',
            color: filter === f.key ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 13, cursor: 'pointer', fontWeight: filter === f.key ? 600 : 400,
          }}>{f.label}</button>
        ))}
      </div>

      {/* Notification groups */}
      {groupKeys.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-foreground)' }}>
          <Icon name="bell" size={32} />
          <div style={{ marginTop: 12, fontWeight: 500 }}>Уведомлений нет</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Попробуйте изменить фильтр</div>
        </div>
      ) : groupKeys.map(date => (
        <div key={date} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            {dateLabel(date)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {grouped[date].map((n, i) => (
              <div key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  display: 'flex', gap: 14, padding: '14px 16px',
                  background: n.read ? 'var(--card)' : 'color-mix(in oklch, var(--primary) 5%, var(--card))',
                  borderBottom: i < grouped[date].length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: n.read ? 'default' : 'pointer',
                  transition: 'background .1s',
                }}
                onMouseEnter={e => { if (!n.read) e.currentTarget.style.background = 'color-mix(in oklch, var(--primary) 8%, var(--card))'; }}
                onMouseLeave={e => { if (!n.read) e.currentTarget.style.background = 'color-mix(in oklch, var(--primary) 5%, var(--card))'; }}
              >
                {/* Unread indicator */}
                <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 2, gap: 8, flexShrink: 0 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: n.read ? 'transparent' : 'var(--primary)',
                  }} />
                  <StatusDot kind={n.kind} size={8} style={{ marginTop: 3 }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <Badge variant={n.kind} uppercase style={{ flexShrink: 0 }}>{KIND_LABEL[n.kind]}</Badge>
                    <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginLeft: 'auto', flexShrink: 0 }}>
                      {n.time}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, lineHeight: 1.4, marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.5, marginBottom: 6 }}>{n.body}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted-foreground)' }}>
                    <Icon name="folder" size={11} />{n.project}
                    <span style={{ marginLeft: 8, fontFamily: 'var(--font-mono)' }}>{n.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

window.NotificationsPage = NotificationsPage;
window.ALL_NOTIFICATIONS = ALL_NOTIFICATIONS;
