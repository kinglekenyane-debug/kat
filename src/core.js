/* ===== KAT core: school configuration, dates, sample data and the data store ===== */
const TENG_VERSION = '1.0 test';
const DATA_VERSION = 7;

/* ---- Schools. Each school has its own data space, name, crest and colours. ---- */
const PLACEHOLDER_REASONS = [
  'Illness', 'Funeral or death in the family', 'Family responsibility', 'Transport problem',
  'Bad weather', 'Religious or cultural event', 'School activity elsewhere', 'Suspended',
  'No reason given (parent contacted)'
];
const BELLS = [
  { p: 1, t: '07:55', e: '08:40' }, { p: 2, t: '08:40', e: '09:25' }, { p: 3, t: '09:25', e: '10:10' },
  { p: 4, t: '10:15', e: '11:00' }, { p: 5, t: '11:00', e: '11:45' }, { p: 6, t: '12:05', e: '12:50' },
  { p: 7, t: '12:50', e: '13:35' }
];
const BELLS_FICKS = [
  { p: 1, t: '07:30', e: '08:05' }, { p: 2, t: '08:05', e: '08:31' }, { p: 3, t: '08:31', e: '08:57' }, { p: 4, t: '08:57', e: '09:23' },
  { p: 5, t: '09:23', e: '09:50' }, { p: 6, t: '09:50', e: '10:17' }, { p: 7, t: '10:17', e: '10:43' }, { p: 8, t: '10:43', e: '11:10' },
  { p: 9, t: '11:40', e: '12:10' }, { p: 10, t: '12:10', e: '12:40' }, { p: 11, t: '12:40', e: '13:10' }, { p: 12, t: '13:10', e: '13:40' }
];
// King's lessons as read from the school's 2026 teacher timetable (aSc), day 1 = Monday
const KING_TT = 'NS|8E|1|2|1 SES|10|1|4|2 SES|12|1|8|1 SES|11|1|9|2 LO|12|1|11|1 NS|8D|1|12|1 SES|10|2|1|2 SES|12|2|5|2 LO|10|2|7|1 NS|8E|2|8|1 SES|11|2|9|2 NS|8D|2|12|1 NS|8D|3|1|1 NS|8E|3|4|1 LO|11|3|5|1 LO|10|3|6|1 SES|11|3|7|2 SES|12|3|9|2 SES|10|3|11|2 NS|8E|4|1|2 SES|10|4|3|2 LO|12|4|5|1 SES|11|4|7|2 NS|8D|4|9|1 SES|12|4|11|2 SES|12|5|1|2 SES|11|5|3|1 LO|11|5|4|1 NS|8E|5|5|1 SES|10|5|6|1 NS|8D|5|9|2'
  .split(' ').map((x) => { const [s, l, d, p, len] = x.split('|'); return { s, l, d: +d, p: +p, len: +len }; });
const SUBJECT_NAMES = { NS: 'Natural Sciences', LO: 'Life Orientation', SES: 'Sesotho', GEO: 'Geography', MATHS: 'Mathematics', 'ENG HL': 'English Home Language', 'ENG FAL': 'English First Additional Language', 'AFR HT': 'Afrikaans Huistaal', 'AFR EAT': 'Afrikaans Eerste Addisionele Taal', LS: 'Life Sciences', PHYS: 'Physical Sciences', ACC: 'Accounting', BUS: 'Business Studies', HIST: 'History', ML: 'Mathematical Literacy', TOUR: 'Tourism', CAT: 'Computer Applications Technology', EGD: 'Engineering Graphics and Design', AGRIC: 'Agricultural Sciences', CONS: 'Consumer Studies' };
const TERMS_2026 = [
  { n: 1, from: '2026-01-14', to: '2026-03-27' }, { n: 2, from: '2026-04-08', to: '2026-06-26' },
  { n: 3, from: '2026-07-21', to: '2026-10-02' }, { n: 4, from: '2026-10-13', to: '2026-12-09' }
];
const HOLIDAYS_2026 = ['2026-01-01', '2026-03-21', '2026-04-03', '2026-04-06', '2026-04-27', '2026-05-01', '2026-06-16', '2026-08-10', '2026-09-24', '2026-12-16', '2026-12-25', '2026-12-26'];

const SAMPLE_CREST = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 6 L88 18 V50 C88 74 70 88 50 95 C30 88 12 74 12 50 V18 Z" fill="#0F6B4F"/><text x="50" y="62" text-anchor="middle" font-family="Arial" font-weight="700" font-size="34" fill="#E8A33D">SS</text></svg>');

const SCHOOLS = [
  {
    id: 'ficksburg', name: 'Ficksburg High School', local: 'Hoërskool Ficksburg', short: 'Ficksburg High',
    motto: 'Iuncta Iuvant', crest: '__CREST__',
    colors: { primary: '#12329A', accent: '#F2C024', red: '#C8102E' },
    grades: [8, 9, 10, 11, 12], letters: ['A', 'B', 'C', 'D', 'E'], assembly: '07:30', bells: BELLS_FICKS, brk: { t: '11:10', e: '11:40', after: 8 },
    sample: 'ficksburg'
  },
  {
    id: 'sample', name: 'Sample Secondary School', local: '', short: 'Sample Secondary',
    motto: 'A second school, to show that each school is kept apart', crest: SAMPLE_CREST,
    colors: { primary: '#0F6B4F', accent: '#E8A33D', red: '#B3261E' },
    grades: [8, 9, 10, 11, 12], letters: ['A', 'B'], assembly: '07:40',
    sample: 'generic'
  }
];

/* ---- dates (all dates are local 'YYYY-MM-DD' strings) ---- */
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const todayISO = () => iso(new Date());
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MON_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dow = (s) => parse(s).getDay();
const fmtShort = (s) => { const d = parse(s); return DOW[d.getDay()] + ' ' + d.getDate() + ' ' + MON[d.getMonth()]; };
const fmtLong = (s) => { const d = parse(s); return DOW_LONG[d.getDay()] + ', ' + d.getDate() + ' ' + MON_LONG[d.getMonth()] + ' ' + d.getFullYear(); };
const fmtDMY = (s) => { if (!s) return ''; const [y, m, d] = s.split('-'); return d + '/' + m + '/' + y; };
const nowHM = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const stamp = () => todayISO() + ' ' + nowHM();
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const monthKey = (s) => s.slice(0, 7);

