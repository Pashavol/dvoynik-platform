// WhatIfPage.jsx — What-if scenario modelling (portfolio + project level)

const { useState: useWIState, useMemo: useWIMemo } = React;

/* ── Date helpers ────────────────────────────────────────────────────────── */
const wiParseDate = (s) => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const wiFmtDate   = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const wiAddWeeks  = (s, w) => { const d = wiParseDate(s); d.setDate(d.getDate() + w*7); return wiFmtDate(d); };
const MONTHS_SHORT = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];

/* ── Baseline (ЭЛОУ-АВТ-6) ──────────────────────────────────────────────── */
const PHASE_SCHEDULE = {
  'PH-PIR': { name: 'ПИР',           start: '2024-01-15', end: '2024-05-31', color: '#14532d', status: 'done'    },
  'PH-OIM': { name: 'Оборуд. и МТР', start: '2024-03-01', end: '2024-09-30', color: '#065f46', status: 'done'    },
  'PH-SMR': { name: 'СМР',           start: '2024-10-01', end: '2026-06-30', color: '#1d4ed8', status: 'active'  },
  'PH-PNR': { name: 'ПНР',           start: '2026-07-01', end: '2026-11-30', color: '#374151', status: 'pending' },
  'PH-SDA': { name: 'Сдача',         start: '2026-12-01', end: '2027-01-31', color: '#374151', status: 'pending' },
};
const PHASE_ORDER = ['PH-PIR','PH-OIM','PH-SMR','PH-PNR','PH-SDA'];
const OVERHEAD_WK = 30;
const TODAY_WI    = '2026-04-27';

/* ── Scenario types ──────────────────────────────────────────────────────── */
const SC_TYPES = {
  schedule: { label: 'Задержка фазы',       icon: 'calendar',       color: '#1d4ed8' },
  resource:  { label: 'Нехватка ресурсов',  icon: 'users',          color: '#065f46' },
  cost:      { label: 'Рост стоимости',     icon: 'trending-up',    color: '#92400e' },
  failure:   { label: 'Отказ оборудования', icon: 'alert-triangle', color: '#991b1b' },
};

/* ── Risk meta ───────────────────────────────────────────────────────────── */
const RISK_META = {
  low:      { label: 'Низкий',      labelShort: 'Низкий',   color: '#16a34a', bg: 'rgba(22,163,74,0.13)'    },
  medium:   { label: 'Средний',     labelShort: 'Средний',  color: '#d97706', bg: 'rgba(217,119,6,0.13)'    },
  high:     { label: 'Высокий',     labelShort: 'Высокий',  color: '#b45309', bg: 'rgba(180,83,9,0.15)'     },
  critical: { label: 'Критический', labelShort: 'Критич.',  color: '#dc2626', bg: 'rgba(220,38,38,0.14)'    },
};
const RISK_ORD = { low: 0, medium: 1, high: 2, critical: 3 };
const calcRisk = (delayWks, budgetMln) => {
  if (delayWks > 8 || budgetMln > 1200) return 'critical';
  if (delayWks > 4 || budgetMln > 600)  return 'high';
  if (delayWks > 1 || budgetMln > 150)  return 'medium';
  return 'low';
};

/* ── Portfolio data ──────────────────────────────────────────────────────── */
const PORTFOLIO_RISKS = {
  'elou-6':   { schedule: 'high',     resource: 'high',   cost: 'medium', failure: 'high'     },
  'gpz-2':    { schedule: 'medium',   resource: 'low',    cost: 'low',    failure: 'low'      },
  'ust-luga': { schedule: 'low',      resource: 'low',    cost: 'low',    failure: 'low'      },
  'vankor':   { schedule: 'high',     resource: 'medium', cost: 'medium', failure: 'medium'   },
  'kstovo':   { schedule: 'critical', resource: 'high',   cost: 'high',   failure: 'critical' },
  'astra':    { schedule: 'low',      resource: 'low',    cost: 'low',    failure: 'low'      },
};
const PROJECT_BUDGETS   = { 'elou-6': 24800, 'gpz-2': 8400, 'ust-luga': 12600, 'vankor': 18300, 'kstovo': 6200, 'astra': 4100 };
const PROJECT_OVERHEAD  = { 'elou-6': 30,    'gpz-2': 10,   'ust-luga': 15,    'vankor': 22,    'kstovo': 8,    'astra': 5    };
const SEVERITY_PRESETS  = {
  mild:     { label: 'Мягкий',    schedule: 2, resource: 1, cost: 10, failure: 1 },
  moderate: { label: 'Умеренный', schedule: 4, resource: 3, cost: 20, failure: 2 },
  severe:   { label: 'Тяжёлый',   schedule: 8, resource: 6, cost: 35, failure: 4 },
};

