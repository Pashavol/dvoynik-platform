// UserProfilePage.jsx
const { useState: useProfileState } = React;

const CURRENT_USER = {
  name:     'Алексей Воронов',
  initials: 'АВ',
  role:     'Главный инженер проекта',
  email:    'a.voronov@dvoynik.ru',
  phone:    '+7 (495) 123-45-67',
  dept:     'Инженерный отдел',
  joined:   'Март 2023',
};

const RECENT_ACTIVITY = [
  { kind: 'ok',   icon: 'check-square', text: 'Закрыта задача «Проверка арматуры DN500»',          time: '2 ч назад',    project: 'ЭЛОУ-АВТ-6' },
  { kind: 'warn', icon: 'alert-triangle', text: 'Добавлено замечание к датчику TI-1208-01',         time: '5 ч назад',    project: 'ЭЛОУ-АВТ-6' },
  { kind: 'ok',   icon: 'message-square', text: 'Ответ в чате проекта «Усть-Луга ХБ-2»',           time: 'Вчера, 16:42', project: 'Усть-Луга ХБ-2' },
  { kind: 'info', icon: 'upload', text: 'Загружен документ «Паспорт P-2340-A»',                     time: 'Вчера, 14:11', project: 'ЭЛОУ-АВТ-6' },
  { kind: 'ok',   icon: 'users', text: 'Назначена бригада Б-04 на монтажный фронт №3',              time: '23.04.2026',   project: 'НПЗ Кстово' },
  { kind: 'info', icon: 'bar-chart', text: 'Сформирован аналитический отчёт за апрель',             time: '20.04.2026',   project: 'Ванкорский кластер' },
];

const STATS = [
  { icon: 'folder',       label: 'Проектов',         value: '6',   sub: 'активных' },
  { icon: 'check-square', label: 'Задач',             value: '14',  sub: '3 просрочено' },
  { icon: 'users',        label: 'Команда',           value: '28',  sub: 'участников' },
  { icon: 'clock',        label: 'Последний вход',    value: 'Сегодня', sub: '09:14' },
];

const UserProfilePage = ({ onNavigateSettings }) => {
  const [editing, setEditing] = useProfileState(false);
  const [name,    setName]    = useProfileState(CURRENT_USER.name);
  const [phone,   setPhone]   = useProfileState(CURRENT_USER.phone);
  const [saved,   setSaved]   = useProfileState(false);

  const save = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--muted)', padding: 24 }}>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, color-mix(in oklch, var(--primary) 12%, var(--card)) 0%, var(--card) 60%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        padding: '28px 28px 24px', marginBottom: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 240, height: 240,
          borderRadius: '50%', background: 'color-mix(in oklch, var(--primary) 12%, transparent)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--primary)', color: 'var(--primary-foreground)',
            fontSize: 24, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 0 0 3px var(--background), 0 0 0 5px var(--primary)',
          }}>{CURRENT_USER.initials}</div>

          {/* Name & role */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>{name}</span>
              <Badge variant="ok" uppercase><StatusDot kind="ok" size={6} />Онлайн</Badge>
            </div>
            <div style={{ fontSize: 14, color: 'var(--muted-foreground)', marginTop: 4 }}>
              {CURRENT_USER.role} · {CURRENT_USER.dept}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13, color: 'var(--muted-foreground)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="mail" size={13} />{CURRENT_USER.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="phone" size={13} />{phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="calendar" size={13} />В системе с {CURRENT_USER.joined}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {saved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--status-ok)', fontWeight: 500 }}>
                <Icon name="check" size={14} />Сохранено
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setEditing(e => !e)}>
              <Icon name={editing ? 'x' : 'edit'} size={14} />
              {editing ? 'Отмена' : 'Редактировать'}
            </Button>
            <Button variant="outline" size="sm" onClick={onNavigateSettings}>
              <Icon name="settings" size={14} />Настройки
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20, position: 'relative' }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: 'var(--background)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}>
                <Icon name={s.icon} size={18} />
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 3 }}>{s.label} · {s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>

        {/* Left — Profile info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Info card */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="user" size={15} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Личные данные</span>
            </div>

            {[
              { label: 'Имя',       value: name,                   field: 'name',  setter: setName  },
              { label: 'Email',     value: CURRENT_USER.email,     field: null                      },
              { label: 'Должность', value: CURRENT_USER.role,      field: null                      },
              { label: 'Телефон',   value: phone,                  field: 'phone', setter: setPhone },
              { label: 'Отдел',     value: CURRENT_USER.dept,      field: null                      },
            ].map((row, i, arr) => (
              <div key={row.label} style={{
                display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 12,
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 12, color: 'var(--muted-foreground)', width: 80, flexShrink: 0 }}>{row.label}</span>
                {editing && row.setter ? (
                  <input
                    value={row.value}
                    onChange={e => row.setter(e.target.value)}
                    style={{
                      flex: 1, fontSize: 14, padding: '5px 10px',
                      border: '1px solid var(--input)', borderRadius: 'var(--radius)',
                      background: 'var(--background)', color: 'var(--foreground)', outline: 'none',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 14, flex: 1 }}>{row.value}</span>
                )}
              </div>
            ))}

            {editing && (
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
                <Button variant="primary" size="sm" onClick={save}>
                  <Icon name="save" size={14} />Сохранить изменения
                </Button>
              </div>
            )}
          </div>

          {/* Security card */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="shield" size={15} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Безопасность</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid var(--border)', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)', width: 80, flexShrink: 0 }}>Пароль</span>
              <span style={{ fontSize: 13, flex: 1, color: 'var(--muted-foreground)' }}>Изменён 14 дней назад</span>
              <Button variant="outline" size="sm" onClick={onNavigateSettings}>Изменить</Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)', width: 80, flexShrink: 0 }}>2FA</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, flex: 1 }}>
                <StatusDot kind="ok" size={7} />Включена
              </span>
              <Button variant="outline" size="sm" onClick={onNavigateSettings}>Управление</Button>
            </div>
          </div>
        </div>

        {/* Right — Recent activity */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="activity" size={15} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Последняя активность</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '14px 20px',
                borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: a.kind === 'ok' ? 'color-mix(in oklch, var(--status-ok) 12%, transparent)'
                            : a.kind === 'warn' ? 'color-mix(in oklch, var(--status-warn) 12%, transparent)'
                            : 'color-mix(in oklch, var(--primary) 12%, transparent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: a.kind === 'ok' ? 'var(--status-ok)' : a.kind === 'warn' ? 'var(--status-warn)' : 'var(--primary)',
                }}>
                  <Icon name={a.icon} size={14} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4, fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="folder" size={10} />{a.project}
                    </span>
                    <span>{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

window.UserProfilePage = UserProfilePage;