function cal(school) { return school.calendar || { terms: TERMS_2026, holidays: HOLIDAYS_2026 }; }
function inTerm(school, s) { return cal(school).terms.some((t) => s >= t.from && s <= t.to); }
function termOf(school, s) {
  const ts = cal(school).terms; const t = ts.find((x) => s >= x.from && s <= x.to);
  if (t) return t.n;
  const next = ts.find((x) => s < x.from); return next ? Math.max(1, next.n - 1) : 4;
}
function isSchoolDay(school, s) {
  const w = dow(s);
  return w !== 0 && w !== 6 && inTerm(school, s) && !cal(school).holidays.includes(s) && !(school.noSchool && school.noSchool[s]);
}
function schoolDays(school, from, to) {
  const out = []; let s = from;
  while (s <= to) { if (isSchoolDay(school, s)) out.push(s); s = addDays(s, 1); }
  return out;
}
function prevSchoolDays(school, s, n) {
  const out = []; let d = s;
  for (let i = 0; i < 400 && out.length < n; i++) { if (isSchoolDay(school, d)) out.push(d); d = addDays(d, -1); }
  return out;
}
function schoolDaysSince(school, from, to) { return Math.max(0, schoolDays(school, from, to).length - 1); }

/* ---- deterministic random for sample data ---- */
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const F_NAMES = ['Lerato', 'Palesa', 'Naledi', 'Refilwe', 'Lindiwe', 'Zanele', 'Nthabiseng', 'Dineo', 'Amahle', 'Rethabile', 'Busisiwe', 'Puleng', 'Nomvula', 'Masego', 'Thandeka', 'Reabetswe', 'Lesego', 'Boitumelo', 'Anika', 'Chantel', 'Elani', 'Fatima', 'Precious', 'Kgomotso', 'Mathabo', 'Nosipho', 'Bonolo', 'Khanyisile', 'Tlotliso', 'Mamello', 'Liteboho', 'Ayanda', 'Zinhle', 'Mpho', 'Karabo', 'Hlompho'];
const M_NAMES = ['Thabo', 'Sipho', 'Kagiso', 'Tumelo', 'Bongani', 'Tshepo', 'Lebohang', 'Kamogelo', 'Neo', 'Sello', 'Teboho', 'Katlego', 'Itumeleng', 'Sibusiso', 'Lwazi', 'Mosa', 'Kabelo', 'Thato', 'Lethabo', 'Njabulo', 'Kgotso', 'Tiisetso', 'Ruan', 'Pieter', 'Johan', 'Yusuf', 'Siyabonga', 'Thabang', 'Kopano', 'Rorisang', 'Tebello', 'Motheo', 'Retshepile', 'Bokang'];
const SURNAMES = ['Mokoena', 'Nkosi', 'Dlamini', 'Molefe', 'Khumalo', 'Sithole', 'Mahlangu', 'Ndlovu', 'Mofokeng', 'Radebe', 'Zulu', 'Tau', 'Motaung', 'Letsie', 'Mabena', 'Shabalala', 'Nhlapo', 'Moloi', 'Phiri', 'Ramoeletsi', 'Botha', 'Van Wyk', 'Nel', 'Adams', 'Jacobs', 'Mohale', 'Makhetha', 'Seboko', 'Theko', 'Lebona', 'Ntsane', 'Mosia', 'Tsotetsi', 'Mokhele', 'Hlalele', 'Lekhooa', 'Ramohlabi', 'Sefako', 'Moeketsi', 'Masoabi', 'Du Plessis', 'Kotze'];

// staff symbols as the school uses them: surname initial + first-name initial (Lekenyane King = LK)
function symbolGuess(name) {
  const w = (name || '').replace(/^(MR|MRS|MS|DR|MISS)\.?\s+/i, '').replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean);
  if (!w.length) return '';
  // "Ms N. Radebe" → initial first, surname last · "LEKENYANE K" (aSc) → surname first
  const firstIsInitial = w[0].length === 1 || (w.length > 1 && w[0] === w[0].toUpperCase() && w[0].length <= 3 && w[w.length - 1] !== w[w.length - 1].toUpperCase());
  const sur = firstIsInitial ? w[w.length - 1] : w[0], first = firstIsInitial ? w[0] : w[1] || '';
  return (sur[0] + (first[0] || '')).toUpperCase();
}
// symbols must be unique so sign-in finds one person: on a clash, use two surname letters (Mahase P = MAP), then a number
function uniqueSymbols(db) {
  const used = new Set(); const order = db.staff.slice().sort((a, b) => (a.role === 'teacher' ? 0 : 1) - (b.role === 'teacher' ? 0 : 1));
  order.forEach((x) => {
    let c = (x.code || symbolGuess(x.name)).toUpperCase();
    if (used.has(c)) { const g = symbolGuess(x.name); const w = (x.name || '').replace(/^(MR|MRS|MS|DR|MISS)\.?\s+/i, '').replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean); const sur = w.find((q) => q.length > 1 && q[0] === g[0]) || ''; const alt = (sur.slice(0, 2) + g.slice(1)).toUpperCase(); c = used.has(alt) ? c : alt; let n = 2; while (used.has(c)) c = g + n++; }
    x.code = c; used.add(c);
  });
}
const FICKS_TEACHERS = ['Ms N. Radebe', 'Mr S. Khumalo', 'Mrs L. Sithole', 'Mr T. Mofokeng', 'Ms R. Ndlovu', 'Mr K. Molefe', 'Mrs Z. Mahlangu', 'Ms L. Els', 'Mr B. Zulu', 'Ms A. Dlamini', 'Mrs M. Motaung', 'Ms K. Tau', 'KING', 'Mr J. Letsie', 'Mrs P. Mabena', 'Mr L. Shabalala', 'Ms P. Nhlapo', 'Mrs T. Nkosi', 'Mr S. Phiri', 'Ms D. Mokoena', 'Mrs B. Ramoeletsi', 'Mr N. Radebe', 'Ms L. Khumalo', 'Mr M. Sithole', 'Mrs D. Moloi'];

