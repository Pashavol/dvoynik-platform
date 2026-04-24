// MediaPage.jsx — project photo & video gallery

// SVG scene thumbnails for each media item
const SCENES = {
  // 1 — Heat exchanger E-4401 mounting: horizontal drum on saddles
  1: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#0f2030"/>
      {/* sky gradient hint */}
      <rect width="220" height="60" fill="url(#sky1)"/>
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a55"/>
          <stop offset="100%" stopColor="#0f2030"/>
        </linearGradient>
      </defs>
      {/* ground */}
      <rect y="108" width="220" height="32" fill="#182028"/>
      {/* left saddle */}
      <polygon points="60,108 50,108 54,82 70,82 74,108" fill="#2a4a5a"/>
      <rect x="50" y="108" width="24" height="6" rx="1" fill="#1e3848"/>
      {/* right saddle */}
      <polygon points="160,108 150,108 154,82 170,82 174,108" fill="#2a4a5a"/>
      <rect x="150" y="108" width="24" height="6" rx="1" fill="#1e3848"/>
      {/* drum body */}
      <rect x="55" y="62" width="110" height="40" fill="#3a6070" rx="2"/>
      {/* left cap */}
      <ellipse cx="55" cy="82" rx="12" ry="20" fill="#2e5060"/>
      {/* right cap */}
      <ellipse cx="165" cy="82" rx="12" ry="20" fill="#2e5060"/>
      {/* nozzle top */}
      <rect x="103" y="52" width="14" height="14" fill="#2a5060" rx="1"/>
      <rect x="99" y="50" width="22" height="5" rx="1" fill="#22404f"/>
      {/* flange rings */}
      <ellipse cx="55" cy="82" rx="13" ry="21" fill="none" stroke="#4a7a8a" strokeWidth="2"/>
      <ellipse cx="165" cy="82" rx="13" ry="21" fill="none" stroke="#4a7a8a" strokeWidth="2"/>
      {/* shell seam */}
      <line x1="55" y1="62" x2="165" y2="62" stroke="#4a7a8a" strokeWidth="1" strokeDasharray="4 3"/>
      {/* bolts on flange */}
      {[0,60,120,180,240,300].map((a,i) => {
        const rad = a * Math.PI / 180;
        return <circle key={i} cx={55 + Math.cos(rad)*11} cy={82 + Math.sin(rad)*18} r="1.5" fill="#6a9aaa"/>;
      })}
      {/* crane cable */}
      <line x1="110" y1="0" x2="110" y2="50" stroke="#8aabbb" strokeWidth="1.5"/>
      <rect x="100" y="44" width="20" height="8" rx="2" fill="#3a6070"/>
      {/* tag label */}
      <rect x="130" y="72" width="36" height="14" rx="2" fill="rgba(0,0,0,0.55)"/>
      <text x="148" y="82" textAnchor="middle" fill="#7ac0d8" fontSize="8" fontFamily="monospace">E-4401</text>
    </svg>
  ),

  // 2 — Weld crack close-up: metal surface with fracture
  2: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="220" height="140" fill="#1a1010"/>
      <defs>
        <linearGradient id="metal2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2020"/>
          <stop offset="50%" stopColor="#3a2a2a"/>
          <stop offset="100%" stopColor="#1e1818"/>
        </linearGradient>
      </defs>
      {/* metal surface texture */}
      <rect width="220" height="140" fill="url(#metal2)"/>
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1="0" y1={20*i} x2="220" y2={20*i+10} stroke="#282020" strokeWidth="0.5"/>
      ))}
      {/* weld seam */}
      <path d="M10,72 Q30,68 50,72 Q70,76 90,72 Q110,68 130,72 Q150,76 170,72 Q190,68 210,72" fill="none" stroke="#5a4030" strokeWidth="6"/>
      <path d="M10,72 Q30,68 50,72 Q70,76 90,72 Q110,68 130,72 Q150,76 170,72 Q190,68 210,72" fill="none" stroke="#7a5840" strokeWidth="3"/>
      {/* crack */}
      <path d="M88,65 L96,72 L102,78 L112,72 L118,80 L128,68" fill="none" stroke="#cc2020" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M96,72 L92,78" fill="none" stroke="#cc2020" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M112,72 L116,76" fill="none" stroke="#cc2020" strokeWidth="1.5" strokeLinecap="round"/>
      {/* glow under crack */}
      <ellipse cx="108" cy="73" rx="22" ry="8" fill="rgba(200,40,20,0.18)"/>
      {/* callout arrow */}
      <line x1="138" y1="55" x2="118" y2="73" stroke="#ff6060" strokeWidth="1.5"/>
      <circle cx="138" cy="52" r="3" fill="#ff6060"/>
      <rect x="140" y="43" width="60" height="18" rx="3" fill="rgba(0,0,0,0.7)"/>
      <text x="170" y="55" textAnchor="middle" fill="#ff9090" fontSize="9" fontFamily="monospace">Трещина</text>
      {/* scale bar */}
      <line x1="20" y1="120" x2="70" y2="120" stroke="#888" strokeWidth="1.5"/>
      <line x1="20" y1="116" x2="20" y2="124" stroke="#888" strokeWidth="1.5"/>
      <line x1="70" y1="116" x2="70" y2="124" stroke="#888" strokeWidth="1.5"/>
      <text x="45" y="133" textAnchor="middle" fill="#888" fontSize="8" fontFamily="monospace">50 мм</text>
    </svg>
  ),

  // 3 — Site walkthrough video: first-person corridor between structures
  3: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a3a"/>
          <stop offset="100%" stopColor="#0d1a28"/>
        </linearGradient>
      </defs>
      <rect width="220" height="140" fill="url(#sky3)"/>
      {/* ground */}
      <polygon points="0,140 220,140 220,90 0,90" fill="#14202a"/>
      {/* ground lines (perspective) */}
      {[-3,-2,-1,0,1,2,3].map(i => (
        <line key={i} x1={110 + i*300} y1="90" x2={110 + i*20} y2="140" stroke="#1e2e3e" strokeWidth="1"/>
      ))}
      {/* left structure */}
      <polygon points="0,30 0,140 55,140 55,90 30,90 30,30" fill="#1e3040"/>
      <rect x="0" y="30" width="30" height="60" fill="#243848"/>
      {/* left structure windows/details */}
      {[0,1,2].map(i => <rect key={i} x="6" y={36+i*20} width="18" height="12" rx="1" fill="#162838"/>)}
      {/* pipes on left structure */}
      <rect x="30" y="50" width="4" height="90" fill="#2a4050"/>
      <rect x="36" y="60" width="4" height="80" fill="#243848"/>
      <circle cx="32" cy="50" r="5" fill="#1e3040" stroke="#2a4050" strokeWidth="1"/>
      {/* right structure */}
      <polygon points="220,30 220,140 165,140 165,90 190,90 190,30" fill="#1e3040"/>
      <rect x="190" y="30" width="30" height="60" fill="#243848"/>
      {[0,1,2].map(i => <rect key={i} x="196" y={36+i*20} width="18" height="12" rx="1" fill="#162838"/>)}
      <rect x="186" y="50" width="4" height="90" fill="#2a4050"/>
      <rect x="180" y="60" width="4" height="80" fill="#243848"/>
      {/* sky cables */}
      <line x1="0" y1="20" x2="110" y2="70" stroke="#2a4858" strokeWidth="1"/>
      <line x1="220" y1="20" x2="110" y2="70" stroke="#2a4858" strokeWidth="1"/>
      {/* vanishing point glow */}
      <ellipse cx="110" cy="75" rx="25" ry="15" fill="rgba(80,140,180,0.12)"/>
      {/* timecode overlay */}
      <rect x="6" y="6" width="52" height="14" rx="2" fill="rgba(0,0,0,0.6)"/>
      <text x="10" y="16" fill="#e0e0e0" fontSize="8" fontFamily="monospace">00:01:24</text>
      <circle cx="8" cy="128" r="5" fill="rgba(255,60,60,0.9)"/>
      <text x="18" y="132" fill="#e0e0e0" fontSize="8" fontFamily="monospace">REC</text>
    </svg>
  ),

  // 4 — Column V-1208 with deviation marker
  4: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e2a18"/>
          <stop offset="100%" stopColor="#141e10"/>
        </linearGradient>
        <linearGradient id="col4" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a5030"/>
          <stop offset="40%" stopColor="#5a7050"/>
          <stop offset="100%" stopColor="#2e4028"/>
        </linearGradient>
      </defs>
      <rect width="220" height="140" fill="url(#sky4)"/>
      <rect y="118" width="220" height="22" fill="#101808"/>
      {/* column body */}
      <rect x="92" y="10" width="36" height="108" fill="url(#col4)" rx="2"/>
      {/* column cap */}
      <ellipse cx="110" cy="10" rx="18" ry="6" fill="#4a6040"/>
      {/* base */}
      <rect x="84" y="116" width="52" height="6" rx="1" fill="#304028"/>
      {/* platform rings */}
      {[35, 62, 88].map((y, i) => (
        <g key={i}>
          <ellipse cx="110" cy={y} rx="24" ry="5" fill="none" stroke="#5a7050" strokeWidth="2"/>
          <rect x="86" y={y-2} width="48" height="4" fill="#3a5030" opacity="0.4"/>
        </g>
      ))}
      {/* nozzle stubs */}
      <rect x="128" y="50" width="12" height="4" rx="1" fill="#4a6040"/>
      <rect x="80" y="68" width="12" height="4" rx="1" fill="#4a6040"/>
      {/* deviation indicator */}
      <line x1="140" y1="48" x2="160" y2="38" stroke="#e0a020" strokeWidth="1.5" strokeDasharray="3 2"/>
      <circle cx="162" cy="36" r="10" fill="rgba(220,160,20,0.9)"/>
      <text x="162" y="40" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">!</text>
      {/* offset arrow */}
      <line x1="110" y1="105" x2="116" y2="105" stroke="#e0a020" strokeWidth="2" markerEnd="url(#arr)"/>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#e0a020"/>
        </marker>
      </defs>
      <text x="119" y="109" fill="#e0a020" fontSize="7" fontFamily="monospace">+45мм</text>
    </svg>
  ),

  // 5 — Platform rings V-1208: top-down view
  5: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg5" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1e1a30"/>
          <stop offset="100%" stopColor="#100e20"/>
        </radialGradient>
      </defs>
      <rect width="220" height="140" fill="url(#bg5)"/>
      {/* grating pattern */}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <line key={'h'+i} x1="40" y1={30+i*8} x2="180" y2={30+i*8} stroke="#1e1a38" strokeWidth="0.5"/>
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(i => (
        <line key={'v'+i} x1={40+i*8} y1="30" x2={40+i*8} y2="110" stroke="#1e1a38" strokeWidth="0.5"/>
      ))}
      {/* outer walkway ring */}
      <ellipse cx="110" cy="70" rx="68" ry="42" fill="none" stroke="#3a3050" strokeWidth="8"/>
      {/* platform surface */}
      <ellipse cx="110" cy="70" rx="68" ry="42" fill="none" stroke="#4a4060" strokeWidth="1"/>
      <ellipse cx="110" cy="70" rx="60" ry="36" fill="none" stroke="#3a3050" strokeWidth="1"/>
      {/* column top circle */}
      <ellipse cx="110" cy="70" rx="22" ry="14" fill="#2a2540"/>
      <ellipse cx="110" cy="70" rx="18" ry="11" fill="#1e1a30"/>
      {/* column tag */}
      <text x="110" y="74" textAnchor="middle" fill="#7070c0" fontSize="9" fontFamily="monospace">V-1208</text>
      {/* handrail posts */}
      {[0,45,90,135,180,225,270,315].map((a, i) => {
        const rad = a * Math.PI / 180;
        return <circle key={i} cx={110 + Math.cos(rad)*65} cy={70 + Math.sin(rad)*40} r="3" fill="#5a5070"/>;
      })}
      {/* access ladder */}
      <rect x="170" y="62" width="6" height="16" rx="1" fill="#3a3050"/>
      <line x1="171" y1="64" x2="175" y2="64" stroke="#5a5070" strokeWidth="1"/>
      <line x1="171" y1="68" x2="175" y2="68" stroke="#5a5070" strokeWidth="1"/>
      <line x1="171" y1="72" x2="175" y2="72" stroke="#5a5070" strokeWidth="1"/>
      {/* north marker */}
      <text x="110" y="22" textAnchor="middle" fill="#6060a0" fontSize="10" fontWeight="bold">N</text>
      <line x1="110" y1="26" x2="110" y2="34" stroke="#6060a0" strokeWidth="1"/>
    </svg>
  ),

  // 6 — Pump group P-2340: side view
  6: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg6" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1e18"/>
          <stop offset="100%" stopColor="#091410"/>
        </linearGradient>
      </defs>
      <rect width="220" height="140" fill="url(#bg6)"/>
      <rect y="108" width="220" height="32" fill="#081008"/>
      {/* baseplate */}
      <rect x="28" y="104" width="164" height="6" rx="1" fill="#1a3020"/>
      {/* pump A */}
      {/* casing */}
      <ellipse cx="72" cy="88" rx="26" ry="26" fill="#1e4030"/>
      <ellipse cx="72" cy="88" rx="22" ry="22" fill="#163828"/>
      <ellipse cx="72" cy="88" rx="10" ry="10" fill="#0e2818"/>
      <circle cx="72" cy="88" r="5" fill="#1a4030" stroke="#2a6040" strokeWidth="1.5"/>
      {/* volute scroll */}
      <path d="M72,88 Q85,72 90,88 Q96,108 72,114" fill="none" stroke="#2a6040" strokeWidth="3"/>
      {/* motor A */}
      <rect x="96" y="74" width="48" height="28" rx="3" fill="#1e3828"/>
      <rect x="96" y="74" width="48" height="28" rx="3" fill="none" stroke="#2a5038" strokeWidth="1.5"/>
      {/* cooling fins */}
      {[0,1,2,3,4,5].map(i => <line key={i} x1={100+i*7} y1="74" x2={100+i*7} y2="102" stroke="#243c30" strokeWidth="1"/>)}
      {/* shaft coupling */}
      <rect x="92" y="83" width="6" height="10" rx="1" fill="#2a5038"/>
      {/* suction pipe */}
      <rect x="32" y="84" width="20" height="8" rx="2" fill="#1a3828"/>
      <circle cx="32" cy="88" r="7" fill="none" stroke="#2a5038" strokeWidth="2"/>
      {/* discharge pipe up */}
      <rect x="68" y="50" width="8" height="26" rx="2" fill="#1a3828"/>
      <rect x="62" y="46" width="20" height="6" rx="1" fill="#142e20"/>
      {/* pump B */}
      <ellipse cx="150" cy="88" rx="26" ry="26" fill="#1e4030"/>
      <ellipse cx="150" cy="88" rx="22" ry="22" fill="#163828"/>
      <ellipse cx="150" cy="88" rx="10" ry="10" fill="#0e2818"/>
      <circle cx="150" cy="88" r="5" fill="#1a4030" stroke="#2a6040" strokeWidth="1.5"/>
      {/* motor B */}
      <rect x="152" y="74" width="34" height="28" rx="3" fill="#1e3828" stroke="#2a5038" strokeWidth="1.5"/>
      {[0,1,2,3].map(i => <line key={i} x1={156+i*7} y1="74" x2={156+i*7} y2="102" stroke="#243c30" strokeWidth="1"/>)}
      <rect x="146" y="83" width="6" height="10" rx="1" fill="#2a5038"/>
      {/* tags */}
      <rect x="55" y="112" width="38" height="12" rx="2" fill="rgba(0,0,0,0.5)"/>
      <text x="74" y="121" textAnchor="middle" fill="#50b080" fontSize="8" fontFamily="monospace">P-2340-A</text>
      <rect x="130" y="112" width="38" height="12" rx="2" fill="rgba(0,0,0,0.5)"/>
      <text x="149" y="121" textAnchor="middle" fill="#50b080" fontSize="8" fontFamily="monospace">P-2340-B</text>
      {/* timecode */}
      <rect x="6" y="6" width="52" height="14" rx="2" fill="rgba(0,0,0,0.6)"/>
      <text x="10" y="16" fill="#e0e0e0" fontSize="8" fontFamily="monospace">00:00:38</text>
      <circle cx="8" cy="128" r="5" fill="rgba(255,60,60,0.9)"/>
      <text x="18" y="132" fill="#e0e0e0" fontSize="8" fontFamily="monospace">REC</text>
    </svg>
  ),

  // 7 — Pipe routing general view
  7: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg7" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2028"/>
          <stop offset="100%" stopColor="#101820"/>
        </linearGradient>
      </defs>
      <rect width="220" height="140" fill="url(#bg7)"/>
      <rect y="116" width="220" height="24" fill="#0c1418"/>
      {/* pipe support posts */}
      {[40, 100, 160].map(x => (
        <g key={x}>
          <rect x={x-2} y="60" width="4" height="56" fill="#1e3040"/>
          <rect x={x-10} y="56" width="20" height="5" rx="1" fill="#182830"/>
        </g>
      ))}
      {/* pipe run 1 — large, top */}
      <rect x="10" y="36" width="200" height="16" rx="8" fill="#304858"/>
      <ellipse cx="10" cy="44" rx="8" ry="8" fill="#263e50"/>
      <ellipse cx="210" cy="44" rx="8" ry="8" fill="#263e50"/>
      <line x1="10" y1="36" x2="210" y2="36" stroke="#3a5868" strokeWidth="1"/>
      {/* pipe run 2 — medium */}
      <rect x="10" y="60" width="200" height="12" rx="6" fill="#2a4050"/>
      <ellipse cx="10" cy="66" rx="6" ry="6" fill="#22384a"/>
      <ellipse cx="210" cy="66" rx="6" ry="6" fill="#22384a"/>
      {/* pipe run 3 — small */}
      <rect x="10" y="80" width="130" height="8" rx="4" fill="#243848"/>
      {/* elbow up */}
      <path d="M140,80 Q148,80 148,72 L148,56" fill="none" stroke="#243848" strokeWidth="8" strokeLinecap="round"/>
      {/* pipe run 4 — small, low */}
      <rect x="10" y="96" width="90" height="8" rx="4" fill="#1e3040"/>
      <rect x="110" y="96" width="100" height="8" rx="4" fill="#1e3040"/>
      {/* valve on run 1 */}
      <rect x="96" y="38" width="8" height="12" fill="#2a5070"/>
      <polygon points="100,28 94,38 106,38" fill="#2a5070"/>
      {/* valve on run 3 */}
      <rect x="60" y="78" width="6" height="10" fill="#263848"/>
      <line x1="63" y1="73" x2="63" y2="78" stroke="#263848" strokeWidth="3"/>
      <line x1="58" y1="73" x2="68" y2="73" stroke="#263848" strokeWidth="2"/>
      {/* insulation wrapping on pipe 1 */}
      {[20,30,40,50,60,70,80,90,100,120,130,140,150,160,170,180,190].map(x => (
        <line key={x} x1={x} y1="36" x2={x+6} y2="52" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      ))}
    </svg>
  ),

  // 8 — Foundation rebar: top-down
  8: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg8" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2018"/>
          <stop offset="100%" stopColor="#101810"/>
        </linearGradient>
      </defs>
      <rect width="220" height="140" fill="url(#bg8)"/>
      {/* concrete formwork */}
      <rect x="14" y="12" width="192" height="116" rx="2" fill="#141e12"/>
      <rect x="14" y="12" width="192" height="116" rx="2" fill="none" stroke="#22301a" strokeWidth="3"/>
      {/* concrete texture */}
      {[0,1,2,3,4,5,6].map(i => [0,1,2,3,4,5].map(j => (
        <circle key={`${i}-${j}`} cx={28+i*28} cy={24+j*20} r="0.7" fill="#1e2a18" opacity="0.5"/>
      )))}
      {/* rebar grid horizontal */}
      {[28, 44, 60, 76, 92, 108].map((y, i) => (
        <line key={i} x1="18" y1={y} x2="202" y2={y} stroke="#3a5030" strokeWidth="3" strokeLinecap="round"/>
      ))}
      {/* rebar grid vertical */}
      {[28, 50, 72, 94, 116, 138, 160, 182].map((x, i) => (
        <line key={i} x1={x} y1="16" x2={x} y2="124" stroke="#3a5030" strokeWidth="3" strokeLinecap="round"/>
      ))}
      {/* rebar crossings — highlight circles */}
      {[28,50,72,94,116,138,160,182].map(x =>
        [28,44,60,76,92,108].map(y => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#1e3020" stroke="#4a6840" strokeWidth="1"/>
        ))
      )}
      {/* anchor bolts */}
      {[[50,36],[50,100],[170,36],[170,100]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="#243018" stroke="#5a7040" strokeWidth="1.5"/>
          <circle cx={x} cy={y} r="3" fill="#1a2410" stroke="#4a6030" strokeWidth="1"/>
        </g>
      ))}
      {/* dimension line */}
      <line x1="18" y1="130" x2="202" y2="130" stroke="#3a5030" strokeWidth="1"/>
      <line x1="18" y1="127" x2="18" y2="133" stroke="#3a5030" strokeWidth="1"/>
      <line x1="202" y1="127" x2="202" y2="133" stroke="#3a5030" strokeWidth="1"/>
      <text x="110" y="137" textAnchor="middle" fill="#4a6840" fontSize="8" fontFamily="monospace">6 000 мм</text>
    </svg>
  ),

  // 9 — Drone aerial shot: bird's eye of industrial site
  9: (
    <svg viewBox="0 0 220 140" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg9" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101820"/>
          <stop offset="100%" stopColor="#0a1218"/>
        </linearGradient>
      </defs>
      <rect width="220" height="140" fill="url(#bg9)"/>
      {/* site boundary */}
      <rect x="12" y="10" width="196" height="120" rx="2" fill="none" stroke="#2a4050" strokeWidth="1.5" strokeDasharray="6 3"/>
      {/* ground surface */}
      <rect x="12" y="10" width="196" height="120" fill="#0e1820"/>
      {/* roads */}
      <rect x="12" y="60" width="196" height="12" fill="#141e28"/>
      <line x1="12" y1="66" x2="208" y2="66" stroke="#1e2e3e" strokeWidth="1" strokeDasharray="8 6"/>
      <rect x="100" y="10" width="12" height="120" fill="#141e28"/>
      {/* column footprint — top view */}
      <circle cx="60" cy="40" r="12" fill="#1e3040" stroke="#3a5060" strokeWidth="1.5"/>
      <circle cx="60" cy="40" r="5" fill="#2a4050"/>
      <text x="60" y="44" textAnchor="middle" fill="#5a8090" fontSize="7" fontFamily="monospace">V-1208</text>
      {/* heat exchanger footprint */}
      <rect x="130" y="28" width="52" height="18" rx="3" fill="#1e3040" stroke="#3a5060" strokeWidth="1.5"/>
      <text x="156" y="40" textAnchor="middle" fill="#5a8090" fontSize="7" fontFamily="monospace">E-4401</text>
      {/* pump footprints */}
      <circle cx="42" cy="94" r="8" fill="#1e3040" stroke="#3a5060" strokeWidth="1.5"/>
      <circle cx="62" cy="94" r="8" fill="#1e3040" stroke="#3a5060" strokeWidth="1.5"/>
      <text x="52" y="98" textAnchor="middle" fill="#5a8090" fontSize="6" fontFamily="monospace">P-2340</text>
      {/* pipe routes top-view */}
      <line x1="60" y1="52" x2="60" y2="76" stroke="#2a4858" strokeWidth="4"/>
      <line x1="60" y1="76" x2="106" y2="76" stroke="#2a4858" strokeWidth="4"/>
      <line x1="60" y1="86" x2="106" y2="86" stroke="#2a4858" strokeWidth="3"/>
      <line x1="130" y1="37" x2="106" y2="37" stroke="#2a4858" strokeWidth="4"/>
      {/* shadow of structures */}
      <ellipse cx="60" cy="46" rx="10" ry="4" fill="rgba(0,0,0,0.3)"/>
      <ellipse cx="156" cy="50" rx="24" ry="4" fill="rgba(0,0,0,0.3)"/>
      {/* compass rose */}
      <circle cx="190" cy="22" r="10" fill="rgba(0,0,0,0.4)" stroke="#2a4050" strokeWidth="1"/>
      <polygon points="190,13 187,22 190,20 193,22" fill="#e0e0e0"/>
      <polygon points="190,31 187,22 190,24 193,22" fill="#505060"/>
      <text x="190" y="11" textAnchor="middle" fill="#e0e0e0" fontSize="7">N</text>
      {/* timecode */}
      <rect x="6" y="6" width="74" height="14" rx="2" fill="rgba(0,0,0,0.6)"/>
      <text x="10" y="16" fill="#e0e0e0" fontSize="8" fontFamily="monospace">ALT: 42m  4K</text>
      <circle cx="8" cy="128" r="5" fill="rgba(255,60,60,0.9)"/>
      <text x="18" y="132" fill="#e0e0e0" fontSize="8" fontFamily="monospace">REC</text>
    </svg>
  ),
};

