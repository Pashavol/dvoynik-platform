// BrigadesPage.jsx — Бригады на объекте
const { useState: useBrigState } = React;

const BRIGADES = [
  {
    id: 'br-1',
    name: 'Бригада монтажа №1',
    contractor: 'СУ-17', contractorId: 'su17',
    specialty: 'Монтаж технологических трубопроводов',
    status: 'active',
    startDate: '10.03.2026', endDate: '30.06.2026',
    zone: 'Блок Б · Уровень +12',
    foreman: { id: 'f1', name: 'Захаров Николай А.', initials: 'НЗ', hue: '200', phone: '+7 (843) 456-78-90' },
    workers: [
      { id: 'w1', name: 'Борисов Сергей Д.',  initials: 'СБ', hue: '170', role: 'Сварщик',   camera: true,  camId: 'CAM-W1' },
      { id: 'w2', name: 'Фёдоров Антон Л.',   initials: 'АФ', hue: '220', role: 'Монтажник', camera: true,  camId: 'CAM-W2' },
      { id: 'w3', name: 'Малинин Виктор Г.',  initials: 'ВМ', hue: '40',  role: 'Слесарь',   camera: false },
      { id: 'w4', name: 'Тарасов Олег В.',    initials: 'ОТ', hue: '290', role: 'Монтажник', camera: false },
    ],
  },
  {
    id: 'br-2',
    name: 'Бригада электромонтажа №3',
    contractor: 'ЭлектроМонтаж', contractorId: null,
    specialty: 'Кабельные работы и электроснабжение',
    status: 'active',
    startDate: '15.03.2026', endDate: '15.05.2026',
    zone: 'Блок А · Электрощитовая',
    foreman: { id: 'f2', name: 'Орлов Виктор С.', initials: 'ВО', hue: '30', phone: '+7 (843) 567-89-01' },
    workers: [
      { id: 'w5', name: 'Смирнов Павел Н.', initials: 'ПС', hue: '300', role: 'Электромонтажник', camera: true, camId: 'CAM-W3' },
      { id: 'w6', name: 'Козлов Михаил А.', initials: 'МК', hue: '250', role: 'Кабельщик',        camera: false },
    ],
  },
  {
    id: 'br-3',
    name: 'Бригада КИПиА №2',
    contractor: 'ПСК-Автоматика', contractorId: null,
    specialty: 'КИП и автоматизация',
    status: 'upcoming',
    startDate: '01.06.2026', endDate: '30.08.2026',
    zone: 'ЦПУ · Блок управления',
    foreman: { id: 'f3', name: 'Новиков Дмитрий К.', initials: 'ДН', hue: '120', phone: '+7 (495) 678-90-12' },
    workers: [
      { id: 'w7', name: 'Алексеев Игорь В.',  initials: 'АИ', hue: '140', role: 'Приборист',        camera: false },
      { id: 'w8', name: 'Степанов Роман Б.',   initials: 'СР', hue: '180', role: 'Электромонтажник', camera: false },
      { id: 'w9', name: 'Ершов Константин Д.', initials: 'ЕК', hue: '90',  role: 'Наладчик',         camera: false },
    ],
  },
  {
    id: 'br-4',
    name: 'Бригада изоляции №1',
    contractor: 'ИзолПром', contractorId: null,
    specialty: 'Тепловая изоляция трубопроводов',
    status: 'upcoming',
    startDate: '15.05.2026', endDate: '30.07.2026',
    zone: 'Блок Б · Технологические линии',
    foreman: { id: 'f4', name: 'Волков Алексей Т.', initials: 'АВ', hue: '350', phone: '+7 (843) 789-01-23' },
    workers: [
      { id: 'w10', name: 'Пономарёв Сергей И.', initials: 'ПС', hue: '10',  role: 'Изолировщик', camera: false },
      { id: 'w11', name: 'Никитин Павел Р.',     initials: 'НП', hue: '50',  role: 'Изолировщик', camera: false },
      { id: 'w12', name: 'Громов Алексей В.',    initials: 'ГА', hue: '70',  role: 'Изолировщик', camera: false },
      { id: 'w13', name: 'Макаров Денис Д.',     initials: 'МД', hue: '100', role: 'Изолировщик', camera: false },
    ],
  },
  {
    id: 'br-5',
    name: 'Бригада сварки №2',
    contractor: 'СУ-17', contractorId: 'su17',
    specialty: 'Сварка трубопроводов высокого давления',
    status: 'active',
    startDate: '01.04.2026', endDate: '31.07.2026',
    zone: 'Блок В · Уровень +6',
    foreman: { id: 'f5', name: 'Рыбаков Игорь Н.', initials: 'ИР', hue: '15', phone: '+7 (843) 234-56-78' },
    workers: [
      { id: 'w14', name: 'Карпов Василий Д.',   initials: 'ВК', hue: '0',   role: 'Сварщик 6р', camera: true, camId: 'CAM-W1' },
      { id: 'w15', name: 'Мельников Руслан О.', initials: 'МР', hue: '350', role: 'Сварщик 5р', camera: false },
      { id: 'w16', name: 'Яковлев Пётр С.',     initials: 'ЯП', hue: '330', role: 'Резчик',     camera: false },
      { id: 'w17', name: 'Суворов Андрей В.',   initials: 'СА', hue: '310', role: 'Трубогибщик', camera: false },
      { id: 'w18', name: 'Ларин Денис К.',      initials: 'ЛД', hue: '25',  role: 'Подсобный',  camera: false },
    ],
  },
  {
    id: 'br-6',
    name: 'Бригада монтажа конструкций',
    contractor: 'СУП-12', contractorId: 'sup12',
    specialty: 'Металлоконструкции и опорные фермы',
    status: 'active',
    startDate: '20.03.2026', endDate: '20.08.2026',
    zone: 'Блок А · Основание',
    foreman: { id: 'f6', name: 'Лебедев Виктор О.', initials: 'ВЛ', hue: '240', phone: '+7 (863) 567-89-02' },
    workers: [
      { id: 'w19', name: 'Зайцев Николай И.',   initials: 'ЗН', hue: '260', role: 'Монтажник',   camera: true, camId: 'CAM-W2' },
      { id: 'w20', name: 'Беляев Алексей С.',   initials: 'БА', hue: '245', role: 'Монтажник',   camera: false },
      { id: 'w21', name: 'Крылов Максим Г.',    initials: 'КМ', hue: '225', role: 'Стропальщик', camera: false },
      { id: 'w22', name: 'Гусев Дмитрий А.',    initials: 'ГД', hue: '210', role: 'Сварщик',     camera: false },
    ],
  },
  {
    id: 'br-7',
    name: 'Группа технадзора ОТК',
    contractor: 'ОТК', contractorId: 'otk',
    specialty: 'Входной и операционный контроль качества',
    status: 'active',
    startDate: '01.03.2026', endDate: '31.12.2026',
    zone: 'Весь объект',
    foreman: { id: 'f7', name: 'Миронова Светлана К.', initials: 'СМ', hue: '30', phone: '+7 (343) 456-78-90' },
    workers: [
      { id: 'w23', name: 'Романов Кирилл В.',   initials: 'РК', hue: '50',  role: 'Инспектор ОТК', camera: true, camId: 'CAM-W3' },
      { id: 'w24', name: 'Белова Наталья С.',    initials: 'БН', hue: '60',  role: 'Инспектор ОТК', camera: false },
      { id: 'w25', name: 'Соловьёв Игорь А.',   initials: 'СИ', hue: '40',  role: 'Лаборант',      camera: false },
    ],
  },
  {
    id: 'br-8',
    name: 'Бригада испытаний трубопроводов',
    contractor: 'СУ-17', contractorId: 'su17',
    specialty: 'Гидравлические испытания и промывка',
    status: 'upcoming',
    startDate: '01.08.2026', endDate: '30.09.2026',
    zone: 'Блок Б · Технологические линии',
    foreman: { id: 'f8', name: 'Прохоров Вадим Л.', initials: 'ВП', hue: '195', phone: '+7 (843) 345-67-89' },
    workers: [
      { id: 'w26', name: 'Тихонов Андрей М.',  initials: 'ТА', hue: '185', role: 'Слесарь-испытатель', camera: false },
      { id: 'w27', name: 'Власов Сергей В.',   initials: 'ВС', hue: '175', role: 'Слесарь-испытатель', camera: false },
      { id: 'w28', name: 'Носов Павел Р.',     initials: 'НП', hue: '165', role: 'Оператор насосной',  camera: false },
    ],
  },
  {
    id: 'br-9',
    name: 'Бригада фундаментных работ',
    contractor: 'СУП-12', contractorId: 'sup12',
    specialty: 'Устройство свайных оснований',
    status: 'upcoming',
    startDate: '10.06.2026', endDate: '10.09.2026',
    zone: 'Блок Г · Свайное поле',
    foreman: { id: 'f9', name: 'Громов Алексей И.', initials: 'ГА', hue: '270', phone: '+7 (863) 678-90-12' },
    workers: [
      { id: 'w29', name: 'Орехов Иван Д.',    initials: 'ОИ', hue: '285', role: 'Бурильщик',  camera: false },
      { id: 'w30', name: 'Сергеев Павел Н.', initials: 'СП', hue: '255', role: 'Бетонщик',    camera: false },
      { id: 'w31', name: 'Морозов Вадим К.', initials: 'МВ', hue: '235', role: 'Арматурщик',  camera: false },
      { id: 'w32', name: 'Фролов Дмитрий О.',initials: 'ФД', hue: '275', role: 'Машинист',    camera: false },
    ],
  },
];

