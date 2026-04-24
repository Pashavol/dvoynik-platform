// ContractorsPage.jsx

const CONTRACTORS = [
  {
    id: 'su17',  name: 'СУ-17',
    specialty: 'Монтаж нефтегазового оборудования',
    projectIds: ['elou-6', 'kstovo', 'vankor'],
    status: 'active',  contact: 'Журавлёв А.П.',  phone: '+7 (843) 123-45-67', email: 'zhuravlev@su17.ru',
    since: 'Янв 2024', contracts: 3, volume: '4,2 млрд ₽',
    docs: [
      { type: 'PDF', name: 'Договор №24-СМР-01', date: '15.01.2024', size: '1,2 МБ' },
      { type: 'PDF', name: 'Лицензия СРО',        date: '01.11.2023', size: '0,4 МБ' },
      { type: 'PDF', name: 'Страховой полис',      date: '01.01.2025', size: '0,3 МБ' },
    ],
  },
  {
    id: 'pkb3', name: 'ПКБ-3',
    specialty: 'Проектирование и BIM-моделирование',
    projectIds: ['elou-6', 'gpz-2'],
    status: 'active', contact: 'Соколова И.В.', phone: '+7 (495) 234-56-78', email: 'sokolova@pkb3.ru',
    since: 'Мар 2023', contracts: 5, volume: '2,8 млрд ₽',
    docs: [
      { type: 'PDF', name: 'Договор №23-ПКД-04', date: '01.03.2023', size: '2,1 МБ' },
      { type: 'DWG', name: 'Регламент BIM',       date: '15.04.2023', size: '4,3 МБ' },
    ],
  },
  {
    id: 'bim', name: 'BIM-отдел',
    specialty: 'Разработка цифровых моделей IFC',
    projectIds: ['elou-6', 'ust-luga', 'vankor', 'astra'],
    status: 'active', contact: 'Кузнецов Р.Д.', phone: '+7 (812) 345-67-89', email: 'kuznetsov@bim.ru',
    since: 'Июн 2023', contracts: 8, volume: '1,1 млрд ₽',
    docs: [
      { type: 'PDF', name: 'Регламент ведения модели', date: '20.06.2023', size: '0,9 МБ' },
    ],
  },
  {
    id: 'otk', name: 'ОТК',
    specialty: 'Технический надзор и контроль качества',
    projectIds: ['elou-6', 'kstovo', 'ust-luga', 'gpz-2', 'vankor'],
    status: 'active', contact: 'Миронова С.К.', phone: '+7 (343) 456-78-90', email: 'mironova@otk.ru',
    since: 'Янв 2022', contracts: 12, volume: '0,8 млрд ₽',
    docs: [
      { type: 'PDF', name: 'Программа входного контроля', date: '10.01.2022', size: '1,5 МБ' },
      { type: 'PDF', name: 'Журнал несоответствий Q1',   date: '15.04.2025', size: '2,2 МБ' },
    ],
  },
  {
    id: 'sup12', name: 'СУП-12',
    specialty: 'Строительно-монтажные работы',
    projectIds: ['astra'],
    status: 'inactive', contact: 'Лебедев В.О.', phone: '+7 (863) 567-89-01', email: 'lebedev@sup12.ru',
    since: 'Апр 2025', contracts: 1, volume: '5,3 млрд ₽',
    docs: [
      { type: 'PDF', name: 'Договор №25-СМР-01', date: '01.04.2025', size: '1,8 МБ' },
    ],
  },
];

window.CONTRACTORS = CONTRACTORS;

