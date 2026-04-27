// DocumentsPage.jsx
const { useState: useDocState } = React;

const DOC_DATA = [
  { id:1,  projectId:'elou-6',   project:'ЭЛОУ-АВТ-6 · Блок 2',        type:'Разрешение',                  number:'РР-2026-0147', title:'Разрешение на высотные работы (корпус А)',      status:'expiring', date:'01.02.2026', expires:'30.04.2026', author:'Иванов А.В.',   size:'1,2 МБ'  },
  { id:2,  projectId:'elou-6',   project:'ЭЛОУ-АВТ-6 · Блок 2',        type:'Разрешение',                  number:'РР-2026-0148', title:'Разрешение на высотные работы (корпус Б)',      status:'expiring', date:'01.02.2026', expires:'30.04.2026', author:'Иванов А.В.',   size:'1,1 МБ'  },
  { id:15, projectId:'elou-6',   project:'ЭЛОУ-АВТ-6 · Блок 2',        type:'Разрешение',                  number:'РР-2026-0149', title:'Разрешение на высотные работы (корпус В)',      status:'expiring', date:'01.02.2026', expires:'30.04.2026', author:'Иванов А.В.',   size:'1,0 МБ'  },
  { id:3,  projectId:'elou-6',   project:'ЭЛОУ-АВТ-6 · Блок 2',        type:'Акт',                         number:'КС-2 №18',    title:'Акт выполненных работ — этап «Обвязка»',        status:'active',   date:'18.04.2026', expires:null,         author:'ОТК',           size:'3,4 МБ'  },
  { id:4,  projectId:'elou-6',   project:'ЭЛОУ-АВТ-6 · Блок 2',        type:'Проектная документация',      number:'П-4401-А',    title:'Паспорт оборудования E-4401',                   status:'active',   date:'21.04.2026', expires:null,         author:'Иванов А.В.',  size:'8,7 МБ'  },
  { id:5,  projectId:'elou-6',   project:'ЭЛОУ-АВТ-6 · Блок 2',        type:'Исполнительная документация', number:'ИД-023',      title:'Исполнительная схема монтажа V-1208',           status:'draft',    date:'24.04.2026', expires:null,         author:'Петров Д.К.',  size:'5,1 МБ'  },
  { id:6,  projectId:'gpz-2',    project:'Газоперерабатывающий-2',      type:'Договор',                     number:'Д-2026-0089', title:'Договор на монтаж с ООО «СеверГазСтрой»',       status:'active',   date:'15.01.2026', expires:'31.12.2026', author:'Юрист',         size:'2,2 МБ'  },
  { id:7,  projectId:'gpz-2',    project:'Газоперерабатывающий-2',      type:'Акт',                         number:'КС-2 №05',   title:'Акт выполненных работ — фундамент корп. 3',     status:'active',   date:'10.04.2026', expires:null,         author:'ОТК',           size:'2,8 МБ'  },
  { id:8,  projectId:'ust-luga', project:'Терминал Усть-Луга',           type:'Разрешение',                  number:'РР-2026-0211',title:'Разрешение на строительство терминала Т-1',     status:'active',   date:'01.03.2026', expires:'01.03.2027', author:'Смирнов П.К.',  size:'4,5 МБ'  },
  { id:9,  projectId:'ust-luga', project:'Терминал Усть-Луга',           type:'Исполнительная документация', number:'ИД-077',      title:'Исполнительные схемы армирования плит №1–3',   status:'active',   date:'20.04.2026', expires:null,         author:'Архипов С.',    size:'12,3 МБ' },
  { id:10, projectId:'vankor',   project:'Ванкорский кластер',            type:'Договор',                     number:'Д-2026-0041', title:'Договор поставки трубопровода Ду-1200',         status:'active',   date:'05.02.2026', expires:'30.06.2026', author:'Сорокин И.',    size:'1,8 МБ'  },
  { id:11, projectId:'vankor',   project:'Ванкорский кластер',            type:'Проектная документация',      number:'ПД-1120-Б',   title:'Рабочая документация трубопровода DN1200',     status:'active',   date:'28.03.2026', expires:null,         author:'ПКБ-3',         size:'34,2 МБ' },
  { id:12, projectId:'kstovo',   project:'НПЗ Кстово, установка-3',      type:'Разрешение',                  number:'РР-2025-1088',title:'Разрешение на проведение огневых работ',        status:'expired',  date:'01.10.2025', expires:'01.04.2026', author:'Козлов Н.',     size:'0,9 МБ'  },
  { id:13, projectId:'kstovo',   project:'НПЗ Кстово, установка-3',      type:'Акт',                         number:'КС-2 №02',   title:'Акт освидетельствования скрытых работ (сваи)', status:'active',   date:'02.03.2026', expires:null,         author:'ОТК',           size:'1,5 МБ'  },
  { id:14, projectId:'astra',    project:'Астраханский ГПЗ',              type:'Акт',                         number:'КС-11 №01',  title:'Акт приёмки законченного строительства',        status:'active',   date:'05.04.2026', expires:null,         author:'Комиссия',      size:'7,6 МБ'  },
];

