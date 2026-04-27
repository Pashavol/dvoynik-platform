// TasksPage.jsx — global tasks page + project tasks tab
const { useState: useTaskState } = React;

// ── Data ──────────────────────────────────────────────────────────────────────

const TASK_MEMBERS = [
  { id: 'u1', name: 'Иванов А.В.',   initials: 'ИА', hue: 210, role: 'BIM-менеджер'      },
  { id: 'u2', name: 'Петров Д.К.',   initials: 'ПД', hue: 340, role: 'Контроль качества'  },
  { id: 'u3', name: 'Сидоров В.П.',  initials: 'СВ', hue: 140, role: 'Инженер'            },
  { id: 'u4', name: 'Козлов М.Н.',   initials: 'КМ', hue: 45,  role: 'Прораб'             },
  { id: 'u5', name: 'Новикова Е.В.', initials: 'НЕ', hue: 280, role: 'Сметчик'            },
];

const TASK_BRIGADES = [
  { id: 'b1', name: 'Бригада Б-01', contractor: 'СУ-17'   },
  { id: 'b2', name: 'Бригада Б-02', contractor: 'СУ-17'   },
  { id: 'b3', name: 'Бригада Б-03', contractor: 'СУП-12'  },
  { id: 'b4', name: 'Бригада Б-04', contractor: 'СУП-12'  },
];

const TASK_TYPES = [
  { key: 'contract',     label: 'Подписать договор',     icon: 'file-text'      },
  { key: 'inspection',   label: 'Провести осмотр',       icon: 'eye'            },
  { key: 'installation', label: 'Провести монтаж',       icon: 'tool'           },
  { key: 'budget',       label: 'Оценить бюджет',        icon: 'trending-up'    },
  { key: 'safety',       label: 'Проверка безопасности', icon: 'alert-triangle' },
  { key: 'other',        label: 'Прочее',                icon: 'more'           },
];

const TASK_STATUSES = [
  { key: 'open',        label: 'Открыта',     kind: 'info'     },
  { key: 'in_progress', label: 'В работе',    kind: 'warn'     },
  { key: 'review',      label: 'На проверке', kind: 'info'     },
  { key: 'done',        label: 'Выполнена',   kind: 'ok'       },
  { key: 'overdue',     label: 'Просрочена',  kind: 'crit'     },
];

const TASK_PRIORITIES = [
  { key: 'low',      label: 'Низкий',      color: 'var(--muted-foreground)'     },
  { key: 'medium',   label: 'Средний',     color: 'var(--status-warn)'          },
  { key: 'high',     label: 'Высокий',     color: 'oklch(0.65 0.18 35)'         },
  { key: 'critical', label: 'Критический', color: 'var(--status-crit)'          },
];