/* ---- sample data ---- */
function generateSample(school, today) {
  const R = rng(school.id === 'ficksburg' ? 20261118 : 777);
  const pick = (arr) => arr[Math.floor(R() * arr.length)];
  const db = {
    v: DATA_VERSION, schoolId: school.id, createdFor: today,
    settings: {}, staff: [], classes: [], learners: {}, groups: [], registers: {}, reasons: {}, captured: {},
    incidents: [], books: [], log: [], changes: {}
  };
  const ficks = school.sample === 'ficksburg';
  // staff and register classes
  let idx = 0;
  school.grades.forEach((g) => {
    school.letters.forEach((c) => {
      const id = g + c;
      let name = ficks ? FICKS_TEACHERS[idx] : (pick(['Mr', 'Ms', 'Mrs']) + ' ' + pick('ABDKLMNPST'.split('')) + '. ' + pick(SURNAMES));
      const sid = 'st' + (idx + 1);
      if (name === 'KING') {
        db.staff.push({ id: 'king', name: 'KK Lekenyane', code: 'LK', short: 'King', title: 'Teacher', role: 'teacher', registerClass: id, dhGrade: null });
        db.classes.push({ id, grade: g, teacherId: 'king' });
      } else {
        db.staff.push({ id: sid, name, code: symbolGuess(name), short: name, title: 'Teacher', role: 'teacher', registerClass: id, dhGrade: (ficks && idx === 0) ? 8 : null });
        db.classes.push({ id, grade: g, teacherId: sid });
      }
      idx++;
    });
  });
  if (ficks) {
    db.staff.find((s) => s.id === 'st1').title = 'Teacher · Grade 8 head of department';
    db.staff.push({ id: 'office1', name: 'Mrs E. Pretorius', short: 'Mrs Pretorius', title: 'Office secretary', role: 'office', registerClass: null, dhGrade: null });
    db.staff.push({ id: 'admin1', name: 'Johan Hanekom', short: 'Mr Hanekom', code: 'HJ', title: 'Principal', role: 'admin', principal: true, registerClass: null, dhGrade: null });
    db.staff.push({ id: 'admin2', name: 'Jan-Adriaan Swanepoel', short: 'Mr Swanepoel', code: 'SJ', title: 'Deputy Principal', role: 'admin', principal: true, registerClass: null, dhGrade: null });
    db.staff.push({ id: 'admin3', name: 'Marnel Pelser', short: 'Marnel Pelser', code: 'PM', title: 'Deputy Principal', role: 'admin', principal: true, registerClass: null, dhGrade: null });
  } else {
    db.staff[0].dhGrade = 8; db.staff[0].title = 'Teacher · Grade 8 head of department';
    db.staff.push({ id: 'office1', name: 'Ms T. Office', short: 'Ms Office', title: 'Office secretary', role: 'office', registerClass: null, dhGrade: null });
    db.staff.push({ id: 'admin1', name: 'Mr A. Admin', short: 'Mr Admin', title: 'Principal', role: 'admin', registerClass: null, dhGrade: null });
  }
  // learners
  const used = new Set();
  db.classes.forEach((c, ci) => {
    const n = ficks ? 34 + ((ci * 5) % 9) : 26 + (ci % 5);
    const accBase = (ficks ? 726000 : 516000) - (c.grade - 8) * 1000;
    for (let i = 0; i < n; i++) {
      const female = R() < 0.52;
      let first, sur, key;
      do { first = pick(female ? F_NAMES : M_NAMES); sur = pick(SURNAMES); key = first + sur + c.id; } while (used.has(key));
      used.add(key);
      const acc = String(accBase + 100 + ci * 50 + i);
      const by = 2026 - c.grade - 6;
      db.learners[acc] = {
        acc, surname: sur, first, gender: female ? 'F' : 'M',
        dob: by + '-' + pad(1 + Math.floor(R() * 12)) + '-' + pad(1 + Math.floor(R() * 28)),
        regDate: (2026 - (c.grade - 8)) + '-01-14', archiveDate: null, cls: c.id
      };
    }
  });
  const byClass = {};
  Object.values(db.learners).forEach((l) => { (byClass[l.cls] = byClass[l.cls] || []).push(l.acc); });

  // King's subject classes (Ficksburg) or a few generic groups
  if (ficks) {
    const mkg = (code, label, learners) => ({ id: 'g-' + code.toLowerCase() + label.toLowerCase(), subject: SUBJECT_NAMES[code] || code, short: code, grade: parseInt(label, 10), label, teacherId: 'king', learners, slots: KING_TT.filter((x) => x.s === code && x.l === label).map((x) => ({ d: x.d, p: x.p, len: x.len })) });
    db.groups.push(mkg('NS', '8E', byClass['8E'].slice()), mkg('NS', '8D', byClass['8D'].slice()), mkg('LO', '10', byClass['10A'].slice()), mkg('LO', '11', []), mkg('LO', '12', []), mkg('SES', '10', []), mkg('SES', '11', []), mkg('SES', '12', []));
    db.groups.push({ id: 'g-ma8a', subject: 'Mathematics', short: 'MATHS', grade: 8, label: '8A', teacherId: 'st1', learners: byClass['8A'].slice(), slots: [{ d: 1, p: 1, len: 2 }, { d: 2, p: 3, len: 2 }, { d: 3, p: 1, len: 2 }, { d: 4, p: 5, len: 2 }, { d: 5, p: 3, len: 2 }] });
  } else {
    db.groups.push({ id: 'g-en8a', subject: 'English', short: 'EN', grade: 8, label: '8A', teacherId: 'st1', learners: byClass['8A'].slice(), slots: [{ d: 1, p: 1 }, { d: 3, p: 2 }, { d: 5, p: 3 }] });
  }

  // history: morning registers from start of term 4 (or 30 days back) until yesterday
  const start = (() => { const t = cal(school).terms.find((x) => today >= x.from && today <= x.to); const back = addDays(today, -42); return t && t.from > back ? t.from : back; })();
  const pastDays = schoolDays(school, start, addDays(today, -1));
  const teacherOf = (cid) => db.classes.find((c) => c.id === cid).teacherId;
  const chronic = {}; // acc -> number of school days absent in a row up to today
  const allAcc = Object.keys(db.learners);
  [5, 4, 3, 3].forEach((n) => { chronic[pick(allAcc)] = n; });
  const recent = prevSchoolDays(school, today, 6); // today first
  const isChronicAbsent = (acc, day) => { const n = chronic[acc]; if (!n) return false; const i = recent.indexOf(day); return i >= 0 && i < n; };
  const todaySchool = isSchoolDay(school, today);
  const daysToFill = pastDays.concat(todaySchool ? [today] : []);
  const kingCls = ficks ? '10C' : null;
  const todayStatus = ficks ? { '8D': 'none', '11B': 'wait', '12E': 'none', '10C': 'none' } : { '9B': 'none' };
  daysToFill.forEach((day) => {
    db.classes.forEach((c) => {
      const isToday = day === today;
      const st = isToday ? (todayStatus[c.id] || 'in') : 'in';
      if (st === 'none') return;
      const marks = {};
      byClass[c.id].forEach((acc) => {
        if (isChronicAbsent(acc, day)) { marks[acc] = 'A'; return; }
        const r = R();
        if (r < 0.035) marks[acc] = 'A'; else if (r < 0.055) marks[acc] = 'L';
      });
      const h = 7 + (R() < 0.8 ? 0 : 1), m = h === 7 ? 31 + Math.floor(R() * 25) : Math.floor(R() * 10);
      const rec = { kind: 'm', ref: c.id, date: day, period: 0, marks, by: teacherOf(c.id), coverFor: null, at: day + ' ' + pad(h) + ':' + pad(m), synced: st !== 'wait' };
      if (ficks && isToday && c.id === '9B') { rec.by = 'st1'; rec.coverFor = teacherOf('9B'); }
      db.registers[regKey('m', c.id, day, 0)] = rec;
      Object.keys(marks).forEach((acc) => {
        if (marks[acc] !== 'A') return;
        const age = schoolDaysSince(school, day, today);
        let code = null;
        const p = c.id === kingCls ? 1 : age >= 4 ? 0.8 : age >= 1 ? 0.35 : 0.25;
        if (!isChronicAbsent(acc, day) && R() < p) code = pick(PLACEHOLDER_REASONS.slice(0, 7));
        db.reasons[acc + '|' + day] = { code, note: '', at: code ? day + ' 14:10' : null, by: code ? teacherOf(c.id) : null };
        if (!isToday) db.captured[acc + '|' + day] = { at: day + ' 10:30', reasonAtCapture: code };
      });
    });
  });
  // make sure King's class has some open reasons for the follow-up demo
  if (ficks) {
    const k = byClass['10C'];
    [0, 1, 3].forEach((back, i) => {
      const day = recent[back + (todaySchool ? 1 : 0)]; if (!day || day < start) return;
      const acc = k[(i * 7 + 3) % k.length];
      const rec = db.registers[regKey('m', '10C', day, 0)]; if (!rec) return;
      rec.marks[acc] = 'A';
      db.reasons[acc + '|' + day] = { code: null, note: '', at: null, by: null };
      db.captured[acc + '|' + day] = { at: day + ' 10:30', reasonAtCapture: null };
    });
  }
  // period registers for subject groups, history up to yesterday
  db.groups.forEach((g) => {
    pastDays.forEach((day) => {
      g.slots.filter((s) => s.d === dow(day)).forEach((s) => {
        const marks = {};
        g.learners.forEach((acc) => {
          const l = db.learners[acc];
          const mr = db.registers[regKey('m', l.cls, day, 0)];
          const mm = mr && mr.marks[acc];
          if (mm === 'A') marks[acc] = 'A'; else if (R() < 0.015) marks[acc] = 'A'; else if (R() < 0.01) marks[acc] = 'L';
        });
        db.registers[regKey('p', g.id, day, s.p)] = { kind: 'p', ref: g.id, date: day, period: s.p, marks, by: g.teacherId, coverFor: null, at: day + ' 09:00', synced: true };
      });
    });
  });
  // a couple of covered registers in the past, so printed registers show the covering teacher's symbol
  if (ficks) {
    const back = prevSchoolDays(school, addDays(today, -1), 6);
    const m10c = back[4] && db.registers[regKey('m', '10C', back[4], 0)]; if (m10c) { m10c.by = 'st1'; m10c.coverFor = 'king'; }
    const g8d = db.groups.find((g) => g.id === 'g-ns8d');
    const d8 = back.find((d) => g8d.slots.some((x) => x.d === dow(d)));
    if (d8) g8d.slots.filter((x) => x.d === dow(d8)).forEach((x) => { const r = db.registers[regKey('p', g8d.id, d8, x.p)]; if (r) { r.by = 'st1'; r.coverFor = 'king'; } });
  }
  // leave one recent lesson of King's without a register, to show the "not taken" reminder
  if (ficks) {
    const y = prevSchoolDays(school, addDays(today, -1), 1)[0];
    const miss = y && db.groups.filter((g) => g.teacherId === 'king' && g.learners.length).map((g) => ({ g, s: g.slots.find((x) => x.d === dow(y)) })).find((x) => x.s);
    if (miss) delete db.registers[regKey('p', miss.g.id, y, miss.s.p)];
  }
  // incidents
  if (ficks) {
    const lo = db.groups.find((g) => g.id === 'g-lo10').learners;
    const k = byClass['10C'], ns = byClass['8D'];
    const mk = (acc, type, back, note, where, extra) => { const day = prevSchoolDays(school, addDays(today, -1), back + 1)[back] || today; db.incidents.push(Object.assign({ id: 'i' + db.incidents.length, acc, type, date: day, note, where, by: 'king', share: true, at: day + ' 13:00' }, extra || {})); };
    mk(k[2], 'Detention', 3, 'Homework not done, third time this term.', 'LO 10', { detention: { date: addDays(today, 2), time: '14:00' } });
    mk(lo[4], 'Merit', 4, 'Led the group presentation on careers.', 'LO 10');
    mk(k[5], 'Uniform', 5, 'No school blazer, second reminder.', 'Morning register');
    mk(ns[8], 'Behaviour', 6, 'Disrupting class after two warnings. Parent phoned.', 'NS 8D');
    mk(lo[11], 'Homework', 8, 'Assignment 3 not handed in.', 'LO 10');
    mk(ns[3], 'Merit', 2, 'Best practical write-up in the class.', 'NS 8D');
    db.incidents.push({ id: 'i9', acc: byClass['9A'][1], type: 'Detention', date: prevSchoolDays(school, addDays(today, -1), 2)[1] || today, note: 'Late for class three times this week.', where: 'MA 9A', by: 'st6', share: true, at: today + ' 08:00', detention: { date: addDays(today, 1), time: '14:00' } });
    // LO grade 10 book list
    const items = lo.map((acc, i) => ({ acc, no: 'LO:' + pad(100 + i * 3 % 60).padStart(3, '0'), signed: '2026-01-' + pad(20 + (i % 3)), t2: 'Y', t3: i === 6 || i === 17 ? 'M' : (i === 25 ? null : 'Y'), returned: null }));
    db.books.push({ id: 'b-lo10', subject: 'Life Orientation', grade: 10, groupId: 'g-lo10', teacherId: 'king', year: 2026, title: 'Life Orientation Grade 10 (Focus)', items });
  }
  // staff sign-in history: most staff arrive between 06:45 and 07:20; today some have not signed in yet
  const sr = rng(4242); db.changes = db.changes || {};
  prevSchoolDays(school, today, 20).forEach((d) => db.staff.forEach((p) => {
    if (p.id === 'king') return;
    const k = p.id + '|' + d; const ch = db.changes[k] || {}; if (ch.absent) return;
    const x = sr(); if (d === today && x < 0.04) { db.changes[k] = Object.assign(ch, { absent: true }); return; }
    if (d === today && x > 0.8) return;
    ch.signin = addMin('06:45', Math.floor(sr() * (x > 0.93 ? 55 : 33))); db.changes[k] = ch;
  }));
  return db;
}
function regKey(kind, ref, date, period) { return kind + '|' + ref + '|' + date + '|' + (period || 0); }

