// TelemetryPage.jsx — global activity log across all projects

const { useState: useTelState, useEffect: useTelEffect, useRef: useTelRef } = React;

/* ── Media thumbnail (small list-row tile) ────────────────────────────────── */
const MediaThumb = ({ media }) => {
  if (!media) return null;
  const isVideo = media.type === 'video';
  const label   = isVideo ? media.duration : String(media.count);
  return (
    <div style={{
      position: 'relative', width: isVideo ? 68 : 46, height: 40, borderRadius: 6,
      background: isVideo
        ? 'linear-gradient(135deg, oklch(0.18 0.07 265) 0%, oklch(0.14 0.09 245) 100%)'
        : 'linear-gradient(135deg, oklch(0.30 0.04 218) 0%, oklch(0.23 0.06 205) 100%)',
      border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
      cursor: 'pointer', overflow: 'hidden',
    }}>
      {isVideo && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="play" size={8} />
          </div>
        </div>
      )}
      <span style={{ color: 'rgba(255,255,255,0.65)', display: 'flex', position: 'relative' }}>
        <Icon name={isVideo ? 'video' : 'camera'} size={12} />
      </span>
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', position: 'relative', lineHeight: 1 }}>{label}</span>
    </div>
  );
};

/* ── Sensor reading chip ─────────────────────────────────────────────────── */
const SensorChip = ({ sensor }) => {
  if (!sensor) return null;
  const color = sensor.status === 'crit' ? 'var(--status-crit)'
    : sensor.status === 'warn' ? 'var(--status-warn)'
    : 'var(--status-ok)';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 4, flexShrink: 0,
      background: `color-mix(in oklch, ${color} 12%, var(--muted))`,
      border: `1px solid color-mix(in oklch, ${color} 28%, var(--border))`,
      fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
    }}>
      <StatusDot kind={sensor.status} size={5} />
      <span style={{ color: 'var(--muted-foreground)' }}>{sensor.tag}</span>
      <span style={{ fontWeight: 600, color }}>{sensor.value}</span>
      {sensor.delta && <span style={{ color, opacity: 0.8 }}>{sensor.delta}</span>}
    </span>
  );
};

