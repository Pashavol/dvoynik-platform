// SettingsPage.jsx
const { useState: useSettingsState } = React;

// ─── Shared layout primitives ──────────────────────────────────────────────────

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
    style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: checked ? 'var(--primary)' : 'var(--input)',
      position: 'relative', transition: 'background .18s', padding: 0, flexShrink: 0,
    }}
  >
    <span style={{
      position: 'absolute', top: 3, left: checked ? 23 : 3,
      width: 18, height: 18, borderRadius: '50%', background: '#fff',
      transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,.25)',
    }} />
  </button>
);

const SettingCard = ({ children }) => (
  <div style={{
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', overflow: 'hidden',
  }}>
    {children}
  </div>
);

const SettingRow = ({ label, description, last, children }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px', gap: 20,
    borderBottom: last ? 'none' : '1px solid var(--border)',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
      {description && (
        <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2, lineHeight: 1.5 }}>{description}</div>
      )}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const SectionHeader = ({ title, description, action }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 4 }}>{description}</div>
      )}
    </div>
    {action}
  </div>
);

// ─── Profile ───────────────────────────────────────────────────────────────────

const ProfileSection = () => {
  const [name,  setName]  = useSettingsState('Алексей Воронов');
  const [email, setEmail] = useSettingsState('a.voronov@dvoynik.ru');
  const [role,  setRole]  = useSettingsState('Главный инженер проекта');
  const [phone, setPhone] = useSettingsState('+7 (495) 123-45-67');
  const [saved, setSaved] = useSettingsState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div>
      <SectionHeader title="Профиль" description="Ваши данные и контактная информация" />

      <SettingCard>
        {/* Avatar row */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--primary)', color: 'var(--primary-foreground)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, flexShrink: 0,
            }}>АВ</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>{role}</div>
              <div style={{ marginTop: 8 }}>
                <Button variant="outline" size="sm"><Icon name="upload" size={13} />Загрузить фото</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Имя и фамилия', value: name,  onChange: setName  },
            { label: 'Email',          value: email, onChange: setEmail },
            { label: 'Должность',      value: role,  onChange: setRole  },
            { label: 'Телефон',        value: phone, onChange: setPhone },
          ].map(f => (
            <div style={{ display: 'flex', flexFlow: 'wrap' }} key={f.label}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--muted-foreground)' }}>{f.label}</div>
              <Input value={f.value} onChange={e => f.onChange(e.target.value)} />
            </div>
          ))}
        </div>

        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button variant="default" size="sm" onClick={save}><Icon name="check" size={13} />Сохранить</Button>
          {saved && (
            <span style={{ fontSize: 13, color: 'var(--status-ok)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Icon name="check-circle" size={13} />Изменения сохранены
            </span>
          )}
        </div>
      </SettingCard>

      {/* Security */}
      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Безопасность" description="Управление паролем и двухфакторной аутентификацией" />
        <SettingCard>
          <SettingRow label="Изменить пароль" description="Последнее изменение: 14 января 2026 г.">
            <Button variant="outline" size="sm">Изменить</Button>
          </SettingRow>
          <SettingRow
            label="Двухфакторная аутентификация"
            description="Подтверждение входа через приложение-аутентификатор"
            last
          >
            <Badge variant="ok" uppercase><StatusDot kind="ok" />Включена</Badge>
          </SettingRow>
        </SettingCard>
      </div>
    </div>
  );
};

// ─── Notifications ─────────────────────────────────────────────────────────────