// ── Body camera SVG scenes (POV, industrial construction) ─────────────────────
const BodyCamScene = ({ camId }) => {
  const sp = { viewBox: '0 0 480 270', width: '100%', height: '100%', style: { display: 'block' }, preserveAspectRatio: 'xMidYMid slice' };

  if (camId === 'CAM-W1') return (
    // Welder POV: pipe joint being welded at +12m platform
    <svg {...sp}>
      <defs>
        <radialGradient id="bw1bg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1a2530"/><stop offset="100%" stopColor="#0c1118"/>
        </radialGradient>
        <radialGradient id="bw1weld" cx="50%" cy="60%" r="30%">
          <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.9"/><stop offset="60%" stopColor="#ff4500" stopOpacity="0.3"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="480" height="270" fill="url(#bw1bg)"/>
      {/* Floor grating */}
      {[0,16,32,48,64,80,96,112,128,144,160,176,192,208,224,240,256,272,288,304,320,336,352,368,384,400,416,432,448,464,480].map(x =>
        <line key={'fg'+x} x1={x} y1="200" x2={x-30} y2="270" stroke="#243040" strokeWidth="1" opacity="0.5"/>
      )}
      {[200,215,230,245,260].map(y =>
        <line key={'fh'+y} x1="0" y1={y} x2="480" y2={y} stroke="#243040" strokeWidth="1" opacity="0.4"/>
      )}
      {/* Main pipe horizontal */}
      <rect x="60" y="130" width="360" height="48" fill="#2a3d4e" rx="3"/>
      <rect x="60" y="130" width="360" height="8"  fill="#344c5e" rx="3"/>
      <ellipse cx="60"  cy="154" rx="14" ry="24" fill="#243040"/>
      <ellipse cx="420" cy="154" rx="14" ry="24" fill="#243040"/>
      {/* Flanges at joint */}
      <rect x="212" y="122" width="24" height="64" fill="#3a5060" rx="2"/>
      <rect x="244" y="122" width="24" height="64" fill="#3a5060" rx="2"/>
      {/* Weld glow */}
      <rect x="231" y="130" width="18" height="48" fill="url(#bw1weld)"/>
      <line x1="240" y1="122" x2="240" y2="270" stroke="#ff6000" strokeWidth="1.5" opacity="0.15"/>
      {/* Sparks */}
      {[[238,125],[245,118],[252,128],[234,132],[243,110],[256,120],[230,115]].map(([x,y],i) =>
        <circle key={i} cx={x} cy={y} r={1.2+(i%3)*0.6} fill="#ffcc00" opacity={0.5+i*0.07}/>
      )}
      {/* Support structure */}
      <rect x="180" y="30" width="6" height="100" fill="#304050"/>
      <rect x="294" y="30" width="6" height="100" fill="#304050"/>
      <rect x="178" y="30" width="124" height="5" fill="#304050"/>
      {/* Handrail */}
      <line x1="100" y1="100" x2="380" y2="100" stroke="#3a5060" strokeWidth="3"/>
      <line x1="140" y1="100" x2="140" y2="200" stroke="#3a5060" strokeWidth="2"/>
      <line x1="240" y1="100" x2="240" y2="200" stroke="#3a5060" strokeWidth="2"/>
      <line x1="340" y1="100" x2="340" y2="200" stroke="#3a5060" strokeWidth="2"/>
      {/* Gloves in foreground (bottom) */}
      <path d="M 140 260 Q 160 240 175 245 Q 185 248 192 260 L 195 270 L 130 270 Z" fill="#1e2a36"/>
      <path d="M 300 260 Q 315 238 332 243 Q 344 247 348 260 L 355 270 L 288 270 Z" fill="#1e2a36"/>
      {/* Welding shield edge hint */}
      <rect x="0" y="0" width="480" height="270" fill="none" stroke="#ffcc00" strokeWidth="2" opacity="0.06" rx="8"/>
      {/* Scanlines */}
      {Array.from({length:27}).map((_,i)=>
        <line key={i} x1="0" y1={i*10} x2="480" y2={i*10} stroke="#000" strokeWidth="1" opacity="0.07"/>
      )}
    </svg>
  );

  if (camId === 'CAM-W2') return (
    // Fitter POV: bolting flange connection at elevation
    <svg {...sp}>
      <defs>
        <linearGradient id="bw2bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e1820"/><stop offset="100%" stopColor="#18252e"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill="url(#bw2bg)"/>
      {/* Vertical pipe column */}
      <rect x="196" y="0" width="88" height="270" fill="#28404e" rx="2"/>
      <rect x="196" y="0" width="88" height="6"  fill="#344e5c"/>
      {/* Pipe insulation strips */}
      {[20,50,80,110,140,170,200,230].map(y =>
        <rect key={y} x="196" y={y} width="88" height="8" fill="#1e3040" opacity="0.6"/>
      )}
      {/* Large flange */}
      <ellipse cx="240" cy="130" rx="60" ry="18" fill="#3a5560" stroke="#4a6878" strokeWidth="1.5"/>
      <ellipse cx="240" cy="130" rx="44" ry="13" fill="#28404e"/>
      {/* Bolts around flange */}
      {[0,45,90,135,180,225,270,315].map((deg,i) => {
        const rad = deg * Math.PI / 180;
        const bx = 240 + Math.cos(rad) * 54;
        const by = 130 + Math.sin(rad) * 16;
        return <circle key={i} cx={bx} cy={by} r="4" fill="#4a6070" stroke="#3a5060" strokeWidth="1"/>;
      })}
      {/* Wrench in hand (right foreground) */}
      <path d="M 330 210 L 360 160 L 368 165 L 340 215 Z" fill="#2a3840"/>
      <ellipse cx="362" cy="158" rx="12" ry="8" fill="#3a5060" transform="rotate(-20,362,158)"/>
      <path d="M 356 152 L 368 164 L 360 168 Z" fill="#2a3840"/>
      {/* Safety gloves left hand */}
      <path d="M 110 200 Q 130 180 155 190 Q 168 195 170 210 L 160 270 L 100 270 Z" fill="#1e2a36"/>
      {/* Pipe to right */}
      <rect x="284" y="122" width="196" height="16" fill="#28404e" rx="2"/>
      {/* Tag on pipe */}
      <rect x="340" y="116" width="50" height="14" fill="rgba(0,0,0,0.7)" rx="2"/>
      <text x="365" y="126" textAnchor="middle" fontSize="8" fill="rgba(180,220,240,0.9)" fontFamily="monospace">P-2340-A</text>
      {/* Scanlines */}
      {Array.from({length:27}).map((_,i)=>
        <line key={i} x1="0" y1={i*10} x2="480" y2={i*10} stroke="#000" strokeWidth="1" opacity="0.07"/>
      )}
    </svg>
  );

  if (camId === 'CAM-W3') return (
    // Electrician POV: cable tray routing in electrical room
    <svg {...sp}>
      <defs>
        <linearGradient id="bw3bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101820"/><stop offset="100%" stopColor="#1a2830"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill="url(#bw3bg)"/>
      {/* Wall panels */}
      <rect x="0"   y="0" width="180" height="270" fill="#162030" stroke="#1e2e3e" strokeWidth="1"/>
      <rect x="300" y="0" width="180" height="270" fill="#162030" stroke="#1e2e3e" strokeWidth="1"/>
      {/* Ceiling cable trays */}
      <rect x="0"   y="18" width="480" height="12" fill="#243040"/>
      <rect x="0"   y="42" width="480" height="12" fill="#243040"/>
      <rect x="0"   y="66" width="480" height="12" fill="#243040"/>
      {/* Cable tray dividers */}
      {[40,80,120,160,200,240,280,320,360,400,440].map(x =>
        <line key={x} x1={x} y1="18" x2={x} y2="30" stroke="#1a2830" strokeWidth="1"/>
      )}
      {/* Cables in trays - colored */}
      {[
        {y:20, color:'#3a6090'},
        {y:22, color:'#3a8050'},
        {y:24, color:'#904040'},
        {y:44, color:'#606090'},
        {y:46, color:'#405070'},
        {y:68, color:'#3a6090'},
      ].map((c,i) =>
        <line key={i} x1="0" y1={c.y} x2="480" y2={c.y} stroke={c.color} strokeWidth="2" opacity="0.8"/>
      )}
      {/* Cable conduit descending */}
      <rect x="320" y="78" width="14" height="192" fill="#24303e"/>
      <rect x="340" y="78" width="14" height="192" fill="#24303e"/>
      <rect x="360" y="78" width="14" height="192" fill="#24303e"/>
      {/* Electrical panel on right wall */}
      <rect x="350" y="90" width="110" height="150" fill="#1a2838" stroke="#2a3848" strokeWidth="1.5"/>
      <rect x="358" y="98" width="94" height="62" fill="#0e1820"/>
      {[106,116,126,136,146].map(y =>
        <React.Fragment key={y}>
          <rect x="362" y={y} width="32" height="7" fill="#2a4060" rx="1"/>
          <rect x="400" y={y} width="32" height="7" fill="#2a4060" rx="1"/>
          <circle cx="438" cy={y+3.5} r="4" fill="#1e3040" stroke="#3a5060" strokeWidth="1"/>
        </React.Fragment>
      )}
      {/* Flashlight cone (worker's headlamp) */}
      <path d="M 200 0 L 180 270 L 300 270 L 280 0 Z" fill="rgba(220,230,255,0.04)"/>
      <ellipse cx="240" cy="10" rx="50" ry="6" fill="rgba(220,230,255,0.08)"/>
      {/* Work gloves at bottom */}
      <path d="M 80 250 Q 110 230 140 240 Q 155 245 158 260 L 148 270 L 60 270 Z" fill="#1e2a36"/>
      <path d="M 340 248 Q 368 228 395 238 Q 410 243 412 258 L 400 270 L 322 270 Z" fill="#1e2a36"/>
      {/* Screwdriver in right hand */}
      <line x1="395" y1="240" x2="440" y2="180" stroke="#3a4a5a" strokeWidth="5"/>
      <circle cx="440" cy="178" r="8" fill="#4a6070"/>
      {/* Scanlines */}
      {Array.from({length:27}).map((_,i)=>
        <line key={i} x1="0" y1={i*10} x2="480" y2={i*10} stroke="#000" strokeWidth="1" opacity="0.07"/>
      )}
    </svg>
  );

  return (
    <svg {...sp}>
      <rect width="480" height="270" fill="#0c1218"/>
      <text x="240" y="140" textAnchor="middle" fontSize="14" fill="rgba(120,160,200,0.5)" fontFamily="monospace">Нет сигнала</text>
    </svg>
  );
};

