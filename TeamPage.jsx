// TeamPage.jsx — project team cards

const TEAM = [
  {
    id: 1, name: 'Ковалёв Александр В.', initials: 'АК',
    role: 'pm',           roleLabel: 'Руководитель проекта',
    position: 'Директор проекта',       discipline: 'Управление',
    company: 'STRATUM',   phone: '+7 (495) 100-00-01', email: 'kovalev@stratum.ru',
    status: 'active',     since: 'Янв 2024',
    hue: '265',
  },
  {
    id: 2, name: 'Соколова Ирина В.', initials: 'ИС',
    role: 'engineer',     roleLabel: 'Главный инженер',
    position: 'Ведущий инженер-технолог', discipline: 'Технология',
    company: 'ПКБ-3',    phone: '+7 (495) 234-56-78', email: 'sokolova@pkb3.ru',
    status: 'active',     since: 'Мар 2023',
    hue: '160',
  },
  {
    id: 3, name: 'Петров Дмитрий К.', initials: 'ДП',
    role: 'bim',          roleLabel: 'BIM-менеджер',
    position: 'Специалист по цифровым моделям', discipline: 'BIM',
    company: 'BIM-отдел', phone: '+7 (812) 345-67-89', email: 'petrov@bim.ru',
    status: 'active',     since: 'Июн 2023',
    hue: '200',
  },
  {
    id: 4, name: 'Миронова Светлана К.', initials: 'СМ',
    role: 'qa',           roleLabel: 'Контроль качества',
    position: 'Инспектор ОТК',          discipline: 'Качество',
    company: 'ОТК',       phone: '+7 (343) 456-78-90', email: 'mironova@otk.ru',
    status: 'active',     since: 'Янв 2022',
    hue: '30',
  },
  {
    id: 5, name: 'Кузнецов Роман Д.', initials: 'РК',
    role: 'design',       roleLabel: 'Конструктор',
    position: 'Инженер-конструктор',    discipline: 'КМ',
    company: 'ПКБ-3',    phone: '+7 (495) 234-56-79', email: 'kuznetsov@pkb3.ru',
    status: 'active',     since: 'Май 2023',
    hue: '280',
  },
  {
    id: 6, name: 'Сидоров Василий П.', initials: 'ВС',
    role: 'tech',         roleLabel: 'Технолог',
    position: 'Технолог процесса',      discipline: 'Технология',
    company: 'СУ-17',     phone: '+7 (843) 123-45-68', email: 'sidorov@su17.ru',
    status: 'active',     since: 'Фев 2024',
    hue: '150',
  },
  {
    id: 7, name: 'Журавлёв Алексей П.', initials: 'АЖ',
    role: 'doc',          roleLabel: 'Документооборот',
    position: 'Специалист по документации', discipline: 'Администрация',
    company: 'СУ-17',     phone: '+7 (843) 123-45-69', email: 'zhuravlev@su17.ru',
    status: 'vacation',   since: 'Апр 2024',
    hue: '70',
  },
  {
    id: 8, name: 'Иванов Андрей В.', initials: 'АИ',
    role: 'safety',       roleLabel: 'Охрана труда',
    position: 'Инженер по ОТ и ПБ',    discipline: 'Безопасность',
    company: 'STRATUM',   phone: '+7 (495) 100-00-08', email: 'ivanov@stratum.ru',
    status: 'active',     since: 'Янв 2024',
    hue: '0',
  },
];

const ROLE_COLORS = {
  pm:      { bg: 'color-mix(in oklch, oklch(0.55 0.18 265) 14%, transparent)', color: 'oklch(0.45 0.18 265)' },
  engineer:{ bg: 'color-mix(in oklch, var(--status-ok) 14%, transparent)',     color: 'var(--status-ok)' },
  bim:     { bg: 'color-mix(in oklch, oklch(0.55 0.16 200) 14%, transparent)', color: 'oklch(0.45 0.16 200)' },
  qa:      { bg: 'color-mix(in oklch, var(--status-warn) 18%, transparent)',   color: 'oklch(0.45 0.15 70)' },
  design:  { bg: 'color-mix(in oklch, oklch(0.55 0.18 280) 14%, transparent)', color: 'oklch(0.45 0.18 280)' },
  tech:    { bg: 'color-mix(in oklch, var(--status-ok) 14%, transparent)',     color: 'var(--status-ok)' },
  doc:     { bg: 'color-mix(in oklch, oklch(0.65 0.14 70) 14%, transparent)',  color: 'oklch(0.50 0.14 70)' },
  safety:  { bg: 'color-mix(in oklch, var(--status-crit) 12%, transparent)',   color: 'var(--status-crit)' },
};

