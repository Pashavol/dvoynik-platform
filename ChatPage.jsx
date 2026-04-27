// ChatPage.jsx — Slack-like messaging: project channels, direct messages, contractor chats
const { useState: useChatState, useEffect: useChatEffect, useRef: useChatRef } = React;

// ── Mock data ────────────────────────────────────────────────────────────────────
const CHAT_THREADS = [
  { id: 'proj-1', type: 'project',    name: 'ЭЛОУ-АВТ-6 · Блок 2',          unread: 3, lastMsg: 'Добавили новые фото объекта',           lastTime: '14:32' },
  { id: 'proj-2', type: 'project',    name: 'Резервуарный парк Самара',       unread: 0, lastMsg: 'Отчёт за прошлую неделю готов',         lastTime: 'Вчера' },
  { id: 'proj-3', type: 'project',    name: 'НПЗ Башнефть — Модернизация',   unread: 1, lastMsg: 'BIM обновлён до v2.14',                 lastTime: '09:15' },
  { id: 'dm-1',   type: 'direct',     name: 'Алексей Козлов',  role: 'Менеджер проекта',   initials: 'АК', hue: 220, online: true,  unread: 1, lastMsg: 'Понял, завтра пришлю документы', lastTime: '12:15' },
  { id: 'dm-2',   type: 'direct',     name: 'Мария Петрова',   role: 'Инженер-технолог',   initials: 'МП', hue: 160, online: false, unread: 0, lastMsg: 'Схема обновлена',                 lastTime: 'Вчера' },
  { id: 'dm-3',   type: 'direct',     name: 'Дмитрий Сидоров', role: 'BIM-менеджер',       initials: 'ДС', hue: 280, online: false, unread: 0, lastMsg: 'Версия v2.14 загружена',           lastTime: 'Пн'    },
  { id: 'con-1',  type: 'contractor', name: 'СтройМонтаж ООО', role: 'Генподрядчик',       initials: 'СМ', hue: 30,  online: true,  unread: 5, lastMsg: 'Выезд бригады на объект в 08:00', lastTime: '09:45' },
  { id: 'con-2',  type: 'contractor', name: 'ТехноСтрой ПАО',  role: 'Субподрядчик',       initials: 'ТС', hue: 10,  online: false, unread: 0, lastMsg: 'Акт КС-2 подписан',               lastTime: 'Ср'    },
];

const INIT_MESSAGES = {
  'proj-1': [
    { id: 1, author: 'Иван Смирнов',    initials: 'ИС', hue: 200, time: '13:10', date: 'Сегодня', text: 'Коллеги, завтра плановый осмотр объекта. Прошу всех подтвердить присутствие.', own: false },
    { id: 2, author: 'Мария Петрова',   initials: 'МП', hue: 160, time: '13:22',                  text: 'Буду, уточните время.', own: false },
    { id: 3, author: 'Вы',              initials: 'АК', hue: 220, time: '13:28',                  text: 'Подтверждаю, буду в 10:00.', own: true },
    { id: 4, author: 'Мария Петрова',   initials: 'МП', hue: 160, time: '14:32',                  text: 'Добавили новые фото объекта — участок монтажа насосной группы.', own: false },
  ],
  'proj-2': [
    { id: 1, author: 'Сергей Орлов',    initials: 'СО', hue: 40,  time: '11:00', date: 'Вчера',   text: 'Отчёт за прошлую неделю готов, проверяйте в разделе документов.', own: false },
  ],
  'proj-3': [
    { id: 1, author: 'BIM-отдел',       initials: 'БО', hue: 260, time: '09:15', date: 'Сегодня', text: 'Обновили BIM-модель до версии v2.14. Изменения: уточнены позиции E-4401, V-1208.', own: false },
  ],
  'dm-1': [
    { id: 1, author: 'Алексей Козлов',  initials: 'АК', hue: 220, time: '11:50', date: 'Сегодня', text: 'Привет! Можешь прислать актуальный план-график?', own: false },
    { id: 2, author: 'Вы',              initials: 'АК', hue: 220, time: '12:03',                  text: 'Да, сейчас подготовлю.', own: true },
    { id: 3, author: 'Алексей Козлов',  initials: 'АК', hue: 220, time: '12:15',                  text: 'Понял, завтра пришлю документы в любом случае.', own: false },
  ],
  'dm-2': [
    { id: 1, author: 'Мария Петрова',   initials: 'МП', hue: 160, time: '16:30', date: 'Вчера',   text: 'Схема обновлена, версия R3. Жду подтверждения.', own: false },
  ],
  'dm-3': [
    { id: 1, author: 'Дмитрий Сидоров', initials: 'ДС', hue: 280, time: '14:00', date: 'Пн',      text: 'Версия v2.14 загружена, все элементы верифицированы.', own: false },
  ],
  'con-1': [
    { id: 1, author: 'СтройМонтаж ООО', initials: 'СМ', hue: 30,  time: '07:12', date: 'Сегодня', text: 'Добрый день. Бригада готова, ждём разрешения на въезд.', own: false },
    { id: 2, author: 'Вы',              initials: 'АК', hue: 220, time: '07:45',                  text: 'Пропуск оформлен, въезд разрешён с 08:00.', own: true },
    { id: 3, author: 'СтройМонтаж ООО', initials: 'СМ', hue: 30,  time: '09:45',                  text: 'Выезд бригады на объект в 08:00. Приступили к монтажу насосного агрегата P-2340-B.', own: false },
  ],
  'con-2': [
    { id: 1, author: 'ТехноСтрой ПАО',  initials: 'ТС', hue: 10,  time: '10:00', date: 'Ср',      text: 'Акт КС-2 подписан, передаём в бухгалтерию.', own: false },
  ],
};