// ─── ВИДЕОФАЙЛЫ НАТЕЛЬНЫХ КАМЕР ──────────────────────────────────────────────
// Ключ — camId рабочего (см. BRIGADES выше).
// Положите файлы в папку: project/ui_kits/platform/media/
// Пример: src: 'media/bodycam-w1.mp4',  poster: 'media/bodycam-w1.jpg'
// Если src пуст — отображается встроенная SVG-заглушка.
// ─────────────────────────────────────────────────────────────────────────────
const BODYCAM_SOURCES = {
  'CAM-W1': { src: 'media/body-1.mp4', poster: '' },
  'CAM-W2': { src: 'media/body-2.mp4', poster: '' },
  'CAM-W3': { src: 'media/body-3.mp4', poster: '' },
};

const BodyCamFeed = ({ camId }) => {
  const source = BODYCAM_SOURCES[camId] || {};
  const fill = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
  if (source.src) {
    return (
      <video
        key={source.src}
        src={source.src}
        poster={source.poster || undefined}
        autoPlay loop muted playsInline
        style={fill}
      />
    );
  }
  return <BodyCamScene camId={camId} />;
};

// ── Tiny inline camera thumbnail ─────────────────────────────────────────────
const CamThumb = ({ worker, onClick }) => (
  <button
    onClick={onClick}
    title={'Камера · ' + worker.name}
    style={{
      position: 'relative', width: 80, height: 50, border: '1px solid var(--border)',
      borderRadius: 6, overflow: 'hidden', cursor: 'pointer', padding: 0, flexShrink: 0,
      transition: 'border-color .15s, box-shadow .15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 2px color-mix(in oklch, var(--primary) 30%, transparent)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <BodyCamFeed camId={worker.camId} />
    {/* REC indicator */}
    <div style={{ position: 'absolute', top: 4, right: 5, display: 'flex', alignItems: 'center', gap: 3 }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'blink 1.2s infinite' }}/>
    </div>
    {/* Play overlay */}
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0)', transition: 'background .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.35)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
    >
      <span style={{ color: 'rgba(255,255,255,0.8)', display: 'flex' }}><Icon name="play" size={14} /></span>
    </div>
  </button>
);

