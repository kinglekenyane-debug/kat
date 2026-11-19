/* ===== KAT screens (Preact + htm) ===== */
const { h, render } = preact;
const { useState, useEffect, useMemo, useRef } = preactHooks;
const html = htm.bind(h);
const app = new Store();
if (typeof cloud !== 'undefined') cloud.attach(app);
const onCloud = () => !!(app.cloud && !app.offline);

/* ---- icons ---- */
const P = {
  back: 'M15 18l-6-6 6-6', chev: 'M9 18l6-6-6-6', check: 'M9 11l3 3 8-8|M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9',
  home: 'M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', warn: 'M12 9v4|M12 17h.01|M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20|M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z|M21 21l-4.3-4.3',
  print: 'M6 9V2h12v7|M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2|M6 14h12v8H6z', plus: 'M12 5v14|M5 12h14',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', swap: 'M17 3l4 4-4 4|M3 7h18|M7 21l-4-4 4-4|M21 17H3',
  wifi: 'M5 12.55a11 11 0 0 1 14.08 0|M8.53 16.11a6 6 0 0 1 6.95 0|M12 20h.01', nowifi: 'M2 2l20 20|M8.5 16.4a6 6 0 0 1 7 0|M5 12.6a11 11 0 0 1 5.2-2.6|M16.7 10.4A11 11 0 0 1 19 12.6|M12 20h.01',
  list: 'M8 6h13|M8 12h13|M8 18h13|M3 6h.01|M3 12h.01|M3 18h.01', grid: 'M3 3h7v7H3z|M14 3h7v7h-7z|M3 14h7v7H3z|M14 14h7v7h-7z',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z|M14 2v6h6', cover: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2|M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z|M19 8v6|M22 11h-6',
  cal: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M16 2v4|M8 2v4|M3 10h18', inbox: 'M22 12h-6l-2 3h-4l-2-3H2|M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z', x: 'M18 6L6 18|M6 6l12 12'
};
const Icon = ({ n, s = 22, w = 2 }) => html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=${w} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n].split('|').map((d) => html`<path d=${d}></path>`)}</svg>`;
const Logo = ({ s = 56 }) => {
  const c = app.db ? app.school.colors : SCHOOLS[0].colors;
  // KAT logo A "tick face" (King's pick): gold cat head, the tick is its face, red inner ears
  return html`<svg width=${s} height=${s} viewBox="0 0 100 100" role="img" aria-label="KAT cat tick logo"><rect width="100" height="100" rx="22" fill=${c.primary} stroke="rgba(255,255,255,.35)" stroke-width="2"></rect>
    <path d="M22 42 L25 15 L42 29 Q50 26 58 29 L75 15 L78 42 Q85 54 78 66 Q68 82 50 82 Q32 82 22 66 Q15 54 22 42 Z" fill=${c.accent}></path>
    <path d="M30 21 L39 29 L31 32 Z" fill=${c.red}></path><path d="M70 21 L61 29 L69 32 Z" fill=${c.red}></path>
    <path d="M34 56 L45 67 L67 43" fill="none" stroke=${c.primary} stroke-width="8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
};

/* ---- shared bits ---- */
const initials = (n) => n.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/, '').split(/[\s.]+/).filter(Boolean).map((x) => x[0]).slice(0, 2).join('').toUpperCase();
const LOOK = { P: 'Present', A: 'Absent', L: 'Late' };
const NEXT = { P: 'A', A: 'L', L: 'P' };
function Band({ title, sub, nav, right, children, noBack }) {
  return html`<header class="band"><div class="col gut band-in">
    <div class="band-row">
      ${!noBack && html`<button class="iconbtn back" aria-label="Back" onClick=${() => nav.back()}><${Icon} n="back" w=${2.2} /></button>`}
      <div class="grow"><h1>${title}</h1>${sub && html`<div class="sub">${sub}</div>`}</div>
      ${right}
    </div>${children}</div></header>`;
}
function WideBand({ title, sub, nav, right, noBack }) {
  const s = app.school;
  return html`<header class="band"><div class="wide gut band-in"><div class="band-row" style="flex-wrap:wrap">
    ${!noBack && html`<button class="iconbtn back" aria-label="Back" onClick=${() => nav.back()}><${Icon} n="back" w=${2.2} /></button>`}
    <div class="crestbox"><img src=${s.crest} alt=${s.name + ' crest'} /></div>
    <div class="grow" style="min-width:180px"><h1>${title}</h1><div class="sub">${sub}</div></div>
    ${right}<span class="pill" style="background:rgba(255,255,255,.16);color:#fff">Sample data</span>
  </div></div></header>`;
}
function NetBar() {
  if (!app.offline) return null;
  const n = app.pending();
  return html`<div class="netbar"><div class="col gut row" style="gap:8px"><${Icon} n="nowifi" s=${18} /><span>No signal. Registers stay on this phone and send when the signal is back.${n ? ' ' + n + ' waiting.' : ''}</span></div></div>`;
}
function Sheet({ onClose, title, children }) {
  return html`<div class="scrim" onClick=${(e) => { if (e.target === e.currentTarget) onClose(); }}><div class="sheet" role="dialog" aria-modal="true" aria-label=${title}>
    <div class="between"><h2>${title}</h2><button class="iconbtn" style="color:var(--muted)" aria-label="Close" onClick=${onClose}><${Icon} n="x" /></button></div>${children}</div></div>`;
}
function Toast() { return app.toastMsg ? html`<div class="toast" role="status">${app.toastMsg}</div>` : null; }
function ago(school, d) { const n = schoolDaysSince(school, d, todayISO()); return n === 0 ? 'today' : n === 1 ? 'yesterday' : n + ' school days ago'; }
function myGroups() { return app.db.groups.filter((g) => g.teacherId === app.me.id); }
function myPool() {
  const s = new Set(); const me = app.me;
  if (me.registerClass) classLearners(app.db, me.registerClass).forEach((a) => s.add(a));
  myGroups().forEach((g) => g.learners.forEach((a) => s.add(a)));
  return [...s];
}
function LearnerPicker({ pool, value, onPick, label = 'Learner', id = 'lp' }) {
  const [q, setQ] = useState('');
  const db = app.db;
  const all = pool || Object.keys(db.learners);
  const ql = q.trim().toLowerCase();
  const hits = ql.length < 1 ? [] : all.filter((a) => { const l = db.learners[a]; return a.includes(ql) || (l.first + ' ' + l.surname + ' ' + l.surname + ', ' + l.first).toLowerCase().includes(ql); }).slice(0, 8);
  if (value) { const l = db.learners[value]; return html`<div class="f stack"><span class="small muted" style="font-weight:600">${label}</span><div class="radio-row" aria-checked="true"><span class="grow"><b>${learnerShort(l)}</b> <span class="muted small">· ${l.cls || 'no register class'} · Acc. ${l.acc}</span></span><button class="btn sm soft" onClick=${() => onPick(null)}>Change</button></div></div>`; }
  return html`<div class="stack"><label class="f" for=${id}>${label}<input id=${id} class="inp" placeholder="Type a name or accession number" value=${q} onInput=${(e) => setQ(e.target.value)} autocomplete="off" /></label>
    ${hits.length > 0 && html`<div class="card flat">${hits.map((a) => { const l = db.learners[a]; return html`<button class="list-row" style="min-height:48px" onClick=${() => { onPick(a); setQ(''); }}><span class="grow"><b>${learnerName(l)}</b><br /><span class="tiny muted">${l.cls || 'subject class only'} · Acc. ${a}</span></span></button>`; })}</div>`}
    ${ql && !hits.length && html`<span class="small muted">No learner matches "${q}".</span>`}</div>`;
}
function BottomNav({ nav, cur }) {
  const role = app.me.role;
  const items = role === 'teacher'
    ? [['home', 'Home', 'home'], ['register', 'Register', 'check'], ['incidents', 'Incidents', 'warn'], ['books', 'Books', 'book']]
    : role === 'office' ? [['office', 'Today', 'grid'], ['capture', 'SA-SAMS', 'inbox'], ['records', 'Records', 'file'], ['admin', 'Admin', 'gear'], ['settings', 'More', 'user']]
      : [['office', 'Today', 'grid'], ['records', 'Records', 'file'], ['admin', 'Admin', 'gear'], ['settings', 'More', 'user']];
  return html`<nav class="bnav" aria-label="Main"><div class=${'bnav-in ' + (role === 'teacher' ? 'col' : 'wide')}>${items.map(([r, label, ic]) => html`<button aria-current=${cur === r ? 'page' : null} onClick=${() => { if (r === 'register') { const c = app.me.registerClass; c ? nav.reset('register', { cls: c }) : nav.reset('cover'); } else nav.reset(r); }}><${Icon} n=${ic} />${label}</button>`)}</div></nav>`;
}

/* ================= opening screen ================= */
/* ================= opening screen → role → sign in ================= */
const ROLE_GROUPS = [
  ['teacher', 'Teacher', 'Registers, period registers, incidents and book lists', 'check'],
  ['smt', 'SMT', 'Heads of department and deputies: your grade plus the school today', 'list'],
  ['principal', 'Principal', 'The whole school, reports and settings', 'gear'],
  ['admin', 'Admin', 'Office: SA-SAMS capture, records and the timetable', 'inbox'],
];
function Welcome() {
  const [sid, setSid] = useState(app.session.schoolId || 'ficksburg');
  const [step, setStep] = useState('open'), [grp, setGrp] = useState(null), [more, setMore] = useState(false);
  if (!app.db || app.db.schoolId !== sid) { app.loadSchool(sid); app.session = { schoolId: sid, userId: null }; LS.set('teng:session', app.session); }
  const db = app.db, s = app.school;
  const [who, setWho] = useState(null), [sym, setSym] = useState(''), [pw, setPw] = useState(''), [pw2, setPw2] = useState(''), [err, setErr] = useState(''), [tries, setTries] = useState(0), [waitTill, setWaitTill] = useState(0), [keep, setKeep] = useState(true);
  const findSym = (v) => db.staff.find((x) => (x.code || '').toUpperCase() === v.trim().toUpperCase());
  const [cst, setCst] = useState(null), [busy, setBusy] = useState(false), [startPw, setStartPw] = useState('');
  useEffect(() => {
    setCst(null); if (!onCloud() || sym.trim().length < 2) return;
    let live = true; const t = setTimeout(() => { app.cloud.status(sid, sym).then((v) => { if (live) setCst(v); }).catch(() => {}); }, 300);
    return () => { live = false; clearTimeout(t); };
  }, [sym, sid]);
  const remembered = app.rememberedUsers();
  const choose = (x) => { setWho(x); setSym(x.code || ''); setPw(''); setPw2(''); setErr(''); setTimeout(() => { const el = document.getElementById('wpw'); if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.focus(); } }, 50); };
  const finish = async (x) => { if (keep) await app.remember(x.id); else app.forget(x.id); app.signIn(sid, x.id, keep); };
  const login = async (e) => {
    e && e.preventDefault();
    if (onCloud()) return cloudLogin();
    const x = who || findSym(sym); if (!x) { setErr('No staff member has the symbol "' + sym + '". Check with the office.'); return; }
    if (staffGroup(x) !== grp) { setErr(x.name + ' signs in as ' + ROLE_GROUPS.find((r) => r[0] === staffGroup(x))[1] + '. Go back and choose that.'); return; }
    if (!who) setWho(x);
    if (Date.now() < waitTill) { setErr('Too many wrong tries. Wait a few seconds and try again.'); return; }
    if (!x.pw) { if (pw.length < 6) { setErr('Choose a password of at least 6 characters.'); return; } if (pw !== pw2) { setErr('The two passwords are not the same.'); return; } await app.setPassword(x.id, pw); await finish(x); return; }
    if (await app.checkPassword(x.id, pw)) { await finish(x); return; }
    const t = tries + 1; setTries(t); if (t >= 5) { setWaitTill(Date.now() + 30000); setTries(0); }
    setErr(t >= 5 ? 'Wrong password five times. Wait 30 seconds, or ask an admin to reset it.' : 'Wrong password. Try again.');
  };
  // with the shared database: the login lives on the school's database, so any phone works
  const cloudLogin = async () => {
    if (Date.now() < waitTill) { setErr('Too many wrong tries. Wait a few seconds and try again.'); return; }
    const x1 = who || findSym(sym);
    if (x1 && staffGroup(x1) !== grp) { setErr(x1.name + ' signs in as ' + ROLE_GROUPS.find((r) => r[0] === staffGroup(x1))[1] + '. Go back and choose that.'); return; }
    if (!sym.trim()) { setErr('Type your symbol.'); return; }
    if (!pw) { setErr('Type your password.'); return; }
    const first = cst === 'invited';
    if (first) { if (!startPw) { setErr('Type the starting password the admin gave you.'); return; } if (pw.length < 6) { setErr('Choose a password of at least 6 characters.'); return; } if (pw !== pw2) { setErr('The two new passwords are not the same.'); return; } }
    setBusy(true); setErr('');
    const r = await app.cloud.signIn(sid, sym, pw, first ? startPw : null, pw2);
    setBusy(false);
    if (r.first) { setCst('invited'); setErr('First time: type the starting password from the admin, then choose your own.'); return; }
    if (r.err === 'wrong-start') { const t = tries + 1; setTries(t); if (t >= 5) { setWaitTill(Date.now() + 30000); setTries(0); } setErr('That starting password is wrong. Check it with the admin.'); return; }
    if (r.err === 'wrong') { const t = tries + 1; setTries(t); if (t >= 5) { setWaitTill(Date.now() + 30000); setTries(0); } setErr(t >= 5 ? 'Wrong password five times. Wait 30 seconds, or ask an admin to reset it.' : 'Wrong password. Try again.'); return; }
    if (r.err) { setErr(r.err); return; }
    const sid2 = app.cloud.member.school_id, x = app.db.staff.find((y) => (y.code || '').toUpperCase() === r.code);
    if (!x) { setErr('Signed in, but ' + r.code + ' is not on the staff list. Ask the office.'); return; }
    await app.setPassword(x.id, pw);
    if (keep) await app.remember(x.id); else app.forget(x.id);
    app.signIn(sid2, x.id, keep);
  };
  const cont = (x) => {
    const c = app.cloud;
    if (c && !app.offline && !(c.user && c.user.email === c.email(sid, x.code))) { setGrp(staffGroup(x)); setStep('signin'); choose(x); setErr('Type your password once to connect this phone to the school database.'); return; }
    app.signIn(sid, x.id);
  };
  const roleLine = (x) => (x.code ? x.code + ' · ' : '') + x.title + (x.registerClass ? ' · register class ' + x.registerClass : '');
  const person = (x) => html`<button class="person" onClick=${() => choose(x)}><span class="avatar">${x.code || initials(x.name)}</span><span class="grow"><b>${x.name}</b><br /><span class="tiny muted">${roleLine(x)}</span></span></button>`;
  const credit = html`<p class="credit">Developed by KK Lekenyane</p>`;
  const crestLine = html`<div class="row" style="gap:10px;justify-content:center;margin-top:8px"><img src=${s.crest} alt=${s.name + ' crest'} style="width:34px;height:34px;object-fit:contain;background:#fff;border-radius:6px" /><span class="small muted">${s.name}${s.motto && s.id === 'ficksburg' ? ' · ' + s.motto : ''}</span></div>`;

  if (step === 'open') return html`<div class="welcome opening">
    <div class="hero open-hero"><div class="col gut open-in">
      <img class="open-crest" src=${s.crest} alt=${s.name + ' crest'} />
      <${Logo} s=${92} />
      <div class="wordmark" style="font-size:44px">KAT</div>
            <div class="tagline"><b>K</b>eeping <b>A</b>ttendance <b>T</b>oday</div>
      <div class="small" style="opacity:.9">${s.name}${s.local ? ' · ' + s.local : ''}</div>
    </div></div>
    <main class="col gut content">
      ${remembered.length > 0 && html`<section class="stack"><span class="eyebrow">Welcome back</span>${remembered.map((x) => html`<button class="person" onClick=${() => cont(x)}><span class="avatar">${x.code || initials(x.name)}</span><span class="grow"><b>Continue as ${x.short || x.name}</b><br /><span class="tiny muted">Remembered on this phone</span></span><${Icon} n="chev" s=${18} /></button>`)}</section>`}
      <button class="btn big" onClick=${() => setStep('role')}>${remembered.length ? 'Sign in as someone else' : 'Get started'}</button>
      <div class="boxnote warn"><span><strong>Test version.</strong> Every learner and mark here is made up.</span></div>
      <details class="small muted"><summary>Change school</summary><div class="wrap" style="margin-top:8px">${SCHOOLS.map((x) => { const st = (LS.get('teng:data:' + x.id) || {}).settings || {}; return html`<button class="schoolpick" aria-pressed=${String(sid === x.id)} onClick=${() => setSid(x.id)}><img src=${st.crest || x.crest} alt="" /><span class="grow"><b>${st.name || x.name}</b><br /><span class="tiny muted">${x.id === 'ficksburg' ? 'Pilot school' : 'Shows each school has its own data'}</span></span></button>`; })}</div></details>
    </main>
    ${credit}${app.cloud && html`<p class="credit" style="margin-top:-6px"><button class="linkbtn tiny" onClick=${() => { setStep('dev'); setPw(''); setPw2(''); setErr(''); setCst(null); app.cloud.devExists().then((x) => setCst(x ? 'claimed' : 'invited')).catch(() => setErr('Could not reach the database.')); }}>Developer sign-in</button></p>`}
  </div>`;

  if (step === 'dev') return html`<div class="welcome">
    <header class="band"><div class="col gut band-in"><div class="band-row"><button class="iconbtn back" aria-label="Back" onClick=${() => setStep('open')}><${Icon} n="back" /></button><div class="grow"><h1>Developer sign-in</h1><div class="sub">Sets up schools and their first admin</div></div><${Logo} s=${34} /></div></div></header>
    <main class="col gut content"><form class="card" onSubmit=${async (e) => { e.preventDefault(); if (Date.now() < waitTill) { setErr('Too many wrong tries. Wait a few seconds.'); return; } setBusy(true); setErr(''); const r = await app.cloud.devSignIn(pw, cst === 'invited' ? pw2 : null); setBusy(false); if (r.first) { setCst('invited'); return; } if (r.err === 'wrong') { const t = tries + 1; setTries(t); if (t >= 5) { setWaitTill(Date.now() + 30000); setTries(0); } setErr('Wrong password.'); return; } if (r.err) { setErr(r.err); return; } app.emit(); }}>
      ${cst === 'invited' && html`<div class="boxnote info"><span><strong>No developer yet.</strong> Choose the developer password now. Only the first person to do this becomes the developer, so do it straight away.</span></div>`}
      <label class="f" for="wpw">Developer password<input id="wpw" type="password" class="inp" autocomplete=${cst === 'invited' ? 'new-password' : 'current-password'} value=${pw} onInput=${(e) => setPw(e.target.value)} /></label>
      ${cst === 'invited' && html`<label class="f" for="wpw2">Type it again<input id="wpw2" type="password" class="inp" autocomplete="new-password" value=${pw2} onInput=${(e) => setPw2(e.target.value)} /></label>`}
      ${err && html`<span class="small" role="alert" style="color:var(--abs-ink);font-weight:600">${err}</span>`}
      <button class="btn big" type="submit" disabled=${busy || !cst}>${busy ? 'Signing in…' : 'Sign in'}</button></form></main>${credit}</div>`;

  if (step === 'role') return html`<div class="welcome">
    <header class="band"><div class="col gut band-in"><div class="band-row"><button class="iconbtn back" aria-label="Back" onClick=${() => setStep('open')}><${Icon} n="back" /></button><div class="grow"><h1>Who are you?</h1><div class="sub">${s.name}</div></div><${Logo} s=${34} /></div></div></header>
    <main class="col gut content">
      ${ROLE_GROUPS.map(([k, label, line, ic]) => html`<button class="person rolepick" onClick=${() => { setGrp(k); setStep('signin'); setWho(null); setSym(''); setPw(''); setPw2(''); setErr(''); setMore(false); }}><span class="avatar" style="background:var(--primary);color:#fff"><${Icon} n=${ic} s=${20} /></span><span class="grow"><b style="font-size:17px">${label}</b><br /><span class="tiny muted">${line}</span></span><${Icon} n="chev" s=${18} /></button>`)}
      ${crestLine}
    </main>${credit}</div>`;

  const label = ROLE_GROUPS.find((r) => r[0] === grp)[1];
  const people = db.staff.filter((x) => staffGroup(x) === grp);
  const shown = more || grp !== 'teacher' ? people : people.filter((x) => x.id === 'king');
  const x0 = who || findSym(sym);
  return html`<div class="welcome">
    <header class="band"><div class="col gut band-in"><div class="band-row"><button class="iconbtn back" aria-label="Back" onClick=${() => setStep('role')}><${Icon} n="back" /></button><div class="grow"><h1>Sign in · ${label}</h1><div class="sub">${s.name}</div></div><${Logo} s=${34} /></div></div></header>
    <main class="col gut content">
      <form class="card" onSubmit=${login}>
        <label class="f" for="wsym">Your symbol<input id="wsym" class="inp" autocomplete="username" style="text-transform:uppercase" placeholder="e.g. LK" value=${sym} onInput=${(e) => { setSym(e.target.value.toUpperCase()); setWho(null); setErr(''); }} /></label>
        ${x0 && html`<span class="small muted">${x0.name} · ${x0.title}</span>`}
        ${onCloud() && cst === 'invited' ? html`<div class="boxnote info"><span><strong>First time?</strong> Type the starting password the admin gave you, then choose your own. Nobody else, not even the office, can see yours.</span></div>
          <label class="f" for="wst">Starting password from the admin<input id="wst" type="password" class="inp" autocomplete="off" value=${startPw} onInput=${(e) => setStartPw(e.target.value)} /></label>
          <label class="f" for="wpw">Your new password<input id="wpw" type="password" class="inp" autocomplete="new-password" value=${pw} onInput=${(e) => setPw(e.target.value)} /></label>
          <label class="f" for="wpw2">Type it again<input id="wpw2" type="password" class="inp" autocomplete="new-password" value=${pw2} onInput=${(e) => setPw2(e.target.value)} /></label>`
        : onCloud() && cst === 'free' ? html`<div class="boxnote warn"><span>${sym} has no starting password yet. Ask the admin to give you one.</span></div>`
        : onCloud() && cst === 'no-school' ? html`<div class="boxnote warn"><span>${s.short || s.name} is not set up in KAT yet.</span></div>`
        : (!onCloud() && x0 && !x0.pw) ? html`<div class="boxnote info"><span><strong>First time?</strong> Choose your own password. Nobody else, not even the office, can see it.</span></div>
          <label class="f" for="wpw">New password<input id="wpw" type="password" class="inp" autocomplete="new-password" value=${pw} onInput=${(e) => setPw(e.target.value)} /></label>
          <label class="f" for="wpw2">Type it again<input id="wpw2" type="password" class="inp" autocomplete="new-password" value=${pw2} onInput=${(e) => setPw2(e.target.value)} /></label>` : html`<label class="f" for="wpw">Password<input id="wpw" type="password" class="inp" autocomplete="current-password" value=${pw} onInput=${(e) => setPw(e.target.value)} /></label>`}
        <label class="check"><input type="checkbox" checked=${keep} onChange=${(e) => setKeep(e.target.checked)} /><span>Remember me on this phone<br /><span class="tiny muted">Next time KAT opens straight away, no password. Untick on a shared phone.</span></span></label>
        ${err && html`<span class="small" role="alert" style="color:var(--abs-ink);font-weight:600">${err}</span>`}
        ${onCloud() && cst === 'unknown' && html`<span class="small muted">No one at ${s.short || s.name} has the symbol ${sym}.</span>`}
        <button class="btn big" type="submit" disabled=${busy}>${busy ? 'Signing in…' : 'Sign in'}</button>
        <span class="tiny muted">Forgot your password? An admin can reset it, then you choose a new one.</span>
      </form>
      ${people.length > 0 && html`<section class="stack"><span class="eyebrow">Test shortcut</span>
        <p class="small muted" style="margin:0">Tap a person to fill in their symbol, then enter their password. The first time, you choose one.</p>
        ${shown.map(person)}
        ${!more && people.length > shown.length && html`<button class="linkbtn" onClick=${() => setMore(true)}>Show all ${people.length} ${label === 'SMT' ? 'SMT members' : label.toLowerCase() + 's'}</button>`}</section>`}
    </main>${credit}</div>`;
}

