// AnalyticsPage.jsx
const { useEffect: useAE, useRef: useAR, useState: useAS } = React;

/* ─── Theme helpers ─────────────────────────────────────────── */
const _dark    = () => document.documentElement.classList.contains('dark');
const _tc      = (d) => d ? '#94a3b8' : '#64748b';
const _bg      = (d) => d ? '#1e293b' : '#ffffff';
const _fg      = (d) => d ? '#f1f5f9' : '#0f172a';
const _grid    = (d) => d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
const _ptb     = (d) => d ? '#0f172a' : '#ffffff';

/* ─── Chart.js shared builders ──────────────────────────────── */
const mkTip = (d) => ({
  backgroundColor: _bg(d), titleColor: _fg(d), bodyColor: _tc(d),
  borderColor: d ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.09)',
  borderWidth: 1, padding: 10, cornerRadius: 8, boxPadding: 4,
});

const mkScl = (d) => ({
  grid: { color: _grid(d), drawBorder: false },
  ticks: { color: _tc(d), font: { size: 11, family: 'Inter, system-ui, sans-serif' } },
  border: { display: false },
});

const mkLeg = (d, pos = 'top') => ({
  position: pos,
  labels: { color: _tc(d), font: { size: 11 }, boxWidth: 10, usePointStyle: true, pointStyle: 'circle', padding: 16 },
});

/* ─── Canvas wrapper — absolute fill solves flex-height issue ─ */
const CW = ({ h, cref }) => (
  <div style={{ position: 'relative', height: h, flexShrink: 0, width: '100%' }}>
    <canvas ref={cref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
  </div>
);

/* ─── Card shell ─────────────────────────────────────────────── */
const CC = ({ title, sub, children }) => (
  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px 16px', display: 'flex', flexDirection: 'column' }}>
    <div style={{ marginBottom: 14, flexShrink: 0 }}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 2 }}>{sub}</div>}
    </div>
    {children}
  </div>
);

/* ─── KPI card ───────────────────────────────────────────────── */
const KPI = ({ label, value, sub, trend, trendUp, vc, icon }) => (
  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      {icon && <span style={{ color: 'var(--muted-foreground)', opacity: .5, display: 'flex' }}><Icon name={icon} size={14} /></span>}
    </div>
    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, lineHeight: 1, marginBottom: 8, color: vc || 'var(--foreground)' }}>{value}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {trend && <span style={{ fontSize: 11, fontWeight: 600, color: trendUp ? '#22c55e' : '#ef4444' }}>{trendUp ? '↑' : '↓'} {trend}</span>}
      {sub && <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{sub}</span>}
    </div>
  </div>
);