// ── Full camera modal ─────────────────────────────────────────────────────────
const BodyCamModal = ({ worker, onClose }) => {
  const [ts, setTs] = React.useState('');
  React.useEffect(() => {
    const tick = () => setTs(new Date().toLocaleTimeString('ru-RU'));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 720, maxWidth: '90vw', background: '#0c1218',
          borderRadius: 12, border: '1px solid var(--border)',
          overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}/>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(180,210,240,0.9)', fontWeight: 600 }}>{worker.camId}</span>
            <span style={{ fontSize: 12, color: 'rgba(140,170,200,0.7)' }}>·</span>
            <span style={{ fontSize: 13, color: 'rgba(200,220,240,0.85)' }}>{worker.name}</span>
            <Badge variant="ok" uppercase><StatusDot kind="ok" />{worker.role}</Badge>
          </div>
          <IconBtn onClick={onClose} style={{ width: 28, height: 28, color: 'rgba(140,170,200,0.7)' }}>
            <Icon name="x" size={14} />
          </IconBtn>
        </div>

        {/* Video feed */}
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#080e14' }}>
          <BodyCamFeed camId={worker.camId} />
          {/* Top HUD */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            padding: '10px 14px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(180,210,240,0.9)' }}>
              <span style={{ opacity: 0.6 }}>КАМЕРА</span>&nbsp;&nbsp;{worker.camId}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }}/>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444', fontWeight: 600 }}>REC</span>
            </div>
          </div>
          {/* Bottom HUD */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            padding: '10px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(160,200,240,0.8)' }}>{worker.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(120,160,200,0.6)', marginTop: 2 }}>{worker.role}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(160,200,240,0.8)' }}>{ts}</div>
          </div>
          {/* Corner reticle */}
          {[{t:12,l:12,r:'',b:'',bt:'8px solid transparent',bl:'8px solid transparent',bb:'none',br:'none'},{t:12,l:'',r:12,b:'',bt:'8px solid transparent',bl:'none',bb:'none',br:'8px solid transparent'},{t:'',l:12,r:'',b:12,bt:'none',bl:'8px solid transparent',bb:'8px solid transparent',br:'none'},{t:'',l:'',r:12,b:12,bt:'none',bl:'none',bb:'8px solid transparent',br:'8px solid transparent'}].map((c,i)=>
            <div key={i} style={{ position:'absolute',top:c.t,left:c.l,right:c.r,bottom:c.b,width:14,height:14,borderTop:c.bt==='none'?'none':'1.5px solid rgba(100,200,255,0.4)',borderLeft:c.bl==='none'?'none':'1.5px solid rgba(100,200,255,0.4)',borderBottom:c.bb==='none'?'none':'1.5px solid rgba(100,200,255,0.4)',borderRight:c.br==='none'?'none':'1.5px solid rgba(100,200,255,0.4)'}}/>
          )}
        </div>

        {/* Footer controls */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <IconBtn style={{ width: 30, height: 30 }} title="Пауза"><Icon name="pause" size={14} /></IconBtn>
          <IconBtn style={{ width: 30, height: 30 }} title="Снимок экрана"><Icon name="camera" size={14} /></IconBtn>
          <IconBtn style={{ width: 30, height: 30 }} title="Полный экран"><Icon name="maximize-2" size={14} /></IconBtn>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(120,160,200,0.5)' }}>1920×1080 · H.264</span>
        </div>
      </div>
    </div>
  );
};