/* ── Phase shift helpers ─────────────────────────────────────────────────── */
const shiftFrom = (phaseId, weeks) => {
  const idx = PHASE_ORDER.indexOf(phaseId);
  const out = {};
  PHASE_ORDER.forEach((pid, i) => {
    const b = PHASE_SCHEDULE[pid];
    out[pid] = (i >= idx && weeks > 0)
      ? { ...b, start: wiAddWeeks(b.start, weeks), end: wiAddWeeks(b.end, weeks), delayed: true }
      : { ...b, delayed: false };
  });
  return out;
};
const noShift = () => Object.fromEntries(PHASE_ORDER.map(p => [p, { ...PHASE_SCHEDULE[p], delayed: false }]));

/* ── Impact computers (project-level) ───────────────────────────────────── */
const computeScheduleImpact = (p) => {
  const g = window.GRAPH;
  const { phaseId, delayWeeks } = p.schedule;
  const schedule = shiftFrom(phaseId, delayWeeks);
  const budget   = delayWeeks * OVERHEAD_WK;
  const affected = g ? Object.keys(g.taskLinks).filter(t => g.taskLinks[t].brigadeId && g.taskLinks[t].brigadeId !== 'br-7') : [];
  const desc = `Задержка фазы «${PHASE_SCHEDULE[phaseId]?.name}» на ${delayWeeks} нед. сдвигает все последующие фазы. Доп. расходы — содержание площадки и управление проектом.`;
  return { schedule, projectDelay: delayWeeks, budgetImpact: budget, affectedTasks: affected, desc, riskKey: calcRisk(delayWeeks, budget) };
};
const computeResourceImpact = (p) => {
  const g = window.GRAPH;
  const { brigadeId, unavailableWeeks } = p.resource;
  const brigade  = g?.brigades?.[brigadeId];
  const critical = new Set(['br-1','br-3','br-5']);
  const affected = g ? Object.keys(g.taskLinks).filter(t => g.taskLinks[t].brigadeId === brigadeId) : [];
  const delay    = critical.has(brigadeId) ? unavailableWeeks : Math.floor(unavailableWeeks / 2);
  const budget   = unavailableWeeks * 15 + delay * OVERHEAD_WK;
  const schedule = delay > 0 ? shiftFrom('PH-SMR', delay) : noShift();
  const desc = `Недоступность бригады «${brigade?.name || brigadeId}» на ${unavailableWeeks} нед. блокирует ${affected.length} задач. `
    + (critical.has(brigadeId) ? 'Бригада на критическом пути — задержка каскадирует.' : 'Частично компенсируется перераспределением.');
  return { schedule, projectDelay: delay, budgetImpact: budget, affectedTasks: affected, desc, riskKey: calcRisk(delay, budget) };
};
const computeCostImpact = (p) => {
  const g = window.GRAPH;
  const { lineId, overrunPct } = p.cost;
  const line    = g?.budgetLines?.[lineId];
  const overrun = line ? line.planned * overrunPct / 100 : 0;
  const reserve = g?.budgetLines?.['BL-RES']?.planned || 808;
  const covered = overrun <= reserve;
  const desc = `Перерасход «${line?.name || lineId}» на ${overrunPct}% = ${Math.round(overrun)} млн ₽. `
    + (covered ? `Резерв (${reserve} млн ₽) покрывает.` : `Дефицит ${Math.round(overrun - reserve)} млн ₽ — требуется корректировка.`);
  return { schedule: noShift(), projectDelay: 0, budgetImpact: overrun, affectedTasks: [], desc, riskKey: calcRisk(0, overrun), extra: { overrun, reserve, covered } };
};
const computeFailureImpact = (p) => {
  const g = window.GRAPH;
  const { assetId, downtimeWeeks } = p.failure;
  const asset    = g?.assets?.[assetId];
  const affected = g?.getAssetTasks?.(assetId) || [];
  const sensors  = asset?.sensors || [];
  const budget   = downtimeWeeks * 45;
  const delay    = Math.max(0, downtimeWeeks - 2);
  const schedule = delay > 0 ? shiftFrom('PH-PNR', delay) : noShift();
  const desc = `Останов ${asset?.type || assetId} (${assetId}) на ${downtimeWeeks} нед. выводит ${sensors.length} датчик${sensors.length === 1 ? '' : 'а'} и блокирует ${affected.length} задач. `
    + (delay > 0 ? `Каскадная задержка ПНР на ${delay} нед.` : 'Задержка ПНР не прогнозируется.');
  return { schedule, projectDelay: delay, budgetImpact: budget, affectedTasks: affected, affectedSensors: sensors, desc, riskKey: calcRisk(delay, budget) };
};
const computeImpact = (type, params) => {
  if (type === 'schedule') return computeScheduleImpact(params);
  if (type === 'resource')  return computeResourceImpact(params);
  if (type === 'cost')      return computeCostImpact(params);
  return computeFailureImpact(params);
};