/* ── Event detail modal ──────────────────────────────────────────────────── */
const EventDetailModal = ({ event, onClose }) => {
  const [uploads,   setUploads]   = useTelState([]);
  const [taskOpen,  setTaskOpen]  = useTelState(false);
  const [taskTitle, setTaskTitle] = useTelState(() => `Проверить: ${event.text}`);
  const [taskDone,  setTaskDone]  = useTelState(false);
  const [assignee,  setAssignee]  = useTelState('');
  const [priority,  setPriority]  = useTelState('high');
  const fileRef = useTelRef(null);

  const handleFiles = (e) => {
    Array.from(e.target.files).forEach(file => {
      setUploads(prev => [...prev, {
        id: Date.now() + Math.random(),
        name: file.name,
        isVideo: file.type.startsWith('video'),
        url: URL.createObjectURL(file),
        size: (file.size / 1024 / 1024).toFixed(1) + ' МБ',
      }]);
    });
    e.target.value = '';
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) return;
    setTaskDone(true);
    window.TASKS_OPEN_COUNT = (window.TASKS_OPEN_COUNT || 0) + 1;
    window.dispatchEvent(new CustomEvent('tasks-update'));
  };

  const kindLabel = event.kind === 'crit' ? 'Критическое'
    : event.kind === 'warn' ? 'Предупреждение' : 'Выполнено';

  const MOCK_TILES = event.media
    ? Array.from({ length: Math.min(event.media.count || 1, 4) })
    : [];

  const modal = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.52)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 560, maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 60px)',
          background: 'var(--card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'tel-slide-in 0.22s ease',
        }}
      >

        {/* ── Header ── */}
        <div style={{
          padding: '13px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
          background: event.kind === 'crit'
            ? 'color-mix(in oklch, var(--status-crit) 6%, var(--card))'
            : event.kind === 'warn'
            ? 'color-mix(in oklch, var(--status-warn) 5%, var(--card))'
            : 'var(--card)',
          flexShrink: 0,
        }}>
          <StatusDot kind={event.kind} size={8} />
          <span style={{ flex: 1, fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.project}
          </span>
          <Badge variant={event.kind} uppercase>{kindLabel}</Badge>
          <button
            onClick={onClose}
            style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)', transition: 'background .12s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>

          {/* Title */}
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.45, marginBottom: 14 }}>{event.text}</div>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 20, fontSize: 12, color: 'var(--muted-foreground)' }}>
            {event.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Icon name="map-pin" size={12} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{event.location}</span>
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Icon name="user" size={12} />{event.author}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)' }}>
              <Icon name="clock" size={12} />
              {event.date}{event.time ? ` · ${event.time}` : ''}
            </span>
          </div>

          {/* Sensor */}
          {event.sensor && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 8 }}>Датчик</div>
              <SensorChip sensor={event.sensor} />
            </div>
          )}

          {/* Asset link */}
          {(() => {
            const link  = window.GRAPH?.eventLinks?.[event.id];
            const asset = link?.assetId ? window.GRAPH.assets[link.assetId] : null;
            if (!asset) return null;
            const sensorStatus = window.GRAPH.getAssetWorstSensorStatus(asset.id);
            return (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 8 }}>Актив</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                  background: 'color-mix(in oklch, var(--primary) 8%, var(--muted))',
                  border: '1px solid color-mix(in oklch, var(--primary) 20%, var(--border))',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ color: 'var(--primary)', display: 'flex', flexShrink: 0 }}><Icon name="cpu" size={15} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{asset.id}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 1 }}>{asset.type}</div>
                  </div>
                  <StatusDot kind={sensorStatus} size={7} />
                </div>
              </div>
            );
          })()}

          {/* Linked task */}
          {(() => {
            const link     = window.GRAPH?.eventLinks?.[event.id];
            const taskId   = link?.linkedTaskId;
            const taskData = taskId ? window.ALL_TASKS_DATA?.find(t => t.id === taskId) : null;
            if (!taskData) return null;
            const statusMap = {
              open:        { label: 'Открыта',     color: 'var(--primary)'      },
              in_progress: { label: 'В работе',    color: 'var(--status-warn)'  },
              done:        { label: 'Выполнена',   color: 'var(--status-ok)'    },
              overdue:     { label: 'Просрочена',  color: 'var(--status-crit)'  },
            };
            const s = statusMap[taskData.status] || { label: taskData.status, color: 'var(--muted-foreground)' };
            return (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 8 }}>Связанная задача</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                  background: 'color-mix(in oklch, var(--status-warn) 7%, var(--muted))',
                  border: '1px solid color-mix(in oklch, var(--status-warn) 20%, var(--border))',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  <span style={{ color: 'var(--status-warn)', display: 'flex', flexShrink: 0 }}><Icon name="check-square" size={15} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', marginBottom: 2 }}>{taskData.id}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{taskData.title}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.color, flexShrink: 0 }}>{s.label}</span>
                </div>
              </div>
            );
          })()}

          {/* ── Media section ── */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 10 }}>
              Медиафайлы
              {(MOCK_TILES.length + uploads.length) > 0 && (
                <span style={{ marginLeft: 8, fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
                  {MOCK_TILES.length + uploads.length} файл{(MOCK_TILES.length + uploads.length) > 1 ? 'а' : ''}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>

              {/* Mock tiles for pre-existing media */}
              {MOCK_TILES.map((_, idx) => {
                const isVid = event.media.type === 'video' && idx === 0;
                const showMore = idx === 3 && event.media.count > 4;
                return (
                  <div key={idx} style={{
                    width: 88, height: 66, borderRadius: 8, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', position: 'relative',
                    background: isVid
                      ? 'linear-gradient(135deg, oklch(0.18 0.07 265) 0%, oklch(0.14 0.09 245) 100%)'
                      : `linear-gradient(145deg, oklch(${0.26 + idx * 0.03} 0.04 ${215 + idx * 12}) 0%, oklch(${0.20 + idx * 0.02} 0.06 ${200 + idx * 10}) 100%)`,
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isVid ? (
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="play" size={10} />
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                        <Icon name="image" size={16} />
                      </span>
                    )}
                    {showMore && (
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                        +{event.media.count - 4}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Uploaded files — real preview */}
              {uploads.map(f => (
                <div key={f.id} style={{ position: 'relative', width: 88, height: 66, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', flexShrink: 0 }}>
                  {f.isVideo ? (
                    <>
                      <video src={f.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted playsInline />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="play" size={9} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={f.url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  {/* Size badge */}
                  <span style={{ position: 'absolute', bottom: 3, right: 4, fontSize: 8, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.45)', padding: '1px 4px', borderRadius: 3 }}>
                    {f.size}
                  </span>
                </div>
              ))}

              {/* Upload button */}
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  width: 88, height: 66, borderRadius: 8, flexShrink: 0,
                  border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                  color: 'var(--muted-foreground)', transition: 'border-color .15s, color .15s, background .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'color-mix(in oklch, var(--primary) 5%, transparent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name="plus" size={18} />
                <span style={{ fontSize: 10, fontWeight: 500 }}>Загрузить</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            </div>
          </div>

          {/* ── Create task section ── */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-foreground)', marginBottom: 12 }}>
              Задача
            </div>

            {taskDone ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                background: 'color-mix(in oklch, var(--status-ok) 10%, var(--muted))',
                border: '1px solid color-mix(in oklch, var(--status-ok) 28%, var(--border))',
                borderRadius: 'var(--radius)', color: 'var(--status-ok)', fontSize: 13,
              }}>
                <Icon name="check-circle" size={16} />
                <span style={{ fontWeight: 500 }}>Задача добавлена в список</span>
              </div>
            ) : !taskOpen ? (
              <button
                onClick={() => setTaskOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '10px 14px', borderRadius: 'var(--radius)',
                  border: '1px dashed var(--border)', background: 'transparent', cursor: 'pointer',
                  color: 'var(--muted-foreground)', fontSize: 13, fontFamily: 'var(--font-sans)',
                  transition: 'border-color .15s, color .15s, background .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'color-mix(in oklch, var(--primary) 4%, transparent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted-foreground)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name="plus-circle" size={15} />
                Назначить задачу по этому событию
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="Описание задачи"
                  style={{
                    width: '100%', height: 38, padding: '0 12px',
                    borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                    background: 'var(--background)', color: 'var(--foreground)',
                    fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={assignee} onChange={e => setAssignee(e.target.value)}
                    style={{ flex: 1, height: 34, padding: '0 10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="">Исполнитель…</option>
                    <option>Петров Д.К.</option>
                    <option>Иванов А.В.</option>
                    <option>Сидоров В.П.</option>
                    <option>ОТК</option>
                  </select>
                  <select
                    value={priority} onChange={e => setPriority(e.target.value)}
                    style={{ width: 130, height: 34, padding: '0 10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 13, cursor: 'pointer' }}
                  >
                    <option value="crit">Критический</option>
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 2 }}>
                  <button
                    onClick={() => setTaskOpen(false)}
                    style={{ padding: '7px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}
                  >Отмена</button>
                  <button
                    onClick={handleCreateTask}
                    style={{
                      padding: '7px 18px', borderRadius: 'var(--radius)', background: 'var(--primary)',
                      border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                      color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <Icon name="check-square" size={13} />
                    Создать задачу
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

window.MediaThumb      = MediaThumb;
window.SensorChip      = SensorChip;
window.EventDetailModal = EventDetailModal;

/* ── Base event data ─────────────────────────────────────────────────────── */
const BASE_EVENTS = [
  {
    id: 1, date: '23.04.2026', time: '14:32',
    project: 'ЭЛОУ-АВТ-6 · Блок 2', kind: 'warn',
    text: 'Расхождение: толщина стенки V-1208 −0,8 мм',
    author: 'Петров Д.К.', location: 'V-1208 · Секция 4',
    media: { type: 'photo', count: 3 },
    sensor: { tag: 'TI-1208-01', value: '342°C', delta: '+7°C', status: 'warn' },
  },
  {
    id: 2, date: '23.04.2026', time: '11:15',
    project: 'НПЗ Кстово, установка-3', kind: 'crit',
    text: 'Нарушение допуска: отклонение арматуры +120 мм по оси Z',
    author: 'Авт. мониторинг', location: 'Ось Z · Колонна K-3',
    media: { type: 'video', duration: '0:42' }, sensor: null,
  },
  {
    id: 3, date: '22.04.2026', time: '17:48',
    project: 'Ванкорский кластер', kind: 'warn',
    text: 'Риск задержки: монтаж секции 4-Б отстаёт от графика на 3 дня',
    author: 'Система', location: 'Секция 4-Б',
    media: null, sensor: null,
  },
  {
    id: 4, date: '22.04.2026', time: '09:20',
    project: 'Газоперерабатывающий-2', kind: 'ok',
    text: 'Модель обновлена: версия v2.8 загружена успешно',
    author: 'BIM-отдел', location: null,
    media: null, sensor: null,
  },
  {
    id: 5, date: '21.04.2026', time: '16:05',
    project: 'ЭЛОУ-АВТ-6 · Блок 2', kind: 'ok',
    text: 'Документ добавлен: Паспорт оборудования P-2340-A',
    author: 'Иванов А.В.', location: 'P-2340-A',
    media: { type: 'photo', count: 7 }, sensor: null,
  },
  {
    id: 6, date: '21.04.2026', time: '13:30',
    project: 'Терминал Усть-Луга', kind: 'ok',
    text: 'Этап «Фундамент» закрыт, акт КС-2 подписан',
    author: 'ОТК', location: null,
    media: { type: 'photo', count: 12 }, sensor: null,
  },
  {
    id: 7, date: '20.04.2026', time: '10:00',
    project: 'ЭЛОУ-АВТ-6 · Блок 2', kind: 'warn',
    text: 'Расхождение зафиксировано: смещение по оси X +45 мм',
    author: 'Сидоров В.П.', location: 'V-1208 · Ось X',
    media: { type: 'video', duration: '1:14' },
    sensor: { tag: 'PI-1208-02', value: '0,89 МПа', delta: '+0,05', status: 'warn' },
  },
  {
    id: 8, date: '19.04.2026', time: '15:22',
    project: 'Астраханский ГПЗ', kind: 'ok',
    text: 'Проект переведён в статус «Завершён»',
    author: 'Система', location: null,
    media: null, sensor: null,
  },
  {
    id: 9, date: '18.04.2026', time: '11:10',
    project: 'Ванкорский кластер', kind: 'warn',
    text: 'Качество сварных швов ниже нормы на участке B-11',
    author: 'ОТК', location: 'Участок B-11',
    media: { type: 'photo', count: 5 }, sensor: null,
  },
  {
    id: 10, date: '17.04.2026', time: '09:45',
    project: 'НПЗ Кстово, установка-3', kind: 'crit',
    text: 'Срок сдачи под угрозой: задержка поставки колонны K-3',
    author: 'Система', location: null,
    media: null, sensor: null,
  },
  {
    id: 11, date: '16.04.2026', time: '14:00',
    project: 'Газоперерабатывающий-2', kind: 'ok',
    text: 'Осмотр завершён, замечания не выявлены',
    author: 'СУ-17', location: null,
    media: { type: 'photo', count: 4 }, sensor: null,
  },
  {
    id: 12, date: '15.04.2026', time: '08:30',
    project: 'Терминал Усть-Луга', kind: 'ok',
    text: 'Версия модели v1.9 одобрена, передана заказчику',
    author: 'BIM-отдел', location: null,
    media: null, sensor: null,
  },
];

const LIVE_STREAM_EVENTS = [
  {
    project: 'ЭЛОУ-АВТ-6 · Блок 2', kind: 'crit',
    text: 'Аварийный сигнал: превышение давления в E-4401 — 2,4 МПа',
    author: 'Авт. мониторинг', location: 'E-4401',
    media: null,
    sensor: { tag: 'PI-4401-01', value: '2,4 МПа', delta: '+0,3', status: 'crit' },
  },
  {
    project: 'Ванкорский кластер', kind: 'warn',
    text: 'Задержка бетонирования участка Д-12: работы приостановлены',
    author: 'Бригада Б-02', location: 'Участок Д-12',
    media: { type: 'photo', count: 2 }, sensor: null,
  },
  {
    project: 'Газоперерабатывающий-2', kind: 'ok',
    text: 'Сварные швы секции 7 проверены — соответствие ГОСТ подтверждено',
    author: 'ОТК', location: 'Секция 7',
    media: { type: 'photo', count: 8 }, sensor: null,
  },
  {
    project: 'НПЗ Кстово, установка-3', kind: 'warn',
    text: 'Отклонение уровня в ёмкости T-401: 78% (предупреждение)',
    author: 'Авт. мониторинг', location: 'T-401',
    media: null,
    sensor: { tag: 'LI-401-01', value: '78%', delta: '+12%', status: 'warn' },
  },
  {
    project: 'Терминал Усть-Луга', kind: 'ok',
    text: 'Монтаж стальных конструкций блока А завершён досрочно',
    author: 'СУ-17', location: 'Блок А',
    media: { type: 'video', duration: '2:05' }, sensor: null,
  },
];

window.BASE_EVENTS = BASE_EVENTS;

let _telIdCounter = 200;

/* ── Page component ──────────────────────────────────────────────────────── */
const TelemetryPage = () => {
  const [events,        setEvents]        = useTelState(BASE_EVENTS);
  const [filter,        setFilter]        = useTelState('all');
  const [newCount,      setNewCount]      = useTelState(0);
  const [selectedEvent, setSelectedEvent] = useTelState(null);
  const streamIdxRef = useTelRef(0);

  useTelEffect(() => {
    const id = setInterval(() => {
      if (streamIdxRef.current >= LIVE_STREAM_EVENTS.length) return;
      const tmpl = LIVE_STREAM_EVENTS[streamIdxRef.current++];
      const now = new Date();
      const hh  = String(now.getHours()).padStart(2, '0');
      const mm  = String(now.getMinutes()).padStart(2, '0');
      const newEv = { ...tmpl, id: ++_telIdCounter, date: '26.04.2026', time: `${hh}:${mm}`, isNew: true };
      setEvents(prev => [newEv, ...prev]);
      setNewCount(prev => prev + 1);
      window.TELEMETRY_UNREAD = (window.TELEMETRY_UNREAD || 0) + 1;
      window.dispatchEvent(new CustomEvent('telemetry-update'));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const counts   = events.reduce((a, e) => { a[e.kind] = (a[e.kind] || 0) + 1; return a; }, {});
  const filtered = filter === 'all' ? events : events.filter(e => e.kind === filter);

  const STAT_CARDS = [
    { kind: 'crit', label: 'Критичных',  icon: 'alert-circle',   color: 'var(--status-crit)' },
    { kind: 'warn', label: 'Внимание',   icon: 'alert-triangle', color: 'var(--status-warn)' },
    { kind: 'ok',   label: 'Успешных',   icon: 'check-circle',   color: 'var(--status-ok)'   },
  ];
  const FILTERS = [['all', 'Все события'], ['crit', 'Критичные'], ['warn', 'Внимание'], ['ok', 'Успешные']];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>Телеметрия</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 10,
              background: 'color-mix(in oklch, var(--status-ok) 14%, var(--muted))',
              border: '1px solid color-mix(in oklch, var(--status-ok) 28%, var(--border))',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--status-ok)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-ok)', animation: 'live-pulse 1.8s ease-in-out infinite', display: 'inline-block' }} />
              Live
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 2 }}>Лог событий по всем проектам · нажмите на строку для деталей</div>
        </div>
        <Button variant="outline" size="sm"><Icon name="download" size={14} />Экспорт</Button>
      </div>

      {/* New-events banner */}
      {newCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', marginBottom: 16,
          background: 'color-mix(in oklch, var(--primary) 7%, var(--card))',
          border: '1px solid color-mix(in oklch, var(--primary) 28%, var(--border))',
          borderRadius: 'var(--radius)', animation: 'tel-slide-in 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--primary)', display: 'flex' }}><Icon name="bell" size={14} /></span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              {newCount} {newCount === 1 ? 'новое событие' : newCount < 5 ? 'новых события' : 'новых событий'}
            </span>
          </div>
          <button onClick={() => setNewCount(0)} style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>Скрыть</button>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {STAT_CARDS.map(({ kind, label, icon, color }) => (
          <div key={kind} onClick={() => setFilter(filter === kind ? 'all' : kind)} style={{
            flex: 1, padding: '16px 20px', cursor: 'pointer', background: 'var(--card)',
            border: '1px solid ' + (filter === kind ? 'var(--primary)' : 'var(--border)'),
            borderRadius: 'var(--radius-md)', transition: 'border-color .15s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, fontVariantNumeric: 'tabular-nums' }}>{counts[kind] || 0}</div>
              <span style={{ color }}><Icon name={icon} size={18} /></span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
        {FILTERS.map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
            background: filter === f ? 'var(--primary)' : 'transparent',
            color: filter === f ? 'var(--primary-foreground)' : 'var(--foreground)',
            fontSize: 12, cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
          }}>{label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>{filtered.length} событий</span>
      </div>

      {/* Event list */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {filtered.map((e, i) => (
          <div
            key={e.id}
            onClick={() => setSelectedEvent(e)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              background: e.isNew ? 'color-mix(in oklch, var(--primary) 4%, var(--card))' : 'var(--card)',
              animation: e.isNew ? 'tel-slide-in 0.35s ease' : 'none',
              cursor: 'pointer', transition: 'background .1s',
            }}
            onMouseEnter={ev => ev.currentTarget.style.background = 'var(--accent)'}
            onMouseLeave={ev => ev.currentTarget.style.background = e.isNew ? 'color-mix(in oklch, var(--primary) 4%, var(--card))' : 'var(--card)'}
          >
            <div style={{ marginTop: 4, flexShrink: 0 }}><StatusDot kind={e.kind} size={8} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flexWrap: 'wrap' }}>
                {e.isNew && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 3, flexShrink: 0, marginTop: 1, background: 'color-mix(in oklch, var(--primary) 18%, transparent)', color: 'var(--primary)' }}>NEW</span>
                )}
                <span style={{ fontSize: 13, fontWeight: e.kind !== 'ok' ? 500 : 400 }}>{e.text}</span>
              </div>
              {e.location && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, fontSize: 11, color: 'var(--muted-foreground)' }}>
                  <Icon name="map-pin" size={10} />
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{e.location}</span>
                </div>
              )}
              {window.GRAPH?.eventLinks?.[e.id]?.assetId && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, marginLeft: 8,
                  padding: '1px 7px', borderRadius: 4,
                  fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
                  background: 'color-mix(in oklch, var(--primary) 10%, var(--muted))',
                  border: '1px solid color-mix(in oklch, var(--primary) 22%, var(--border))',
                  color: 'var(--primary)',
                }}>
                  <Icon name="cpu" size={10} />
                  {window.GRAPH.eventLinks[e.id].assetId}
                </div>
              )}
              {(e.media || e.sensor) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <MediaThumb media={e.media} />
                  <SensorChip sensor={e.sensor} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 6, fontSize: 11, color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                <span>{e.project}</span><span>·</span><span>{e.author}</span>
              </div>
            </div>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <div style={{ textAlign: 'right', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
                <div>{e.date}</div>
                <div>{e.time}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Icon name="chevron-right" size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedEvent && (
        <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

window.TelemetryPage = TelemetryPage;
