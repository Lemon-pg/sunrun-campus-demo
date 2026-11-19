/* ============================================================
   视觉素材：图标、插画、地图（全部为内联 SVG，离线可用）
   ============================================================ */
window.Assets = (function () {
  'use strict';

  const icon = (name, size = 20, cls = '') => {
    const icons = {
      back: '<path d="M14.5 4.5 7.6 12l6.9 7.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
      chevronRight:
        '<path d="M8.5 5.5 15 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      chevronDown:
        '<path d="M5.5 8.5 12 15l6.5-6.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      home: '<path d="M4 10.6 12 4l8 6.6V20h-5.4v-5.2H9.4V20H4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      star: '<path d="m12 3.9 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
      share: '<path d="M21 3 10.2 13.8M21 3l-6.6 18-4.2-7.2L3 9.6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>',
      runnerSolid: '<circle cx="15.6" cy="4.9" r="2.4" fill="currentColor"/><path d="M13.6 8.1c-1.5.4-2.7 1.4-3.4 2.7l2.8 2.1-2.3 5.6-3.9 2.2 1.2 2 4.9-2.7 2.9-5.7 3 2.5 1.1 4.7 2.2-.5-1.3-5.5-4.4-3.5 1.5-3.2 3.2 1.8 3.7-.9-.5-2.2-3.1.8-3.2-2.2c-.6-.4-1.5-.5-2.2-.1z" fill="currentColor"/>',
      clipboard: '<rect x="5" y="4.4" width="14" height="16.2" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 8.6h6M9 12h6M9 15.4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9 4.4V3.2h6v1.2" fill="none" stroke="currentColor" stroke-width="1.6"/>',
      dots: '<circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/>',
      close:
        '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
      check: '<path d="m4.8 12.6 4.5 4.5L19.2 6.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
      plus: '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      lock: '<rect x="5.2" y="10.4" width="13.6" height="9.6" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.2 10.2V7.9a3.8 3.8 0 0 1 7.6 0v2.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="15.2" r="1.35" fill="currentColor"/>',
      unlock:
        '<rect x="5.2" y="10.4" width="13.6" height="9.6" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.2 10.2V7.9a3.8 3.8 0 0 1 7.2-1.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="15.2" r="1.35" fill="currentColor"/>',
      play: '<path d="M8 5.6v12.8L19 12z" fill="currentColor"/>',
      pause: '<rect x="6.6" y="5.4" width="3.7" height="13.2" rx="1.5" fill="currentColor"/><rect x="13.7" y="5.4" width="3.7" height="13.2" rx="1.5" fill="currentColor"/>',
      voice:
        '<rect x="9" y="3.4" width="6" height="10.2" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M5.8 11.4a6.2 6.2 0 0 0 12.4 0M12 17.7v2.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      target:
        '<circle cx="12" cy="12" r="7.6" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      calendar:
        '<rect x="4" y="5.6" width="16" height="14.4" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 10h16M8.4 3.4v3.6M15.6 3.4v3.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
      user: '<circle cx="12" cy="8.4" r="3.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4.8 20c.8-3.6 3.7-5.4 7.2-5.4s6.4 1.8 7.2 5.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      edit: '<path d="M4.6 19.4h3.9L19 8.9a2.1 2.1 0 0 0 0-3l-.9-.9a2.1 2.1 0 0 0-3 0L4.6 15.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="m13.7 6.6 3.7 3.7" stroke="currentColor" stroke-width="1.6"/>',
      shield:
        '<path d="M12 2.8 5 5.4v5.3c0 4.4 2.9 8.3 7 9.7 4.1-1.4 7-5.3 7-9.7V5.4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m8.8 11.8 2.2 2.2 4.4-4.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      location:
        '<path d="M12 21s6.4-6.1 6.4-11a6.4 6.4 0 1 0-12.8 0C5.6 14.9 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.7"/>',
      info: '<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="8" r="1.15" fill="currentColor"/>',
      refresh:
        '<path d="M19 7.4A8 8 0 1 0 20 12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M19.2 3.4v4.2H15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      link: '<path d="M9.4 14.6 14.6 9.4M8 11 5.8 13.2a3.4 3.4 0 0 0 4.8 4.8L12.8 16M11.2 8 13.4 5.8a3.4 3.4 0 0 1 4.8 4.8L16 12.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
      question:
        '<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.7 9.3a2.4 2.4 0 1 1 3.6 2.2c-.8.5-1.3 1-1.3 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16.8" r="1.05" fill="currentColor"/>',
      runner:
        '<circle cx="15.4" cy="5.3" r="2.3" fill="currentColor"/><path d="M13.1 8.2 9.6 11l2.6 2.5-1.7 4.6-3.9 2.5M13.4 8.4l3.3 1.9 3.1-.8M12.2 13.5l3.2 2.9 1.2 4.3" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>',
      coin: '<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 6.6v10.8M9.3 8.9h4.2a2.2 2.2 0 0 1 0 4.4H9.3M9.3 12h4.6a2.2 2.2 0 0 1 0 4.4H9.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
      bell: '<path d="M18 10.3a6 6 0 1 0-12 0c0 4.4-1.6 5.4-1.6 5.4h15.2S18 14.7 18 10.3ZM10 19a2.2 2.2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
      wifi: '<path d="M2.5 8.5a14 14 0 0 1 19 0M5.8 12a9.4 9.4 0 0 1 12.4 0M9.2 15.4a4.6 4.6 0 0 1 5.6 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/>',
      lockMini: '<path d="M7 10.5V8a5 5 0 0 1 10 0v2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="5" y="10.5" width="14" height="9" rx="2.2" fill="currentColor"/>',
      arrowUp: '<path d="M12 19V6M6 11.6 12 5.4l6 6.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
      calendarMini:
        '<rect x="4.4" y="5.8" width="15.2" height="13.6" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.4 9.8h15.2M8.4 3.8v3.4M15.6 3.8v3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
    };
    return `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ''}</svg>`;
  };

  /* 卡通头像 */
  const avatar = (hue = 0, size = 48) => {
    const shirts = [
      ['#8ecdf0', '#5fadd9'],
      ['#f5c68c', '#e0a463'],
      ['#9ad9bf', '#5fbb98'],
      ['#c9b6f2', '#a58be0']
    ];
    const [s1, s2] = shirts[hue % shirts.length];
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="shirt${hue}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient>
        <radialGradient id="facebg${hue}" cx="45%" cy="30%" r="85%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e8f2ff"/></radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#facebg${hue})"/>
      <path d="M23 100c2-17 12-26 27-26s25 9 27 26z" fill="url(#shirt${hue})"/>
      <path d="M43 66h14v9c-2 3-12 3-14 0z" fill="#f1c3a4"/>
      <ellipse cx="50" cy="47" rx="23" ry="25" fill="#ffd7bc"/>
      <path d="M27 46c-1-15 8-25 23-25s24 10 23 25c-2-7-6-11-10-12-6 4-24 5-30 0-3 2-5 6-6 12z" fill="#3c2a26"/>
      <path d="M30 33c4-8 13-11 21-10 7 1 13 5 16 12-9-3-27-2-37-2z" fill="#4a342f"/>
      <ellipse cx="28" cy="49" rx="3.4" ry="4" fill="#ffd7bc"/>
      <ellipse cx="72" cy="49" rx="3.4" ry="4" fill="#ffd7bc"/>
      <ellipse cx="41.5" cy="47" rx="2.5" ry="3" fill="#3a2a26"/>
      <ellipse cx="58.5" cy="47" rx="2.5" ry="3" fill="#3a2a26"/>
      <circle cx="42.4" cy="46" r="0.9" fill="#fff"/>
      <circle cx="59.4" cy="46" r="0.9" fill="#fff"/>
      <path d="M44 58c2 2.4 10 2.4 12 0" fill="none" stroke="#c8745c" stroke-width="1.8" stroke-linecap="round"/>
      <ellipse cx="35" cy="55" rx="3.4" ry="2.2" fill="#ffb6a0" opacity="0.55"/>
      <ellipse cx="65" cy="55" rx="3.4" ry="2.2" fill="#ffb6a0" opacity="0.55"/>
    </svg>`;
  };

  /* 3D 学士帽 + 卷轴（首页顶部） */
  const graduationCap = () => `<svg viewBox="0 0 170 160" aria-hidden="true">
    <defs>
      <linearGradient id="capTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3c4350"/><stop offset="0.55" stop-color="#242a34"/><stop offset="1" stop-color="#171b23"/></linearGradient>
      <linearGradient id="capBase" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c323d"/><stop offset="1" stop-color="#141821"/></linearGradient>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e8edf4"/></linearGradient>
      <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9c48d"/><stop offset="1" stop-color="#c9a066"/></linearGradient>
      <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <ellipse cx="88" cy="138" rx="54" ry="9" fill="#7fa9dd" opacity="0.22" filter="url(#soft)"/>
    <g transform="rotate(-7 86 78)">
      <path d="M84 26 18 62l66 36 66-36z" fill="url(#capTop)"/>
      <path d="M84 26 18 62l9 5 57-30 57 30 9-5z" fill="#4a515e" opacity="0.8"/>
      <path d="M45 79v20c0 8 17 15 39 15s39-7 39-15V79l-39 21z" fill="url(#capBase)"/>
      <path d="M84 100v14" stroke="#0e1117" stroke-width="1"/>
      <circle cx="84" cy="62" r="5" fill="#d8b378"/>
      <path d="M84 62c0 0 14 6 30 6" fill="none" stroke="url(#ribbon)" stroke-width="3" stroke-linecap="round"/>
      <path d="M114 68v20" stroke="url(#ribbon)" stroke-width="3" stroke-linecap="round"/>
      <path d="M114 88c0 6-5 9-9 10" fill="none" stroke="url(#ribbon)" stroke-width="3" stroke-linecap="round"/>
    </g>
    <g transform="translate(106 104) rotate(16)">
      <rect x="0" y="0" width="56" height="24" rx="11" fill="url(#paper)" stroke="#dfe6ef" stroke-width="1"/>
      <path d="M10 8h28" stroke="#c3ccd8" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 14h18" stroke="#d3dae4" stroke-width="2" stroke-linecap="round"/>
      <path d="M44 4l10 3-8 5" fill="#e8939c"/>
      <path d="M6 2c-4 1-6 4-6 8h8z" fill="#c9a066"/>
    </g>
  </svg>`;

  /* 运动打卡页手绘跑者 */
  const runnerArt = () => `<svg viewBox="0 0 250 210" aria-hidden="true">
    <defs>
      <linearGradient id="inkBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f6fd0"/><stop offset="1" stop-color="#5aa9ff"/></linearGradient>
      <linearGradient id="inkBlueSoft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc6ff"/><stop offset="1" stop-color="#4a94ee"/></linearGradient>
      <filter id="blur2"><feGaussianBlur stdDeviation="1.1"/></filter>
    </defs>
    <circle cx="205" cy="42" r="30" fill="none" stroke="#c4ddfb" stroke-width="1.4" stroke-dasharray="3 6"/>
    <circle cx="38" cy="168" r="6" fill="#cfe4fb"/>
    <circle cx="222" cy="140" r="4" fill="#bcd9fa"/>
    <path d="M30 40c16-10 34-8 46 4" fill="none" stroke="#c4ddfb" stroke-width="2" stroke-linecap="round"/>
    <path d="M196 186h30M186 196h22" stroke="#a9cdf6" stroke-width="2.4" stroke-linecap="round"/>
    <g fill="url(#inkBlue)">
      <circle cx="168" cy="54" r="13"/>
      <path d="M160 68c-9 7-14 17-13 27l10 2c3-8 8-13 15-17z"/>
      <path d="M162 72c12 3 24 10 31 21l9-6c-9-14-23-23-38-27z"/>
      <path d="M159 93c-6 15-16 27-30 36l6 9c18-8 31-22 39-39z" filter="url(#blur2)"/>
      <path d="M146 132c-1 12 2 24 8 34l11-3c-6-10-8-20-7-31z"/>
      <path d="M162 126c10 8 18 19 23 31l11-4c-6-15-16-28-29-36z"/>
      <path d="M181 153c7 8 11 18 12 29l12-1c-1-14-7-26-17-34z"/>
      <path d="M127 120c-12 6-22 16-28 28l10 6c6-10 15-18 25-23z" opacity="0.55"/>
    </g>
    <g stroke="#4a94ee" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7">
      <path d="M70 46c10-4 20-3 28 3"/>
      <path d="M56 58c6-2 12-2 17 1"/>
      <path d="M206 88c8 2 14 7 17 14"/>
    </g>
    <g fill="#7fb6f4" opacity="0.55">
      <circle cx="92" cy="34" r="3"/>
      <circle cx="76" cy="76" r="2.4"/>
      <circle cx="226" cy="170" r="2.6"/>
      <circle cx="40" cy="96" r="2"/>
    </g>
  </svg>`;

  /* 人脸轮廓（核身动画） */
  const faceFigure = () => `<svg viewBox="0 0 176 210" aria-hidden="true">
    <defs>
      <linearGradient id="faceSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a4a74"/><stop offset="1" stop-color="#182c4a"/></linearGradient>
    </defs>
    <path d="M46 206c2-30 17-45 42-45s40 15 42 45z" fill="url(#faceSkin)"/>
    <path d="M74 152h28v18c-4 6-24 6-28 0z" fill="#20395c"/>
    <ellipse cx="88" cy="104" rx="42" ry="48" fill="#22405f"/>
    <path d="M45 100c-2-32 16-52 43-52s45 20 43 52c-4-16-12-24-19-26-11 9-37 10-49 0-8 3-15 11-18 26z" fill="#13253c"/>
    <ellipse cx="52" cy="108" rx="6" ry="8" fill="#203c5c"/>
    <ellipse cx="124" cy="108" rx="6" ry="8" fill="#203c5c"/>
    <ellipse cx="74" cy="100" rx="4.4" ry="5.2" fill="#3c6a9c"/>
    <ellipse cx="102" cy="100" rx="4.4" ry="5.2" fill="#3c6a9c"/>
    <path d="M80 124c5 4 11 4 16 0" fill="none" stroke="#3c6a9c" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;

  /* 支付宝盾牌 logo */
  const alipayShield = () => `<svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M24 3.5 7 9.6v13c0 10.4 7 19.9 17 23.4 10-3.5 17-13 17-23.4v-13z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M16.5 17.5h15M24 13.5v8.4c0 5.5-3.4 9.6-8.5 10.6M22 26.5c2.6 3.4 6.6 5.6 10.7 6.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`;

  /* 支付宝运动 App 图标 */
  const sportsApp = () => `<svg viewBox="0 0 48 48" aria-hidden="true">
    <defs><linearGradient id="sportBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#63b4ff"/><stop offset="1" stop-color="#1677ff"/></linearGradient></defs>
    <rect width="48" height="48" rx="12" fill="url(#sportBg)"/>
    <circle cx="30.4" cy="12.6" r="3.6" fill="#fff"/>
    <path d="M27.2 18.4 21.6 22l4.2 4-2.7 7.3-6.2 4" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27.5 18.6l5.4 3 5-1.2" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M25.2 26.2l5.2 4.7 1.9 6.9" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  /* 地图：轻量浅色校园地图 */
  function mapSVG(opts = {}) {
    const {
      width = 390,
      height = 640,
      route = false,
      showTrack = true,
      labels = true,
      variant = 'gorun'
    } = opts;
    const cx = width / 2;
    const cy = height * (variant === 'result' ? 0.5 : 0.52);
    const rx = Math.min(width * 0.32, 126);
    const ry = Math.min(width * 0.16, 66);
    const trackW = 40;
    const id = 'm' + Math.random().toString(36).slice(2, 7);
    const roads = `
      <path d="M-20 120 C 60 118, 120 150, 210 148 S 340 118, 420 132" stroke="#ffffff" stroke-width="17" fill="none"/>
      <path d="M-20 120 C 60 118, 120 150, 210 148 S 340 118, 420 132" stroke="#e6ebf1" stroke-width="1" fill="none"/>
      <path d="M-30 320 C 70 300, 150 330, 240 316 S 350 300, 430 312" stroke="#ffffff" stroke-width="13" fill="none"/>
      <path d="M-30 480 C 80 470, 160 500, 250 490 S 360 470, 430 486" stroke="#ffffff" stroke-width="19" fill="none"/>
      <path d="M42 -30 C 56 100, 40 200, 58 330 S 40 470, 52 700" stroke="#ffffff" stroke-width="13" fill="none"/>
      <path d="M330 -20 C 316 90, 338 200, 322 330 S 340 470, 328 700" stroke="#ffffff" stroke-width="15" fill="none"/>
      <path d="M196 -20 C 186 120, 214 240, 198 340 S 210 520, 200 700" stroke="#eef2f6" stroke-width="6" fill="none"/>
      <path d="M-20 40 C 90 60, 160 90, 250 60 S 350 30, 430 52" stroke="#ffffff" stroke-width="9" fill="none"/>
      <path d="M-20 600 C 100 590, 180 620, 270 600 S 370 580, 430 598" stroke="#ffffff" stroke-width="9" fill="none"/>
    `;
    const land = `
      <rect x="0" y="0" width="${width}" height="${height}" fill="#f0f3f6"/>
      <path d="M-20 150 C 60 140, 100 190, 190 180 S 300 150, 430 168 L430 292 C 330 300, 240 270, 150 288 S 40 310, -20 296Z" fill="#e7f0e9"/>
      <path d="M-20 420 C 70 400, 130 440, 220 424 S 340 396, 430 420 L430 480 C 330 470, 220 500, 120 482 S 30 470, -20 486Z" fill="#e3eef4"/>
      <ellipse cx="${width * 0.84}" cy="${height * 0.76}" rx="66" ry="40" fill="#e2ece4"/>
      <circle cx="${width * 0.12}" cy="${height * 0.62}" r="26" fill="#e6efe6"/>
    `;
    const buildings = `
      <g fill="#e6eaef" opacity="0.9">
        <rect x="${cx + 150}" y="${cy - 150}" width="46" height="58" rx="4"/>
        <rect x="${cx + 160}" y="${cy + 96}" width="60" height="42" rx="4"/>
        <rect x="26" y="${cy - 170}" width="54" height="62" rx="4"/>
        <rect x="34" y="${cy + 108}" width="40" height="52" rx="4"/>
        <rect x="${cx - 40}" y="${cy - 210}" width="80" height="42" rx="4"/>
      </g>
      <g fill="#dfe5ec">
        <rect x="${cx + 205}" y="${cy - 40}" width="36" height="70" rx="4"/>
        <rect x="22" y="${cy - 60}" width="30" height="60" rx="4"/>
      </g>
    `;
    const labelsHTML = labels
      ? variant === 'go'
        ? `<g font-family="-apple-system, PingFang SC, sans-serif" fill="#9aa4b1">
            <text x="${width - 132}" y="${cy - 140}" font-size="10" letter-spacing="0.04em">舜玉北路</text>
            <text x="${width - 132}" y="${cy + 38}" font-size="10" letter-spacing="0.04em">礼堂</text>
            <text x="${width - 116}" y="${cy + 150}" font-size="10" letter-spacing="0.04em">舜玉小区</text>
            <text x="${width - 150}" y="${cy + 214}" font-size="10" letter-spacing="0.06em">舜耕路</text>
            <text x="${width - 148}" y="${cy + 286}" font-size="10" letter-spacing="0.04em">历阳大街</text>
            <text x="26" y="${cy + 52}" font-size="10" letter-spacing="0.04em">舜玉公园</text>
            <text x="30" y="${cy + 140}" font-size="10" letter-spacing="0.04em">舜玉路</text>
            <text x="26" y="${cy + 232}" font-size="10" letter-spacing="0.04em">舜环路</text>
            <text x="34" y="${cy + 300}" font-size="10" letter-spacing="0.04em">八里洼路</text>
            <text x="${cx - 120}" y="${cy - 206}" font-size="10" letter-spacing="0.04em">舜玉城管</text>
            <text x="${cx - 70}" y="${cy - 120}" font-size="10" letter-spacing="0.04em">山东省交通运输厅</text>
            <text x="${cx - 26}" y="${cy + 240}" font-size="10" letter-spacing="0.04em">山东天舜大厦</text>
            <text x="${cx - 96}" y="${cy + 300}" font-size="10" letter-spacing="0.04em">银丰大厦</text>
            <text x="${width - 104}" y="${cy - 214}" font-size="10" letter-spacing="0.04em">省直宿舍</text>
          </g>`
        : `<g font-family="-apple-system, PingFang SC, sans-serif" fill="#a7b0bb">
        <text x="${width - 120}" y="112" font-size="9.5" letter-spacing="0.06em">经十东路</text>
        <text x="20" y="308" font-size="9.5" letter-spacing="0.06em">明德路</text>
        <text x="${width - 96}" y="${cy + 170}" font-size="9.5" letter-spacing="0.06em">圣井校区</text>
        <text x="${width * 0.2}" y="${height - 84}" font-size="9" letter-spacing="0.04em">山东财经大学</text>
        <text x="${width * 0.2}" y="${height - 68}" font-size="8" letter-spacing="0.04em" fill="#bcc3cc">SDUFE · SHENGJING CAMPUS</text>
        <text x="${cx - 46}" y="${cy - 120}" font-size="9" letter-spacing="0.05em" fill="#b3bcc7">体育场</text>
      </g>`
      : '';
    const track = showTrack
      ? `
      <g>
        <rect x="${cx - rx - trackW / 2}" y="${cy - ry - trackW / 2}" width="${(rx + trackW / 2) * 2}" height="${(ry + trackW / 2) * 2}" rx="${ry + trackW / 2}" fill="#e7a58f"/>
        <rect x="${cx - rx - trackW / 2 + 4}" y="${cy - ry - trackW / 2 + 4}" width="${(rx + trackW / 2) * 2 - 8}" height="${(ry + trackW / 2) * 2 - 8}" rx="${ry + trackW / 2 - 4}" fill="#eeae98"/>
        <rect x="${cx - rx - trackW / 2 + 9}" y="${cy - ry - trackW / 2 + 9}" width="${(rx + trackW / 2) * 2 - 18}" height="${(ry + trackW / 2) * 2 - 18}" rx="${ry + trackW / 2 - 9}" fill="none" stroke="#f3c5b4" stroke-width="1.2"/>
        <rect x="${cx - rx - trackW / 2 + 15}" y="${cy - ry - trackW / 2 + 15}" width="${(rx + trackW / 2) * 2 - 30}" height="${(ry + trackW / 2) * 2 - 30}" rx="${ry + trackW / 2 - 15}" fill="none" stroke="#f3c5b4" stroke-width="1.2"/>
        <rect x="${cx - rx - trackW / 2 + 21}" y="${cy - ry - trackW / 2 + 21}" width="${(rx + trackW / 2) * 2 - 42}" height="${(ry + trackW / 2) * 2 - 42}" rx="${ry + trackW / 2 - 21}" fill="none" stroke="#f3c5b4" stroke-width="1.2"/>
        <rect x="${cx - rx}" y="${cy - ry}" width="${rx * 2}" height="${ry * 2}" rx="${ry}" fill="#7fbb8e"/>
        <rect x="${cx - rx + 8}" y="${cy - ry + 8}" width="${rx * 2 - 16}" height="${ry * 2 - 16}" rx="${ry - 8}" fill="#86c294"/>
        <ellipse cx="${cx}" cy="${cy + 4}" rx="${rx * 0.36}" ry="${ry * 0.4}" fill="#93caa0" opacity="0.7"/>
        <g stroke="#ffffff" stroke-width="1.4" opacity="0.85">
          <line x1="${cx - rx * 0.5}" y1="${cy - ry + 12}" x2="${cx - rx * 0.5}" y2="${cy + ry - 12}"/>
          <line x1="${cx + rx * 0.5}" y1="${cy - ry + 12}" x2="${cx + rx * 0.5}" y2="${cy + ry - 12}"/>
          <line x1="${cx - rx + 12}" y1="${cy - ry * 0.5}" x2="${cx + rx - 12}" y2="${cy - ry * 0.5}"/>
          <line x1="${cx - rx + 12}" y1="${cy + ry * 0.5}" x2="${cx + rx - 12}" y2="${cy + ry * 0.5}"/>
        </g>
      </g>`
      : '';
    const routeHTML = route
      ? `<g id="routeGroup">
          <path id="routeShadow" class="run-route-shadow" d=""/>
          <path id="routePath" class="run-route" d=""/>
          <g id="routeStart" opacity="0">
            <circle cx="0" cy="0" r="7" fill="#ffffff" stroke="#22b573" stroke-width="3"/>
          </g>
          <g id="routeNow" opacity="0">
            <circle class="now-halo" cx="0" cy="0" r="16" fill="rgba(22,119,255,0.16)"/>
            <circle cx="0" cy="0" r="7.5" fill="#1677ff" stroke="#fff" stroke-width="3"/>
          </g>
        </g>`
      : '';
    return `<svg class="map-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      ${land}
      ${buildings}
      ${roads}
      <g fill="none" stroke="#f6f8fa" stroke-width="1">
        <path d="M-20 236 C 90 250, 180 230, 260 244 S 360 260, 430 250"/>
        <path d="M-20 552 C 90 540, 180 566, 270 550 S 370 532, 430 548"/>
      </g>
      ${track}
      ${labelsHTML}
      ${routeHTML}
      <g id="mapGps" opacity="0" transform="translate(${cx}, ${cy + 8})">
        <circle r="15" fill="rgba(22,119,255,0.14)"/>
        <circle r="6" fill="#1677ff" stroke="#fff" stroke-width="2.4"/>
      </g>
    </svg>`;
  }

  /* 小程序图标（浅色渐变） */
  const appLogo = (size = 34) => `<span class="app-logo" style="width:${size}px;height:${size}px;display:inline-flex;border-radius:${Math.round(size * 0.28)}px;overflow:hidden;position:relative;background:linear-gradient(145deg,#ffe1ec 0%,#d7e6ff 42%,#d7f4ee 100%);box-shadow:0 4px 10px rgba(80,120,190,.18)">
    <svg viewBox="0 0 40 40" width="100%" height="100%">
      <circle cx="20" cy="17" r="11" fill="none" stroke="#ffd08a" stroke-width="2.2" opacity="0.9"/>
      <circle cx="20" cy="17" r="7" fill="#ffc46b" opacity="0.85"/>
      <path d="M4 33c5-6 10-6 15-3s10 2 16-3" fill="none" stroke="#7cc4f2" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M8 8c3-3 6-4 9-3" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    </svg>
  </span>`;


  /* 跑步详情页头像：红棕短发、黄色 T 恤的 3D 卡通男生 */
  const avatarBoy = (size = 58) => `<svg width="${size}" height="${size}" viewBox="0 0 120 120" aria-hidden="true">
    <defs>
      <radialGradient id="boyBg" cx="38%" cy="28%" r="78%"><stop offset="0" stop-color="#F4F9FF"/><stop offset="0.62" stop-color="#DDEDFF"/><stop offset="1" stop-color="#C7E1FF"/></radialGradient>
      <linearGradient id="boySkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE0C8"/><stop offset="0.55" stop-color="#F8C7A6"/><stop offset="1" stop-color="#E9A47E"/></linearGradient>
      <linearGradient id="boyHair" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#D57A50"/><stop offset="0.5" stop-color="#B85B39"/><stop offset="1" stop-color="#8E3F27"/></linearGradient>
      <linearGradient id="boyShirt" x1="0" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#FFD95C"/><stop offset="0.6" stop-color="#FFC531"/><stop offset="1" stop-color="#EBA81B"/></linearGradient>
    </defs>
    <circle cx="60" cy="60" r="58" fill="url(#boyBg)"/>
    <circle cx="60" cy="60" r="58" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.75"/>
    <path d="M17 118c2-21 17-33 43-33s41 12 43 33z" fill="url(#boyShirt)"/>
    <path d="M42 86c2 7 5 11 9 12l-3 13h24l-3-13c4-1 7-5 9-12-9-6-27-6-36 0z" fill="url(#boyShirt)"/>
    <path d="M52 78h16v13c-3 4-13 4-16 0z" fill="#F0B18D"/>
    <ellipse cx="60" cy="55" rx="25" ry="27" fill="url(#boySkin)"/>
    <ellipse cx="35.5" cy="59" rx="4.2" ry="5.4" fill="#F3B693"/>
    <ellipse cx="84.5" cy="59" rx="4.2" ry="5.4" fill="#F3B693"/>
    <path d="M37 51c-1-20 10-31 24-31 15 0 25 11 23 32-2-8-5-13-10-16-5 8-24 10-32 4-3 3-4 7-5 11z" fill="url(#boyHair)"/>
    <path d="M39 35c4-9 12-14 21-14 8 0 15 4 19 12-5-3-11-5-17-5-9 0-17 3-23 7z" fill="#D98A60" opacity="0.85"/>
    <path d="M44 42c4-3 9-2 12 0" fill="none" stroke="#8E3F27" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M64 42c4-2 9-3 12 0" fill="none" stroke="#8E3F27" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="49.5" cy="54" rx="3.1" ry="3.8" fill="#ffffff"/>
    <ellipse cx="70.5" cy="54" rx="3.1" ry="3.8" fill="#ffffff"/>
    <ellipse cx="49.8" cy="54.4" rx="2" ry="2.6" fill="#3B2A24"/>
    <ellipse cx="70.2" cy="54.4" rx="2" ry="2.6" fill="#3B2A24"/>
    <circle cx="50.5" cy="53.3" r="0.7" fill="#fff"/>
    <circle cx="70.9" cy="53.3" r="0.7" fill="#fff"/>
    <path d="M59 58c0 1.6-1 2.6-2 3.1h4c-1-0.6-2-1.5-2-3.1z" fill="#E9A47E"/>
    <path d="M53 66c2.6 2.2 7.4 2.2 10 0" fill="none" stroke="#B8604A" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 62c1.6 1 3.4 1 5 0.4" fill="none" stroke="#F6C7A6" stroke-width="1.4" opacity="0.8"/>
    <ellipse cx="42" cy="62" rx="4.6" ry="2.4" fill="#F49C8E" opacity="0.5"/>
    <ellipse cx="78" cy="62" rx="4.6" ry="2.4" fill="#F49C8E" opacity="0.5"/>
    <path d="M44 78c10-4 22-4 32 0-4 6-10 8-16 8s-12-2-16-8z" fill="#E8A21C" opacity="0.55"/>
  </svg>`;

  /* 跑步详情页顶部 3D 跑者 */
  const runner3D = () => `<svg viewBox="0 0 270 250" aria-hidden="true">
    <defs>
      <linearGradient id="r3Skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFDCB8"/><stop offset="0.5" stop-color="#F1B98C"/><stop offset="1" stop-color="#D99163"/></linearGradient>
      <linearGradient id="r3Tank" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.55" stop-color="#EDF2F8"/><stop offset="1" stop-color="#D5DDE8"/></linearGradient>
      <linearGradient id="r3Shorts" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#A9AFB9"/><stop offset="0.6" stop-color="#878E9A"/><stop offset="1" stop-color="#5F6672"/></linearGradient>
      <linearGradient id="r3Hair" x1="0.2" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#4A342C"/><stop offset="0.6" stop-color="#2E201B"/><stop offset="1" stop-color="#1C1310"/></linearGradient>
      <linearGradient id="r3Shoe" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#E8EDF4"/><stop offset="1" stop-color="#B9C4D2"/></linearGradient>
      <linearGradient id="r3Blue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9ECBFF" stop-opacity="0"/><stop offset="0.45" stop-color="#6BB2FF" stop-opacity="0.55"/><stop offset="1" stop-color="#9ECBFF" stop-opacity="0"/></linearGradient>
      <filter id="r3blur"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <g opacity="0.9">
      <path d="M8 96c34-22 66-18 92 2 20 15 38 18 62 8" fill="none" stroke="url(#r3Blue)" stroke-width="8" stroke-linecap="round" filter="url(#r3blur)"/>
      <path d="M24 152c28 18 62 16 84-2 16-13 34-16 52-10" fill="none" stroke="url(#r3Blue)" stroke-width="5" stroke-linecap="round" filter="url(#r3blur)"/>
      <circle cx="40" cy="72" r="12" fill="#BFDFFF" opacity="0.5" filter="url(#r3blur)"/>
      <circle cx="232" cy="70" r="9" fill="#CFE6FF" opacity="0.55" filter="url(#r3blur)"/>
    </g>
    <ellipse cx="142" cy="238" rx="66" ry="9" fill="#9CBCE2" opacity="0.22" filter="url(#r3blur)"/>
    <!-- 后腿 -->
    <path d="M158 165c14 6 24 20 24 38l12-4c3-22-9-42-29-52z" fill="url(#r3Shorts)"/>
    <path d="M171 198c8 10 14 22 15 34l16-3c-2-16-10-30-21-40z" fill="url(#r3Skin)"/>
    <path d="M188 226c-2 8-1 14 2 18l25-4c-1-7-4-13-8-17z" fill="url(#r3Shoe)"/>
    <path d="M186 236c8-2 16-2 25 0" fill="none" stroke="#9CA8B8" stroke-width="3" stroke-linecap="round"/>
    <!-- 前腿 -->
    <path d="M120 172c-10 16-14 32-12 48l18 2c0-14 4-26 12-38z" fill="url(#r3Shorts)"/>
    <path d="M108 214c-10 8-16 18-18 30l18 5c3-10 8-18 15-24z" fill="url(#r3Skin)"/>
    <path d="M92 244c-2 6-1 10 2 12l30-2c-1-7-4-11-8-14z" fill="url(#r3Shoe)"/>
    <path d="M92 252c10-3 22-3 32 0" fill="none" stroke="#9CA8B8" stroke-width="3" stroke-linecap="round"/>
    <!-- 躯干 -->
    <path d="M126 82c12-9 30-10 42-3 8 5 12 15 9 28-4 18-15 38-25 55l-30-8c-6-24-6-48 4-72z" fill="url(#r3Tank)"/>
    <path d="M132 79c8 5 16 7 24 6 6-1 10 0 13 3-6-8-14-11-23-11-6 0-11 1-14 2z" fill="#FFFFFF"/>
    <path d="M166 87c9 8 12 22 6 36-5 12-13 23-22 33l-8-6c10-16 19-32 22-48 1-6 0-11-2-15z" fill="#D9E1EC" opacity="0.75"/>
    <path d="M120 170c-2-2-5-3-8-3 1 8 3 15 6 20l8-3z" fill="#E4B28A"/>
    <!-- 手臂：向前摆臂 -->
    <path d="M136 88c-14 8-24 20-28 36-2 6 0 11 5 13 5 1 9-2 11-7 4-11 11-20 20-26z" fill="url(#r3Skin)"/>
    <path d="M110 130c-4 5-5 10-2 14 3 5 9 5 13 1l8-9-6-9z" fill="url(#r3Skin)"/>
    <path d="M111 140c-2 4-1 8 3 10 4 1 8-1 9-5l2-7-8-4z" fill="#F5C49D"/>
    <!-- 手臂：向后摆臂 -->
    <path d="M168 89c12 4 20 12 24 24 1 5-1 9-5 11-4 1-8-2-9-6-2-7-7-13-14-17z" fill="url(#r3Skin)"/>
    <path d="M186 120c4 1 7 4 7 8 0 4-4 7-8 6l-8-3 2-9z" fill="url(#r3Skin)"/>
    <!-- 脖子与头 -->
    <path d="M136 66c2 8 8 12 16 12s14-4 16-12l-4-8h-24z" fill="#EAAE86"/>
    <ellipse cx="150" cy="42" rx="27" ry="29" fill="url(#r3Skin)"/>
    <path d="M123 40c-2-19 10-30 27-30 18 0 29 12 27 31-3-9-8-14-14-17-8 6-24 8-32 3-4 2-7 7-8 13z" fill="url(#r3Hair)"/>
    <path d="M126 30c5-9 14-14 25-14 10 0 18 5 23 13-7-4-15-5-24-5-9 0-17 2-24 6z" fill="#5A3E33" opacity="0.9"/>
    <ellipse cx="125" cy="46" rx="4.6" ry="6" fill="#EDB187"/>
    <ellipse cx="176" cy="46" rx="4.6" ry="6" fill="#EDB187"/>
    <path d="M136 39c3-2 7-2 10 0" fill="none" stroke="#2E201B" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M154 39c3-2 7-2 10 0" fill="none" stroke="#2E201B" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="141" cy="47" rx="3.4" ry="3.8" fill="#FFFFFF"/>
    <ellipse cx="159" cy="47" rx="3.4" ry="3.8" fill="#FFFFFF"/>
    <ellipse cx="141.4" cy="47.4" rx="2.1" ry="2.7" fill="#33221B"/>
    <ellipse cx="159.4" cy="47.4" rx="2.1" ry="2.7" fill="#33221B"/>
    <circle cx="142.2" cy="46.3" r="0.8" fill="#fff"/>
    <circle cx="160.2" cy="46.3" r="0.8" fill="#fff"/>
    <path d="M149 55c1.5 1.2 3.5 1.2 5 0" fill="none" stroke="#D89A72" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M145 62c3.4 2.6 8.6 2.6 12 0" fill="none" stroke="#9E4F37" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="132" cy="56" rx="5" ry="2.6" fill="#F49C8E" opacity="0.4"/>
    <ellipse cx="168" cy="56" rx="5" ry="2.6" fill="#F49C8E" opacity="0.4"/>
    <path d="M153 58c1 1 2 1 3 0" fill="none" stroke="#C98A63" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`;

  return {
    avatar,
    avatarBoy,
    runner3D,
    icon,
    graduationCap,
    runnerArt,
    faceFigure,
    alipayShield,
    sportsApp,
    mapSVG,
    appLogo
  };
})();
