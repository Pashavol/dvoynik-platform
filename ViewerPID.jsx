// ViewerPID.jsx — P&ID diagram with pan + zoom

// ── Module-level symbols (stable references — no remount on re-render) ────────

const PIDInst = ({ x, y, code, num, connected }) => (
  <g>
    {connected && <line x1={x} y1={y} x2={connected[0]} y2={connected[1]} stroke="#555" strokeWidth="1" strokeDasharray="4 2"/>}
    <circle cx={x} cy={y} r={20} fill="#fff" stroke="#1a2a3a" strokeWidth="1.5"/>
    <line x1={x-20} y1={y} x2={x+20} y2={y} stroke="#1a2a3a" strokeWidth="1"/>
    <text x={x} y={y-5} textAnchor="middle" fontSize="9" fontWeight="600" fill="#1a2a3a" fontFamily="monospace">{code}</text>
    <text x={x} y={y+10} textAnchor="middle" fontSize="8" fill="#1a2a3a" fontFamily="monospace">{num}</text>
  </g>
);

const PIDGateValve = ({ x, y, horizontal = true }) => horizontal ? (
  <g>
    <polygon points={`${x-12},${y-10} ${x},${y} ${x-12},${y+10}`} fill="#1a2a3a"/>
    <polygon points={`${x+12},${y-10} ${x},${y} ${x+12},${y+10}`} fill="#1a2a3a"/>
    <line x1={x} y1={y-10} x2={x} y2={y-22} stroke="#1a2a3a" strokeWidth="1.5"/>
    <rect x={x-6} y={y-26} width={12} height={5} fill="#1a2a3a"/>
  </g>
) : (
  <g>
    <polygon points={`${x-10},${y-12} ${x},${y} ${x+10},${y-12}`} fill="#1a2a3a"/>
    <polygon points={`${x-10},${y+12} ${x},${y} ${x+10},${y+12}`} fill="#1a2a3a"/>
    <line x1={x+10} y1={y} x2={x+22} y2={y} stroke="#1a2a3a" strokeWidth="1.5"/>
    <rect x={x+22} y={y-3} width={5} height={6} fill="#1a2a3a"/>
  </g>
);

const PIDCtrlValve = ({ x, y }) => (
  <g>
    <polygon points={`${x-12},${y-10} ${x},${y} ${x-12},${y+10}`} fill="#1a2a3a"/>
    <polygon points={`${x+12},${y-10} ${x},${y} ${x+12},${y+10}`} fill="none" stroke="#1a2a3a" strokeWidth="1.5"/>
    <line x1={x} y1={y-10} x2={x} y2={y-28} stroke="#1a2a3a" strokeWidth="1.5"/>
    <circle cx={x} cy={y-36} r={10} fill="#fff" stroke="#1a2a3a" strokeWidth="1.5"/>
    <text x={x} y={y-32} textAnchor="middle" fontSize="8" fill="#1a2a3a" fontFamily="monospace">FC</text>
  </g>
);

const PIDCheckValve = ({ x, y }) => (
  <g>
    <polygon points={`${x-10},${y-9} ${x+10},${y} ${x-10},${y+9}`} fill="#1a2a3a"/>
    <line x1={x+10} y1={y-10} x2={x+10} y2={y+10} stroke="#1a2a3a" strokeWidth="2"/>
  </g>
);

const PIDPump = ({ x, y, tag, standby, selected, onSelect }) => {
  const sel = selected === tag;
  return (
    <g onClick={() => onSelect(tag)} style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={y} r={34} fill={sel ? '#dbeafe' : '#ffffff'} stroke={sel ? '#1a6fc4' : '#1a2a3a'} strokeWidth={sel ? 3 : 1.5}/>
      <polygon points={`${x},${y-22} ${x+22},${y} ${x},${y+22}`} fill={sel ? '#1a6fc4' : '#2a3a48'}/>
      <line x1={x-34} y1={y} x2={x-46} y2={y} stroke="#1a2a3a" strokeWidth="3"/>
      <line x1={x} y1={y-34} x2={x} y2={y-46} stroke="#1a2a3a" strokeWidth="3"/>
      <text x={x} y={y+50} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a2a3a" fontFamily="monospace">{tag}</text>
      {standby && <text x={x} y={y+63} textAnchor="middle" fontSize="9" fill="#6a8a9a" fontFamily="monospace">(резерв)</text>}
    </g>
  );
};

