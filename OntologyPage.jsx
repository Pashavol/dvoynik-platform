// OntologyPage.jsx — object ontology graph visualization

const { useState: useOntState, useMemo: useOntMemo } = React;

/* ── Entity type metadata ────────────────────────────────────────────────── */
const TYPE_META = {
  project:    { label: 'Проект',    color: '#1e3a5f', defaultVisible: true  },
  phase:      { label: 'Фаза',      color: '#1d4ed8', defaultVisible: false },
  contractor: { label: 'Подрядчик', color: '#065f46', defaultVisible: false },
  brigade:    { label: 'Бригада',   color: '#14532d', defaultVisible: false },
  person:     { label: 'Сотрудник', color: '#3b5a2a', defaultVisible: false },
  system:     { label: 'Система',   color: '#164e63', defaultVisible: true  },
  asset:      { label: 'Актив',     color: '#0b5c8f', defaultVisible: true  },
  document:   { label: 'Документ',  color: '#713f12', defaultVisible: false },
  sensor:     { label: 'Датчик',   color: '#0e7490', defaultVisible: true  },
  event:      { label: 'Событие',   color: '#92400e', defaultVisible: true  },
  task:       { label: 'Задача',    color: '#5b21b6', defaultVisible: true  },
  budgetLine: { label: 'Бюджет',    color: '#7f1d1d', defaultVisible: false },
};

const STATUS_COLOR = {
  ok: '#14532d', warn: '#92400e', crit: '#991b1b',
  open: '#5b21b6', inactive: '#374151', done: '#14532d',
  active: '#0b5c8f', pending: '#374151', expired: '#7f1d1d',
  draft: '#713f12', approved: '#14532d',
};

/* ── Layout constants ────────────────────────────────────────────────────── */
const LANE_ORDER = ['project','phase','contractor','brigade','person','system','asset','document','sensor','event','task','budgetLine'];
const LANE_H     = 88;
const VB_W       = 1400;
const VB_PAD_TOP = 36;
const VB_PAD_SIDE = 72;

const NODE_HALF_W = {
  project: 58, phase: 56, contractor: 54, brigade: 64, person: 50,
  system: 52, asset: 52, document: 56, sensor: 56, event: 56, task: 44,
  budgetLine: 50, default: 50,
};
const NODE_HALF_H = 22;

/* ── Schema (type-level) graph ───────────────────────────────────────────── */
const SCHEMA_NODES = [
  { id: 'project',    type: 'project',    label: 'Проект',    x: 500,  y: 60  },
  { id: 'phase',      type: 'phase',      label: 'Фаза',      x: 200,  y: 190 },
  { id: 'contractor', type: 'contractor', label: 'Подрядчик', x: 820,  y: 190 },
  { id: 'budgetLine', type: 'budgetLine', label: 'Бюджет',    x: 80,   y: 320 },
  { id: 'system',     type: 'system',     label: 'Система',   x: 380,  y: 320 },
  { id: 'brigade',    type: 'brigade',    label: 'Бригада',   x: 700,  y: 320 },
  { id: 'person',     type: 'person',     label: 'Сотрудник', x: 930,  y: 320 },
  { id: 'document',   type: 'document',   label: 'Документ',  x: 140,  y: 450 },
  { id: 'asset',      type: 'asset',      label: 'Актив',     x: 420,  y: 450 },
  { id: 'task',       type: 'task',       label: 'Задача',    x: 680,  y: 450 },
  { id: 'sensor',     type: 'sensor',     label: 'Датчик',   x: 320,  y: 570 },
  { id: 'event',      type: 'event',      label: 'Событие',   x: 530,  y: 570 },
];

const SCHEMA_EDGES = [
  { from: 'project',    to: 'phase',      label: 'состоит из'  },
  { from: 'project',    to: 'contractor', label: 'нанимает'    },
  { from: 'project',    to: 'system',     label: 'включает'    },
  { from: 'phase',      to: 'budgetLine', label: 'финансирует' },
  { from: 'contractor', to: 'brigade',    label: 'выставляет'  },
  { from: 'brigade',    to: 'person',     label: 'включает'    },
  { from: 'system',     to: 'asset',      label: 'содержит'    },
  { from: 'asset',      to: 'document',   label: 'имеет'       },
  { from: 'asset',      to: 'sensor',     label: 'имеет'       },
  { from: 'sensor',     to: 'event',      label: 'генерирует'  },
  { from: 'event',      to: 'task',       label: 'порождает'   },
  { from: 'task',       to: 'asset',      label: 'касается'    },
  { from: 'task',       to: 'brigade',    label: 'назначена'   },
];