/* ---- the data store: keeps everything on this phone first, sends when there is signal ---- */
const LS = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
};
const MEM = {};

class Store {
  constructor() {
    this.subs = new Set();
    this.session = LS.get('teng:session') || {};
    this.fakeOffline = !!LS.get('teng:fakeOffline');
    this.realOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    this.toastMsg = null;
    this.db = null;
    if (this.session.schoolId) this.loadSchool(this.session.schoolId);
    window.addEventListener('online', () => { this.realOffline = false; this.flush(); this.emit(); });
    window.addEventListener('offline', () => { this.realOffline = true; this.emit(); });
  }
  get offline() { return this.fakeOffline || this.realOffline; }
  emit() { this.subs.forEach((f) => f()); }
  subscribe(f) { this.subs.add(f); return () => this.subs.delete(f); }
  key(id) { return 'teng:data:' + id; }
  loadSchool(id) {
    const school = SCHOOLS.find((s) => s.id === id); if (!school) return;
    let db = LS.get(this.key(id)) || MEM[id];
    if (!db || db.v !== DATA_VERSION) { db = generateSample(school, todayISO()); }
    // every staff member needs a symbol to sign in (older data and the office/principal samples had none)
    uniqueSymbols(db);
    this.db = db; this.persist();
  }
  persist() { if (!this.db) return; if (!LS.set(this.key(this.db.schoolId), this.db)) MEM[this.db.schoolId] = this.db; }
  commit() { this.persist(); this.emit(); }
  toast(msg) { this.toastMsg = msg; this.emit(); clearTimeout(this._tt); this._tt = setTimeout(() => { this.toastMsg = null; this.emit(); }, 3400); }