// ── Avatar ────────────────────────────────────────────────────────────────────────
const ChatAvatar = ({ initials, hue = 220, size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: `oklch(0.72 0.13 ${hue})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: Math.round(size * 0.36), fontWeight: 700, color: '#fff',
    letterSpacing: '-0.02em', userSelect: 'none',
  }}>
    {initials}
  </div>
);

// ── Thread list row ───────────────────────────────────────────────────────────────
const ThreadRow = ({ thread, active, onClick }) => {
  const isProject = thread.type === 'project';
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
        borderRadius: 'var(--radius-sm)', cursor: 'pointer',
        background: active ? 'var(--accent)' : 'transparent',
        transition: 'background .12s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--accent)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Icon / avatar */}
      {isProject ? (
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'color-mix(in oklch, var(--primary) 16%, var(--muted))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
        }}>
          <Icon name="folder" size={14} />
        </div>
      ) : (
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ChatAvatar initials={thread.initials} hue={thread.hue} size={32} />
          {thread.online !== undefined && (
            <span style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 8, height: 8, borderRadius: '50%',
              background: thread.online ? 'var(--status-ok)' : 'var(--muted-foreground)',
              border: '2px solid var(--background)',
            }} />
          )}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4 }}>
          <span style={{
            fontSize: 13, fontWeight: (active || thread.unread > 0) ? 600 : 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>{thread.name}</span>
          <span style={{ fontSize: 11, color: 'var(--muted-foreground)', flexShrink: 0 }}>{thread.lastTime}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, gap: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {thread.lastMsg}
          </span>
          {thread.unread > 0 && (
            <span style={{
              flexShrink: 0, minWidth: 18, height: 18, borderRadius: 9, padding: '0 5px',
              background: 'var(--primary)', color: 'var(--primary-foreground)',
              fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{thread.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Message bubble ────────────────────────────────────────────────────────────────
const MsgBubble = ({ msg, prevMsg }) => {
  const showDate   = msg.date && (!prevMsg || prevMsg.date !== msg.date);
  const showHeader = !prevMsg || prevMsg.author !== msg.author || showDate;

  return (
    <>
      {showDate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 10px' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{msg.date}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: msg.own ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end', marginBottom: 3 }}>
        {/* Avatar column */}
        {!msg.own
          ? (showHeader
              ? <ChatAvatar initials={msg.initials} hue={msg.hue} size={28} />
              : <div style={{ width: 28, flexShrink: 0 }} />)
          : <ChatAvatar initials={msg.initials} hue={msg.hue} size={28} />
        }
        <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: msg.own ? 'flex-end' : 'flex-start' }}>
          {showHeader && !msg.own && (
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 3, paddingLeft: 2 }}>{msg.author}</div>
          )}
          <div style={{
            padding: '8px 13px',
            borderRadius: msg.own ? '14px 14px 4px 14px' : '4px 14px 14px 14px',
            background: msg.own ? 'var(--primary)' : 'var(--muted)',
            color: msg.own ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>{msg.text}</div>
          <div style={{ fontSize: 10, color: 'var(--muted-foreground)', marginTop: 3, paddingLeft: 2, paddingRight: 2 }}>{msg.time}</div>
        </div>
      </div>
    </>
  );
};

// ── Message input bar ─────────────────────────────────────────────────────────────
const MsgInput = ({ placeholder, onSend }) => {
  const [input, setInput] = useChatState('');

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    onSend(text);
  };

  return (
    <div style={{
      padding: '10px 16px', borderTop: '1px solid var(--border)',
      display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0,
      background: 'var(--background)',
    }}>
      <button
        title="Прикрепить файл"
        style={{
          width: 34, height: 34, flexShrink: 0, borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--muted-foreground)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .12s, color .12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--foreground)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
      >
        <Icon name="paperclip" size={14} />
      </button>
      <input
        type="text" value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) send(); }}
        placeholder={placeholder}
        style={{
          flex: 1, height: 38, padding: '0 14px',
          borderRadius: 'var(--radius)', border: '1px solid var(--border)',
          background: 'var(--muted)', color: 'var(--foreground)',
          fontSize: 13, outline: 'none', fontFamily: 'var(--font-sans)',
          transition: 'border-color .15s, background .15s',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'var(--background)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--muted)'; }}
      />
      <button
        onClick={send}
        style={{
          width: 38, height: 38, flexShrink: 0, borderRadius: 'var(--radius)',
          background: input.trim() ? 'var(--primary)' : 'var(--muted)',
          border: 'none', cursor: input.trim() ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: input.trim() ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
          transition: 'background .15s, color .15s',
        }}
      >
        <Icon name="send" size={14} />
      </button>
    </div>
  );
};

// ── Thread view (messages + input) ───────────────────────────────────────────────
const ThreadView = ({ thread, messages, onSend }) => {
  const bottomRef = useChatRef(null);

  useChatEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, thread?.id]);

  if (!thread) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--muted-foreground)' }}>
        <Icon name="message-square" size={40} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Выберите чат</div>
        <div style={{ fontSize: 13 }}>Откройте переписку из списка слева</div>
      </div>
    );
  }

  const isProject = thread.type === 'project';
  const isContractor = thread.type === 'contractor';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 20px', borderBottom: '1px solid var(--border)',
        background: 'var(--background)', flexShrink: 0,
      }}>
        {isProject ? (
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'color-mix(in oklch, var(--primary) 16%, var(--muted))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
          }}>
            <Icon name="folder" size={16} />
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <ChatAvatar initials={thread.initials} hue={thread.hue} size={36} />
            {thread.online !== undefined && (
              <span style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 10, height: 10, borderRadius: '50%',
                background: thread.online ? 'var(--status-ok)' : 'var(--muted-foreground)',
                border: '2px solid var(--background)',
              }} />
            )}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{thread.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{isProject ? 'Канал проекта' : isContractor ? `${thread.role} · подрядчик` : thread.role}</span>
            {thread.online !== undefined && (
              <>
                <StatusDot kind={thread.online ? 'ok' : 'inactive'} size={6} />
                <span>{thread.online ? 'В сети' : 'Не в сети'}</span>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <IconBtn title="Поиск по чату"><Icon name="search" size={14} /></IconBtn>
          <IconBtn title="Прикрепить файл"><Icon name="paperclip" size={14} /></IconBtn>
          <IconBtn title="Ещё"><Icon name="more" size={14} /></IconBtn>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 4px', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
            Сообщений пока нет. Напишите первым!
          </div>
        )}
        {messages.map((msg, i) => (
          <MsgBubble key={msg.id} msg={msg} prevMsg={i > 0 ? messages[i - 1] : null} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MsgInput
        key={thread.id}
        placeholder={`Написать в ${thread.name}…`}
        onSend={text => onSend(thread.id, text)}
      />
    </div>
  );
};

// ── ChatPage — full-page global chat ─────────────────────────────────────────────
const ChatPage = () => {
  const [activeId,    setActiveId]    = useChatState('proj-1');
  const [allMessages, setAllMessages] = useChatState(() => {
    const copy = {};
    Object.keys(INIT_MESSAGES).forEach(k => { copy[k] = [...INIT_MESSAGES[k]]; });
    return copy;
  });
  const [threads,     setThreads]     = useChatState(CHAT_THREADS);
  const [search,      setSearch]      = useChatState('');
  const [sections,    setSections]    = useChatState({ projects: true, directs: true, contractors: true });

  const activeThread   = threads.find(t => t.id === activeId) || null;
  const activeMessages = allMessages[activeId] || [];

  const handleSend = (threadId, text) => {
    const now  = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const msg  = { id: Date.now(), author: 'Вы', initials: 'АК', hue: 220, time, text, own: true };
    setAllMessages(prev => ({ ...prev, [threadId]: [...(prev[threadId] || []), msg] }));
    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, lastMsg: text, lastTime: time } : t));
  };

  const openThread = (id) => {
    setActiveId(id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t));
  };

  const filtered     = threads.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.lastMsg || '').toLowerCase().includes(search.toLowerCase()));
  const projects     = filtered.filter(t => t.type === 'project');
  const directs      = filtered.filter(t => t.type === 'direct');
  const contractors  = filtered.filter(t => t.type === 'contractor');

  const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));
  const sectionUnread = (items) => items.reduce((s, t) => s + t.unread, 0);

  const renderSection = (key, label, items) => {
    if (items.length === 0) return null;
    const open   = sections[key];
    const unread = sectionUnread(items);
    return (
      <div key={key} style={{ marginBottom: 2 }}>
        <div
          onClick={() => toggleSection(key)}
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '5px 8px',
            cursor: 'pointer', borderRadius: 'var(--radius-sm)', userSelect: 'none',
            transition: 'background .1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ color: 'var(--muted-foreground)', display: 'flex' }}>
            <Icon name={open ? 'chevron-down' : 'chevron-right'} size={12} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', flex: 1 }}>{label}</span>
          {unread > 0 && (
            <span style={{
              minWidth: 16, height: 16, borderRadius: 8, padding: '0 4px',
              background: 'var(--primary)', color: 'var(--primary-foreground)',
              fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{unread}</span>
          )}
        </div>
        {open && items.map(t => (
          <ThreadRow key={t.id} thread={t} active={t.id === activeId} onClick={() => openThread(t.id)} />
        ))}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
      {/* ── Left panel ─────────────────────────────────────── */}
      <div style={{
        width: 280, flexShrink: 0, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', background: 'var(--background)',
      }}>
        {/* Panel header */}
        <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>Сообщения</span>
            <button
              title="Новое сообщение"
              style={{
                width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', background: 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted-foreground)', transition: 'background .12s, color .12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--foreground)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted-foreground)'; }}
            >
              <Icon name="plus" size={13} />
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', display: 'flex' }}>
              <Icon name="search" size={13} />
            </span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по чатам…"
              style={{
                width: '100%', height: 32, padding: '0 10px 0 32px', boxSizing: 'border-box',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                background: 'var(--muted)', color: 'var(--foreground)',
                fontSize: 13, outline: 'none', fontFamily: 'var(--font-sans)',
                transition: 'border-color .15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Thread sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 4px' }}>
          {renderSection('projects',    'Проекты',    projects)}
          {renderSection('directs',     'Личные',     directs)}
          {renderSection('contractors', 'Подрядчики', contractors)}
          {filtered.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              Ничего не найдено
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────── */}
      <ThreadView
        key={activeId}
        thread={activeThread}
        messages={activeMessages}
        onSend={handleSend}
      />
    </div>
  );
};

// ── ProjectChatTab — embedded in project detail page ─────────────────────────────
const ProjectChatTab = ({ projectId }) => {
  const threadId = `proj-${projectId || 1}`;
  const thread = CHAT_THREADS.find(t => t.id === threadId) || {
    id: threadId, type: 'project', name: 'Чат проекта',
  };

  const [messages, setMessages] = useChatState(() => [...(INIT_MESSAGES[threadId] || [])]);
  const bottomRef = useChatRef(null);

  useChatEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = (text) => {
    const now  = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    setMessages(prev => [...prev, { id: Date.now(), author: 'Вы', initials: 'АК', hue: 220, time, text, own: true }]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 4px', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
            Сообщений пока нет. Напишите первым!
          </div>
        )}
        {messages.map((msg, i) => (
          <MsgBubble key={msg.id} msg={msg} prevMsg={i > 0 ? messages[i - 1] : null} />
        ))}
        <div ref={bottomRef} />
      </div>
      <MsgInput placeholder="Написать в канал проекта…" onSend={handleSend} />
    </div>
  );
};

window.ChatPage = ChatPage;
window.ProjectChatTab = ProjectChatTab;
window.CHAT_TOTAL_UNREAD = CHAT_THREADS.reduce((s, t) => s + t.unread, 0);
