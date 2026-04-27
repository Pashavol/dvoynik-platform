// Topbar.jsx
const { useState: useTopbarState, useEffect: useTopbarEffect, useRef: useTopbarRef } = React;

const ThemeToggle = () => {
  const [dark, setDark] = useTopbarState(() => document.documentElement.classList.contains('dark'));
  useTopbarEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('dvoynik-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <IconBtn onClick={() => setDark(d => !d)} title={dark ? 'Светлая тема' : 'Тёмная тема'}>
      <Icon name={dark ? 'sun' : 'moon'} size={18} />
    </IconBtn>
  );
};

const NotificationsBell = ({ onOpenAll }) => {
  const [open, setOpen] = useTopbarState(false);
  const ref = useTopbarRef(null);

  const notifications = (window.ALL_NOTIFICATIONS || []).slice(0, 5);
  const unreadCount = (window.ALL_NOTIFICATIONS || []).filter(n => !n.read).length;

  useTopbarEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const KIND_ICON = { crit: 'alert-octagon', warn: 'alert-triangle', info: 'zap', ok: 'check-circle' };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <IconBtn onClick={() => setOpen(o => !o)} title="Уведомления">
          <Icon name="bell" size={18} />
        </IconBtn>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--status-crit)', border: '2px solid var(--background)',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 380, background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', boxShadow: '0 8px 32px rgba(0,0,0,.14)',
          zIndex: 200, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Icon name="bell" size={15} />
            <span style={{ fontWeight: 600, fontSize: 14, flex: 1 }}>Уведомления</span>
            {unreadCount > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
                background: 'var(--status-crit)', color: '#fff',
                borderRadius: 10, padding: '1px 7px',
              }}>{unreadCount}</span>
            )}
            <IconBtn onClick={() => setOpen(false)} style={{ marginLeft: 4 }}>
              <Icon name="x" size={14} />
            </IconBtn>
          </div>

          {/* Notification items */}
          <div>
            {notifications.map((n, i) => (
              <div key={n.id} style={{
                display: 'flex', gap: 10, padding: '12px 16px',
                borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                background: n.read ? 'transparent' : 'color-mix(in oklch, var(--primary) 5%, var(--card))',
                cursor: 'pointer', transition: 'background .1s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : 'color-mix(in oklch, var(--primary) 5%, var(--card))'}
              >
                <div style={{ paddingTop: 2, flexShrink: 0 }}>
                  <StatusDot kind={n.kind} size={8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, lineHeight: 1.35, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Icon name="folder" size={10} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.project}</span>
                    <span style={{ marginLeft: 'auto', flexShrink: 0, fontFamily: 'var(--font-mono)' }}>{n.time}</span>
                  </div>
                </div>
                {!n.read && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 5 }} />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => { setOpen(false); onOpenAll(); }}
              style={{
                width: '100%', padding: '7px 0', background: 'var(--primary)', color: 'var(--primary-foreground)',
                border: 'none', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Открыть все уведомления <Icon name="arrow-right" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Topbar = ({ crumbs = [], onToggleSidebar, collapsed, onAvatarClick, onNotificationsClick, aiOpen, onAiToggle, isMobile }) => (
  <header style={{
    height: 56, background: 'var(--background)', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16, flexShrink: 0, minWidth: 0,
  }}>
    {onToggleSidebar ? (
      <IconBtn onClick={onToggleSidebar} title={collapsed ? 'Развернуть' : 'Свернуть'}>
        <Icon name={collapsed ? 'sidebar-open' : 'sidebar-close'} size={18} />
      </IconBtn>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 48 48">
          <circle cx="18" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="30" cy="24" r="14" fill="none" stroke="var(--primary)" strokeWidth="2.5" />
        </svg>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, letterSpacing: '0.04em' }}>STRATUM</span>
      </div>
    )}

    {/* Breadcrumb */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, flex: '1 1 auto', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon name="chevron-right" size={14} />}
          {c.onClick
            ? <span onClick={c.onClick} style={{ color: 'var(--muted-foreground)', flexShrink: 0, cursor: 'pointer' }}>{c.label}</span>
            : <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
          }
        </React.Fragment>
      ))}
    </div>

    {/* Right-hand controls */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      {!isMobile && <>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', display: 'flex' }}>
            <Icon name="search" size={14} />
          </span>
          <Input placeholder="Поиск по тегам и документам" style={{ paddingLeft: 36, width: 220, border: '1px solid var(--input)', boxShadow: 'none' }} />
        </div>

        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

        <Button variant="outline" size="sm"><Icon name="refresh" size={14} />Синхронизировать</Button>
      </>}

      <button
        onClick={onAiToggle}
        title="AI-ассистент"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          height: 30, padding: '0 11px',
          borderRadius: 'var(--radius)', border: '1px solid',
          borderColor: aiOpen ? 'var(--primary)' : 'var(--border)',
          background: aiOpen ? 'color-mix(in oklch, var(--primary) 12%, var(--background))' : 'transparent',
          color: aiOpen ? 'var(--primary)' : 'var(--muted-foreground)',
          cursor: 'pointer', fontSize: 13, fontWeight: aiOpen ? 600 : 400,
          transition: 'all .15s',
        }}
        onMouseEnter={e => { if (!aiOpen) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; } }}
        onMouseLeave={e => { if (!aiOpen) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)'; } }}
      >
        <Icon name="sparkles" size={13} />AI
      </button>

      <NotificationsBell onOpenAll={onNotificationsClick} />
      <ThemeToggle />

      <div
        onClick={onAvatarClick}
        title="Мой профиль"
        style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-muted)',
          color: 'var(--brand-muted-foreground)', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'opacity .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >АВ</div>
    </div>
  </header>
);

window.Topbar = Topbar;
