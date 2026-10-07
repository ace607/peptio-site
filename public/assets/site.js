// App Store link. Leave empty until the app is live: every pill then reads "Coming soon on the App Store"
// and points at #support. Set it to the App Store URL to switch every pill to "Free on the App Store".
const APP_STORE_URL = '';

/* Peptio site: draws the decoration only (clay characters, phone frames, screen crops, the lime ribbon)
   and wires the App Store pills. All copy lives in the HTML and reads fine with this script off. */
(function () {
  'use strict';

  const ASSETS = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '');
  const SCREENS = ASSETS + 'screens/';
  const SRC_W = 1170, SRC_H = 2532;   // raw screenshot size; crops are in these units
  let gid = 0;

  /* ---------- App Store pills ---------- */
  document.querySelectorAll('.js-appstore').forEach(a => {
    if (APP_STORE_URL) { a.href = APP_STORE_URL; return; }
    const t = a.querySelector('.cta-t');
    if (t) t.textContent = 'Coming soon on the App Store';
    a.classList.add('soon');   // href stays as written in the HTML: #support on the home page, /#support elsewhere
  });

  /* ---------- screens ---------- */
  const C = {
    logSheet: [64, 880, 1106, 2176], bodyMap: [200, 720, 970, 1920], chips3: [62, 1256, 532, 1356], trio: [60, 1386, 1110, 1962],
    weight: [63, 540, 1107, 1528], doses: [63, 1576, 564, 2123], journal: [40, 540, 1130, 1810],
  };
  function phone({ src, sw, x, y, tf = '', z = 2, alt = '' }) {
    const f = sw * 0.013, b = sw * 0.026, sh = sw * SRC_H / SRC_W, rs = sw * 0.138, rb = rs + b, ro = rb + f, w = sw + 2 * (f + b), h = sh + 2 * (f + b);
    const btn = (side, top, len) => `<div class="btn" style="${side}:${-sw * 0.008}px;top:${h * top}px;height:${h * len}px"></div>`;
    return `<div class="phone" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z};
       --sw:${sw}px;--f:${f}px;--b:${b}px;--rs:${rs}px;--rb:${rb}px;--ro:${ro}px;transform:${tf}">
      ${btn('left', .175, .035)}${btn('left', .245, .062)}${btn('left', .322, .062)}${btn('right', .27, .095)}
      <div class="body"><div class="bezel"><div class="screen"><img src="${SCREENS}${src}.jpg" alt="${alt}" width="${sw}" height="${Math.round(sh)}" loading="lazy" decoding="async"><div class="island"></div></div></div></div></div>`;
  }
  function cut({ src, r, s, x, y, rot = 0, radius = 24, pad = 0, cls = '', z = 12, label = '' }) {
    const [x0, y0, x1, y1] = r, cw = (x1 - x0) * s, ch = (y1 - y0) * s;
    const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
    return `<div class="cut ${cls}" ${a11y} style="left:${x}px;top:${y}px;width:${cw + 2 * pad}px;height:${ch + 2 * pad}px;border-radius:${radius}px;z-index:${z};transform:rotate(${rot}deg)">
      <div class="px" style="left:${pad}px;top:${pad}px;width:${cw}px;height:${ch}px;background-image:url(${SCREENS}${src}.jpg);
        background-size:${SRC_W * s}px ${SRC_H * s}px;background-position:${-x0 * s}px ${-y0 * s}px"></div></div>`;
  }

  /* ---------- clay ---------- */
  const PAL = {
    lime:   { l: '246,255,196', m: '201,245,58',  d: '150,196,10',  dd: '88,118,0',   sh: '60,80,0' },
    violet: { l: '240,236,255', m: '186,174,255', d: '130,114,240', dd: '82,66,200',  sh: '40,26,140' },
    blue:   { l: '232,241,255', m: '148,190,255', d: '78,138,238',  dd: '30,88,196',  sh: '20,50,140' },
    plum:   { l: '251,234,255', m: '226,172,244', d: '170,88,204',  dd: '110,30,140', sh: '80,10,110' },
  };
  const GLY = {
    bell: g => `<path d="M50 14 C33 14 26 28 26 42 V58 L18 70 H82 L74 58 V42 C74 28 67 14 50 14Z" fill="${g}"/><path d="M40 78 a10 10 0 0 0 20 0Z" fill="${g}"/>`,
    lock: g => `<rect x="20" y="44" width="60" height="44" rx="12" fill="${g}"/><path d="M33 46 V33 a17 17 0 0 1 34 0 V46" fill="none" stroke="${g}" stroke-width="10"/>`,
    vial: g => `<rect x="34" y="8" width="32" height="15" rx="5" fill="${g}"/><path d="M30 30 H70 V82 a10 10 0 0 1 -10 10 H40 a10 10 0 0 1 -10 -10Z" fill="none" stroke="${g}" stroke-width="8.5" stroke-linejoin="round"/><path d="M34 58 Q50 52 66 58 V82 a6 6 0 0 1 -6 6 H40 a6 6 0 0 1 -6 -6Z" fill="${g}"/>`,
  };
  const INK = '#17141F';
  const FACE = {
    happy: `<circle cx="36" cy="44" r="5.6" fill="${INK}"/><circle cx="64" cy="44" r="5.6" fill="${INK}"/><path d="M33 59 Q50 76 67 59" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
    wink: `<circle cx="36" cy="45" r="5.8" fill="${INK}"/><path d="M56 45 Q63 37 70 44" fill="none" stroke="${INK}" stroke-width="5.6" stroke-linecap="round"/><path d="M32 59 Q50 77 68 58" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
    worried: `<path d="M27 33 Q34 27 42 30" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round" transform="rotate(14 34 30)"/><path d="M58 30 Q66 27 73 33" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round" transform="rotate(-14 66 30)"/>
      <ellipse cx="36" cy="46" rx="5.2" ry="6.4" fill="${INK}"/><ellipse cx="64" cy="46" rx="5.2" ry="6.4" fill="${INK}"/>
      <path d="M36 68 Q43 62 50 67 Q57 72 64 66" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <path d="M76 26 Q80 34 76 38 Q72 34 76 26Z" fill="#8FD3FF" opacity=".95"/>`,
    sleepy: `<path d="M27 46 Q35 53 43 46" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M57 46 Q65 53 73 46" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="50" cy="66" rx="5" ry="4" fill="${INK}"/><ellipse cx="27" cy="58" rx="6" ry="3.4" fill="#FF9FC0" opacity=".6"/><ellipse cx="73" cy="58" rx="6" ry="3.4" fill="#FF9FC0" opacity=".6"/>`,
    worriedXL: `<path d="M24 31 Q32 22 42 27" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M58 27 Q68 22 76 31" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>
      <ellipse cx="35" cy="45" rx="6.4" ry="8" fill="${INK}"/><ellipse cx="65" cy="45" rx="6.4" ry="8" fill="${INK}"/>
      <circle cx="37.2" cy="42" r="2.3" fill="#fff"/><circle cx="67.2" cy="42" r="2.3" fill="#fff"/><circle cx="33.6" cy="48.5" r="1" fill="#fff" opacity=".8"/><circle cx="63.6" cy="48.5" r="1" fill="#fff" opacity=".8"/>
      <path d="M37 69 Q42 64 46.5 68 Q50.5 72 54.5 68 Q59 64 63 69" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="24" cy="58" rx="6" ry="3.2" fill="#FF9FC0" opacity=".55"/><ellipse cx="76" cy="58" rx="6" ry="3.2" fill="#FF9FC0" opacity=".55"/>
      <path d="M83 21 Q89 32 86 37 Q83 41 79 38 Q76 34 83 21Z" fill="url(#drop)"/><ellipse cx="81.6" cy="33" rx="1.3" ry="2.4" fill="#fff" opacity=".9"/>
      <defs><linearGradient id="drop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CDEBFF"/><stop offset="1" stop-color="#4FA3F0"/></linearGradient></defs>`,
    mouthO: `<ellipse cx="50" cy="74" rx="6" ry="7" fill="${INK}"/>`,
  };
  function clayBase({ x, y, s, c, rot = 0, tx = 8, ty = -10, z = 30, inner = '' }) {
    const p = PAL[c], persp = tx || ty;
    return `<div class="clay" aria-hidden="true" style="left:${x}px;top:${y}px;--s:${s}px;--l:${p.l};--m:${p.m};--d:${p.d};--dd:${p.dd};--sh:${p.sh};z-index:${z};
      transform:${persp ? `perspective(${s * 4}px) ` : ''}rotate(${rot}deg)${persp ? ` rotateX(${tx}deg) rotateY(${ty}deg)` : ''}">${inner}</div>`;
  }
  function clay(o) {
    const p = PAL[o.c], id = 'gr' + (++gid), grad = o.c === 'lime' ? ['#4C6600', '#2C3D00'] : ['#FFFFFF', `rgb(${p.l})`];
    return clayBase({ ...o, inner: `<svg class="g" viewBox="0 0 100 100"><defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="92"><stop offset="0" stop-color="${grad[0]}"/><stop offset="1" stop-color="${grad[1]}"/></linearGradient></defs>${GLY[o.g](`url(#${id})`)}</svg>` });
  }
  const faceTile = o => clayBase({ ...o, inner: `<svg class="face" viewBox="0 0 100 100">${FACE[o.face]}</svg>${o.extra || ''}` });
  function googly(s, dx, dy) {
    const e = s * .36, p = e * .48;
    const eye = cx => `<div class="eye" style="left:${cx - e / 2}px;top:${s * .14}px;width:${e}px;height:${e * 1.12}px">
       <i style="width:${p}px;height:${p}px;left:${(e - p) / 2 + dx * e * .22}px;top:${(e * 1.12 - p) / 2 + dy * e * .24}px"></i></div>`;
    return eye(s * .31) + eye(s * .69);
  }
  const zz = (x, y, size) => `<div class="zz" style="left:${x}px;top:${y}px;font-size:${size}px">z<br><span style="font-size:${size * .66}px;margin-left:${size * .55}px">z</span></div>`;
  function note({ x, y, title, sub, when = 'now', rot = 0, dark = false, icon = 'lime', face = 'wink', z = 35, fs = 16 }) {
    return `<div class="note ${dark ? 'dark' : ''}" aria-hidden="true" style="left:${x}px;top:${y}px;font-size:${fs}px;transform:rotate(${rot}deg);z-index:${z}">
      <div class="ic">${faceTile({ x: 0, y: 0, s: fs * 2.75, c: icon, face, tx: 0, ty: 0, z: 1 })}</div>
      <div><div class="top"><span>PEPTIO</span><span>${when}</span></div><div class="ti">${title}</div>${sub ? `<div class="su">${sub}</div>` : ''}</div></div>`;
  }

  /* ---------- ribbon ---------- */
  function smooth(pts) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 1 / 6;
      d += ` C${p1[0] + (p2[0] - p0[0]) * t} ${p1[1] + (p2[1] - p0[1]) * t} ${p2[0] - (p3[0] - p1[0]) * t} ${p2[1] - (p3[1] - p1[1]) * t} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }
  function ribbonSvg(W, H, pts, { w = 22, stops = [[0, '#C9F53A'], [1, '#C9F53A']], vertical = false, cap = 'round', dots = [] } = {}) {
    const d = smooth(pts), id = 'rib' + (++gid);
    const g = vertical ? `x1="0" y1="0" x2="0" y2="${H}"` : `x1="0" y1="0" x2="${W}" y2="0"`;
    return `<svg aria-hidden="true" focusable="false" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" ${g}>${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>
      <filter id="${id}s" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="${w * .5}" stdDeviation="${w * .5}" flood-color="#1B1060" flood-opacity=".32"/></filter></defs>
      <path d="${d}" fill="none" stroke="url(#${id})" stroke-width="${w}" stroke-linecap="${cap}" filter="url(#${id}s)"/>
      <path d="${d}" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="${w * .18}" stroke-linecap="${cap}" transform="translate(0,${-w * .26})"/>
      ${dots.map(([x, y, r, fill = '#fff', ring = '#6A5AE0']) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${ring ? `stroke="${ring}" stroke-width="${r * .38}"` : ''}/>`).join('')}</svg>`;
  }

  /* ---------- art boards ---------- */
  const ART = {
    hero: () => `
      ${clay({ x: 40, y: 40, s: 110, c: 'blue', g: 'vial', rot: -12 })}
      ${faceTile({ x: 250, y: 0, s: 300, c: 'lime', face: 'mouthO', rot: 8, tx: 0, ty: 0, z: 33, extra: googly(300, -.5, .6) })}
      <div class="bubble" aria-hidden="true" style="left:20px;top:300px;width:450px;transform:rotate(-2deg)">
        <div class="big">Hey!</div><div class="t">your <b>NAD+</b> is due<br>tonight at <b>20:00</b>.</div></div>
      ${clay({ x: 460, y: 440, s: 120, c: 'violet', g: 'bell', rot: 14, ty: 14 })}`,
    worry: () => `
      ${note({ x: 0, y: 10, title: 'BPC-157 · due now', sub: '07:30 · every day', when: '07:30', rot: -3, icon: 'lime', face: 'happy', fs: 19 })}
      ${note({ x: 70, y: 128, title: 'NAD+ · tonight 20:00', sub: '50 mg · your next dose', when: 'in 10h', rot: 2, icon: 'blue', face: 'wink', fs: 19 })}
      ${faceTile({ x: 240, y: 250, s: 330, c: 'violet', face: 'worriedXL', rot: 9, tx: 0, ty: 0,
        extra: `<div class="qm" style="left:250px;top:-118px;font-size:110px;transform:rotate(14deg)">?</div>
                <div class="qm" style="left:180px;top:-80px;font-size:64px;transform:rotate(-12deg);opacity:.75">?</div>` })}`,
    log: () => `
      ${phone({ src: '03-log-dose', sw: 300, x: 300, y: 30, tf: 'rotate(8deg)', z: 1 })}
      ${cut({ src: '03-log-dose', r: C.logSheet, s: .4, x: 0, y: 130, rot: -3, radius: 34, pad: 10, cls: 'white', label: 'Peptio Log dose sheet: NAD+ 50 mg at 9:41, left thigh suggested as the least recently used site' })}
      ${note({ x: 30, y: 30, title: 'BPC-157 logged · 07:34', sub: '250 mcg · abdomen, lower left', when: '07:34', dark: true, rot: 3, icon: 'lime', face: 'happy', fs: 15 })}
      ${note({ x: 40, y: 640, title: 'Next NAD+ site: left thigh', sub: 'least recently used', rot: -2, icon: 'blue', face: 'wink', fs: 15 })}
      ${faceTile({ x: 480, y: 540, s: 130, c: 'blue', face: 'wink', rot: 12, ty: 14 })}`,
    private: () => `
      ${clay({ x: 240, y: 20, s: 320, c: 'plum', g: 'lock', rot: 12, ty: 14, z: 30 })}
      ${faceTile({ x: 50, y: 210, s: 200, c: 'lime', face: 'wink', rot: -10, z: 34 })}
      <div class="bubble" aria-hidden="true" style="left:30px;top:440px;padding:22px 30px 24px;border-radius:30px;transform:rotate(-3deg)">
        <div class="t" style="margin:0;font-size:26px">Your records stay<br><b>on this phone.</b></div></div>`,
    cast: () => `
      <div class="ribbon" style="z-index:1">${ribbonSvg(900, 330, [[-1400, 262], [-600, 250], [60, 230], [240, 200], [450, 212], [660, 206], [860, 196]], { w: 18, dots: [[860, 196, 16]] })}</div>
      ${faceTile({ x: 70, y: 110, s: 170, c: 'violet', face: 'worried', rot: -10,
        extra: `<div class="qm" style="left:118px;top:-70px;font-size:80px;color:#C9F53A;transform:rotate(14deg)">?</div>` })}
      ${faceTile({ x: 340, y: 40, s: 240, c: 'lime', face: 'mouthO', rot: 6, tx: 0, ty: 0, z: 33, extra: googly(240, .55, .45) })}
      ${faceTile({ x: 640, y: 110, s: 170, c: 'plum', face: 'sleepy', rot: 10, extra: zz(110, -90, 72) })}`,
    remind: () => `
      ${note({ x: 0, y: 0, title: 'BPC-157 · due now', sub: '07:30 · every day', when: '07:30', rot: -2, icon: 'lime', face: 'happy', fs: 17 })}
      ${note({ x: 56, y: 102, title: 'NAD+ · tonight 20:00', sub: '50 mg · your next dose', when: 'in 10h', rot: 1.5, icon: 'blue', face: 'wink', fs: 17, z: 36 })}
      ${note({ x: 14, y: 204, title: 'Retatrutide · Mon 28 Sep', sub: '2 mg · weekly', when: 'Mon', rot: -1, icon: 'violet', face: 'happy', fs: 17, z: 37 })}
      ${clay({ x: 360, y: 10, s: 80, c: 'violet', g: 'bell', rot: 14, ty: 14, z: 20 })}`,
    logTile: () => `
      ${cut({ src: '03-log-dose', r: C.logSheet, s: .33, x: 0, y: 0, radius: 26, pad: 8, cls: 'white flat', label: 'Log dose sheet with amount, time and injection site' })}
      ${note({ x: 14, y: 470, title: 'BPC-157 logged · 07:34', sub: '250 mcg · abdomen, lower left', when: '07:34', dark: true, rot: -2, icon: 'lime', face: 'happy', fs: 14 })}`,
    sites: () => `
      ${cut({ src: '04-body-map', r: C.bodyMap, s: .27, x: 30, y: 0, radius: 22, pad: 6, cls: 'white flat', rot: -2, label: 'Body map with the left thigh selected' })}
      ${note({ x: 118, y: 262, title: 'Next site: left thigh', sub: 'least recently used', rot: 2, icon: 'blue', face: 'wink', fs: 13 })}`,
    stack: () => `
      ${cut({ src: '02-today', r: C.chips3, s: .5, x: 0, y: 6, radius: 30, pad: 6, cls: 'white flat', rot: -1.5 })}
      ${cut({ src: '02-today', r: C.trio, s: .34, x: 1, y: 84, radius: 24, cls: 'flat', z: 13, label: 'Stack cards for Retatrutide 2 mg, BPC-157 250 mcg and NAD+ 50 mg' })}`,
    progress: () => `
      ${cut({ src: '05-progress', r: C.weight, s: .32, x: 0, y: 6, rot: -2, radius: 26, cls: 'white flat', label: 'Weight trend card: down 2.3 kg since 3 August' })}
      ${cut({ src: '05-progress', r: C.doses, s: .3, x: 306, y: 140, rot: 4, radius: 22, cls: 'white flat', z: 13, label: '77 doses recorded over 8 weeks' })}`,
    journal: () => cut({ src: '09-journal', r: C.journal, s: .32, x: 5, y: 8, radius: 26, cls: 'white flat', label: 'Journal for Friday 25 September with water, a BPC-157 dose and weight' }),
    privTile: () => `
      ${clay({ x: 150, y: 20, s: 180, c: 'plum', g: 'lock', rot: 12, ty: 14, z: 30 })}
      ${faceTile({ x: 70, y: 130, s: 96, c: 'violet', face: 'happy', rot: -10, z: 32 })}`,
    how1: () => phone({ src: '07-plan-ready', sw: 250, x: 16, y: 8, alt: 'Peptio plan-ready screen with the first doses scheduled' }),
    how2: () => phone({ src: '02-today', sw: 250, x: 16, y: 8, alt: 'Peptio Today screen showing the next dose in 10h 19m' }),
    how3: () => phone({ src: '05-progress', sw: 250, x: 16, y: 8, alt: 'Peptio Progress screen with the weight trend and doses recorded' }),
    sleepy: () => faceTile({ x: 40, y: 80, s: 220, c: 'violet', face: 'sleepy', rot: -10, extra: zz(40, -110, 88) }),
    docLock: () => clay({ x: 30, y: 24, s: 150, c: 'plum', g: 'lock', rot: 12, ty: 14 }),
    docVial: () => clay({ x: 30, y: 24, s: 150, c: 'blue', g: 'vial', rot: -12 }),
  };

  /* ---------- stages: render when near the viewport, scale to the column ---------- */
  const stages = [...document.querySelectorAll('.stage[data-art]')];
  const dims = st => [parseFloat(st.style.getPropertyValue('--w')), parseFloat(st.style.getPropertyValue('--h'))];
  function render(st) {
    if (st.firstElementChild || !ART[st.dataset.art]) return;
    const [w, h] = dims(st);
    st.innerHTML = `<div class="stage-in" style="width:${w}px;height:${h}px">${ART[st.dataset.art]()}</div>`;
    fit(st);
  }
  function fit(st) {
    const inn = st.firstElementChild; if (!inn) return;
    inn.style.transform = `scale(${st.clientWidth / dims(st)[0]})`;
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { render(e.target); io.unobserve(e.target); } }), { rootMargin: '900px 0px' });
    stages.forEach(st => st.closest('.hero') ? render(st) : io.observe(st));
  } else stages.forEach(render);

  /* ---------- the ribbon ----------
     Starts as the full stop of "took", threads the three story sections, arrives in the white feature
     section and stops just after its heading. Below 761px only the hero and closing segments are drawn. */
  function drawRibbon() {
    const page = document.getElementById('page'), host = document.getElementById('rib');
    if (!page || !host) return;
    const pr = page.getBoundingClientRect(), W = page.clientWidth, H = page.scrollHeight;
    const rel = el => { const r = el.getBoundingClientRect(); return { l: r.left - pr.left, t: r.top - pr.top, w: r.width, h: r.height, b: r.bottom - pr.top, cx: r.left - pr.left + r.width / 2 }; };
    const mob = W < 761, sw = mob ? 7 : 22;
    const dr = rel(document.getElementById('dot')), dot = [dr.l + dr.w * .5, dr.b - dr.h * .5];
    const cr = rel(document.getElementById('cap')), fs = parseFloat(getComputedStyle(document.getElementById('gridhead')).fontSize);
    const cap = [cr.l + cr.w * .62, cr.b - fs * .3];
    const grid = rel(document.getElementById('features'));
    const startDot = [dot[0], dot[1], dr.w * .42, '#C9F53A', ''], endDot = [cap[0], cap[1], mob ? 9 : 17, '#6A5AE0', ''];
    host.style.width = W + 'px'; host.style.height = H + 'px';

    if (mob) {
      const hero = rel(document.querySelector('.hero')), a = rel(document.querySelector('.hero .stage'));
      const c = rel(document.querySelector('.hero .ctaline')), e = W - 7;
      const heroPts = [dot, [W * .62, dot[1] + 20], [e, c.t], [e, c.b + 10], [a.l + a.w * .22, a.t + a.h * .38], [a.l + a.w * .78, a.t + a.h * .62], [e, hero.b - 40], [e, hero.b]];
      const endPts = [[e, grid.t], [e, grid.t + 30], [e, cap[1] - 40], [cap[0] + 28, cap[1] - 4], cap];
      host.innerHTML = ribbonSvg(W, H, heroPts, { w: sw, cap: 'butt', dots: [startDot] })
        + ribbonSvg(W, H, endPts, { w: sw, cap: 'butt', stops: [[0, '#6A5AE0'], [1, '#6A5AE0']], dots: [endDot] });
      return;
    }
    const stops = [];
    page.querySelectorAll('[data-ribc]').forEach(s => { const r = rel(s); stops.push([Math.max(0, (r.t + 90) / H), s.dataset.ribc], [Math.min(1, (r.b - 90) / H), s.dataset.ribc]); });
    const pts = [dot];
    page.querySelectorAll('.stage[data-rib]').forEach((el, i) => {
      const a = rel(el), sec = rel(el.closest('header,section'));
      if (i === 0) { pts.push([a.l + a.w * .08, a.t + a.h * .86], [a.l + a.w * .6, sec.b - 30]); return; }
      const dir = el.dataset.rib === 'left' ? 1 : -1;
      pts.push([a.cx - dir * a.w * .42, sec.t + 70], [a.cx - dir * a.w * .1, a.t + a.h * .45], [a.cx + dir * a.w * .25, a.t + a.h * .8], [a.cx + dir * a.w * .55, sec.b - 50]);
    });
    pts.push([W * .74, grid.t + 30], [cap[0] + 170, cap[1] - 70], [cap[0] + 60, cap[1] - 6], cap);
    host.innerHTML = ribbonSvg(W, H, pts, { w: sw, stops, vertical: true, dots: [startDot, endDot] });
  }

  function layout() { stages.forEach(fit); drawRibbon(); }
  layout();
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layout, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  addEventListener('load', layout);
})();
