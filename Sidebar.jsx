// Sidebar.jsx
const Sidebar = ({ active, onNav, collapsed, inProject = false }) => {
  const item = (key, icon, label, disabled = false) => (
    <div
      key={key}
      onClick={() => { if (!disabled) onNav(key); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '8px' : '7px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 'var(--radius-sm)',
        color: disabled ? 'var(--muted-foreground)' : 'var(--sidebar-foreground)',
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: active === key ? 'var(--sidebar-accent)' : 'transparent',
        fontWeight: active === key ? 500 : 400,
      }}
      onMouseEnter={e => { if (!disabled && active !== key) e.currentTarget.style.background = 'var(--sidebar-accent)'; }}
      onMouseLeave={e => { if (active !== key) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ color: active === key ? 'var(--primary)' : 'var(--muted-foreground)', display: 'flex' }}>
        <Icon name={icon} size={16} />
      </span>
      {!collapsed && label}
    </div>
  );

  const section = (title) => !collapsed && (
    <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--muted-foreground)', padding: '14px 10px 6px' }}>{title}</div>
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
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '4px 6px 16px', color: 'var(--foreground)' }}>
        <svg width="28" height="28" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
          <circle cx="18" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="30" cy="24" r="14" fill="none" stroke="var(--primary)" strokeWidth="2.5" />
        </svg>
        {!collapsed && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '0.04em' }}>STRATUM</span>}
      </div>

      {section('Портфель')}
      {item('overview', 'home', 'Обзор')}

      {section('Проект')}
      {item('model', 'box', '3D-модель', !inProject)}
      {item('registry', 'table', 'Реестр объектов', !inProject)}
      {item('telemetry', 'activity', 'Телеметрия', !inProject)}

      {section('Анализ')}
      {item('deviations', 'alert-circle', 'Расхождения', !inProject)}
      {item('versions', 'layers', 'Версии модели', !inProject)}
      {item('docs', 'file-text', 'Документы', !inProject)}

      <div style={{ flex: 1 }} />
      {item('settings', 'settings', 'Настройки')}
    </aside>
  );
};

window.Sidebar = Sidebar;