const ALL_TASKS_DATA = [
  {
    id: 'TSK-001', title: 'Подписать договор с СУ-17 на монтаж оборудования',
    type: 'contract', status: 'overdue', priority: 'critical',
    projectId: 'elou-6', projectName: 'ЭЛОУ-АВТ-6 · Блок 2',
    assignee: TASK_MEMBERS[0], brigade: null,
    dueDate: '20.04.2026', createdAt: '10.04.2026', createdBy: 'Петров Д.К.',
    source: { type: 'recommendation', label: 'Рекомендация AI' },
    attachments: [{ name: 'договор_монтаж.pdf', size: '1,2 МБ' }],
    description: 'Необходимо согласовать и подписать договор на монтаж оборудования с подрядчиком СУ-17 до начала следующего этапа.',
  },
  {
    id: 'TSK-002', title: 'Провести осмотр теплообменника E-4401',
    type: 'inspection', status: 'in_progress', priority: 'critical',
    projectId: 'elou-6', projectName: 'ЭЛОУ-АВТ-6 · Блок 2',
    assignee: TASK_MEMBERS[1], brigade: null,
    dueDate: '26.04.2026', createdAt: '23.04.2026', createdBy: 'Система',
    source: { type: 'deviation', label: 'Трещина в сварном шве E-4401' },
    attachments: [],
    description: 'Внеплановый осмотр теплообменника E-4401 в связи с обнаруженной трещиной в сварном шве. Результаты оформить актом.',
  },
  {
    id: 'TSK-003', title: 'Провести монтаж насосного агрегата P-2340-B',
    type: 'installation', status: 'open', priority: 'high',
    projectId: 'elou-6', projectName: 'ЭЛОУ-АВТ-6 · Блок 2',
    assignee: null, brigade: TASK_BRIGADES[0],
    dueDate: '05.05.2026', createdAt: '24.04.2026', createdBy: 'Иванов А.В.',
    source: { type: 'event', label: 'Плановый этап монтажа' },
    attachments: [{ name: 'монтажная_схема.dwg', size: '4,8 МБ' }, { name: 'ТУ_насос.pdf', size: '980 КБ' }],
    description: 'Монтаж насосного агрегата P-2340-B согласно рабочей документации. Фиксировать отклонения в BIM-модели.',
  },
  {
    id: 'TSK-004', title: 'Провести оценку бюджета на замену арматуры DN500',
    type: 'budget', status: 'open', priority: 'medium',
    projectId: 'kstovo', projectName: 'НПЗ Кстово, установка-3',
    assignee: TASK_MEMBERS[4], brigade: null,
    dueDate: '28.04.2026', createdAt: '22.04.2026', createdBy: 'Сидоров В.П.',
    source: { type: 'recommendation', label: 'Отклонение графика монтажа' },
    attachments: [],
    description: 'Подготовить сравнительный анализ затрат на закупку арматуры DN500 у альтернативных поставщиков.',
  },
  {
    id: 'TSK-005', title: 'Продление разрешений на высотные работы',
    type: 'contract', status: 'open', priority: 'critical',
    projectId: 'ust-luga', projectName: 'Терминал Усть-Луга',
    assignee: TASK_MEMBERS[2], brigade: null,
    dueDate: '29.04.2026', createdAt: '22.04.2026', createdBy: 'Система',
    source: { type: 'recommendation', label: 'Истекают 3 разрешения' },
    attachments: [{ name: 'разрешения_высотные.pdf', size: '560 КБ' }],
    description: 'Продление через Ростехнадзор 3 разрешений на высотные работы, истекающих 30 апреля. Риск остановки работ.',
  },
  {
    id: 'TSK-006', title: 'Провести осмотр зоны монтажа Б-04',
    type: 'inspection', status: 'done', priority: 'medium',
    projectId: 'vankor', projectName: 'Ванкорский кластер',
    assignee: null, brigade: TASK_BRIGADES[3],
    dueDate: '22.04.2026', createdAt: '18.04.2026', createdBy: 'Козлов М.Н.',
    source: null,
    attachments: [{ name: 'акт_осмотра_Б04.pdf', size: '340 КБ' }],
    description: 'Плановый осмотр рабочей зоны бригады Б-04.',
  },
  {
    id: 'TSK-007', title: 'Перераспределить задачи бригады Б-01',
    type: 'other', status: 'open', priority: 'high',
    projectId: 'vankor', projectName: 'Ванкорский кластер',
    assignee: TASK_MEMBERS[3], brigade: null,
    dueDate: '27.04.2026', createdAt: '23.04.2026', createdBy: 'Система',
    source: { type: 'recommendation', label: 'Перегрузка Б-01' },
    attachments: [],
    description: 'Перераспределить один из трёх параллельных фронтов работ Б-01 на бригаду Б-03.',
  },
  {
    id: 'TSK-008', title: 'Согласовать акт КС-2 по этапу «Обвязка»',
    type: 'contract', status: 'open', priority: 'medium',
    projectId: 'kstovo', projectName: 'НПЗ Кстово, установка-3',
    assignee: TASK_MEMBERS[0], brigade: null,
    dueDate: '30.04.2026', createdAt: '25.04.2026', createdBy: 'Система',
    source: { type: 'recommendation', label: 'Досрочное завершение Б-02' },
    attachments: [],
    description: 'Подготовить и согласовать акт выполненных работ КС-2 по этапу «Обвязка».',
  },
  {
    id: 'TSK-009', title: 'Проверка безопасности сварных швов V-1208',
    type: 'safety', status: 'open', priority: 'high',
    projectId: 'elou-6', projectName: 'ЭЛОУ-АВТ-6 · Блок 2',
    assignee: TASK_MEMBERS[1], brigade: null,
    dueDate: '02.05.2026', createdAt: '24.04.2026', createdBy: 'ОТК',
    source: { type: 'deviation', label: 'Толщина стенки −0,8 мм V-1208' },
    attachments: [],
    description: 'Проверка целостности сварных швов сосуда V-1208 после выявленного расхождения по толщине стенки.',
  },
];