// ── Worker profile modal ──────────────────────────────────────────────────────
const WorkerProfileModal = ({ worker, brigade, isForeman, onClose }) => {
  const avatarColor = 'oklch(0.55 0.16 ' + worker.hue + ')';
  const avatarBg    = 'color-mix(in oklch, oklch(0.55 0.16 ' + worker.hue + ') 16%, var(--card))';
  const statusKind  = brigade.status === 'active' ? 'ok' : 'warn';
  const statusLabel = brigade.status === 'active' ? 'На объекте' : 'Предстоит';

  const events = [
    { kind: 'ok',   text: 'Закрыт наряд-допуск на производство работ',  time: 'Сегодня, 07:50' },
    { kind: 'ok',   text: 'Пройден инструктаж по охране труда',          time: 'Вчера, 08:10'   },
    { kind: 'warn', text: 'Зафиксировано замечание инспектора ОТК',      time: '22.04.2026'     },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 480, maxWidth: '90vw', background: 'var(--card)',
        borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)', overflow: 'hidden',
      }}>
        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, color-mix(in oklch, ' + avatarColor + ' 10%, var(--card)) 0%, var(--card) 65%)',
          padding: '20px 20px 18px', position: 'relative',
        }}>
          <IconBtn onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28 }}>
            <Icon name="x" size={14} />
          </IconBtn>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: avatarBg, color: avatarColor,
              fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, border: '2px solid ' + avatarColor,
              boxShadow: '0 0 0 3px var(--card), 0 0 0 5px ' + avatarColor,
            }}>{worker.initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{worker.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>
                {worker.role} · {brigade.contractor}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {isForeman && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '2px 8px', borderRadius: 999,
                    background: 'color-mix(in oklch, var(--primary) 14%, transparent)', color: 'var(--primary)',
                  }}>Бригадир</span>
                )}
                <Badge variant={statusKind} uppercase>
                  <StatusDot kind={statusKind} size={6} />{statusLabel}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { icon: 'hard-hat', label: 'Бригада',       value: brigade.name      },
            { icon: 'tool',     label: 'Специализация', value: brigade.specialty  },
            { icon: 'map-pin',  label: 'Зона работ',    value: brigade.zone       },
            { icon: 'calendar', label: 'Период',        value: brigade.startDate + ' — ' + brigade.endDate },
            ...(isForeman && worker.phone ? [{ icon: 'phone', label: 'Телефон', value: worker.phone }] : []),
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ color: 'var(--muted-foreground)', display: 'flex', flexShrink: 0 }}>
                <Icon name={row.icon} size={14} />
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)', width: 110, flexShrink: 0 }}>{row.label}</span>
              <span style={{ fontSize: 13, flex: 1 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Camera preview */}
        {worker.camera && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="video" size={12} />Нательная камера · {worker.camId}
            </div>
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative', aspectRatio: '16/9' }}>
              <BodyCamFeed camId={worker.camId} />
              <div style={{ position: 'absolute', top: 6, right: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }}/>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ef4444', fontWeight: 600 }}>REC</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent events */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 20px' }}>
          <div style={{ fontSize: 12, color: 'var(--muted-foreground)', fontWeight: 500, marginBottom: 10 }}>Последние события</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ marginTop: 4, flexShrink: 0 }}><StatusDot kind={e.kind} size={7} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5 }}>{e.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Worker row ────────────────────────────────────────────────────────────────
const WorkerRow = ({ worker, isForeman, onCamera, onWorkerClick }) => {
  const avatarColor = 'oklch(0.55 0.16 ' + worker.hue + ')';
  const avatarBg    = 'color-mix(in oklch, oklch(0.55 0.16 ' + worker.hue + ') 14%, var(--card))';

  return (
    <div
      onClick={onWorkerClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', cursor: 'pointer',
        background: isForeman ? 'color-mix(in oklch, var(--primary) 5%, transparent)' : 'transparent',
        borderRadius: 8,
        borderLeft: isForeman ? '2px solid var(--primary)' : '2px solid transparent',
        transition: 'background .12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = isForeman ? 'color-mix(in oklch, var(--primary) 10%, transparent)' : 'var(--accent)'}
      onMouseLeave={e => e.currentTarget.style.background = isForeman ? 'color-mix(in oklch, var(--primary) 5%, transparent)' : 'transparent'}
    >
      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: avatarBg, color: avatarColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-display)',
        flexShrink: 0, border: '1.5px solid ' + avatarColor,
      }}>
        {worker.initials}
      </div>

      {/* Name + role */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <span style={{
            fontSize: 13, fontWeight: isForeman ? 600 : 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{worker.name}</span>
          {isForeman && (
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '1px 6px', borderRadius: 999,
              background: 'color-mix(in oklch, var(--primary) 14%, transparent)',
              color: 'var(--primary)', flexShrink: 0,
            }}>Бригадир</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>{worker.role}</div>
      </div>

      {/* Camera button */}
      {worker.camera && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CamThumb worker={worker} onClick={e => { e.stopPropagation(); onCamera(worker); }} />
        </div>
      )}
    </div>
  );
};

// ── Brigade card ──────────────────────────────────────────────────────────────
const BrigadeCard = ({ brigade, onCamera, onWorkerClick }) => {
  const [expanded, setExpanded] = useBrigState(true);

  const statusLabel = { active: 'Работает', upcoming: 'Предстоит', completed: 'Завершена' }[brigade.status] || brigade.status;
  const statusKind  = { active: 'ok', upcoming: 'warn', completed: 'inactive' }[brigade.status] || 'ok';

  const cameraCount = brigade.workers.filter(w => w.camera).length;

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', overflow: 'hidden',
      transition: 'box-shadow .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Card header */}
      <div style={{ padding: '16px 20px', borderBottom: expanded ? '1px solid var(--border)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {brigade.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{brigade.contractor}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Badge variant={statusKind} uppercase>
              <StatusDot kind={statusKind} />{statusLabel}
            </Badge>
            <IconBtn
              onClick={() => setExpanded(v => !v)}
              style={{ width: 26, height: 26 }}
              title={expanded ? 'Свернуть' : 'Развернуть'}
            >
              <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={13} />
            </IconBtn>
          </div>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted-foreground)' }}>
            <Icon name="map-pin" size={11} />{brigade.zone}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted-foreground)' }}>
            <Icon name="calendar" size={11} />{brigade.startDate} — {brigade.endDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted-foreground)' }}>
            <Icon name="tool" size={11} />{brigade.specialty}
          </span>
        </div>

        {/* Counters */}
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[
            { icon: 'users', value: brigade.workers.length + 1, label: 'чел.' },
            { icon: 'video', value: cameraCount, label: 'камер' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: 'var(--muted-foreground)', display: 'flex' }}><Icon name={m.icon} size={12} /></span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 13 }}>{m.value}</span>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Workers list */}
      {expanded && (
        <div style={{ padding: '8px 8px 12px' }}>
          {/* Foreman */}
          <WorkerRow
            worker={{ ...brigade.foreman, role: 'Бригадир', camera: false }}
            isForeman={true}
            onCamera={onCamera}
            onWorkerClick={() => onWorkerClick({ ...brigade.foreman, role: 'Бригадир', camera: false }, true)}
          />
          {/* Divider */}
          <div style={{ margin: '4px 12px', borderTop: '1px solid var(--border)', opacity: 0.5 }}/>
          {/* Workers */}
          {brigade.workers.map(w => (
            <WorkerRow key={w.id} worker={w} isForeman={false} onCamera={onCamera}
              onWorkerClick={() => onWorkerClick(w, false)} />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const BrigadesPage = () => {
  const [filter,     setFilter]     = useBrigState('all');
  const [camWorker,  setCamWorker]  = useBrigState(null);
  const [profileCtx, setProfileCtx] = useBrigState(null);

  const filters = [
    { key: 'all',      label: 'Все' },
    { key: 'active',   label: 'Работают сейчас' },
    { key: 'upcoming', label: 'Предстоящие' },
  ];

  const filtered = BRIGADES.filter(b =>
    filter === 'all' || b.status === filter
  );

  const totalWorkers  = BRIGADES.reduce((s, b) => s + b.workers.length + 1, 0);
  const activeBrigades = BRIGADES.filter(b => b.status === 'active').length;
  const totalCams     = BRIGADES.reduce((s, b) => s + b.workers.filter(w => w.camera).length, 0);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Бригады</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>
            {activeBrigades} бригады работают · {BRIGADES.length - activeBrigades} предстоят · {totalWorkers} человек · {totalCams} нательных камер
          </div>
        </div>
        <Button variant="primary" size="sm"><Icon name="plus" size={14} />Добавить бригаду</Button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '5px 14px', border: '1px solid',
              borderColor: filter === f.key ? 'var(--primary)' : 'var(--border)',
              borderRadius: 999,
              background: filter === f.key ? 'color-mix(in oklch, var(--primary) 12%, transparent)' : 'transparent',
              color: filter === f.key ? 'var(--primary)' : 'var(--muted-foreground)',
              fontSize: 13, fontWeight: filter === f.key ? 600 : 400,
              cursor: 'pointer', transition: 'all .12s',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Brigade cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map(b => (
          <BrigadeCard key={b.id} brigade={b} onCamera={setCamWorker}
            onWorkerClick={(w, isForeman) => setProfileCtx({ worker: w, brigade: b, isForeman })} />
        ))}
      </div>

      {/* Camera modal */}
      {camWorker && <BodyCamModal worker={camWorker} onClose={() => setCamWorker(null)} />}

      {/* Worker profile modal */}
      {profileCtx && (
        <WorkerProfileModal
          worker={profileCtx.worker}
          brigade={profileCtx.brigade}
          isForeman={profileCtx.isForeman}
          onClose={() => setProfileCtx(null)}
        />
      )}

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
    </div>
  );
};

window.BrigadesPage = BrigadesPage;
window.BRIGADES = BRIGADES;