function nextLesson(g, today) {
  for (let i = 1; i <= 7; i++) { const d = addDays(today, i); const sl = g.slots.filter((s) => s.d === dow(d)).sort((a, b) => a.p - b.p)[0]; if (sl) return DOW[dow(d)] + ' ' + pLabel(sl.p, sl.len || 1); }
  return '';
}
/* ================= teacher home ================= */
function Home({ nav }) {
  const db = app.db, me = app.me, s = app.school, today = todayISO();
  const cls = me.registerClass, st = cls ? classStatus(db, cls, today) : null;
  const open = cls ? Object.keys(db.reasons).filter((k) => { const [a] = k.split('|'); return db.learners[a] && db.learners[a].cls === cls && !db.reasons[k].code; }).length : 0;
  const groups = myGroups();
  const lessons = lessonsFor(db, me.id, today).map((l) => Object.assign({ g: db.groups.find((x) => x.id === l.gid) }, l));
  const ch = app.getChange(today);
  const [swap, setSwap] = useState(null);
  const missed = missedFor(db, s, me.id, today, 10);
  const tday = schoolTimes(s).days[dow(today)];
  const sign = signoffDue(s, me, today);
  const now = nowHM();
  const todayIds = lessons.map((l) => l.gid);
  groups.sort((a, b) => { const ia = todayIds.indexOf(a.id), ib = todayIds.indexOf(b.id); if ((ia < 0) !== (ib < 0)) return ia < 0 ? 1 : -1; if (ia >= 0) return lessons[ia].p - lessons[ib].p; return (a.grade || 0) - (b.grade || 0) || a.short.localeCompare(b.short) || a.label.localeCompare(b.label); });
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  let pill = html`<span class="pill red">Not taken yet</span>`, line = '';
  if (st && st.st === 'wait') pill = html`<span class="pill wait">Saved on this phone</span>`;
  if (st && st.st === 'in') { pill = html`<span class="pill ok">Sent ${st.rec.at.slice(11)}</span>`; line = st.a + ' absent · ' + st.l + ' late' + (st.rec.by !== me.id ? ' · marked by ' + staffName(db, st.rec.by) + ' (covering)' : ''); }
  const dh = me.dhGrade ? db.classes.filter((c) => c.grade === me.dhGrade && c.id !== cls) : [];
  return html`<div class="app">
    <header class="band home-band"><div class="col gut band-in">
      <div class="row"><div class="crestbox"><img src=${s.crest} alt=${s.name + ' crest'} /></div>
        <div class="grow"><div class="row" style="gap:8px"><span style="font-size:22px;font-weight:800">KAT</span><${Logo} s=${22} /></div><div class="tiny" style="opacity:.9">${s.name}</div></div>
        <button class="iconbtn" aria-label="Settings and switch person" onClick=${() => nav.go('settings')}><${Icon} n="user" /></button></div>
      <div><div class="small" style="opacity:.85">${fmtLong(today)}</div><div style="font-size:23px;font-weight:700">${hello}, ${me.short}</div></div>
    </div></header>
    <${NetBar} />
    <main class="col gut content home-main">
      ${cls ? html`<section class="card">
        <div class="between"><span class="eyebrow">Morning register</span>${pill}</div>
        <div class="row" style="align-items:baseline;gap:8px"><span style="font-size:28px;font-weight:700">${cls}</span><span class="small muted">${classLearners(db, cls).length} learners · ${tday ? (tday.held ? 'Assembly ' + tday.start + ' · due by ' + tday.due : 'No assembly today: take it in class at P1') : 'Assembly ' + s.assembly}</span></div>
        ${line && html`<span class="small muted">${line}</span>`}
        ${!isSchoolDay(s, today) && html`<span class="small muted">Today is not a school day in the calendar. You can still try the register.</span>`}
        <button class="btn big" onClick=${() => nav.go('register', { cls })}><${Icon} n="check" s=${20} />${st && st.rec ? 'Open register' : 'Take register'}</button>
      </section>` : html`<section class="card"><span class="eyebrow">Morning register</span><span class="small muted">You do not have a register class. You can still cover a class for a colleague.</span></section>`}
      ${s.noSchool && s.noSchool[today] && html`<div class="boxnote warn"><span><strong>No school today:</strong> ${s.noSchool[today]}. No registers are needed.</span></div>`}
      ${(ch.absent || ch.signout) && html`<div class="boxnote warn"><span>${ch.absent ? html`<strong>You are marked absent today.</strong> Your lessons show as not held, so they need no register. The office can arrange cover for ${cls || 'your class'}.` : html`<strong>You signed out at ${ch.signout}.</strong> Lessons after that show as not held.`}</span><button class="btn sm line" style="background:var(--surface)" onClick=${() => { const c2 = Object.assign({}, ch); delete c2.absent; delete c2.signout; app.setChange(today, c2); app.toast(ch.absent ? 'You are marked present again.' : 'Sign-out undone.'); }}>Undo</button></div>`}
      ${sign && html`<button class="alertcard" style="background:var(--wait-bg);border-color:transparent;border-left-color:var(--accent)" onClick=${() => nav.go('print')}><${Icon} n="print" /><span class="grow"><b>${sign.k === 'principal' ? "Sign off last week's registers" : sign.k === 'smt' ? "Sign off this week's registers (SMT)" : 'Sign your register for this week'}</b><br /><span class="tiny muted">Due ${DOW_LONG[sign.d]} ${sign.t}. Print the month and sign the week box.</span></span><${Icon} n="chev" s=${18} /></button>`}
      ${missed.length > 0 && html`<button class="alertcard" onClick=${() => nav.go('missed')}><span class="countdot">${missed.length}</span><span class="grow"><b>Registers not taken</b><br /><span class="tiny muted">${missed.slice(0, 2).map((x) => (x.kind === 'm' ? 'Morning ' + x.cls : groupLabel(x.g) + ' ' + pLabel(x.p, x.len)) + ' · ' + (x.date === today ? 'today' : fmtShort(x.date))).join(', ')}${missed.length > 2 ? ' and more' : ''}. Tap to catch up.</span></span><${Icon} n="chev" s=${18} /></button>`}
      ${open > 0 && html`<button class="alertcard" onClick=${() => nav.go('reasons', { cls })}><span class="countdot">${open}</span><span class="grow"><b>Absences need a reason</b><br /><span class="tiny muted">Update when a learner or parent explains</span></span><${Icon} n="chev" s=${18} /></button>`}
      ${staffGroup(me) === 'smt' && html`<button class="alertcard" style="background:var(--info-bg);border-color:transparent;border-left-color:var(--primary)" onClick=${() => nav.go('office')}><${Icon} n="grid" /><span class="grow"><b>Whole school today</b><br /><span class="tiny muted">All 25 register classes, absentees and follow-ups</span></span><${Icon} n="chev" s=${18} /></button>`}
      ${dh.length > 0 && html`<section class="card"><div class="between"><span class="eyebrow">Grade ${me.dhGrade} registers</span><span class="tiny muted">You are head of department</span></div>
        <div class="ctiles">${dh.map((c) => { const x = classStatus(db, c.id, today); return html`<button class=${'ctile ' + x.st} onClick=${() => nav.go('register', { cls: c.id, cover: x.st === 'none' })}><span class="t"><b>${c.id}</b><span class="dot"></span></span><span class="tiny">${x.st === 'none' ? 'Not taken · tap to cover' : x.st === 'wait' ? 'Saved on phone' : x.p + ' of ' + x.n + ' present'}</span></button>`; })}</div></section>`}
      <section class="stack"><div class="between" style="margin:0 4px"><h2 class="h2" style="margin:0">Period register</h2><button class="btn sm line" onClick=${() => setSwap({})}><${Icon} n="swap" s=${16} />Change today</button></div>
        ${(ch.dayAs || (ch.moves || []).length || (ch.cancel || []).length || (ch.extra || []).length) ? html`<div class="boxnote info"><span>${ch.dayAs ? 'Today follows ' + DOW_LONG[ch.dayAs] + "'s timetable. " : ''}${[(ch.moves || []).length ? (ch.moves || []).length + ' moved' : '', (ch.cancel || []).length ? (ch.cancel || []).length + ' not taught' : '', (ch.extra || []).length ? (ch.extra || []).length + ' extra' : ''].filter(Boolean).join(', ')}${(ch.moves || []).length + (ch.cancel || []).length + (ch.extra || []).length ? ' today.' : ''}</span></div>` : null}
        <div class="card flat">
          ${groups.length === 0 && html`<p class="small muted" style="margin:0;padding:14px 16px">No subject classes yet. They appear once the office uploads the school timetable.</p>`}
          ${groups.map((g) => { const tl = lessons.filter((l) => l.gid === g.id); const empty = !g.learners.length; const nx = nextLesson(g, today); const go = (l) => (empty ? nav.go('upload', { gid: g.id }) : l ? nav.go('period', { gid: g.id, p: l.p }) : nav.go('period', { pick: true, pgid: g.id }));
            const head = html`<span class="ptile" style=${tl.length ? 'background:var(--accent);' : ''}><small style=${tl.length ? 'color:#1A1D23' : ''}>${tl.length ? 'TODAY' : g.short.slice(0, 4)}</small><b style=${'font-size:' + (g.label.length > 2 ? 12 : 15) + 'px;' + (tl.length ? 'color:#1A1D23' : '')}>${g.label}</b></span>`;
            const notTaken = (l) => l && !l.off && !empty && l.end && l.end <= now && !app.getRegister('p', g.id, today, l.p);
            const sub = (l) => { const done = l && app.getRegister('p', g.id, today, l.p); return html`<span class="small muted">${l ? 'Today ' + pLabel(l.p, l.len) + ' · ' + app.bellRange(l.p, l.len) + (l.moved ? ' · moved from ' + pLabel(l.orig, l.len) : l.extra ? ' · extra lesson' : '') : nx ? 'Next: ' + nx : 'No lessons on the timetable'}${empty ? ' · class list needed' : ''}</span>${done ? html`<br /><span class="tiny" style="color:var(--ok-fg);font-weight:600">${done.synced ? 'Register done ✓' : 'Saved on phone'}</span>` : l && l.off ? html`<br /><span class="pill grey">Not held · ${l.off === 'absent' ? 'you are absent' : 'after sign-out'}</span>` : notTaken(l) ? html`<br /><span class="pill red">Not taken</span>` : null}`; };
            const rows = tl.length ? tl : [null];
            return rows.map((l) => html`<div class=${'list-row' + (notTaken(l) ? ' missed' : '') + (l && l.off ? ' offrow' : '')} style="padding-right:6px"><button class="rowbtn" onClick=${() => go(l)}>${head}<span class="grow"><b>${groupTitle(g)}</b><br />${sub(l)}</span><span class="go">${empty ? 'Add list' : 'Register'}</span></button>${l ? html`<button class="iconbtn" style="color:var(--muted)" aria-label=${'Swap or move ' + groupLabel(g) + ' ' + pLabel(l.p, l.len)} onClick=${() => setSwap(l)}><${Icon} n="swap" s=${19} /></button>` : html`<span style="width:44px;flex:none"></span>`}</div>`); })}
          <button class="list-row" style="color:var(--primary-ink);font-weight:600" onClick=${() => nav.go('upload')}><${Icon} n="plus" s=${20} />Add a class from an Excel class list</button>
          <button class="list-row" onClick=${() => nav.go('period', { pick: true })}><${Icon} n="cal" s=${20} /><span class="grow"><b>Take a register for another day</b><br /><span class="tiny muted">If you forgot one. It is marked as filled in late.</span></span><${Icon} n="chev" s=${18} /></button>
        </div></section>
      <section class="tiles3">
        <button class="tile" onClick=${() => nav.go('incident-new')}><${Icon} n="warn" />Log incident</button>
        <button class="tile" onClick=${() => nav.go('books')}><${Icon} n="book" />Book lists</button>
        <button class="tile" onClick=${() => nav.go('find')}><${Icon} n="search" />Find learner</button>
      </section>
      <div class="card flat">
        <button class="list-row" onClick=${() => nav.go('cover')}><${Icon} n="cover" /><span class="grow"><b>Cover a class</b><br /><span class="tiny muted">Morning register or a lesson for an absent colleague</span></span><${Icon} n="chev" s=${18} /></button>
        <button class="list-row" onClick=${() => nav.go('print')}><${Icon} n="print" /><span class="grow"><b>Print lists</b><br /><span class="tiny muted">Registers and book lists in the paper format</span></span><${Icon} n="chev" s=${18} /></button>
      </div>
    </main>
    <p class="credit">Developed by KK Lekenyane</p>
    ${swap && html`<${ChangeSheet} lesson=${swap} lessons=${lessons} onClose=${() => setSwap(null)} />`}
    <${BottomNav} nav=${nav} cur="home" />
  </div>`;
}

