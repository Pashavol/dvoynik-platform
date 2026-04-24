// ViewerCamera.jsx — Multi-camera industrial surveillance view

const CAMS = [
  { id: 'CAM-01', label: 'Обзор · Башня-A',  sub: 'Азимут 135° · +28 м', alert: false },
  { id: 'CAM-02', label: 'Колонна V-1208',    sub: 'Уровень +12,4 м',     alert: true  },
  { id: 'CAM-03', label: 'Т/О E-4401',        sub: 'Земля · Север',       alert: true  },
  { id: 'CAM-04', label: 'Насосная P-2340',   sub: 'Земля · Восток',      alert: false },
  { id: 'CAM-05', label: 'БПЛА · Аэро',       sub: '+82 м · Зенит',       alert: false },
  { id: 'CAM-06', label: 'КПП · Въезд',       sub: 'Периметр · Запад',    alert: false },
];

// ── Individual camera scene SVG ───────────────────────────────────────────────
const CamScene = ({ index }) => {
  const sp = { viewBox: '0 0 320 200', width: '100%', height: '100%', style: { display: 'block' }, preserveAspectRatio: 'xMidYMid slice' };

  if (index === 0) return (
    // CAM-01: Overview from Tower A, elevated 45° angle looking SE
    <svg {...sp}>
      <defs>
        <linearGradient id="g01s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1018"/><stop offset="100%" stopColor="#182535"/>
        </linearGradient>
        <linearGradient id="g01g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#192430"/><stop offset="100%" stopColor="#111e28"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#g01s)"/>
      <rect y="106" width="320" height="94" fill="url(#g01g)"/>
      <rect y="102" width="320" height="8" fill="rgba(40,60,80,0.3)"/>
      {/* Foundation pads */}
      <rect x="118" y="118" width="72" height="68" fill="#1b2838" rx="1"/>
      <rect x="196" y="130" width="58" height="56" fill="#192533" rx="1"/>
      <rect x="68"  y="136" width="44" height="50" fill="#192533" rx="1"/>
      {/* Steel frame */}
      <rect x="136" y="90" width="3" height="40" fill="#344c5e"/>
      <rect x="184" y="90" width="3" height="40" fill="#344c5e"/>
      <line x1="135" y1="90"  x2="187" y2="90"  stroke="#344c5e" strokeWidth="2.5"/>
      <line x1="135" y1="104" x2="187" y2="104" stroke="#344c5e" strokeWidth="1.5"/>
      {/* Column V-1208 */}
      <rect x="153" y="28" width="18" height="96" fill="#3a4e5e" rx="2"/>
      <ellipse cx="162" cy="28" rx="9" ry="3.5" fill="#334858"/>
      <ellipse cx="162" cy="52" rx="13" ry="2.5" fill="none" stroke="#4a5e6e" strokeWidth="1.5"/>
      <ellipse cx="162" cy="68" rx="13" ry="2.5" fill="none" stroke="#4a5e6e" strokeWidth="1.5"/>
      <ellipse cx="162" cy="84" rx="13" ry="2.5" fill="none" stroke="#4a5e6e" strokeWidth="1.5"/>
      <line x1="171" y1="62" x2="180" y2="62" stroke="#4a5e6e" strokeWidth="3"/>
      <line x1="153" y1="76" x2="144" y2="76" stroke="#4a5e6e" strokeWidth="3"/>
      {/* Overhead pipe */}
      <line x1="162" y1="28" x2="162" y2="15" stroke="#4a5e6e" strokeWidth="3.5"/>
      <line x1="162" y1="15" x2="320" y2="15" stroke="#4a5e6e" strokeWidth="2.5"/>
      {/* E-4401 heat exchanger, lower-right */}
      <ellipse cx="257" cy="148" rx="13" ry="5.5" fill="#38505e"/>
      <rect x="224" y="142" width="33" height="11" fill="#38505e"/>
      <ellipse cx="224" cy="148" rx="13" ry="5.5" fill="#2c3e50"/>
      {[234,244,254].map(x => <line key={x} x1={x} y1="142" x2={x} y2="153" stroke="#2a3848" strokeWidth="1.2"/>)}
      <rect x="228" y="153" width="5" height="14" fill="#24303e"/>
      <rect x="246" y="153" width="5" height="14" fill="#24303e"/>
      {/* Pipe: column → HX */}
      <polyline points="171,62 196,62 196,148 224,148" fill="none" stroke="#4a5e6e" strokeWidth="3.5" strokeLinejoin="round"/>
      {/* P-2340-A */}
      <ellipse cx="102" cy="151" rx="14" ry="6" fill="#384c5c"/>
      <rect x="88" y="144" width="20" height="13" fill="#384c5c"/>
      <rect x="108" y="147" width="13" height="8" fill="#2c3e4e"/>
      {/* P-2340-B standby */}
      <ellipse cx="94" cy="163" rx="11" ry="5" fill="#283848"/>
      {/* Pipe: pump → column */}
      <polyline points="116,151 144,151 144,76 153,76" fill="none" stroke="#4a5e6e" strokeWidth="3.5" strokeLinejoin="round"/>
      {/* Alert on HX */}
      <circle cx="242" cy="145" r="8" fill="rgba(220,38,38,0.85)" stroke="rgba(248,113,113,0.4)" strokeWidth="1.5"/>
      <text x="242" y="149" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold" fontFamily="monospace">!</text>
      {/* V-1208 tag */}
      <rect x="148" y="9" width="28" height="12" fill="rgba(0,0,0,0.65)" rx="2"/>
      <text x="162" y="18" textAnchor="middle" fontSize="7" fill="rgba(180,210,240,0.85)" fontFamily="monospace" fontWeight="bold">V-1208</text>
    </svg>
  );

  if (index === 1) return (
    // CAM-02: Column V-1208 face, +12.4m, looking up
    <svg {...sp}>
      <defs>
        <radialGradient id="g02s" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#1a2838"/><stop offset="100%" stopColor="#0c1420"/>
        </radialGradient>
      </defs>
      <rect width="320" height="200" fill="url(#g02s)"/>
      {/* Column shaft — fills the frame */}
      <rect x="112" y="0" width="96" height="200" fill="#38485a"/>
      {[28,62,96,130,163].map(y => <line key={y} x1="112" y1={y} x2="208" y2={y} stroke="#2c3c4c" strokeWidth="1.8"/>)}
      {[0,1,2,3].map(i => <rect key={i} x={120+i*23} y="0" width="2.5" height="200" fill="rgba(0,0,0,0.07)"/>)}
      {/* Platform ring in perspective */}
      <ellipse cx="160" cy="22" rx="54" ry="12" fill="#26384a" stroke="#3a5060" strokeWidth="2"/>
      <ellipse cx="160" cy="22" rx="46" ry="9.5" fill="none" stroke="#2e4254" strokeWidth="1"/>
      {[-30,-18,-6,6,18,30,42].map(dx => <line key={dx} x1={160+dx} y1="14" x2={160+dx} y2="30" stroke="#1e3040" strokeWidth="1"/>)}
      {/* Nozzle stubs */}
      <rect x="208" y="80" width="32" height="11" fill="#38485a" rx="2"/>
      <rect x="230" y="77" width="16" height="16" fill="#c88820"/>
      <rect x="80"  y="102" width="32" height="10" fill="#38485a" rx="2"/>
      <rect x="66"  y="99"  width="17" height="15" fill="#c88820"/>
      {/* Ladder */}
      <rect x="88"  y="0" width="3" height="200" fill="#2a3a4c"/>
      <rect x="108" y="0" width="3" height="200" fill="#2a3a4c"/>
      {[22,46,70,94,118,142,166,190].map(y => <line key={y} x1="88" y1={y} x2="111" y2={y} stroke="#2a3a4c" strokeWidth="1.8"/>)}
      {/* Crack zone */}
      <rect x="150" y="150" width="46" height="34" fill="rgba(220,38,38,0.1)" stroke="rgba(220,38,38,0.9)" strokeWidth="1.5" strokeDasharray="3 2" rx="2"/>
      <path d="M 158 157 L 166 168 L 172 163 L 180 177" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="182" cy="178" r="5" fill="rgba(220,38,38,0.9)"/>
      {/* Annotation */}
      <rect x="106" y="146" width="84" height="24" fill="rgba(0,0,0,0.82)" rx="2"/>
      <text x="110" y="157" fontSize="8" fill="#f87171" fontFamily="monospace" fontWeight="700">⚠ ТРЕЩИНА</text>
      <text x="110" y="166" fontSize="7" fill="rgba(255,255,255,0.58)" fontFamily="monospace">Шов H2 · 23.04.2026</text>
      {/* Warning tape bottom */}
      {[0,32,64,96,128,160,192,224,256,288].map(x => (
        <rect key={x} x={x} y="190" width="32" height="10" fill={x % 64 === 0 ? 'rgba(220,38,38,0.55)' : 'rgba(230,180,0,0.45)'}/>
      ))}
      <rect x="122" y="174" width="56" height="13" fill="rgba(0,0,0,0.75)" rx="2"/>
      <text x="150" y="184" textAnchor="middle" fontSize="8" fill="rgba(200,220,240,0.9)" fontFamily="monospace" fontWeight="700">V-1208</text>
    </svg>
  );

  if (index === 2) return (
    // CAM-03: Heat exchanger E-4401, ground level, looking North
    <svg {...sp}>
      <defs>
        <linearGradient id="g03s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1420"/><stop offset="100%" stopColor="#18262e"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#g03s)"/>
      <rect y="152" width="320" height="48" fill="#121c28"/>
      <rect y="155" width="320" height="7" fill="#19232e"/>
      {[80,160,240].map(x => <line key={x} x1={x} y1="152" x2={x} y2="200" stroke="#0e1820" strokeWidth="2"/>)}
      {/* Background pipe rack */}
      <line x1="0" y1="58" x2="320" y2="58" stroke="#2c3c4e" strokeWidth="3.5"/>
      <line x1="0" y1="72" x2="320" y2="72" stroke="#26333f" strokeWidth="2.5"/>
      {[20,58,98,138,178,218,258,298].map(x => <rect key={x} x={x} y="53" width="5" height="26" fill="#28384a"/>)}
      {/* E-4401 shell */}
      <ellipse cx="264" cy="122" rx="33" ry="33" fill="#374a5a"/>
      <rect x="56" y="89" width="208" height="66" fill="#374a5a"/>
      <ellipse cx="56" cy="122" rx="33" ry="33" fill="#2c3e50"/>
      {[108,158,208].map(x => <line key={x} x1={x} y1="89" x2={x} y2="155" stroke="#2a3848" strokeWidth="2"/>)}
      {/* Insulation ring */}
      <rect x="48" y="83" width="226" height="78" fill="none" stroke="rgba(180,160,100,0.3)" strokeWidth="1.2" strokeDasharray="6 3" rx="37"/>
      {/* Nozzle left */}
      <rect x="23" y="115" width="33" height="14" fill="#374a5a" rx="3"/>
      <line x1="0" y1="122" x2="23" y2="122" stroke="#3e5264" strokeWidth="7"/>
      {/* Steam inlet top */}
      <rect x="152" y="58" width="14" height="31" fill="#374a5a" rx="2"/>
      <line x1="159" y1="58" x2="159" y2="26" stroke="#3e5264" strokeWidth="6.5"/>
      <line x1="159" y1="26" x2="260" y2="26" stroke="#3e5264" strokeWidth="5"/>
      {/* Condensate outlet bottom */}
      <rect x="192" y="155" width="13" height="28" fill="#374a5a" rx="2"/>
      <line x1="198" y1="183" x2="198" y2="200" stroke="#3e5264" strokeWidth="5.5"/>
      {/* Junction box КИПиА */}
      <rect x="170" y="70" width="28" height="18" fill="#c8901a"/>
      <rect x="174" y="73" width="20" height="12" fill="#a06818"/>
      <line x1="184" y1="88" x2="184" y2="89" stroke="#c8901a" strokeWidth="2"/>
      {/* CRACK zone */}
      <ellipse cx="126" cy="122" rx="20" ry="16" fill="rgba(220,38,38,0.1)"/>
      <ellipse cx="126" cy="122" rx="20" ry="16" fill="none" stroke="rgba(220,38,38,0.95)" strokeWidth="1.8"/>
      <path d="M 118 113 L 126 122 L 132 118 L 139 131" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Scale bar */}
      <line x1="106" y1="145" x2="148" y2="145" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
      <line x1="106" y1="142" x2="106" y2="148" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
      <line x1="148" y1="142" x2="148" y2="148" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/>
      <text x="127" y="139" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.75)" fontFamily="monospace">50 мм</text>
      {/* Alert callout */}
      <rect x="150" y="106" width="92" height="28" fill="rgba(0,0,0,0.84)" rx="2"/>
      <text x="155" y="119" fontSize="9" fill="#f87171" fontFamily="monospace" fontWeight="700">⚠ ТРЕЩИНА</text>
      <text x="155" y="129" fontSize="7" fill="rgba(255,255,255,0.55)" fontFamily="monospace">Шов H2 · 23.04.2026</text>
      {/* Saddles */}
      <rect x="78" y="155" width="36" height="20" fill="#222e3e" rx="1"/>
      <rect x="204" y="155" width="36" height="20" fill="#222e3e" rx="1"/>
      {[84,92,100,210,218,226].map(x => <rect key={x} x={x} y="173" width="3.5" height="9" fill="#1a2530"/>)}
      <rect x="132" y="160" width="52" height="12" fill="rgba(0,0,0,0.78)" rx="2"/>
      <text x="158" y="169" textAnchor="middle" fontSize="8" fill="rgba(200,220,240,0.9)" fontFamily="monospace" fontWeight="700">E-4401</text>
    </svg>
  );

  if (index === 3) return (
    // CAM-04: Pump station P-2340-A/B, ground level looking East
    <svg {...sp}>
      <defs>
        <linearGradient id="g04s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1820"/><stop offset="100%" stopColor="#182836"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#g04s)"/>
      <rect y="152" width="320" height="48" fill="#131e2a"/>
      <rect y="156" width="320" height="5" fill="#1c2838"/>
      {[80,160,240].map(x => <line key={x} x1={x} y1="152" x2={x} y2="200" stroke="#0e1820" strokeWidth="2"/>)}
      {/* Overhead pipe rack */}
      <line x1="0" y1="50" x2="320" y2="50" stroke="#2c3e52" strokeWidth="4"/>
      <line x1="0" y1="64" x2="320" y2="64" stroke="#263444" strokeWidth="3"/>
      {[24,64,104,144,184,224,264,304].map(x => <rect key={x} x={x} y="46" width="5" height="24" fill="#263a4e"/>)}
      {/* P-2340-A pump casing */}
      <ellipse cx="110" cy="144" rx="44" ry="23" fill="#3c5064"/>
      <ellipse cx="110" cy="144" rx="37" ry="18" fill="#304458"/>
      <rect x="96" y="165" width="28" height="13" fill="#2c3e52" rx="2"/>
      {/* Motor */}
      <rect x="130" y="127" width="54" height="37" fill="#3c5064" rx="5"/>
      <rect x="134" y="131" width="46" height="29" fill="#304458" rx="3"/>
      {[140,149,158,167,174].map(x => <rect key={x} x={x} y="131" width="3" height="29" fill="#243444"/>)}
      <rect x="122" y="138" width="10" height="12" fill="#223240" rx="2"/>
      {/* Suction pipe + gate valve */}
      <line x1="0" y1="144" x2="66" y2="144" stroke="#3e5266" strokeWidth="10"/>
      <polygon points="28,134 28,154 46,144" fill="#243848"/>
      <polygon points="46,134 46,154 28,144" fill="#243848"/>
      <rect x="34" y="124" width="6" height="14" fill="#243848"/>
      <rect x="30" y="120" width="14" height="6" fill="#243848"/>
      {/* Discharge pipe + check valve */}
      <line x1="110" y1="100" x2="110" y2="121" stroke="#3e5266" strokeWidth="8"/>
      <line x1="110" y1="100" x2="216" y2="100" stroke="#3e5266" strokeWidth="8"/>
      <polygon points="110,90 110,110 126,100" fill="#243848"/>
      <line x1="126" y1="90" x2="126" y2="110" stroke="#243848" strokeWidth="3.5"/>
      {/* Nameplate A */}
      <rect x="74" y="129" width="76" height="24" fill="rgba(0,0,0,0.78)" rx="2"/>
      <text x="112" y="141" textAnchor="middle" fontSize="9.5" fill="rgba(220,240,255,0.92)" fontFamily="monospace" fontWeight="700">P-2340-A</text>
      <text x="112" y="149" textAnchor="middle" fontSize="7.5" fill="rgba(74,222,128,0.9)" fontFamily="monospace">● РАБОТАЕТ</text>
      {/* P-2340-B standby */}
      <ellipse cx="234" cy="148" rx="38" ry="20" fill="#263848"/>
      <ellipse cx="234" cy="148" rx="31" ry="16" fill="#1e3040"/>
      <rect x="250" y="133" width="46" height="31" fill="#263848" rx="5"/>
      <rect x="254" y="137" width="38" height="23" fill="#1e3040" rx="3"/>
      {[260,269,278,287].map(x => <rect key={x} x={x} y="137" width="2.5" height="23" fill="#162430"/>)}
      <rect x="200" y="137" width="72" height="22" fill="rgba(0,0,0,0.72)" rx="2"/>
      <text x="236" y="148" textAnchor="middle" fontSize="9" fill="rgba(180,200,220,0.68)" fontFamily="monospace" fontWeight="700">P-2340-B</text>
      <text x="236" y="155" textAnchor="middle" fontSize="7.5" fill="rgba(160,160,160,0.55)" fontFamily="monospace">РЕЗЕРВ</text>
      {/* Column V-1208 far background */}
      <rect x="298" y="26" width="12" height="126" fill="#2a3848" opacity="0.5"/>
      <ellipse cx="304" cy="26" rx="6" ry="3" fill="#24303e" opacity="0.5"/>
      {/* Ceiling lights */}
      {[60,160,260].map(x => (
        <g key={x}>
          <rect x={x-9} y="0" width="18" height="5" fill="#2a3e50"/>
          <ellipse cx={x} cy="3" rx="22" ry="20" fill="rgba(180,200,220,0.025)"/>
        </g>
      ))}
    </svg>
  );

  if (index === 4) return (
    // CAM-05: Aerial drone, +82m, zenithal view
    <svg {...sp}>
      <rect width="320" height="200" fill="#0e1922"/>
      <rect width="320" height="200" fill="#111f2c"/>
      {/* Concrete pad */}
      <rect x="64" y="36" width="182" height="128" fill="#18283a" rx="4"/>
      {/* Concrete seams */}
      {[110,160,210].map(x => <line key={x} x1={x} y1="36" x2={x} y2="164" stroke="#121e2c" strokeWidth="1"/>)}
      {[78,108,138].map(y => <line key={y} x1="64" y1={y} x2="246" y2={y} stroke="#121e2c" strokeWidth="1"/>)}
      {/* V-1208 top view */}
      <circle cx="148" cy="96" r="23" fill="#1e303e" stroke="#2e4252" strokeWidth="2.5"/>
      <circle cx="148" cy="96" r="15" fill="#18262e"/>
      <circle cx="148" cy="96" r="4" fill="#2e4252"/>
      <circle cx="148" cy="96" r="29" fill="none" stroke="#243242" strokeWidth="1" strokeDasharray="4 2"/>
      <circle cx="148" cy="96" r="19" fill="none" stroke="#263848" strokeWidth="0.8"/>
      {/* E-4401 top view */}
      <rect x="198" y="88" width="80" height="22" fill="#1e303e"/>
      <ellipse cx="198" cy="99" rx="13" ry="11" fill="#182838"/>
      <ellipse cx="278" cy="99" rx="13" ry="11" fill="#182838"/>
      {[-7,-2,3,8].map(dy => <line key={dy} x1="198" y1={99+dy} x2="278" y2={99+dy} stroke="#121e2c" strokeWidth="1"/>)}
      {/* Alert on E-4401 */}
      <circle cx="235" cy="94" r="7.5" fill="rgba(220,38,38,0.88)"/>
      <text x="235" y="98" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold" fontFamily="monospace">!</text>
      {/* P-2340-A */}
      <circle cx="104" cy="126" r="16" fill="#1e303e" stroke="#2e4252" strokeWidth="1.5"/>
      <polygon points="104,119 115,126 104,133" fill="#28404e"/>
      {/* P-2340-B */}
      <circle cx="104" cy="94" r="14" fill="#182838" stroke="#263848" strokeWidth="1.2"/>
      <polygon points="104,87 114,94 104,101" fill="#222e3e"/>
      {/* Pipe runs */}
      <polyline points="120,126 145,126 145,96 148,96" fill="none" stroke="#2e4252" strokeWidth="5.5" strokeLinejoin="round"/>
      <polyline points="148,96 148,80 192,80 198,80 198,99" fill="none" stroke="#2e4252" strokeWidth="5" strokeLinejoin="round"/>
      <line x1="278" y1="99" x2="314" y2="99" stroke="#2e4252" strokeWidth="4.5"/>
      <line x1="148" y1="66" x2="148" y2="36" stroke="#2e4252" strokeWidth="4"/>
      {/* Column shadow */}
      <ellipse cx="160" cy="108" rx="11" ry="5" fill="rgba(0,0,0,0.28)"/>
      {/* Tags */}
      <rect x="126" y="116" width="44" height="10" fill="rgba(0,0,0,0.68)" rx="1"/>
      <text x="148" y="124" textAnchor="middle" fontSize="7" fill="rgba(170,205,240,0.8)" fontFamily="monospace">V-1208</text>
      <rect x="210" y="112" width="44" height="10" fill="rgba(0,0,0,0.68)" rx="1"/>
      <text x="232" y="120" textAnchor="middle" fontSize="7" fill="rgba(170,205,240,0.8)" fontFamily="monospace">E-4401</text>
      <rect x="80" y="142" width="48" height="10" fill="rgba(0,0,0,0.68)" rx="1"/>
      <text x="104" y="150" textAnchor="middle" fontSize="7" fill="rgba(170,205,240,0.8)" fontFamily="monospace">P-2340-A</text>
      {/* Compass */}
      <g transform="translate(294,22)">
        <circle cx="0" cy="0" r="15" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <polygon points="0,-11 -4.5,3 0,1 4.5,3" fill="rgba(255,255,255,0.9)"/>
        <polygon points="0,11 -4.5,-3 0,-1 4.5,-3" fill="rgba(255,255,255,0.28)"/>
        <text x="0" y="-14" textAnchor="middle" fontSize="7.5" fill="rgba(255,255,255,0.82)" fontFamily="monospace" fontWeight="700">С</text>
      </g>
      {/* Gimbal circle */}
      <circle cx="160" cy="100" r="90" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="1"/>
      {/* Altitude badge */}
      <rect x="8" y="8" width="62" height="14" fill="rgba(0,0,0,0.68)" rx="2"/>
      <text x="12" y="19" fontSize="8" fill="rgba(100,180,255,0.88)" fontFamily="monospace">▲ 82.4 м</text>
      {/* Scale bar */}
      <line x1="14" y1="182" x2="64" y2="182" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2"/>
      <line x1="14" y1="179" x2="14" y2="185" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2"/>
      <line x1="64" y1="179" x2="64" y2="185" stroke="rgba(255,255,255,0.42)" strokeWidth="1.2"/>
      <text x="39" y="176" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.5)" fontFamily="monospace">25 м</text>
    </svg>
  );

  // CAM-06: Gate / perimeter, exterior looking West
  return (
    <svg {...sp}>
      <defs>
        <linearGradient id="g06s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08121e"/><stop offset="100%" stopColor="#162230"/>
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#g06s)"/>
      <rect y="138" width="320" height="62" fill="#101c28"/>
      <rect y="141" width="320" height="5" fill="#19283a"/>
      {[0,50,100,150,200,250].map(x => <rect key={x} x={x} y="164" width="28" height="3" fill="#182636" rx="1"/>)}
      {/* Fence left */}
      {[0,12,24,36,48,55].map(x => <rect key={x} x={x} y="79" width="2.5" height="63" fill="#1c3044"/>)}
      <line x1="0" y1="85" x2="57" y2="85" stroke="#1c3044" strokeWidth="2.5"/>
      <line x1="0" y1="98" x2="57" y2="98" stroke="#1c3044" strokeWidth="1.5"/>
      {/* Fence right */}
      {[263,275,287,299,311].map(x => <rect key={x} x={x} y="79" width="2.5" height="63" fill="#1c3044"/>)}
      <line x1="263" y1="85" x2="320" y2="85" stroke="#1c3044" strokeWidth="2.5"/>
      <line x1="263" y1="98" x2="320" y2="98" stroke="#1c3044" strokeWidth="1.5"/>
      {/* Gate posts */}
      <rect x="55"  y="66" width="15" height="76" fill="#223848"/>
      <rect x="250" y="66" width="15" height="76" fill="#223848"/>
      {/* Gate header */}
      <rect x="55" y="66" width="210" height="12" fill="#28404e"/>
      {/* Name sign */}
      <rect x="106" y="62" width="108" height="18" fill="#1c3040"/>
      <text x="160" y="75" textAnchor="middle" fontSize="8.5" fill="rgba(180,210,240,0.6)" fontFamily="monospace" fontWeight="700">STRATUM · ОБЪЕКТ-2</text>
      {/* Gate panels */}
      <rect x="70"  y="78" width="78" height="64" fill="#1a2e3e" stroke="#223848" strokeWidth="1.5"/>
      {[82,94,106,118,130,140].map(x => <rect key={x} x={x} y="78" width="2.5" height="64" fill="#14222e"/>)}
      <rect x="172" y="78" width="78" height="64" fill="#1a2e3e" stroke="#223848" strokeWidth="1.5"/>
      {[184,196,208,220,232,242].map(x => <rect key={x} x={x} y="78" width="2.5" height="64" fill="#14222e"/>)}
      {/* Facility through gate */}
      <rect x="144" y="88" width="9" height="54" fill="#223848" opacity="0.7"/>
      <rect x="153" y="99" width="6" height="43" fill="#1a2e3e" opacity="0.65"/>
      <ellipse cx="148" cy="88" rx="5" ry="2.5" fill="#1e3040" opacity="0.7"/>
      {/* Post lights */}
      <circle cx="63"  cy="72" r="5.5" fill="rgba(240,200,80,0.72)"/>
      <ellipse cx="63"  cy="76" rx="20" ry="14" fill="rgba(240,200,80,0.04)"/>
      <circle cx="257" cy="72" r="5.5" fill="rgba(240,200,80,0.72)"/>
      <ellipse cx="257" cy="76" rx="20" ry="14" fill="rgba(240,200,80,0.04)"/>
      {/* Security camera housing */}
      <rect x="58" y="54" width="20" height="12" fill="#192838" rx="2"/>
      <circle cx="78" cy="60" r="6" fill="#0e1e2e" stroke="#1e3040" strokeWidth="1"/>
      <circle cx="78" cy="60" r="2.5" fill="#060e18"/>
      {/* Guard booth */}
      <rect x="0"  y="108" width="50" height="30" fill="#1e3040"/>
      <rect x="6"  y="112" width="22" height="17" fill="rgba(30,60,90,0.45)" stroke="#1e3040" strokeWidth="1"/>
      <rect x="0"  y="136" width="50" height="4" fill="#28404e"/>
      <text x="25" y="130" textAnchor="middle" fontSize="8" fill="rgba(150,180,210,0.45)" fontFamily="monospace">КПП</text>
    </svg>
  );
};