window.ALL_TASKS_DATA = ALL_TASKS_DATA;
window.TASKS_OPEN_COUNT = ALL_TASKS_DATA.filter(t => t.status === 'open' || t.status === 'overdue').length;

// ── Helpers ───────────────────────────────────────────────────────────────────

const getTypeInfo   = (key) => TASK_TYPES.find(t => t.key === key)    || { label: key, icon: 'more' };
const getStatusInfo = (key) => TASK_STATUSES.find(s => s.key === key) || { label: key, kind: 'info' };
const getPriInfo    = (key) => TASK_PRIORITIES.find(p => p.key === key)|| { label: key, color: 'currentColor' };

const MemberAvatar = ({ member, size = 28 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: `oklch(0.62 0.14 ${member.hue})`,
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: 700, userSelect: 'none',
  }} title={member.name}>{member.initials}</div>
);

// ── Task Detail Panel ─────────────────────────────────────────────────────────

const TaskDetailPanel = ({ task, onClose }) => {
  if (!task) return null;
  const status   = getStatusInfo(task.status);
  const priority = getPriInfo(task.priority);
  const type     = getTypeInfo(task.type);

  const metaRow = (label, content) => (
    <div key={label} style={{ background: 'var(--muted)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13 }}>{content}</div>
    </div>
  );

  const srcIcon = task.source?.type === 'deviation' ? 'alert-triangle' : task.source?.type === 'event' ? 'activity' : 'sparkles';

  return (
    <div style={{ width: 380, flexShrink: 0, borderLeft: '1px solid var(--border)', background: 'var(--card)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)' }}>{task.id}</span>
            <Badge variant={status.kind} uppercase>{status.label}</Badge>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{task.title}</div>
        </div>
        <button onClick={onClose} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--muted)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        ><Icon name="x" size={14} /></button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {metaRow('Тип', <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name={type.icon} size={13} />{type.label}</span>)}
          {metaRow('Приоритет', (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: priority.color, fontWeight: 500 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: priority.color, display: 'inline-block', flexShrink: 0 }} />
              {priority.label}
            </span>
          ))}
          {metaRow('Срок', (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: task.status === 'overdue' ? 'var(--status-crit)' : 'inherit' }}>
              <Icon name="calendar" size={13} />{task.dueDate || '—'}
            </span>
          ))}
          {metaRow('Создана', task.createdAt)}
          {metaRow('Проект', <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="folder" size={13} />{task.projectName}</span>)}
          {metaRow('Автор', task.createdBy)}
        </div>

        {/* Assignee */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: 8 }}>
            {task.brigade ? 'Бригада' : 'Исполнитель'}
          </div>
          {task.assignee ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
              <MemberAvatar member={task.assignee} size={32} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{task.assignee.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{task.assignee.role}</div>
              </div>
            </div>
          ) : task.brigade ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="hard-hat" size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{task.brigade.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{task.brigade.contractor}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)', color: 'var(--muted-foreground)', fontSize: 13 }}>
              <Icon name="user" size={14} />Не назначено
            </div>
          )}
        </div>

        {/* Source */}
        {task.source && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Основание</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: 'color-mix(in oklch, var(--status-warn) 8%, var(--muted))', border: '1px solid color-mix(in oklch, var(--status-warn) 20%, var(--border))', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--status-warn)', display: 'flex', flexShrink: 0 }}><Icon name={srcIcon} size={13} /></span>
              <span style={{ fontSize: 13 }}>{task.source.label}</span>
            </div>
          </div>
        )}

        {/* Asset link */}
        {(() => {
          const link  = window.GRAPH?.taskLinks?.[task.id];
          const asset = link?.assetId ? window.GRAPH.assets?.[link.assetId] : null;
          if (!asset) return null;
          const sensorStatus = window.GRAPH.getAssetWorstSensorStatus(asset.id);
          return (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Актив</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                background: 'color-mix(in oklch, var(--primary) 8%, var(--muted))',
                border: '1px solid color-mix(in oklch, var(--primary) 20%, var(--border))',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}><Icon name="cpu" size={14} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{asset.id}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>{asset.type}</div>
                </div>
                <StatusDot kind={sensorStatus} size={7} />
              </div>
            </div>
          );
        })()}

        {/* Source telemetry event */}
        {(() => {
          const link = window.GRAPH?.taskLinks?.[task.id];
          if (!link?.sourceEventId) return null;
          const ev = window.BASE_EVENTS?.find(e => e.id === link.sourceEventId);
          if (!ev) return null;
          return (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Событие-источник</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                background: 'color-mix(in oklch, var(--status-warn) 7%, var(--muted))',
                border: '1px solid color-mix(in oklch, var(--status-warn) 20%, var(--border))',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ color: 'var(--status-warn)', display: 'flex', flexShrink: 0 }}><Icon name="activity" size={14} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', marginBottom: 2 }}>{ev.date} · {ev.time}</div>
                  <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.text}</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Description */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Описание</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, padding: '8px 10px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>{task.description}</div>
        </div>

        {/* Attachments */}
        {task.attachments.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-foreground)', marginBottom: 8 }}>Вложения</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {task.attachments.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: 'var(--muted)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--muted-foreground)', display: 'flex' }}><Icon name="paperclip" size={13} /></span>
                  <span style={{ flex: 1, fontSize: 13 }}>{a.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{a.size}</span>
                  <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', padding: 0 }}>
                    <Icon name="download" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        {task.status !== 'done' && (
          <Button variant="primary" size="sm" style={{ flex: 1 }}>
            <Icon name="check" size={13} />Отметить выполненной
          </Button>
        )}
        <Button variant="outline" size="sm"><Icon name="more" size={13} /></Button>
      </div>
    </div>
  );
};