/* ================= morning register ================= */
function Register({ nav, cls, cover, date }) {
  const db = app.db, s = app.school, day = date || todayISO();
  const c = db.classes.find((x) => x.id === cls);
  const rec = app.getRegister('m', cls, day, 0);
  const [marks, setMarks] = useState(() => (rec ? Object.assign({}, rec.marks) : {}));
  const [dirty, setDirty] = useState(false);
  const accs = classLearners(db, cls);
  const isCover = !!cover || (c && c.teacherId !== app.me.id);
  let a = 0, l = 0; accs.forEach((x) => { if (marks[x] === 'A') a++; if (marks[x] === 'L') l++; });
  const tap = (x) => { setMarks(Object.assign({}, marks, { [x]: NEXT[marks[x] || 'P'] })); setDirty(true); };
  const submit = () => {
    const r = app.saveRegister({ kind: 'm', ref: cls, date: day, period: 0, marks, coverFor: isCover ? c.teacherId : null });
    setDirty(false);
    app.toast(r.synced ? 'Sent to the office. ' + a + ' absent, ' + l + ' late.' : 'Saved on this phone. It will send as soon as there is signal.');
  };
  const sub = fmtShort(day) + ' · Assembly' + (isCover ? ' · covering for ' + (c.teacherId ? staffName(db, c.teacherId) : 'no register teacher') : '');
  const cur = app.getRegister('m', cls, day, 0);
  let label = 'Submit register', bg = '';
  if (cur && !dirty) { label = cur.synced ? 'Sent ' + (cur.sentAt || cur.at).slice(11) + ' · tap to resend' : 'Saved on phone · tap to resend'; bg = 'ok'; }
  else if (cur && dirty) label = 'Submit changes';
  return html`<div class="app">
    <${Band} nav=${nav} title=${cls + ' · Morning register'} sub=${sub}>
      <div class="stats"><div class="stat"><b>${accs.length - a - l}</b><span>Present</span></div><div class="stat"><b>${a}</b><span>Absent</span></div><div class="stat"><b>${l}</b><span>Late</span></div></div>
    <//>
    <${NetBar} />
    <div class="col"><div class="note row" style="gap:10px"><label class="f grow" for="rd" style="flex-direction:row;align-items:center;gap:8px;font-weight:600">Day<input id="rd" type="date" class="inp" style="width:auto;min-height:38px" max=${todayISO()} value=${day} onInput=${(e) => e.target.value && e.target.value <= todayISO() && nav.replace('register', { cls, cover, date: e.target.value })} /></label>${day !== todayISO() && html`<span class="pill wait">Late entry</span>`}</div>
      ${day !== todayISO() && html`<p class="note warn">You are filling in ${fmtLong(day)}. ${cur && !cur.lateEntry ? 'This register was taken on the day.' : 'The office sees that it was filled in later.'}</p>`}
      ${!isSchoolDay(s, day) && html`<p class="note warn">${s.noSchool && s.noSchool[day] ? 'No school on this day: ' + s.noSchool[day] + '.' : 'This is not a school day in the calendar.'}</p>`}
      <p class="note">Everyone starts as present. Tap a learner once for <strong>Absent</strong>, again for <strong>Late</strong>, again to undo.</p></div>
    <main class="col" style="flex:1;background:var(--surface)">
      ${accs.map((x, i) => { const m = marks[x] || 'P'; const ln = db.learners[x]; return html`<button class=${'lrow ' + m} aria-label=${learnerName(ln) + ', ' + LOOK[m] + '. Tap to change.'} onClick=${() => tap(x)}><span class="no">${i + 1}</span><span class="nm"><b>${learnerName(ln)}</b><span>Acc. ${x}</span></span><span class=${'badge ' + m}>${LOOK[m]}</span></button>`; })}
    </main>
    <footer class="footer-bar"><div class="col gut stack" style="gap:10px">
      ${cur && !dirty && !cur.synced && html`<div class="boxnote info" role="status"><${Icon} n="wifi" s=${18} /><span><strong>Saved on this phone.</strong> It will send to the office as soon as there is signal.</span></div>`}
      ${cur && !dirty && a > 0 && html`<button class="btn line block" onClick=${() => nav.go('reasons', { cls })}>Add reasons for the ${a} absent</button>`}
      <button class=${'btn big block ' + bg} onClick=${submit}>${label}</button>
    </div></footer>
  </div>`;
}

/* ================= registers not taken (catch up) ================= */
function Missed({ nav }) {
  const db = app.db, s = app.school, today = todayISO();
  const list = missedFor(db, s, app.me.id, today, 10);
  const days = [...new Set(list.map((x) => x.date))];
  return html`<div class="app"><${Band} nav=${nav} title="Registers not taken" sub="The last 10 school days" />
    <${NetBar} />
    <main class="col gut content">
      <div class="boxnote info"><span>Registers you forgot can still be filled in. KAT saves them as a <strong>late entry</strong>, so the office can see they were done afterwards. Lessons on days you were absent or after you signed out are left out.</span></div>
      ${list.length === 0 && html`<section class="card"><span class="small">All caught up. Every register is in.</span></section>`}
      ${days.map((d) => html`<section class="stack"><h2 class="h2" style="margin:0 4px">${d === today ? 'Today' : fmtLong(d)}</h2><div class="card flat">
        ${list.filter((x) => x.date === d).map((x) => html`<button class="list-row missed" onClick=${() => (x.kind === 'm' ? nav.go('register', { cls: x.cls, date: d === today ? undefined : d }) : nav.go('period', { gid: x.g.id, p: x.p, date: d === today ? undefined : d }))}>
          <span class="ptile" style="background:var(--abs-soft)"><small style="color:var(--abs-ink)">${x.kind === 'm' ? 'REG' : pLabel(x.p, x.len)}</small><b style="color:var(--abs-ink);font-size:13px">${x.kind === 'm' ? x.cls : x.g.label}</b></span>
          <span class="grow"><b>${x.kind === 'm' ? 'Morning register ' + x.cls : groupTitle(x.g)}</b><br /><span class="tiny muted">${x.kind === 'm' ? 'Assembly' : pLabel(x.p, x.len) + ' · ' + app.bellRange(x.p, x.len)}</span></span><span class="go">Take now</span></button>`)}
      </div></section>`)}
    </main></div>`;
}

/* ================= cover a class ================= */
function Cover({ nav }) {
  const db = app.db, today = todayISO();
  const [g, setG] = useState('all'), [tab, setTab] = useState('m');
  const teachers = db.staff.filter((t) => t.id !== app.me.id && t.role === 'teacher').map((t) => ({ t, ls: lessonsFor(db, t.id, today), away: ((db.changes || {})[t.id + '|' + today] || {}) })).filter((x) => x.ls.length).sort((a, b) => (b.away.absent ? 1 : 0) - (a.away.absent ? 1 : 0) || a.t.name.localeCompare(b.t.name));
  const [tq, setTq] = useState('');
  if (tab === 'p') return html`<div class="app"><${Band} nav=${nav} title="Cover a class" sub="Take a register for a colleague who is away. No extra password needed.">
      <div class="tabs" role="tablist"><button role="tab" aria-selected="false" onClick=${() => setTab('m')}>Morning register</button><button role="tab" aria-selected="true">A lesson</button></div><//>
    <${NetBar} />
    <main class="col gut content">
      <div class="boxnote info"><span>You stay signed in as yourself. The register is saved as <strong>taken by ${app.me.code || app.me.name}</strong>, and your symbol shows at the bottom of that day on the teacher's printed register.</span></div>
      <input class="inp" placeholder="Search teacher by name or symbol" value=${tq} onInput=${(e) => setTq(e.target.value)} />
      ${teachers.filter((x) => !tq || (x.t.name + ' ' + (x.t.code || '')).toLowerCase().includes(tq.toLowerCase())).map((x) => html`<section class="card flat"><div class="between" style="padding:12px 16px 4px"><b>${x.t.name}${x.t.code ? ' (' + x.t.code + ')' : ''}</b>${x.away.absent ? html`<span class="pill red">Absent today</span>` : x.away.signout ? html`<span class="pill wait">Signed out ${x.away.signout}</span>` : null}</div>
        ${x.ls.map((l) => { const gg = db.groups.find((y) => y.id === l.gid); const done = db.registers[regKey('p', l.gid, today, l.p)]; return html`<button class="list-row" onClick=${() => nav.go('period', { gid: l.gid, p: l.p })}><span class="grow"><b>${groupTitle(gg)}</b><br /><span class="tiny muted">${pLabel(l.p, l.len)} · ${app.bellRange(l.p, l.len)}${gg.learners.length ? '' : ' · no class list yet'}</span></span>${done ? html`<span class="pill ok">Done${done.by !== gg.teacherId ? ' · ' + ((db.staff.find((s) => s.id === done.by) || {}).code || '') : ''}</span>` : html`<span class="go">Take</span>`}</button>`; })}</section>`)}
      ${teachers.length === 0 && html`<span class="small muted">No other teacher has lessons on the timetable today.</span>`}
    </main></div>`;
  const grades = app.school.grades;
  const list = db.classes.filter((c) => g === 'all' || String(c.grade) === g);
  return html`<div class="app"><${Band} nav=${nav} title="Cover a class" sub="Take a register for a colleague who is away. No extra password needed.">
      <div class="tabs" role="tablist"><button role="tab" aria-selected="true">Morning register</button><button role="tab" aria-selected="false" onClick=${() => setTab('p')}>A lesson</button></div><//>
    <${NetBar} />
    <main class="col gut content">
      <div class="boxnote info"><span>The register is saved as <strong>marked by ${app.me.name}, covering</strong>. The register teacher sees who marked it. You can only change it today.</span></div>
      <div class="chips">${['all'].concat(grades.map(String)).map((x) => html`<button class="chip" aria-pressed=${String(g === x)} onClick=${() => setG(x)}>${x === 'all' ? 'All grades' : 'Gr ' + x}</button>`)}</div>
      <div class="ctiles">${list.map((c) => { const x = classStatus(db, c.id, today); return html`<button class=${'ctile ' + x.st} onClick=${() => nav.go('register', { cls: c.id, cover: c.teacherId !== app.me.id })}><span class="t"><b>${c.id}</b><span class="dot"></span></span><span class="tiny" style="font-weight:600">${x.st === 'none' ? 'Not taken' : x.st === 'wait' ? 'Saved on phone' : x.p + ' of ' + x.n + ' present'}</span><span class="tiny muted">${c.teacherId ? staffName(db, c.teacherId) : 'No register teacher'}</span></button>`; })}</div>
    </main></div>`;
}

/* ================= period (subject) register ================= */
function Period({ nav, gid, p, pick: pickMode, pgid, date }) {
  const db = app.db, realToday = todayISO(), today = date || realToday;
  const groups = myGroups();
  const lessons = lessonsFor(db, app.me.id, today).filter((x) => !x.off || (x.gid === gid && x.p === p));
  if (gid && !lessons.some((x) => x.gid === gid && x.p === p)) { const gg = db.groups.find((x) => x.id === gid); const sl = gg && gg.slots.find((s) => s.p === p); lessons.push({ gid, p, len: (sl && sl.len) || 1 }); }
  lessons.sort((a, b) => a.p - b.p);
  const [cur, setCur] = useState(() => Math.max(0, lessons.findIndex((x) => x.gid === gid && x.p === p)));
  const [drafts, setDrafts] = useState({});
  const [pick, setPick] = useState({ gid: pgid || (groups[0] || {}).id, p: 1, date: today });
  const pickLessons = lessonsFor(db, app.me.id, pick.date).filter((x) => x.gid === pick.gid);
  if (!lessons.length || (pickMode && gid === undefined)) {
    return html`<div class="app"><${Band} nav=${nav} title="Subject register" sub="Pick the class and the period" />
      <main class="col gut content"><section class="card">
        ${groups.length === 0 ? html`<span class="small muted">You have no subject classes yet. Add one from an Excel class list.</span><button class="btn" onClick=${() => nav.go('upload')}>Add a class</button>` : html`
        <label class="f" for="pdt">Day<input id="pdt" type="date" class="inp" max=${realToday} value=${pick.date} onInput=${(e) => e.target.value && e.target.value <= realToday && setPick(Object.assign({}, pick, { date: e.target.value }))} /></label>
        ${pick.date !== realToday && html`<span class="small" style="color:var(--late-fg)">${fmtLong(pick.date)} · saved as a late entry.</span>`}
        ${pickLessons.length > 0 && html`<span class="small muted">On the timetable that day: ${pickLessons.map((x) => pLabel(x.p, x.len) + (x.off ? ' (not held)' : app.getRegister('p', pick.gid, pick.date, x.p) ? ' (done)' : '')).join(', ')}</span>`}
        <label class="f" for="pg">Class<select id="pg" class="inp" value=${pick.gid} onChange=${(e) => setPick(Object.assign({}, pick, { gid: e.target.value }))}>${groups.map((g) => html`<option value=${g.id}>${groupTitle(g)}</option>`)}</select></label>
        <span class="f">Period</span><div class="chips">${app.bells.map((b) => html`<button class="chip" aria-pressed=${String(pick.p === b.p)} onClick=${() => setPick(Object.assign({}, pick, { p: b.p }))}>P${b.p} · ${b.t}${pickLessons.some((x) => x.p === b.p) ? ' ★' : ''}</button>`)}</div>
        <button class="btn big" onClick=${() => nav.replace('period', { gid: pick.gid, p: pick.p, date: pick.date === realToday ? undefined : pick.date })}>Open register</button>`}
      </section></main></div>`;
  }
  const L = lessons[Math.min(cur, lessons.length - 1)];
  const g = db.groups.find((x) => x.id === L.gid);
  const key = regKey('p', g.id, today, L.p);
  const saved = db.registers[key];
  const accs = sortAcc(db, g.learners);
  const morningAbs = accs.filter((a) => morningMark(db, a, today) === 'A');
  const initial = () => (saved ? Object.assign({}, saved.marks) : morningAbs.reduce((o, a) => { o[a] = 'A'; return o; }, {}));
  const marks = drafts[key] || initial();
  const setMarks = (m) => setDrafts(Object.assign({}, drafts, { [key]: m }));
  const prevSlot = lessons.find((x) => x.gid === g.id && x.p + x.len === L.p);
  const prevKey = prevSlot ? regKey('p', g.id, today, prevSlot.p) : null;
  let a = 0, l = 0; accs.forEach((x) => { if (marks[x] === 'A') a++; if (marks[x] === 'L') l++; });
  const dirty = !!drafts[key];
  const coverOf = g.teacherId !== app.me.id ? g.teacherId : null;
  const submit = () => { const r = app.saveRegister({ kind: 'p', ref: g.id, date: today, period: L.p, marks, coverFor: coverOf }); const d = Object.assign({}, drafts); delete d[key]; setDrafts(d); app.toast(r.synced ? 'Saved. ' + a + ' absent, ' + l + ' late in ' + groupLabel(g) + ' P' + L.p + '.' : 'Saved on this phone. It will send when there is signal.'); };
  return html`<div class="app">
    <${Band} nav=${nav} title=${groupTitle(g)} sub=${fmtShort(today) + ' · ' + pLabel(L.p, L.len) + ' · ' + app.bellRange(L.p, L.len) + (prevSlot ? ' · straight after ' + pLabel(prevSlot.p, prevSlot.len) : '')} right=${html`<button class="ghost" onClick=${() => nav.go('print', { what: 'g:' + g.id })}>Month</button>`}>
      <div class="tabs" role="tablist" aria-label="Lesson">${lessons.map((x, i) => { const gg = db.groups.find((y) => y.id === x.gid); return html`<button role="tab" aria-selected=${String(i === cur)} onClick=${() => setCur(i)}>${groupLabel(gg)} · ${pLabel(x.p, x.len)}</button>`; })}
        <button role="tab" aria-selected="false" onClick=${() => nav.replace('period', { pick: true, date })}>+ Other</button></div>
      <div class="stats"><div class="stat"><b>${accs.length - a - l}</b><span>present</span></div><div class="stat"><b>${a}</b><span>absent</span></div><div class="stat"><b>${l}</b><span>late</span></div></div>
    <//>
    <${NetBar} />
    <div class="col">
      ${coverOf && html`<p class="note info">You are covering for <strong>${staffName(db, coverOf)}</strong>. The register is saved as taken by you (${app.me.code || app.me.name}), and your symbol shows on their printed register.</p>`}
      ${today !== realToday && html`<p class="note warn">Late entry for ${fmtLong(today)}. ${saved && !saved.lateEntry ? 'This register was taken on the day.' : 'The office sees it was filled in later.'}</p>`}
      ${L.off && html`<p class="note warn">This lesson shows as not held (${L.off === 'absent' ? 'you were marked absent' : 'after your sign-out'}). You can still take the register if it did happen.</p>`}
      ${!saved && morningAbs.length > 0 && html`<p class="note info">Already absent at morning register: ${morningAbs.map((x) => learnerShort(db.learners[x])).join(', ')}. They start as Absent here.</p>`}
      ${prevSlot && html`<div class="note warn row" style="gap:10px"><span class="grow"><strong>Double lesson.</strong> Each lesson gets its own mark, so a learner who leaves after ${pLabel(prevSlot.p, prevSlot.len)} shows as absent here.</span><button class="btn sm line" style="background:var(--surface)" onClick=${() => { const src = drafts[prevKey] || (db.registers[prevKey] && db.registers[prevKey].marks); if (!src) { app.toast(pLabel(prevSlot.p, prevSlot.len) + ' has no marks yet. Take that register first.'); return; } setMarks(Object.assign({}, src)); }}>Same as P${prevSlot.p}</button></div>`}
    </div>
    <main class="col" style="flex:1;background:var(--surface)">
      ${accs.length === 0 && html`<div class="gut content"><div class="boxnote warn"><span><strong>No class list yet for ${groupTitle(g)}.</strong> Add the SA-SAMS Excel class list once and the names show here.</span></div><button class="btn big" onClick=${() => nav.go('upload', { gid: g.id })}>Add class list</button></div>`}
      ${accs.map((x, i) => { const m = marks[x] || 'P'; const ln = db.learners[x]; return html`<button class=${'lrow ' + m} aria-label=${learnerName(ln) + ', ' + LOOK[m] + '. Tap to change.'} onClick=${() => setMarks(Object.assign({}, marks, { [x]: NEXT[m] }))}><span class="no">${i + 1}</span><span class="nm"><b>${learnerName(ln)}</b><span>Acc. ${x}</span></span><span class=${'badge ' + m}>${LOOK[m]}</span></button>`; })}
    </main>
    ${accs.length > 0 && html`<footer class="footer-bar"><div class="col gut"><button class=${'btn big block ' + (saved && !dirty ? 'ok' : '')} onClick=${submit}>${saved && !dirty ? (saved.synced ? 'Saved · tap to resend' : 'Saved on phone · tap to resend') : saved ? 'Save changes' : 'Submit period register'}</button></div></footer>`}
  </div>`;
}

