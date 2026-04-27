// MediaPage.jsx — project photo & video gallery

// Thumbnail component: renders real file or a labelled placeholder
const Thumb = ({ item }) => {
  const style = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };

  if (item.src) {
    if (item.type === 'video') {
      return <video src={item.src} poster={item.poster || undefined} style={style} preload="metadata" />;
    }
    return <img src={item.src} alt={item.name} style={style} />;
  }

  // No file assigned yet — show a placeholder with the item name
  return (
    <div style={{ width: '100%', height: '100%', background: '#111a22', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12 }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
        {item.type === 'video'
          ? <><rect x="2" y="5" width="20" height="14" rx="2"/><polygon points="10,9 16,12 10,15"/></>
          : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></>}
      </svg>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textAlign: 'center', fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>{item.name}</span>
    </div>
  );
};

// ─── ДОБАВЬТЕ СВОИ ФАЙЛЫ СЮДА ────────────────────────────────────────────────
// Положите файлы в папку: project/ui_kits/platform/media/
// Для каждой записи укажите путь в поле src, например:
//   src: 'media/photo1.jpg'
//   src: 'media/video1.mp4'   + poster: 'media/video1-thumb.jpg'  (для видео, необязательно)
// Если src не указан — отображается серая заглушка с названием.
// ─────────────────────────────────────────────────────────────────────────────
const MEDIA = [
  { id: 1, type: 'photo', name: 'Монтаж теплообменника E-4401',        date: '23.04.2026', author: 'Петров Д.К.',  size: '4,2 МБ',
    src: 'media/media1.webp' },
  { id: 2, type: 'photo', name: 'Трещина в сварном шве — E-4401',      date: '23.04.2026', author: 'ОТК',          size: '3,8 МБ',  crit: true,
    src: 'media/media2.webp' },
  { id: 3, type: 'video', name: 'Обход объекта 22.04.2026',             date: '22.04.2026', author: 'Иванов А.В.', size: '248 МБ',  duration: '4:32',
    src: 'media/media3.mp4',  poster: '' },
  { id: 4, type: 'photo', name: 'Колонна V-1208 — расхождение стенки', date: '12.03.2026', author: 'ОТК',          size: '3,1 МБ',  warn: true,
    src: 'media/media4.jpg' },
  { id: 5, type: 'photo', name: 'Платформенные кольца V-1208',          date: '15.04.2026', author: 'Петров Д.К.', size: '5,3 МБ',
    src: 'media/media5.jpg' },
  { id: 6, type: 'video', name: 'Проверка насосной группы P-2340',      date: '10.04.2026', author: 'Сидоров В.П.',size: '182 МБ',  duration: '2:15',
    src: 'media/media6.mp4',  poster: '' },
  { id: 7, type: 'photo', name: 'Обвязка трубопроводов — общий вид',   date: '05.04.2026', author: 'BIM-отдел',   size: '4,7 МБ',
    src: 'media/media7.jpeg' },
  { id: 8, type: 'photo', name: 'Армирование фундаментных плит',        date: '18.02.2026', author: 'Иванов А.В.', size: '6,2 МБ',
    src: 'media/media8.jpg' },
  { id: 9, type: 'video', name: 'Drone-облёт площадки 01.04.2026',      date: '01.04.2026', author: 'BIM-отдел',   size: '512 МБ',  duration: '7:48',
    src: 'media/media9.mp4',  poster: '' },
];

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ items, idx, onClose, onNav }) => {
  const item = items[idx];

  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowRight')  onNav(1);
      if (e.key === 'ArrowLeft')   onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!item) return null;

  const btnBase = {
    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff', borderRadius: 8, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', transition: 'background .15s',
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)',
               display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Close */}
      <button onClick={onClose}
        style={{ ...btnBase, position: 'absolute', top: 16, right: 16, width: 40, height: 40, fontSize: 20 }}>
        ×
      </button>

      {/* Prev */}
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); onNav(-1); }}
          style={{ ...btnBase, position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, fontSize: 22 }}>
          ‹
        </button>
      )}

      {/* Next */}
      {idx < items.length - 1 && (
        <button onClick={e => { e.stopPropagation(); onNav(1); }}
          style={{ ...btnBase, position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, fontSize: 22 }}>
          ›
        </button>
      )}

      {/* Counter */}
      <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
                    fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>
        {idx + 1} / {items.length}
      </div>

      {/* Media */}
      <div onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '78vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {item.src
          ? item.type === 'video'
            ? <video key={item.id} src={item.src} poster={item.poster || undefined} controls autoPlay
                style={{ maxWidth: '90vw', maxHeight: '78vh', borderRadius: 8, outline: 'none' }} />
            : <img key={item.id} src={item.src} alt={item.name}
                style={{ maxWidth: '90vw', maxHeight: '78vh', objectFit: 'contain', borderRadius: 8, display: 'block' }} />
          : (
            <div style={{ width: 480, height: 300, background: '#111a22', borderRadius: 8,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2">
                {item.type === 'video'
                  ? <><rect x="2" y="5" width="20" height="14" rx="2"/><polygon points="10,9 16,12 10,15"/></>
                  : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></>}
              </svg>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Файл не привязан</span>
            </div>
          )
        }
      </div>

      {/* Info bar */}
      <div onClick={e => e.stopPropagation()}
        style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 24,
                 background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 24px',
                 maxWidth: '90vw', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{item.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>
            {item.date} · {item.author}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {item.duration && (
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>{item.duration}</span>
          )}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>{item.size}</span>
          {item.crit && <span style={{ background: 'var(--status-crit)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4 }}>Дефект</span>}
          {item.warn && <span style={{ background: 'var(--status-warn)', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4 }}>Внимание</span>}
        </div>
      </div>
    </div>
  );
};

const FILTERS = ['Все', 'Фото', 'Видео', 'Дефекты'];

const MediaPage = () => {
  const [filter, setFilter] = React.useState('Все');
  const [lightboxIdx, setLightboxIdx] = React.useState(null);

  const visible = MEDIA.filter(m => {
    if (filter === 'Фото')    return m.type === 'photo';
    if (filter === 'Видео')   return m.type === 'video';
    if (filter === 'Дефекты') return m.crit || m.warn;
    return true;
  });

  const photos = MEDIA.filter(m => m.type === 'photo').length;
  const videos = MEDIA.filter(m => m.type === 'video').length;

  const openItem = idx => setLightboxIdx(idx);
  const closeItem = () => setLightboxIdx(null);
  const navItem = delta => setLightboxIdx(i => Math.max(0, Math.min(visible.length - 1, i + delta)));

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>

      {lightboxIdx !== null && (
        <Lightbox items={visible} idx={lightboxIdx} onClose={closeItem} onNav={navItem} />
      )}

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
        {visible.map((m, idx) => (
          <div key={m.id}
            onClick={() => openItem(idx)}
            style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'box-shadow .15s, border-color .15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            {/* Thumbnail */}
            <div style={{ height: 140, position: 'relative', overflow: 'hidden' }}>
              <Thumb item={m} />

              {/* Video overlay — play button + duration */}
              {m.type === 'video' && (
                <>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Icon name="play" size={18} />
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
                <IconBtn style={{ width: 26, height: 26 }} title="Скачать" onClick={e => e.stopPropagation()}>
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