const MEDIA = [
  { id: 1, type: 'photo', name: 'Монтаж теплообменника E-4401',        date: '23.04.2026', author: 'Петров Д.К.',  size: '4,2 МБ' },
  { id: 2, type: 'photo', name: 'Трещина в сварном шве — E-4401',      date: '23.04.2026', author: 'ОТК',          size: '3,8 МБ',  crit: true },
  { id: 3, type: 'video', name: 'Обход объекта 22.04.2026',             date: '22.04.2026', author: 'Иванов А.В.', size: '248 МБ',  duration: '4:32' },
  { id: 4, type: 'photo', name: 'Колонна V-1208 — расхождение стенки', date: '12.03.2026', author: 'ОТК',          size: '3,1 МБ',  warn: true },
  { id: 5, type: 'photo', name: 'Платформенные кольца V-1208',          date: '15.04.2026', author: 'Петров Д.К.', size: '5,3 МБ' },
  { id: 6, type: 'video', name: 'Проверка насосной группы P-2340',      date: '10.04.2026', author: 'Сидоров В.П.',size: '182 МБ',  duration: '2:15' },
  { id: 7, type: 'photo', name: 'Обвязка трубопроводов — общий вид',   date: '05.04.2026', author: 'BIM-отдел',   size: '4,7 МБ' },
  { id: 8, type: 'photo', name: 'Армирование фундаментных плит',        date: '18.02.2026', author: 'Иванов А.В.', size: '6,2 МБ' },
  { id: 9, type: 'video', name: 'Drone-облёт площадки 01.04.2026',      date: '01.04.2026', author: 'BIM-отдел',   size: '512 МБ', duration: '7:48' },
];