/* ================= absence reasons follow-up ================= */
function Reasons({ nav, cls }) {
  const db = app.db, s = app.school;
  const c = cls || app.me.registerClass;
  const [tab, setTab] = useState('open');
  const [cur, setCur] = useState(null);
  const [code, setCode] = useState(null), [note, setNote] = useState('');
  const items = Object.keys(db.reasons).map((k) => { const [acc, date] = k.split('|'); return { k, acc, date, r: db.reasons[k] }; })
    .filter((x) => db.learners[x.acc] && db.learners[x.acc].cls === c).sort((x, y) => (y.date > x.date ? 1 : -1));
  const openI = items.filter((x) => !x.r.code), done = items.filter((x) => x.r.code).slice(0, 30);
  const list = tab === 'open' ? openI : done;
  const openSheet = (x) => { setCur(x); setCode(x.r.code); setNote(x.r.note || ''); };
  const save = () => { app.setReason(cur.acc, cur.date, code, note); setCur(null); app.toast('Reason saved for ' + learnerShort(db.learners[cur.acc]) + '.'); };
  return html`<div class="app"><${Band} nav=${nav} title=${'Absence reasons · ' + c} sub="Update when a learner or parent gives a reason">
      <div class="tabs" role="tablist"><button role="tab" aria-selected=${String(tab === 'open')} onClick=${() => setTab('open')}>Needs a reason · ${openI.length}</button><button role="tab" aria-selected=${String(tab === 'done')} onClick=${() => setTab('done')}>Reason given · ${done.length}</button></div><//>
    <main class="col gut content">
      ${list.length === 0 && html`<div class="boxnote ok"><span>${tab === 'open' ? 'All absences in ' + c + ' have a reason. Nice work.' : 'No reasons recorded yet.'}</span></div>`}
      ${list.length > 0 && html`<div class="card flat">${list.map((x) => { const n = schoolDaysSince(s, x.date, todayISO()); const flag = !x.r.code && n >= 3; return html`<button class="list-row" onClick=${() => openSheet(x)}><span class="grow"><b>${learnerShort(db.learners[x.acc])}</b><br /><span class="tiny muted">Absent ${fmtShort(x.date)} · ${ago(s, x.date)}</span><br /><span class="tiny" style=${'font-weight:600;color:' + (x.r.code ? 'var(--ok-fg)' : flag ? 'var(--abs-ink)' : 'var(--late-fg)')}>${x.r.code ? 'Reason: ' + x.r.code : flag ? 'No reason yet · flagged to grade head' : 'No reason yet'}</span></span><span class="go">${x.r.code ? 'Change' : 'Add reason'}</span></button>`; })}</div>`}
      <p class="small muted" style="margin:0">Absences without a reason after 3 school days show up for the grade head and on the office list.</p>
    </main>
    ${cur && html`<${Sheet} title=${learnerShort(db.learners[cur.acc])} onClose=${() => setCur(null)}>
      <span class="small muted">Absent ${fmtLong(cur.date)}</span>
      <div class="boxnote warn"><span>Sample reasons. The real list will match SA-SAMS once the office sends it.</span></div>
      <div class="stack" role="radiogroup" aria-label="Reason">${app.reasonsList.map((o) => html`<button class="radio-row" role="radio" aria-checked=${String(code === o)} onClick=${() => setCode(o)}><span class="radio-dot"></span>${o}</button>`)}
        <button class="radio-row" role="radio" aria-checked=${String(code === null)} onClick=${() => setCode(null)}><span class="radio-dot"></span>No reason yet</button></div>
      <label class="f" for="rnote">Note (optional)<input id="rnote" class="inp" value=${note} placeholder="Letter or doctor's note received" onInput=${(e) => setNote(e.target.value)} /></label>
      <button class="btn big" onClick=${save}>Save reason</button>
    <//>`}
  </div>`;
}

/* ================= import an Excel class list ================= */
function Upload({ nav, gid }) {
  const db = app.db;
  const pg = gid ? db.groups.find((x) => x.id === gid) : null;
  const [res, setRes] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const [subject, setSubject] = useState(''), [label, setLabel] = useState(''), [grade, setGrade] = useState('');
  const [slots, setSlots] = useState([]), [sd, setSd] = useState(1), [sp, setSp] = useState(1);
  const [all, setAll] = useState(false), [done, setDone] = useState(null);
  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setBusy(true); setErr('');
    const fr = new FileReader();
    fr.onload = () => { try { const r = parseClassList(new Uint8Array(fr.result), f.name); if (r.error) { setErr(r.error); setRes(null); } else { setRes(r); setSubject(pg ? pg.subject : r.subject); setLabel(pg ? pg.label : (r.cls || '')); setGrade(pg ? String(pg.grade || '') : (r.grade || '')); } } catch (x) { setErr('KAT could not read this file. Is it an Excel file (.xls or .xlsx)?'); } setBusy(false); };
    fr.readAsArrayBuffer(f);
  };
  if (done) return html`<div class="app"><${Band} nav=${nav} title="Class added" sub=${groupTitle(done)} /><main class="col gut content"><section class="card">
      <div class="boxnote ok"><span><strong>${groupTitle(done)} is ready.</strong> ${done.learners.length} learners.${done.replaced ? ' You already had this class, so its learner list was updated.' : ''} It now shows under "My classes" and has its own period register.</span></div>
      <button class="btn big" onClick=${() => nav.replace('period', { gid: done.id, p: (done.slots[0] || {}).p || 1 })}>Open the period register</button>
      <button class="btn line" onClick=${() => { setDone(null); setRes(null); }}>Add another class</button></section></main></div>`;
  const warns = [];
  if (res) {
    res.learners.forEach((l) => {
      const ex = db.learners[l.acc];
      if (ex && (ex.surname.toLowerCase() !== l.surname.toLowerCase())) warns.push('Accession number ' + l.acc + ' is ' + learnerShort(ex) + ' in KAT, but ' + l.first + ' ' + l.surname + ' in your file. KAT goes by the accession number.');
      Object.values(db.learners).forEach((o) => { if (o.acc !== l.acc && o.surname.toLowerCase() === l.surname.toLowerCase() && o.first.toLowerCase() === l.first.toLowerCase()) warns.push('Two learners called ' + l.surname.toUpperCase() + ', ' + l.first + ' have different accession numbers (' + l.acc + ' here, ' + o.acc + ' in ' + (o.cls || 'another list') + '). KAT keeps them apart by accession number, so check it is right.'); });
    });
  }
  const save = () => {
    if (!subject.trim() || !label.trim()) { app.toast('Fill in the subject and the class first.'); return; }
    const short = subject.trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 3);
    const g = pg ? app.setGroupLearners(pg.id, res.learners) : app.addGroup({ subject: subject.trim(), short, grade: Number(grade) || null, label: label.trim().toUpperCase(), teacherId: app.me.id, slots: slots.slice() }, res.learners);
    setDone(g);
  };
  return html`<div class="app"><${Band} nav=${nav} title=${pg ? 'Class list for ' + groupLabel(pg) : 'Add a class from Excel'} sub=${pg ? groupTitle(pg) + ' · from your timetable' : 'Use your SA-SAMS class list, marks and all'} />
    <main class="col gut content">
      <section class="card">
        <label class="btn big" for="xl" style="cursor:pointer"><${Icon} n="file" s=${20} />${res ? 'Choose a different file' : 'Choose an Excel file'}</label>
        <input id="xl" type="file" accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" style="position:absolute;width:1px;height:1px;opacity:0" onChange=${onFile} />
        <span class="small muted" style="text-align:center">.xls or .xlsx, from your phone, WhatsApp or email</span>
        ${busy && html`<span class="small">Reading the file…</span>`}
        ${err && html`<div class="boxnote red"><span>${err}</span></div>`}
      </section>
      ${!res && html`<section class="card"><span class="eyebrow">What KAT looks for</span>
        <span class="small">A row with headings like <b>Acc No</b> and <b>Learner</b> or <b>Name</b>. Every row under it with an accession number and a "SURNAME, Name" becomes a learner.</span>
        <span class="small">It also reads the subject, grade and class from the top of the sheet when they are there.</span>
        <span class="small">Marks, tasks, averages and totals are ignored. Nothing in your file is changed.</span></section>`}
      ${res && html`<section class="card">
        <div><b style="font-size:18px">Found ${res.learners.length} learners</b><br /><span class="small muted">in "${res.filename}". Check the details, then save.</span></div>
        <div class="grid2"><label class="f" for="usub">Subject<input id="usub" class="inp" disabled=${!!pg} value=${subject} onInput=${(e) => setSubject(e.target.value)} /></label>
          <label class="f" for="ucls">Class<input id="ucls" class="inp" disabled=${!!pg} value=${label} onInput=${(e) => setLabel(e.target.value)} placeholder="8D" /></label>
          <label class="f" for="ugr">Grade<input id="ugr" class="inp" inputmode="numeric" value=${grade} onInput=${(e) => setGrade(e.target.value)} /></label></div>
        ${(res.subject || res.cls) && html`<span class="tiny muted">Read from the top of the sheet${res.teacher ? ' · teacher ' + res.teacher : ''}.</span>`}
        <div class="tablebox"><table class="t"><thead><tr><th>#</th><th>Acc No</th><th>Learner</th><th>G</th></tr></thead><tbody>
          ${(all ? res.learners : res.learners.slice(0, 6)).map((l, i) => html`<tr><td class="n">${i + 1}</td><td class="n">${l.acc}</td><td>${l.surname.toUpperCase()}, ${l.first}</td><td>${l.gender}</td></tr>`)}</tbody></table></div>
        ${!all && res.learners.length > 6 && html`<button class="linkbtn" onClick=${() => setAll(true)}>Show the other ${res.learners.length - 6}</button>`}
        ${warns.length > 0 && html`<div class="boxnote warn"><span><strong>Worth a look.</strong> ${warns.slice(0, 3).join(' ')}</span></div>`}
        <div class="boxnote info"><span><strong>Left out on purpose:</strong> marks and tasks${res.footer ? ', and ' + res.footer + ' "Average" or "Total" rows at the bottom' : ''}${res.skipped ? ', and ' + res.skipped + ' other rows without an accession number' : ''}.</span></div>
      </section>
      ${!pg && html`<section class="card"><span class="eyebrow">When do you teach ${label || 'this class'}? (optional)</span>
        <div class="wrap">${slots.map((x, i) => html`<button class="chip" aria-pressed="true" aria-label=${'Remove ' + DOW[x.d] + ' P' + x.p} onClick=${() => setSlots(slots.filter((_, j) => j !== i))}>${DOW[x.d]} P${x.p} ×</button>`)}</div>
        <div class="row" style="flex-wrap:wrap"><select class="inp" style="width:auto" aria-label="Day" value=${sd} onChange=${(e) => setSd(Number(e.target.value))}>${[1, 2, 3, 4, 5].map((d) => html`<option value=${d}>${DOW_LONG[d]}</option>`)}</select>
          <select class="inp" style="width:auto" aria-label="Period" value=${sp} onChange=${(e) => setSp(Number(e.target.value))}>${app.bells.map((b) => html`<option value=${b.p}>Period ${b.p}</option>`)}</select>
          <button class="btn sm line" onClick=${() => { if (!slots.some((x) => x.d === sd && x.p === sp)) setSlots(slots.concat([{ d: sd, p: sp }]).sort((a, b) => a.d - b.d || a.p - b.p)); }}>+ Add</button></div>
        <span class="tiny muted">Or upload your timetable PDF and KAT fills in the times for every class.</span>
      </section>`}
      <button class="btn big" onClick=${save}>Save class</button>`}
    </main></div>`;
}

/* ================= incidents ================= */
const INC_TYPES = ['Detention', 'Behaviour', 'Merit', 'Uniform', 'Homework', 'Late coming', 'Other'];
const INC_LOOK = { Detention: ['#FDE7E7', '#A12828'], Behaviour: ['#FFF4E0', '#7A4100'], Merit: ['#E6F4EA', '#1B6B34'], Uniform: ['#EDE9FE', '#5B21B6'], Homework: ['#E0F2FE', '#075985'], 'Late coming': ['#FFF4E0', '#7A4100'], Other: ['#EEF1F6', '#374151'] };
function IncCard({ x }) {
  const db = app.db, l = db.learners[x.acc], lk = INC_LOOK[x.type] || INC_LOOK.Other;
  return html`<article class="card" style="gap:6px"><div class="between"><span class="pill" style=${'background:' + lk[0] + ';color:' + lk[1]}>${x.type}</span><span class="tiny muted">${fmtShort(x.date)}</span></div>
    <b>${learnerShort(l)} · ${l && l.cls ? l.cls : ''}</b><span class="small">${x.note}</span>
    <span class="tiny muted">${[x.where, x.detention ? 'Detention ' + fmtShort(x.detention.date) + ' ' + x.detention.time : '', 'Logged by ' + staffName(db, x.by)].filter(Boolean).join(' · ')}</span></article>`;
}
function Incidents({ nav }) {
  const db = app.db, me = app.me;
  const [f, setF] = useState('All');
  const mine = db.incidents.filter((x) => x.by === me.id || (x.share && me.registerClass && db.learners[x.acc] && db.learners[x.acc].cls === me.registerClass));
  const map = { All: null, Detentions: 'Detention', Behaviour: 'Behaviour', Merits: 'Merit' };
  const list = mine.filter((x) => !map[f] || x.type === map[f]).sort((a, b) => (b.date > a.date ? 1 : -1));
  return html`<div class="app"><${Band} nav=${nav} noBack=${true} title="Incident log" sub="My classes and my register class" right=${html`<button class="ghost" onClick=${() => nav.go('print', { what: 'inc' })}>Print</button>`}>
      <div class="tabs" role="tablist">${Object.keys(map).map((k) => html`<button role="tab" aria-selected=${String(f === k)} onClick=${() => setF(k)}>${k}${k === 'All' ? ' · ' + mine.length : ''}</button>`)}</div><//>
    <main class="col gut content">
      <button class="btn big" onClick=${() => nav.go('incident-new')}><${Icon} n="plus" s=${20} />Log incident</button>
      ${list.length === 0 && html`<p class="muted small">Nothing logged here yet.</p>`}
      ${list.map((x) => html`<${IncCard} x=${x} />`)}
    </main><${BottomNav} nav=${nav} cur="incidents" /></div>`;
}
function IncidentNew({ nav, acc }) {
  const groups = myGroups();
  const [who, setWho] = useState(acc || null), [type, setType] = useState('Detention'), [date, setDate] = useState(todayISO());
  const [dd, setDd] = useState(addDays(todayISO(), 2)), [dt, setDt] = useState('14:00'), [note, setNote] = useState('');
  const [where, setWhere] = useState(groups[0] ? groupLabel(groups[0]) : 'Morning register'), [share, setShare] = useState(true);
  const save = () => {
    if (!who) { app.toast('Choose the learner first.'); return; }
    if (!note.trim()) { app.toast('Write a short note about what happened.'); return; }
    app.addIncident({ acc: who, type, date, note: note.trim(), where, share, detention: type === 'Detention' ? { date: dd, time: dt } : null });
    app.toast(type + ' logged for ' + learnerShort(app.db.learners[who]) + '.'); nav.back();
  };
  return html`<div class="app"><${Band} nav=${nav} title="Log incident" sub="Detentions, behaviour, merits and more" />
    <main class="col gut content"><section class="card">
      <${LearnerPicker} pool=${null} value=${who} onPick=${setWho} id="incl" />
      <span class="f">Type</span><div class="chips">${INC_TYPES.map((t) => html`<button class="chip" aria-pressed=${String(type === t)} onClick=${() => setType(t)}>${t}</button>`)}</div>
      <div class="grid2"><label class="f" for="idate">Date<input id="idate" type="date" class="inp" value=${date} onInput=${(e) => setDate(e.target.value)} /></label>
        <label class="f" for="iwhere">Where<select id="iwhere" class="inp" value=${where} onChange=${(e) => setWhere(e.target.value)}>${groups.map((g) => html`<option>${groupLabel(g)}</option>`)}<option>Morning register</option><option>Break or grounds</option><option>Other</option></select></label></div>
      ${type === 'Detention' && html`<div class="grid2"><label class="f" for="idd">Detention date<input id="idd" type="date" class="inp" value=${dd} onInput=${(e) => setDd(e.target.value)} /></label><label class="f" for="idt">Time<input id="idt" type="time" class="inp" value=${dt} onInput=${(e) => setDt(e.target.value)} /></label></div>`}
      <label class="f" for="inote">What happened<textarea id="inote" class="inp" placeholder="Phone out during the test after a warning." value=${note} onInput=${(e) => setNote(e.target.value)}></textarea></label>
      <label class="check"><input type="checkbox" checked=${share} onChange=${(e) => setShare(e.target.checked)} />Let the register teacher and grade head see this</label>
      <button class="btn big" onClick=${save}>Save incident</button>
    </section></main></div>`;
}

/* ================= textbooks ================= */
function Books({ nav }) {
  const db = app.db, me = app.me;
  const lists = db.books.filter((b) => b.teacherId === me.id || me.role !== 'teacher');
  return html`<div class="app"><${Band} nav=${nav} noBack=${me.role === 'teacher'} title="Book lists" sub="Issue, check each term, and get books back" />
    <main class="col gut content">
      ${lists.length === 0 && html`<p class="muted small">No book lists yet.</p>`}
      <div class="card flat">${lists.map((b) => { const iss = b.items.filter((x) => x.signed).length, miss = b.items.filter((x) => x.t2 === 'M' || x.t3 === 'M').length; return html`<button class="list-row" onClick=${() => nav.go('book', { id: b.id })}><${Icon} n="book" /><span class="grow"><b>${b.subject} · Grade ${b.grade}</b><br /><span class="tiny muted">${b.year} · ${iss} issued${miss ? ' · ' + miss + ' missing' : ''}</span></span><${Icon} n="chev" s=${18} /></button>`; })}</div>
      ${me.role === 'teacher' && html`<button class="btn line" onClick=${() => nav.go('book-new')}><${Icon} n="plus" s=${18} />New book list</button>`}
      <p class="small muted" style="margin:0">Each learner signs for a book in Term 1. In Terms 2 and 3 you tick that the book still exists. In Term 4 it comes back.</p>
    </main>${me.role === 'teacher' && html`<${BottomNav} nav=${nav} cur="books" />`}</div>`;
}
function BookNew({ nav }) {
  const groups = myGroups();
  const [gid, setGid] = useState((groups[0] || {}).id), [title, setTitle] = useState('');
  const g = groups.find((x) => x.id === gid);
  const save = () => { if (!g) return; const b = app.addBookList({ subject: g.subject, grade: g.grade || '', groupId: g.id, teacherId: app.me.id, year: new Date().getFullYear(), title: title.trim(), items: g.learners.map((acc) => ({ acc, no: '', signed: null, t2: null, t3: null, returned: null })) }); nav.replace('book', { id: b.id, term: 1 }); };
  return html`<div class="app"><${Band} nav=${nav} title="New book list" sub="One list per subject class" /><main class="col gut content"><section class="card">
    ${groups.length === 0 ? html`<span class="small muted">Add a subject class first.</span>` : html`
    <label class="f" for="bg">Class<select id="bg" class="inp" value=${gid} onChange=${(e) => setGid(e.target.value)}>${groups.map((x) => html`<option value=${x.id}>${groupTitle(x)}</option>`)}</select></label>
    <label class="f" for="bt">Book title (optional)<input id="bt" class="inp" value=${title} onInput=${(e) => setTitle(e.target.value)} placeholder="Natural Sciences Grade 8 (Platinum)" /></label>
    <span class="small muted">${g ? g.learners.length + ' learners will be on the list. You type each book number when the learner signs.' : ''}</span>
    <button class="btn big" onClick=${save}>Create list</button>`}</section></main></div>`;
}
function Book({ nav, id, term }) {
  const db = app.db, b = db.books.find((x) => x.id === id);
  const [t, setT] = useState(term || termOf(app.school, todayISO()));
  const items = b.items.slice().sort((x, y) => { const A = db.learners[x.acc], B = db.learners[y.acc]; return (A.surname + A.first).localeCompare(B.surname + B.first); });
  const fld = t === 2 ? 't2' : 't3';
  const issued = b.items.filter((x) => x.signed).length;
  const seen = t === 1 ? issued : t === 4 ? b.items.filter((x) => x.returned).length : b.items.filter((x) => x[fld] === 'Y').length;
  const missing = b.items.filter((x) => x.t2 === 'M' || x.t3 === 'M').length;
  const tabs = [[1, 'T1 · Sign out'], [2, 'T2 · Check'], [3, 'T3 · Check'], [4, 'T4 · Return']];
  const cyc = { null: 'Y', Y: 'M', M: null };
  const look = { null: ['Not checked', 'N'], Y: ['Seen', 'P'], M: ['Missing', 'A'] };
  return html`<div class="app"><${Band} nav=${nav} title=${'Book list ' + b.year} sub=${b.subject + ' · Grade ' + b.grade + ' · ' + staffName(db, b.teacherId)} right=${html`<button class="ghost" onClick=${() => nav.go('print', { what: 'b:' + b.id })}>Print</button>`}>
      <div class="tabs" role="tablist">${tabs.map(([n, l]) => html`<button role="tab" aria-selected=${String(t === n)} onClick=${() => setT(n)}>${l}</button>`)}</div>
      <div class="stats"><div class="stat"><b>${issued}</b><span>Books issued</span></div><div class="stat"><b>${seen}</b><span>${t === 1 ? 'Signed' : t === 4 ? 'Returned' : 'Seen in T' + t}</span></div><div class="stat"><b>${missing}</b><span>Missing</span></div></div><//>
    <div class="col"><p class="note">${t === 1 ? 'Type the book number, then tap Sign when the learner signs for it.' : t === 4 ? 'Tap a learner when the book comes back.' : 'Tap once for Seen, again for Missing, again to clear.'}</p></div>
    <main class="col" style="flex:1;background:var(--surface)">
      ${items.map((it, i) => { const l = db.learners[it.acc]; const nm = html`<span class="no">${i + 1}</span><span class="nm"><b>${learnerName(l)}</b><span>${it.no ? 'Book ' + it.no : 'No book number yet'}</span></span>`;
        if (t === 1) return html`<div class="lrow"><span class="no">${i + 1}</span><span class="nm"><b>${learnerName(l)}</b><input class="inp" style="min-height:38px;margin-top:4px;max-width:180px" aria-label=${'Book number for ' + learnerShort(l)} value=${it.no} placeholder="Book number" onChange=${(e) => app.updateBook(b.id, it.acc, { no: e.target.value.trim() })} /></span>
          <button class=${'badge ' + (it.signed ? 'P' : 'N')} style="border:0" onClick=${() => { if (!it.no && !it.signed) { app.toast('Type the book number first.'); return; } app.updateBook(b.id, it.acc, { signed: it.signed ? null : todayISO() }); }}>${it.signed ? 'Signed ' + fmtDMY(it.signed).slice(0, 5) : 'Sign'}</button></div>`;
        if (t === 4) return html`<button class="lrow" onClick=${() => app.updateBook(b.id, it.acc, { returned: it.returned ? null : todayISO() })}>${nm}<span class=${'badge ' + (it.returned ? 'P' : 'N')}>${it.returned ? 'Returned' : 'Not back'}</span></button>`;
        const v = it[fld] || null; return html`<button class=${'lrow ' + (v === 'M' ? 'A' : '')} onClick=${() => app.updateBook(b.id, it.acc, { [fld]: cyc[v] })}>${nm}<span class=${'badge ' + look[v][1]}>${look[v][0]}</span></button>`; })}
    </main></div>`;
}

/* ================= learners ================= */
function Find({ nav }) {
  const [q, setQ] = useState(''); const db = app.db;
  const ql = q.trim().toLowerCase();
  const mine = myLearnerSet(db, app.me);
  const hits = ql ? Object.values(db.learners).filter((l) => (!mine || mine.has(l.acc)) && (l.acc.includes(ql) || (l.first + ' ' + l.surname).toLowerCase().includes(ql) || (l.surname + ' ' + l.first).toLowerCase().includes(ql))).slice(0, 40) : [];
  const ref = useRef(); useEffect(() => { ref.current && ref.current.focus(); }, []);
  return html`<div class="app"><${Band} nav=${nav} title="Find a learner" sub=${mine ? mine.size + ' learners in your classes' : Object.keys(db.learners).length + ' learners in ' + app.school.short} />
    <main class="col gut content"><label class="f" for="fq">Name or accession number<input id="fq" ref=${ref} class="inp" value=${q} onInput=${(e) => setQ(e.target.value)} placeholder="e.g. Mokoena or 224150" autocomplete="off" /></label>
      ${hits.length > 0 && html`<div class="card flat">${hits.map((l) => html`<button class="list-row" onClick=${() => nav.go('learner', { acc: l.acc })}><span class="avatar">${(l.first[0] + l.surname[0]).toUpperCase()}</span><span class="grow"><b>${learnerName(l)}</b><br /><span class="tiny muted">${l.cls || 'Subject class only'} · Acc. ${l.acc}</span></span><${Icon} n="chev" s=${18} /></button>`)}</div>`}
      ${ql && !hits.length && html`<p class="muted small">No learner matches "${q}"${mine ? ' in your classes' : ''}.</p>`}
      ${mine && html`<p class="tiny muted">Teachers can open records only for learners they teach: your subject classes${app.me.registerClass ? ' and register class ' + app.me.registerClass : ''}. The office can look up anyone.</p>`}
    </main></div>`;
}
function Learner({ nav, acc }) {
  if (!app.db.learners[acc] || !canSeeLearner(app.db, app.me, acc)) return html`<div class="app"><${Band} nav=${nav} title="Not available" /><main class="col gut content"><div class="boxnote warn"><span>You can only open records for learners in your own classes. Ask the office for anyone else.</span></div></main></div>`;
  return html`<${LearnerView} nav=${nav} acc=${acc} />`;
}
function LearnerView({ nav, acc }) {
  const db = app.db, s = app.school, l = db.learners[acc];
  const t0 = todayISO();
  const [tab, setTab] = useState('att');
  const [ym, setYm] = useState([parse(t0).getFullYear(), parse(t0).getMonth()]);
  const [y, m] = ym; const N = daysInMonth(y, m);
  const days = []; for (let d = 1; d <= N; d++) days.push(y + '-' + pad(m + 1) + '-' + pad(d));
  const weekdays = days.filter((d) => dow(d) >= 1 && dow(d) <= 5);
  const firstPad = weekdays.length ? dow(weekdays[0]) - 1 : 0;
  let P_ = 0, A_ = 0, L_ = 0, sd = 0;
  const cells = weekdays.map((d) => { const sch = isSchoolDay(s, d); const mm = sch && d <= t0 ? morningMark(db, acc, d) : null; if (sch && d <= t0) sd++; if (mm === 'P') P_++; if (mm === 'A') A_++; if (mm === 'L') L_++; return { d, cls: !sch ? 'H' : mm || '', n: parse(d).getDate(), title: fmtShort(d) + ': ' + (!sch ? 'no school' : mm ? LOOK[mm] : 'not recorded') }; });
  const absNotes = days.filter((d) => morningMark(db, acc, d) === 'A').map((d) => { const r = db.reasons[acc + '|' + d]; return fmtShort(d) + ': ' + (r && r.code ? r.code + (r.note ? ' (' + r.note + ')' : '') : 'no reason yet'); });
  const grp = db.groups.filter((g) => g.learners.includes(acc));
  const incs = db.incidents.filter((x) => x.acc === acc);
  const books = db.books.map((b) => ({ b, it: b.items.find((x) => x.acc === acc) })).filter((x) => x.it);
  const c = l.cls && db.classes.find((x) => x.id === l.cls);
  const move = (k) => { let nm = m + k, ny = y; if (nm < 0) { nm = 11; ny--; } if (nm > 11) { nm = 0; ny++; } setYm([ny, nm]); };
  useEffect(() => { app.logLookup('Learner profile ' + acc); }, [acc]);
  return html`<div class="app"><${Band} nav=${nav} title=${learnerShort(l)} sub=${[l.cls, 'Acc. ' + acc, l.gender, l.dob ? 'DOB ' + l.dob.replace(/-/g, '/') : ''].filter(Boolean).join(' · ')}>
      <div class="tabs" role="tablist">${[['att', 'Attendance'], ['inc', 'Incidents · ' + incs.length], ['books', 'Books · ' + books.length]].map(([k, v]) => html`<button role="tab" aria-selected=${String(tab === k)} onClick=${() => setTab(k)}>${v}</button>`)}</div><//>
    <main class="col gut content">
      ${tab === 'att' && html`<section class="card">
        <div class="between"><button class="iconbtn" style="color:var(--primary-ink)" aria-label="Previous month" onClick=${() => move(-1)}><${Icon} n="back" /></button><b>${MON_LONG[m]} ${y}</b><button class="iconbtn" style="color:var(--primary-ink)" aria-label="Next month" onClick=${() => move(1)}><${Icon} n="chev" /></button></div>
        <div class="stats" style="grid-template-columns:repeat(4,minmax(0,1fr))">${[[sd, 'School days'], [P_, 'Present'], [A_, 'Absent'], [L_, 'Late']].map(([v, k]) => html`<div class="kpi" style="padding:8px 10px;box-shadow:none;background:var(--surface-2)"><div class="v" style="font-size:20px">${v}</div><div class="tiny muted">${k}</div></div>`)}</div>
        <div class="cal">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => html`<span class="hd">${d}</span>`)}${Array.from({ length: firstPad }).map(() => html`<span class="d E"></span>`)}${cells.map((x) => html`<span class=${'d ' + x.cls} title=${x.title}>${x.n}</span>`)}</div>
        <div class="legend"><span><i class="dot" style="background:var(--ok-fg)"></i>Present</span><span><i class="dot" style="background:var(--red)"></i>Absent</span><span><i class="dot" style="background:var(--late-fg)"></i>Late</span><span><i class="dot" style="border:1px dashed var(--faint)"></i>No school</span></div>
        ${absNotes.length > 0 && html`<div class="stack small">${absNotes.map((x) => html`<span>Absent ${x}</span>`)}</div>`}
        ${c && html`<span class="tiny muted">Register class ${c.id} · register teacher ${staffName(db, c.teacherId)}</span>`}
      </section>
      ${grp.length > 0 && html`<section class="card"><span class="eyebrow">Subject lessons in ${MON_LONG[m]}</span>${grp.map((g) => { let n = 0, a = 0; days.forEach((d) => g.slots.filter((x) => x.d === dow(d)).forEach((x) => { const mm = periodMark(db, g, acc, d, x.p); if (mm) { n++; if (mm === 'A') a++; } })); return html`<div class="between small"><span><b>${groupTitle(g)}</b></span><span class="muted">${n} lessons · ${a} absent</span></div>`; })}</section>`}`}
      ${tab === 'inc' && html`${incs.length === 0 && html`<p class="muted small">No incidents logged.</p>`}${incs.map((x) => html`<${IncCard} x=${x} />`)}${app.me.role === 'teacher' && html`<button class="btn line" onClick=${() => nav.go('incident-new', { acc })}>Log a new incident</button>`}`}
      ${tab === 'books' && html`${books.length === 0 && html`<p class="muted small">No books on any list.</p>`}${books.map(({ b, it }) => html`<section class="card" style="gap:6px"><b>${b.subject} Gr ${b.grade}</b><span class="small muted">Book ${it.no || '(no number)'} · ${it.signed ? 'Signed ' + fmtDMY(it.signed) : 'Not signed yet'}</span>
        <div class="wrap">${[['T2', it.t2], ['T3', it.t3]].map(([k, v]) => html`<span class=${'pill ' + (v === 'Y' ? 'ok' : v === 'M' ? 'red' : 'grey')}>${k} ${v === 'Y' ? 'checked' : v === 'M' ? 'missing' : 'not yet'}</span>`)}<span class=${'pill ' + (it.returned ? 'ok' : 'wait')}>${it.returned ? 'Returned' : 'Return due'}</span></div></section>`)}`}
    </main></div>`;
}

/* ================= paper preview + print lists ================= */
function PaperPreview({ model, max = 3, full }) {
  const cell = (c, tag) => { const o = typeof c === 'string' || c == null ? { t: c || '' } : c; const cls = [o.cls, o.align === 'l' ? 'l' : ''].filter(Boolean).join(' '); const t = String(o.t).split('\n'); return h(tag, { class: cls || null }, t.map((x, i) => (i ? [h('br'), x] : x))); };
  return html`<div class="paperwrap" style=${full ? 'max-height:none' : ''}>${model.pages.slice(0, max).map((pg) => html`<div class="paper">${model.crest ? html`<div class="paperhead"><img src=${model.crest} alt="School crest" /><div>${pg.title.map((t) => html`<h3>${t}</h3>`)}</div></div>` : pg.title.map((t) => html`<h3>${t}</h3>`)}<div class="meta">${pg.meta.map(([k, v]) => html`<span><b>${k}:</b> ${v}</span>`)}</div>
      <table><thead><tr>${pg.head.map((x) => cell(x, 'th'))}</tr></thead><tbody>${pg.body.map((r) => html`<tr>${r.map((x) => cell(x, 'td'))}</tr>`)}${(pg.foot || []).map((r) => html`<tr style="font-weight:700">${r.map((x) => cell(x, 'td'))}</tr>`)}</tbody></table>
      ${pg.after && html`<table style="margin-top:8px"><thead><tr>${pg.after.head.map((x) => cell(x, 'th'))}</tr></thead><tbody>${pg.after.body.map((r) => html`<tr style="height:30px">${r.map((x) => cell(x, 'td'))}</tr>`)}</tbody></table>`}
      ${pg.signLine && html`<div style="margin-top:12px">${pg.signLine}</div>`}<div class="foot">${pg.note}</div></div>`)}
    ${model.pages.length > max && html`<p class="small muted" style="margin:0">Showing ${max} of ${model.pages.length} pages. The PDF has them all.</p>`}</div>`;
}
function ExportBar({ model }) {
  return html`<div class="wrap"><button class="btn" onClick=${() => exportPdf(app, model)}><${Icon} n="print" s=${18} />Save PDF</button><button class="btn line" onClick=${() => exportXlsx(app, model)}>Download Excel</button></div>`;
}
function PrintLists({ nav, what }) {
  const db = app.db, me = app.me, t0 = todayISO();
  const opts = [];
  if (me.registerClass) opts.push({ id: 'm:' + me.registerClass, title: 'Morning register · ' + me.registerClass, sub: 'Learner Attendance Register, one page per month' });
  myGroups().forEach((g) => opts.push({ id: 'g:' + g.id, title: 'Subject register · ' + groupLabel(g), sub: 'Monthly Class Attendance, one page per month' }));
  db.books.filter((b) => b.teacherId === me.id).forEach((b) => opts.push({ id: 'b:' + b.id, title: 'Book list · ' + b.subject + ' Gr ' + b.grade, sub: 'Book list with signed, T2, T3 and return' }));
  opts.push({ id: 'inc', title: 'Incident report · my classes', sub: 'Detentions and incidents for the chosen months' });
  const [sel, setSel] = useState(what || (opts[0] || {}).id);
  const cm = parse(t0).getMonth(), cy = parse(t0).getFullYear();
  const [months, setMonths] = useState([cm]);
  const kind = (sel || '').split(':')[0], ref = (sel || '').split(':')[1];
  const ms = months.slice().sort((a, b) => a - b);
  let model = null;
  if (kind === 'm') model = combine(ms.map((m) => morningRegisterModel(app, ref, cy, m)), 'Register ' + ref + ' ' + ms.map((m) => MON[m]).join(' '));
  if (kind === 'g') model = combine(ms.map((m) => subjectRegisterModel(app, ref, cy, m)), groupLabel(db.groups.find((g) => g.id === ref)) + ' ' + ms.map((m) => MON[m]).join(' '));
  if (kind === 'b') model = bookListModel(app, ref);
  if (kind === 'inc') { const list = db.incidents.filter((x) => x.by === me.id && ms.includes(parse(x.date).getMonth()) && parse(x.date).getFullYear() === cy).sort((a, b) => (a.date > b.date ? 1 : -1)); model = incidentModel(app, list, 'Incident report ' + ms.map((m) => MON[m]).join(' ') + ' ' + cy); }
  const [view, setView] = useState(false);
  if (view && model) return html`<div class="app"><${Band} nav=${{ back: () => setView(false) }} title=${model.name} sub=${model.pages.length + (model.pages.length === 1 ? ' page' : ' pages') + ' · check it, then print'} />
    <main class="wide gut content"><${PaperPreview} model=${model} max=${99} full=${true} /></main>
    <footer class="footer-bar"><div class="col gut stack"><span class="tiny muted" style="text-align:center">Save the PDF, then print it from your phone or computer. It prints on A4 ${model.orientation === 'l' ? 'landscape' : 'portrait'}.</span><${ExportBar} model=${model} /></div></footer></div>`;
  return html`<div class="app"><${Band} nav=${nav} title="Print lists" sub="Printed in the school's paper format" />
    <main class="col gut content">
      <section class="card"><span class="eyebrow">1. What to print</span><div class="stack" role="radiogroup">${opts.map((o) => html`<button class="radio-row" role="radio" aria-checked=${String(sel === o.id)} onClick=${() => setSel(o.id)}><span class="radio-dot"></span><span class="grow"><b>${o.title}</b><br /><span class="tiny muted">${o.sub}</span></span></button>`)}</div></section>
      ${kind !== 'b' && html`<section class="card"><div class="between"><span class="eyebrow">2. Which months</span><span class="tiny muted">${months.length} selected</span></div>
        <div class="chips">${MON.map((mn, i) => html`<button class="chip" aria-pressed=${String(months.includes(i))} onClick=${() => setMonths(months.includes(i) ? (months.length > 1 ? months.filter((x) => x !== i) : months) : months.concat([i]))}>${mn}</button>`)}</div>
        <span class="small muted">Each month prints on its own page, already marked: ✓ present, A absent, L late. Weekends and holidays are shaded. Sign-off boxes stay blank for wet-ink signatures.</span></section>`}
      ${model && html`<section class="card"><span class="eyebrow">3. View, then print</span><span class="small muted">${model.pages.length} ${model.pages.length === 1 ? 'page' : 'pages'}, already filled in. Look through it before you print.</span><button class="btn big" onClick=${() => { setView(true); window.scrollTo(0, 0); }}><${Icon} n="file" s=${20} />View list</button></section>`}
    </main></div>`;
}

/* ================= office: today ================= */
function Office({ nav }) {
  const db = app.db, s = app.school;
  const [date, setDate] = useState(todayISO()), [g, setG] = useState('all'), [open, setOpen] = useState(null);
  const [rm, setRm] = useState(parse(todayISO()).getMonth());
  const all = db.classes.map((c) => Object.assign({ c }, classStatus(db, c.id, date)));
  const got = all.filter((x) => x.st === 'in');
  const enrolled = all.reduce((t, x) => t + classLearners(db, x.c.id).length, 0);
  const recd = all.filter((x) => x.st !== 'none');
  const abs = recd.reduce((t, x) => t + x.a, 0), late = recd.reduce((t, x) => t + x.l, 0);
  const counted = recd.reduce((t, x) => t + x.n, 0);
  const withReason = Object.keys(db.reasons).filter((k) => k.endsWith('|' + date) && db.reasons[k].code).length;
  const lateByGrade = {}; recd.forEach((x) => { lateByGrade[x.c.grade] = (lateByGrade[x.c.grade] || 0) + x.l; });
  const topLate = Object.keys(lateByGrade).sort((a, b) => lateByGrade[b] - lateByGrade[a])[0];
  const still = isSchoolDay(s, date) ? all.filter((x) => x.st !== 'in') : [];
  const tAbsent = (uid) => { const c = (db.changes || {})[uid + '|' + date] || {}; return c.absent ? 'absent' : c.signout ? 'signed out ' + c.signout : ''; };
  const [ns, setNs] = useState(null);
  const follow = useMemo(() => Object.keys(db.learners).map((a) => ({ a, n: consecutiveAbsent(db, s, a, date) })).filter((x) => x.n >= 3).sort((x, y) => y.n - x.n), [date, db.registers]);
  const tiles = all.filter((x) => g === 'all' || String(x.c.grade) === g);
  const regM = () => combine(db.classes.map((c) => morningRegisterModel(app, c.id, parse(date).getFullYear(), rm)), 'All registers ' + MON[rm] + ' ' + parse(date).getFullYear());
  const [regModel, setRegModel] = useState(null);
  const openTile = open && all.find((x) => x.c.id === open);
  return html`<div class="app"><${WideBand} nav=${nav} noBack=${app.me.role !== 'teacher'} title=${'KAT · Attendance office'} sub=${fmtLong(date) + ' · Morning register'} />
    <main class="wide gut content">
      <div class="between"><label class="f" for="od" style="flex-direction:row;align-items:center;gap:10px">Day<input id="od" type="date" class="inp" style="width:auto" value=${date} onInput=${(e) => e.target.value && setDate(e.target.value)} /></label><div class="row" style="gap:8px;flex-wrap:wrap">${!isSchoolDay(s, date) && html`<span class="pill grey">${s.noSchool && s.noSchool[date] ? 'No school: ' + s.noSchool[date] : 'Not a school day'}</span>`}
        ${s.noSchool && s.noSchool[date] ? html`<button class="btn sm line" onClick=${() => { app.setNoSchool(date, null); app.toast(fmtShort(date) + ' is a school day again.'); }}>Undo no school</button>` : isSchoolDay(s, date) && html`<button class="btn sm line" onClick=${() => setNs('')}>Mark as no school day</button>`}</div></div>
      ${ns !== null && html`<section class="card"><span class="eyebrow">No school on ${fmtLong(date)}</span><span class="small muted">No registers are expected, nothing counts as missed, and the monthly register shades the day.</span>
        <div class="chips">${['Weather (snow or storm)', 'Strike or stayaway', 'Water or power outage', 'Sports or cultural day', 'Teacher development day'].map((r) => html`<button class="chip" aria-pressed=${String(ns === r)} onClick=${() => setNs(r)}>${r}</button>`)}</div>
        <input class="inp" placeholder="Or type the reason" value=${ns} onInput=${(e) => setNs(e.target.value)} />
        <div class="wrap"><button class="btn" disabled=${!ns.trim()} onClick=${() => { app.setNoSchool(date, ns.trim()); setNs(null); app.toast(fmtShort(date) + ' marked as no school.'); }}>Save</button><button class="btn soft" onClick=${() => setNs(null)}>Cancel</button></div></section>`}
      <section class="kpis">
        <div class="kpi"><div class="l">Learners present</div><div class="v">${counted - abs} <small>of ${counted}</small></div><div class="s" style="color:var(--ok-fg)">${counted ? ((100 * (counted - abs)) / counted).toFixed(1) : '0'}% of registers in · ${enrolled} enrolled</div></div>
        <div class="kpi"><div class="l">Registers received</div><div class="v">${got.length} <small>of ${all.length}</small></div><div class="s" style="color:var(--abs-ink)">${isSchoolDay(s, date) ? all.length - got.length + ' still to come' : 'No registers needed today'}</div></div>
        <div class="kpi"><div class="l">Absent</div><div class="v">${abs}</div><div class="s muted">${withReason} with a reason given</div></div>
        <div class="kpi"><div class="l">Late</div><div class="v">${late}</div><div class="s muted">${late ? 'Most in Grade ' + topLate : 'No late learners'}</div></div>
      </section>
      <div class="split">
        <section class="card mainpane"><div class="between"><h2 style="font-size:17px">Register classes</h2>
          <div class="chips">${['all'].concat(s.grades.map(String)).map((x) => html`<button class="chip" aria-pressed=${String(g === x)} onClick=${() => setG(x)}>${x === 'all' ? 'All grades' : 'Gr ' + x}</button>`)}</div></div>
          <div class="legend"><span><i class="dot" style="background:var(--ok-fg)"></i>Received</span><span><i class="dot" style="background:var(--wait-dot)"></i>Saved on phone, not sent yet</span><span><i class="dot" style="background:var(--red)"></i>Not started</span></div>
          <div class="ctiles">${tiles.map((x) => html`<button class=${'ctile ' + x.st} onClick=${() => setOpen(x.c.id)}><span class="t"><b>${x.c.id}</b><span class="dot"></span></span><span class="small" style="font-weight:600">${x.st === 'none' ? 'Not started' : x.st === 'wait' ? 'Saved on phone' : x.p + ' of ' + x.n + ' present'}</span><span class="tiny muted">${x.rec && x.rec.coverFor ? staffName(db, x.rec.by) + ' (cover)' : x.c.teacherId ? staffName(db, x.c.teacherId) : 'No register teacher'}</span></button>`)}</div>
        </section>
        <aside class="sidepane">
          <section class="card"><h2 style="font-size:16px">Still to come${date === todayISO() ? ' (' + nowHM() + ')' : ''}</h2>
            ${(() => { const td = schoolTimes(s).days[dow(date)]; return td && isSchoolDay(s, date) ? html`<span class="tiny muted">${td.held ? 'Assembly ' + td.start + ' · due by ' + td.due : 'No assembly: taken in class at P1 · due by ' + td.due} · chase from ${td.chase}${date === todayISO() && nowHM() >= td.chase && still.length ? ' · chase now' : ''}</span>` : null; })()}
            ${still.length === 0 && html`<span class="small muted">All registers are in.</span>`}
            ${still.map((x) => html`<div class="between" style="padding:6px 0;border-bottom:1px solid var(--line-soft)"><div><b>${x.c.id}</b><br /><span class="tiny muted">${x.c.teacherId ? staffName(db, x.c.teacherId) : 'No teacher'} · ${x.st === 'wait' ? 'saved on phone ' + x.rec.at.slice(11) : 'not started'}</span>${x.c.teacherId && tAbsent(x.c.teacherId) === 'absent' && html`<br /><span class="pill red" style="font-size:11px">Teacher absent today · needs cover</span>`}</div>
              ${x.st === 'wait' ? html`<span class="tiny" style="color:var(--late-fg);font-weight:600">No action needed</span>` : html`<div class="row" style="gap:6px"><button class="btn sm line" onClick=${() => app.toast('Test version: a reminder would go to ' + staffName(db, x.c.teacherId) + "'s phone.")}>Remind</button><button class="btn sm" onClick=${() => nav.go('register', { cls: x.c.id, cover: true, date })}>Mark for class</button></div>`}</div>`)}
          </section>
          <section class="card"><h2 style="font-size:16px">Follow up: absent 3+ days in a row</h2>
            ${follow.length === 0 && html`<span class="small muted">Nobody right now.</span>`}
            ${follow.slice(0, 8).map((x) => { const l = db.learners[x.a]; return html`<button class="between linkbtn" style="color:var(--fg);font-weight:400;width:100%" onClick=${() => nav.go('learner', { acc: x.a })}><span><b>${learnerShort(l)}</b> · ${l.cls}</span><span style="color:var(--abs-ink);font-weight:600">${x.n} days</span></button>`; })}
          </section>
          <section class="card"><h2 style="font-size:16px">School timetable</h2><p class="small muted" style="margin:0">Upload the aSc teacher timetable PDF once for the whole school. Each teacher's lessons then show on their own phone under Period register.</p><button class="btn line" onClick=${() => nav.go('timetable', { mode: 'school' })}><${Icon} n="grid" s=${18} />Upload school timetable</button></section>
          <section class="card"><h2 style="font-size:16px">Daily SA-SAMS capture</h2><p class="small muted" style="margin:0">Every absentee from all ${all.length} classes in one list, with reasons, instead of going through each file.</p><button class="btn" onClick=${() => nav.go('capture', { date })}>Open the absentee list</button></section>
          <section class="card"><h2 style="font-size:16px">Find records</h2><p class="small muted" style="margin:0">Any learner, class or grade, by month, dates or subject. For circuit manager requests.</p><button class="btn line" onClick=${() => nav.go('records')}>Search attendance records</button></section>
          <section class="card"><h2 style="font-size:16px">Monthly registers</h2><p class="small muted" style="margin:0">The Learner Attendance Register for every class, already totalled, with the Week 1 to 5 sign-off boxes.</p>
            <label class="f" for="rm">Month<select id="rm" class="inp" value=${rm} onChange=${(e) => { setRm(Number(e.target.value)); setRegModel(null); }}>${MON_LONG.map((x, i) => html`<option value=${i}>${x}</option>`)}</select></label>
            <button class="btn" onClick=${() => exportPdf(app, regM())}>Save all ${all.length} classes (PDF)</button><button class="btn line" onClick=${() => exportXlsx(app, regM())}>Export to Excel</button>
            <button class="linkbtn" onClick=${() => setRegModel(regModel ? null : morningRegisterModel(app, db.classes[0].id, parse(date).getFullYear(), rm))}>${regModel ? 'Hide preview' : 'Preview one class'}</button>
            ${regModel && html`<${PaperPreview} model=${regModel} max=${1} />`}</section>
        </aside>
      </div>
    </main>
    ${openTile && html`<${Sheet} title=${openTile.c.id + ' · ' + fmtShort(date)} onClose=${() => setOpen(null)}>
      <span class="small muted">Register teacher: ${openTile.c.teacherId ? staffName(db, openTile.c.teacherId) : 'none'}${openTile.rec ? ' · marked by ' + staffName(db, openTile.rec.by) + (openTile.rec.coverFor ? ' (covering)' : '') + ' at ' + openTile.rec.at.slice(11) : ''}</span>
      ${openTile.rec ? html`<div class="stack">${classLearners(db, openTile.c.id).filter((a) => openTile.rec.marks[a]).map((a) => { const r = db.reasons[a + '|' + date]; return html`<div class="between small"><span>${learnerName(db.learners[a])}</span><span class=${'badge ' + openTile.rec.marks[a]}>${LOOK[openTile.rec.marks[a]]}${openTile.rec.marks[a] === 'A' ? ' · ' + (r && r.code ? r.code : 'no reason') : ''}</span></div>`; })}${!Object.keys(openTile.rec.marks).length && html`<span class="small">Everyone present.</span>`}</div>` : html`<span class="small">No register yet.</span>`}
      <button class="btn" onClick=${() => { setOpen(null); nav.go('register', { cls: openTile.c.id, cover: true, date }); }}>${openTile.rec ? 'Correct this register' : 'Mark for class'}</button>
    <//>`}
    <${BottomNav} nav=${nav} cur="office" /></div>`;
}

/* ================= office: SA-SAMS capture list ================= */
function Capture({ nav, date: d0 }) {
  const db = app.db;
  const [date, setDate] = useState(d0 || todayISO()), [f, setF] = useState('all');
  const rows = [];
  db.classes.forEach((c) => { const r = db.registers[regKey('m', c.id, date, 0)]; if (!r) return; classLearners(db, c.id).filter((a) => r.marks[a] === 'A').forEach((a) => {
    const k = a + '|' + date, rs = db.reasons[k] || {}, cap = db.captured[k];
    rows.push({ a, cls: c.id, reason: rs.code, note: rs.note, by: staffName(db, r.by) + (r.coverFor ? ' (covering)' : ''), cap, updated: cap && (cap.reasonAtCapture || null) !== (rs.code || null) });
  }); });
  const total = rows.length, captured = rows.filter((x) => x.cap).length, noReason = rows.filter((x) => !x.reason).length, upd = rows.filter((x) => x.updated).length;
  const filters = [['all', 'All · ' + total], ['todo', 'Not captured · ' + (total - captured)], ['none', 'No reason yet · ' + noReason], ['upd', 'Reason updated · ' + upd]];
  const list = rows.filter((x) => f === 'all' || (f === 'todo' && !x.cap) || (f === 'none' && !x.reason) || (f === 'upd' && x.updated));
  const model = tableModel(app, 'ABSENTEES ' + fmtDMY(date), [['Day', fmtLong(date)], ['Absent', String(total)]], ['Class', 'Learner', 'Accession no', 'Reason', 'Marked by', 'Captured'], rows.map((x) => [x.cls, { t: learnerName(db.learners[x.a]), align: 'l' }, x.a, { t: (x.reason || 'No reason yet') + (x.updated ? ' (updated)' : ''), align: 'l' }, { t: x.by, align: 'l' }, x.cap ? TICK : '']), 'p');
  return html`<div class="app"><${WideBand} nav=${nav} title="Daily absentee list for SA-SAMS" sub=${fmtLong(date) + ' · all register classes in one list'} />
    <main class="wide gut content">
      <div class="between"><label class="f" for="cd" style="flex-direction:row;align-items:center;gap:10px">Day<input id="cd" type="date" class="inp" style="width:auto" value=${date} onInput=${(e) => e.target.value && setDate(e.target.value)} /></label><${ExportBar} model=${model} /></div>
      <section class="kpis"><div class="kpi"><div class="l">Absent</div><div class="v">${total}</div></div><div class="kpi"><div class="l">Captured in SA-SAMS</div><div class="v">${captured} <small>of ${total}</small></div><div class="s muted">Tick each one as you capture it</div></div><div class="kpi"><div class="l">No reason yet</div><div class="v">${noReason}</div><div class="s muted">Teachers are following up</div></div></section>
      <div class="chips">${filters.map(([k, v]) => html`<button class="chip" aria-pressed=${String(f === k)} onClick=${() => setF(k)}>${v}</button>`)}</div>
      <div class="tablebox"><table class="t"><thead><tr><th>Class</th><th>Learner</th><th>Accession no</th><th>Reason</th><th>Marked by</th><th>Captured</th></tr></thead><tbody>
        ${list.map((x) => html`<tr class=${x.cap && !x.updated ? 'done' : ''}><td><b>${x.cls}</b></td><td>${learnerShort(db.learners[x.a])}</td><td class="n">${x.a}</td><td style=${x.reason ? '' : 'color:var(--abs-ink);font-weight:600'}>${x.reason || 'No reason yet'}${x.updated && html` <span class="pill info">Reason updated</span>`}</td><td class="small">${x.by}</td>
          <td><button class=${'btn sm ' + (x.cap ? 'ok' : 'line')} aria-pressed=${String(!!x.cap)} onClick=${() => { if (x.updated) app.setCaptured(x.a, date, true); else app.setCaptured(x.a, date, !x.cap); }}>${x.updated ? 'Re-captured' : x.cap ? 'Captured ✓' : 'Mark captured'}</button></td></tr>`)}
        ${list.length === 0 && html`<tr><td colspan="6" class="muted">Nothing in this list.</td></tr>`}</tbody></table></div>
      <p class="small muted" style="margin:0">When a teacher adds a reason later, the row shows "Reason updated", so a learner already captured as "no reason" can be corrected in SA-SAMS.</p>
    </main><${BottomNav} nav=${nav} cur="capture" /></div>`;
}

/* ================= office: records ================= */
function Records({ nav }) {
  const db = app.db, s = app.school, t0 = todayISO();
  const mStart = t0.slice(0, 8) + '01';
  const mine = myLearnerSet(db, app.me);
  const [mode, setMode] = useState('learner'), [acc, setAcc] = useState(null), [cls, setCls] = useState(db.classes[0].id), [grade, setGrade] = useState(String(s.grades[0]));
  const [reg, setReg] = useState('m'), [from, setFrom] = useState(mStart), [to, setTo] = useState(t0), [run, setRun] = useState(false);
  const [tab, setTab] = useState('sum'), [month, setMonth] = useState(t0.slice(0, 7));
  const preset = (p) => { setRun(false); if (p === 'lm') { setMode('learner'); setReg('m'); setFrom(mStart); setTo(t0); } if (p === 'ls') { setMode('learner'); setReg((groupsFor[0] || {}).id || 'm'); } if (p === 'cm') { setMode('class'); setReg('m'); setFrom(mStart); setTo(t0); } if (p === 'gr') { setMode('grade'); setReg('m'); setFrom(addDays(t0, -14)); setTo(t0); } };
  const days = schoolDays(s, from, to).filter((d) => d <= t0);
  const groupsFor = (mode === 'learner' && acc ? db.groups.filter((g) => g.learners.includes(acc)) : db.groups).filter((g) => !mine || g.teacherId === app.me.id);
  let out = null;
  if (run && (mode !== 'learner' || acc)) {
    if (mode === 'learner') {
      const l = db.learners[acc];
      if (reg === 'm') {
        let p = 0, a = 0, lt = 0; const lg = groupsFor;
        const rows = days.map((d) => { const mm = morningMark(db, acc, d); if (mm === 'P') p++; if (mm === 'A') a++; if (mm === 'L') lt++; const r = db.reasons[acc + '|' + d]; return [fmtShort(d), mm ? LOOK[mm] : 'Not recorded'].concat(lg.map((g) => { const ms = g.slots.filter((x) => x.d === dow(d)).map((x) => periodMark(db, g, acc, d, x.p)).filter(Boolean); return ms.length ? ms.map((x) => (x === 'P' ? '✓' : x)).join(' ') : ''; }), [{ t: mm === 'A' ? (r && r.code ? r.code : 'No reason yet') : '', align: 'l' }]); });
        const pct = p + a + lt ? Math.round((100 * (p + lt)) / (p + a + lt)) : 0;
        out = { sum: { name: learnerShort(l), line: (l.cls || '') + ' · Acc. ' + acc + (l.cls ? ' · Register teacher: ' + staffName(db, (db.classes.find((c) => c.id === l.cls) || {}).teacherId) : ''), pct, days: days.length, a, lt },
          model: tableModel(app, 'ATTENDANCE · ' + learnerName(l).toUpperCase(), [['Class', l.cls || ''], ['Acc No', acc], ['From', fmtDMY(from)], ['To', fmtDMY(to)], ['Attendance', pct + '%']], ['Date', 'Morning register'].concat(lg.map(groupLabel), ['Reason']), rows, 'p') };
      } else {
        const g = db.groups.find((x) => x.id === reg); const rows = []; let n = 0, a = 0;
        days.forEach((d) => g.slots.filter((x) => x.d === dow(d)).forEach((x) => { const mm = periodMark(db, g, acc, d, x.p); if (mm) { n++; if (mm === 'A') a++; } rows.push([fmtShort(d), 'P' + x.p, mm ? LOOK[mm] : 'Not recorded']); }));
        out = { sum: { name: learnerShort(l), line: groupTitle(g) + ' · ' + staffName(db, g.teacherId), pct: n ? Math.round((100 * (n - a)) / n) : 0, days: n, daysLabel: 'lessons', a, lt: rows.filter((r) => r[2] === 'Late').length }, model: tableModel(app, groupTitle(g).toUpperCase() + ' · ' + learnerName(l).toUpperCase(), [['From', fmtDMY(from)], ['To', fmtDMY(to)], ['Lessons', String(n)], ['Absent', String(a)]], ['Date', 'Period', 'Mark'], rows, 'p') };
      }
    } else {
      const accs = mode === 'class' ? classLearners(db, cls) : [].concat(...db.classes.filter((c) => String(c.grade) === grade).map((c) => classLearners(db, c.id)));
      const g = reg !== 'm' ? db.groups.find((x) => x.id === reg) : null;
      const rows = accs.filter((a) => !g || g.learners.includes(a)).map((a) => { let p = 0, ab = 0, lt = 0; days.forEach((d) => { const ms = g ? g.slots.filter((x) => x.d === dow(d)).map((x) => periodMark(db, g, a, d, x.p)) : [morningMark(db, a, d)]; ms.forEach((mm) => { if (mm === 'P') p++; if (mm === 'A') ab++; if (mm === 'L') lt++; }); }); const tot = p + ab + lt; return [{ t: learnerName(db.learners[a]), align: 'l' }, a, db.learners[a].cls || '', String(p), String(ab), String(lt), tot ? Math.round((100 * (p + lt)) / tot) + '%' : '']; });
      const label = mode === 'class' ? 'Class ' + cls : 'Grade ' + grade;
      const n = (i) => rows.reduce((t, r) => t + Number(r[i]), 0), P = n(3), A = n(4), LT = n(5);
      const worst = rows.filter((r) => Number(r[4]) > 0).sort((x, y) => Number(y[4]) - Number(x[4])).slice(0, 5);
      out = { cls: { pct: P + A + LT ? Math.round((100 * (P + LT)) / (P + A + LT)) : 0, days: days.length, a: A, lt: LT, learners: rows.length, worst, label: label + ' · ' + (g ? groupTitle(g) : 'Morning register'), teacher: mode === 'class' ? staffName(db, (db.classes.find((c) => c.id === cls) || {}).teacherId) : '' },
        model: tableModel(app, (label + ' · ' + (g ? groupTitle(g) : 'Morning register')).toUpperCase(), [['From', fmtDMY(from)], ['To', fmtDMY(to)], ['School days', String(days.length)], ['Learners', String(rows.length)]], ['Learner', 'Acc No', 'Class', 'Present', 'Absent', 'Late', 'Attendance'], rows, 'p') };
    }
  }
  const go = () => { if (mode === 'learner' && !acc) { app.toast('Choose a learner first.'); return; } setRun(true); setTab('sum'); setMonth(from.slice(0, 7)); app.logLookup('Records: ' + mode + ' ' + (acc || cls || grade) + ' ' + reg + ' ' + from + ' to ' + to); };
  const [my, mm] = month.split('-').map(Number);
  const regModel = out && mode === 'class' && tab === 'reg' ? (reg === 'm' ? morningRegisterModel(app, cls, my, mm - 1) : subjectRegisterModel(app, reg, my, mm - 1)) : null;
  return html`<div class="app"><${WideBand} nav=${nav} noBack=${app.me.role !== 'teacher'} title="Find attendance records" sub="For requests from the circuit manager, parents or SMT" />
    <main class="wide gut content">
      <div class="row" style="flex-wrap:wrap;gap:8px"><span class="small muted">Common requests:</span>${[['lm', 'One learner, one month'], ['ls', 'One learner, one subject'], ['cm', 'Whole class, one month'], ['gr', 'Grade, date range']].filter(([k]) => !mine || k === 'lm' || k === 'ls').map(([k, v]) => html`<button class="chip" onClick=${() => preset(k)}>${v}</button>`)}</div>
      <section class="card">
        <div class="chips" role="radiogroup" aria-label="Who">${[['learner', 'One learner'], ['class', 'A class'], ['grade', 'A grade']].filter(([k]) => !mine || k === 'learner').map(([k, v]) => html`<button class="chip" role="radio" aria-checked=${String(mode === k)} aria-pressed=${String(mode === k)} onClick=${() => { setMode(k); setRun(false); }}>${v}</button>`)}</div>
        <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
          ${mode === 'learner' && html`<div style="grid-column:1/-1"><${LearnerPicker} pool=${mine ? [...mine] : null} value=${acc} onPick=${(a) => { setAcc(a); setRun(false); if (mine && reg !== 'm' && !db.groups.some((g) => g.id === reg && g.learners.includes(a))) setReg('m'); }} id="rl" />${mine && html`<span class="tiny muted">Only learners you teach are listed. The office can look up anyone.</span>`}</div>`}
          ${mode === 'class' && html`<label class="f" for="rc">Class<select id="rc" class="inp" value=${cls} onChange=${(e) => { setCls(e.target.value); setRun(false); }}>${db.classes.map((c) => html`<option>${c.id}</option>`)}</select></label>`}
          ${mode === 'grade' && html`<label class="f" for="rg">Grade<select id="rg" class="inp" value=${grade} onChange=${(e) => { setGrade(e.target.value); setRun(false); }}>${s.grades.map((g) => html`<option>${g}</option>`)}</select></label>`}
          <label class="f" for="rr">Register<select id="rr" class="inp" value=${reg} onChange=${(e) => { setReg(e.target.value); setRun(false); }}><option value="m">Morning register</option>${groupsFor.map((g) => html`<option value=${g.id}>${groupTitle(g)}</option>`)}</select></label>
          <label class="f" for="rf">From<input id="rf" type="date" class="inp" value=${from} onInput=${(e) => { setFrom(e.target.value); setRun(false); }} /></label>
          <label class="f" for="rt">To<input id="rt" type="date" class="inp" value=${to} onInput=${(e) => { setTo(e.target.value); setRun(false); }} /></label>
        </div>
        <button class="btn big" onClick=${go}><${Icon} n="search" s=${20} />Show records</button>
      </section>
      ${out && mode === 'class' && html`<div class="chips" role="tablist" aria-label="View">${[['sum', 'Summary'], ['reg', 'View / print monthly register']].map(([k, v]) => html`<button class="chip" role="tab" aria-selected=${String(tab === k)} aria-pressed=${String(tab === k)} onClick=${() => setTab(k)}>${v}</button>`)}</div>`}
      ${out && html`<section class="card">
        ${out.sum && html`<div class="between"><div><b style="font-size:18px">${out.sum.name}</b><br /><span class="small muted">${out.sum.line}</span></div></div>
          <div class="kpis">${[[out.sum.pct + '%', 'attendance'], [out.sum.days, out.sum.daysLabel || 'school days'], [out.sum.a, 'absent'], [out.sum.lt, 'late']].map(([v, k]) => html`<div class="kpi" style="box-shadow:none;background:var(--surface-2)"><div class="v">${v}</div><div class="l">${k}</div></div>`)}</div>`}
        ${regModel ? html`<div class="row" style="flex-wrap:wrap;gap:10px;align-items:end"><label class="f" for="rmo">Month<input id="rmo" type="month" class="inp" style="width:auto" value=${month} onInput=${(e) => e.target.value && setMonth(e.target.value)} /></label><span class="small muted">${cls}${reg === 'm' ? ' · Learner Attendance Register' : ' · ' + groupTitle(db.groups.find((x) => x.id === reg))} · ✓ present, A absent, L late</span></div>
          <${PaperPreview} model=${regModel} max=${4} />
          <div class="wrap"><button class="btn" onClick=${() => exportPdf(app, regModel)}><${Icon} n="print" s=${18} />Print / Save PDF</button><button class="btn line" onClick=${() => exportXlsx(app, regModel)}>Download Excel</button></div>`
        : html`${out.cls && html`<div><b style="font-size:18px">${out.cls.label}</b>${out.cls.teacher && html`<br /><span class="small muted">Register teacher: ${out.cls.teacher}</span>`}</div>
          <div class="kpis">${[[out.cls.pct + '%', 'attendance'], [out.cls.days, 'school days'], [out.cls.learners, 'learners'], [out.cls.a, 'absences'], [out.cls.lt, 'late']].map(([v, k]) => html`<div class="kpi" style="box-shadow:none;background:var(--surface-2)"><div class="v">${v}</div><div class="l">${k}</div></div>`)}</div>
          ${out.cls.worst.length > 0 && html`<div class="stack"><span class="eyebrow">Most days absent</span>${out.cls.worst.map((r) => html`<div class="between small"><span>${cellText(r[0])}</span><b>${r[4]} absent${Number(r[5]) ? ' · ' + r[5] + ' late' : ''}</b></div>`)}</div>`}`}
        <div class="tablebox" style="max-height:60vh;overflow:auto"><table class="t"><thead><tr>${out.model.pages[0].head.map((x) => html`<th>${x}</th>`)}</tr></thead><tbody>${out.model.pages[0].body.map((r) => html`<tr>${r.map((c) => html`<td class="n">${cellText(c)}</td>`)}</tr>`)}${out.model.pages[0].body.length === 0 && html`<tr><td class="muted">No school days in this range.</td></tr>`}</tbody></table></div>
        <${ExportBar} model=${out.model} />`}
        <span class="tiny muted">Every report says who printed it and when, and KAT keeps a log of which records were looked up.</span>
      </section>`}
    </main>${app.me.role !== 'teacher' && html`<${BottomNav} nav=${nav} cur="records" />`}</div>`;
}

/* ================= admin: school settings ================= */
function Admin({ nav }) {
  const db = app.db, s = app.school;
  const [f, setF] = useState(() => ({ name: s.name, local: s.local || '', short: s.short, motto: s.motto || '', assembly: s.assembly, primary: s.colors.primary, accent: s.colors.accent, red: s.colors.red, reasons: app.reasonsList.join('\n'), bells: app.bells.map((b) => 'P' + b.p + ' ' + b.t + '-' + b.e).join('\n'), terms: cal(s).terms.map((t) => 'Term ' + t.n + ' ' + t.from + ' ' + t.to).join('\n'), holidays: cal(s).holidays.join('\n') }));
  const [confirmReset, setConfirmReset] = useState(false);
  const set = (k) => (e) => setF(Object.assign({}, f, { [k]: e.target.value }));
  const save = () => {
    const bells = f.bells.split('\n').map((x) => x.match(/P?(\d+)\s+(\d\d:\d\d)\s*-\s*(\d\d:\d\d)/)).filter(Boolean).map((m) => ({ p: Number(m[1]), t: m[2], e: m[3] }));
    const terms = f.terms.split('\n').map((x) => x.match(/(\d)\D+(\d{4}-\d\d-\d\d)\s+(\d{4}-\d\d-\d\d)/)).filter(Boolean).map((m) => ({ n: Number(m[1]), from: m[2], to: m[3] }));
    const holidays = f.holidays.split(/\s+/).filter((x) => /^\d{4}-\d\d-\d\d$/.test(x));
    app.updateSettings({ name: f.name.trim(), local: f.local.trim(), short: f.short.trim(), motto: f.motto.trim(), assembly: f.assembly, colors: { primary: f.primary, accent: f.accent, red: f.red }, reasons: f.reasons.split('\n').map((x) => x.trim()).filter(Boolean), bells: bells.length ? bells : BELLS, calendar: terms.length ? { terms, holidays } : undefined });
    app.toast('School settings saved.');
  };
  const onCrest = (e) => { const file = e.target.files[0]; if (!file) return; const fr = new FileReader(); fr.onload = () => { app.updateSettings({ crest: fr.result }); app.toast('Crest updated.'); }; fr.readAsDataURL(file); };
  const exportJson = async () => { await saveFile('teng-' + db.schoolId + '-' + todayISO() + '.json', JSON.stringify(db, null, 1)); };
  return html`<div class="app"><${WideBand} nav=${nav} title="School settings" sub=${s.name + ' · name, crest, colours, reasons, calendar'} />
    <main class="wide gut content" style="max-width:900px">
      <section class="card"><span class="eyebrow">School</span>
        <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
          <label class="f" for="an">Name<input id="an" class="inp" value=${f.name} onInput=${set('name')} /></label>
          <label class="f" for="al">Other-language name<input id="al" class="inp" value=${f.local} onInput=${set('local')} /></label>
          <label class="f" for="as">Short name<input id="as" class="inp" value=${f.short} onInput=${set('short')} /></label>
          <label class="f" for="am">Motto<input id="am" class="inp" value=${f.motto} onInput=${set('motto')} /></label>
          <label class="f" for="aa">Assembly time<input id="aa" type="time" class="inp" value=${f.assembly} onInput=${set('assembly')} /></label></div>
      </section>
      <section class="card"><span class="eyebrow">Crest and colours</span>
        <div class="row" style="flex-wrap:wrap"><img src=${s.crest} alt="Current crest" style="width:72px;height:72px;object-fit:contain;background:#fff;border-radius:10px;border:1px solid var(--line)" />
          <label class="btn line" for="crest" style="cursor:pointer">Upload a new crest</label><input id="crest" type="file" accept="image/*" style="position:absolute;width:1px;height:1px;opacity:0" onChange=${onCrest} /></div>
        <div class="row" style="flex-wrap:wrap;gap:18px">${[['primary', 'Main colour'], ['accent', 'Accent colour'], ['red', 'Absent and alert colour']].map(([k, v]) => html`<label class="f" for=${'c' + k} style="align-items:flex-start">${v}<input id=${'c' + k} type="color" class="swatch" value=${f[k]} onInput=${set(k)} /></label>`)}</div>
        <span class="small muted">Colours change the whole app for everyone at this school after you save.</span>
      </section>
      <section class="card"><span class="eyebrow">Absence reasons</span><label class="f" for="ar">One per line. Use the SA-SAMS list when the office has it.<textarea id="ar" class="inp" rows="9" value=${f.reasons} onInput=${set('reasons')}></textarea></label></section>
      <section class="card"><span class="eyebrow">Calendar and bell times</span>
        <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
          <label class="f" for="at">Terms (Term n, first day, last day)<textarea id="at" class="inp" rows="4" value=${f.terms} onInput=${set('terms')}></textarea></label>
          <label class="f" for="ah">Public holidays and closed days<textarea id="ah" class="inp" rows="4" value=${f.holidays} onInput=${set('holidays')}></textarea></label>
          <label class="f" for="ab">Bell times<textarea id="ab" class="inp" rows="7" value=${f.bells} onInput=${set('bells')}></textarea></label></div>
        <span class="small muted">Term dates are filled in from the 2026 public school calendar. Please check them.</span>
      </section>
      <button class="btn big" onClick=${save}>Save school settings</button>
      <section class="card"><span class="eyebrow">Data</span>
        <span class="small muted">${Object.keys(db.learners).length} learners · ${db.classes.length} register classes · ${db.groups.length} subject classes · ${Object.keys(db.registers).length} registers stored. This school's data is kept apart from every other school.</span>
        <div class="wrap"><button class="btn line" onClick=${exportJson}>Download all data (JSON)</button>${app.cloud ? null : confirmReset ? html`<button class="btn danger" onClick=${() => { app.resetSample(); setConfirmReset(false); app.toast('Sample data reset.'); }}>Yes, reset everything</button><button class="btn soft" onClick=${() => setConfirmReset(false)}>Cancel</button>` : html`<button class="btn soft" onClick=${() => setConfirmReset(true)}>Reset sample data</button>`}</div></section>
    </main>
    <${BottomNav} nav=${nav} cur="admin" /></div>`;
}

function ChangePw() {
  const [o, setO] = useState(''), [n, setN] = useState(''), [n2, setN2] = useState(''), [msg, setMsg] = useState('');
  const go = async (e) => { e.preventDefault(); if (!(await app.checkPassword(app.me.id, o))) { setMsg('Your current password is wrong.'); return; } if (n.length < 6) { setMsg('Use at least 6 characters.'); return; } if (n !== n2) { setMsg('The new passwords are not the same.'); return; } if (app.cloud) { if (app.offline) { setMsg('Changing your password needs signal.'); return; } const er = await app.cloud.changePassword(n); if (er) { setMsg(er); return; } } await app.setPassword(app.me.id, n); setO(''); setN(''); setN2(''); setMsg(''); app.toast('Password changed.'); };
  return html`<form class="card" onSubmit=${go}><span class="eyebrow">Change my password</span>
    <label class="f" for="cpo">Current password<input id="cpo" type="password" class="inp" autocomplete="current-password" value=${o} onInput=${(e) => setO(e.target.value)} /></label>
    <label class="f" for="cpn">New password<input id="cpn" type="password" class="inp" autocomplete="new-password" value=${n} onInput=${(e) => setN(e.target.value)} /></label>
    <label class="f" for="cpn2">New password again<input id="cpn2" type="password" class="inp" autocomplete="new-password" value=${n2} onInput=${(e) => setN2(e.target.value)} /></label>
    ${msg && html`<span class="small" style="color:var(--abs-ink);font-weight:600">${msg}</span>`}
    <button class="btn line" type="submit" disabled=${!o || !n}>Change password</button></form>`;
}
/* ================= assembly and sign-off times (office) ================= */
function Times({ nav }) {
  const s = app.school, cur = schoolTimes(s);
  const [days, setDays] = useState(() => JSON.parse(JSON.stringify(cur.days))), [so, setSo] = useState(() => JSON.parse(JSON.stringify(cur.signoff)));
  const setDay = (d, k, v) => { const n = Object.assign({}, days); n[d] = Object.assign({}, n[d], { [k]: v }); setDays(n); };
  const setSoK = (r, k, v) => { const n = Object.assign({}, so); n[r] = Object.assign({}, n[r], { [k]: v }); setSo(n); };
  const save = () => { app.updateSettings({ times: { days, signoff: so, by: app.me.id, at: stamp() }, assembly: days[1].start }); app.toast('Times saved for everyone at ' + s.short + '.'); };
  return html`<div class="app"><${WideBand} nav=${nav} title="Assembly and sign-off times" sub=${s.name + ' · set by the office'} />
    <main class="wide gut content" style="max-width:900px">
      <section class="card"><span class="eyebrow">Morning register, per day</span>
        <span class="small muted">If there is no assembly, teachers take the morning register in class at P1.</span>
        ${[1, 2, 3, 4, 5].map((d) => html`<div style="border-top:1px solid var(--line-soft);padding-top:10px;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center"><b style="min-width:96px">${DOW_LONG[d]}</b>
          <label class="check" style="margin:0"><input type="checkbox" checked=${days[d].held} onChange=${(e) => setDay(d, 'held', e.target.checked)} /><span>${days[d].held ? 'Assembly' : 'No assembly (class at P1)'}</span></label>
          ${[['start', 'Starts'], ['due', 'Due by'], ['chase', 'Chase from']].map(([k, l]) => (k === 'start' && !days[d].held ? null : html`<label class="f" style="flex-direction:row;align-items:center;gap:6px;font-size:13px">${l}<input type="time" class="inp" style="width:auto;min-height:38px" value=${days[d][k]} onInput=${(e) => setDay(d, k, e.target.value)} /></label>`))}</div>`)}</section>
      <section class="card"><span class="eyebrow">Weekly sign-off</span>
        <span class="small muted">Each person gets a reminder in KAT from this day and time.</span>
        ${[['teacher', 'Class teacher', 'this week'], ['smt', 'SMT', 'this week'], ['principal', 'Principal', 'the previous week']].map(([r, l, w]) => html`<div class="row" style="gap:10px;flex-wrap:wrap;align-items:center"><b style="min-width:120px">${l}</b>
          <select class="inp" style="width:auto" value=${so[r].d} onChange=${(e) => setSoK(r, 'd', Number(e.target.value))}>${[1, 2, 3, 4, 5].map((d) => html`<option value=${d}>${DOW_LONG[d]}</option>`)}</select>
          <input type="time" class="inp" style="width:auto" value=${so[r].t} onInput=${(e) => setSoK(r, 't', e.target.value)} /><span class="tiny muted">signs for ${w}</span></div>`)}</section>
      <button class="btn big" onClick=${save}>Save times</button>
      ${cur.by && html`<span class="tiny muted">Last changed by ${staffName(app.db, cur.by)} on ${fmtShort(cur.at.slice(0, 10))} at ${cur.at.slice(11, 16)}.</span>`}
      <span class="tiny muted">For a single day (exams, a sports day), use "Mark as no school day" or change the times here and change them back.</span>
    </main></div>`;
}
/* ================= settings / switch person ================= */
function Settings({ nav }) {
  const me = app.me, n = app.pending();
  return html`<div class="app"><${Band} nav=${nav} noBack=${me.role !== 'teacher'} title="You and this phone" sub=${app.school.name} />
    <main class="col gut content">
      <section class="card"><div class="row"><span class="avatar">${initials(me.name)}</span><span class="grow"><b>${me.name}</b><br /><span class="small muted">${me.code ? 'Symbol ' + me.code + ' · ' : ''}${me.title}${me.registerClass ? ' · register class ' + me.registerClass : ''}</span></span></div>
        <button class="btn line" onClick=${() => { app.signOut(); }}><${Icon} n="swap" s=${18} />Sign out</button>${app.isRemembered(me.id) && html`<button class="linkbtn" onClick=${() => { app.forget(me.id); if (app.cloud) app.cloud.signOut(); app.signOut(); }}>Sign out and forget me on this phone</button>`}</section>
      <${ChangePw} />
      ${app.cloud && html`<section class="card"><span class="eyebrow">Shared with the school</span>
        <span class="small">${app.cloud.ready ? 'Connected. Registers go to the school database and other phones see them within seconds.' : app.cloud.user ? 'Connecting to the school database…' : 'Not connected. Sign out and sign in again with signal to connect.'}</span>
        ${app.cloud.lastSync && html`<span class="tiny muted">Last update ${String(app.cloud.lastSync.getHours()).padStart(2, '0')}:${String(app.cloud.lastSync.getMinutes()).padStart(2, '0')}.</span>`}
        ${app.cloud.err && html`<span class="tiny" style="color:var(--abs-ink)">Problem: ${app.cloud.err}</span>`}</section>`}
      <section class="card"><span class="eyebrow">Signal</span>
        <label class="check"><input type="checkbox" checked=${app.fakeOffline} onChange=${(e) => app.setFakeOffline(e.target.checked)} /><span>Pretend there is no signal<br /><span class="small muted">For testing. Take a register, see it wait on the phone, then switch this off and watch it send.</span></span></label>
        <span class="small">${app.offline ? 'No signal right now.' : 'Online.'} ${n ? n + (n === 1 ? ' register is' : ' registers are') + ' waiting to send.' : 'Nothing waiting to send.'}</span></section>
      ${me.role === 'teacher' && html`<section class="card flat"><button class="list-row" onClick=${() => nav.go('records')}><${Icon} n="search" /><span class="grow"><b>Find attendance records</b></span><${Icon} n="chev" s=${18} /></button><button class="list-row" onClick=${() => nav.go('reasons', {})}><${Icon} n="list" /><span class="grow"><b>Absence reasons for my class</b></span><${Icon} n="chev" s=${18} /></button></section>`}
      ${me.role !== 'teacher' && html`<section class="card flat"><button class="list-row" onClick=${() => nav.go('times')}><${Icon} n="cal" /><span class="grow"><b>Assembly and sign-off times</b><br /><span class="tiny muted">Set by the office</span></span><${Icon} n="chev" s=${18} /></button><button class="list-row" onClick=${() => nav.go('books')}><${Icon} n="book" /><span class="grow"><b>All book lists</b></span><${Icon} n="chev" s=${18} /></button><button class="list-row" onClick=${() => nav.go('find')}><${Icon} n="search" /><span class="grow"><b>Find a learner</b></span><${Icon} n="chev" s=${18} /></button></section>`}
      <section class="card"><div class="row"><${Logo} s=${44} /><span class="grow"><b>KAT ${TENG_VERSION}</b><br /><span class="small muted">Keeping Attendance Today. Test version with made-up learners.</span></span></div></section>
    </main><p class="credit">Developed by KK Lekenyane</p>${me.role !== 'teacher' && html`<${BottomNav} nav=${nav} cur="settings" />`}</div>`;
}

/* ================= change today's lessons (swap, move, cancel, extra, day swap) ================= */
function ChangeSheet({ lesson, lessons, onClose }) {
  const db = app.db, today = todayISO();
  const base = app.getChange(today);
  const [so, setSo] = useState(base.signout || nowHM());
  const ch = { absent: base.absent || undefined, signout: base.signout || undefined, dayAs: base.dayAs || null, moves: (base.moves || []).slice(), cancel: (base.cancel || []).slice(), extra: (base.extra || []).map((e) => Object.assign({}, e)) };
  const [xg, setXg] = useState((myGroups()[0] || {}).id), [xp, setXp] = useState(null);
  const save = (msg) => { app.setChange(today, ch); app.toast(msg); onClose(); };
  const setMove = (l, to) => {
    if (l.extra) { const e = ch.extra.find((x) => x.gid === l.gid && x.p === l.p); if (e) e.p = to; return; }
    ch.moves = ch.moves.filter((m) => !(m.gid === l.gid && m.from === l.orig));
    if (to !== l.orig) ch.moves.push({ gid: l.gid, from: l.orig, to });
  };
  const name = (l) => groupLabel(db.groups.find((g) => g.id === l.gid)) + ' · ' + pLabel(l.p, l.len);
  const same = (a, b) => a && b && a.gid === b.gid && a.p === b.p;
  const taken = (p, len, skip) => lessons.some((o) => !same(o, skip) && p < o.p + o.len && o.p < p + len);
  if (lesson && lesson.gid) {
    const others = lessons.filter((o) => !same(o, lesson));
    return html`<${Sheet} title=${'Change ' + name(lesson)} onClose=${onClose}>
      <span class="small muted">Only for today, ${fmtLong(today)}. Your normal timetable stays as it is.</span>
      ${others.length > 0 && html`<span class="eyebrow">Swap with another of your lessons</span><div class="chips">${others.map((o) => html`<button class="chip" onClick=${() => { const a = lesson.p, b = o.p; setMove(lesson, b); setMove(o, a); save(name(lesson) + ' and ' + name(o) + ' swapped for today.'); }}>${name(o)}</button>`)}</div>`}
      <span class="eyebrow">Move it to</span>
      <div class="chips">${app.bells.map((b) => html`<button class="chip" aria-pressed=${String(b.p === lesson.p)} disabled=${taken(b.p, lesson.len, lesson)} onClick=${() => { setMove(lesson, b.p); save(groupLabel(db.groups.find((g) => g.id === lesson.gid)) + ' moved to ' + pLabel(b.p, lesson.len) + ' for today.'); }}>P${b.p} · ${b.t}</button>`)}</div>
      <div class="wrap">
        <button class="btn soft" onClick=${() => { if (lesson.extra) ch.extra = ch.extra.filter((e) => !(e.gid === lesson.gid && e.p === lesson.p)); else { ch.moves = ch.moves.filter((m) => !(m.gid === lesson.gid && m.from === lesson.orig)); ch.cancel.push({ gid: lesson.gid, from: lesson.orig }); } save(name(lesson) + ' is off for today.'); }}>Not taught today</button>
        ${lesson.moved && html`<button class="btn line" onClick=${() => { setMove(lesson, lesson.orig); save('Back to ' + pLabel(lesson.orig, lesson.len) + '.'); }}>Back to ${pLabel(lesson.orig, lesson.len)}</button>`}
      </div>
    <//>`;
  }
  const xgroup = db.groups.find((g) => g.id === xg);
  return html`<${Sheet} title="Change today" onClose=${onClose}>
    <span class="small muted">For days when the timetable changes. Tap the ⇄ next to a lesson to swap or move just that one.</span>
    <span class="eyebrow">Away from school</span>
    <div class="wrap">
      <button class="btn soft" aria-pressed=${String(!!ch.absent)} onClick=${() => { ch.absent = !base.absent; delete ch.signout; save(ch.absent ? 'You are marked absent today. Your lessons need no register.' : 'You are marked present again.'); }}>${base.absent ? 'I am at school after all' : "I'm absent today"}</button>
    </div>
    <div class="row" style="gap:8px;flex-wrap:wrap"><label class="f" for="so" style="flex-direction:row;align-items:center;gap:8px">Signed out at<input id="so" type="time" class="inp" style="width:auto" value=${so} onInput=${(e) => setSo(e.target.value)} /></label>
      <button class="btn line" disabled=${!so} onClick=${() => { ch.signout = so; delete ch.absent; save('Signed out at ' + so + '. Later lessons show as not held.'); }}>Sign out</button>
      ${base.signout && html`<button class="btn sm soft" onClick=${() => { delete ch.signout; save('Sign-out undone.'); }}>Undo sign-out</button>`}</div>
    <span class="tiny muted">Lessons that start at or after the sign-out time are not held, so they need no register and do not show as missed.</span>
    <span class="eyebrow">Today follows the timetable of</span>
    <div class="chips">${[null, 1, 2, 3, 4, 5].map((d) => html`<button class="chip" aria-pressed=${String((ch.dayAs || null) === d)} onClick=${() => { ch.dayAs = d; ch.moves = []; ch.cancel = []; save(d ? 'Today follows ' + DOW_LONG[d] + "'s timetable." : 'Back to the normal timetable for today.'); }}>${d ? DOW_LONG[d] : 'Normal (' + DOW[dow(today)] + ')'}</button>`)}</div>
    <span class="eyebrow">Add an extra lesson</span>
    <label class="f" for="xg">Class<select id="xg" class="inp" value=${xg} onChange=${(e) => setXg(e.target.value)}>${myGroups().map((g) => html`<option value=${g.id}>${groupTitle(g)}</option>`)}</select></label>
    <div class="chips">${app.bells.map((b) => html`<button class="chip" aria-pressed=${String(xp === b.p)} disabled=${taken(b.p, 1)} onClick=${() => setXp(b.p)}>P${b.p}</button>`)}</div>
    <button class="btn" disabled=${!xp || !xgroup} onClick=${() => { ch.extra.push({ gid: xg, p: xp, len: 1 }); save('Extra ' + groupLabel(xgroup) + ' lesson added at P' + xp + '.'); }}>Add extra lesson</button>
    ${ch.cancel.length > 0 && html`<span class="eyebrow">Off today</span>${ch.cancel.map((c) => html`<div class="between small"><span>${groupLabel(db.groups.find((g) => g.id === c.gid))} · P${c.from}</span><button class="btn sm line" onClick=${() => { ch.cancel = ch.cancel.filter((x) => x !== c); save('Lesson is back on.'); }}>Put back</button></div>`)}`}
    ${(ch.moves.length + ch.cancel.length + ch.extra.length > 0 || ch.dayAs) && html`<button class="btn soft" onClick=${() => { ch.dayAs = null; ch.moves = []; ch.cancel = []; ch.extra = []; save('All of today\'s changes undone.'); }}>Undo all of today's changes</button>`}
  <//>`;
}