const NotificationsSection = () => {
  const [channels, setChannels] = useSettingsState({ email: true, push: true, telegram: false });
  const [telegram, setTelegram] = useSettingsState(false);

  // Per-event channel matrix: { eventKey: { email, push, telegram } }
  const [matrix, setMatrix] = useSettingsState({
    critical:  { email: true,  push: true,  telegram: false },
    warnings:  { email: true,  push: true,  telegram: false },
    analytics: { email: false, push: false, telegram: false },
    reports:   { email: true,  push: false, telegram: false },
    digest:    { email: false, push: false, telegram: false },
  });

  const toggleCell = (event, ch) => setMatrix(prev => ({
    ...prev,
    [event]: { ...prev[event], [ch]: !prev[event][ch] },
  }));

  // Quiet hours
  const [dnd,      setDnd]      = useSettingsState(true);
  const [dndFrom,  setDndFrom]  = useSettingsState('22:00');
  const [dndTo,    setDndTo]    = useSettingsState('08:00');

  // Digest schedule
  const [digestTime, setDigestTime] = useSettingsState('08:00');

  // Test notification
  const [testSent, setTestSent] = useSettingsState(false);
  const sendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const EVENT_TYPES = [
    { key: 'critical',  label: 'Критические инциденты',  description: 'Превышение параметров безопасности', badge: 'crit' },
    { key: 'warnings',  label: 'Предупреждения',          description: 'Отклонения от плана, риски',         badge: 'warn' },
    { key: 'analytics', label: 'Аналитика',               description: 'Рекомендации и оптимизация',         badge: 'info' },
    { key: 'reports',   label: 'Еженедельные отчёты',     description: 'Сводка по всем проектам',            badge: 'ok'   },
    { key: 'digest',    label: 'Утренний дайджест',       description: `Доставка в ${digestTime}`,           badge: null   },
  ];

  const BADGE_LABEL = { crit: 'Крит', warn: 'Риск', info: 'Инфо', ok: 'Прогноз' };

  const CH_ICONS = { email: 'mail', push: 'bell', telegram: 'send' };
  const CH_LABELS = { email: 'Email', push: 'Push', telegram: 'TG' };

  const timeInputStyle = {
    height: 32, padding: '0 10px', borderRadius: 'var(--radius)',
    border: '1px solid var(--input)', background: 'var(--background)',
    color: 'var(--foreground)', fontSize: 13, cursor: 'pointer', width: 90,
  };

  return (
    <div>
      <SectionHeader title="Уведомления" description="Настройте, как и когда получать оповещения" />

      {/* Channels */}
      <SettingCard>
        <SettingRow label="Email-уведомления" description="Отправка на a.voronov@dvoynik.ru">
          <Toggle checked={channels.email} onChange={v => setChannels(p => ({ ...p, email: v }))} />
        </SettingRow>
        <SettingRow label="Push-уведомления" description="Уведомления в браузере">
          <Toggle checked={channels.push} onChange={v => setChannels(p => ({ ...p, push: v }))} />
        </SettingRow>
        <SettingRow label="Telegram-бот" description="Подключите @DvoynikBot для быстрых уведомлений" last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!telegram
              ? <Button variant="outline" size="sm" onClick={() => setTelegram(true)}><Icon name="send" size={13} />Подключить</Button>
              : <Toggle checked={channels.telegram} onChange={v => setChannels(p => ({ ...p, telegram: v }))} />
            }
          </div>
        </SettingRow>
      </SettingCard>

      {/* Event × Channel matrix */}
      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Доставка по типу событий" description="Выберите канал для каждого типа уведомлений" />
        <SettingCard>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr repeat(3, 72px)',
            padding: '10px 20px 8px', borderBottom: '1px solid var(--border)',
            gap: 8,
          }}>
            <div />
            {['email', 'push', 'telegram'].map(ch => (
              <div key={ch} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--muted-foreground)',
              }}>
                <Icon name={CH_ICONS[ch]} size={13} />
                {CH_LABELS[ch]}
              </div>
            ))}
          </div>

          {EVENT_TYPES.map((item, idx, arr) => (
            <div key={item.key} style={{
              display: 'grid', gridTemplateColumns: '1fr repeat(3, 72px)',
              alignItems: 'center', padding: '12px 20px', gap: 8,
              borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {item.label}
                  {item.badge && <Badge variant={item.badge} uppercase>{BADGE_LABEL[item.badge]}</Badge>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{item.description}</div>
              </div>
              {['email', 'push', 'telegram'].map(ch => {
                const active = matrix[item.key][ch] && channels[ch] && (ch !== 'telegram' || telegram);
                const disabled = !channels[ch] || (ch === 'telegram' && !telegram);
                return (
                  <div key={ch} style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => !disabled && toggleCell(item.key, ch)}
                      style={{
                        width: 24, height: 24, borderRadius: 6, border: 'none',
                        background: active
                          ? (item.badge === 'crit' ? 'var(--status-crit)' : 'var(--primary)')
                          : disabled ? 'var(--muted)' : 'var(--input)',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: disabled ? 0.4 : 1,
                        transition: 'background .15s',
                      }}
                      title={disabled ? 'Канал отключён' : undefined}
                    >
                      {active && <Icon name="check" size={12} style={{ color: '#fff' }} />}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </SettingCard>
      </div>

      {/* Quiet hours */}
      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Тихие часы" description="Не беспокоить в указанный промежуток времени" />
        <SettingCard>
          <SettingRow label="Режим «Не беспокоить»" description="Критические инциденты доставляются в любое время">
            <Toggle checked={dnd} onChange={setDnd} />
          </SettingRow>
          {dnd && (
            <div style={{ padding: '12px 20px 14px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted-foreground)', marginBottom: 10 }}>Интервал тишины</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4 }}>С</div>
                  <input type="time" value={dndFrom} onChange={e => setDndFrom(e.target.value)} style={timeInputStyle} />
                </div>
                <div style={{ color: 'var(--muted-foreground)', marginTop: 16 }}>—</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginBottom: 4 }}>До</div>
                  <input type="time" value={dndTo} onChange={e => setDndTo(e.target.value)} style={timeInputStyle} />
                </div>
                <div style={{
                  marginTop: 14, fontSize: 12, color: 'var(--muted-foreground)',
                  background: 'var(--muted)', padding: '4px 10px', borderRadius: 'var(--radius)',
                }}>
                  <Icon name="moon" size={12} /> {dndFrom} — {dndTo}
                </div>
              </div>
            </div>
          )}
        </SettingCard>
      </div>

      {/* Digest time */}
      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Расписание дайджеста" description="Время доставки утреннего обзора" />
        <SettingCard>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <Icon name="clock" size={16} style={{ color: 'var(--muted-foreground)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Время доставки</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
                Дайджест отправляется по рабочим дням
              </div>
            </div>
            <input type="time" value={digestTime} onChange={e => setDigestTime(e.target.value)} style={timeInputStyle} />
          </div>
        </SettingCard>
      </div>

      {/* Test notification */}
      <div style={{ marginTop: 24 }}>
        <SettingCard>
          <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Тестовое уведомление</div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
                Отправить пробное сообщение по всем активным каналам
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {testSent && (
                <span style={{ fontSize: 13, color: 'var(--status-ok)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="check-circle" size={13} />Отправлено
                </span>
              )}
              <Button variant="outline" size="sm" onClick={sendTest} disabled={testSent}>
                <Icon name="bell" size={13} />Отправить тест
              </Button>
            </div>
          </div>
        </SettingCard>
      </div>
    </div>
  );
};

// ─── AI-ассистент ──────────────────────────────────────────────────────────────

const AISection = () => {
  const [enabled,     setEnabled]     = useSettingsState(true);
  const [interval,    setIntervalVal] = useSettingsState('realtime');
  const [sensitivity, setSensitivity] = useSettingsState('medium');
  const [sources, setSources] = useSettingsState({
    bim: true, telemetry: true, budget: true, schedule: true, docs: false,
  });

  const toggleSource = key => setSources(prev => ({ ...prev, [key]: !prev[key] }));

  const INTERVALS = [
    { key: 'realtime', label: 'В реальном времени', description: 'Анализ при каждом обновлении данных' },
    { key: 'hourly',   label: 'Каждый час',          description: 'Оптимально для больших проектов' },
    { key: 'daily',    label: 'Раз в сутки',         description: 'Ежедневный отчёт в 08:00' },
  ];

  const SOURCES = [
    { key: 'bim',       label: 'BIM-модели',       description: 'Данные об объектах и оборудовании' },
    { key: 'telemetry', label: 'Телеметрия',        description: 'Показания датчиков в реальном времени' },
    { key: 'budget',    label: 'Бюджет и закупки',  description: 'Финансовые отклонения и оптимизация' },
    { key: 'schedule',  label: 'Календарный план',  description: 'Отставания и риски по графику' },
    { key: 'docs',      label: 'Документы',         description: 'Сроки разрешений и актов' },
  ];

  const SENSITIVITY = [
    { key: 'low',    label: 'Низкая',  description: 'Только критические события' },
    { key: 'medium', label: 'Средняя', description: 'Рекомендуется' },
    { key: 'high',   label: 'Высокая', description: 'Все отклонения' },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, color-mix(in oklch, var(--primary) 10%, var(--card)) 0%, var(--card) 55%)',
        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
        padding: 20, position: 'relative', overflow: 'hidden', marginBottom: 24,
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'color-mix(in oklch, var(--primary) 14%, transparent)', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="sparkles" size={20} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>AI-ассистент</div>
            <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>Интеллектуальный анализ портфеля проектов</div>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>
      </div>

      {enabled && (
        <>
          {/* Interval */}
          <SectionHeader title="Частота анализа" description="Как часто AI обрабатывает новые данные" />
          <SettingCard>
            {INTERVALS.map((opt, idx, arr) => (
              <div key={opt.key} onClick={() => setIntervalVal(opt.key)} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                background: interval === opt.key ? 'color-mix(in oklch, var(--primary) 5%, transparent)' : 'transparent',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${interval === opt.key ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {interval === opt.key && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: interval === opt.key ? 600 : 400 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>{opt.description}</div>
                </div>
              </div>
            ))}
          </SettingCard>

          {/* Sources */}
          <div style={{ marginTop: 24 }}>
            <SectionHeader title="Источники данных" description="Выберите, какие данные анализирует AI" />
            <SettingCard>
              {SOURCES.map((src, idx, arr) => (
                <SettingRow key={src.key} label={src.label} description={src.description} last={idx === arr.length - 1}>
                  <Toggle checked={sources[src.key]} onChange={() => toggleSource(src.key)} />
                </SettingRow>
              ))}
            </SettingCard>
          </div>

          {/* Sensitivity */}
          <div style={{ marginTop: 24 }}>
            <SectionHeader title="Чувствительность к рискам" description="Порог срабатывания предупреждений" />
            <SettingCard>
              <div style={{ padding: 16, display: 'flex', gap: 10 }}>
                {SENSITIVITY.map(opt => (
                  <div key={opt.key} onClick={() => setSensitivity(opt.key)} style={{
                    flex: 1, padding: '12px 16px', borderRadius: 'var(--radius)',
                    border: `1px solid ${sensitivity === opt.key ? 'var(--primary)' : 'var(--border)'}`,
                    background: sensitivity === opt.key ? 'color-mix(in oklch, var(--primary) 6%, var(--card))' : 'var(--background)',
                    cursor: 'pointer', textAlign: 'center',
                    outline: sensitivity === opt.key ? '2px solid var(--primary)' : 'none', outlineOffset: 1,
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>{opt.description}</div>
                  </div>
                ))}
              </div>
            </SettingCard>
          </div>
        </>
      )}

      {!enabled && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted-foreground)' }}>
          <Icon name="sparkles" size={32} />
          <div style={{ marginTop: 12, fontWeight: 500 }}>AI-ассистент отключён</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Включите переключатель выше, чтобы активировать анализ</div>
        </div>
      )}
    </div>
  );
};

// ─── Integrations ──────────────────────────────────────────────────────────────

const IntegrationsSection = () => {
  const [items, setItems] = useSettingsState([
    { id: 'bim',      name: 'Autodesk BIM 360',           description: 'Синхронизация моделей и документации',   icon: 'box',         status: 'ok',       connectedAt: '12 янв. 2026' },
    { id: 'scada',    name: 'Система телеметрии SCADA',   description: 'Данные датчиков в реальном времени',     icon: 'activity',    status: 'ok',       connectedAt: '03 фев. 2026' },
    { id: '1c',       name: '1C: Управление строительством', description: 'Бюджет, закупки и платёжные данные',  icon: 'trending-up', status: 'warn',     connectedAt: '29 мар. 2026' },
    { id: 'telegram', name: 'Telegram Bot',               description: 'Уведомления и команды через мессенджер', icon: 'send',        status: 'inactive', connectedAt: null },
    { id: 'rtf',      name: 'API Ростехнадзора',          description: 'Статус разрешений и предписаний',        icon: 'file-text',   status: 'inactive', connectedAt: null },
  ]);

  const toggle = id => setItems(prev => prev.map(i => {
    if (i.id !== id) return i;
    return i.status === 'inactive'
      ? { ...i, status: 'ok',       connectedAt: '25 апр. 2026' }
      : { ...i, status: 'inactive', connectedAt: null };
  }));

  const STATUS_LABEL = { ok: 'Активна', warn: 'Предупреждение', inactive: 'Не подключено' };

  return (
    <div>
      <SectionHeader title="Интеграции" description="Подключите внешние системы для обмена данными" />
      <SettingCard>
        {items.map((item, idx) => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
            borderBottom: idx < items.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: 'var(--muted-foreground)',
            }}>
              <Icon name={item.icon} size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</span>
                <Badge variant={item.status} uppercase>
                  <StatusDot kind={item.status} />{STATUS_LABEL[item.status]}
                </Badge>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 3 }}>
                {item.description}
                {item.connectedAt && <span style={{ fontFamily: 'var(--font-mono)', marginLeft: 8 }}>· с {item.connectedAt}</span>}
              </div>
              {item.status === 'warn' && (
                <div style={{ fontSize: 12, color: 'oklch(0.45 0.15 70)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="alert-triangle" size={11} />Ошибка синхронизации — проверьте учётные данные
                </div>
              )}
            </div>
            <div style={{ flexShrink: 0, display: 'flex', gap: 8 }}>
              {item.status !== 'inactive' && (
                <IconBtn><Icon name="settings" size={14} /></IconBtn>
              )}
              <Button
                variant={item.status === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggle(item.id)}
              >
                {item.status === 'inactive' ? 'Подключить' : 'Отключить'}
              </Button>
            </div>
          </div>
        ))}
      </SettingCard>
    </div>
  );
};

// ─── Team ──────────────────────────────────────────────────────────────────────

const INITIAL_MEMBERS = [
  { id: 1, name: 'Воронов Алексей В.',  email: 'a.voronov@dvoynik.ru',  role: 'Администратор',    avatar: 'АВ',  status: 'ok',       lastSeen: 'Сейчас'      },
  { id: 2, name: 'Иванов А.В.',         email: 'a.ivanov@dvoynik.ru',   role: 'Инженер проекта',  avatar: 'ИА',  status: 'ok',       lastSeen: '2 ч. назад'  },
  { id: 3, name: 'Петров Д.К.',         email: 'd.petrov@dvoynik.ru',   role: 'Инженер-технолог', avatar: 'ПД',  status: 'ok',       lastSeen: '1 ч. назад'  },
  { id: 4, name: 'Сидоров В.П.',        email: 'v.sidorov@dvoynik.ru',  role: 'Специалист ОТК',   avatar: 'СВ',  status: 'inactive', lastSeen: '3 дн. назад' },
  { id: 5, name: 'BIM-отдел',           email: 'bim@dvoynik.ru',        role: 'BIM-специалист',   avatar: 'BIM', status: 'ok',       lastSeen: '30 мин. назад'},
];

const ROLE_OPTIONS = ['Администратор', 'Инженер проекта', 'Инженер-технолог', 'Специалист ОТК', 'BIM-специалист', 'Только чтение'];

const TeamSection = () => {
  const [members,     setMembers]     = useSettingsState(INITIAL_MEMBERS);
  const [showInvite,  setShowInvite]  = useSettingsState(false);
  const [inviteEmail, setInviteEmail] = useSettingsState('');
  const [inviteRole,  setInviteRole]  = useSettingsState('Инженер проекта');
  const [inviteSent,  setInviteSent]  = useSettingsState(false);

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInvite(false); setInviteEmail(''); }, 2000);
  };

  return (
    <div>
      <SectionHeader
        title="Команда"
        description="Управление доступом и ролями участников"
        action={
          <Button variant="default" size="sm" onClick={() => setShowInvite(s => !s)}>
            <Icon name="plus" size={14} />Пригласить
          </Button>
        }
      />

      {showInvite && (
        <div style={{ marginBottom: 16 }}>
          <SettingCard>
            <div style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--muted-foreground)' }}>Email</div>
                <Input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="email@company.ru"
                  onKeyDown={e => e.key === 'Enter' && sendInvite()}
                />
              </div>
              <div style={{ width: 200 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6, color: 'var(--muted-foreground)' }}>Роль</div>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  style={{
                    width: '100%', height: 36, padding: '0 10px', borderRadius: 'var(--radius)',
                    border: '1px solid var(--input)', background: 'var(--background)',
                    color: 'var(--foreground)', fontSize: 14, cursor: 'pointer',
                  }}
                >
                  {ROLE_OPTIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <Button variant="default" size="sm" onClick={sendInvite}>
                {inviteSent ? <><Icon name="check" size={13} />Отправлено</> : <><Icon name="send" size={13} />Отправить</>}
              </Button>
              <IconBtn onClick={() => setShowInvite(false)}><Icon name="x" size={14} /></IconBtn>
            </div>
          </SettingCard>
        </div>
      )}

      <SettingCard>
        {members.map((m, idx) => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px',
            borderBottom: idx < members.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)',
              color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0,
            }}>{m.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
                {m.id === 1 && <Badge variant="primary">Вы</Badge>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{m.email}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted-foreground)', fontSize: 12 }}>
              <StatusDot kind={m.status} />
              {m.lastSeen}
            </div>
            <Badge variant="outline">{m.role}</Badge>
            {m.id !== 1 && <IconBtn><Icon name="more" size={16} /></IconBtn>}
          </div>
        ))}
      </SettingCard>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted-foreground)', textAlign: 'right' }}>
        {members.length} участников · 4 активны
      </div>
    </div>
  );
};

