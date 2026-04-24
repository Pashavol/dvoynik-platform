// Topbar.jsx
const { useState: useTopbarState, useEffect: useTopbarEffect } = React;

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

const Topbar = ({ crumbs = [], onToggleSidebar }) => (
  <header style={{
    height: 56, background: 'var(--background)', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16, flexShrink: 0, minWidth: 0,
  }}>
    <IconBtn onClick={onToggleSidebar} title="Свернуть"><Icon name="layers" size={18} /></IconBtn>

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
      <div style={{ position: 'relative'}}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none', display: 'flex' }}>
          <Icon name="search" size={14} />
        </span>
        <Input placeholder="Поиск по тегам и документам" style={{ paddingLeft: 36, width: 220, border: '1px solid var(--input)', boxShadow: 'none' }} />
      </div>

      <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

      <Button variant="outline" size="sm"><Icon name="refresh" size={14} />Синхронизировать</Button>

      <IconBtn><Icon name="bell" size={18} /></IconBtn>
      <ThemeToggle />

      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-muted)',
        color: 'oklch(0.379 0.146 265.522)', fontSize: 13, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>АК</div>
    </div>
  </header>
);

window.Topbar = Topbar;
