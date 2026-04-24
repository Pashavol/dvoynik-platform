// Viewer2D.jsx — 2D floor plan (plan view) with pan + zoom

const Viewer2D = ({ selected, onSelect, phase = 5, onPhaseChange }) => {
  const containerRef = React.useRef(null);
  const stateRef     = React.useRef({ pan: { x: 300, y: 280 }, zoom: 1 });
  const dragRef      = React.useRef(null);
  const [, rerender] = React.useReducer(n => n + 1, 0);

  const S = 100; // px per metre at zoom=1

  // ── Pan / zoom ───────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const el = containerRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      const { pan, zoom } = stateRef.current;
      const nz = Math.min(Math.max(zoom * (e.deltaY < 0 ? 1.12 : 0.9), 0.15), 8);
      stateRef.current = { zoom: nz, pan: { x: cx - (cx - pan.x) * (nz / zoom), y: cy - (cy - pan.y) * (nz / zoom) } };
      rerender();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, p: { ...stateRef.current.pan } };
    const onMove = (e) => {
      const d = dragRef.current;
      stateRef.current = { ...stateRef.current, pan: { x: d.p.x + e.clientX - d.sx, y: d.p.y + e.clientY - d.sy } };
      rerender();
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const { pan, zoom } = stateRef.current;
  const isDragging = !!dragRef.current;

  // ── Helper: world → SVG coords ────────────────────────────────────────────
  const px = (x) => x * S;
  const pz = (z) => z * S; // world Z → SVG Y (down = south)

  // ── Colours ────────────────────────────────────────────────────────────────
  const SEL   = '#1a6fc4';
  const FILL  = (tag) => selected === tag ? '#dbeafe' : '#f0f4f8';
  const STR   = (tag) => selected === tag ? SEL : '#3a4a58';
  const SW    = (tag) => (selected === tag ? 2.5 : 1.5) / zoom;

  const tag = (x, z, label, sub) => (
    <g>
      <text x={px(x)} y={pz(z)} textAnchor="middle" fontSize={11/zoom} fontWeight="700" fill="#1a2a3a" fontFamily="var(--font-mono)">{label}</text>
      {sub && <text x={px(x)} y={pz(z) + 13/zoom} textAnchor="middle" fontSize={9/zoom} fill="#6a7a8a" fontFamily="var(--font-mono)">{sub}</text>}
    </g>
  );

  const dim = (x1, z1, x2, z2, label, offset = 0.35) => {
    const mx = (x1+x2)/2, mz = (z1+z2)/2 + offset;
    return (
      <g stroke="#9aabb8" strokeWidth={0.8/zoom} fill="none">
        <line x1={px(x1)} y1={pz(z1)} x2={px(x1)} y2={pz(z1+offset*0.8)} strokeDasharray={`${3/zoom} ${2/zoom}`}/>
        <line x1={px(x2)} y1={pz(z2)} x2={px(x2)} y2={pz(z2+offset*0.8)} strokeDasharray={`${3/zoom} ${2/zoom}`}/>
        <line x1={px(x1)} y1={pz(mz)} x2={px(x2)} y2={pz(mz)}/>
        <text x={px(mx)} y={pz(mz)-4/zoom} textAnchor="middle" fontSize={8/zoom} fill="#9aabb8" fontFamily="var(--font-mono)">{label}</text>
      </g>
    );
  };

  return (
    <div ref={containerRef} onMouseDown={onMouseDown}
      style={{ position: 'absolute', inset: 0, background: '#eef0f2', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
    >
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        <defs>
          <marker id="arrow2d" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#9aabb8"/>
          </marker>
          <pattern id="grid2d" x="0" y="0" width={S*zoom} height={S*zoom} patternUnits="userSpaceOnUse"
            patternTransform={`translate(${pan.x % (S*zoom)},${pan.y % (S*zoom)})`}>
            <path d={`M ${S*zoom} 0 L 0 0 0 ${S*zoom}`} fill="none" stroke="#d4d8dc" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid2d-major" x="0" y="0" width={S*zoom*5} height={S*zoom*5} patternUnits="userSpaceOnUse"
            patternTransform={`translate(${pan.x % (S*zoom*5)},${pan.y % (S*zoom*5)})`}>
            <path d={`M ${S*zoom*5} 0 L 0 0 0 ${S*zoom*5}`} fill="none" stroke="#c0c8d0" strokeWidth="1"/>
          </pattern>
        </defs>

        {/* Grid */}
        <rect width="100%" height="100%" fill="#eef0f2"/>
        <rect width="100%" height="100%" fill="url(#grid2d)"/>
        <rect width="100%" height="100%" fill="url(#grid2d-major)"/>

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>

          {/* Foundation pads — dashed */}
          {[[0,0],[3,0.5],[-2.5,0.8],[-2.5,-0.5]].map(([x,z],i) => (
            <rect key={i} x={px(x-1)} y={pz(z-1)} width={S*2} height={S*2}
              fill="#dde2e8" stroke="#aab8c4" strokeWidth={1/zoom} strokeDasharray={`${5/zoom} ${3/zoom}`} rx={4/zoom}/>
          ))}

          {/* Steel frame column footprints */}
          {[[-0.6,-0.6],[0.6,-0.6],[0.6,0.6],[-0.6,0.6]].map(([x,z],i) => (
            <rect key={i} x={px(x)-5/zoom} y={pz(z)-5/zoom} width={10/zoom} height={10/zoom} fill="#5a7080" stroke="#3a5060" strokeWidth={1/zoom}/>
          ))}
          {/* Frame outline */}
          <rect x={px(-0.6)} y={pz(-0.6)} width={px(1.2)} height={pz(1.2)}
            fill="none" stroke="#8aaabb" strokeWidth={0.8/zoom} strokeDasharray={`${4/zoom} ${2/zoom}`}/>

          {/* Pipe runs — double line style */}
          {[
            [[-2.2,0.8],[-1.4,0.4],[-0.8,0.1],[-0.39,0]],
            [[-2.2,-0.4],[-1.5,-0.1],[-0.8,0],[-0.39,0]],
            [[0.39,0],[1.2,0.3],[1.9,0.5],[2.05,0.5]],
          ].map((pts, i) => {
            const pts2d = pts.map(([x,z]) => `${px(x)},${pz(z)}`).join(' ');
            return (
              <g key={i}>
                <polyline points={pts2d} fill="none" stroke="#c8d4dc" strokeWidth={12/zoom} strokeLinejoin="round"/>
                <polyline points={pts2d} fill="none" stroke="#8aaabb" strokeWidth={1/zoom} strokeLinejoin="round"/>
              </g>
            );
          })}
          {/* Pipe centre lines */}
          {[
            [[-2.2,0.8],[-0.39,0]],
            [[-2.2,-0.4],[-0.39,0]],
            [[0.39,0],[2.05,0.5]],
          ].map((pts, i) => (
            <polyline key={i} points={pts.map(([x,z]) => `${px(x)},${pz(z)}`).join(' ')}
              fill="none" stroke="#9aaabb" strokeWidth={0.6/zoom} strokeDasharray={`${6/zoom} ${3/zoom}`}/>
          ))}

          {/* ── E-4401 heat exchanger ─────────────────────────────────── */}
          <g onClick={() => onSelect('E-4401')} style={{ cursor: 'pointer' }}>
            {/* body */}
            <rect x={px(1.75)} y={pz(0.18)} width={px(2.5)} height={pz(0.64)}
              fill={FILL('E-4401')} stroke={STR('E-4401')} strokeWidth={SW('E-4401')} rx={pz(0.32)}/>
            {/* left cap */}
            <ellipse cx={px(1.75)} cy={pz(0.5)} rx={pz(0.34)} ry={pz(0.34)} fill={FILL('E-4401')} stroke={STR('E-4401')} strokeWidth={SW('E-4401')}/>
            {/* right cap */}
            <ellipse cx={px(4.25)} cy={pz(0.5)} rx={pz(0.34)} ry={pz(0.34)} fill={FILL('E-4401')} stroke={STR('E-4401')} strokeWidth={SW('E-4401')}/>
            {/* tube bundle lines */}
            {[-0.14,0,0.14].map((dz,i) => (
              <line key={i} x1={px(1.75)} y1={pz(0.5+dz)} x2={px(4.25)} y2={pz(0.5+dz)} stroke={selected==='E-4401'?'#6aaae0':'#b0c4d0'} strokeWidth={0.7/zoom}/>
            ))}
            {tag(3.0, 0.5 - 0.55, 'E-4401', 'Теплообменник')}
          </g>

          {/* ── P-2340-A pump ─────────────────────────────────────────── */}
          <g onClick={() => onSelect('P-2340-A')} style={{ cursor: 'pointer' }}>
            <circle cx={px(-2.2)} cy={pz(0.8)} r={S*0.32}
              fill={FILL('P-2340-A')} stroke={STR('P-2340-A')} strokeWidth={SW('P-2340-A')}/>
            {/* pump arrow symbol */}
            <polygon points={`${px(-2.2)},${pz(0.8)-S*0.18} ${px(-2.2)+S*0.18},${pz(0.8)} ${px(-2.2)},${pz(0.8)+S*0.18}`}
              fill={selected==='P-2340-A' ? SEL : '#5a7080'}/>
            {tag(-2.2, 0.8 - 0.52, 'P-2340-A', 'Насос')}
          </g>

          {/* ── P-2340-B pump ─────────────────────────────────────────── */}
          <g onClick={() => onSelect('P-2340-B')} style={{ cursor: 'pointer' }}>
            <circle cx={px(-2.2)} cy={pz(-0.4)} r={S*0.32}
              fill={FILL('P-2340-B')} stroke={STR('P-2340-B')} strokeWidth={SW('P-2340-B')}/>
            <polygon points={`${px(-2.2)},${pz(-0.4)-S*0.18} ${px(-2.2)+S*0.18},${pz(-0.4)} ${px(-2.2)},${pz(-0.4)+S*0.18}`}
              fill={selected==='P-2340-B' ? SEL : '#5a7080'}/>
            {tag(-2.2, -0.4 - 0.52, 'P-2340-B', 'Насос (резерв)')}
          </g>

          {/* ── V-1208 column ─────────────────────────────────────────── */}
          <g onClick={() => onSelect('V-1208')} style={{ cursor: 'pointer' }}>
            {/* insulation ring */}
            <circle cx={px(0)} cy={pz(0)} r={S*0.60} fill="none" stroke="#c8d4dc" strokeWidth={0.8/zoom} strokeDasharray={`${4/zoom} ${2/zoom}`}/>
            {/* column cross-section */}
            <circle cx={px(0)} cy={pz(0)} r={S*0.43}
              fill={FILL('V-1208')} stroke={STR('V-1208')} strokeWidth={SW('V-1208')}/>
            {/* centre dot */}
            <circle cx={px(0)} cy={pz(0)} r={4/zoom} fill={STR('V-1208')}/>
            {/* nozzle stubs */}
            {[[0.39,0,1,0],[0,-0.43,0,-1],[-0.39,0,-1,0]].map(([x,z,dx,dz],i)=>(
              <line key={i} x1={px(x)} y1={pz(z)} x2={px(x+dx*0.25)} y2={pz(z+dz*0.25)} stroke={STR('V-1208')} strokeWidth={5/zoom} strokeLinecap="round"/>
            ))}
            {tag(0, -0.72, 'V-1208', 'Колонна')}
          </g>

          {/* ── Dimensions ────────────────────────────────────────────── */}
          {dim(-2.2, 1.2, 0, 1.2, '2 200 мм', 0)}
          {dim(0, 1.2, 3, 1.2, '3 000 мм', 0)}

          {/* ── Phase 6: КИПиА — instruments & cable tray ────────────── */}
          {phase >= 6 && (<>
            {/* Cable tray — horizontal backbone */}
            <line x1={px(-3.2)} y1={pz(-0.9)} x2={px(5.2)} y2={pz(-0.9)}
              stroke="#4a6a80" strokeWidth={8/zoom} opacity={0.18}/>
            <line x1={px(-3.2)} y1={pz(-0.9)} x2={px(5.2)} y2={pz(-0.9)}
              stroke="#4a7090" strokeWidth={1.5/zoom} strokeDasharray={`${6/zoom} ${3/zoom}`}/>
            {/* Vertical drops to equipment */}
            {[[-2.2, 0.8], [0, 0], [3, 0.5]].map(([x, z], i) => (
              <line key={i} x1={px(x)} y1={pz(z)} x2={px(x)} y2={pz(-0.9)}
                stroke="#4a7090" strokeWidth={0.8/zoom} strokeDasharray={`${4/zoom} ${2/zoom}`}/>
            ))}
            {/* Control cabinet МЩУ */}
            <rect x={px(4.8)} y={pz(-0.5)} width={px(0.9)} height={pz(0.9)}
              fill="#eef6ff" stroke="#3060a0" strokeWidth={1.8/zoom} rx={3/zoom}/>
            <text x={px(5.25)} y={pz(0.0)} textAnchor="middle" fontSize={10/zoom} fontWeight="700" fill="#3060a0" fontFamily="var(--font-mono)">МЩУ</text>
            <line x1={px(4.8)} y1={pz(-0.9)} x2={px(4.8+0.45)} y2={pz(-0.9)}
              stroke="#3060a0" strokeWidth={1.5/zoom}/>
            {/* Instrument nodes */}
            {[[0.82, 0.0, 'ИА-101'], [-0.82, 0.0, 'ИА-102'], [0.0, -0.72, 'ИА-103'], [3.0, 0.12, 'ИА-104'], [-2.6, 0.8, 'ИА-105']].map(([x, z, code]) => (
              <g key={code} transform={`translate(${px(x)},${pz(z)})`}>
                <circle cx={0} cy={0} r={12/zoom} fill="#fffbeb" stroke="#d97706" strokeWidth={1.5/zoom}/>
                <line x1={-12/zoom} y1={0} x2={12/zoom} y2={0} stroke="#d97706" strokeWidth={1/zoom}/>
                <text x={0} y={-16/zoom} textAnchor="middle" fontSize={7.5/zoom} fill="#92400e" fontFamily="var(--font-mono)">{code}</text>
              </g>
            ))}
          </>)}

          {/* ── Phase 7: Пуск — PSV + completion marker ───────────────── */}
          {phase >= 7 && (<>
            {/* PSV-108 symbol (north of column) */}
            <g transform={`translate(${px(0)},${pz(-0.88)})`}>
              <circle cx={0} cy={0} r={13/zoom} fill="#fee2e2" stroke="#dc2626" strokeWidth={1.8/zoom}/>
              <polygon points={`0,${-9/zoom} ${8/zoom},${6/zoom} ${-8/zoom},${6/zoom}`} fill="#dc2626"/>
              <text x={0} y={-18/zoom} textAnchor="middle" fontSize={7.5/zoom} fontWeight="700" fill="#dc2626" fontFamily="var(--font-mono)">ПСК-108</text>
            </g>
            {/* Insulation ring on E-4401 (in plan = slightly wider footprint) */}
            <rect x={px(1.64)} y={pz(0.07)} width={px(2.72)} height={pz(0.86)}
              fill="none" stroke="#a08060" strokeWidth={0.8/zoom} strokeDasharray={`${4/zoom} ${2/zoom}`} rx={pz(0.44)}/>
            <text x={px(1.64)} y={pz(-0.05)} fontSize={7.5/zoom} fill="#a08060" fontFamily="var(--font-mono)">Изоляция</text>
          </>)}

          {/* ── North arrow ──────────────────────────────────────────── */}
          <g transform={`translate(${px(5)},${pz(-1.5)})`}>
            <circle cx="0" cy="0" r={22/zoom} fill="rgba(255,255,255,0.85)" stroke="#9aabb8" strokeWidth={1/zoom}/>
            <polygon points={`0,${-18/zoom} ${-8/zoom},${6/zoom} 0,${2/zoom} ${8/zoom},${6/zoom}`} fill="#3a5060"/>
            <text x="0" y={-22/zoom} textAnchor="middle" fontSize={11/zoom} fontWeight="700" fill="#3a5060" fontFamily="var(--font-mono)">N</text>
          </g>

          {/* ── Scale bar ─────────────────────────────────────────────── */}
          <g transform={`translate(${px(4.5)},${pz(1.8)})`}>
            <rect x="0" y="0" width={S} height={6/zoom} fill="#3a5060"/>
            <rect x={S/2} y="0" width={S/2} height={6/zoom} fill="#fff" stroke="#3a5060" strokeWidth={0.5/zoom}/>
            <text x="0"   y={-3/zoom} textAnchor="middle" fontSize={8/zoom} fill="#3a5060" fontFamily="var(--font-mono)">0</text>
            <text x={S/2} y={-3/zoom} textAnchor="middle" fontSize={8/zoom} fill="#3a5060" fontFamily="var(--font-mono)">5 м</text>
            <text x={S}   y={-3/zoom} textAnchor="middle" fontSize={8/zoom} fill="#3a5060" fontFamily="var(--font-mono)">10 м</text>
          </g>

        </g>

        {/* ── Title block (fixed overlay) ────────────────────────────── */}
        <g>
          <rect x="0" y="0" width="220" height="52" fill="white" stroke="#c0ccd8" strokeWidth="1"/>
          <text x="10" y="16" fontSize="10" fontWeight="700" fill="#1a2a3a" fontFamily="var(--font-mono)">ПЛАН НА ОТМЕТКЕ 0.000</text>
          <text x="10" y="28" fontSize="9" fill="#6a7a8a" fontFamily="var(--font-mono)">ЭЛОУ-АВТ-6 · Блок 2</text>
          <text x="10" y="40" fontSize="9" fill="#6a7a8a" fontFamily="var(--font-mono)">Масштаб 1:100 · Лист 1/1</text>
          <text x="210" y="40" fontSize="8" fill="#9aabb8" fontFamily="var(--font-mono)" textAnchor="end">v2.14</text>
        </g>

      </svg>

      {/* Timeline — light theme */}
      {(() => { const TL = window.Timeline, PH = window.PHASES;
        return TL && PH ? <TL phases={PH} phase={phase} onPhaseChange={onPhaseChange} dark={false}/> : null;
      })()}
    </div>
  );
};

window.Viewer2D = Viewer2D;