  get school() {
    const base = SCHOOLS.find((s) => s.id === (this.db && this.db.schoolId)) || SCHOOLS[0];
    const st = (this.db && this.db.settings) || {};
    return Object.assign({}, base, st, { colors: Object.assign({}, base.colors, st.colors || {}) });
  }
  get me() { return this.db && this.db.staff.find((s) => s.id === this.session.userId); }
  get reasonsList() { return (this.db.settings.reasons && this.db.settings.reasons.length) ? this.db.settings.reasons : PLACEHOLDER_REASONS; }
  get bells() { return this.db.settings.bells || this.school.bells || BELLS; }
  get brk() { return this.db.settings.brk || this.school.brk || null; }
  bellRange(p, len) { const b = this.bells; const a = b.find((x) => x.p === p) || {}; const z = b.find((x) => x.p === p + (len || 1) - 1) || a; return (a.t || '') + ' – ' + (z.e || ''); }
  // per-day changes to a teacher's lessons: swaps, moves, cancelled and extra lessons, or another day's timetable
  changeKey(date) { return this.session.userId + '|' + date; }
  getChange(date) { return (this.db.changes || {})[this.changeKey(date)] || {}; }
  setChange(date, ch) { this.db.changes = this.db.changes || {}; this.db.changes[this.changeKey(date)] = ch; this.commit(); }
  setGroupLearners(gid, learners) {
    learners.forEach((l) => { if (!this.db.learners[l.acc]) this.db.learners[l.acc] = { acc: l.acc, surname: l.surname, first: l.first, gender: l.gender || '', dob: '', regDate: '', archiveDate: null, cls: null, imported: true }; });
    const g = this.db.groups.find((x) => x.id === gid); g.learners = learners.map((l) => l.acc); this.commit(); return g;
  }
  // timetable import: one teacher page -> that teacher's subject classes and their lesson times
  applyTimetable(uid, page) {
    const mine = this.db.groups.filter((g) => g.teacherId === uid);
    mine.forEach((g) => { g.slots = []; });
    let created = 0;
    page.lessons.forEach((l) => {
      let g = this.db.groups.find((x) => x.teacherId === uid && x.short === l.subject && x.label === l.label);
      if (!g) { g = { id: 'g' + Math.random().toString(36).slice(2, 9), subject: SUBJECT_NAMES[l.subject] || l.subject || 'Class', short: l.subject || '?', grade: parseInt(l.label, 10) || null, label: l.label, teacherId: uid, learners: [], slots: [] }; this.db.groups.push(g); created++; }
      g.slots.push({ d: l.d, p: l.p, len: l.len });
    });
    if (page.bells && page.bells.length >= 5) this.db.settings = Object.assign({}, this.db.settings, { bells: page.bells, brk: page.brk || null });
    this.commit();
    return created;
  }
  addStaffQuiet(person) { person.id = 's' + Math.random().toString(36).slice(2, 9); this.db.staff.push(person); return person; }