const PIDHeatEx = ({ x, y, tag, selected, onSelect }) => {
  const sel = selected === tag;
  const fill = sel ? '#dbeafe' : '#ffffff';
  const str  = sel ? '#1a6fc4' : '#1a2a3a';
  const sw   = sel ? 3 : 1.5;
  return (
    <g onClick={() => onSelect(tag)} style={{ cursor: 'pointer' }}>
      <rect x={x-85} y={y-36} width={170} height={72} fill={fill} stroke={str} strokeWidth={sw} rx="36"/>
      <ellipse cx={x-85} cy={y} rx={36} ry={36} fill={fill} stroke={str} strokeWidth={sw}/>
      <ellipse cx={x+85} cy={y} rx={36} ry={36} fill={fill} stroke={str} strokeWidth={sw}/>
      {[-18,-9,0,9,18].map(dy => (
        <line key={dy} x1={x-85} y1={y+dy} x2={x+85} y2={y+dy} stroke={sel ? '#6aaae0' : '#b0c0cc'} strokeWidth="1"/>
      ))}
      <line x1={x-85} y1={y} x2={x-115} y2={y} stroke="#1a2a3a" strokeWidth="3"/>
      <line x1={x+85} y1={y} x2={x+115} y2={y} stroke="#1a2a3a" strokeWidth="3"/>
      <line x1={x-40} y1={y-36} x2={x-40} y2={y-58} stroke="#1a2a3a" strokeWidth="3"/>
      <line x1={x+40} y1={y+36} x2={x+40} y2={y+58} stroke="#1a2a3a" strokeWidth="3"/>
      <text x={x} y={y+80} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a2a3a" fontFamily="monospace">{tag}</text>
      <text x={x} y={y+93} textAnchor="middle" fontSize="9" fill="#6a8a9a" fontFamily="monospace">Теплообменник</text>
    </g>
  );
};

const PIDColumn = ({ x, y, tag, selected, onSelect }) => {
  const sel = selected === tag;
  const fill = sel ? '#dbeafe' : '#ffffff';
  const str  = sel ? '#1a6fc4' : '#1a2a3a';
  const sw   = sel ? 3 : 1.5;
  return (
    <g onClick={() => onSelect(tag)} style={{ cursor: 'pointer' }}>
      <rect x={x-36} y={y-180} width={72} height={340} fill={fill} stroke={str} strokeWidth={sw}/>
      <ellipse cx={x} cy={y-180} rx={36} ry={18} fill={fill} stroke={str} strokeWidth={sw}/>
      <ellipse cx={x} cy={y+160} rx={36} ry={18} fill={fill} stroke={str} strokeWidth={sw}/>
      {[-140,-100,-60,-20,20,60,100].map(dy => (
        <line key={dy} x1={x-34} y1={y+dy} x2={x+34} y2={y+dy} stroke={sel ? '#6aaae0' : '#c0ccd8'} strokeWidth="1.5"/>
      ))}
      <line x1={x-36} y1={y+20} x2={x-68} y2={y+20} stroke="#1a2a3a" strokeWidth="3"/>
      <line x1={x} y1={y-198} x2={x} y2={y-230} stroke="#1a2a3a" strokeWidth="3"/>
      <line x1={x} y1={y+178} x2={x} y2={y+210} stroke="#1a2a3a" strokeWidth="3"/>
      <line x1={x+36} y1={y-60} x2={x+68} y2={y-60} stroke="#1a2a3a" strokeWidth="2"/>
      <rect x={x-24} y={y+178} width={48} height={24} fill="#d0d8e0" stroke={str} strokeWidth={1}/>
      <text x={x} y={y+220} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a2a3a" fontFamily="monospace">{tag}</text>
      <text x={x} y={y+233} textAnchor="middle" fontSize="9" fill="#6a8a9a" fontFamily="monospace">Колонна</text>
    </g>
  );
};

// ── ViewerPID component ───────────────────────────────────────────────────────