/* ─── Chart 1 · Progress line + area gradient ───────────────── */
const ProgressLineChart = () => {
  const cv = useAR(null), ch = useAR(null);
  useAE(() => {
    if (!cv.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    const d = dark = _dark(), s = mkScl(d);
    ch.current = new window.Chart(cv.current, {
      type: 'line',
      data: {
        labels: ['Авг','Сен','Окт','Ноя','Дек','Янв','Фев','Мар','Апр'],
        datasets: [
          {
            label: 'Факт', data: [10,18,28,35,42,52,58,64,68],
            borderColor: '#3b82f6', borderWidth: 2.5,
            fill: true, tension: 0.42,
            backgroundColor: (ctx) => {
              const c = ctx.chart;
              if (!c.chartArea) return 'rgba(59,130,246,0.1)';
              const g = c.ctx.createLinearGradient(0, c.chartArea.top, 0, c.chartArea.bottom);
              g.addColorStop(0, 'rgba(59,130,246,0.3)');
              g.addColorStop(1, 'rgba(59,130,246,0.01)');
              return g;
            },
            pointRadius: 4, pointHoverRadius: 6,
            pointBackgroundColor: '#3b82f6', pointBorderColor: _ptb(d), pointBorderWidth: 2,
          },
          {
            label: 'План', data: [12,22,33,44,54,62,69,75,80],
            borderColor: '#94a3b8', borderDash: [6,4], borderWidth: 1.5,
            fill: false, tension: 0.42, pointRadius: 0, pointHoverRadius: 4,
          },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeInOutCubic' },
        plugins: {
          legend: mkLeg(d),
          tooltip: { ...mkTip(d), callbacks: { label: c => ` ${c.dataset.label}: ${c.raw}%` } },
        },
        scales: {
          x: s,
          y: { ...s, min: 0, max: 100, ticks: { color: _tc(d), font: { size: 11 }, callback: v => v + '%', stepSize: 20 } },
        },
      },
    });
    return () => { ch.current && ch.current.destroy(); ch.current = null; };
  }, []);
  return <CW h={248} cref={cv} />;
};

/* ─── Chart 2 · Status doughnut ─────────────────────────────── */
const StatusDonutChart = () => {
  const cv = useAR(null), ch = useAR(null);
  useAE(() => {
    if (!cv.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    const d = _dark();
    const centerPlugin = {
      id: 'centerText',
      afterDraw(chart) {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data || !meta.data[0]) return;
        const cx = meta.data[0].x, cy = meta.data[0].y;
        const ctx = chart.ctx;
        ctx.save();
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = 'bold 24px Inter, system-ui, sans-serif';
        ctx.fillStyle = _fg(d); ctx.fillText('4', cx, cy - 10);
        ctx.font = '11px Inter, system-ui, sans-serif';
        ctx.fillStyle = _tc(d); ctx.fillText('объекта', cx, cy + 11);
        ctx.restore();
      },
    };
    ch.current = new window.Chart(cv.current, {
      type: 'doughnut',
      plugins: [centerPlugin],
      data: {
        labels: ['Норма','Внимание','Критично','В работе'],
        datasets: [{ data: [45,30,15,10], backgroundColor: ['#22c55e','#f59e0b','#ef4444','#3b82f6'], borderWidth: 3, borderColor: _bg(d), hoverOffset: 5 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        animation: { duration: 700, easing: 'easeInOutCubic' },
        plugins: {
          legend: mkLeg(d, 'bottom'),
          tooltip: { ...mkTip(d), callbacks: { label: c => ` ${c.label}: ${c.raw}%` } },
        },
      },
    });
    return () => { ch.current && ch.current.destroy(); ch.current = null; };
  }, []);
  return <CW h={248} cref={cv} />;
};

/* ─── Chart 3 · Budget grouped bar ──────────────────────────── */
const BudgetBarChart = () => {
  const cv = useAR(null), ch = useAR(null);
  useAE(() => {
    if (!cv.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    const d = _dark(), s = mkScl(d);
    ch.current = new window.Chart(cv.current, {
      type: 'bar',
      data: {
        labels: ['Металлоконструкции','Оборудование','КИПиА','Трубопроводы','Прочее'],
        datasets: [
          { label: 'План, млн ₽', data: [320,480,210,180,110], backgroundColor: 'rgba(59,130,246,0.18)', borderColor: '#3b82f6', borderWidth: 1.5, borderRadius: 5, borderSkipped: false },
          { label: 'Факт, млн ₽', data: [310,425,85,160,95], backgroundColor: '#3b82f6', borderRadius: 5, borderSkipped: false },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeInOutCubic' },
        plugins: {
          legend: mkLeg(d),
          tooltip: { ...mkTip(d), callbacks: { label: c => ` ${c.dataset.label}: ${c.raw} млн` } },
        },
        scales: {
          x: s,
          y: { ...s, ticks: { color: _tc(d), font: { size: 11 }, callback: v => v + ' M' } },
        },
      },
    });
    return () => { ch.current && ch.current.destroy(); ch.current = null; };
  }, []);
  return <CW h={248} cref={cv} />;
};

/* ─── Chart 4 · Deviations stacked area ─────────────────────── */
const DeviationsAreaChart = () => {
  const cv = useAR(null), ch = useAR(null);
  useAE(() => {
    if (!cv.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    const d = _dark(), s = mkScl(d);
    const areaGrad = (R, G, B) => (ctx) => {
      const c = ctx.chart;
      if (!c.chartArea) return `rgba(${R},${G},${B},0.12)`;
      const g = c.ctx.createLinearGradient(0, c.chartArea.top, 0, c.chartArea.bottom);
      g.addColorStop(0, `rgba(${R},${G},${B},0.3)`);
      g.addColorStop(1, `rgba(${R},${G},${B},0.01)`);
      return g;
    };
    ch.current = new window.Chart(cv.current, {
      type: 'line',
      data: {
        labels: ['Нед.1','Нед.2','Нед.3','Нед.4','Нед.5','Нед.6','Нед.7','Нед.8','Нед.9','Нед.10','Нед.11','Нед.12'],
        datasets: [
          { label: 'Критические', data: [0,1,0,0,1,0,0,0,1,0,0,1], borderColor: '#ef4444', borderWidth: 2, fill: true, tension: 0.4, backgroundColor: areaGrad(239,68,68), pointRadius: 3, pointBackgroundColor: '#ef4444', pointBorderColor: _ptb(d), pointBorderWidth: 2 },
          { label: 'Предупреждения', data: [2,3,1,2,3,2,4,1,2,3,2,2], borderColor: '#f59e0b', borderWidth: 2, fill: true, tension: 0.4, backgroundColor: areaGrad(245,158,11), pointRadius: 3, pointBackgroundColor: '#f59e0b', pointBorderColor: _ptb(d), pointBorderWidth: 2 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeInOutCubic' },
        plugins: { legend: mkLeg(d), tooltip: mkTip(d) },
        scales: {
          x: s,
          y: { ...s, min: 0, ticks: { color: _tc(d), font: { size: 11 }, stepSize: 1, callback: v => Number.isInteger(v) ? v : '' } },
        },
      },
    });
    return () => { ch.current && ch.current.destroy(); ch.current = null; };
  }, []);
  return <CW h={248} cref={cv} />;
};

/* ─── Chart 5 · Phase completion horizontal bar ─────────────── */
const PhaseChart = () => {
  const cv = useAR(null), ch = useAR(null);
  useAE(() => {
    if (!cv.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    const d = _dark(), s = mkScl(d);
    ch.current = new window.Chart(cv.current, {
      type: 'bar',
      data: {
        labels: ['Проектирование','Площадка','Фундамент','Металлоконструкции','Оборудование','КИПиА','Пуск'],
        datasets: [{
          data: [100,100,100,100,68,0,0],
          backgroundColor: ['#22c55e','#22c55e','#22c55e','#22c55e','#3b82f6','rgba(148,163,184,0.2)','rgba(148,163,184,0.2)'],
          borderRadius: 5, borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeInOutCubic' },
        plugins: {
          legend: { display: false },
          tooltip: { ...mkTip(d), callbacks: { label: c => ` Готовность: ${c.raw}%` } },
        },
        scales: {
          x: { ...s, min: 0, max: 100, ticks: { color: _tc(d), font: { size: 11 }, callback: v => v + '%' } },
          y: { ...s, grid: { display: false } },
        },
      },
    });
    return () => { ch.current && ch.current.destroy(); ch.current = null; };
  }, []);
  return <CW h={210} cref={cv} />;
};

/* ─── Chart 6 · Contractors horizontal bar + value labels ───── */
const ContractorsChart = () => {
  const cv = useAR(null), ch = useAR(null);
  useAE(() => {
    if (!cv.current || !window.Chart) return;
    if (ch.current) ch.current.destroy();
    const d = _dark(), s = mkScl(d);
    const scores = [92,88,76,71,64];
    const solid  = scores.map(v => v >= 85 ? '#22c55e' : v >= 70 ? '#f59e0b' : '#ef4444');
    const alpha  = scores.map(v => v >= 85 ? 'rgba(34,197,94,0.18)' : v >= 70 ? 'rgba(245,158,11,0.18)' : 'rgba(239,68,68,0.18)');
    const valPlugin = {
      id: 'valLabels',
      afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        meta.data.forEach(function(bar, idx) {
          ctx.save();
          ctx.fillStyle = solid[idx];
          ctx.font = '600 11px Inter, system-ui, sans-serif';
          ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillText(scores[idx] + ' / 100', bar.x + 6, bar.y);
          ctx.restore();
        });
      },
    };
    ch.current = new window.Chart(cv.current, {
      type: 'bar',
      plugins: [valPlugin],
      data: {
        labels: ['СУ-17','ПКБ-3','ТехМонтаж','СпецСтрой','ЭнергоПро'],
        datasets: [{ data: scores, backgroundColor: alpha, borderColor: solid, borderWidth: 1.5, borderRadius: 5, borderSkipped: false }],
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeInOutCubic' },
        plugins: {
          legend: { display: false },
          tooltip: { ...mkTip(d), callbacks: { label: c => ' Рейтинг: ' + c.raw + ' / 100' } },
        },
        scales: {
          x: { ...s, min: 0, max: 115, ticks: { color: _tc(d), font: { size: 11 }, callback: v => v <= 100 ? v : '' } },
          y: { ...s, grid: { display: false } },
        },
      },
    });
    return () => { ch.current && ch.current.destroy(); ch.current = null; };
  }, []);
  return <CW h={210} cref={cv} />;
};

/* ─── Period tabs ────────────────────────────────────────────── */
const PERIODS = ['7 дней','Месяц','Квартал','Год'];

/* ─── Page ───────────────────────────────────────────────────── */
const AnalyticsPage = () => {
  const [period, setPeriod] = useAS('Месяц');
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 36px', minHeight: 0 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>Аналитика</div>
          <div style={{ fontSize: 13, color: 'var(--muted-foreground)', marginTop: 3 }}>ЭЛОУ-АВТ-6 · Блок 2 · Апрель 2026</div>
        </div>
        <div style={{ display: 'flex', gap: 2, background: 'var(--muted)', borderRadius: 'var(--radius-sm)', padding: 3 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '5px 14px', border: 'none', cursor: 'pointer',
              borderRadius: 'calc(var(--radius-sm) - 2px)',
              background: period === p ? 'var(--card)' : 'transparent',
              color: period === p ? 'var(--foreground)' : 'var(--muted-foreground)',
              fontSize: 12, fontWeight: period === p ? 500 : 400,
              boxShadow: period === p ? 'var(--shadow-sm)' : 'none',
              transition: 'all .12s',
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
        <KPI icon="layers"         label="Готовность модели"   value="68%"         trend="+4%"  trendUp={true}  sub="за месяц" />
        <KPI icon="alert-triangle" label="Активных отклонений" value="3"           trend="1"    trendUp={true}  vc="var(--status-warn)" sub="меньше, чем месяц назад" />
        <KPI icon="trending-up"    label="Освоено бюджета"     value="₽ 1.24 млрд" sub="из 1.8 млрд · 69%" />
        <KPI icon="activity"       label="Дней до сдачи"       value="62"          sub="24.06.2026" />
      </div>

      {/* Row 1 · Line + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 10, marginBottom: 10 }}>
        <CC title="Динамика готовности BIM-модели" sub="Факт vs план, % завершения по месяцам">
          <ProgressLineChart />
        </CC>
        <CC title="Статусы объектов" sub="Распределение по 4 объектам">
          <StatusDonutChart />
        </CC>
      </div>

      {/* Row 2 · Bar + Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <CC title="Освоение бюджета по разделам" sub="Плановые и фактические показатели, млн ₽">
          <BudgetBarChart />
        </CC>
        <CC title="Динамика отклонений" sub="По типу за последние 12 недель">
          <DeviationsAreaChart />
        </CC>
      </div>

      {/* Row 3 · Phase + Contractors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <CC title="Готовность по этапам" sub="Факт выполнения, %">
          <PhaseChart />
        </CC>
        <CC title="Рейтинг подрядчиков" sub="По качеству, срокам и документообороту">
          <ContractorsChart />
        </CC>
      </div>

    </div>
  );
};

window.AnalyticsPage = AnalyticsPage;
