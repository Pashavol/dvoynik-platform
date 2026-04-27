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
  const lottieRef = useSidebarRef(null);

  useSidebarEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useSidebarEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useSidebarEffect(() => {
    if (!lottieRef.current) return;
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: './ai-robot.json',
    });
    return () => anim.destroy();
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
                <div ref={lottieRef} style={{ width: 140, height: 130, pointerEvents: 'none' }} />
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

/* ── Bottom navigation (mobile) ─────────────────────────────── */
const BottomNav = ({ active, onNav }) => {
  const [moreOpen, setMoreOpen] = useSidebarState(false);

  const MAIN = [
    { key: 'overview',  icon: 'home',           label: 'Обзор'     },
    { key: 'projects',  icon: 'folder',          label: 'Проекты'   },
    { key: 'tasks',     icon: 'check-square',    label: 'Задачи'    },
    { key: 'chat',      icon: 'message-square',  label: 'Сообщения' },
  ];

  const MORE = [
    { key: 'documents',   icon: 'file-text',  label: 'Документооборот' },
    { key: 'contractors', icon: 'users',       label: 'Подрядчики'      },
    { key: 'telemetry',   icon: 'activity',   label: 'Телеметрия'      },
    { key: 'analytics',   icon: 'bar-chart',  label: 'Аналитика'       },
    { key: 'settings',    icon: 'settings',   label: 'Настройки'       },
  ];

  const moreActive = MORE.some(i => i.key === active);

  return ReactDOM.createPortal(
    <>
      {moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.48)' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', bottom: 64, left: 0, right: 0,
              background: 'var(--sidebar)',
              borderTop: '1px solid var(--sidebar-border)',
              borderRadius: '16px 16px 0 0',
              padding: '12px 16px 24px',
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--border)', margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {MORE.map(it => (
                <button
                  key={it.key}
                  onClick={() => { onNav(it.key); setMoreOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 14px', borderRadius: 'var(--radius)',
                    background: active === it.key ? 'var(--sidebar-accent)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
                    color: active === it.key ? 'var(--primary)' : 'var(--foreground)',
                  }}
                >
                  <span style={{ color: active === it.key ? 'var(--primary)' : 'var(--muted-foreground)', display: 'flex', flexShrink: 0 }}>
                    <Icon name={it.icon} size={20} />
                  </span>
                  <span style={{ fontSize: 14, fontWeight: active === it.key ? 600 : 400 }}>{it.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: 'var(--sidebar)',
        borderTop: '1px solid var(--sidebar-border)',
        display: 'flex', alignItems: 'stretch',
      }}>
        {MAIN.map(it => (
          <button
            key={it.key}
            onClick={() => onNav(it.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: active === it.key ? 'var(--primary)' : 'var(--muted-foreground)',
              fontSize: 10, fontWeight: active === it.key ? 600 : 400,
              transition: 'color .12s', padding: '8px 0',
            }}
          >
            <Icon name={it.icon} size={22} />
            <span>{it.label}</span>
          </button>
        ))}
        <button
          onClick={() => setMoreOpen(o => !o)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3,
            background: moreOpen ? 'var(--sidebar-accent)' : 'none', border: 'none', cursor: 'pointer',
            color: moreActive || moreOpen ? 'var(--primary)' : 'var(--muted-foreground)',
            fontSize: 10, fontWeight: moreActive || moreOpen ? 600 : 400,
            transition: 'color .12s', padding: '8px 0',
          }}
        >
          <Icon name="more" size={22} />
          <span>Ещё</span>
        </button>
      </nav>
    </>,
    document.body
  );
};

/* ── Sidebar ────────────────────────────────────────────────── */
const Sidebar = ({ active, onNav, collapsed, isMobile }) => {
  const [aiOpen,          setAiOpen]          = useSidebarState(false);
  const [telemetryUnread, setTelemetryUnread] = useSidebarState(0);

  useSidebarEffect(() => {
    const handler = () => setTelemetryUnread(window.TELEMETRY_UNREAD || 0);
    window.addEventListener('telemetry-update', handler);
    return () => window.removeEventListener('telemetry-update', handler);
  }, []);

  const lottieMount = React.useCallback((node) => {
    if (!node) return;
    lottie.loadAnimation({ container: node, renderer: 'svg', loop: true, autoplay: true, path: './ai-robot.json' });
  }, []);

  const item = (key, icon, label, badge = 0) => (
    <div
      onClick={() => {
        onNav(key);
        if (key === 'telemetry' && (window.TELEMETRY_UNREAD || 0) > 0) {
          window.TELEMETRY_UNREAD = 0;
          setTelemetryUnread(0);
        }
      }}
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
        position: 'relative',
      }}
      onMouseEnter={e => { if (active !== key) e.currentTarget.style.background = 'var(--sidebar-accent)'; }}
      onMouseLeave={e => { if (active !== key) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ color: active === key ? 'var(--primary)' : 'var(--muted-foreground)', display: 'flex', flexShrink: 0, position: 'relative' }}>
        <Icon name={icon} size={16} />
        {collapsed && badge > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--primary)', border: '1.5px solid var(--sidebar)',
          }} />
        )}
      </span>
      {!collapsed && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
      {!collapsed && badge > 0 && (
        <span style={{
          minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px',
          background: 'var(--primary)', color: 'var(--primary-foreground)',
          fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</span>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <BottomNav active={active} onNav={onNav} />
        {aiOpen && <AIChatModal onClose={() => setAiOpen(false)} />}
      </>
    );
  }

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

      {item('overview',    'home',           'Обзор')}
      {item('projects',    'folder',         'Проекты')}
      {item('tasks',       'check-square',   'Задачи', window.TASKS_OPEN_COUNT || 0)}
      {item('chat',        'message-square', 'Сообщения', window.CHAT_TOTAL_UNREAD || 0)}
      {item('documents',   'file-text',      'Документооборот')}
      {item('contractors', 'users',          'Подрядчики')}
      {item('telemetry',   'activity',       'Телеметрия', telemetryUnread)}
      {item('analytics',   'bar-chart',      'Аналитика')}
      {item('whatif',      'sparkles',       'What-if')}

      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--muted-foreground)',
        padding: collapsed ? '12px 0 4px' : '12px 6px 4px',
        overflow: 'hidden',
        textAlign: collapsed ? 'center' : 'left',
        flexShrink: 0,
      }}>
        {collapsed
          ? <span style={{ display: 'block', height: 1, background: 'var(--sidebar-border)', margin: '0 4px' }} />
          : 'Администрирование'}
      </div>
      {item('ontology',  'share-2',  'Онтология')}
      {item('settings',  'settings', 'Настройки')}

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
          <div ref={lottieMount} style={{ width: 34, height: 34, pointerEvents: 'none' }} />
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
            <div ref={lottieMount} style={{ width: 118, height: 108, pointerEvents: 'none' }} />
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

      {/* Modal */}
      {aiOpen && <AIChatModal onClose={() => setAiOpen(false)} />}
    </aside>
  );
};

window.Sidebar = Sidebar;