  // passwords: only a salted hash is kept. Test version: stored on this phone; the real app uses the database's sign-in.
  async hashPw(uid, pw) {
    const msg = 'teng|' + this.db.schoolId + '|' + uid + '|' + pw;
    if (window.crypto && crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg)); return 'sha256:' + Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join(''); }
    let h1 = 0x811c9dc5, h2 = 0x1505; for (let i = 0; i < msg.length; i++) { h1 = Math.imul(h1 ^ msg.charCodeAt(i), 16777619) >>> 0; h2 = (Math.imul(h2, 33) + msg.charCodeAt(i)) >>> 0; } return 'fnv:' + h1.toString(16) + h2.toString(16);
  }
  async setPassword(uid, pw) { const st = this.db.staff.find((x) => x.id === uid); const was = this.isRemembered(uid); st.pw = await this.hashPw(uid, pw); this.commit(); if (was) this.remember(uid); }
  async checkPassword(uid, pw) { const st = this.db.staff.find((x) => x.id === uid); return !!st && !!st.pw && st.pw === (await this.hashPw(uid, pw)); }
  // "remember me": this phone keeps a copy of the password hash; an admin reset or password change makes it stop working
  rememberMap() { const all = LS.get('teng:remember') || {}; return all[this.db.schoolId] || {}; }
  async remember(uid) { const all = LS.get('teng:remember') || {}; const st = this.db.staff.find((x) => x.id === uid); all[this.db.schoolId] = Object.assign({}, all[this.db.schoolId] || {}, { [uid]: st.pw }); LS.set('teng:remember', all); }
  forget(uid) { const all = LS.get('teng:remember') || {}; if (all[this.db.schoolId]) delete all[this.db.schoolId][uid]; LS.set('teng:remember', all); }
  isRemembered(uid) { const st = this.db.staff.find((x) => x.id === uid); return !!st && !!st.pw && this.rememberMap()[uid] === st.pw; }
  rememberedUsers() { const m = this.rememberMap(); return this.db.staff.filter((x) => x.pw && m[x.id] === x.pw); }
  resetPassword(uid) { const st = this.db.staff.find((x) => x.id === uid); if (st) { delete st.pw; this.commit(); } }
  signIn(schoolId, userId, keep) { this.session = { schoolId, userId }; LS.set('teng:session', keep === false ? { schoolId, userId: null } : this.session); this.loadSchool(schoolId); this.emit(); }
  pickSchool(schoolId) { this.loadSchool(schoolId); this.session = { schoolId, userId: null }; LS.set('teng:session', this.session); this.emit(); }
  signOut() { this.session = { schoolId: this.session.schoolId, userId: null }; LS.set('teng:session', this.session); this.emit(); }
  setFakeOffline(v) {
    this.fakeOffline = v; LS.set('teng:fakeOffline', v);
    if (!this.offline) this.flush(); else this.emit();
  }
  pending() { return this.db ? Object.values(this.db.registers).filter((r) => !r.synced && (this.cloud || r.by === this.session.userId)).length : 0; }
  flush() {
    if (!this.db || this.offline) return;
    let n = 0;
    Object.values(this.db.registers).forEach((r) => { if (!r.synced && r.by === this.session.userId) { r.synced = true; r.sentAt = stamp(); n++; } });
    this.commit();
    if (n) this.toast('Signal is back. ' + n + (n === 1 ? ' register was' : ' registers were') + ' sent to the office.');
  }
  logLookup(what) { this.db.log.unshift({ at: stamp(), by: this.session.userId, what }); this.db.log = this.db.log.slice(0, 200); this.persist(); }

  // registers
  getRegister(kind, ref, date, period) { return this.db.registers[regKey(kind, ref, date, period)] || null; }
  // weekly sign-off (principal now; SMT and class teacher can follow): one record per role and week
  signoff(role, ws) { return (this.db.signoffs || {})[role + '|' + ws] || null; }
  signWeek(role, ws) { this.db.signoffs = this.db.signoffs || {}; this.db.signoffs[role + '|' + ws] = { role, week: ws, by: this.session.userId, at: stamp() }; this.commit(); }
  setNoSchool(date, reason) { const ns = Object.assign({}, this.db.settings.noSchool || {}); if (reason) ns[date] = reason; else delete ns[date]; this.updateSettings({ noSchool: ns }); }
  saveRegister({ kind, ref, date, period, marks, coverFor }) {
    const k = regKey(kind, ref, date, period);
    const prev = this.db.registers[k];
    const clean = {}; Object.keys(marks).forEach((a) => { if (marks[a] === 'A' || marks[a] === 'L') clean[a] = marks[a]; });
    const rec = { kind, ref, date, period: period || 0, marks: clean, by: this.session.userId, coverFor: coverFor || null, at: (prev && prev.at) || stamp(), editedAt: prev ? stamp() : null, lateEntry: prev ? prev.lateEntry || null : date < todayISO() ? stamp() : null, synced: !this.offline && !(this.cloud && this.cloud.ready) };
    this.db.registers[k] = rec;
    if (kind === 'm') {
      Object.keys(clean).forEach((a) => { if (clean[a] === 'A' && !this.db.reasons[a + '|' + date]) this.db.reasons[a + '|' + date] = { code: null, note: '', at: null, by: null }; });
      Object.keys(this.db.reasons).forEach((k2) => { const [a, d] = k2.split('|'); if (d === date && this.db.learners[a] && this.db.learners[a].cls === ref && clean[a] !== 'A' && !this.db.captured[k2]) delete this.db.reasons[k2]; });
    }
    this.commit();
    return rec;
  }
  setReason(acc, date, code, note) {
    this.db.reasons[acc + '|' + date] = { code, note: note || '', at: stamp(), by: this.session.userId };
    this.commit();
  }
  setCaptured(acc, date, on) {
    const k = acc + '|' + date;
    if (on) this.db.captured[k] = { at: stamp(), reasonAtCapture: (this.db.reasons[k] || {}).code || null, by: this.session.userId };
    else delete this.db.captured[k];
    this.commit();
  }
  addGroup(g, learners) {
    const ex = this.db.groups.find((x) => x.teacherId === g.teacherId && x.subject.toLowerCase() === g.subject.toLowerCase() && x.label === g.label);
    learners.forEach((l) => { if (!this.db.learners[l.acc]) this.db.learners[l.acc] = { acc: l.acc, surname: l.surname, first: l.first, gender: l.gender || '', dob: '', regDate: '', archiveDate: null, cls: null, imported: true }; });
    if (ex) { ex.learners = learners.map((l) => l.acc); if (g.slots.length) ex.slots = g.slots; ex.replaced = true; this.commit(); return ex; }
    g.id = 'g' + Date.now().toString(36);
    g.learners = learners.map((l) => l.acc);
    this.db.groups.push(g); this.commit(); return g;
  }
  updateGroup(id, patch) { const g = this.db.groups.find((x) => x.id === id); Object.assign(g, patch); this.commit(); }
  removeGroup(id) { this.db.groups = this.db.groups.filter((g) => g.id !== id); this.commit(); }
  addIncident(inc) { inc.id = 'i' + Date.now().toString(36); inc.by = this.session.userId; inc.at = stamp(); this.db.incidents.unshift(inc); this.commit(); }
  updateBook(listId, acc, patch) { const b = this.db.books.find((x) => x.id === listId); const it = b.items.find((x) => x.acc === acc); Object.assign(it, patch); this.commit(); }
  addBookList(list) { list.id = 'b' + Date.now().toString(36); this.db.books.push(list); this.commit(); return list; }
  updateSettings(patch) { this.db.settings = Object.assign({}, this.db.settings, patch); this.commit(); }
  saveStaff(person) {
    const i = this.db.staff.findIndex((s) => s.id === person.id);
    if (i >= 0) this.db.staff[i] = person; else { person.id = 's' + Date.now().toString(36); this.db.staff.push(person); }
    this.db.classes.forEach((c) => { if (c.teacherId === person.id && c.id !== person.registerClass) c.teacherId = null; });
    if (person.registerClass) { const c = this.db.classes.find((x) => x.id === person.registerClass); if (c) { const old = this.db.staff.find((s) => s.id === c.teacherId && s.id !== person.id); if (old) old.registerClass = null; c.teacherId = person.id; } }
    this.commit();
  }
  // learners and classes (admin)
  saveLearner(l, oldAcc) {
    if (oldAcc && oldAcc !== l.acc) { delete this.db.learners[oldAcc]; this.db.groups.forEach((g) => { g.learners = g.learners.map((a) => (a === oldAcc ? l.acc : a)); }); }
    this.db.learners[l.acc] = Object.assign({ gender: '', dob: '', regDate: todayISO(), archiveDate: null, cls: null }, this.db.learners[l.acc] || {}, l); this.commit();
  }
  // a learner who leaves keeps their old registers (the circuit manager may ask); they just drop off every class list
  archiveLearner(acc, reason) { const l = this.db.learners[acc]; if (!l) return; l.archiveDate = reason ? todayISO() : null; l.archiveReason = reason || null; if (reason) { l.lastCls = l.cls || l.lastCls || null; l.cls = null; this.db.groups.forEach((g) => { g.learners = g.learners.filter((x) => x !== acc); }); } else if (!l.cls && l.lastCls) l.cls = l.lastCls; this.commit(); }
  enrolClass(cls, list) {
    let added = 0, moved = 0;
    list.forEach((x) => { const ex = this.db.learners[x.acc]; if (!ex) { this.db.learners[x.acc] = { acc: x.acc, surname: x.surname, first: x.first, gender: x.gender || '', dob: x.dob || '', regDate: todayISO(), archiveDate: null, cls }; added++; } else if (ex.cls !== cls || ex.archiveDate) { ex.cls = cls; ex.archiveDate = null; ex.archiveReason = null; moved++; } });
    this.commit(); return { added, moved };
  }
  addClass(id, grade) { if (this.db.classes.find((c) => c.id === id)) return false; this.db.classes.push({ id, grade, teacherId: null }); this.db.classes.sort((a, b) => a.grade - b.grade || a.id.localeCompare(b.id)); this.commit(); return true; }
  removeClass(id) { if (classLearners(this.db, id).length) return false; const c = this.db.classes.find((x) => x.id === id); if (c && c.teacherId) { const t = this.db.staff.find((x) => x.id === c.teacherId); if (t) t.registerClass = null; } this.db.classes = this.db.classes.filter((x) => x.id !== id); this.commit(); return true; }
  setClassTeacher(id, uid) { const t = this.db.staff.find((x) => x.id === uid); if (t) { this.saveStaff(Object.assign({}, t, { registerClass: id })); return; } const c = this.db.classes.find((x) => x.id === id); if (c && c.teacherId) { const o = this.db.staff.find((x) => x.id === c.teacherId); if (o) o.registerClass = null; c.teacherId = null; } this.commit(); }
  // year end: every learner moves up one grade into the class with the same letter; Grade 12 finishes school
  promotionPlan() {
    const top = Math.max(...this.school.grades); const plan = { up: [], done: [], missing: new Set() };
    Object.values(this.db.learners).forEach((l) => { if (l.archiveDate || !l.cls) return; const c = this.db.classes.find((x) => x.id === l.cls); if (!c) return;
      if (c.grade >= top) { plan.done.push(l.acc); return; }
      const to = (c.grade + 1) + l.cls.slice(String(c.grade).length); if (!this.db.classes.find((x) => x.id === to)) plan.missing.add(to); plan.up.push([l.acc, to]); });
    return plan;
  }
  promoteYear() {
    const plan = this.promotionPlan(); plan.missing.forEach((id) => this.db.classes.push({ id, grade: parseInt(id, 10), teacherId: null }));
    plan.up.forEach(([a, to]) => { this.db.learners[a].cls = to; });
    plan.done.forEach((a) => { const l = this.db.learners[a]; l.lastCls = l.cls; l.cls = null; l.archiveDate = todayISO(); l.archiveReason = 'Finished Grade 12'; });
    this.db.settings = Object.assign({}, this.db.settings, { promotedAt: stamp(), promotedBy: this.session.userId });
    this.commit(); return { up: plan.up.length, done: plan.done.length };
  }
  removeStaff(uid) { const p = this.db.staff.find((x) => x.id === uid); if (!p) return; this.db.classes.forEach((c) => { if (c.teacherId === uid) c.teacherId = null; }); this.db.groups.forEach((g) => { if (g.teacherId === uid) g.teacherId = null; }); this.db.staff = this.db.staff.filter((x) => x.id !== uid); this.commit(); }
  resetSample() { const id = this.db.schoolId; LS.del(this.key(id)); delete MEM[id]; this.db = generateSample(SCHOOLS.find((s) => s.id === id), todayISO()); this.commit(); }
}