// ── Create Task Modal ─────────────────────────────────────────────────────────

const CreateTaskModal = ({ onClose, onSave, projectId = null, sourceEntity = null }) => {
  const [form, setForm] = useTaskState({
    title: '',
    type: 'other',
    priority: 'medium',
    assigneeType: 'person',
    assigneeId: '',
    brigadeId: '',
    dueDate: '',
    description: '',
    sourceType: sourceEntity?.type  || '',
    sourceLabel: sourceEntity?.label || '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const projects = window.PROJECTS || [];

  const handleSave = () => {
    if (!form.title.trim()) return;
    const assignee = form.assigneeType === 'person' && form.assigneeId
      ? TASK_MEMBERS.find(m => m.id === form.assigneeId) : null;
    const brigade = form.assigneeType === 'brigade' && form.brigadeId
      ? TASK_BRIGADES.find(b => b.id === form.brigadeId) : null;
    const pid = projectId || form.projectId || '';
    const proj = projects.find(p => p.id === pid);
    onSave({ ...form, assignee, brigade, projectId: pid, projectName: proj?.name || '—' });
    onClose();
  };

  const inp = {
    width: '100%', height: 34, padding: '0 10px', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)',
    fontSize: 13, outline: 'none', boxSizing: 'border-box',
  };
  const sel = { ...inp, cursor: 'pointer' };
  const sec = { display: 'flex', flexDirection: 'column', gap: 4 };
  const lbl = { fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', marginBottom: 2, display: 'block' };

  const modal = (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.48)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 520, maxWidth: 'calc(100vw - 40px)', maxHeight: 'calc(100vh - 40px)', background: 'var(--card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="check-square" size={16} /></span>
            Новая задача
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', borderRadius: 'var(--radius-sm)' }}>
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflow: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Title */}
          <div style={sec}>
            <label style={lbl}>Название *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Опишите задачу кратко…" style={inp} />
          </div>

          {/* Type + Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={sec}>
              <label style={lbl}>Тип задачи</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} style={sel}>
                {TASK_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <div style={sec}>
              <label style={lbl}>Приоритет</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} style={sel}>
                {TASK_PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Project (shown only in global create) */}
          {!projectId && (
            <div style={sec}>
              <label style={lbl}>Проект</label>
              <select value={form.projectId || ''} onChange={e => set('projectId', e.target.value)} style={sel}>
                <option value="">— Выберите проект —</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          {/* Assignee toggle */}
          <div style={sec}>
            <label style={lbl}>Исполнитель</label>
            <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 8 }}>
              {[{ k: 'person', l: 'Сотрудник' }, { k: 'brigade', l: 'Бригада' }].map(o => (
                <button key={o.k} onClick={() => set('assigneeType', o.k)} style={{
                  flex: 1, height: 32, border: 'none', cursor: 'pointer', fontSize: 13,
                  fontWeight: form.assigneeType === o.k ? 600 : 400,
                  background: form.assigneeType === o.k ? 'var(--primary)' : 'transparent',
                  color: form.assigneeType === o.k ? 'var(--primary-foreground)' : 'var(--foreground)',
                }}>{o.l}</button>
              ))}
            </div>
            {form.assigneeType === 'person' ? (
              <select value={form.assigneeId} onChange={e => set('assigneeId', e.target.value)} style={sel}>
                <option value="">— Не назначен —</option>
                {TASK_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name} · {m.role}</option>)}
              </select>
            ) : (
              <select value={form.brigadeId} onChange={e => set('brigadeId', e.target.value)} style={sel}>
                <option value="">— Не назначена —</option>
                {TASK_BRIGADES.map(b => <option key={b.id} value={b.id}>{b.name} · {b.contractor}</option>)}
              </select>
            )}
          </div>

          {/* Due date */}
          <div style={sec}>
            <label style={lbl}>Срок выполнения</label>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} style={inp} />
          </div>

          {/* Source */}
          <div style={sec}>
            <label style={lbl}>Основание <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>(опционально)</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 8 }}>
              <select value={form.sourceType} onChange={e => set('sourceType', e.target.value)} style={sel}>
                <option value="">— Нет —</option>
                <option value="deviation">Расхождение</option>
                <option value="event">Критическое событие</option>
                <option value="recommendation">Рекомендация AI</option>
              </select>
              <input value={form.sourceLabel} onChange={e => set('sourceLabel', e.target.value)} placeholder="Описание…" style={{ ...inp, opacity: form.sourceType ? 1 : 0.5 }} disabled={!form.sourceType} />
            </div>
          </div>

          {/* Description */}
          <div style={sec}>
            <label style={lbl}>Описание</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Подробное описание задачи…" rows={3} style={{ ...inp, height: 'auto', padding: '8px 10px', resize: 'vertical', fontFamily: 'var(--font-sans)', lineHeight: 1.5 }} />
          </div>

          {/* Attachments drop zone */}
          <div style={{ border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--muted-foreground)', fontSize: 13, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Icon name="paperclip" size={14} />Прикрепить файлы
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="outline" size="sm" onClick={onClose}>Отмена</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Icon name="check" size={13} />Создать задачу
          </Button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

// ── Shared table row ──────────────────────────────────────────────────────────

const TaskRow = ({ task, selected, onClick, hideProject = false }) => {
  const status   = getStatusInfo(task.status);
  const priority = getPriInfo(task.priority);
  const type     = getTypeInfo(task.type);
  const isSel    = selected?.id === task.id;

  return (
    <tr
      onClick={onClick}
      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', background: isSel ? 'color-mix(in oklch, var(--primary) 6%, var(--background))' : 'transparent' }}
      onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--accent)'; }}
      onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Priority dot */}
      <td style={{ padding: '0 4px 0 16px', width: 20 }}>
        <span title={priority.label} style={{ width: 8, height: 8, borderRadius: '50%', background: priority.color, display: 'inline-block' }} />
      </td>

      {/* ID */}
      <td style={{ padding: '12px 10px 12px 4px', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-foreground)' }}>{task.id}</span>
      </td>

      {/* Title */}
      <td style={{ padding: '12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: 'var(--muted-foreground)', display: 'flex', flexShrink: 0 }}><Icon name={type.icon} size={13} /></span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{task.title}</span>
        </div>
        {task.source && (
          <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2, paddingLeft: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="arrow-right" size={10} />{task.source.label}
          </div>
        )}
      </td>

      {/* Project (global only) */}
      {!hideProject && (
        <td style={{ padding: '12px', fontSize: 12, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {task.projectName}
        </td>
      )}

      {/* Assignee */}
      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
        {task.assignee ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <MemberAvatar member={task.assignee} size={24} />
            <span style={{ fontSize: 12 }}>{task.assignee.name.split(' ')[0]}</span>
          </div>
        ) : task.brigade ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="hard-hat" size={12} />
            </div>
            <span style={{ fontSize: 12 }}>{task.brigade.name}</span>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>—</span>
        )}
      </td>

      {/* Due date */}
      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: task.status === 'overdue' ? 'var(--status-crit)' : 'var(--muted-foreground)' }}>
          {task.dueDate || '—'}
        </span>
      </td>

      {/* Status */}
      <td style={{ padding: '12px 16px 12px 0' }}>
        <Badge variant={status.kind} uppercase>
          <StatusDot kind={status.kind} />{status.label}
        </Badge>
      </td>
    </tr>
  );
};