// ─── Appearance ────────────────────────────────────────────────────────────────

const AppearanceSection = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const [theme,   setTheme]   = useSettingsState(isDark ? 'dark' : 'light');
  const [density, setDensity] = useSettingsState('normal');
  const [lang,    setLang]    = useSettingsState('ru');
  const [usage,   setUsage]   = useSettingsState(true);
  const [filters, setFilters] = useSettingsState(true);

  const applyTheme = t => {
    setTheme(t);
    const dark = t === 'system' ? window.matchMedia('(prefers-color-scheme: dark)').matches : t === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('dvoynik-theme', dark ? 'dark' : 'light');
  };

  const THEMES   = [{ key: 'light', label: 'Светлая', icon: 'sun' }, { key: 'dark', label: 'Тёмная', icon: 'moon' }, { key: 'system', label: 'Авто', icon: 'layers' }];
  const DENSITY  = [{ key: 'compact', label: 'Компактный' }, { key: 'normal', label: 'Обычный' }, { key: 'comfortable', label: 'Просторный' }];

  return (
    <div>
      <SectionHeader title="Внешний вид" description="Тема оформления и параметры отображения" />

      <SettingCard>
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12, color: 'var(--muted-foreground)' }}>Тема</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {THEMES.map(opt => (
              <button key={opt.key} onClick={() => applyTheme(opt.key)} style={{
                padding: '16px', borderRadius: 'var(--radius)',
                border: `1px solid ${theme === opt.key ? 'var(--primary)' : 'var(--border)'}`,
                background: theme === opt.key ? 'color-mix(in oklch, var(--primary) 6%, var(--background))' : 'var(--background)',
                cursor: 'pointer', textAlign: 'center',
                outline: theme === opt.key ? '2px solid var(--primary)' : 'none', outlineOffset: 1,
                color: 'var(--foreground)',
              }}>
                <Icon name={opt.icon} size={22} />
                <div style={{ fontSize: 13, fontWeight: theme === opt.key ? 600 : 400, marginTop: 8 }}>{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
      </SettingCard>

      <div style={{ marginTop: 24 }}>
        <SettingCard>
          <SettingRow label="Язык интерфейса" description="Язык текстов и дат">
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              style={{
                height: 32, padding: '0 10px', borderRadius: 'var(--radius)',
                border: '1px solid var(--input)', background: 'var(--background)',
                color: 'var(--foreground)', fontSize: 13, cursor: 'pointer',
              }}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </SettingRow>
          <SettingRow label="Плотность отображения" description="Влияет на размер строк и отступы" last>
            <div style={{ display: 'flex', gap: 4 }}>
              {DENSITY.map(opt => (
                <button key={opt.key} onClick={() => setDensity(opt.key)} style={{
                  padding: '5px 12px', borderRadius: 'var(--radius)', fontSize: 12, cursor: 'pointer',
                  border: `1px solid ${density === opt.key ? 'var(--primary)' : 'var(--border)'}`,
                  background: density === opt.key ? 'var(--primary)' : 'var(--background)',
                  color: density === opt.key ? 'var(--primary-foreground)' : 'var(--foreground)',
                  fontWeight: density === opt.key ? 600 : 400,
                }}>{opt.label}</button>
              ))}
            </div>
          </SettingRow>
        </SettingCard>
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Данные и конфиденциальность" />
        <SettingCard>
          <SettingRow label="Аналитика использования" description="Анонимные данные для улучшения платформы">
            <Toggle checked={usage} onChange={setUsage} />
          </SettingRow>
          <SettingRow label="Сохранять фильтры" description="Запоминать последние настройки фильтров на страницах" last>
            <Toggle checked={filters} onChange={setFilters} />
          </SettingRow>
        </SettingCard>
      </div>
    </div>
  );
};

// ─── SettingsPage ──────────────────────────────────────────────────────────────

const SettingsPage = () => {
  const [section, setSection] = useSettingsState('profile');

  const NAV = [
    { key: 'profile',       label: 'Профиль',      icon: 'user'      },
    { key: 'notifications', label: 'Уведомления',  icon: 'bell'      },
    { key: 'ai',            label: 'AI-ассистент', icon: 'sparkles'  },
    { key: 'integrations',  label: 'Интеграции',   icon: 'layers'    },
    { key: 'team',          label: 'Команда',       icon: 'users'     },
    { key: 'appearance',    label: 'Внешний вид',  icon: 'sun'       },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Sidebar nav */}
      <div style={{
        width: 212, borderRight: '1px solid var(--border)', background: 'var(--background)',
        padding: '20px 10px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--muted-foreground)', marginBottom: 8, padding: '0 8px',
        }}>Настройки</div>
        {NAV.map(item => (
          <button
            key={item.key}
            onClick={() => setSection(item.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
              borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
              fontSize: 14, textAlign: 'left', width: '100%',
              background: section === item.key ? 'var(--accent)' : 'transparent',
              color:      section === item.key ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
              fontWeight: section === item.key ? 600 : 400,
            }}
          >
            <Icon name={item.icon} size={15} />{item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px', background: 'var(--muted)' }}>
        {section === 'profile'       && <ProfileSection />}
        {section === 'notifications' && <NotificationsSection />}
        {section === 'ai'            && <AISection />}
        {section === 'integrations'  && <IntegrationsSection />}
        {section === 'team'          && <TeamSection />}
        {section === 'appearance'    && <AppearanceSection />}
      </div>
    </div>
  );
};

window.SettingsPage = SettingsPage;
