// Shell.jsx — top-level router
const { useState: useShellState } = React;

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
const PROJ_EVENTS = [
  { date: '23.04.2026', kind: 'warn', text: 'Расхождение: толщина стенки V-1208 −0,8 мм',   author: 'Петров Д.К.' },
  { date: '22.04.2026', kind: 'ok',   text: 'Модель обновлена до версии v2.14',              author: 'BIM-отдел' },
  { date: '21.04.2026', kind: 'ok',   text: 'Документ добавлен: Паспорт P-2340-A',           author: 'Иванов А.В.' },
  { date: '20.04.2026', kind: 'warn', text: 'Расхождение: смещение по оси X +45 мм',         author: 'Сидоров В.П.' },
  { date: '18.04.2026', kind: 'ok',   text: 'Этап «Обвязка» закрыт, акт КС-2 подписан',     author: 'ОТК' },
  { date: '15.04.2026', kind: 'ok',   text: 'Новый объект добавлен в реестр: E-4401',        author: 'BIM-отдел' },
  { date: '10.04.2026', kind: 'warn', text: 'Плановый срок монтажа насосной под угрозой',    author: 'Система' },
  { date: '05.04.2026', kind: 'ok',   text: 'Модель BIM v2.0 загружена и верифицирована',    author: 'BIM-отдел' },
];

const ProjectTelemetry = () => (
  <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Телеметрия проекта</div>
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--card)' }}>
      {PROJ_EVENTS.map((e, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', borderBottom: i < PROJ_EVENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ marginTop: 3, flexShrink: 0 }}><StatusDot kind={e.kind} size={8} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13 }}>{e.text}</div>
            <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>{e.date} · {e.author}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Project detail with tabs ──────────────────────────────────────────────────
const PROJECT_TABS = [
  { key: 'model',     label: 'Объект',      icon: 'box'         },
  { key: 'registry',  label: 'Оборудование', icon: 'table'       },
  { key: 'telemetry', label: 'Телеметрия',  icon: 'activity'    },
  { key: 'media',     label: 'Фото/Видео',  icon: 'camera'      },
  { key: 'team',      label: 'Команда',     icon: 'users'       },
  { key: 'budget',    label: 'Бюджет',      icon: 'trending-up' },
];

const ProjectDetailPage = ({ tab, onTabChange, selected, onSelect }) => (
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
          <InspectorPanel selected={selected} onClose={() => onSelect(null)} />
        </React.Fragment>
      )}
      {tab === 'registry'  && <AssetRegistry selected={selected} onSelect={(tag) => { onSelect(tag); onTabChange('model'); }} />}
      {tab === 'telemetry' && <ProjectTelemetry />}
      {tab === 'media'     && <MediaPage />}
      {tab === 'team'      && <TeamPage />}
      {tab === 'budget'    && <BudgetPage />}
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

  const navigate = (section) => { setPage(section); setProjectId(null); setContractorId(null); };

  const openProject = (id) => { setPage('project'); setProjectId(id); setProjectTab('model'); setSelected(null); };

  const sidebarActive = page === 'project' ? 'projects' : page === 'contractor' ? 'contractors' : page;

  const crumbs = (() => {
    if (page === 'overview')     return [{ label: 'Обзор' }];
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
    if (page === 'telemetry')    return [{ label: 'Телеметрия' }];
    if (page === 'settings')     return [{ label: 'Настройки' }];
    return [{ label: page }];
  })();

  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--background)', color: 'var(--foreground)', overflow: 'hidden' }}>
      <Sidebar active={sidebarActive} onNav={navigate} collapsed={collapsed} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={crumbs} onToggleSidebar={() => setCollapsed(c => !c)} />

        {page === 'overview' && <Portfolio onOpenProject={openProject} />}

        {page === 'projects' && <ProjectsListPage onOpenProject={openProject} />}

        {page === 'project' && (
          <ProjectDetailPage
            tab={projectTab}
            onTabChange={setProjectTab}
            selected={selected}
            onSelect={setSelected}
          />
        )}

        {page === 'contractors' && (
          <ContractorsPage contractorId={null} onSelect={(id) => { setContractorId(id); setPage('contractor'); }} />
        )}

        {page === 'contractor' && (
          <ContractorsPage contractorId={contractorId} onSelect={null} />
        )}

        {page === 'telemetry' && <TelemetryPage />}

        {page === 'settings' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <Icon name="settings" size={40} />
              <div style={{ marginTop: 12, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--foreground)' }}>Настройки</div>
              <div style={{ marginTop: 4 }}>Раздел в разработке</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.Shell = Shell;