/* ── Instance graph builder ──────────────────────────────────────────────── */
const buildInstanceGraph = (visibleSet) => {
  const g = window.GRAPH;
  if (!g) return { nodes: [], edges: [], vbH: 400, lanes: [] };

  const visibleLanes = LANE_ORDER.filter(t => visibleSet.has(t));
  const laneY = {};
  const lanes = [];
  visibleLanes.forEach((type, i) => {
    const y = VB_PAD_TOP + i * LANE_H + LANE_H / 2;
    laneY[type] = y;
    lanes.push({ type, y });
  });
  const vbH = VB_PAD_TOP + visibleLanes.length * LANE_H + 28;

  const nodes = [];
  const edges = [];
  const nodeMap = {};

  const W_INNER = VB_W - VB_PAD_SIDE * 2;

  const addNodes = (type, items, idFn, labelFn, subFn, statusFn) => {
    if (!visibleSet.has(type) || !items.length) return;
    const y = laneY[type];
    const n = items.length;
    items.forEach((item, i) => {
      const x = VB_PAD_SIDE + (i + 0.5) * W_INNER / n;
      const nd = { id: idFn(item), type, label: labelFn(item), sub: subFn(item), status: statusFn(item), x, y, data: item };
      nodes.push(nd);
      nodeMap[nd.id] = nd;
    });
  };

  const addEdge = (fromId, toId, label) => {
    if (nodeMap[fromId] && nodeMap[toId])
      edges.push({ id: `${fromId}->${toId}`, from: fromId, to: toId, label });
  };

  /* ── Add nodes by type ── */
  addNodes('project',
    Object.values(g.projects),
    p  => `P:${p.id}`,
    p  => p.name,
    p  => `${p.progress}%`,
    p  => p.status,
  );

  addNodes('phase',
    Object.values(g.phases).sort((a, b) => a.order - b.order),
    ph => `PH:${ph.id}`,
    ph => ph.name,
    ph => `${ph.progress}%`,
    ph => ph.status === 'done' ? 'ok' : ph.status === 'active' ? 'active' : 'pending',
  );

  addNodes('contractor',
    Object.values(g.contractors),
    c  => `C:${c.id}`,
    c  => c.name,
    c  => c.status,
    c  => c.status,
  );

  addNodes('brigade',
    Object.values(g.brigades),
    b  => `BR:${b.id}`,
    b  => b.name,
    b  => b.contractorId || 'собств.',
    () => 'ok',
  );

  addNodes('person',
    Object.values(g.persons),
    pe => `PE:${pe.id}`,
    pe => pe.name.split(' ')[0],
    pe => pe.role,
    () => 'ok',
  );

  addNodes('system',
    Object.values(g.systems),
    s  => `SY:${s.id}`,
    s  => s.id,
    s  => s.name,
    () => 'ok',
  );

  addNodes('asset',
    Object.values(g.assets),
    a  => `A:${a.id}`,
    a  => a.id,
    a  => a.type,
    a  => a.status,
  );

  addNodes('document',
    Object.values(g.documents),
    d  => `D:${d.id}`,
    d  => d.id,
    d  => d.type,
    d  => d.status,
  );

  addNodes('sensor',
    Object.values(g.sensors),
    s  => `S:${s.id}`,
    s  => s.id,
    s  => `${s.value} ${s.unit}`,
    s  => s.status,
  );

  const eventItems = Object.keys(g.eventLinks).map(id => ({ id, ...g.eventLinks[id] }));
  addNodes('event',
    eventItems,
    e  => `E:${e.id}`,
    e  => `Событие #${e.id}`,
    e  => {
      const ev = window.BASE_EVENTS?.find(b => b.id === Number(e.id));
      return ev ? ev.text.slice(0, 16) + '…' : (e.assetId || '');
    },
    () => 'warn',
  );

  const taskItems = Object.keys(g.taskLinks).map(id => ({ id, ...g.taskLinks[id] }));
  addNodes('task',
    taskItems,
    t  => `T:${t.id}`,
    t  => t.id,
    t  => t.brigadeId || '',
    () => 'open',
  );

  addNodes('budgetLine',
    Object.values(g.budgetLines),
    bl => `BL:${bl.id}`,
    bl => bl.id,
    bl => bl.name,
    bl => bl.actual > bl.planned ? 'crit' : bl.actual / bl.planned > 0.92 ? 'warn' : 'ok',
  );

  /* ── Add edges ── */
  // project → system
  Object.values(g.systems).forEach(s => addEdge(`P:${s.projectId}`, `SY:${s.id}`, 'включает'));
  // project → phase
  Object.values(g.phases).forEach(ph => addEdge(`P:${ph.projectId}`, `PH:${ph.id}`, 'этап'));
  // contractor → brigade
  Object.values(g.brigades).forEach(b => { if (b.contractorId) addEdge(`C:${b.contractorId}`, `BR:${b.id}`, 'бригада'); });
  // brigade → person (foreman only to avoid edge overload)
  Object.values(g.brigades).forEach(b => { if (b.foremanId) addEdge(`BR:${b.id}`, `PE:${b.foremanId}`, 'прораб'); });
  // phase → budgetLine
  Object.values(g.budgetLines).forEach(bl => { if (bl.phaseId) addEdge(`PH:${bl.phaseId}`, `BL:${bl.id}`, 'бюджет'); });
  // system → asset
  Object.values(g.assets).forEach(a => addEdge(`SY:${a.systemId}`, `A:${a.id}`, 'содержит'));
  // asset → sensor
  Object.values(g.sensors).forEach(s => addEdge(`A:${s.asset}`, `S:${s.id}`, 'датчик'));
  // asset → document
  Object.values(g.documents).forEach(d => {
    if (d.assetId) addEdge(`A:${d.assetId}`, `D:${d.id}`, 'документ');
    if (d.phaseId) addEdge(`PH:${d.phaseId}`, `D:${d.id}`, 'документ');
  });
  // sensor / asset → event
  Object.entries(g.eventLinks).forEach(([eid, link]) => {
    if (link.sensorId) addEdge(`S:${link.sensorId}`, `E:${eid}`, 'сигнал');
    else if (link.assetId) addEdge(`A:${link.assetId}`, `E:${eid}`, 'событие');
  });
  // event → task
  Object.entries(g.eventLinks).forEach(([eid, link]) => {
    if (link.linkedTaskId) addEdge(`E:${eid}`, `T:${link.linkedTaskId}`, 'задача');
  });
  // task → asset
  Object.entries(g.taskLinks).forEach(([tid, link]) => {
    if (link.assetId) addEdge(`T:${tid}`, `A:${link.assetId}`, 'на активе');
  });
  // task → brigade
  Object.entries(g.taskLinks).forEach(([tid, link]) => {
    if (link.brigadeId) addEdge(`T:${tid}`, `BR:${link.brigadeId}`, 'назначена');
  });

  return { nodes, edges, vbH, lanes };
};

