// Sidebar.jsx
const { useState: useSidebarState, useEffect: useSidebarEffect, useRef: useSidebarRef } = React;

/* ── Recommendation cards ───────────────────────────────────── */
const RECS = [
  { id: 'devs',   icon: 'alert-triangle', label: 'Активные отклонения', sub: '3 объекта',          q: 'Какие активные отклонения в проекте?' },
  { id: 'e4401',  icon: 'alert-circle',   label: 'Статус E-4401',       sub: 'Критическое',        q: 'Каков статус теплообменника E-4401?' },
  { id: 'model',  icon: 'layers',         label: 'Готовность модели',   sub: '68% завершено',      q: 'Какова текущая готовность BIM-модели?' },
  { id: 'phases', icon: 'trending-up',    label: 'Сводка по этапам',    sub: 'Этап 5 из 8',        q: 'Дай сводку по этапам строительства.' },
  { id: 'risks',  icon: 'activity',       label: 'Риски и сроки',       sub: 'Анализ отставания',  q: 'Есть ли риски отставания от графика?' },
  { id: 'team',   icon: 'users',          label: 'Команда проекта',     sub: '3 участника',        q: 'Кто участвует в проекте?' },
];

/* ── Mock AI responses ──────────────────────────────────────── */
const AI_ANSWERS = {
  'Какие активные отклонения в проекте?':
    'Зафиксировано 3 отклонения:\n\n• E-4401 — трещина в сварном шве (критическое, 23.04.2026)\n• V-1208 — расхождение толщины стенки −0,8 мм (12.03.2026)\n• V-1208 — смещение по оси X +45 мм (08.03.2026)\n\nТребуется внеплановый осмотр E-4401 в течение 24 ч.',
  'Каков статус теплообменника E-4401?':
    'Теплообменник E-4401 — статус КРИТИЧЕСКИЙ.\n\nПлощадь теплообмена: 1 240 м², материал корпуса: 12Х18Н10Т, давление: 2,1 МПа.\n\nПоследнее событие: 23.04.2026 зафиксирована трещина в сварном шве. Рекомендую назначить инспекцию немедленно.',
  'Какова текущая готовность BIM-модели?':
    'Готовность BIM-модели — 68%.\n\nТекущий этап: 5 из 8 «Оборудование смонтировано».\nПоследнее обновление: v1.4 от 01.02.2026.\nДо плановой сдачи: 62 дня.',
  'Дай сводку по этапам строительства.':
    'Этапы проекта ЭЛОУ-АВТ-6 · Блок 2:\n\n✓ 1 — Проектирование\n✓ 2 — Площадка\n✓ 3 — Фундамент\n✓ 4 — Металлоконструкции\n● 5 — Оборудование (текущий)\n○ 6 — КИПиА (план)\n○ 7 — Пуско-наладка (план)\n\nОбщий прогресс: 68%.',
  'Есть ли риски отставания от графика?':
    'Выявлено 2 риска:\n\n1. Критический дефект E-4401 может задержать монтаж КИПиА на 2–4 недели.\n2. Расхождения по V-1208 требуют дополнительной проверки перед пуском.\n\nРекомендую актуализировать план-график с учётом результатов инспекции.',
  'Кто участвует в проекте?':
    'Команда проекта:\n\n• Иванов А.В. — BIM-менеджер\n• Петров Д.К. — Контроль качества\n• ПКБ-3 — Проектный институт\n\nПодрядчик монтажа: СУ-17\nЗаказчик: ПАО «Нефтехим-Волга»',
};

const getAiReply = (q) => {
  if (AI_ANSWERS[q]) return AI_ANSWERS[q];
  const l = q.toLowerCase();
  if (l.includes('e-4401') || l.includes('теплообменник')) return AI_ANSWERS['Каков статус теплообменника E-4401?'];
  if (l.includes('отклон')) return AI_ANSWERS['Какие активные отклонения в проекте?'];
  if (l.includes('готовность') || l.includes('bim') || l.includes('модел')) return AI_ANSWERS['Какова текущая готовность BIM-модели?'];
  if (l.includes('этап') || l.includes('строит')) return AI_ANSWERS['Дай сводку по этапам строительства.'];
  if (l.includes('риск') || l.includes('срок') || l.includes('график')) return AI_ANSWERS['Есть ли риски отставания от графика?'];
  if (l.includes('команд') || l.includes('участник')) return AI_ANSWERS['Кто участвует в проекте?'];
  return 'Анализирую данные проекта ЭЛОУ-АВТ-6 · Блок 2…\n\nГотовность модели: 68%, этап 5/8, активных отклонений: 3. Уточните запрос — дам более детальный ответ.';
};

