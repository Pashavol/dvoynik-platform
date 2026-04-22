// Portfolio.jsx — top-level portfolio dashboard
const PROJECTS = [
  { id: 'elou-6',   name: 'ЭЛОУ-АВТ-6 · Блок 2',    client: 'ПАО «НефтеТрансИнжиниринг»', region: 'Татарстан',        lat: 55.63, lng: 51.83, budget: '24,8 млрд ₽', progress: 67, status: 'warn',     risks: 2 },
  { id: 'gpz-2',    name: 'Газоперерабатывающий-2',  client: 'ООО «СеверГазСтрой»',         region: 'ЯНАО',             lat: 66.08, lng: 76.68, budget: '18,4 млрд ₽', progress: 42, status: 'ok',       risks: 0 },
  { id: 'ust-luga', name: 'Терминал Усть-Луга',       client: 'АО «БалтНефтеПорт»',          region: 'Ленобласть',       lat: 59.70, lng: 28.35, budget: '31,2 млрд ₽', progress: 88, status: 'ok',       risks: 1 },
  { id: 'vankor',   name: 'Ванкорский кластер',       client: 'ПАО «Роснефть»',              region: 'Красноярский край', lat: 67.85, lng: 83.53, budget: '42,6 млрд ₽', progress: 55, status: 'warn',    risks: 3 },
  { id: 'kstovo',   name: 'НПЗ Кстово, установка-3', client: 'ПАО «НефтеТрансИнжиниринг»', region: 'Нижегородская',    lat: 56.14, lng: 44.18, budget: '9,8 млрд ₽',  progress: 23, status: 'crit',     risks: 1 },
  { id: 'astra',    name: 'Астраханский ГПЗ',         client: 'ПАО «Газпром переработка»',   region: 'Астраханская',     lat: 46.35, lng: 47.99, budget: '12,1 млрд ₽', progress: 95, status: 'inactive', risks: 0 },
];

const STATUS_COLOR = {
  ok:       'oklch(0.648 0.150 160.118)',
  warn:     'oklch(0.769 0.188 70.080)',
  crit:     'oklch(0.577 0.245 27.325)',
  inactive: 'oklch(0.705 0.015 286.067)',
};

const DARK_STYLE  = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

// ─── MapLibre map component ───────────────────────────────────────────────────
const ProjectMap = ({ projects, onOpenProject }) => {
  const containerRef = React.useRef(null);
  const mapRef       = React.useRef(null);
  const markersRef   = React.useRef([]);
  const popupsRef    = React.useRef([]);

  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (typeof maplibregl === 'undefined') return;

    const getStyle = () =>
      document.documentElement.classList.contains('dark') ? DARK_STYLE : LIGHT_STYLE;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getStyle(),
      center: [68, 61],
      zoom: 2.5,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    const addMarkers = () => {
      markersRef.current.forEach(m => m.remove());
      popupsRef.current.forEach(p => p.remove());
      markersRef.current = [];
      popupsRef.current = [];

      projects.forEach(p => {
        const color = STATUS_COLOR[p.status];

        // Wrapper — MapLibre writes its translate() here, don't touch transform on this element
        const el = document.createElement('div');
        el.style.cssText = 'width:14px;height:14px;position:relative;cursor:pointer;';

        // Pulse ring (behind the dot, pointer-events off so hover stays on dot)
        if (p.status !== 'inactive') {
          const ring = document.createElement('span');
          Object.assign(ring.style, {
            position: 'absolute', inset: '-6px', borderRadius: '50%',
            border: `2px solid ${color}`, opacity: '0.35',
            animation: 'map-pulse 2s infinite',
            pointerEvents: 'none',
          });
          el.appendChild(ring);
        }

        // Visual dot — scale is applied here, not on the wrapper
        const dot = document.createElement('div');
        Object.assign(dot.style, {
          position: 'absolute', inset: '0', borderRadius: '50%',
          background: color,
          border: '3px solid var(--card)',
          boxSizing: 'border-box',
          boxShadow: '0 1px 4px rgba(0,0,0,0.45)',
          transition: 'transform .12s',
        });
        el.appendChild(dot);

        el.addEventListener('mouseenter', () => { dot.style.transform = 'scale(1.4)'; });
        el.addEventListener('mouseleave', () => { dot.style.transform = 'scale(1)'; });
        el.addEventListener('click', () => onOpenProject(p.id));

        // Popup content — DOM element so CSS vars resolve against :root
        const content = document.createElement('div');
        content.style.cssText = 'padding:14px;min-width:220px';
        content.innerHTML = `
          <div style="font-family:var(--font-display);font-weight:700;font-size:14px;margin-bottom:2px;color:var(--popover-foreground)">${p.name}</div>
          <div style="font-size:12px;color:var(--muted-foreground);margin-bottom:10px">${p.client}</div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--muted-foreground)">Регион</span>
            <span style="font-family:var(--font-mono);color:var(--popover-foreground)">${p.region}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0;border-bottom:1px solid var(--border)">
            <span style="color:var(--muted-foreground)">Бюджет</span>
            <span style="font-family:var(--font-mono);color:var(--popover-foreground)">${p.budget}</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:5px 0 10px">
            <span style="color:var(--muted-foreground)">Готовность</span>
            <span style="font-family:var(--font-mono);font-weight:600;color:var(--popover-foreground)">${p.progress}%</span>
          </div>
          <div style="height:4px;background:var(--muted);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${p.progress}%;background:var(--primary)"></div>
          </div>
        `;

        const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 16 })
          .setDOMContent(content);
        popupsRef.current.push(popup);

        el.addEventListener('mouseenter', () => popup.setLngLat([p.lng, p.lat]).addTo(map));
        el.addEventListener('mouseleave', () => popup.remove());

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    };

    // Re-add markers after every style load (initial + after theme switch)
    map.on('style.load', addMarkers);

    // Theme switch: swap map style when .dark class toggles
    const observer = new MutationObserver(() => map.setStyle(getStyle()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius)', overflow: 'hidden' }} />
    </div>
  );
};

