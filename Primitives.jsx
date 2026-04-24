// Primitives.jsx — shared buttons, inputs, badges
const { useState } = React;

const Icon = ({ name, size = 16, className = '', strokeWidth = 2 }) => (
  <i className={`lucide lucide-${name} ${className}`} style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: LUCIDE[name] || '' }} />
  </i>
);

// Minimal Lucide SVG path bodies — we only inline the handful we use.
const LUCIDE = {
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'bell': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'plus': '<path d="M5 12h14M12 5v14"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  'box': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  'table': '<path d="M3 3h18v18H3z"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  'activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  'alert-circle': '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  'settings': '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  'layers': '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 17 9 5 9-5M3 12l9 5 9-5"/>',
  'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
  'refresh': '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  'maximize': '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  'zoom-in': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/>',
  'zoom-out': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M8 11h6"/>',
  'compass': '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.9 6.4-6.4 2.9 2.9-6.4z"/>',
  'eye': '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  'x': '<path d="M18 6 6 18M6 6l12 12"/>',
  'filter': '<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>',
  'more': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'sparkles': '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>',
  'trending-up': '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  'moon':           '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  'folder':         '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  'users':          '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/>',
  'check-circle':   '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  'phone':          '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'mail':           '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/>',
  'camera':         '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  'film':           '<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>',
  'play':           '<polygon points="5 3 19 12 5 21 5 3"/>',
  'upload':         '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>',
  'image':          '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
};

// shadcn/ui Button — variants: default, secondary, outline, ghost, destructive, link
// Sizes: sm (32), md/default (36), lg (40), icon (36x36)
const Button = ({ variant = 'default', size = 'md', children, className = '', style: propStyle, ...props }) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);

  const v = variant === 'primary' ? 'default' : variant; // back-compat

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-sans)', fontWeight: 500,
    border: '1px solid transparent', borderRadius: 'var(--radius)',
    cursor: 'pointer', transition: 'background-color .15s, color .15s, border-color .15s, box-shadow .15s, transform .05s',
    whiteSpace: 'nowrap', userSelect: 'none',
    boxShadow: focusVisible ? '0 0 0 3px color-mix(in oklch, var(--ring) 35%, transparent)' : undefined,
    transform: active ? 'translateY(1px)' : 'none',
  };
  const sizes = {
    sm: { height: 32, padding: '0 12px', fontSize: 13 },
    md: { height: 36, padding: '0 16px', fontSize: 14 },
    lg: { height: 40, padding: '0 20px', fontSize: 15 },
    icon: { width: 36, height: 36, padding: 0 },
  };

  const variants = {
    default: {
      background: hover ? 'color-mix(in oklch, var(--primary) 90%, black)' : 'var(--primary)',
      color: 'var(--primary-foreground)',
    },
    secondary: {
      background: hover ? 'color-mix(in oklch, var(--secondary) 85%, var(--foreground) 8%)' : 'var(--secondary)',
      color: 'var(--secondary-foreground)',
    },
    outline: {
      background: hover ? 'var(--accent)' : 'var(--background)',
      color: hover ? 'var(--accent-foreground)' : 'var(--foreground)',
      borderColor: 'var(--border)',
      boxShadow: (focusVisible ? base.boxShadow : 'var(--shadow-xs)'),
    },
    ghost: {
      background: hover ? 'var(--accent)' : 'transparent',
      color: hover ? 'var(--accent-foreground)' : 'var(--foreground)',
    },
    destructive: {
      background: hover ? 'color-mix(in oklch, var(--destructive) 90%, black)' : 'var(--destructive)',
      color: '#fff',
    },
    link: {
      background: 'transparent', color: 'var(--primary)',
      height: 'auto', padding: 0, textDecoration: hover ? 'underline' : 'none', textUnderlineOffset: 3,
    },
  };

  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[v], ...propStyle }}
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={(e) => { if (e.target.matches(':focus-visible')) setFocusVisible(true); props.onFocus && props.onFocus(e); }}
      onBlur={(e) => { setFocusVisible(false); props.onBlur && props.onBlur(e); }}
      {...props}
    >
      {children}
    </button>
  );
};

const IconBtn = ({ children, ...props }) => <Button variant="ghost" size="icon" {...props}>{children}</Button>;

const Input = ({ className = '', mono, style, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <input
      onFocus={(e) => { setFocus(true); props.onFocus && props.onFocus(e); }}
      onBlur={(e) => { setFocus(false); props.onBlur && props.onBlur(e); }}
      style={{
        display: 'flex',
        height: 36,
        width: '100%',
        padding: '0 12px',
        border: `1px solid ${focus ? 'var(--ring)' : 'var(--input)'}`,
        borderRadius: 'var(--radius)',
        background: 'transparent',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: 14,
        lineHeight: '1.25',
        color: 'var(--foreground)',
        outline: 'none',
        boxShadow: focus ? '0 0 0 3px color-mix(in oklch, var(--ring) 35%, transparent)' : 'none',
        transition: 'border-color .15s, box-shadow .15s',
        ...style,
      }}
      className={className}
      {...props}
    />
  );
};

const Badge = ({ variant = 'default', children, uppercase = false }) => {
  const base = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 999, fontSize: uppercase ? 11 : 12, fontWeight: uppercase ? 600 : 500, letterSpacing: uppercase ? '0.08em' : 0, textTransform: uppercase ? 'uppercase' : 'none' };
  const variants = {
    default: { background: 'var(--secondary)', color: 'var(--secondary-foreground)' },
    outline: { border: '1px solid var(--border)', color: 'var(--foreground)' },
    primary: { background: 'var(--primary)', color: 'var(--primary-foreground)' },
    ok: { background: 'color-mix(in oklch, var(--status-ok) 14%, transparent)', color: 'var(--status-ok)' },
    warn: { background: 'color-mix(in oklch, var(--status-warn) 18%, transparent)', color: 'oklch(0.45 0.15 70)' },
    crit: { background: 'var(--destructive)', color: '#fff' },
    info: { background: 'var(--brand-muted)', color: 'oklch(0.379 0.146 265.522)' },
    inactive: { background: 'var(--muted)', color: 'var(--muted-foreground)' },
  };
  return <span style={{ ...base, ...variants[variant] }}>{children}</span>;
};

const StatusDot = ({ kind = 'ok', size = 6 }) => {
  const colors = { ok: 'var(--status-ok)', warn: 'var(--status-warn)', crit: 'var(--status-crit)', info: 'var(--status-info)', inactive: 'var(--status-inactive)' };
  return <span style={{ width: size, height: size, borderRadius: '50%', display: 'inline-block', background: colors[kind] }} />;
};

Object.assign(window, { Icon, Button, IconBtn, Input, Badge, StatusDot });