/* ---- read helpers ---- */
function learnerName(l) { return l ? l.surname.toUpperCase() + ', ' + l.first : 'Unknown learner'; }
function learnerShort(l) { return l ? l.first + ' ' + l.surname : 'Unknown learner'; }
function sortAcc(db, accs) { return accs.slice().sort((a, b) => { const A = db.learners[a], B = db.learners[b]; return (A.surname + A.first).localeCompare(B.surname + B.first); }); }
function classLearners(db, cls) { return sortAcc(db, Object.keys(db.learners).filter((a) => db.learners[a].cls === cls && !db.learners[a].archiveDate)); }
function staffName(db, id) { const s = db.staff.find((x) => x.id === id); return s ? s.name : 'Unknown'; }
function groupLabel(g) { return g.short + ' ' + g.label; }
function groupTitle(g) { return g.subject + ' · ' + g.label; }
function morningMark(db, acc, date) {
  const l = db.learners[acc]; if (!l || !l.cls) return null;
  const r = db.registers[regKey('m', l.cls, date, 0)]; if (!r) return null;
  return r.marks[acc] || 'P';
}
function periodMark(db, g, acc, date, period) { const r = db.registers[regKey('p', g.id, date, period)]; if (!r) return null; return r.marks[acc] || 'P'; }
function classStatus(db, cls, date) {
  const r = db.registers[regKey('m', cls, date, 0)];
  if (!r) return { st: 'none' };
  const n = classLearners(db, cls).length; const a = Object.values(r.marks).filter((m) => m === 'A').length; const l = Object.values(r.marks).filter((m) => m === 'L').length;
  return { st: r.synced ? 'in' : 'wait', rec: r, n, a, l, p: n - a };
}
function consecutiveAbsent(db, school, acc, date) {
  let n = 0;
  for (const d of prevSchoolDays(school, date, 30)) { const m = morningMark(db, acc, d); if (m === null && d === date) continue; if (m === 'A') n++; else break; }
  return n;
}