/* ================= timetable upload (teacher: my timetable · admin: the whole school) ================= */
function Timetable({ nav, mode }) {
  const db = app.db, me = app.me, school = mode === 'school';
  const [pages, setPages] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const [pick, setPick] = useState(null), [addNew, setAddNew] = useState(true), [done, setDone] = useState(null);
  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setBusy(true); setErr(''); setPages(null);
    const fr = new FileReader();
    fr.onload = async () => {
      try {
        const all = await parseTimetablePdf(new Uint8Array(fr.result));
        const tps = all.filter((p) => p.kind === 'teacher');
        if (!tps.length) { setErr(all.length ? 'This looks like a class (learner) timetable. KAT needs the teacher timetable, where each page is headed "Teacher" and a name.' : 'KAT could not find a timetable in this PDF. It reads the PDFs that aSc Timetables prints, one teacher per page.'); }
        else { setPages(tps); const mine = tps.findIndex((p) => matchStaff(db, p.name) === me); setPick(mine >= 0 ? mine : 0); }
      } catch (x) { setErr('KAT could not read this PDF (' + (x.message || x) + ').'); }
      setBusy(false);
    };
    fr.readAsArrayBuffer(f);
  };
  const page = pages && pick !== null ? pages[pick] : null;
  const groupFor = (uid, l) => db.groups.find((g) => g.teacherId === uid && g.short === l.subject && g.label === l.label);
  const saveMine = () => { const n = app.applyTimetable(me.id, page); setDone({ lessons: page.lessons.length, created: n }); };
  const saveSchool = () => {
    let teachers = 0, created = 0, added = 0;
    pages.forEach((p) => {
      let st = matchStaff(db, p.name);
      if (!st && addNew) { st = app.addStaffQuiet({ name: titleCase(p.name), code: symbolGuess(p.name), short: titleCase(p.name), title: 'Teacher', role: 'teacher', registerClass: null, dhGrade: null }); added++; }
      if (!st) return;
      if (!st.code) st.code = symbolGuess(p.name);
      teachers++; created += app.applyTimetable(st.id, p);
    });
    setDone({ teachers, created, added });
  };
  if (done) return html`<div class="app"><${Band} nav=${nav} title="Timetable saved" sub=${school ? 'Whole school' : me.name} /><main class="col gut content"><section class="card">
    <div class="boxnote ok"><span>${school ? html`<strong>${done.teachers} teachers</strong> now have their lessons in KAT${done.added ? ', including ' + done.added + ' new staff members' : ''}. ${done.created} subject classes were set up. Each teacher still adds class lists for their classes.` : html`<strong>${done.lessons} lessons</strong> a week are now under "Period register".${done.created ? ' ' + done.created + ' classes are new, so add their class lists when you open them.' : ''}`} The bell times now match the timetable.</span></div>
    <button class="btn big" onClick=${() => nav.reset(me.role === 'teacher' ? 'home' : 'office')}>Done</button></section></main></div>`;
  const grid = (p, uid) => html`<div class="tablebox"><table class="t"><thead><tr><th>Day</th><th>Lessons</th></tr></thead><tbody>${[1, 2, 3, 4, 5].map((d) => html`<tr><td><b>${DOW[d]}</b></td><td><div class="wrap">${p.lessons.filter((l) => l.d === d).map((l) => { const g = uid && groupFor(uid, l); return html`<span class=${'pill ' + (g ? (g.learners.length ? 'ok' : 'wait') : 'info')} title=${g ? (g.learners.length ? g.learners.length + ' learners' : 'class list still needed') : 'new class'}>${pLabel(l.p, l.len)} ${l.subject} ${l.label}</span>`; })}</div></td></tr>`)}</tbody></table></div>`;
  const uniq = page ? [...new Set(page.lessons.map((l) => l.subject + '|' + l.label))] : [];
  return html`<div class="app"><${Band} nav=${nav} title=${school ? 'Upload school timetable' : 'Upload my timetable'} sub="The PDF from aSc Timetables, one teacher per page" />
    <main class="col gut content">
      <section class="card">
        <label class="btn big" for="ttf" style="cursor:pointer"><${Icon} n="file" s=${20} />${pages ? 'Choose a different PDF' : 'Choose the timetable PDF'}</label>
        <input id="ttf" type="file" accept="application/pdf,.pdf" style="position:absolute;width:1px;height:1px;opacity:0" onChange=${onFile} />
        <span class="small muted" style="text-align:center">Use the <b>teacher</b> timetable${school ? ' with every teacher in it' : ' (the whole school file is fine, KAT finds your page)'}.</span>
        ${busy && html`<span class="small">Reading the timetable…</span>`}
        ${err && html`<div class="boxnote red"><span>${err}</span></div>`}
      </section>
      ${page && !school && html`<section class="card">
        <label class="f" for="ttp">Whose timetable<select id="ttp" class="inp" value=${pick} onChange=${(e) => setPick(Number(e.target.value))}>${pages.map((p, i) => html`<option value=${i}>${p.name}${matchStaff(db, p.name) === me ? ' (you)' : ''}</option>`)}</select></label>
        ${matchStaff(db, page.name) !== me && html`<div class="boxnote warn"><span>This page is for ${page.name}, not ${me.name}. Check you picked the right one.</span></div>`}
        <b>${page.lessons.length} lessons a week in ${uniq.length} classes</b>
        ${grid(page, me.id)}
        <div class="legend"><span><i class="dot" style="background:var(--ok-fg)"></i>Matches a class you have</span><span><i class="dot" style="background:var(--wait-dot)"></i>Class list still needed</span><span><i class="dot" style="background:var(--info-fg)"></i>New class</span></div>
        <span class="small muted">Bell times from the PDF: ${page.bells.length} periods, ${page.bells[0].t} to ${page.bells[page.bells.length - 1].e}${page.brk ? ', break ' + page.brk.t + ' to ' + page.brk.e : ''}. A lesson over two periods (like P4–5) is one register.</span>
        <button class="btn big" onClick=${saveMine}>Use this timetable</button>
      </section>`}
      ${pages && school && html`<section class="card">
        <b>${pages.length} teachers found</b>
        <div class="tablebox" style="max-height:50vh;overflow:auto"><table class="t"><thead><tr><th>Timetable</th><th>In KAT</th><th>Lessons</th></tr></thead><tbody>${pages.map((p) => { const st = matchStaff(db, p.name); return html`<tr><td><b>${p.name}</b><br /><span class="tiny muted">${[...new Set(p.lessons.map((l) => l.subject))].join(', ')}</span></td><td>${st ? html`${st.name}${st.code ? html` <b>(${st.code})</b>` : ''}` : html`<span class="pill wait">New · ${symbolGuess(p.name)}</span>`}</td><td class="n">${p.lessons.length}</td></tr>`; })}</tbody></table></div>
        ${pages.some((p) => !matchStaff(db, p.name)) && html`<label class="check"><input type="checkbox" checked=${addNew} onChange=${(e) => setAddNew(e.target.checked)} /><span>Add the ${pages.filter((p) => !matchStaff(db, p.name)).length} teachers who are not in KAT yet as staff</span></label>`}
        <button class="btn big" onClick=${saveSchool}>Use this timetable for the school</button>
      </section>`}
      ${!pages && html`<section class="card"><span class="eyebrow">What KAT reads</span>
        <span class="small">Each page headed <b>Teacher</b> and a name, with periods across the top and Mo to Fr down the side.</span>
        <span class="small">In each block, the small code (NS, LO) is the subject and the big one (8E, 10) is the class. A block over two periods is one lesson.</span>
        <span class="small">After that, the ⇄ button next to a lesson swaps or moves it for one day without changing the timetable.</span></section>`}
    </main></div>`;
}