// ─── List ─────────────────────────────────────────────────────────────────────
const ContractorList = ({ contractors, onSelect }) => (
  <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Подрядчики</div>
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>{contractors.length} организаций</div>
      </div>
      <Button variant="primary" size="sm"><Icon name="plus" size={14} />Добавить</Button>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {['Организация', 'Специализация', 'Проекты', 'Объём работ', 'Договоры', 'Статус'].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted-foreground)', fontWeight: 500, fontSize: 12, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {contractors.map(c => (
          <tr key={c.id} onClick={() => onSelect(c.id)}
            style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <td style={{ padding: '12px' }}>
              <div style={{ fontWeight: 500 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{c.contact}</div>
            </td>
            <td style={{ padding: '12px', color: 'var(--muted-foreground)', fontSize: 13 }}>{c.specialty}</td>
            <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{c.projectIds.length}</td>
            <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{c.volume}</td>
            <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{c.contracts}</td>
            <td style={{ padding: '12px' }}>
              <Badge variant={c.status === 'active' ? 'ok' : 'inactive'} uppercase>
                <StatusDot kind={c.status === 'active' ? 'ok' : 'inactive'} />
                {c.status === 'active' ? 'Активен' : 'Завершён'}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
const ContractorCard = ({ contractor: c }) => {
  const [tab, setTab] = React.useState('profile');
  const projects = (window.PROJECTS || []).filter(p => c.projectIds.includes(p.id));

  const TABS = [
    { key: 'profile',  label: 'Профиль' },
    { key: 'projects', label: 'Проекты (' + c.projectIds.length + ')' },
    { key: 'docs',     label: 'Документы (' + c.docs.length + ')' },
  ];

  const tabBtnStyle = (key) => ({
    padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: tab === key ? 600 : 400,
    color: tab === key ? 'var(--foreground)' : 'var(--muted-foreground)',
    borderBottom: tab === key ? '2px solid var(--primary)' : '2px solid transparent',
    marginBottom: -1,
  });

  const docBadge = (type) => {
    if (type === 'PDF') return { background: 'color-mix(in oklch, var(--status-crit) 12%, transparent)', color: 'var(--status-crit)' };
    if (type === 'DWG') return { background: 'color-mix(in oklch, var(--brand) 12%, transparent)', color: 'var(--brand)' };
    return { background: 'var(--muted)', color: 'var(--muted-foreground)' };
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 'var(--radius)', background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--primary)', flexShrink: 0,
        }}>
          {c.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>{c.name}</div>
          <div style={{ color: 'var(--muted-foreground)', fontSize: 14, marginTop: 2 }}>{c.specialty}</div>
          <div style={{ marginTop: 8 }}>
            <Badge variant={c.status === 'active' ? 'ok' : 'inactive'} uppercase>
              <StatusDot kind={c.status === 'active' ? 'ok' : 'inactive'} />
              {c.status === 'active' ? 'Активен' : 'Завершён'}
            </Badge>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexShrink: 0, alignItems: 'center' }}>
          {[['Проекты', c.projectIds.length], ['Договоры', c.contracts], ['Объём', c.volume]].map(([label, val], i, arr) => (
            <React.Fragment key={label}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>{val}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>{label}</div>
              </div>
              {i < arr.length - 1 && <div style={{ width: 1, height: 36, background: 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
        {TABS.map(t => <button key={t.key} onClick={() => setTab(t.key)} style={tabBtnStyle(t.key)}>{t.label}</button>)}
      </div>

      {/* Профиль */}
      {tab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 760 }}>
          {[
            { title: 'Контакт', rows: [['Ответственный', c.contact], ['Телефон', c.phone], ['Email', c.email], ['Работаем с', c.since]] },
            { title: 'Сводка',  rows: [['Проекты', c.projectIds.length], ['Договоры', c.contracts], ['Общий объём', c.volume], ['Специализация', c.specialty]] },
          ].map(({ title, rows }) => (
            <div key={title} style={{ padding: 20, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 14 }}>{title}</div>
              {rows.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13, gap: 12 }}>
                  <span style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}>{k}</span>
                  <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Проекты */}
      {tab === 'projects' && (
        <div style={{ maxWidth: 760 }}>
          {projects.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 8, background: 'var(--card)' }}>
              <StatusDot kind={p.status} size={10} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{p.client} · {p.region}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-foreground)' }}>{p.progress}%</span>
              <Badge variant={p.status} uppercase>
                {p.status === 'ok' ? 'Активен' : p.status === 'warn' ? 'Внимание' : p.status === 'crit' ? 'Проблема' : 'Завершён'}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Документы */}
      {tab === 'docs' && (
        <div style={{ maxWidth: 760 }}>
          {c.docs.map((doc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 8, background: 'var(--card)' }}>
              <span style={{ ...docBadge(doc.type), fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 6px', borderRadius: 4, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{doc.type}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{doc.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{doc.date} · {doc.size}</div>
              </div>
              <IconBtn style={{ width: 28, height: 28 }}><Icon name="download" size={14} /></IconBtn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Router ───────────────────────────────────────────────────────────────────
const ContractorsPage = ({ contractorId, onSelect }) => {
  if (contractorId) {
    const c = CONTRACTORS.find(x => x.id === contractorId);
    if (!c) return null;
    return <ContractorCard contractor={c} />;
  }
  return <ContractorList contractors={CONTRACTORS} onSelect={onSelect} />;
};

window.ContractorsPage = ContractorsPage;