function lessonsFor(db, uid, date) {
  const ch = (db.changes || {})[uid + '|' + date] || {};
  const wd = ch.dayAs || dow(date);
  let ls = [];
  db.groups.filter((g) => g.teacherId === uid).forEach((g) => g.slots.filter((s) => s.d === wd).forEach((s) => ls.push({ gid: g.id, p: s.p, len: s.len || 1, orig: s.p })));
  (ch.moves || []).forEach((m) => { const l = ls.find((x) => x.gid === m.gid && x.orig === m.from); if (l) { l.p = m.to; l.moved = true; } });
  ls = ls.filter((l) => !(ch.cancel || []).some((c) => c.gid === l.gid && c.from === l.orig));
  (ch.extra || []).forEach((e) => ls.push({ gid: e.gid, p: e.p, len: e.len || 1, orig: null, extra: true }));
  // teacher absent, or signed out early: those lessons are not held, so they need no register
  const bells = dbBells(db);
  ls.forEach((l) => { const b = bells.find((x) => x.p === l.p) || {}; l.start = b.t || ''; const z = bells.find((x) => x.p === l.p + l.len - 1) || b; l.end = z.e || ''; if (ch.absent) l.off = 'absent'; else if (ch.signout && l.start >= ch.signout) l.off = 'signout'; });
  return ls.sort((a, b) => a.p - b.p);
}
function dbBells(db) { return db.settings.bells || (SCHOOLS.find((x) => x.id === db.schoolId) || {}).bells || BELLS; }
// registers a teacher still owes: their morning register class and every lesson held but not marked, over the last school days
function missedFor(db, school, uid, today, days) {
  const me = db.staff.find((x) => x.id === uid); const out = []; const now = nowHM();
  prevSchoolDays(school, today, days || 10).forEach((d) => {
    const ch = (db.changes || {})[uid + '|' + d] || {};
    if (me && me.registerClass && d < today && !ch.absent && !db.registers[regKey('m', me.registerClass, d, 0)]) out.push({ kind: 'm', date: d, cls: me.registerClass });
    lessonsFor(db, uid, d).forEach((l) => {
      const g = db.groups.find((x) => x.id === l.gid); if (!g || !g.learners.length || l.off) return;
      if (d === today && !(l.end && l.end <= now)) return;
      if (!db.registers[regKey('p', g.id, d, l.p)]) out.push(Object.assign({ kind: 'p', date: d, g }, l));
    });
  });
  return out;
}
// who a person may look up: office and admin see everyone; a teacher sees only learners in their own subject classes and register class
function myLearnerSet(db, me) {
  if (!me || me.role !== 'teacher') return null;
  const set = new Set();
  db.groups.filter((g) => g.teacherId === me.id).forEach((g) => g.learners.forEach((a) => set.add(a)));
  if (me.registerClass) classLearners(db, me.registerClass).forEach((a) => set.add(a));
  return set;
}
// the four sign-in groups King asked for: Teacher, SMT, Principal, Admin (office)
// assembly and sign-off times, set by the office (settings.times)
function schoolTimes(school) {
  const t = school.times || {}; const a = school.assembly || '07:30';
  const days = {}; [1, 2, 3, 4, 5].forEach((d) => { days[d] = Object.assign({ held: true, start: a, due: addMin(a, 20), chase: addMin(a, 45) }, (t.days || {})[d] || {}); });
  const signoff = Object.assign({ teacher: { d: 5, t: '12:00' }, smt: { d: 5, t: '14:00' }, principal: { d: 1, t: '10:00' } }, t.signoff || {});
  return { days, signoff, staffIn: t.staffIn || '07:15', by: t.by || null, at: t.at || null };
}
function addMin(hm, m) { const [h, mi] = hm.split(':').map(Number); const x = h * 60 + mi + m; return pad(Math.floor(x / 60)) + ':' + pad(x % 60); }
function signoffDue(school, me, date) {
  const so = schoolTimes(school).signoff; const g = staffGroup(me);
  const k = g === 'principal' ? 'principal' : g === 'smt' ? 'smt' : me.registerClass ? 'teacher' : null;
  if (!k) return null; const x = so[k];
  return dow(date) === x.d && nowHM() >= x.t ? { k, t: x.t, d: x.d } : null;
}
function staffGroup(x) {
  if (!x) return 'teacher';
  if (x.principal || (x.role === 'admin' && /principal/i.test(x.title || ''))) return 'principal';
  if (x.role === 'office' || x.role === 'admin') return 'admin';
  if (x.smt || x.dhGrade) return 'smt';
  return 'teacher';
}
function groupFields(g) {
  if (g === 'principal') return { role: 'admin', principal: true, smt: false };
  if (g === 'admin') return { role: 'office', principal: false, smt: false };
  if (g === 'smt') return { role: 'teacher', principal: false, smt: true };
  return { role: 'teacher', principal: false, smt: false, dhGrade: null };
}
function canSeeLearner(db, me, acc) { const set = myLearnerSet(db, me); return !set || set.has(acc); }
function pLabel(p, len) { return len > 1 ? 'P' + p + '–' + (p + len - 1) : 'P' + p; }