/* ── Edge path ───────────────────────────────────────────────────────────── */
const edgePath = (fn, tn) => {
  const fhw = NODE_HALF_W[fn.type] || NODE_HALF_W.default;
  const thw = NODE_HALF_W[tn.type] || NODE_HALF_W.default;
  const dy = tn.y - fn.y;
  let x1, y1, x2, y2, cx1, cy1, cx2, cy2;

  if (Math.abs(dy) > 30) {
    if (dy > 0) { x1 = fn.x; y1 = fn.y + NODE_HALF_H; x2 = tn.x; y2 = tn.y - NODE_HALF_H; }
    else         { x1 = fn.x; y1 = fn.y - NODE_HALF_H; x2 = tn.x; y2 = tn.y + NODE_HALF_H; }
    const stretch = Math.min(Math.abs(dy) * 0.38, 110);
    cx1 = x1; cy1 = y1 + (dy > 0 ? stretch : -stretch);
    cx2 = x2; cy2 = y2 - (dy > 0 ? stretch : -stretch);
  } else {
    if (fn.x < tn.x) { x1 = fn.x + fhw; y1 = fn.y; x2 = tn.x - thw; y2 = tn.y; }
    else               { x1 = fn.x - fhw; y1 = fn.y; x2 = tn.x + thw; y2 = tn.y; }
    const dx = x2 - x1;
    cx1 = x1 + dx * 0.35; cy1 = y1 - 28;
    cx2 = x2 - dx * 0.35; cy2 = y2 - 28;
  }
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
};