/* ── Chat modal ─────────────────────────────────────────────── */
const AIChatModal = ({ onClose }) => {
  const [messages, setMessages] = useSidebarState([]);
  const [input, setInput] = useSidebarState('');
  const [typing, setTyping] = useSidebarState(false);
  const bottomRef = useSidebarRef(null);
  const inputRef = useSidebarRef(null);

  useSidebarEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useSidebarEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const send = (text) => {
    const q = (text !== undefined ? text : input).trim();
    if (!q || typing) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: getAiReply(q) }]);
      setTyping(false);
    }, 850);
  };

  const hasMessages = messages.length > 0;

  const LOTTIE = '../../assets/Ai%20Robot%20Vector%20Art.lottie';

  const modal = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.48)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 500, maxWidth: 'calc(100vw - 40px)',
          height: 640, maxHeight: 'calc(100vh - 40px)',
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >

        {/* ── Header ────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'color-mix(in oklch, var(--primary) 5%, var(--card))',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}>
              <Icon name="sparkles" size={16} />
            </span>
            <span style={{ fontWeight: 700, fontSize: 15 }}>AI Ассистент</span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4,
              background: 'color-mix(in oklch, var(--primary) 15%, transparent)',
              color: 'var(--primary)',
            }}>Beta</span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 'var(--radius-sm)',
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--muted-foreground)', transition: 'background .12s, color .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--muted)'; e.currentTarget.style.color = 'var(--foreground)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {!hasMessages ? (
            /* Empty state */
            <div style={{ flex: 1, overflowY: 'auto' }}>

              {/* Lottie + greeting */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '24px 24px 20px',
                background: 'color-mix(in oklch, var(--primary) 4%, transparent)',
                borderBottom: '1px solid var(--border)',
              }}>
                <dotlottie-player
                  src={LOTTIE}
                  autoplay=""
                  loop=""
                  style={{ width: 140, height: 130, pointerEvents: 'none' }}
                />
                <div style={{ fontWeight: 700, fontSize: 18, marginTop: 2 }}>Чем могу помочь?</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 5, textAlign: 'center', lineHeight: 1.6 }}>
                  Задайте вопрос по проекту<br />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>ЭЛОУ-АВТ-6 · Блок 2</span>
                </div>
              </div>

              {/* Recommendations grid */}
              <div style={{ padding: '18px 16px' }}>
                <div style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.13em',
                  textTransform: 'uppercase', color: 'var(--muted-foreground)',
                  marginBottom: 12,
                }}>Рекомендации</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {RECS.map(r => (
                    <div
                      key={r.id}
                      onClick={() => send(r.q)}
                      style={{
                        padding: '11px 13px', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                        background: 'var(--card)',
                        cursor: 'pointer',
                        transition: 'border-color .12s, background .12s, box-shadow .12s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'color-mix(in oklch, var(--primary) 55%, var(--border))';
                        e.currentTarget.style.background = 'color-mix(in oklch, var(--primary) 5%, var(--card))';
                        e.currentTarget.style.boxShadow = '0 2px 8px color-mix(in oklch, var(--primary) 12%, transparent)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--card)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>
                          <Icon name={r.icon} size={13} />
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.3 }}>{r.label}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted-foreground)', paddingLeft: 19 }}>{r.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat messages */
            <div style={{
              flex: 1, overflowY: 'auto',
              padding: '16px 16px 8px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start', gap: 8,
                }}>
                  {m.role === 'ai' && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'color-mix(in oklch, var(--primary) 14%, var(--muted))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary)', marginTop: 1,
                    }}>
                      <Icon name="sparkles" size={12} />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '74%', padding: '9px 13px',
                    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role === 'user'
                      ? 'var(--primary)'
                      : 'color-mix(in oklch, var(--primary) 7%, var(--muted))',
                    color: m.role === 'user' ? 'var(--primary-foreground)' : 'var(--foreground)',
                    fontSize: 13, lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'color-mix(in oklch, var(--primary) 14%, var(--muted))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)',
                  }}>
                    <Icon name="sparkles" size={12} />
                  </div>
                  <div style={{
                    padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                    background: 'color-mix(in oklch, var(--primary) 7%, var(--muted))',
                    display: 'flex', gap: 5, alignItems: 'center', height: 38,
                  }}>
                    {[0, 1, 2].map(d => (
                      <div key={d} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--muted-foreground)',
                        animation: `typing-dot 1.1s ease-in-out ${d * 0.18}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Recommendation chips strip (shown when chat has messages) */}
          {hasMessages && (
            <div style={{
              padding: '8px 12px',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: 6, overflowX: 'auto',
              flexShrink: 0,
              scrollbarWidth: 'none',
            }}>
              {RECS.map(r => (
                <button
                  key={r.id}
                  onClick={() => send(r.q)}
                  style={{
                    flexShrink: 0, height: 26, padding: '0 11px',
                    borderRadius: 13,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--muted-foreground)',
                    fontSize: 11, cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'border-color .12s, background .12s, color .12s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.background = 'color-mix(in oklch, var(--primary) 8%, transparent)';
                    e.currentTarget.style.color = 'var(--foreground)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--muted-foreground)';
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Input bar ─────────────────────────────────────── */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 8, alignItems: 'center',
          flexShrink: 0,
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
            placeholder="Спросить о проекте…"
            style={{
              flex: 1, height: 38, padding: '0 13px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: 13, outline: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'border-color .15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            onClick={() => send()}
            style={{
              width: 38, height: 38, flexShrink: 0,
              borderRadius: 'var(--radius)',
              background: 'var(--primary)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary-foreground)',
              transition: 'opacity .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.82'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <Icon name="send" size={14} />
          </button>
        </div>

      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

/* ── Sidebar ────────────────────────────────────────────────── */
const Sidebar = ({ active, onNav, collapsed }) => {
  const [aiOpen, setAiOpen] = useSidebarState(false);

  const LOTTIE = '../../assets/Ai%20Robot%20Vector%20Art.lottie';

  const item = (key, icon, label) => (
    <div
      onClick={() => onNav(key)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '8px' : '7px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--sidebar-foreground)',
        fontSize: 14, cursor: 'pointer',
        background: active === key ? 'var(--sidebar-accent)' : 'transparent',
        fontWeight: active === key ? 500 : 400,
        transition: 'background .12s',
      }}
      onMouseEnter={e => { if (active !== key) e.currentTarget.style.background = 'var(--sidebar-accent)'; }}
      onMouseLeave={e => { if (active !== key) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ color: active === key ? 'var(--primary)' : 'var(--muted-foreground)', display: 'flex', flexShrink: 0 }}>
        <Icon name={icon} size={16} />
      </span>
      {!collapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
    </div>
  );

  return (
    <aside style={{
      width: collapsed ? 56 : 240,
      background: 'var(--sidebar)',
      borderRight: '1px solid var(--sidebar-border)',
      padding: 12,
      flexShrink: 0,
      overflow: 'hidden',
      transition: 'width .2s',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 6px 16px', color: 'var(--foreground)', flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
          <circle cx="18" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="30" cy="24" r="14" fill="none" stroke="var(--primary)" strokeWidth="2.5" />
        </svg>
        {!collapsed && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '0.04em' }}>STRATUM</span>}
      </div>

      {item('overview',    'home',     'Обзор')}
      {item('projects',    'folder',   'Проекты')}
      {item('contractors', 'users',    'Подрядчики')}
      {item('telemetry',   'activity',   'Телеметрия')}
      {item('analytics',   'bar-chart',  'Аналитика')}

      <div style={{ flex: 1 }} />

      {/* ── AI Assistant block ───────────────────────────── */}
      {collapsed ? (
        /* Collapsed: small lottie button */
        <div
          title="AI Ассистент"
          onClick={() => setAiOpen(true)}
          style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '4px 0', marginBottom: 4, cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            transition: 'background .12s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-accent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <dotlottie-player
            src={LOTTIE}
            autoplay=""
            loop=""
            style={{ width: 34, height: 34, pointerEvents: 'none' }}
          />
        </div>
      ) : (
        /* Expanded: card with lottie + open button */
        <div style={{
          marginBottom: 6,
          borderRadius: 'var(--radius)',
          border: '1px solid color-mix(in oklch, var(--primary) 22%, var(--border))',
          background: 'color-mix(in oklch, var(--primary) 5%, var(--sidebar))',
          overflow: 'hidden',
        }}>
          {/* Lottie area */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            background: 'color-mix(in oklch, var(--primary) 8%, transparent)',
            borderBottom: '1px solid color-mix(in oklch, var(--primary) 14%, var(--border))',
            paddingTop: 4,
          }}>
            <dotlottie-player
              src={LOTTIE}
              autoplay=""
              loop=""
              style={{ width: 118, height: 108, pointerEvents: 'none' }}
            />
          </div>

          {/* Title + subtitle */}
          <div style={{ padding: '10px 12px 4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--primary)', display: 'flex' }}>
                  <Icon name="sparkles" size={13} />
                </span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>AI Ассистент</span>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '2px 6px', borderRadius: 4,
                background: 'color-mix(in oklch, var(--primary) 15%, transparent)',
                color: 'var(--primary)',
              }}>Beta</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 10 }}>
              Задайте вопрос по проекту
            </div>
          </div>

          {/* Open button */}
          <div style={{ padding: '0 10px 10px' }}>
            <button
              onClick={() => setAiOpen(true)}
              style={{
                width: '100%', height: 30,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                color: 'var(--primary-foreground)',
                fontSize: 12, fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <Icon name="sparkles" size={12} />
              Открыть чат
            </button>
          </div>
        </div>
      )}

      {item('settings', 'settings', 'Настройки')}

      {/* Modal */}
      {aiOpen && <AIChatModal onClose={() => setAiOpen(false)} />}
    </aside>
  );
};

window.Sidebar = Sidebar;
