// Shell.jsx — top-level composition: portfolio → project detail
const { useState: useShellState } = React;

const Shell = () => {
  const [active, setActive] = useShellState('overview');
  const [collapsed, setCollapsed] = useShellState(false);
  const [selected, setSelected] = useShellState('V-1208');
  const [openProjectId, setOpenProjectId] = useShellState(null);

  const openProject = (id) => { setOpenProjectId(id); setActive('model'); };
  const backToPortfolio = () => { setOpenProjectId(null); setActive('overview'); };

  const project = openProjectId ? window.PROJECTS.find(p => p.id === openProjectId) : null;

  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--background)', color: 'var(--foreground)', overflow: 'hidden' }}>
      <Sidebar active={active} onNav={(k) => { if (k === 'overview') backToPortfolio(); else setActive(k); }} collapsed={collapsed} inProject={!!project} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar project={project ? project.name : null} onToggleSidebar={() => setCollapsed(c => !c)} onBackToPortfolio={project ? backToPortfolio : null} />

        {/* Portfolio overview (no project selected) */}
        {!project && active === 'overview' && <Portfolio onOpenProject={openProject} />}

        {/* Project detail views */}
        {project && active === 'overview' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <KpiStrip />
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
              <ViewerCanvas selected={selected} onSelect={setSelected} />
              <InspectorPanel selected={selected} onClose={() => setSelected(null)} />
            </div>
          </div>
        )}
        {project && active === 'model' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <KpiStrip />
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
              <ViewerCanvas selected={selected} onSelect={setSelected} />
              <InspectorPanel selected={selected} onClose={() => setSelected(null)} />
            </div>
          </div>
        )}
        {project && active === 'registry' && (
          <AssetRegistry onSelect={(tag) => { setSelected(tag); setActive('model'); }} />
        )}
        {project && ['telemetry', 'deviations', 'versions', 'docs', 'settings'].includes(active) && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: 14, padding: 40, textAlign: 'center' }}>
            <div>
              <Icon name="layers" size={48} />
              <div style={{ marginTop: 16, fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--foreground)' }}>Раздел «{active}»</div>
              <div style={{ marginTop: 6 }}>Демонстрационный UI-kit.</div>
            </div>
          </div>
        )}

        {/* Portfolio-level sub-pages */}
        {!project && active !== 'overview' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: 14, padding: 40, textAlign: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Откройте проект</div>
              <div style={{ marginTop: 6 }}>Раздел «{active}» доступен внутри карточки проекта.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.Shell = Shell;
