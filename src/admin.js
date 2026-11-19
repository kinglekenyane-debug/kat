/* ================= admin: one menu for the office and the principal ================= */
const ADD_AS = { teacher: 'Add a teacher', smt: 'Add an SMT member', principal: 'Add a principal', admin: 'Add an administrator' };
const TITLE_FOR = { teacher: 'Teacher', smt: 'Head of Department', principal: 'Principal', admin: 'Administrative clerk' };
function HubRow({ ic, label, sub, onClick }) {
  return html`<button class="list-row" onClick=${onClick}><${Icon} n=${ic} /><span class="grow"><b>${label}</b>${sub && html`<br /><span class="tiny muted">${sub}</span>`}</span><${Icon} n="chev" s=${18} /></button>`;
}
function AdminHub({ nav }) {
  const db = app.db, s = app.school;
  const learners = Object.values(db.learners).filter((l) => !l.archiveDate).length;
  const noReg = db.classes.filter((c) => !c.teacherId).length;
  const exportJson = async () => { await saveFile('kat-' + db.schoolId + '-' + todayISO() + '.json', JSON.stringify(db, null, 1)); };
  return html`<div class="app"><${WideBand} nav=${nav} noBack=${true} title="Admin" sub=${s.name + ' · office and principal'} />
    <main class="wide gut content" style="max-width:900px">
      <section class="card"><span class="eyebrow">Staff · ${db.staff.length}</span>
        <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr))">${Object.entries(ADD_AS).map(([g, l]) => html`<button class="btn line" onClick=${() => nav.go('staff', { add: g })}><${Icon} n="plus" s=${18} />${l}</button>`)}</div>
        <div class="card flat" style="padding:0"><${HubRow} ic="user" label="All staff" sub="Edit details and symbols, register classes, SMT grade, starting passwords, remove someone who left" onClick=${() => nav.go('staff')} /></div></section>
      <section class="card"><span class="eyebrow">Learners · ${learners}</span>
        <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(190px,1fr))"><button class="btn line" onClick=${() => nav.go('learners', { add: true })}><${Icon} n="plus" s=${18} />Enrol a learner</button><button class="btn line" onClick=${() => nav.go('learners', { imp: true })}><${Icon} n="file" s=${18} />Enrol a class from SA-SAMS Excel</button></div>
        <div class="card flat" style="padding:0"><${HubRow} ic="search" label="All learners" sub="Change details, move to another class, mark as left school" onClick=${() => nav.go('learners')} /><${HubRow} ic="list" label="Register classes" sub=${db.classes.length + ' classes' + (noReg ? ' · ' + noReg + ' without a register teacher' : '')} onClick=${() => nav.go('classes')} /><${HubRow} ic="swap" label="End of year: move learners up a grade" sub="Grade 8A becomes 9A, and so on. Grade 12 finishes." onClick=${() => nav.go('yearend')} /></div></section>
      <section class="card"><span class="eyebrow">Timetable and calendar</span>
        <div class="card flat" style="padding:0"><${HubRow} ic="grid" label="Upload the school timetable" sub="The aSc Timetables teacher PDF. Every teacher gets their lessons." onClick=${() => nav.go('timetable', { mode: 'school' })} /><${HubRow} ic="cal" label="Assembly and sign-off times" onClick=${() => nav.go('times')} /><${HubRow} ic="cal" label="Terms, holidays and bell times" sub="No-school days for one day are on the Today screen" onClick=${() => nav.go('schoolset')} /></div></section>
      <section class="card"><span class="eyebrow">School</span>
        <div class="card flat" style="padding:0"><${HubRow} ic="gear" label="Name, crest, colours and absence reasons" onClick=${() => nav.go('schoolset')} /></div>
        <button class="btn line" onClick=${exportJson}>Download all data (backup)</button></section>
    </main><${BottomNav} nav=${nav} cur="admin" /></div>`;
}