const ViewerPID = ({ selected, onSelect, phase = 5, onPhaseChange }) => {
  const containerRef = React.useRef(null);
  const stateRef     = React.useRef({ pan: { x: 40, y: 60 }, zoom: 0.9 });
  const dragRef      = React.useRef(null);
  const [, rerender] = React.useReducer(n => n + 1, 0);

  React.useEffect(() => {
    const el = containerRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const { pan, zoom } = stateRef.current;
      const nz = Math.min(Math.max(zoom * (e.deltaY < 0 ? 1.12 : 0.9), 0.15), 5);
      stateRef.current = { zoom: nz, pan: { x: cx - (cx - pan.x) * (nz / zoom), y: cy - (cy - pan.y) * (nz / zoom) } };
      rerender();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    const startPan = { ...stateRef.current.pan };
    const sx = e.clientX, sy = e.clientY;
    let moved = false;
    const onMove = (e) => {
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 3) moved = true;
      if (!moved) return;
      stateRef.current = { ...stateRef.current, pan: { x: startPan.x + e.clientX - sx, y: startPan.y + e.clientY - sy } };
      rerender();
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    dragRef.current = true;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const { pan, zoom } = stateRef.current;

  const L = ({ pts, w = 3, dash }) => (
    <polyline points={pts.map(([x,y]) => `${x},${y}`).join(' ')}
      fill="none" stroke="#1a2a3a" strokeWidth={w} strokeLinejoin="round" strokeLinecap="round"
      strokeDasharray={dash}/>
  );

  const Arr = ({ x, y, dir = 'right' }) => {
    const d = { right: [[6,0],[-6,-5],[0,0],[-6,5]], left: [[-6,0],[6,-5],[0,0],[6,5]], up: [[0,-6],[-5,6],[0,0],[5,6]], down: [[0,6],[-5,-6],[0,0],[5,-6]] }[dir];
    return <polygon points={d.map(([dx,dy]) => `${x+dx},${y+dy}`).join(' ')} fill="#1a2a3a"/>;
  };

  const SLabel = ({ x, y, text, sub, anchor = 'middle' }) => (
    <g>
      <text x={x} y={y} textAnchor={anchor} fontSize="10" fontWeight="600" fill="#1a2a3a" fontFamily="sans-serif">{text}</text>
      {sub && <text x={x} y={y+13} textAnchor={anchor} fontSize="9" fill="#6a8a9a" fontFamily="monospace">{sub}</text>}
    </g>
  );

  return (
    <div ref={containerRef} onMouseDown={onMouseDown}
      style={{ position: 'absolute', inset: 0, background: '#f8f9fb', overflow: 'hidden', cursor: 'grab', userSelect: 'none' }}
    >
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>

          {/* ── Equipment ─────────────────────────────────────────────── */}
          <PIDPump    x={160} y={300} tag="P-2340-A" selected={selected} onSelect={onSelect}/>
          <PIDPump    x={160} y={480} tag="P-2340-B" selected={selected} onSelect={onSelect} standby/>
          <PIDHeatEx  x={480} y={340} tag="E-4401"   selected={selected} onSelect={onSelect}/>
          <PIDColumn  x={800} y={360} tag="V-1208"   selected={selected} onSelect={onSelect}/>

          {/* ── Process lines ─────────────────────────────────────────── */}
          <L pts={[[20,340],[114,340]]}/>
          <Arr x={90} y={340}/>
          <SLabel x={20} y={325} text="Сырьё" sub="180°C · 0,65 МПа" anchor="start"/>

          <L pts={[[114,340],[114,300]]}/>
          <L pts={[[114,340],[114,480]]} w={2} dash="6 3"/>

          <L pts={[[160,266],[160,220],[230,220]]}/>
          <Arr x={220} y={220}/>
          <g transform="translate(160,240)"><PIDCheckValve x={0} y={0}/></g>

          <L pts={[[160,446],[160,390],[200,390],[200,220]]} w={2} dash="6 3"/>
          <g transform="translate(200,390)"><PIDGateValve x={0} y={0} horizontal={false}/></g>

          <L pts={[[230,220],[330,220],[330,340],[365,340]]}/>
          <Arr x={310} y={220}/>
          <Arr x={330} y={310}/>

          <g transform="translate(330,270)"><PIDCtrlValve x={0} y={0}/></g>

          <L pts={[[365,340],[395,340]]}/>
          <Arr x={380} y={340}/>
          <L pts={[[565,340],[640,340]]}/>
          <Arr x={620} y={340}/>

          <L pts={[[440,282],[440,240]]} w={2} dash="4 3"/>
          <L pts={[[520,398],[520,440]]} w={2} dash="4 3"/>
          <SLabel x={455} y={232} text="Пар 4 бар" anchor="start"/>
          <SLabel x={505} y={456} text="Конденсат" anchor="middle"/>

          <L pts={[[640,340],[732,340]]}/>
          <Arr x={720} y={340}/>

          <L pts={[[800,130],[800,80],[920,80]]}/>
          <Arr x={900} y={80}/>
          <SLabel x={925} y={75} text="Дистиллят" sub="TI=85°C" anchor="start"/>

          <L pts={[[864,130],[920,130]]} w={2}/>
          <SLabel x={925} y={125} text="На конденсатор" sub="→ E-4402" anchor="start"/>

          <L pts={[[868,300],[920,300]]}/>
          <Arr x={905} y={300}/>
          <SLabel x={925} y={295} text="Боковой отбор" anchor="start"/>

          <L pts={[[800,570],[800,620],[920,620]]}/>
          <Arr x={900} y={620}/>
          <SLabel x={925} y={615} text="Остаток" sub="→ P-2340-C" anchor="start"/>

          <L pts={[[800,570],[740,570],[740,620]]} w={2} dash="4 3"/>
          <SLabel x={730} y={638} text="Рибойлер ← E-4403" anchor="end"/>

          {/* ── Valves ────────────────────────────────────────────────── */}
          <g transform="translate(70,340)"><PIDGateValve x={0} y={0}/></g>
          <g transform="translate(700,340)"><PIDGateValve x={0} y={0}/></g>
          <g transform="translate(840,130)"><PIDGateValve x={0} y={0}/></g>
          <g transform="translate(840,570)"><PIDGateValve x={0} y={0}/></g>

          {/* ── Instruments ───────────────────────────────────────────── */}
          <PIDInst x={280} y={175} code="FI"  num="101" connected={[280,220]}/>
          <PIDInst x={330} y={165} code="FCV" num="101" connected={[330,210]}/>
          <PIDInst x={420} y={265} code="TI"  num="102" connected={[440,282]}/>
          <PIDInst x={540} y={415} code="TI"  num="103" connected={[520,398]}/>
          <PIDInst x={680} y={280} code="PI"  num="104" connected={[700,340]}/>
          <PIDInst x={860} y={200} code="TIC" num="105" connected={[836,300]}/>
          <PIDInst x={870} y={440} code="LIC" num="106" connected={[836,460]}/>
          <PIDInst x={870} y={100} code="PI"  num="107" connected={[836,130]}/>

          {/* ── Phase 6: КИПиА — FIELDBUS + DCS block ────────────────── */}
          {phase >= 6 && (
            <g opacity={0.9}>
              {/* Double-line fieldbus highway above the process */}
              <line x1={250} y1={40} x2={875} y2={40} stroke="#2a56a0" strokeWidth={2}/>
              <line x1={250} y1={46} x2={875} y2={46} stroke="#2a56a0" strokeWidth={2}/>
              <text x={555} y={33} textAnchor="middle" fontSize={9} fontWeight="600"
                fill="#2a56a0" fontFamily="monospace">— FIELDBUS / AS-Interface —</text>
              {/* DCS block */}
              <rect x={880} y={26} width={148} height={32} fill="#eef4ff" stroke="#2a56a0" strokeWidth={1.5} rx={4}/>
              <text x={954} y={46} textAnchor="middle" fontSize={11} fontWeight="700"
                fill="#0f2860" fontFamily="monospace">ДКС / SCADA</text>
              {/* Connection lines from control instruments to bus */}
              {/* FI-101 */}
              <line x1={280} y1={155} x2={280} y2={46} stroke="#2a56a0" strokeWidth={0.9} strokeDasharray="3 2"/>
              {/* FCV-101 */}
              <line x1={330} y1={145} x2={330} y2={46} stroke="#2a56a0" strokeWidth={1.2} strokeDasharray="3 2"/>
              {/* PI-104 */}
              <line x1={680} y1={260} x2={680} y2={46} stroke="#2a56a0" strokeWidth={0.9} strokeDasharray="3 2"/>
              {/* TIC-105 (control loop) */}
              <line x1={855} y1={180} x2={855} y2={46} stroke="#2a56a0" strokeWidth={1.4} strokeDasharray="3 2"/>
              {/* LIC-106 (control loop) */}
              <line x1={878} y1={420} x2={878} y2={46} stroke="#2a56a0" strokeWidth={1.4} strokeDasharray="3 2"/>
            </g>
          )}

          {/* ── Phase 7: Пуск — PSV-108 + commissioning stamp ────────── */}
          {phase >= 7 && (<>
            {/* PSV-108 branch from column top-pipe at y=150 */}
            <line x1={800} y1={150} x2={748} y2={150} stroke="#1a2a3a" strokeWidth="2"/>
            {/* PSV symbol — two opposing triangles (ISA standard) */}
            <polygon points="748,140 736,150 748,160" fill="#dc2626"/>
            <polygon points="736,140 748,150 736,160" fill="none" stroke="#dc2626" strokeWidth="1.8"/>
            {/* Spring zig-zag */}
            <polyline points="742,140 742,122 737,117 747,112 737,107 747,102 742,97 742,92"
              fill="none" stroke="#dc2626" strokeWidth="1.5"/>
            {/* Vent elbow */}
            <line x1={742} y1={92} x2={762} y2={80} stroke="#dc2626" strokeWidth="1.5"/>
            <text x={722} y={167} textAnchor="end" fontSize={10} fontWeight="700"
              fill="#dc2626" fontFamily="monospace">PSV-108</text>
            {/* PRV-109 on heat exchanger steam line */}
            <line x1={440} y1={252} x2={410} y2={252} stroke="#1a2a3a" strokeWidth="2"/>
            <polygon points="410,244 400,252 410,260" fill="#dc2626"/>
            <polygon points="400,244 410,252 400,260" fill="none" stroke="#dc2626" strokeWidth="1.8"/>
            <line x1={400} y1={244} x2={400} y2={230} stroke="#dc2626" strokeWidth="1.5"/>
            <text x={396} y={226} textAnchor="middle" fontSize={9} fontWeight="700"
              fill="#dc2626" fontFamily="monospace">PRV-109</text>
            {/* Commissioning stamp */}
            <rect x={620} y={690} width={280} height={34} fill="none" stroke="#16a34a" strokeWidth={2} rx={3}/>
            <text x={760} y={712} textAnchor="middle" fontSize={12} fontWeight="700"
              fill="#16a34a" fontFamily="monospace">✓ ВВЕДЕНО В ЭКСПЛУАТАЦИЮ</text>
          </>)}

          {/* ── Title block ───────────────────────────────────────────── */}
          <rect x={0} y={680} width={960} height={52} fill="white" stroke="#c0ccd8" strokeWidth="1"/>
          <line x1={0} y1={680} x2={960} y2={680} stroke="#1a2a3a" strokeWidth="1.5"/>
          <text x={16} y={700} fontSize="13" fontWeight="700" fill="#1a2a3a" fontFamily="monospace">ТЕХНОЛОГИЧЕСКАЯ СХЕМА — ЭЛОУ-АВТ-6 · БЛОК 2</text>
          <text x={16} y={716} fontSize="10" fill="#6a8a9a" fontFamily="monospace">П&amp;ИД · Лист 01 · Ред. 2.14 · 24.04.2026</text>
          <text x={944} y={700} fontSize="10" fill="#6a8a9a" fontFamily="monospace" textAnchor="end">STRATUM Digital Twin</text>
          <text x={944} y={716} fontSize="10" fill="#6a8a9a" fontFamily="monospace" textAnchor="end">Конф.: ДСП</text>

        </g>

      </svg>

      {/* Timeline — light theme */}
      {(() => { const TL = window.Timeline, PH = window.PHASES;
        return TL && PH ? <TL phases={PH} phase={phase} onPhaseChange={onPhaseChange} dark={false}/> : null;
      })()}
    </div>
  );
};

window.ViewerPID = ViewerPID;