const FILTERS = ['Все', 'Фото', 'Видео', 'Дефекты'];

const MediaPage = () => {
  const [filter, setFilter] = React.useState('Все');

  const visible = MEDIA.filter(m => {
    if (filter === 'Фото')    return m.type === 'photo';
    if (filter === 'Видео')   return m.type === 'video';
    if (filter === 'Дефекты') return m.crit || m.warn;
    return true;
  });

  const photos = MEDIA.filter(m => m.type === 'photo').length;
  const videos = MEDIA.filter(m => m.type === 'video').length;

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Фото и видео</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>
            {photos} фото · {videos} видео · актуально на 24.04.2026
          </div>
        </div>
        <Button variant="outline" size="sm"><Icon name="upload" size={14} />Загрузить</Button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            height: 30, padding: '0 14px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            background: filter === f ? 'var(--primary)' : 'var(--card)',
            color: filter === f ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 13, fontWeight: filter === f ? 600 : 400, cursor: 'pointer',
            transition: 'background .15s, color .15s',
          }}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--muted-foreground)', alignSelf: 'center' }}>
          {visible.length} из {MEDIA.length}
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {visible.map(m => (
          <div key={m.id}
            style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'box-shadow .15s, border-color .15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            {/* Thumbnail */}
            <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
              {SCENES[m.id]}

              {/* Video overlay — play button + duration */}
              {m.type === 'video' && (
                <>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="play" size={18} style={{ color: '#fff', marginLeft: 3 }} />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 7px', borderRadius: 4 }}>
                    {m.duration}
                  </div>
                </>
              )}

              {/* Status badge */}
              {m.crit && (
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <span style={{ background: 'var(--status-crit)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4 }}>Дефект</span>
                </div>
              )}
              {m.warn && (
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <span style={{ background: 'var(--status-warn)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4 }}>Внимание</span>
                </div>
              )}

              {/* Format badge */}
              <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.75)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-mono)' }}>
                  {m.type === 'video' ? 'MP4' : 'JPG'}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div style={{ padding: '10px 14px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{m.date} · {m.author}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{m.size}</span>
                <IconBtn style={{ width: 26, height: 26 }} title="Скачать">
                  <Icon name="download" size={13} />
                </IconBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.MediaPage = MediaPage;