// ── ViewerCamera ──────────────────────────────────────────────────────────────
const ViewerCamera = () => {
  const [active, setActive] = React.useState(0);
  const [tick,   setTick]   = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const ts  = now.toLocaleTimeString('ru-RU', { hour12: false }) + ' · ' + now.toLocaleDateString('ru-RU');

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: '#06080e', fontFamily: 'var(--font-mono)' }}>

      {/* ── Main area ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ── Primary feed ─────────────────────────────────────────── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#080b12' }}>
          <CamScene index={active} />

          {/* Scanlines */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)' }}/>

          {/* Top HUD */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 18px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, transparent 100%)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            pointerEvents: 'none', zIndex: 3 }}>
            <div>
              <div style={{ fontSize: 14, color: '#fff', fontWeight: 700, letterSpacing: '0.1em' }}>{CAMS[active].id}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.58)', marginTop: 2, letterSpacing: '0.04em' }}>{CAMS[active].label}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.14em' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#dc2626', animation: 'map-pulse 1.4s ease-in-out infinite' }}/>
              REC
            </div>
          </div>

          {/* Alert banner */}
          {CAMS[active].alert && (
            <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(180,20,20,0.92)', color: '#fff', fontSize: 10, fontWeight: 700,
              padding: '5px 18px', borderRadius: 3, border: '1px solid rgba(248,113,113,0.35)',
              letterSpacing: '0.13em', whiteSpace: 'nowrap', zIndex: 4 }}>
              ⚠ ОТКЛОНЕНИЕ ЗАФИКСИРОВАНО
            </div>
          )}

          {/* Centre reticle */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', zIndex: 3 }}>
            <svg width={70} height={70} style={{ opacity: 0.18 }}>
              <line x1={35} y1={0}  x2={35} y2={16} stroke="#fff" strokeWidth={1}/>
              <line x1={35} y1={54} x2={35} y2={70} stroke="#fff" strokeWidth={1}/>
              <line x1={0}  y1={35} x2={16} y2={35} stroke="#fff" strokeWidth={1}/>
              <line x1={54} y1={35} x2={70} y2={35} stroke="#fff" strokeWidth={1}/>
              <circle cx={35} cy={35} r={10} fill="none" stroke="#fff" strokeWidth={1}/>
              <circle cx={35} cy={35} r={2}  fill="#fff"/>
            </svg>
          </div>

          {/* Bottom HUD */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 18px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            pointerEvents: 'none', zIndex: 3 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.06em' }}>{CAMS[active].sub}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>{ts}</div>
          </div>
        </div>

        {/* ── Camera strip ────────────────────────────────────────── */}
        <div style={{ width: 210, background: '#04060c', borderLeft: '1px solid rgba(255,255,255,0.04)',
          display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>

          <div style={{ padding: '10px 12px', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.24)', fontWeight: 600,
            borderBottom: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
            Все камеры · {CAMS.length} онлайн
          </div>

          {CAMS.map((cam, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              position: 'relative', cursor: 'pointer', margin: '6px 8px 0', borderRadius: 4, overflow: 'hidden',
              outline: i === active ? '1.5px solid rgba(59,130,246,0.65)' : '1.5px solid rgba(255,255,255,0.04)',
              transition: 'outline .15s',
            }}>
              {/* Thumbnail — SVG fills 16:10 frame with slice */}
              <div style={{ height: 88, overflow: 'hidden', background: '#080b14' }}>
                <CamScene index={i} />
              </div>
              {/* Scanlines on thumb */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 88, pointerEvents: 'none',
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)' }}/>
              {/* Active bar */}
              {i === active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2.5, background: '#3b82f6', zIndex: 2 }}/>}
              {/* Labels */}
              <div style={{ padding: '5px 9px 7px', background: 'rgba(4,6,12,0.92)' }}>
                <div style={{ fontSize: 9.5, fontWeight: 700,
                  color: i === active ? '#93c5fd' : 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' }}>{cam.id}</div>
                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.36)', marginTop: 1.5,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cam.label}</div>
              </div>
              {/* Alert dot */}
              {cam.alert && (
                <div style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8,
                  borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 6px rgba(220,38,38,0.9)', zIndex: 3 }}/>
              )}
            </div>
          ))}
          <div style={{ height: 8, flexShrink: 0 }}/>
        </div>
      </div>

      {/* ── Controls bar ─────────────────────────────────────────────── */}
      <div style={{ height: 44, background: '#03050a', borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', gap: 5, padding: '0 14px', flexShrink: 0 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', marginRight: 2 }}>PTZ</span>
        {[['↑','u'],['↓','d'],['←','l'],['→','r']].map(([lbl, k]) => (
          <button key={k} style={{ width: 28, height: 28, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)',
            borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>{lbl}</button>
        ))}
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.07)', margin: '0 2px' }}/>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em' }}>ZOOM</span>
        {[['+','zi'],['-','zo']].map(([lbl, k]) => (
          <button key={k} style={{ width: 28, height: 28, border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)',
            borderRadius: 4, cursor: 'pointer', fontSize: 15, lineHeight: 1 }}>{lbl}</button>
        ))}
        <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.07)', margin: '0 2px' }}/>
        <button style={{ height: 28, padding: '0 11px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
          borderRadius: 4, cursor: 'pointer', fontSize: 9, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
          ⬤ СНИМОК
        </button>
        <button style={{ height: 28, padding: '0 11px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)',
          borderRadius: 4, cursor: 'pointer', fontSize: 9, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
          ⊞ 2×3
        </button>
        <div style={{ marginLeft: 'auto', fontSize: 9, color: 'rgba(255,255,255,0.16)', letterSpacing: '0.08em' }}>
          STRATUM · CCTV v2.14 · {CAMS.length} камер онлайн
        </div>
      </div>

    </div>
  );
};

window.ViewerCamera = ViewerCamera;