/* ================= router ================= */
const SCREENS = { home: Home, register: Register, cover: Cover, period: Period, reasons: Reasons, upload: Upload, incidents: Incidents, 'incident-new': IncidentNew, books: Books, 'book-new': BookNew, book: Book, find: Find, learner: Learner, print: PrintLists, office: Office, capture: Capture, records: Records, admin: AdminHub, schoolset: Admin, staff: Staff, learners: Learners, classes: Classes, yearend: YearEnd, settings: Settings, timetable: Timetable, missed: Missed, times: Times };
function Root() {
  const [, force] = useState(0);
  useEffect(() => app.subscribe(() => force((x) => x + 1)), []);
  const me = app.db && app.me;
  const start = me ? (me.role === 'teacher' ? 'home' : 'office') : null;
  const [stack, setStack] = useState([]);
  const sig = (app.session.schoolId || '') + ':' + (app.session.userId || '');
  const lastSig = useRef(sig);
  useEffect(() => { if (lastSig.current !== sig) { lastSig.current = sig; setStack([]); } }, [sig]);
  useEffect(() => { const c = app.db ? app.school.colors : SCHOOLS[0].colors; const r = document.documentElement.style; r.setProperty('--primary', c.primary); r.setProperty('--accent', c.accent); r.setProperty('--red', c.red); });
  if (app.cloud && app.cloud.dev) return html`<${Developer} /><${Toast} />`;
  if (!me) return html`<${Welcome} /><${Toast} />`;
  const cur = stack.length ? stack[stack.length - 1] : { name: start, params: {} };
  const nav = {
    go: (name, params) => { setStack(stack.concat([{ name, params: params || {}, k: Date.now() }])); window.scrollTo(0, 0); },
    replace: (name, params) => { setStack(stack.slice(0, -1).concat([{ name, params: params || {}, k: Date.now() }])); window.scrollTo(0, 0); },
    reset: (name, params) => { setStack(name === start ? [] : [{ name, params: params || {}, k: Date.now() }]); window.scrollTo(0, 0); },
    back: () => { setStack(stack.slice(0, -1)); window.scrollTo(0, 0); }
  };
  const S = SCREENS[cur.name] || Home;
  return html`<${S} key=${cur.name + (cur.k || '')} nav=${nav} ...${cur.params} /><${Toast} />`;
}
const mount = document.getElementById('teng'); mount.textContent = ''; render(html`<${Root} />`, mount);