const STATUS_LABEL = { active: 'Активен', vacation: 'Отпуск', away: 'Командировка' };
const STATUS_KIND  = { active: 'ok', vacation: 'warn', away: 'info' };

const TeamMemberModal = ({ member, onClose }) => {
  const roleStyle  = ROLE_COLORS[member.role] || ROLE_COLORS.doc;
  const avatarColor = 'oklch(0.50 0.18 ' + member.hue + ')';
  const avatarBg    = 'color-mix(in oklch, oklch(0.50 0.18 ' + member.hue + ') 16%, var(--card))';

  const events = [
    { kind: 'ok',   text: 'Согласован раздел спецификации оборудования', time: 'Сегодня, 10:22' },
    { kind: 'info', text: 'Добавлен комментарий в чат проекта',          time: 'Вчера, 15:40'   },
    { kind: 'ok',   text: 'Подписан акт освидетельствования скрытых работ', time: '23.04.2026'  },
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
            }}>{member.initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{member.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>{member.position}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{
                  ...roleStyle, fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  padding: '2px 8px', borderRadius: 999,
                }}>{member.roleLabel}</span>
                <Badge variant={STATUS_KIND[member.status]} uppercase>
                  <StatusDot kind={STATUS_KIND[member.status]} size={6} />
                  {STATUS_LABEL[member.status]}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Contact buttons */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" style={{ flex: 1, justifyContent: 'center' }}>
            <Icon name="phone" size={13} />{member.phone}
          </Button>
          <Button variant="outline" size="sm" style={{ flex: 1, justifyContent: 'center' }}>
            <Icon name="mail" size={13} />{member.email}
          </Button>
        </div>

        {/* Info rows */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { icon: 'layers',    label: 'Дисциплина',    value: member.discipline },
            { icon: 'briefcase', label: 'Организация',   value: member.company    },
            { icon: 'calendar',  label: 'В проекте с',   value: member.since      },
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

        {/* Recent activity */}
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

const TeamPage = () => {
  const [search, setSearch] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState(null);

  const filtered = TEAM.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.roleLabel.toLowerCase().includes(search.toLowerCase()) ||
    m.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Команда проекта</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>{TEAM.length} участников</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', display: 'flex' }}>
              <Icon name="search" size={14} />
            </span>
            <Input
              placeholder="Поиск по имени или роли…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, width: 220 }}
            />
          </div>
          <Button variant="primary" size="sm"><Icon name="plus" size={14} />Добавить</Button>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(m => {
          const roleStyle = ROLE_COLORS[m.role] || ROLE_COLORS.doc;
          const avatarColor = 'oklch(0.50 0.18 ' + m.hue + ')';
          const avatarBg   = 'color-mix(in oklch, oklch(0.50 0.18 ' + m.hue + ') 16%, var(--card))';

          return (
            <div key={m.id}
              onClick={() => setSelectedMember(m)}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: 20,
                display: 'flex', flexDirection: 'column', gap: 16,
                transition: 'box-shadow .15s', cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Avatar + name row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: avatarBg, color: avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)',
                  flexShrink: 0, border: '2px solid ' + avatarColor,
                }}>
                  {m.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.position}</div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{
                      ...roleStyle, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                      textTransform: 'uppercase', padding: '2px 8px', borderRadius: 999,
                    }}>{m.roleLabel}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                {[
                  ['Дисциплина', m.discipline],
                  ['Организация', m.company],
                  ['В проекте с', m.since],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: 'var(--muted-foreground)', flexShrink: 0 }}>{k}</span>
                    <span style={{ fontWeight: 500, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <Badge variant={STATUS_KIND[m.status]} uppercase>
                  <StatusDot kind={STATUS_KIND[m.status]} />
                  {STATUS_LABEL[m.status]}
                </Badge>
                <div style={{ display: 'flex', gap: 4 }}>
                  <IconBtn style={{ width: 28, height: 28 }} title={m.phone}>
                    <Icon name="phone" size={13} />
                  </IconBtn>
                  <IconBtn style={{ width: 28, height: 28 }} title={m.email}>
                    <Icon name="mail" size={13} />
                  </IconBtn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMember && (
        <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
};

window.TeamPage = TeamPage;