// ─── KPI card ─────────────────────────────────────────────────────────────────
const PortfolioKpi = ({ label, value, unit, hint, accent }) => (
  <div style={{
    background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
    padding: '16px 18px', flex: 1, minWidth: 0,
  }}>
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 32, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', color: accent || 'var(--foreground)' }}>{value}</span>
      {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted-foreground)' }}>{unit}</span>}
    </div>
    {hint && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted-foreground)' }}>{hint}</div>}
  </div>
);

// ─── Portfolio ────────────────────────────────────────────────────────────────
const Portfolio = ({ onOpenProject }) => {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--muted)', overflow: 'auto' }}>

      {/* Page header */}
      <div style={{ padding: '24px 24px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Обзор портфеля</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em', marginTop: 4 }}>Капитальное строительство 2026</div>
      </div>

      {/* KPI widgets */}
      <div style={{ display: 'flex', gap: 12, padding: '0 24px' }}>
        <PortfolioKpi label="Активные проекты"  value="125"  hint="+4 за квартал" />
        <PortfolioKpi label="Подрядчики"         value="24"   hint="18 активных договоров" />
        <PortfolioKpi label="Бюджет"             value="124"  unit="млрд ₽" hint="освоено 62,4%" />
        <PortfolioKpi label="Эффективность"      value="89"   unit="%" hint="+3 п.п. к плану" accent="var(--status-ok)" />
        <PortfolioKpi label="Риски"              value="7"    hint="3 критичных" accent="var(--status-warn)" />
      </div>

      {/* AI recommendations */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, color-mix(in oklch, var(--primary) 10%, var(--card)) 0%, var(--card) 55%)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 18,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'color-mix(in oklch, var(--primary) 14%, transparent)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
            <span style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="sparkles" size={16} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Рекомендации AI-ассистента</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 1 }}>Обновлено сегодня, 09:42 · проанализировано 125 проектов</div>
            </div>
            <Button variant="outline" size="sm">Все рекомендации<Icon name="arrow-right" size={14} /></Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, position: 'relative' }}>
            {[
              { tag: 'Риск',        tagKind: 'warn', title: 'НПЗ Кстово: отклонение графика на 14 дней',  body: 'Смонтируйте бригаду Б-04 с объекта Ванкор — освобождается 12 апреля, закроет разрыв по монтажу ректификационной колонны.', action: 'Назначить бригаду' },
              { tag: 'Оптимизация', tagKind: 'info', title: 'Ванкорский кластер: экономия 340 млн ₽',     body: 'Замена поставщика Ду-1200 трубопровода на АО «ТМК» — срок поставки короче на 6 нед., стоимость ниже на 8,2%.', action: 'Открыть спецификацию' },
              { tag: 'Прогноз',     tagKind: 'ok',   title: 'Усть-Луга: досрочный ввод 23 сентября',      body: 'При текущем темпе бетонирования плит №4–7 объект выйдет на пусконаладку на 11 дней раньше плана.', action: 'Скорректировать план' },
            ].map((r, i) => (
              <div key={i} style={{ background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'baseline'}}>
                <Badge variant={r.tagKind} uppercase>{r.tag}</Badge>
                <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>{r.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted-foreground)', lineHeight: 1.5, flex: 1 }}>{r.body}</div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0, marginTop: 2, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: 13, fontWeight: 500, alignSelf: 'flex-start' }}>
                  {r.action}<Icon name="arrow-right" size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map + projects list */}
      <div style={{ display: 'flex', gap: 16, padding: 24, flex: 1, minHeight: 0 }}>

        {/* Map card */}
        <div style={{ flex: 1, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20, display: 'flex', flexDirection: 'column', minHeight: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexShrink: 0 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>География проектов</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>Нажмите на маркер, чтобы открыть карточку проекта</div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
              {[['ok','В норме'],['warn','Внимание'],['crit','Авария'],['inactive','Завершён']].map(([k, label]) => (
                <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted-foreground)' }}>
                  <StatusDot kind={k} size={8} />{label}
                </span>
              ))}
            </div>
          </div>
          <ProjectMap projects={PROJECTS} onOpenProject={onOpenProject} />
        </div>

        {/* Projects list */}
        <div style={{ width: 340, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, padding: '4px 4px 8px' }}>Проекты ({PROJECTS.length})</div>
          {PROJECTS.map(p => (
            <button key={p.id}
              onClick={() => onOpenProject(p.id)}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                background: hovered === p.id ? 'var(--accent)' : 'var(--background)',
                color: 'var(--foreground)',
                transition: 'background .15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <StatusDot kind={p.status} size={8} />
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{p.name}</span>
                {p.risks > 0 && (
                  <Badge variant="warn" uppercase>{p.risks} риск{p.risks === 1 ? '' : p.risks < 5 ? 'а' : 'ов'}</Badge>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 8 }}>{p.region} · {p.budget}</div>
              <div style={{ height: 4, background: 'var(--muted)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.progress}%`, background: 'var(--primary)' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{p.progress}% готовности</div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

window.Portfolio = Portfolio;
window.PROJECTS  = PROJECTS;