const DOC_TYPE_META = {
  'Разрешение':                  { icon:'shield',       variant:'info'     },
  'Договор':                     { icon:'briefcase',    variant:'default'  },
  'Акт':                         { icon:'check-circle', variant:'ok'       },
  'Проектная документация':      { icon:'layers',       variant:'info'     },
  'Исполнительная документация': { icon:'file-text',    variant:'inactive' },
};

const DOC_STATUS_META = {
  active:   { label:'Действует', variant:'ok'       },
  expiring: { label:'Истекает',  variant:'warn'     },
  expired:  { label:'Истёк',     variant:'crit'     },
  draft:    { label:'Черновик',  variant:'inactive' },
};

const DOC_TYPES = ['Все типы', 'Разрешение', 'Договор', 'Акт', 'Проектная документация', 'Исполнительная документация'];

const STATUS_FILTERS = [
  { key:'all',      label:'Все'          },
  { key:'active',   label:'Действующие'  },
  { key:'expiring', label:'Истекают'     },
  { key:'expired',  label:'Истёкшие'     },
  { key:'draft',    label:'Черновики'    },
];

const DOC_DETAIL = {
  1:  { description: 'Разрешение на проведение высотных работ в корпусе А объекта ЭЛОУ-АВТ-6 · Блок 2. Выдано территориальным органом Ростехнадзора. Действительно для работ на отметках выше 5 м. Ответственный производитель работ — Иванов А.В.', events: [{ date:'01.02.2026', kind:'ok', text:'Документ загружен в систему, автор: Иванов А.В.' }, { date:'05.02.2026', kind:'ok', text:'Пройдена входная проверка службой ОТК' }, { date:'22.04.2026', kind:'warn', text:'Отправлен запрос на продление в Ростехнадзор' }] },
  2:  { description: 'Разрешение на проведение высотных работ в корпусе Б объекта ЭЛОУ-АВТ-6 · Блок 2. Аналогично РР-2026-0147, распространяется исключительно на работы в корпусе Б.', events: [{ date:'01.02.2026', kind:'ok', text:'Документ загружен в систему, автор: Иванов А.В.' }, { date:'22.04.2026', kind:'warn', text:'Отправлен запрос на продление в Ростехнадзор' }] },
  15: { description: 'Разрешение на проведение высотных работ в корпусе В объекта ЭЛОУ-АВТ-6 · Блок 2.', events: [{ date:'01.02.2026', kind:'ok', text:'Документ загружен в систему, автор: Иванов А.В.' }, { date:'22.04.2026', kind:'warn', text:'Направлен запрос на продление' }] },
  3:  { description: 'Акт выполненных работ по этапу «Обвязка» в соответствии с проектом. Подписан заказчиком, подрядчиком и представителем ОТК. Является основанием для оплаты по договору с СУ-17.', events: [{ date:'15.04.2026', kind:'ok', text:'Акт сформирован бригадой Б-02 по завершении этапа' }, { date:'17.04.2026', kind:'ok', text:'Направлен на подписание заказчику' }, { date:'18.04.2026', kind:'ok', text:'Подписан всеми сторонами, загружен в систему. Автор: ОТК' }] },
  4:  { description: 'Паспорт теплообменника E-4401. Площадь теплообмена: 1 240 м². Материал корпуса: 12Х18Н10Т. Рабочее давление: 2,1 МПа. Документ подтверждает соответствие оборудования проектным характеристикам.', events: [{ date:'15.04.2026', kind:'ok', text:'Паспорт получен от завода-изготовителя' }, { date:'21.04.2026', kind:'ok', text:'Загружен в систему, прошёл входной контроль. Автор: Иванов А.В.' }] },
  5:  { description: 'Исполнительная схема монтажа сосуда V-1208. Отражает фактическое положение оборудования после монтажа. Черновик — требуется финальная проверка координат после устранения отклонений по оси X.', events: [{ date:'20.04.2026', kind:'ok', text:'Начата подготовка схемы. Автор: Петров Д.К.' }, { date:'23.04.2026', kind:'warn', text:'Приостановлено — ожидается устранение отклонений V-1208' }, { date:'24.04.2026', kind:'ok', text:'Черновик загружен в систему' }] },
  6:  { description: 'Договор на выполнение монтажных работ объекта Газоперерабатывающий-2 с ООО «СеверГазСтрой». Стоимость по договору: 1,84 млрд ₽. Срок исполнения: 31 декабря 2026 г.', events: [{ date:'10.01.2026', kind:'ok', text:'Договор согласован юридическим отделом' }, { date:'15.01.2026', kind:'ok', text:'Подписан обеими сторонами, загружен в систему' }, { date:'01.04.2026', kind:'ok', text:'Пройдена плановая проверка исполнения' }] },
  7:  { description: 'Акт выполненных работ по устройству фундамента корпуса 3, ГПЗ-2. Работы выполнены в соответствии с проектом. Подписан комиссией: заказчик, подрядчик, технадзор.', events: [{ date:'08.04.2026', kind:'ok', text:'Акт подготовлен по завершении этапа' }, { date:'10.04.2026', kind:'ok', text:'Подписан и загружен в систему. Автор: ОТК' }] },
  8:  { description: 'Разрешение на строительство терминала Т-1 в порту Усть-Луга. Выдано Министерством строительства Ленинградской области. Действительно до 1 марта 2027 г.', events: [{ date:'01.03.2026', kind:'ok', text:'Разрешение получено и загружено в систему' }, { date:'10.03.2026', kind:'ok', text:'Пройдена регистрация в органах надзора' }] },
  9:  { description: 'Исполнительные схемы армирования фундаментных плит №1–3, терминал Т-1. Схемы составлены по результатам геодезической съёмки после укладки арматуры.', events: [{ date:'18.04.2026', kind:'ok', text:'Геодезическая съёмка завершена' }, { date:'20.04.2026', kind:'ok', text:'Схемы загружены в систему. Автор: Архипов С.' }] },
  10: { description: 'Договор поставки трубопроводов Ду-1200 для Ванкорского кластера. Поставщик: АО «ТМК». Стоимость: 182 млн ₽. Срок поставки: до 30 июня 2026 г.', events: [{ date:'01.02.2026', kind:'ok', text:'Запрос коммерческих предложений направлен поставщикам' }, { date:'05.02.2026', kind:'ok', text:'Договор с АО «ТМК» подписан и загружен' }, { date:'15.04.2026', kind:'ok', text:'Получено подтверждение отгрузки 1-й партии' }] },
  11: { description: 'Рабочая документация на магистральный трубопровод DN1200 Ванкорского кластера. Включает общий вид, деталировочные чертежи, сварочные карты и технические условия на материалы.', events: [{ date:'10.03.2026', kind:'ok', text:'РД передана проектным институтом ПКБ-3' }, { date:'28.03.2026', kind:'ok', text:'Загружена в систему, прошла входной контроль' }] },
  12: { description: 'Разрешение на проведение огневых работ, НПЗ Кстово, установка-3. Срок действия истёк 1 апреля 2026 г. Необходимо получить новое разрешение для продолжения сварочных работ на объекте.', events: [{ date:'01.10.2025', kind:'ok', text:'Разрешение получено и загружено в систему' }, { date:'25.03.2026', kind:'warn', text:'Направлен запрос на продление в надзорный орган' }, { date:'01.04.2026', kind:'crit', text:'Срок действия истёк — ответ от надзорного органа не получен' }] },
  13: { description: 'Акт освидетельствования скрытых работ по устройству свайного поля, НПЗ Кстово. Зафиксированы: количество свай — 148 шт., марка бетона М350, глубина погружения до 18 м.', events: [{ date:'28.02.2026', kind:'ok', text:'Работы завершены, комиссия назначена' }, { date:'02.03.2026', kind:'ok', text:'Акт подписан и загружен в систему. Автор: ОТК' }] },
  14: { description: 'Акт приёмки законченного строительством объекта Астраханского ГПЗ. Подписан приёмочной комиссией: заказчик, генподрядчик, надзорные органы. Объект введён в эксплуатацию.', events: [{ date:'01.04.2026', kind:'ok', text:'Приёмочная комиссия сформирована' }, { date:'03.04.2026', kind:'ok', text:'Проведена финальная инспекция объекта' }, { date:'05.04.2026', kind:'ok', text:'Акт подписан, объект введён в эксплуатацию' }] },
};