/* ── Shared UI primitives ────────────────────────────────────────────────── */
const SliderField = ({ label, value, min, max, step = 1, unit, onChange, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
      <label style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{label}</label>
      <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>{value} {unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: color, cursor: 'pointer', margin: 0 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
      <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>{min}</span>
      <span style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>{max}</span>
    </div>
  </div>
);
const SelectField = ({ label, value, options, onChange }) => (
  <div>
    <label style={{ fontSize: 11, color: 'var(--muted-foreground)', display: 'block', marginBottom: 5 }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 13, cursor: 'pointer' }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
const KpiCard = ({ icon, label, value, color, sub }) => (
  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color, display: 'flex' }}><Icon name={icon} size={14} /></span>
      <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{label}</span>
    </div>
    <div style={{ fontSize: 22, fontFamily: 'var(--font-mono)', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{sub}</div>}
  </div>
);
const EntityChip = ({ id, label, chipColor, icon }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: `${chipColor}18`, border: `1px solid ${chipColor}35`, borderRadius: 6, fontSize: 12 }}>
    <span style={{ color: chipColor, display: 'flex' }}><Icon name={icon} size={11} /></span>
    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{id}</span>
    {label && <span style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>· {label}</span>}
  </div>
);
const RiskChip = ({ level }) => {
  const m = RISK_META[level] || RISK_META.low;
  return (
    <div style={{ padding: '3px 9px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: m.bg, color: m.color, border: `1px solid ${m.color}40`, whiteSpace: 'nowrap', display: 'inline-block' }}>
      {m.labelShort}
    </div>
  );
};

/* ── Phase Gantt (project-level) ─────────────────────────────────────────── */
const GANTT_S    = wiParseDate('2024-01-01');
const GANTT_E    = wiParseDate('2027-06-01');
const GANTT_DAYS = (GANTT_E - GANTT_S) / 86400000;
const gx = (s, w) => Math.max(0, (wiParseDate(s) - GANTT_S) / 86400000 / GANTT_DAYS * w);

const PhaseTimeline = ({ schedule }) => {
  const VB_W = 920; const ROW_H = 54; const BAR_H = 18;
  const VB_H = PHASE_ORDER.length * ROW_H + 34;
  const todayX = gx(TODAY_WI, VB_W);
  const markers = [];
  let m = new Date(2024, 0, 1);
  while (m < GANTT_E) {
    if (m.getMonth() % 3 === 0)
      markers.push({ x: gx(wiFmtDate(m), VB_W), label: `${MONTHS_SHORT[m.getMonth()]} ${String(m.getFullYear()).slice(2)}` });
    m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
  }
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="calendar" size={14} /></span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>График фаз · Baseline vs Сценарий</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
          {[['#1d4ed8', 0.35, 'Baseline'], ['#b45309', 1, 'Сценарий'], ['var(--primary)', 1, 'Сегодня']].map(([c,o,lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted-foreground)' }}>
              {lbl === 'Сегодня' ? <div style={{ width: 2, height: 14, background: c }} /> : <div style={{ width: 22, height: 8, borderRadius: 2, background: c, opacity: o }} />}
              {lbl}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', padding: '4px 16px 12px' }}>
        <div style={{ width: 118, flexShrink: 0, paddingTop: 34 }}>
          {PHASE_ORDER.map(pid => {
            const isDelayed = schedule[pid]?.delayed;
            return (
              <div key={pid} style={{ height: ROW_H, display: 'flex', alignItems: 'center', fontSize: 12, paddingRight: 8, fontWeight: isDelayed ? 600 : 400, color: isDelayed ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                {PHASE_SCHEDULE[pid].name}{isDelayed && <span style={{ marginLeft: 4, color: '#b45309', fontSize: 9 }}>▲</span>}
              </div>
            );
          })}
        </div>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ flex: 1, height: VB_H, display: 'block' }}>
          {markers.map(({ x, label }) => (
            <g key={label}>
              <line x1={x} y1={0} x2={x} y2={VB_H} style={{ stroke: 'var(--border)', strokeWidth: 0.5, opacity: 0.5 }} />
              <text x={x+3} y={15} style={{ fontSize: 8, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}>{label}</text>
            </g>
          ))}
          {PHASE_ORDER.map((pid, i) => {
            const base = PHASE_SCHEDULE[pid]; const sc = schedule[pid];
            const y = 34 + i * ROW_H + (ROW_H - BAR_H) / 2;
            const bx1 = gx(base.start, VB_W); const bx2 = gx(base.end, VB_W); const bw = Math.max(3, bx2 - bx1);
            const sx1 = gx(sc.start, VB_W);   const sx2 = gx(sc.end, VB_W);   const sw = Math.max(3, sx2 - sx1);
            const isDelayed = sc.delayed;
            const delayWks  = isDelayed ? Math.round((wiParseDate(sc.end) - wiParseDate(base.end)) / (7*86400000)) : 0;
            return (
              <g key={pid}>
                <rect x={bx1} y={y+2} width={bw} height={BAR_H-4} rx={3} style={{ fill: base.color, opacity: isDelayed ? 0.2 : base.status === 'done' ? 0.75 : 0.45 }} />
                {isDelayed && <rect x={sx1} y={y} width={sw} height={BAR_H} rx={3} style={{ fill: '#b45309', opacity: 0.82 }} />}
                {isDelayed && <text x={sx2+6} y={y+BAR_H/2+4} style={{ fontSize: 9, fill: '#b45309', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{`+${delayWks}н`}</text>}
              </g>
            );
          })}
          <line x1={todayX} y1={0} x2={todayX} y2={VB_H} style={{ stroke: 'var(--primary)', strokeWidth: 1.5, strokeDasharray: '4 3', opacity: 0.7 }} />
          <text x={todayX+4} y={VB_H-5} style={{ fontSize: 8, fill: 'var(--primary)', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>сегодня</text>
        </svg>
      </div>
    </div>
  );
};

/* ── Scenario left panel ─────────────────────────────────────────────────── */
const ScenarioPanel = ({ scenarioType, params, onTypeChange, onParam }) => {
  const g = window.GRAPH;
  return (
    <div style={{ width: 300, borderRight: '1px solid var(--border)', background: 'var(--card)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Тип сценария</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.entries(SC_TYPES).map(([key, meta]) => {
            const on = key === scenarioType;
            return (
              <button key={key} onClick={() => onTypeChange(key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 11px', background: on ? `${meta.color}1e` : 'transparent', border: `1px solid ${on ? meta.color+'55' : 'transparent'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left', transition: 'all .13s' }}>
                <span style={{ color: meta.color, display: 'flex', flexShrink: 0 }}><Icon name={meta.icon} size={14} /></span>
                <span style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {scenarioType === 'schedule' && (<>
          <SelectField label="Задержанная фаза" value={params.schedule.phaseId}
            options={PHASE_ORDER.filter(p => PHASE_SCHEDULE[p].status !== 'done').map(p => ({ value: p, label: PHASE_SCHEDULE[p].name }))}
            onChange={v => onParam('phaseId', v)} />
          <SliderField label="Задержка" value={params.schedule.delayWeeks} min={1} max={16} unit="нед." onChange={v => onParam('delayWeeks', v)} color="#1d4ed8" />
        </>)}
        {scenarioType === 'resource' && g && (<>
          <SelectField label="Бригада" value={params.resource.brigadeId}
            options={Object.values(g.brigades).map(b => ({ value: b.id, label: b.name }))}
            onChange={v => onParam('brigadeId', v)} />
          <SliderField label="Недоступность" value={params.resource.unavailableWeeks} min={1} max={8} unit="нед." onChange={v => onParam('unavailableWeeks', v)} color="#065f46" />
        </>)}
        {scenarioType === 'cost' && g && (<>
          <SelectField label="Статья бюджета" value={params.cost.lineId}
            options={Object.values(g.budgetLines).filter(bl => bl.id !== 'BL-RES').map(bl => ({ value: bl.id, label: `${bl.name} — ${bl.planned.toLocaleString('ru-RU')} млн` }))}
            onChange={v => onParam('lineId', v)} />
          <SliderField label="Перерасход" value={params.cost.overrunPct} min={5} max={50} step={5} unit="%" onChange={v => onParam('overrunPct', v)} color="#92400e" />
        </>)}
        {scenarioType === 'failure' && g && (<>
          <SelectField label="Оборудование" value={params.failure.assetId}
            options={Object.values(g.assets).map(a => ({ value: a.id, label: `${a.id} · ${a.type}` }))}
            onChange={v => onParam('assetId', v)} />
          <SliderField label="Простой" value={params.failure.downtimeWeeks} min={1} max={6} unit="нед." onChange={v => onParam('downtimeWeeks', v)} color="#991b1b" />
        </>)}
        {/* Baseline reference */}
        <div style={{ padding: 10, background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: 6 }}>Базовый план</div>
          {PHASE_ORDER.map(pid => {
            const ph = PHASE_SCHEDULE[pid];
            return (
              <div key={pid} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 11, borderBottom: '1px solid var(--border)', opacity: ph.status === 'done' ? 0.5 : 1 }}>
                <span style={{ color: 'var(--muted-foreground)' }}>{ph.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{MONTHS_SHORT[wiParseDate(ph.end).getMonth()]} {wiParseDate(ph.end).getFullYear()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ── PROJECT-LEVEL WHAT-IF CONTENT ───────────────────────────────────────── */
const ProjectWhatIfContent = () => {
  const [scenarioType, setScenarioType] = useWIState('schedule');
  const [params, setParams] = useWIState({
    schedule: { phaseId: 'PH-SMR', delayWeeks: 4 },
    resource:  { brigadeId: 'br-1', unavailableWeeks: 3 },
    cost:      { lineId: 'BL-SMR', overrunPct: 20 },
    failure:   { assetId: 'V-1208', downtimeWeeks: 2 },
  });
  const onTypeChange = (t) => setScenarioType(t);
  const onParam = (key, val) => setParams(prev => ({ ...prev, [scenarioType]: { ...prev[scenarioType], [key]: val } }));
  const impact  = useWIMemo(() => computeImpact(scenarioType, params), [scenarioType, params]);
  const g       = window.GRAPH;
  const scType  = SC_TYPES[scenarioType];
  const risk    = RISK_META[impact.riskKey];
  const KPIS = [
    { icon: 'calendar',     label: 'Задержка проекта', value: impact.projectDelay > 0 ? `+${impact.projectDelay} нед.` : 'Нет',          color: impact.projectDelay > 0 ? '#b45309' : 'var(--muted-foreground)', sub: impact.projectDelay > 0 ? `Сдача сдвигается на ${impact.projectDelay} нед.` : 'График не меняется' },
    { icon: 'trending-up',  label: 'Доп. расходы',     value: impact.budgetImpact > 0 ? `+${Math.round(impact.budgetImpact).toLocaleString('ru-RU')} млн` : '—', color: impact.budgetImpact > 500 ? '#dc2626' : impact.budgetImpact > 0 ? '#b45309' : 'var(--muted-foreground)', sub: impact.budgetImpact > 0 ? 'млн ₽ сверх плана' : 'Бюджет не затрагивается' },
    { icon: 'check-square', label: 'Задач под угрозой', value: impact.affectedTasks.length > 0 ? impact.affectedTasks.length : '—',       color: impact.affectedTasks.length > 0 ? '#5b21b6' : 'var(--muted-foreground)', sub: impact.affectedTasks.length > 0 ? `из ${g ? Object.keys(g.taskLinks).length : '?'} задач` : 'Задачи не затронуты' },
    { icon: 'shield',       label: 'Уровень риска',     value: risk.label,                                                                color: risk.color, sub: `Сценарий: ${scType.label}` },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--muted)' }}>
      <div style={{ padding: '8px 20px', background: 'var(--card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="sparkles" size={14} /></span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Симуляция сценариев</span>
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>· ЭЛОУ-АВТ-6</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 'var(--radius)', background: risk.bg, border: `1px solid ${risk.color}40` }}>
          <span style={{ color: risk.color, display: 'flex' }}><Icon name="shield" size={13} /></span>
          <span style={{ fontSize: 12, fontWeight: 700, color: risk.color }}>Риск: {risk.label}</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ScenarioPanel scenarioType={scenarioType} params={params} onTypeChange={onTypeChange} onParam={onParam} />
        <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {KPIS.map((k, i) => <KpiCard key={i} {...k} />)}
          </div>
          <div style={{ background: `${scType.color}14`, border: `1px solid ${scType.color}35`, borderRadius: 'var(--radius)', padding: '12px 16px', display: 'flex', gap: 10 }}>
            <span style={{ color: scType.color, display: 'flex', flexShrink: 0, marginTop: 1 }}><Icon name={scType.icon} size={15} /></span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: scType.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{scType.label}</div>
              <div style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.55 }}>{impact.desc}</div>
            </div>
          </div>
          <PhaseTimeline schedule={impact.schedule} />
          {(impact.affectedTasks.length > 0 || impact.affectedSensors?.length > 0) && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#b45309', display: 'flex' }}><Icon name="alert-triangle" size={14} /></span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Затронутые объекты</span>
                <span style={{ marginLeft: 4, fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--muted-foreground)', background: 'var(--muted)', padding: '1px 7px', borderRadius: 10 }}>{impact.affectedTasks.length + (impact.affectedSensors?.length || 0)}</span>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {impact.affectedTasks.map(tid => {
                  const link = g?.taskLinks?.[tid];
                  return <EntityChip key={tid} id={tid} label={link?.brigadeId ? g?.brigades?.[link.brigadeId]?.name : null} chipColor="#5b21b6" icon="check-square" />;
                })}
                {impact.affectedSensors?.map(sid => <EntityChip key={sid} id={sid} chipColor="#dc2626" icon="activity" />)}
              </div>
            </div>
          )}
          {scenarioType === 'cost' && impact.extra && (
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Анализ резерва бюджета</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Перерасход',    value: `+${Math.round(impact.extra.overrun).toLocaleString('ru-RU')} млн ₽`, color: '#b45309' },
                  { label: 'Резерв BL-RES', value: `${Math.round(impact.extra.reserve).toLocaleString('ru-RU')} млн ₽`,  color: '#16a34a' },
                  { label: 'Покрытие',      value: impact.extra.covered ? 'Резерв достаточен' : `Дефицит ${Math.round(impact.extra.overrun - impact.extra.reserve).toLocaleString('ru-RU')} млн ₽`, color: impact.extra.covered ? '#16a34a' : '#dc2626' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', background: 'var(--muted)', borderRadius: 4, fontSize: 12 }}>
                    <span style={{ color: 'var(--muted-foreground)' }}>{row.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: row.color }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ height: 8, borderRadius: 4, background: 'var(--muted)', overflow: 'hidden', marginTop: 4 }}>
                  <div style={{ height: '100%', width: `${Math.min(100, impact.extra.overrun / impact.extra.reserve * 100)}%`, background: impact.extra.covered ? '#16a34a' : '#dc2626', borderRadius: 4, transition: 'width 0.35s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── PORTFOLIO-LEVEL WHAT-IF PAGE ────────────────────────────────────────── */
const WhatIfPage = ({ onOpenProject }) => {
  const [scType,   setScType]   = useWIState('schedule');
  const [severity, setSeverity] = useWIState('moderate');

  const g = window.GRAPH;

  // Portfolio static KPIs
  const criticalCount = Object.values(PORTFOLIO_RISKS).reduce((n, risks) =>
    n + Object.values(risks).filter(r => r === 'critical').length, 0);
  const highRiskProjects = Object.entries(PORTFOLIO_RISKS).filter(([, risks]) =>
    Object.values(risks).some(r => RISK_ORD[r] >= 2)).map(([id]) => id);
  const budgetAtRiskMln = Object.entries(PORTFOLIO_RISKS).reduce((sum, [pid, risks]) => {
    const maxRisk = Object.values(risks).reduce((mx, r) => RISK_ORD[r] > RISK_ORD[mx] ? r : mx, 'low');
    const factor = { low: 0, medium: 0.03, high: 0.10, critical: 0.20 }[maxRisk];
    return sum + (PROJECT_BUDGETS[pid] || 0) * factor;
  }, 0);

  // Quick scenario impact (dynamic)
  const quickImpact = useWIMemo(() => {
    const sv = SEVERITY_PRESETS[severity];
    const delayWks = scType === 'schedule' ? sv.schedule : scType === 'resource' ? sv.resource : scType === 'failure' ? sv.failure : 0;
    const costPct  = scType === 'cost' ? sv.cost : 0;
    const affected = Object.entries(PORTFOLIO_RISKS).filter(([, risks]) => RISK_ORD[risks[scType]] >= 1);
    const budgetMln = affected.reduce((sum, [pid]) => {
      return sum + (delayWks > 0 ? delayWks * (PROJECT_OVERHEAD[pid] || 10) : (PROJECT_BUDGETS[pid] || 0) * costPct / 100);
    }, 0);
    return { count: affected.length, budgetMln: Math.round(budgetMln), delayWks, affectedIds: affected.map(([id]) => id) };
  }, [scType, severity]);

  const projects = g?.projects ? Object.values(g.projects) : [];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--muted)' }}>

      {/* Header */}
      <div style={{ padding: '12px 24px', background: 'var(--card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="sparkles" size={16} /></span>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>What-if моделирование</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 1 }}>Портфель проектов · матрица рисков по сценариям</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 5 }}>
          {criticalCount > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 'var(--radius)', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)' }}>
              <span style={{ color: '#dc2626', display: 'flex' }}><Icon name="alert-octagon" size={14} /></span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>{criticalCount} критических сценария</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Portfolio KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <KpiCard icon="alert-triangle" label="Проектов с высоким риском" value={highRiskProjects.length} color="#b45309"
            sub={highRiskProjects.map(id => g?.projects?.[id]?.name || id).join(', ')} />
          <KpiCard icon="trending-up" label="Бюджет под угрозой" value={`${Math.round(budgetAtRiskMln).toLocaleString('ru-RU')} млн`} color="#b45309"
            sub="совокупная оценка по портфелю" />
          <KpiCard icon="alert-octagon" label="Критических сценариев" value={criticalCount} color="#dc2626"
            sub="требуют немедленного реагирования" />
        </div>

        {/* Risk matrix */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="layers" size={14} /></span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Матрица рисков</span>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)', marginLeft: 4 }}>— влияние четырёх сценариев на каждый проект</span>
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px 160px 48px', padding: '8px 20px', borderBottom: '1px solid var(--border)', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted-foreground)' }}>Проект</div>
            {Object.entries(SC_TYPES).map(([key, meta]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: meta.color, display: 'flex' }}><Icon name={meta.icon} size={12} /></span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)' }}>{meta.label}</span>
              </div>
            ))}
            <div />
          </div>

          {/* Project rows */}
          {projects.map((proj, i) => {
            const risks = PORTFOLIO_RISKS[proj.id] || { schedule: 'low', resource: 'low', cost: 'low', failure: 'low' };
            const maxRisk = Object.values(risks).reduce((mx, r) => RISK_ORD[r] > RISK_ORD[mx] ? r : mx, 'low');
            const hasData = proj.id === 'elou-6';
            return (
              <div key={proj.id} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 160px 160px 160px 48px', padding: '10px 20px', borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none', gap: 8, alignItems: 'center', transition: 'background .1s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--muted)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: RISK_META[maxRisk]?.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{proj.name}</span>
                    {hasData && <span style={{ fontSize: 10, color: 'var(--primary)', background: 'rgba(var(--primary-rgb),0.1)', padding: '1px 6px', borderRadius: 3, fontWeight: 600 }}>детали</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, paddingLeft: 16 }}>
                    <div style={{ height: 4, width: 80, background: 'var(--muted)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${proj.progress}%`, background: proj.status === 'crit' ? '#dc2626' : proj.status === 'warn' ? '#d97706' : '#16a34a', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{proj.progress}%</span>
                  </div>
                </div>
                {Object.keys(SC_TYPES).map(key => (
                  <div key={key}><RiskChip level={risks[key] || 'low'} /></div>
                ))}
                <button onClick={() => onOpenProject && onOpenProject(proj.id)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: hasData ? 'var(--primary)' : 'var(--muted)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: hasData ? 'pointer' : 'default', color: hasData ? '#fff' : 'var(--muted-foreground)', transition: 'opacity .15s' }}
                  title={hasData ? 'Открыть детальный анализ' : 'Данные по проекту не загружены'}
                  onMouseEnter={e => { if (hasData) e.currentTarget.style.opacity = '0.8'; }}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <Icon name="arrow-right" size={14} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick scenario runner */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="sparkles" size={14} /></span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Быстрый сценарий</span>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)', marginLeft: 4 }}>— что если ВСЕ проекты столкнутся с:</span>
          </div>
          <div style={{ padding: '14px 20px', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Scenario type selector */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, marginBottom: 8 }}>Тип сценария</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Object.entries(SC_TYPES).map(([key, meta]) => (
                  <button key={key} onClick={() => setScType(key)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, border: `1px solid ${scType === key ? meta.color : 'var(--border)'}`, background: scType === key ? `${meta.color}20` : 'transparent', color: scType === key ? meta.color : 'var(--muted-foreground)', fontSize: 12, cursor: 'pointer', fontWeight: scType === key ? 600 : 400, transition: 'all .13s' }}>
                    <span style={{ display: 'flex' }}><Icon name={meta.icon} size={12} /></span>
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontWeight: 600, marginBottom: 8 }}>Тяжесть</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.entries(SEVERITY_PRESETS).map(([key, sv]) => (
                  <button key={key} onClick={() => setSeverity(key)} style={{ padding: '5px 16px', borderRadius: 20, border: `1px solid ${severity === key ? 'var(--primary)' : 'var(--border)'}`, background: severity === key ? 'var(--primary)' : 'transparent', color: severity === key ? '#fff' : 'var(--muted-foreground)', fontSize: 12, cursor: 'pointer', fontWeight: severity === key ? 600 : 400, transition: 'all .13s' }}>
                    {sv.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact result */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
              {[
                { icon: 'box', label: 'Проектов затронуто', value: quickImpact.count, color: '#b45309' },
                { icon: 'trending-up', label: 'Бюджет', value: `+${quickImpact.budgetMln.toLocaleString('ru-RU')} млн`, color: '#b45309' },
                ...(quickImpact.delayWks > 0 ? [{ icon: 'calendar', label: 'Задержка', value: `до +${quickImpact.delayWks} нед.`, color: '#b45309' }] : []),
              ].map((kpi, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4 }}>{kpi.label}</div>
                  <div style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Affected projects row */}
          {quickImpact.affectedIds.length > 0 && (
            <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Затронуты:</span>
              {quickImpact.affectedIds.map(pid => {
                const p = g?.projects?.[pid];
                return (
                  <div key={pid} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: RISK_META[PORTFOLIO_RISKS[pid]?.[scType]]?.color }} />
                    {p?.name || pid}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

window.WhatIfPage        = WhatIfPage;
window.ProjectWhatIfContent = ProjectWhatIfContent;