/* ---- staff ---- */
function Staff({ nav, add }) {
  const db = app.db, s = app.school;
  const blank = (g) => Object.assign({ name: '', code: '', short: '', title: TITLE_FOR[g] || 'Teacher', registerClass: '', dhGrade: null }, groupFields(g || 'teacher'));
  const [edit, setEdit] = useState(() => (add ? blank(add) : null)), [q, setQ] = useState(''), [start, setStart] = useState(''), [busy, setBusy] = useState(false), [sure, setSure] = useState(false);
  const open = (p) => { setEdit(p); setStart(''); setSure(false); };
  const ql = q.trim().toLowerCase();
  const list = db.staff.filter((p) => !ql || (p.name + ' ' + (p.code || '') + ' ' + p.title).toLowerCase().includes(ql));
  const save = async () => {
    if (!edit.name.trim()) { app.toast('Type the full name.'); return; }
    const sc = (edit.code || symbolGuess(edit.name)).toUpperCase();
    const clash = db.staff.find((o) => o.id !== edit.id && o.code === sc); if (clash) { app.toast('The symbol ' + sc + ' is already used by ' + clash.name + '. Choose another.'); return; }
    if (app.cloud && !edit.id && start.length < 6) { app.toast('Give a starting password of at least 6 characters, so ' + edit.name + ' can sign in.'); return; }
    if (app.cloud && start && start.length < 6) { app.toast('The starting password needs at least 6 characters.'); return; }
    const was = edit.id && db.staff.find((o) => o.id === edit.id);
    if (app.cloud && was && was.code && was.code !== sc && !start) { app.toast('Changing a symbol ends that person\'s login. Give them a new starting password too.'); return; }
    setBusy(true);
    app.saveStaff(Object.assign({}, edit, { short: edit.short || edit.name, code: sc }));
    if (app.cloud && start) {
      if (app.offline) { setBusy(false); app.toast('Saved. Giving a starting password needs signal: try again when you have it.'); return; }
      await new Promise((r) => setTimeout(r, 900)); // let the new staff record reach the database first
      await app.cloud.push();
      const er = await app.cloud.setStart(sc, start); setBusy(false);
      if (er) { app.toast('Saved, but the starting password did not work: ' + er); return; }
      setEdit(null); app.toast(edit.name + ' can now sign in as ' + sc + ' with the starting password, then choose their own.'); return;
    }
    setBusy(false); setEdit(null); app.toast('Saved.');
  };
  const grp = edit ? staffGroup(edit) : null;
  return html`<div class="app"><${WideBand} nav=${nav} title="Staff" sub=${s.name + ' · ' + db.staff.length + ' people'} />
    <main class="wide gut content" style="max-width:900px">
      <div class="wrap">${Object.entries(ADD_AS).map(([g, l]) => html`<button class="btn sm line" onClick=${() => open(blank(g))}>+ ${l.replace(/^Add an? /, '')}</button>`)}</div>
      <label class="f" for="sq">Search<input id="sq" class="inp" placeholder="Name or symbol" value=${q} onInput=${(e) => setQ(e.target.value)} /></label>
      <div class="tablebox" style="max-height:60vh;overflow:auto"><table class="t"><thead><tr><th>Symbol</th><th>Name</th><th>Signs in as</th><th>Register class</th><th></th></tr></thead><tbody>
        ${list.map((p) => html`<tr><td><b>${p.code || ''}</b></td><td><b>${p.name}</b><br /><span class="tiny muted">${p.title}${p.dhGrade ? ' · Grade ' + p.dhGrade : ''}</span></td><td>${(ROLE_GROUPS.find((r) => r[0] === staffGroup(p)) || [])[1]}</td><td>${p.registerClass || ''}</td><td><button class="btn sm soft" onClick=${() => open(Object.assign({}, p))}>Edit</button></td></tr>`)}</tbody></table></div>
    </main>
    ${edit && html`<${Sheet} title=${edit.id ? 'Edit ' + edit.name : ADD_AS[grp]} onClose=${() => setEdit(null)}>
      <label class="f" for="pn">Full name<input id="pn" class="inp" placeholder="e.g. Mr T. Mokoena" value=${edit.name} onInput=${(e) => setEdit(Object.assign({}, edit, { name: e.target.value }))} /></label>
      <div class="grid2"><label class="f" for="psy">Symbol (as on the timetable)<input id="psy" class="inp" maxlength="5" style="text-transform:uppercase" placeholder=${edit.name ? symbolGuess(edit.name) : 'e.g. LK'} value=${edit.code || ''} onInput=${(e) => setEdit(Object.assign({}, edit, { code: e.target.value.toUpperCase().trim() }))} /></label>
        <label class="f" for="pt">Job title<input id="pt" class="inp" value=${edit.title} onInput=${(e) => setEdit(Object.assign({}, edit, { title: e.target.value }))} /></label></div>
      <div class="grid2"><label class="f" for="pr">Signs in as<select id="pr" class="inp" value=${grp} onChange=${(e) => setEdit(Object.assign({}, edit, groupFields(e.target.value), edit.title === TITLE_FOR[grp] ? { title: TITLE_FOR[e.target.value] } : {}))}>${ROLE_GROUPS.map(([k, l]) => html`<option value=${k}>${l}</option>`)}</select></label>
        <label class="f" for="pc">Register class<select id="pc" class="inp" value=${edit.registerClass || ''} onChange=${(e) => setEdit(Object.assign({}, edit, { registerClass: e.target.value || null }))}><option value="">None</option>${db.classes.map((c) => html`<option value=${c.id}>${c.id}${c.teacherId && c.teacherId !== edit.id ? ' (now ' + staffSym(db, c.teacherId) + ')' : ''}</option>`)}</select></label>
        ${(grp === 'smt' || grp === 'teacher') && html`<label class="f" for="pd">SMT for grade<select id="pd" class="inp" value=${edit.dhGrade || ''} onChange=${(e) => setEdit(Object.assign({}, edit, { dhGrade: e.target.value ? Number(e.target.value) : null }, e.target.value ? { smt: true } : {}))}><option value="">No grade</option>${s.grades.map((g) => html`<option value=${g}>Grade ${g}</option>`)}</select></label>`}</div>
      ${app.cloud ? html`<label class="f" for="pst">${edit.id ? 'Give a new starting password (if they forgot theirs)' : 'Starting password'}<input id="pst" class="inp" autocomplete="off" placeholder=${edit.id ? 'Leave empty to keep their password' : 'At least 6 characters'} value=${start} onInput=${(e) => setStart(e.target.value)} /></label>
        <span class="tiny muted">Tell them their symbol and this starting password. The first time they sign in, KAT asks them to choose their own password. A new starting password ends their old one.</span>`
        : edit.id && html`<div class="between"><span class="small muted">${edit.pw ? 'Has a password.' : 'No password yet. They choose one the first time they sign in.'}</span>${edit.pw && html`<button class="btn sm soft" onClick=${() => { app.resetPassword(edit.id); setEdit(Object.assign({}, edit, { pw: undefined })); app.toast('Password reset. ' + edit.name + ' chooses a new one at the next sign-in.'); }}>Reset password</button>`}</div>`}
      <button class="btn big" disabled=${busy} onClick=${save}>${busy ? 'Saving…' : 'Save'}</button>
      ${edit.id && edit.id !== app.me.id && (sure ? html`<div class="boxnote warn"><span>Remove ${edit.name} from the staff list? Their registers stay. Their classes need a new teacher.</span></div><div class="wrap"><button class="btn danger" onClick=${() => { app.removeStaff(edit.id); setEdit(null); app.toast(edit.name + ' was removed.'); }}>Yes, remove</button><button class="btn soft" onClick=${() => setSure(false)}>Cancel</button></div>` : html`<button class="linkbtn" onClick=${() => setSure(true)}>Remove this person (left the school)</button>`)}
    <//>`}
  </div>`;
}
function staffSym(db, uid) { const p = db.staff.find((x) => x.id === uid); return p ? p.code || p.name : '?'; }

/* ---- learners ---- */
function Learners({ nav, add, imp }) {
  const db = app.db, s = app.school;
  const [q, setQ] = useState(''), [cls, setCls] = useState(''), [left, setLeft] = useState(false);
  const [edit, setEdit] = useState(() => (add ? { acc: '', surname: '', first: '', gender: '', dob: '', cls: '' } : null)), [old, setOld] = useState(null), [why, setWhy] = useState('');
  const [im, setIm] = useState(!!imp), [res, setRes] = useState(null), [to, setTo] = useState(''), [err, setErr] = useState('');
  const ql = q.trim().toLowerCase();
  const all = Object.values(db.learners).filter((l) => (left ? l.archiveDate : !l.archiveDate) && (!cls || l.cls === cls || l.lastCls === cls) && (!ql || (l.acc + ' ' + l.first + ' ' + l.surname).toLowerCase().includes(ql)))
    .sort((a, b) => (a.cls || '').localeCompare(b.cls || '') || (a.surname + a.first).localeCompare(b.surname + b.first));
  const shown = all.slice(0, 120);
  const save = () => {
    const l = Object.assign({}, edit, { acc: String(edit.acc).trim(), surname: edit.surname.trim(), first: edit.first.trim() });
    if (!l.acc || !l.surname || !l.first) { app.toast('Accession number, surname and first name are needed.'); return; }
    if (l.acc !== old && db.learners[l.acc]) { app.toast('Accession number ' + l.acc + ' already belongs to ' + learnerShort(db.learners[l.acc]) + '.'); return; }
    l.cls = l.cls || null; app.saveLearner(l, old); setEdit(null); app.toast(old ? 'Saved.' : learnerShort(l) + ' is enrolled' + (l.cls ? ' in ' + l.cls : '') + '.');
  };
  const onFile = (e) => { const f = e.target.files[0]; if (!f) return; setErr(''); const fr = new FileReader(); fr.onload = () => { try { const r = parseClassList(new Uint8Array(fr.result), f.name); if (r.error) { setErr(r.error); setRes(null); } else { setRes(r); const guess = (r.cls || '').toUpperCase().replace(/\s/g, ''); setTo(db.classes.find((c) => c.id === guess) ? guess : ''); } } catch (x) { setErr('KAT could not read this file. Is it an Excel file (.xls or .xlsx)?'); } }; fr.readAsArrayBuffer(f); };
  return html`<div class="app"><${WideBand} nav=${nav} title="Learners" sub=${s.name + ' · ' + Object.values(db.learners).filter((l) => !l.archiveDate).length + ' at school'} />
    <main class="wide gut content" style="max-width:900px">
      <div class="wrap"><button class="btn sm line" onClick=${() => { setOld(null); setEdit({ acc: '', surname: '', first: '', gender: '', dob: '', cls: cls || '' }); }}>+ Enrol a learner</button><button class="btn sm line" onClick=${() => { setIm(!im); setRes(null); }}>${im ? 'Close Excel import' : 'Enrol a class from Excel'}</button></div>
      ${im && html`<section class="card"><span class="eyebrow">Enrol a class from an SA-SAMS Excel list</span>
        <label class="btn line" for="lxl" style="cursor:pointer"><${Icon} n="file" s=${18} />${res ? 'Choose a different file' : 'Choose an Excel file'}</label><input id="lxl" type="file" accept=".xls,.xlsx,.csv" style="position:absolute;width:1px;height:1px;opacity:0" onChange=${onFile} />
        ${err && html`<span class="small" role="alert" style="color:var(--abs-ink);font-weight:600">${err}</span>`}
        ${res && html`<span class="small">${res.learners.length} learners found${res.cls ? ' · file says ' + res.cls : ''}. ${res.learners.filter((x) => db.learners[x.acc]).length} are already in KAT and will move to the class you choose.</span>
          <label class="f" for="lto">Register class<select id="lto" class="inp" value=${to} onChange=${(e) => setTo(e.target.value)}><option value="">Choose…</option>${db.classes.map((c) => html`<option value=${c.id}>${c.id}</option>`)}</select></label>
          <button class="btn big" disabled=${!to} onClick=${() => { const r = app.enrolClass(to, res.learners); setRes(null); setIm(false); setCls(to); app.toast(to + ': ' + r.added + ' enrolled, ' + r.moved + ' moved from another class.'); }}>Enrol into ${to || '…'}</button>`}</section>`}
      <div class="grid2" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))"><label class="f" for="lq">Search<input id="lq" class="inp" placeholder="Name or accession number" value=${q} onInput=${(e) => setQ(e.target.value)} /></label>
        <label class="f" for="lc">Class<select id="lc" class="inp" value=${cls} onChange=${(e) => setCls(e.target.value)}><option value="">All classes</option>${db.classes.map((c) => html`<option value=${c.id}>${c.id}</option>`)}</select></label>
        <label class="check" style="align-self:end"><input type="checkbox" checked=${left} onChange=${(e) => setLeft(e.target.checked)} /><span>Show learners who left</span></label></div>
      <div class="tablebox" style="max-height:60vh;overflow:auto"><table class="t"><thead><tr><th>Acc. no</th><th>Learner</th><th>Class</th><th></th></tr></thead><tbody>
        ${shown.map((l) => html`<tr><td>${l.acc}</td><td><b>${learnerName(l)}</b>${l.archiveDate && html`<br /><span class="tiny muted">Left ${fmtDMY(l.archiveDate)}${l.archiveReason ? ' · ' + l.archiveReason : ''}</span>`}</td><td>${l.cls || l.lastCls || ''}</td><td><button class="btn sm soft" onClick=${() => { setOld(l.acc); setWhy(''); setEdit(Object.assign({}, l, { cls: l.cls || '' })); }}>Edit</button></td></tr>`)}</tbody></table></div>
      ${all.length > shown.length && html`<span class="small muted">Showing ${shown.length} of ${all.length}. Search or pick a class to narrow it down.</span>`}
    </main>
    ${edit && html`<${Sheet} title=${old ? learnerShort(db.learners[old]) : 'Enrol a learner'} onClose=${() => setEdit(null)}>
      <div class="grid2"><label class="f" for="la">Accession number<input id="la" class="inp" inputmode="numeric" value=${edit.acc} onInput=${(e) => setEdit(Object.assign({}, edit, { acc: e.target.value }))} /></label>
        <label class="f" for="lcl">Register class<select id="lcl" class="inp" value=${edit.cls || ''} onChange=${(e) => setEdit(Object.assign({}, edit, { cls: e.target.value }))}><option value="">None yet</option>${db.classes.map((c) => html`<option value=${c.id}>${c.id}</option>`)}</select></label>
        <label class="f" for="ls">Surname<input id="ls" class="inp" value=${edit.surname} onInput=${(e) => setEdit(Object.assign({}, edit, { surname: e.target.value }))} /></label>
        <label class="f" for="lf">First name<input id="lf" class="inp" value=${edit.first} onInput=${(e) => setEdit(Object.assign({}, edit, { first: e.target.value }))} /></label>
        <label class="f" for="lg">Gender<select id="lg" class="inp" value=${edit.gender || ''} onChange=${(e) => setEdit(Object.assign({}, edit, { gender: e.target.value }))}><option value="">–</option><option value="M">M</option><option value="F">F</option></select></label>
        <label class="f" for="ld">Date of birth<input id="ld" type="date" class="inp" value=${edit.dob || ''} onInput=${(e) => setEdit(Object.assign({}, edit, { dob: e.target.value }))} /></label></div>
      <button class="btn big" onClick=${save}>${old ? 'Save' : 'Enrol'}</button>
      ${old && (edit.archiveDate ? html`<button class="btn line" onClick=${() => { app.archiveLearner(old, null); setEdit(null); app.toast('Back at school.'); }}>Undo: learner is back at school</button>`
        : html`<div class="card flat stack"><span class="small muted">Learner left the school? Their old registers stay for the records. They drop off the class lists from today.</span>
          <label class="f" for="lw">Reason<select id="lw" class="inp" value=${why} onChange=${(e) => setWhy(e.target.value)}><option value="">Choose…</option>${['Transferred to another school', 'Left school', 'Moved away', 'Deceased', 'Other'].map((x) => html`<option>${x}</option>`)}</select></label>
          <button class="btn danger" disabled=${!why} onClick=${() => { app.archiveLearner(old, why); setEdit(null); app.toast(learnerShort(db.learners[old]) + ' was marked as left.'); }}>Mark as left school</button></div>`)}
    <//>`}
  </div>`;
}

/* ---- register classes ---- */
function Classes({ nav }) {
  const db = app.db, s = app.school;
  const [g, setG] = useState(String(s.grades[0])), [letter, setLetter] = useState('');
  const teachers = db.staff.filter((p) => staffGroup(p) !== 'admin');
  return html`<div class="app"><${WideBand} nav=${nav} title="Register classes" sub=${s.name + ' · ' + db.classes.length + ' classes'} />
    <main class="wide gut content" style="max-width:900px">
      <div class="tablebox"><table class="t"><thead><tr><th>Class</th><th>Learners</th><th>Register teacher</th><th></th></tr></thead><tbody>
        ${db.classes.map((c) => { const n = classLearners(db, c.id).length; return html`<tr><td><b>${c.id}</b></td><td>${n}</td><td><select class="inp" style="min-height:38px" aria-label=${'Register teacher for ' + c.id} value=${c.teacherId || ''} onChange=${(e) => { app.setClassTeacher(c.id, e.target.value); app.toast(c.id + ': ' + (e.target.value ? staffName(db, e.target.value) : 'no register teacher') + '.'); }}><option value="">Nobody yet</option>${teachers.map((p) => html`<option value=${p.id}>${(p.code ? p.code + ' · ' : '') + p.name}</option>`)}</select></td>
          <td>${n ? null : html`<button class="btn sm soft" onClick=${() => { app.removeClass(c.id); app.toast(c.id + ' removed.'); }}>Remove</button>`}</td></tr>`; })}</tbody></table></div>
      <section class="card"><span class="eyebrow">Add a class</span><div class="row" style="flex-wrap:wrap;gap:10px">
        <select class="inp" style="width:auto" aria-label="Grade" value=${g} onChange=${(e) => setG(e.target.value)}>${s.grades.map((x) => html`<option value=${x}>Grade ${x}</option>`)}</select>
        <input class="inp" style="width:90px;text-transform:uppercase" aria-label="Letter" placeholder="F" maxlength="2" value=${letter} onInput=${(e) => setLetter(e.target.value.toUpperCase().trim())} />
        <button class="btn line" onClick=${() => { if (!letter) return; const id = g + letter; app.toast(app.addClass(id, Number(g)) ? id + ' added.' : id + ' already exists.'); setLetter(''); }}>Add ${letter ? g + letter : ''}</button></div>
        <span class="tiny muted">A class can be removed once it has no learners.</span></section>
    </main></div>`;
}

/* ---- year end ---- */
function YearEnd({ nav }) {
  const db = app.db, s = app.school, plan = app.promotionPlan();
  const [sure, setSure] = useState(''), [done, setDone] = useState(null);
  const top = Math.max(...s.grades);
  const exportJson = async () => { await saveFile('kat-' + db.schoolId + '-before-year-end-' + todayISO() + '.json', JSON.stringify(db, null, 1)); };
  if (done) return html`<div class="app"><${WideBand} nav=${nav} title="New school year" sub=${s.name} /><main class="wide gut content" style="max-width:700px"><section class="card"><div class="boxnote ok"><span><strong>Done.</strong> ${done.up} learners moved up a grade and ${done.done} finished Grade ${top}.</span></div>
    <span class="small">Next: check register teachers under Register classes, upload the new timetable, and ask teachers to upload their new subject class lists.</span><button class="btn line" onClick=${() => nav.replace('classes')}>Register classes</button></section></main></div>`;
  return html`<div class="app"><${WideBand} nav=${nav} title="End of year" sub=${s.name + ' · move learners up a grade'} />
    <main class="wide gut content" style="max-width:700px">
      <section class="card"><span class="eyebrow">What will happen</span>
        <span class="small">${plan.up.length} learners move up one grade into the class with the same letter (8A becomes 9A). ${plan.done.length} Grade ${top} learners are marked "Finished Grade ${top}" and drop off the class lists. All registers stay.</span>
        ${plan.missing.size > 0 && html`<span class="small">New classes made for: ${[...plan.missing].join(', ')}.</span>`}
        ${db.settings.promotedAt && html`<span class="tiny muted">Last done ${fmtShort(db.settings.promotedAt.slice(0, 10))} by ${staffName(db, db.settings.promotedBy)}.</span>`}
        <div class="boxnote warn"><span>Do this once, after the last school day of the year. Learners who fail a grade can be moved back by hand under Learners. Download a backup first.</span></div>
        <button class="btn line" onClick=${exportJson}>Download a backup first</button>
        <label class="f" for="ye">To go ahead, type MOVE UP<input id="ye" class="inp" value=${sure} onInput=${(e) => setSure(e.target.value)} /></label>
        <button class="btn big" disabled=${sure.trim().toUpperCase() !== 'MOVE UP'} onClick=${() => setDone(app.promoteYear())}>Move every learner up a grade</button></section>
    </main></div>`;
}

/* ================= developer (KK Lekenyane): set up schools and their first admin ================= */
function Developer() {
  const [rows, setRows] = useState(null), [pick, setPick] = useState(null), [f, setF] = useState({ name: '', code: '', pw: '', sample: true }), [busy, setBusy] = useState(false), [msg, setMsg] = useState(''), [wipe, setWipe] = useState('');
  const load = () => app.cloud.overview().then(setRows);
  useEffect(() => { load(); }, []);
  const info = (id) => (rows || []).find((r) => r.school_id === id) || { staff: 0, learners: 0, logins: 0, invites: 0 };
  const go = async () => {
    const sc = SCHOOLS.find((x) => x.id === pick), set = Number(info(pick).staff) > 0;
    if (!f.code.trim() || (!set && !f.name.trim() && !f.sample)) { setMsg('Fill in the admin\'s name and symbol.'); return; }
    if (f.pw.length < 6) { setMsg('The starting password needs at least 6 characters.'); return; }
    setBusy(true); setMsg('');
    let er;
    if (set) { const r = await app.cloud.sb.rpc('set_start_password', { p_school: pick, p_code: f.code.trim().toUpperCase(), p_pw: f.pw }); er = r.error && r.error.message; }
    else er = await app.cloud.setupSchool(pick, { name: f.name || f.code, code: f.code }, f.pw, f.sample);
    setBusy(false);
    if (er) { setMsg('Problem: ' + er); return; }
    setMsg((set ? '' : sc.short + ' is set up. ') + f.code.toUpperCase() + ' can now sign in as Admin with the starting password, then chooses their own.');
    setF({ name: '', code: '', pw: '', sample: true }); setPick(null); load();
  };
  return html`<div class="welcome">
    <header class="band"><div class="col gut band-in"><div class="band-row"><div class="grow"><h1>Developer</h1><div class="sub">KAT · set up schools and their first admin</div></div><${Logo} s=${34} /></div></div></header>
    <main class="col gut content">
      ${SCHOOLS.map((sc) => { const r = info(sc.id), set = Number(r.staff) > 0; return html`<section class="card">
        <div class="row"><img src=${sc.crest} alt="" style="width:40px;height:40px;object-fit:contain;background:#fff;border-radius:8px" /><span class="grow"><b>${sc.name}</b><br /><span class="tiny muted">${rows ? (set ? r.staff + ' staff · ' + r.learners + ' learners · ' + r.logins + ' signed up · ' + r.invites + ' waiting for first sign-in' : 'Not set up yet') : 'Checking…'}</span></span></div>
        ${pick === sc.id ? html`<div class="stack">
            ${!set && html`<label class="f" for="dn">First admin clerk's full name<input id="dn" class="inp" placeholder="e.g. Mrs E. Pretorius" value=${f.name} onInput=${(e) => setF(Object.assign({}, f, { name: e.target.value }))} /></label>`}
            <div class="grid2"><label class="f" for="dc">${set ? 'Admin symbol (already on the staff list)' : 'Their symbol'}<input id="dc" class="inp" style="text-transform:uppercase" maxlength="5" value=${f.code} onInput=${(e) => setF(Object.assign({}, f, { code: e.target.value.toUpperCase().trim() }))} /></label>
              <label class="f" for="dp">Starting password<input id="dp" class="inp" autocomplete="off" value=${f.pw} onInput=${(e) => setF(Object.assign({}, f, { pw: e.target.value }))} /></label></div>
            ${!set && html`<label class="check"><input type="checkbox" checked=${f.sample} onChange=${(e) => setF(Object.assign({}, f, { sample: e.target.checked }))} /><span>Fill with made-up sample staff and learners (for testing)<br /><span class="tiny muted">Untick for a real school: it starts empty, and the admin adds staff and enrols learners.</span></span></label>`}
            <div class="wrap"><button class="btn" disabled=${busy} onClick=${go}>${busy ? 'Working…' : set ? 'Give this starting password' : 'Set up ' + sc.short}</button><button class="btn soft" onClick=${() => { setPick(null); setMsg(''); }}>Cancel</button></div>
            ${set && html`<details class="small"><summary>Wipe this school (testing only)</summary><div class="stack" style="margin-top:8px"><span class="small muted">Deletes every record and login of ${sc.short}. This cannot be undone.</span><label class="f" for="dw">Type ${sc.short} to confirm<input id="dw" class="inp" value=${wipe} onInput=${(e) => setWipe(e.target.value)} /></label><button class="btn danger" disabled=${wipe.trim() !== sc.short} onClick=${async () => { const er = await app.cloud.wipe(sc.id); setWipe(''); setMsg(er ? 'Problem: ' + er : sc.short + ' was wiped.'); load(); }}>Wipe ${sc.short}</button></div></details>`}</div>`
          : html`<button class="btn line" onClick=${() => { setPick(sc.id); setMsg(''); setF({ name: '', code: '', pw: '', sample: !set }); }}>${set ? 'Give an admin a starting password' : 'Set up this school'}</button>`}
      </section>`; })}
      ${msg && html`<div class="boxnote info" role="status"><span>${msg}</span></div>`}
      <button class="btn line" onClick=${async () => { await app.cloud.signOut(); app.emit(); }}>Sign out of the developer account</button>
    </main><p class="credit">Developed by KK Lekenyane</p></div>`;
}