// ─── Shared toolbar ───────────────────────────────────────────────────────────
const DocToolbar = ({ typeFilter, setTypeFilter, statusFilter, setStatusFilter, search, setSearch, onRight }) => (
  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
      {DOC_TYPES.map(t => (
        <button key={t} onClick={() => setTypeFilter(t)} style={{
          padding:'5px 11px', borderRadius:'var(--radius)', border:'1px solid',
          borderColor: typeFilter===t ? 'var(--primary)' : 'var(--border)',
          background:  typeFilter===t ? 'var(--primary)' : 'transparent',
          color:       typeFilter===t ? 'var(--primary-foreground)' : 'var(--foreground)',
          fontSize:13, cursor:'pointer', fontWeight: typeFilter===t ? 600 : 400,
          fontFamily:'var(--font-sans)',
        }}>{t}</button>
      ))}
    </div>
    <div style={{ width:1, height:22, background:'var(--border)', margin:'0 2px', flexShrink:0 }} />
    <div style={{ display:'flex', gap:5 }}>
      {STATUS_FILTERS.map(f => (
        <button key={f.key} onClick={() => setStatusFilter(f.key)} style={{
          padding:'5px 11px', borderRadius:'var(--radius)', border:'1px solid',
          borderColor: statusFilter===f.key ? 'var(--primary)' : 'var(--border)',
          background:  statusFilter===f.key ? 'var(--primary)' : 'transparent',
          color:       statusFilter===f.key ? 'var(--primary-foreground)' : 'var(--foreground)',
          fontSize:13, cursor:'pointer', fontWeight: statusFilter===f.key ? 600 : 400,
          fontFamily:'var(--font-sans)',
        }}>{f.label}</button>
      ))}
    </div>
    <div style={{ flex:1 }} />
    <div style={{ position:'relative', display:'flex' }}>
      <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--muted-foreground)', pointerEvents:'none' }}>
        <Icon name="search" size={13} />
      </span>
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Поиск документа…"
        style={{
          paddingLeft:30, paddingRight:12, height:33,
          border:'1px solid var(--border)', borderRadius:'var(--radius)',
          background:'var(--card)', color:'var(--foreground)',
          fontSize:13, outline:'none', width:210, fontFamily:'var(--font-sans)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e  => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
    {onRight}
  </div>
);

// ─── Shared document table ────────────────────────────────────────────────────
const DocTable = ({ docs, showProject, onSelect }) => {
  if (docs.length === 0) return (
    <div style={{ textAlign:'center', padding:'60px 0', color:'var(--muted-foreground)' }}>
      <Icon name="file-text" size={32} />
      <div style={{ marginTop:12, fontWeight:500 }}>Документы не найдены</div>
      <div style={{ fontSize:13, marginTop:4 }}>Попробуйте изменить фильтр или поисковый запрос</div>
    </div>
  );

  return (
    <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--card)' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)', background:'var(--card)' }}>
            {['Тип', 'Номер', 'Название', ...(showProject ? ['Проект'] : []), 'Дата', 'Истекает', 'Автор', 'Объём', 'Статус', ''].map((h, i) => (
              <th key={i} style={{
                textAlign:'left', padding:'10px 14px', whiteSpace:'nowrap',
                fontSize:11, fontWeight:600, letterSpacing:'0.08em',
                textTransform:'uppercase', color:'var(--muted-foreground)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {docs.map((d, i) => {
            const tm = DOC_TYPE_META[d.type] || { icon:'file-text', variant:'default' };
            const sm = DOC_STATUS_META[d.status] || { label:d.status, variant:'default' };
            return (
              <tr key={d.id}
                style={{ borderBottom: i < docs.length-1 ? '1px solid var(--border)' : 'none', cursor:'pointer' }}
                onClick={() => onSelect && onSelect(d)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding:'11px 14px', whiteSpace:'nowrap' }}>
                  <Badge variant={tm.variant} uppercase>{d.type}</Badge>
                </td>
                <td style={{ padding:'11px 14px', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--muted-foreground)', whiteSpace:'nowrap' }}>{d.number}</td>
                <td style={{ padding:'11px 14px', fontWeight:500, maxWidth: showProject ? 200 : 280, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.title}</td>
                {showProject && (
                  <td style={{ padding:'11px 14px', fontSize:12, color:'var(--muted-foreground)', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.project}</td>
                )}
                <td style={{ padding:'11px 14px', fontFamily:'var(--font-mono)', fontSize:12, color:'var(--muted-foreground)', whiteSpace:'nowrap' }}>{d.date}</td>
                <td style={{ padding:'11px 14px', whiteSpace:'nowrap' }}>
                  {d.expires
                    ? <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color: d.status==='expiring' ? 'var(--status-warn)' : d.status==='expired' ? 'var(--status-crit)' : 'var(--muted-foreground)' }}>{d.expires}</span>
                    : <span style={{ color:'var(--muted-foreground)' }}>—</span>
                  }
                </td>
                <td style={{ padding:'11px 14px', fontSize:12, color:'var(--muted-foreground)', whiteSpace:'nowrap' }}>{d.author}</td>
                <td style={{ padding:'11px 14px', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted-foreground)', whiteSpace:'nowrap' }}>{d.size}</td>
                <td style={{ padding:'11px 14px', whiteSpace:'nowrap' }}>
                  <Badge variant={sm.variant} uppercase>{sm.label}</Badge>
                </td>
                <td style={{ padding:'11px 14px', whiteSpace:'nowrap' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                    <button
                      title="Скачать"
                      style={{ display:'inline-flex', padding:'4px 7px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', background:'transparent', cursor:'pointer', color:'var(--muted-foreground)', alignItems:'center' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.color='var(--primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted-foreground)'; }}
                    ><Icon name="download" size={12} /></button>
                    <button
                      title="Ещё"
                      style={{ display:'inline-flex', padding:'4px 7px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', background:'transparent', cursor:'pointer', color:'var(--muted-foreground)', alignItems:'center' }}
                      onMouseEnter={e => { e.currentTarget.style.background='var(--muted)'; e.currentTarget.style.color='var(--foreground)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--muted-foreground)'; }}
                    ><Icon name="more" size={12} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const DocStat = ({ label, value, kind }) => (
  <div style={{ flex:1, background:'var(--card)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'14px 18px' }}>
    <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted-foreground)' }}>{label}</div>
    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:28, fontVariantNumeric:'tabular-nums', marginTop:8, color: kind ? `var(--status-${kind})` : 'var(--foreground)' }}>{value}</div>
  </div>
);

// ─── Document detail modal ────────────────────────────────────────────────────
const DocDetailModal = ({ doc, onClose }) => {
  const tm     = DOC_TYPE_META[doc.type]   || { icon:'file-text', variant:'default' };
  const sm     = DOC_STATUS_META[doc.status] || { label:doc.status, variant:'default' };
  const detail = DOC_DETAIL[doc.id]        || { description:'', events:[] };

  const fields = [
    { label:'Проект',  value: doc.project, mono:false },
    { label:'Дата',    value: doc.date,    mono:true  },
    { label:'Автор',   value: doc.author,  mono:false },
    { label:'Объём',   value: doc.size,    mono:true  },
    ...(doc.expires ? [{ label:'Истекает', value: doc.expires, mono:true, warn: doc.status==='expiring' || doc.status==='expired' }] : []),
  ];

  const modal = (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.48)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width:540, maxWidth:'calc(100vw - 40px)', maxHeight:'calc(100vh - 60px)', background:'var(--card)', borderRadius:'var(--radius)', border:'1px solid var(--border)', boxShadow:'var(--shadow-lg)', display:'flex', flexDirection:'column', overflow:'hidden' }}
      >
        {/* Header */}
        <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9, flexWrap:'wrap' }}>
                <Badge variant={tm.variant} uppercase>{doc.type}</Badge>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--muted-foreground)' }}>{doc.number}</span>
                <div style={{ flex:1 }} />
                <Badge variant={sm.variant} uppercase>{sm.label}</Badge>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, lineHeight:1.35 }}>{doc.title}</div>
            </div>
            <button
              onClick={onClose}
              style={{ width:28, height:28, borderRadius:'var(--radius-sm)', flexShrink:0, background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted-foreground)', marginTop:1 }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--muted)'; e.currentTarget.style.color='var(--foreground)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--muted-foreground)'; }}
            ><Icon name="x" size={14} /></button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>

          {/* Key fields */}
          <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', background:'var(--background)', marginBottom:20 }}>
            {fields.map((f, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderBottom: i < fields.length-1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize:12, color:'var(--muted-foreground)', fontWeight:500, flexShrink:0 }}>{f.label}</span>
                <span style={{ fontSize:13, fontFamily: f.mono ? 'var(--font-mono)' : 'var(--font-sans)', color: f.warn ? 'var(--status-warn)' : 'var(--foreground)', fontWeight: f.warn ? 600 : 400, textAlign:'right', flex:1, paddingLeft:20, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          {detail.description && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted-foreground)', marginBottom:10 }}>Описание</div>
              <p style={{ margin:0, fontSize:13, lineHeight:1.7, color:'var(--foreground)', padding:'14px 16px', background:'var(--muted)', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>{detail.description}</p>
            </div>
          )}

          {/* Event history */}
          {detail.events && detail.events.length > 0 && (
            <div>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted-foreground)', marginBottom:12 }}>История изменений</div>
              <div style={{ border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', background:'var(--card)' }}>
                {detail.events.map((ev, i) => (
                  <div key={i} style={{ display:'flex', gap:12, padding:'12px 16px', borderBottom: i < detail.events.length-1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ marginTop:3, flexShrink:0 }}><StatusDot kind={ev.kind} size={8} /></div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, lineHeight:1.4 }}>{ev.text}</div>
                      <div style={{ fontSize:11, color:'var(--muted-foreground)', fontFamily:'var(--font-mono)', marginTop:3 }}>{ev.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:'12px 20px', borderTop:'1px solid var(--border)', display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
          <Button variant="primary" size="sm"><Icon name="download" size={13} />Скачать</Button>
          {(doc.status === 'expiring' || doc.status === 'expired') && (
            <Button variant="outline" size="sm"><Icon name="refresh" size={13} />Запросить продление</Button>
          )}
          {doc.status === 'draft' && (
            <Button variant="outline" size="sm"><Icon name="check" size={13} />Отправить на проверку</Button>
          )}
          <div style={{ flex:1 }} />
          <button
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', background:'transparent', cursor:'pointer', color:'var(--muted-foreground)', fontSize:13, fontFamily:'var(--font-sans)' }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--muted)'; e.currentTarget.style.color='var(--foreground)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--muted-foreground)'; }}
          ><Icon name="more" size={13} />Ещё</button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

// ─── Global documents page ────────────────────────────────────────────────────
const DocumentsPage = () => {
  const [typeFilter,   setTypeFilter]   = useDocState('Все типы');
  const [statusFilter, setStatusFilter] = useDocState('all');
  const [projectFilter,setProjectFilter]= useDocState('all');
  const [search,       setSearch]       = useDocState('');
  const [selectedDoc,  setSelectedDoc]  = useDocState(null);

  const expiringCount = DOC_DATA.filter(d => d.status === 'expiring').length;
  const expiredCount  = DOC_DATA.filter(d => d.status === 'expired').length;
  const activeCount   = DOC_DATA.filter(d => d.status === 'active').length;
  const draftCount    = DOC_DATA.filter(d => d.status === 'draft').length;

  const q = search.toLowerCase();
  const filtered = DOC_DATA.filter(d => {
    if (typeFilter !== 'Все типы' && d.type !== typeFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (projectFilter !== 'all' && d.projectId !== projectFilter) return false;
    if (q && !d.title.toLowerCase().includes(q) && !d.number.toLowerCase().includes(q) && !d.project.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div style={{ flex:1, overflow:'auto', background:'var(--muted)' }}>

      {/* Page header */}
      <div style={{ padding:'24px 24px 0' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted-foreground)' }}>Платформа</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:28, letterSpacing:'-0.02em', marginTop:4 }}>Документооборот</div>
          </div>
          <Button variant="primary" size="sm"><Icon name="upload" size={14} />Загрузить документ</Button>
        </div>

        {/* Alert banner */}
        {(expiringCount > 0 || expiredCount > 0) && (
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'11px 16px', borderRadius:'var(--radius)',
            background:'color-mix(in oklch, var(--status-warn) 9%, var(--card))',
            border:'1px solid color-mix(in oklch, var(--status-warn) 28%, var(--border))',
            marginBottom:16,
          }}>
            <span style={{ color:'var(--status-warn)', display:'flex', flexShrink:0 }}><Icon name="alert-triangle" size={15} /></span>
            <span style={{ fontSize:13, flex:1 }}>
              {expiringCount > 0 && <><strong>{expiringCount} документа</strong> истекают 30 апреля — необходимо продление через Ростехнадзор.</>}
              {expiringCount > 0 && expiredCount > 0 && ' '}
              {expiredCount > 0 && <><strong>{expiredCount} документ</strong> уже просрочен.</>}
            </span>
            <button
              onClick={() => setStatusFilter('expiring')}
              style={{ fontSize:12, color:'var(--primary)', fontWeight:600, background:'none', border:'none', cursor:'pointer', padding:0, whiteSpace:'nowrap' }}
            >Показать →</button>
          </div>
        )}

        {/* Stat strip */}
        <div style={{ display:'flex', gap:12, marginBottom:16 }}>
          <DocStat label="Всего документов" value={DOC_DATA.length} />
          <DocStat label="Действующих"      value={activeCount}     kind="ok"   />
          <DocStat label="Истекают"          value={expiringCount}   kind="warn" />
          <DocStat label="Просрочено"        value={expiredCount}    kind="crit" />
          <DocStat label="Черновиков"        value={draftCount}      />
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ padding:'0 24px 12px' }}>
        <DocToolbar
          typeFilter={typeFilter}   setTypeFilter={setTypeFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          search={search} setSearch={setSearch}
          onRight={
            <React.Fragment>
              <select
                value={projectFilter} onChange={e => setProjectFilter(e.target.value)}
                style={{
                  height:33, padding:'0 10px', borderRadius:'var(--radius)',
                  border:'1px solid var(--border)', background:'var(--card)',
                  color:'var(--foreground)', fontSize:13, cursor:'pointer',
                  outline:'none', fontFamily:'var(--font-sans)',
                }}
              >
                <option value="all">Все проекты</option>
                {(window.PROJECTS || []).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <Button variant="outline" size="sm"><Icon name="download" size={13} />Экспорт</Button>
              <span style={{ fontSize:12, color:'var(--muted-foreground)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' }}>
                {filtered.length} из {DOC_DATA.length}
              </span>
            </React.Fragment>
          }
        />
      </div>

      {/* Table */}
      <div style={{ padding:'0 24px 24px' }}>
        <DocTable docs={filtered} showProject={true} onSelect={setSelectedDoc} />
      </div>

      {selectedDoc && <DocDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </div>
  );
};

// ─── Per-project documents tab ────────────────────────────────────────────────
const ProjectDocumentsTab = ({ projectId }) => {
  const [typeFilter,   setTypeFilter]   = useDocState('Все типы');
  const [statusFilter, setStatusFilter] = useDocState('all');
  const [search,       setSearch]       = useDocState('');
  const [selectedDoc,  setSelectedDoc]  = useDocState(null);

  const projectDocs = DOC_DATA.filter(d => d.projectId === projectId);
  const expiringCount = projectDocs.filter(d => d.status === 'expiring').length;
  const expiredCount  = projectDocs.filter(d => d.status === 'expired').length;
  const activeCount   = projectDocs.filter(d => d.status === 'active').length;
  const draftCount    = projectDocs.filter(d => d.status === 'draft').length;

  const q = search.toLowerCase();
  const filtered = projectDocs.filter(d => {
    if (typeFilter !== 'Все типы' && d.type !== typeFilter) return false;
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (q && !d.title.toLowerCase().includes(q) && !d.number.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div style={{ flex:1, overflow:'auto', padding:24 }}>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:16 }}>
        <DocStat label="Документов"   value={projectDocs.length} />
        <DocStat label="Действующих"  value={activeCount}        kind="ok"   />
        <DocStat label="Истекают"     value={expiringCount}      kind="warn" />
        <DocStat label="Просрочено"   value={expiredCount}       kind="crit" />
        <DocStat label="Черновиков"   value={draftCount}         />
        <div style={{ flex:3 }} />
      </div>

      {/* Alert */}
      {(expiringCount > 0 || expiredCount > 0) && (
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'11px 16px', borderRadius:'var(--radius)',
          background:'color-mix(in oklch, var(--status-warn) 9%, var(--card))',
          border:'1px solid color-mix(in oklch, var(--status-warn) 28%, var(--border))',
          marginBottom:16,
        }}>
          <span style={{ color:'var(--status-warn)', display:'flex', flexShrink:0 }}><Icon name="alert-triangle" size={15} /></span>
          <span style={{ fontSize:13, flex:1 }}>
            {expiringCount > 0 && <><strong>{expiringCount} разрешения</strong> истекают 30 апреля — требуется продление через Ростехнадзор.</>}
            {expiredCount > 0 && <>{expiringCount > 0 ? ' ' : ''}<strong>{expiredCount} документ</strong> уже просрочен.</>}
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ marginBottom:14 }}>
        <DocToolbar
          typeFilter={typeFilter}     setTypeFilter={setTypeFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          search={search} setSearch={setSearch}
          onRight={
            <React.Fragment>
              <Button variant="outline" size="sm"><Icon name="download" size={13} />Экспорт</Button>
              <Button variant="primary" size="sm"><Icon name="upload" size={14} />Загрузить</Button>
            </React.Fragment>
          }
        />
      </div>

      <DocTable docs={filtered} showProject={false} onSelect={setSelectedDoc} />

      {selectedDoc && <DocDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
    </div>
  );
};

window.DocumentsPage = DocumentsPage;
window.ProjectDocumentsTab = ProjectDocumentsTab;