// ── KPI strip ─────────────────────────────────────────────────────────────────

const TaskKpiStrip = ({ tasks }) => {
  const counts = {
    total:   tasks.length,
    open:    tasks.filter(t => t.status === 'open').length,
    active:  tasks.filter(t => t.status === 'in_progress' || t.status === 'review').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    done:    tasks.filter(t => t.status === 'done').length,
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, padding: '14px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
      {[
        { label: 'Всего',      value: counts.total,   kind: 'inactive' },
        { label: 'Открыто',    value: counts.open,    kind: 'info'     },
        { label: 'В работе',   value: counts.active,  kind: 'warn'     },
        { label: 'Просрочено', value: counts.overdue, kind: 'crit'     },
        { label: 'Выполнено',  value: counts.done,    kind: 'ok'       },
      ].map(k => (
        <div key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <StatusDot kind={k.kind} size={8} />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 20 }}>{k.value}</span>
          <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{k.label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Shared toolbar select style ───────────────────────────────────────────────

const toolbarSelect = {
  height: 32, padding: '0 10px', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', background: 'var(--card)', color: 'var(--foreground)',
  fontSize: 13, outline: 'none', cursor: 'pointer',
};

// ── Table header row ──────────────────────────────────────────────────────────

const TaskTableHead = ({ hideProject = false }) => {
  const th = (label, extra = {}) => (
    <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--muted-foreground)', whiteSpace: 'nowrap', ...extra }}>{label}</th>
  );
  return (
    <thead style={{ position: 'sticky', top: 0, background: 'var(--background)', zIndex: 1 }}>
      <tr style={{ borderBottom: '1px solid var(--border)' }}>
        <th style={{ width: 20, padding: '0 0 0 16px' }} />
        {th('ID', { paddingLeft: 4 })}
        {th('Задача')}
        {!hideProject && th('Проект')}
        {th('Исполнитель')}
        {th('Срок')}
        {th('Статус', { paddingRight: 16, paddingLeft: 0 })}
      </tr>
    </thead>
  );
};

const TaskEmptyState = ({ onCreate }) => (
  <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted-foreground)' }}>
    <Icon name="check-square" size={36} />
    <div style={{ marginTop: 12, fontWeight: 500, fontSize: 15 }}>Задачи не найдены</div>
    <div style={{ fontSize: 13, marginTop: 4 }}>Измените фильтр или создайте новую задачу</div>
    {onCreate && (
      <div style={{ marginTop: 16 }}>
        <Button variant="primary" size="sm" onClick={onCreate}>
          <Icon name="plus" size={14} />Создать задачу
        </Button>
      </div>
    )}
  </div>
);

// ── Global Tasks Page ─────────────────────────────────────────────────────────

const TasksPage = () => {
  const [selected,       setSelected]       = useTaskState(null);
  const [statusFilter,   setStatusFilter]   = useTaskState('all');
  const [typeFilter,     setTypeFilter]     = useTaskState('all');
  const [projectFilter,  setProjectFilter]  = useTaskState('all');
  const [search,         setSearch]         = useTaskState('');
  const [showCreate,     setShowCreate]     = useTaskState(false);
  const [tasks,          setTasks]          = useTaskState(ALL_TASKS_DATA);

  const projects = window.PROJECTS || [];
  const q = search.toLowerCase();

  const filtered = tasks.filter(t => {
    if (statusFilter  !== 'all' && t.status    !== statusFilter)  return false;
    if (typeFilter    !== 'all' && t.type      !== typeFilter)    return false;
    if (projectFilter !== 'all' && t.projectId !== projectFilter) return false;
    if (q && !t.title.toLowerCase().includes(q) && !t.projectName.toLowerCase().includes(q)) return false;
    return true;
  });

  const handleCreate = (data) => {
    const newTask = {
      ...data,
      id: `TSK-${String(tasks.length + 1).padStart(3, '0')}`,
      status: 'open',
      createdAt: '25.04.2026',
      createdBy: 'Иванов А.В.',
      attachments: [],
      source: data.sourceType ? { type: data.sourceType, label: data.sourceLabel } : null,
    };
    setTasks(prev => [newTask, ...prev]);
    window.TASKS_OPEN_COUNT = (window.TASKS_OPEN_COUNT || 0) + 1;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--background)' }}>
      <TaskKpiStrip tasks={tasks} />

      {/* Toolbar */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)', pointerEvents: 'none' }}>
            <Icon name="search" size={13} />
          </span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск задач…" style={{ paddingLeft: 30, paddingRight: 12, height: 32, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--card)', color: 'var(--foreground)', fontSize: 13, outline: 'none', width: 200 }} />
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={toolbarSelect}>
          <option value="all">Все статусы</option>
          {TASK_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>

        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={toolbarSelect}>
          <option value="all">Все типы</option>
          {TASK_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>

        <select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} style={toolbarSelect}>
          <option value="all">Все проекты</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{filtered.length} из {tasks.length}</span>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <Icon name="plus" size={14} />Создать задачу
        </Button>
      </div>

      {/* Table + detail panel */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TaskTableHead />
            <tbody>
              {filtered.map(t => (
                <TaskRow key={t.id} task={t} selected={selected}
                  onClick={() => setSelected(s => s?.id === t.id ? null : t)} />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <TaskEmptyState onCreate={() => setShowCreate(true)} />}
        </div>
        {selected && <TaskDetailPanel task={selected} onClose={() => setSelected(null)} />}
      </div>

      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
    </div>
  );
};

// ── Project Tasks Tab ─────────────────────────────────────────────────────────

const ProjectTasksTab = ({ projectId }) => {
  const [selected,     setSelected]     = useTaskState(null);
  const [statusFilter, setStatusFilter] = useTaskState('all');
  const [showCreate,   setShowCreate]   = useTaskState(false);
  const [tasks,        setTasks]        = useTaskState(ALL_TASKS_DATA);

  const filtered = tasks.filter(t => {
    if (t.projectId !== projectId)                           return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const handleCreate = (data) => {
    const proj = (window.PROJECTS || []).find(p => p.id === projectId);
    const newTask = {
      ...data,
      id: `TSK-${String(tasks.length + 1).padStart(3, '0')}`,
      status: 'open',
      projectId,
      projectName: proj?.name || '—',
      createdAt: '25.04.2026',
      createdBy: 'Иванов А.В.',
      attachments: [],
      source: data.sourceType ? { type: data.sourceType, label: data.sourceLabel } : null,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--background)' }}>
      {/* Toolbar */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
        {[{ key: 'all', label: 'Все' }, ...TASK_STATUSES].map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
            padding: '5px 12px', borderRadius: 'var(--radius)', border: '1px solid',
            borderColor: statusFilter === f.key ? 'var(--primary)' : 'var(--border)',
            background:  statusFilter === f.key ? 'var(--primary)' : 'var(--card)',
            color:       statusFilter === f.key ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 12, cursor: 'pointer', fontWeight: statusFilter === f.key ? 600 : 400,
          }}>{f.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          {filtered.length} задач
        </span>
        <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
          <Icon name="plus" size={14} />Создать задачу
        </Button>
      </div>

      {/* Table + detail panel */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TaskTableHead hideProject />
            <tbody>
              {filtered.map(t => (
                <TaskRow key={t.id} task={t} selected={selected} hideProject
                  onClick={() => setSelected(s => s?.id === t.id ? null : t)} />
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <TaskEmptyState onCreate={() => setShowCreate(true)} />}
        </div>
        {selected && <TaskDetailPanel task={selected} onClose={() => setSelected(null)} />}
      </div>

      {showCreate && (
        <CreateTaskModal onClose={() => setShowCreate(false)} onSave={handleCreate} projectId={projectId} />
      )}
    </div>
  );
};

window.TasksPage       = TasksPage;
window.ProjectTasksTab = ProjectTasksTab;
