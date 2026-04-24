// ViewerCanvas.jsx — Three.js 3D viewer + construction timeline

const PHASES = [
  { label: 'Площадка',     date: 'Янв 2026', version: 'v0.1' },
  { label: 'Фундамент',    date: 'Фев 2026', version: 'v0.5' },
  { label: 'Колонна',      date: 'Мар 2026', version: 'v1.0' },
  { label: 'Обвязка',      date: 'Мар 2026', version: 'v1.4' },
  { label: 'Оборудование', date: 'Апр 2026', version: 'v2.0' },
  { label: 'Текущая',      date: 'Апр 2026', version: 'v2.14' },
  { label: 'КИПиА',        date: 'Май 2026', version: 'v3.0',  future: true },
  { label: 'Пуск',         date: 'Июн 2026', version: 'v4.0',  future: true },
];
const CURRENT_PHASE = 5; // last "built" phase index

// ─── Timeline ─────────────────────────────────────────────────────────────────
const Timeline = ({ phases, phase, onPhaseChange, dark = true }) => {
  const F = '#f59e0b'; // future accent colour

  const bg        = dark ? 'rgba(8,12,20,0.88)'    : 'rgba(255,255,255,0.97)';
  const borderClr = dark ? 'rgba(255,255,255,0.10)' : 'var(--border)';
  const dimClr    = dark ? 'rgba(255,255,255,0.4)'  : 'var(--muted-foreground)';
  const brightClr = dark ? 'rgba(255,255,255,0.8)'  : 'var(--foreground)';
  const actClr    = dark ? 'rgba(255,255,255,0.9)'  : 'var(--foreground)';
  const inactClr  = dark ? 'rgba(255,255,255,0.35)' : '#9aaabb';
  const trackBg   = dark ? 'rgba(255,255,255,0.12)' : 'var(--border)';

  return (
    <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 10 }}>
      <div style={{
        background: bg, backdropFilter: 'blur(12px)',
        border: `1px solid ${borderClr}`, borderRadius: 'var(--radius-md)',
        padding: '12px 20px 10px',
        boxShadow: dark ? 'none' : 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: dimClr, fontWeight: 600 }}>Версии модели</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {phases[phase].future && (
              <span style={{ fontSize: 10, color: F, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                ▲ Проект
              </span>
            )}
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: brightClr }}>
              {phases[phase].version} · {phases[phase].date}
            </span>
          </div>
        </div>

        {/* track */}
        <div style={{ position: 'relative', height: 2, background: trackBg, borderRadius: 1, margin: '0 6px 12px' }}>
          {/* built segment */}
          <div style={{
            position: 'absolute', left: 0, height: '100%', borderRadius: 1,
            width: `${(Math.min(phase, CURRENT_PHASE) / (phases.length - 1)) * 100}%`,
            background: 'var(--primary)', transition: 'width .25s ease',
          }} />
          {/* future segment */}
          {phase > CURRENT_PHASE && (
            <div style={{
              position: 'absolute',
              left: `${(CURRENT_PHASE / (phases.length - 1)) * 100}%`,
              height: '100%',
              width: `${((phase - CURRENT_PHASE) / (phases.length - 1)) * 100}%`,
              background: F, opacity: 0.65,
              transition: 'width .25s ease',
            }} />
          )}
          {phases.map((p, i) => (
            <button key={i} title={`${p.label} — ${p.version}`} onClick={() => onPhaseChange(i)} style={{
              position: 'absolute',
              left: `${(i / (phases.length - 1)) * 100}%`,
              top: '50%', transform: 'translate(-50%, -50%)',
              width: i === phase ? 14 : 9, height: i === phase ? 14 : 9,
              borderRadius: '50%',
              border: p.future ? `2px solid ${i <= phase ? F : dark ? 'rgba(255,255,255,0.28)' : '#c8d8e4'}` : 'none',
              padding: 0, cursor: 'pointer',
              background: p.future
                ? (i <= phase ? 'rgba(245,158,11,0.28)' : 'transparent')
                : (i <= phase ? 'var(--primary)' : dark ? 'rgba(255,255,255,0.22)' : '#d0dce8'),
              outline: i === phase ? `2px solid ${p.future ? 'rgba(245,158,11,0.45)' : 'color-mix(in oklch, var(--primary) 50%, transparent)'}` : 'none',
              outlineOffset: 2,
              transition: 'all .2s',
            }} />
          ))}
        </div>

        {/* labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 3px' }}>
          {phases.map((p, i) => (
            <button key={i} onClick={() => onPhaseChange(i)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 11, lineHeight: 1,
              color: i === phase
                ? (p.future ? F : actClr)
                : (p.future ? (dark ? 'rgba(245,158,11,0.42)' : '#b08828') : inactClr),
              fontWeight: i === phase ? 600 : 400,
              fontFamily: 'var(--font-sans)',
              transition: 'color .2s', whiteSpace: 'nowrap',
            }}>{p.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

window.PHASES   = PHASES;
window.Timeline = Timeline;

// ─── ViewerCanvas ─────────────────────────────────────────────────────────────
const ViewerCanvas = ({ selected, onSelect }) => {
  const containerRef = React.useRef(null);
  const threeRef     = React.useRef(null);
  const selectedRef  = React.useRef(selected);
  const [phase, setPhase] = React.useState(5);
  const [viewMode, setViewMode] = React.useState('3D');
  const [devHover, setDevHover] = React.useState(null);
  const [devMarkers, setDevMarkers] = React.useState([]);

  React.useEffect(() => { selectedRef.current = selected; }, [selected]);

  // ── Init Three.js ────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!containerRef.current || threeRef.current || typeof THREE === 'undefined') return;

    const el = containerRef.current;
    const W = el.clientWidth || 800, H = el.clientHeight || 500;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x101820, 1);
    el.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(9, 7, 11);

    // OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4;
    controls.maxDistance = 40;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.update();

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xb0c8d8, 0.55));

    const sun = new THREE.DirectionalLight(0xfff8f0, 1.4);
    sun.position.set(12, 22, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1; sun.shadow.camera.far = 80;
    sun.shadow.camera.left = sun.shadow.camera.bottom = -14;
    sun.shadow.camera.right = sun.shadow.camera.top = 14;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x4466bb, 0.3);
    fill.position.set(-10, 8, -8);
    scene.add(fill);

    // ── Material factory ──────────────────────────────────────────────────────
    const M = (color, metalness = 0.55, roughness = 0.42) =>
      new THREE.MeshStandardMaterial({ color, metalness, roughness });

    const tagMats = {
      'V-1208':   M(0x7a8fa0),
      'E-4401':   M(0x8a7a6a),
      'P-2340-A': M(0x5a8070),
      'P-2340-B': M(0x5a8070),
    };
    const pipeMat     = M(0xa8b8c0, 0.85, 0.15);
    const groundMat   = M(0x1a2230, 0.0, 0.95);
    const concreteMat = M(0x3a4050, 0.05, 0.90);
    const frameMat    = M(0x607080, 0.75, 0.28);

    // ── Clickable registry ────────────────────────────────────────────────────
    const clickable = {}; // tag → [mesh, …]
    const reg = (tag, m) => {
      m.userData.tag = tag;
      (clickable[tag] = clickable[tag] || []).push(m);
    };

    // ── Groups (phase visibility) ─────────────────────────────────────────────
    const grp = {};
    ['ground', 'structure', 'column', 'pipes', 'equipment', 'deviation', 'cia', 'launch'].forEach(k => {
      grp[k] = new THREE.Group(); scene.add(grp[k]);
    });

    // ── Mesh helper ───────────────────────────────────────────────────────────
    const add = (geo, mat, group, px, py, pz, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(px, py, pz);
      m.rotation.set(rx, ry, rz);
      m.castShadow = m.receiveShadow = true;
      group.add(m);
      return m;
    };

    // ── Ground ────────────────────────────────────────────────────────────────
    const gnd = add(new THREE.PlaneGeometry(30, 30), groundMat, grp.ground, 0, 0, 0, -Math.PI / 2);
    gnd.castShadow = false;
    grp.ground.add(new THREE.GridHelper(30, 30, 0x222e40, 0x1b2535));

    // ── Foundation pads + steel frame (phase 1) ───────────────────────────────
    const padGeo = new THREE.BoxGeometry(2, 0.28, 2);
    [[0, 0.14, 0], [3, 0.14, 0.5], [-2.5, 0.14, 0.8], [-2.5, 0.14, -0.5]].forEach(p =>
      add(padGeo, concreteMat, grp.structure, ...p)
    );
    const fColGeo = new THREE.BoxGeometry(0.1, 1.5, 0.1);
    [[-0.6, 0.75, -0.6], [0.6, 0.75, -0.6], [0.6, 0.75, 0.6], [-0.6, 0.75, 0.6]].forEach(p =>
      add(fColGeo, frameMat, grp.structure, ...p)
    );
    add(new THREE.BoxGeometry(1.4, 0.07, 1.4), frameMat, grp.structure, 0, 1.5, 0);

    // ── V-1208 distillation column (phase 2) ──────────────────────────────────
    const colBody = add(new THREE.CylinderGeometry(0.38, 0.43, 4.6, 24), tagMats['V-1208'], grp.column, 0, 2.6, 0);
    reg('V-1208', colBody);
    const colDome = add(new THREE.SphereGeometry(0.38, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), tagMats['V-1208'], grp.column, 0, 4.9, 0);
    reg('V-1208', colDome);
    add(new THREE.CylinderGeometry(0.52, 0.54, 0.18, 24), concreteMat, grp.column, 0, 0.39, 0);
    // Platform rings
    [1.4, 2.7, 4.0].forEach(y =>
      add(new THREE.TorusGeometry(0.62, 0.034, 8, 32), frameMat, grp.column, 0, y, 0, Math.PI / 2)
    );
    // Nozzle stubs on the column wall
    [[0.39, 2.0, 0, 0, 0, Math.PI / 2], [0.39, 3.5, 0, 0, 0, Math.PI / 2], [-0.39, 2.5, 0, 0, 0, -Math.PI / 2]].forEach(
      ([px, py, pz, rx, ry, rz]) => add(new THREE.CylinderGeometry(0.055, 0.055, 0.28, 8), pipeMat, grp.column, px, py, pz, rx, ry, rz)
    );

    // ── Pipe runs (phase 3) ───────────────────────────────────────────────────
    const mkTube = (pts, r = 0.055) => new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(x, y, z))), 24, r, 8
    );
    [
      [[-2.2, 0.45, 0.8], [-1.4, 0.65, 0.4], [-0.8, 1.3, 0.1], [-0.39, 2.0, 0]],
      [[-2.2, 0.45, -0.4], [-1.5, 0.65, -0.1], [-0.8, 1.1, 0], [-0.39, 2.0, 0]],
      [[0.39, 3.5, 0], [1.2, 3.1, 0.3], [1.9, 1.6, 0.5], [2.05, 0.55, 0.5]],
    ].forEach(pts => add(mkTube(pts), pipeMat, grp.pipes, 0, 0, 0));

    // ── E-4401 heat exchanger (phase 4) ───────────────────────────────────────
    const hx = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.5, 24), tagMats['E-4401']);
    hx.rotation.z = Math.PI / 2;
    hx.position.set(3, 0.5, 0.5);
    hx.castShadow = hx.receiveShadow = true;
    grp.equipment.add(hx);
    reg('E-4401', hx);
    [-1.25, 1.25].forEach(dx =>
      add(new THREE.CylinderGeometry(0.34, 0.34, 0.07, 24), concreteMat.clone(), grp.equipment, 3 + dx, 0.5, 0.5, 0, 0, Math.PI / 2)
    );
    [-0.75, 0.75].forEach(dx =>
      add(new THREE.BoxGeometry(0.08, 0.46, 0.5), frameMat, grp.equipment, 3 + dx, 0.23, 0.5)
    );

    // ── Pumps P-2340-A / B (phase 4) ─────────────────────────────────────────
    [['P-2340-A', -2.2, 0.8], ['P-2340-B', -2.2, -0.4]].forEach(([tag, px, pz]) => {
      const body = add(new THREE.CylinderGeometry(0.27, 0.3, 0.48, 16), tagMats[tag], grp.equipment, px, 0.44, pz);
      reg(tag, body);
      const motor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.22), tagMats[tag]);
      motor.position.set(px + 0.28, 0.44, pz);
      motor.castShadow = true;
      grp.equipment.add(motor);
      reg(tag, motor);
      add(new THREE.CylinderGeometry(0.055, 0.055, 0.26, 8), pipeMat, grp.equipment, px, 0.72, pz);
    });

    // ── Deviation markers — 2D HTML overlays (phase 5) ───────────────────────
    const DEVS = [
      { pos: new THREE.Vector3(0.50, 2.55, 0.14), text: 'Толщина стенки −0,8 мм',   date: '12.03.2026', kind: 'warn' },
      { pos: new THREE.Vector3(0.20, 1.05, 0.44), text: 'Смещение по оси X +45 мм', date: '08.03.2026', kind: 'warn' },
      { pos: new THREE.Vector3(3.20, 1.20, 0.50), text: 'Трещина в сварном шве',     date: '23.04.2026', kind: 'crit' },
    ];

    // ── Phase 6: КИПиА — instrumentation & control ───────────────────────────
    const transmitMat = M(0xf0b040, 0.55, 0.42);
    const cableMat    = M(0x505060, 0.65, 0.45);

    // Transmitter boxes at column nozzle tips
    [[0.78, 2.0, 0], [0.78, 3.5, 0], [-0.78, 2.5, 0]].forEach(([x, y, z]) => {
      add(new THREE.BoxGeometry(0.14, 0.10, 0.09), transmitMat, grp.cia, x, y, z);
    });
    // Junction box above E-4401
    add(new THREE.BoxGeometry(0.24, 0.15, 0.15), transmitMat, grp.cia, 3.0, 0.96, 0.5);
    // Cable tray — horizontal run at y=1.62, z=0.3
    add(new THREE.BoxGeometry(6.4, 0.05, 0.17), cableMat, grp.cia, 0.5, 1.62, 0.3);
    // Vertical drop to pump area
    add(new THREE.BoxGeometry(0.05, 1.28, 0.17), cableMat, grp.cia, -2.2, 1.0, 0.3);

    // ── Phase 7: Пуск — commissioning ────────────────────────────────────────
    const psvMat = M(0xdd3322, 0.65, 0.35);
    const insMat = M(0xddd8c0, 0.05, 0.88);
    const ladMat = M(0x707880, 0.65, 0.4);

    // PSV-108 on column top — red cylinder + discharge elbow
    add(new THREE.CylinderGeometry(0.065, 0.065, 0.55, 8), psvMat, grp.launch, 0.18, 5.52, 0.0);
    add(new THREE.CylinderGeometry(0.12,  0.12,  0.07, 8), psvMat, grp.launch, 0.18, 5.22, 0.0);
    const psvElbow = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.38, 8), psvMat);
    psvElbow.rotation.z = Math.PI / 2; psvElbow.position.set(0.38, 5.52, 0); grp.launch.add(psvElbow);

    // Insulation jacket over E-4401
    const insHX = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.41, 2.56, 24), insMat);
    insHX.rotation.z = Math.PI / 2; insHX.position.set(3, 0.5, 0.5);
    insHX.castShadow = insHX.receiveShadow = true; grp.launch.add(insHX);

    // Access ladder on column south face
    add(new THREE.BoxGeometry(0.022, 3.2, 0.022), ladMat, grp.launch, -0.50, 1.6,  0.12);
    add(new THREE.BoxGeometry(0.022, 3.2, 0.022), ladMat, grp.launch, -0.50, 1.6, -0.12);
    [0.5, 0.9, 1.3, 1.7, 2.1, 2.5, 2.9, 3.2].forEach(dy =>
      add(new THREE.BoxGeometry(0.022, 0.022, 0.26), ladMat, grp.launch, -0.50, dy, 0)
    );

    // ── Phase visibility ──────────────────────────────────────────────────────
    const applyPhase = (ph) => {
      grp.ground.visible     = true;
      grp.structure.visible  = ph >= 1;
      grp.column.visible     = ph >= 2;
      grp.pipes.visible      = ph >= 3;
      grp.equipment.visible  = ph >= 4;
      grp.deviation.visible  = ph >= 5;
      grp.cia.visible        = ph >= 6;
      grp.launch.visible     = ph >= 7;
      if (ph < 5) { setDevHover(null); setDevMarkers([]); }
    };
    applyPhase(5);

    // ── Selection + hover highlight ───────────────────────────────────────────
    let hoveredTag = null;

    const applySelection = (tag) => {
      Object.entries(clickable).forEach(([t, meshes]) => {
        const sel = t === tag;
        const hov = !sel && t === hoveredTag;
        meshes.forEach(m => {
          m.material.emissive.setHex(sel ? 0xc05010 : hov ? 0x336699 : 0x000000);
          m.material.emissiveIntensity = sel ? 0.45 : hov ? 0.28 : 0;
        });
      });
    };

    const applyHover = (tag) => {
      if (tag === hoveredTag) return;
      hoveredTag = tag;
      Object.entries(clickable).forEach(([t, meshes]) => {
        if (t === selectedRef.current) return;
        const hov = t === tag;
        meshes.forEach(m => {
          m.material.emissive.setHex(hov ? 0x336699 : 0x000000);
          m.material.emissiveIntensity = hov ? 0.28 : 0;
        });
      });
      el.style.cursor = tag ? 'pointer' : 'default';
    };

    applySelection(selectedRef.current);

    // ── Click / raycast ───────────────────────────────────────────────────────
    const allClickable = Object.values(clickable).flat();
    const rc = new THREE.Raycaster();
    const mp = new THREE.Vector2();
    let mdx = 0, mdy = 0, dragDist = 0;

    const onPD = (e) => { mdx = e.clientX; mdy = e.clientY; dragDist = 0; };
    const onMM = (e) => {
      dragDist = Math.hypot(e.clientX - mdx, e.clientY - mdy);
      const rect = el.getBoundingClientRect();
      mp.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mp.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      rc.setFromCamera(mp, camera);
      const hitClick = rc.intersectObjects(allClickable)[0];
      applyHover(hitClick ? hitClick.object.userData.tag : null);
    };
    const onML = () => { applyHover(null); };
    const onPU = (e) => {
      if (e.button !== 0 || dragDist > 5) return;
      const rect = el.getBoundingClientRect();
      mp.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mp.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      rc.setFromCamera(mp, camera);
      const hit = rc.intersectObjects(allClickable)[0];
      if (hit) onSelect(hit.object.userData.tag);
    };
    el.addEventListener('pointerdown', onPD);
    el.addEventListener('mousemove', onMM);
    el.addEventListener('mouseleave', onML);
    el.addEventListener('pointerup', onPU);

    // ── Resize ────────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const W = el.clientWidth, H = el.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });
    ro.observe(el);

    // ── Animate ───────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      if (grp.deviation.visible) {
        const W = el.clientWidth, H = el.clientHeight;
        setDevMarkers(DEVS.map(d => {
          const v = d.pos.clone().project(camera);
          return { x: (v.x + 1) / 2 * W, y: (-v.y + 1) / 2 * H, text: d.text, date: d.date, kind: d.kind, visible: v.z < 1 };
        }));
      }
    };
    animate();

    threeRef.current = { renderer, controls, clickable, applyPhase, applySelection };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onPD);
      el.removeEventListener('mousemove', onMM);
      el.removeEventListener('mouseleave', onML);
      el.removeEventListener('pointerup', onPU);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
      threeRef.current = null;
    };
  }, []);

  // ── Sync selection highlight ──────────────────────────────────────────────
  React.useEffect(() => {
    threeRef.current?.applySelection(selected);
  }, [selected]);

  // ── Sync phase visibility ─────────────────────────────────────────────────
  React.useEffect(() => {
    threeRef.current?.applyPhase(phase);
  }, [phase]);

  const is3D = viewMode === '3D';

  return (
    <div style={{ position: 'relative', flex: 1, background: '#101820', minHeight: 0, overflow: 'hidden' }}>

      {/* Three.js canvas — always mounted so Three.js state is preserved */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, visibility: is3D ? 'visible' : 'hidden' }} />

      {/* ── 3D-only UI ───────────────────────────────────────────────────── */}
      {is3D && <>
        {/* Top gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)', pointerEvents: 'none', zIndex: 2 }} />

        {/* Top-left: model info */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 3, color: '#fff' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.5, fontWeight: 600, marginBottom: 3 }}>
            IFC-модель · {PHASES[phase].version}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>ЭЛОУ-АВТ-6 · Блок 2</div>
        </div>

        {/* Left tools */}
        <div style={{ position: 'absolute', bottom: 116, left: 16, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 2, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: 4 }}>
          {['zoom-in', 'zoom-out', 'maximize', 'compass'].map(n => (
            <button key={n} style={{ width: 30, height: 30, border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={n} size={15} />
            </button>
          ))}
        </div>

        {/* Bottom-right: coordinates */}
        <div style={{ position: 'absolute', bottom: 116, right: 16, zIndex: 3, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.45)', textAlign: 'right', lineHeight: 1.7 }}>
          lat 55.7558° · lon 49.1229°<br />z +12.400 m · LoD 400
        </div>

        {/* Timeline */}
        <Timeline phases={PHASES} phase={phase} onPhaseChange={setPhase} />

        {/* Deviation markers */}
        {devMarkers.filter(m => m.visible).map((m, i) => (
          <div key={i}
            style={{ position: 'absolute', left: m.x, top: m.y, transform: 'translate(-50%,-50%)', zIndex: 15, cursor: 'pointer' }}
            onMouseEnter={() => setDevHover({ x: m.x, y: m.y, text: m.text, date: m.date, kind: m.kind })}
            onMouseLeave={() => setDevHover(null)}
          >
            <div style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              border: `2px solid ${m.kind === 'crit' ? 'var(--status-crit)' : 'var(--status-warn)'}`,
              animation: 'map-pulse 1.8s ease-in-out infinite',
              animationDelay: (i * 0.5) + 's',
            }} />
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: m.kind === 'crit' ? 'var(--status-crit)' : 'var(--status-warn)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff',
              boxShadow: '0 0 0 2px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.7)',
            }}>!</div>
          </div>
        ))}

        {/* Deviation tooltip */}
        {devHover && (
          <div style={{
            position: 'absolute', left: devHover.x + 18, top: Math.max(devHover.y - 60, 8),
            zIndex: 20, background: 'rgba(8,12,20,0.93)',
            border: `1px solid ${devHover.kind === 'crit' ? 'rgba(220,50,50,0.45)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: 'var(--radius)', padding: '10px 12px', pointerEvents: 'none', boxShadow: 'var(--shadow-lg)', minWidth: 200,
          }}>
            <div style={{ marginBottom: 8 }}>
              <Badge variant={devHover.kind === 'crit' ? 'crit' : 'warn'} uppercase>
                {devHover.kind === 'crit' ? 'Критично' : 'Расхождение'}
              </Badge>
            </div>
            <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.4 }}>{devHover.text}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', marginTop: 5 }}>{devHover.date}</div>
          </div>
        )}
      </>}

      {/* ── 2D / P&ID overlays ───────────────────────────────────────────── */}
      {viewMode === '2D'   && <Viewer2D  selected={selected} onSelect={onSelect} phase={phase} onPhaseChange={setPhase} />}
      {viewMode === 'P&ID' && <ViewerPID selected={selected} onSelect={onSelect} phase={phase} onPhaseChange={setPhase} />}

      {/* ── View mode buttons — always on top ────────────────────────────── */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 20, display: 'flex', gap: 4 }}>
        {['2D', '3D', 'P&ID'].map(v => (
          <button key={v} onClick={() => setViewMode(v)} style={{
            height: 30, padding: '0 10px', borderRadius: 'var(--radius)',
            border: '1px solid rgba(255,255,255,0.15)',
            background: viewMode === v ? 'rgba(255,255,255,0.92)' : 'rgba(0,0,0,0.45)',
            color: viewMode === v ? '#111' : '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'background .15s',
          }}>{v}</button>
        ))}
      </div>

    </div>
  );
};

window.ViewerCanvas = ViewerCanvas;
