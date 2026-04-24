// Sidebar.jsx
const Sidebar = ({ active, onNav, collapsed }) => {
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
      {item('telemetry',   'activity', 'Телеметрия')}

      <div style={{ flex: 1 }} />
      {item('settings', 'settings', 'Настройки')}
    </aside>
  );
};

window.Sidebar = Sidebar;