/* ── Node fill ───────────────────────────────────────────────────────────── */
const nodeFill = (node) => {
  if (node.status === 'crit' || node.status === 'expired') return STATUS_COLOR.crit;
  if (node.status === 'warn') return STATUS_COLOR.warn;
  if (node.status === 'open') return STATUS_COLOR.open;
  if (node.status === 'draft') return STATUS_COLOR.draft;
  return TYPE_META[node.type]?.color || '#374151';
};

/* ── SVG Graph ───────────────────────────────────────────────────────────── */
const OntologyGraph = ({ nodes, edges, selectedId, onSelect, vbW, vbH, lanes }) => (
  <svg viewBox={`0 0 ${vbW} ${vbH}`} style={{ width: '100%', maxWidth: vbW, height: 'auto', display: 'block' }}>
    <defs>
      <marker id="ont-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
        <polygon points="0 0, 7 3.5, 0 7" style={{ fill: 'var(--border)' }} />
      </marker>
      <marker id="ont-arrow-hi" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
        <polygon points="0 0, 7 3.5, 0 7" style={{ fill: 'var(--primary)' }} />
      </marker>
    </defs>

    {/* Swim lane backgrounds */}
    {lanes && lanes.map((lane, i) => (
      <rect key={`bg-${lane.type}`}
        x={0} y={lane.y - LANE_H / 2} width={vbW} height={LANE_H}
        style={{ fill: i % 2 === 0 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.07)', pointerEvents: 'none' }}
      />
    ))}

    {/* Lane labels */}
    {lanes && lanes.map(lane => (
      <text key={`lbl-${lane.type}`} x={8} y={lane.y + 4}
        style={{ fontSize: 8, fill: TYPE_META[lane.type]?.color || 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-sans)', fontWeight: 700, opacity: 0.55, pointerEvents: 'none' }}>
        {TYPE_META[lane.type]?.label?.toUpperCase()}
      </text>
    ))}

    {/* Edges */}
    {edges.map(edge => {
      const fn = nodes.find(n => n.id === edge.from);
      const tn = nodes.find(n => n.id === edge.to);
      if (!fn || !tn) return null;
      const hi = selectedId && (selectedId === edge.from || selectedId === edge.to);
      const d  = edgePath(fn, tn);
      const mx = (fn.x + tn.x) / 2;
      const my = (fn.y + tn.y) / 2 - 5;
      return (
        <g key={edge.id || `${edge.from}-${edge.to}`}>
          <path d={d} fill="none"
            style={{ stroke: hi ? 'var(--primary)' : 'var(--border)', strokeWidth: hi ? 2 : 1.5, opacity: hi ? 1 : 0.45 }}
            markerEnd={hi ? 'url(#ont-arrow-hi)' : 'url(#ont-arrow)'}
          />
          {hi && edge.label && (
            <text x={mx} y={my} textAnchor="middle"
              style={{ fontSize: 9, fill: 'var(--primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, pointerEvents: 'none' }}>
              {edge.label}
            </text>
          )}
        </g>
      );
    })}

    {/* Nodes */}
    {nodes.map(node => {
      const hw   = NODE_HALF_W[node.type] || NODE_HALF_W.default;
      const hh   = NODE_HALF_H;
      const fill = nodeFill(node);
      const isSel  = node.id === selectedId;
      const dimmed = selectedId && !isSel;
      return (
        <g key={node.id}
          transform={`translate(${node.x - hw}, ${node.y - hh})`}
          style={{ cursor: 'pointer' }}
          onClick={() => onSelect(isSel ? null : node.id)}
        >
          <rect width={hw * 2} height={hh * 2} rx={5}
            style={{
              fill,
              opacity: dimmed ? 0.22 : 1,
              stroke: isSel ? '#fff' : 'rgba(255,255,255,0.1)',
              strokeWidth: isSel ? 2.5 : 1,
              filter: isSel ? 'drop-shadow(0 0 7px rgba(255,255,255,0.3))' : 'none',
            }}
          />
          <text x={hw} y={hh - 4} textAnchor="middle"
            style={{ fontSize: 10, fontWeight: 700, fill: '#fff', fontFamily: 'var(--font-mono)', pointerEvents: 'none', opacity: dimmed ? 0.3 : 1 }}>
            {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
          </text>
          {node.sub && (
            <text x={hw} y={hh + 10} textAnchor="middle"
              style={{ fontSize: 8.5, fill: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)', pointerEvents: 'none', opacity: dimmed ? 0.25 : 1 }}>
              {String(node.sub).length > 16 ? String(node.sub).slice(0, 15) + '…' : String(node.sub)}
            </text>
          )}
        </g>
      );
    })}
  </svg>
);

/* ── Detail panel ────────────────────────────────────────────────────────── */
const OntologyDetail = ({ node, edges, nodes, onSelect, onClose }) => {
  const fill = nodeFill(node);
  const meta = TYPE_META[node.type] || {};

  const connected = edges
    .filter(e => e.from === node.id || e.to === node.id)
    .map(e => ({
      dir:    e.from === node.id ? '→' : '←',
      label:  e.label,
      nodeId: e.from === node.id ? e.to : e.from,
    }));

  const SKIP_KEYS = new Set(['sensors', 'projects', 'id']);
  const propRows = node.data
    ? Object.entries(node.data).filter(([k, v]) => !SKIP_KEYS.has(k) && v != null && String(v) !== '')
    : [];

  return (
    <div style={{ width: 272, borderLeft: '1px solid var(--border)', background: 'var(--card)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: 3, background: fill, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)', marginBottom: 1 }}>{meta.label}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', display: 'flex', padding: 0, borderRadius: 4 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--foreground)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
        ><Icon name="x" size={14} /></button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {propRows.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 6 }}>Свойства</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {propRows.map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'var(--muted)', borderRadius: 4, fontSize: 11, gap: 8 }}>
                  <span style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}>{key}</span>
                  <span style={{ fontFamily: typeof val === 'number' ? 'var(--font-mono)' : 'inherit', fontWeight: 500, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>
                    {Array.isArray(val) ? val.join(', ') : String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {connected.length > 0 && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 6 }}>Связи ({connected.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {connected.map((c, i) => {
                const tgt = nodes.find(n => n.id === c.nodeId);
                if (!tgt) return null;
                return (
                  <div key={i} onClick={() => onSelect(c.nodeId)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: 'var(--muted)', borderRadius: 4, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--muted)'}
                  >
                    <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{c.dir}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9, color: 'var(--muted-foreground)' }}>{c.label}</div>
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tgt.label}</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: nodeFill(tgt), flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Page ────────────────────────────────────────────────────────────────── */
const OntologyPage = () => {
  const [view,       setView]       = useOntState('instance');
  const [selectedId, setSelectedId] = useOntState(null);

  const [visibleTypes, setVisibleTypes] = useOntState(() => {
    const init = {};
    Object.keys(TYPE_META).forEach(t => { init[t] = TYPE_META[t].defaultVisible; });
    return init;
  });

  const toggleType = (type) => {
    setVisibleTypes(prev => ({ ...prev, [type]: !prev[type] }));
    setSelectedId(null);
  };

  const visibleSet = new Set(Object.keys(visibleTypes).filter(t => visibleTypes[t]));

  const { nodes, edges, vbH, lanes } = useOntMemo(() => {
    if (view === 'schema') {
      return {
        nodes: SCHEMA_NODES.map(n => ({ ...n, sub: null, status: null, data: {} })),
        edges: SCHEMA_EDGES,
        vbH: 640,
        lanes: null,
      };
    }
    return buildInstanceGraph(visibleSet);
  }, [view, visibleTypes]);

  const selectedNode = nodes.find(n => n.id === selectedId) || null;

  const g = window.GRAPH;
  const VB_W_GRAPH = view === 'schema' ? 1000 : VB_W;

  const COUNTS = g ? [
    { type: 'project',    n: Object.keys(g.projects || {}).length    },
    { type: 'system',     n: Object.keys(g.systems  || {}).length    },
    { type: 'asset',      n: Object.keys(g.assets   || {}).length    },
    { type: 'sensor',     n: Object.keys(g.sensors  || {}).length    },
    { type: 'event',      n: Object.keys(g.eventLinks || {}).length  },
    { type: 'task',       n: Object.keys(g.taskLinks  || {}).length  },
  ] : [];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--muted)' }}>

      {/* ── Header ── */}
      <div style={{ padding: '12px 24px', background: 'var(--card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="share-2" size={16} /></span>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>Онтология объектов</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 1 }}>
            {view === 'instance' ? 'Экземпляры и связи · все проекты' : 'Схема типов и отношений'}
          </div>
        </div>

        {view === 'instance' && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {COUNTS.map(({ type, n }) => (
              <div key={type} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--background)', fontSize: 11 }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: TYPE_META[type]?.color }} />
                <span style={{ color: 'var(--muted-foreground)' }}>{TYPE_META[type]?.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{n}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', background: 'var(--muted)', borderRadius: 'var(--radius)', padding: 2 }}>
          {[['instance', 'Экземпляры'], ['schema', 'Схема']].map(([v, lbl]) => (
            <button key={v} onClick={() => { setView(v); setSelectedId(null); }} style={{
              padding: '5px 14px', borderRadius: 'calc(var(--radius) - 2px)',
              background: view === v ? 'var(--card)' : 'transparent',
              border: 'none', cursor: 'pointer', fontSize: 12,
              fontWeight: view === v ? 600 : 400,
              color: view === v ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: view === v ? 'var(--shadow-sm)' : 'none', transition: 'all .15s',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* ── Filter bar (instance only) ── */}
      {view === 'instance' && (
        <div style={{ padding: '8px 24px', background: 'var(--background)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginRight: 2 }}>Типы:</span>
          {Object.entries(TYPE_META).map(([type, meta]) => {
            const on = visibleTypes[type];
            const cnt = g ? Object.keys(
              type === 'event' ? g.eventLinks : type === 'task' ? g.taskLinks : (g[type + 's'] || g[type] || {})
            ).length : 0;
            return (
              <button key={type} onClick={() => toggleType(type)} style={{
                padding: '3px 10px', borderRadius: 12, cursor: 'pointer', fontSize: 11,
                border: `1px solid ${on ? meta.color : 'var(--border)'}`,
                background: on ? meta.color : 'transparent',
                color: on ? '#fff' : 'var(--muted-foreground)',
                transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {meta.label}
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, opacity: on ? 0.8 : 0.6, fontSize: 10 }}>{cnt}</span>
              </button>
            );
          })}
          <button onClick={() => {
            const allOn = Object.values(visibleTypes).every(Boolean);
            const next = {};
            Object.keys(TYPE_META).forEach(t => { next[t] = !allOn; });
            if (allOn) Object.keys(TYPE_META).forEach(t => { next[t] = TYPE_META[t].defaultVisible; });
            setVisibleTypes(next);
            setSelectedId(null);
          }} style={{
            marginLeft: 4, padding: '3px 10px', borderRadius: 12, cursor: 'pointer', fontSize: 11,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--muted-foreground)', transition: 'all .15s',
          }}>
            {Object.values(visibleTypes).every(Boolean) ? 'Сбросить' : 'Все'}
          </button>
        </div>
      )}

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          {visibleSet.size === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', fontSize: 13 }}>
              Выберите хотя бы один тип сущности
            </div>
          ) : (
            <OntologyGraph
              nodes={nodes}
              edges={edges}
              selectedId={selectedId}
              onSelect={setSelectedId}
              vbW={VB_W_GRAPH}
              vbH={vbH}
              lanes={lanes}
            />
          )}
        </div>

        {selectedNode && (
          <OntologyDetail
            node={selectedNode}
            edges={edges}
            nodes={nodes}
            onSelect={setSelectedId}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      {/* ── Footer legend (schema only) ── */}
      {view === 'schema' && (
        <div style={{ padding: '8px 24px', background: 'var(--card)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)' }}>Типы:</span>
          {Object.entries(TYPE_META).map(([type, meta]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: meta.color }} />
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{meta.label}</span>
            </div>
          ))}
          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--muted-foreground)' }}>· Нажмите на узел для деталей</span>
        </div>
      )}
    </div>
  );
};

window.OntologyPage = OntologyPage;
