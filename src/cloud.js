
/* ---- shared database (Supabase): every phone in the school sees the same registers ----
   Like a shared class file in the staffroom: each phone keeps its own copy to work from,
   and posts every change to the shared file as soon as there is signal. Other phones get
   the change a second later. Without signal, changes wait on the phone and go when it returns. */
const CLOUD_MAPS = ['registers', 'reasons', 'captured', 'changes', 'learners'];
const CLOUD_LISTS = ['staff', 'classes', 'groups', 'incidents', 'books'];
const CLOUD_SINGLE = ['settings', 'log'];
class Cloud {
  constructor() {
    const cfg = window.KAT_CLOUD;
    this.on = !!(cfg && cfg.url && window.supabase && window.supabase.createClient);
    this.sb = this.on ? window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'kat-auth' } }) : null;
    this.last = {}; this.user = null; this.member = null; this.ready = false; this.busy = false; this.again = false; this.chan = null; this.lastSync = null; this.err = null;
  }
  attach(store) {
    if (!this.on) return;
    this.store = store; store.cloud = this;
    const persist0 = store.persist.bind(store);
    store.persist = () => { persist0(); this.soon(); };
    store.flush = () => { this.soon(0); };
    this.sb.auth.getSession().then(({ data }) => { this.user = data.session ? data.session.user : null; if (this.user) this.start(); });
    setInterval(() => { if (this.ready && !store.offline) this.push(); }, 60000);
  }
  email(school, code) { return String(code).trim().toLowerCase() + '.' + school + '@kat.invalid'; }
  async status(school, code) {
    const { data, error } = await this.sb.rpc('symbol_status', { p_school: school, p_code: String(code).trim().toUpperCase() });
    if (error) throw error; return data;
  }
  // sign in (or, the first time, choose a password). Returns { ok } or { err } or { first: true } when a new password is needed.
  async signIn(school, code, pw, pw2) {
    code = String(code).trim().toUpperCase();
    let st; try { st = await this.status(school, code); } catch (e) { return { err: 'Could not reach the school database. Check the signal and try again.' }; }
    if (st === 'unknown') return { err: 'No staff member has the symbol "' + code + '" at this school. Check with the office.' };
    if (st === 'claimed') {
      const { data, error } = await this.sb.auth.signInWithPassword({ email: this.email(school, code), password: pw });
      if (error) return { err: /invalid/i.test(error.message) ? 'wrong' : error.message };
      this.user = data.user;
    } else {
      if (!pw2) return { first: true };
      if (pw.length < 6) return { err: 'Choose a password of at least 6 characters.' };
      if (pw !== pw2) return { err: 'The two passwords are not the same.' };
      await this.sb.auth.signOut().catch(() => {});
      const { data, error } = await this.sb.auth.signUp({ email: this.email(school, code), password: pw });
      if (error || !data.session) return { err: (error && error.message) || 'Could not create the login.' };
      this.user = data.user;
      const c = await this.sb.rpc('claim_symbol', { p_school: school, p_code: code });
      if (c.error) return { err: c.error.message };
      if (st === 'new-school') { this.member = { school_id: school, staff_code: code }; this.last = {}; await this.push(true); LS.set('kat:cloud:' + school, 1); }
    }
    await this.start();
    return { ok: true, code };
  }
  async signOut() { this.stop(); this.user = null; this.member = null; await this.sb.auth.signOut().catch(() => {}); }
  async changePassword(pw) { const { error } = await this.sb.auth.updateUser({ password: pw }); return error ? error.message : null; }
  async resetSymbol(code) { const { error } = await this.sb.rpc('reset_symbol', { p_code: code }); return error ? error.message : null; }

  async start() {
    const s = this.store;
    const m = await this.sb.from('members').select('school_id, staff_code').eq('user_id', this.user.id).maybeSingle();
    if (m.error || !m.data) { this.err = m.error ? m.error.message : 'This login is not linked to a school.'; s.emit(); return; }
    this.member = m.data;
    if (!s.db || s.db.schoolId !== m.data.school_id) s.loadSchool(m.data.school_id);
    await this.pull();
    this.listen();
    this.ready = true;
    this.push();
  }
  stop() { if (this.chan) { this.sb.removeChannel(this.chan); this.chan = null; } this.ready = false; }

  // turn the school's records into rows: one row per register, learner, staff member…
  rows(db) {
    const out = {};
    const put = (coll, id, data) => { out[coll + '\u0001' + id] = { coll, id: String(id), data }; };
    CLOUD_MAPS.forEach((c) => Object.entries(db[c] || {}).forEach(([k, v]) => { const d = Object.assign({}, v); delete d.synced; delete d.sentAt; put(c, k, d); }));
    CLOUD_LISTS.forEach((c) => (db[c] || []).forEach((v, i) => { const d = Object.assign({}, v, { _ord: i }); delete d.pw; put(c, v.id, d); }));
    put('settings', 'main', db.settings || {});
    put('log', 'main', { list: db.log || [], createdFor: db.createdFor });
    return out;
  }
  async pull() {
    const s = this.store, school = this.member.school_id, all = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await this.sb.from('docs').select('coll, id, data').eq('school_id', school).range(from, from + 999);
      if (error) { this.err = error.message; s.emit(); return; }
      all.push(...data); if (data.length < 1000) break;
    }
    if (!all.length) return;
    const seen = LS.get('kat:cloud:' + school);
    const old = s.db, db = { v: DATA_VERSION, schoolId: school, createdFor: old.createdFor, settings: {}, log: [] };
    CLOUD_MAPS.forEach((c) => { db[c] = {}; }); CLOUD_LISTS.forEach((c) => { db[c] = []; });
    this.last = {};
    all.forEach((r) => {
      this.last[r.coll + '\u0001' + r.id] = JSON.stringify(r.data);
      if (CLOUD_MAPS.includes(r.coll)) db[r.coll][r.id] = Object.assign({}, r.data, r.coll === 'registers' ? { synced: true } : {});
      else if (CLOUD_LISTS.includes(r.coll)) db[r.coll].push(r.data);
      else if (r.coll === 'settings') db.settings = r.data;
      else if (r.coll === 'log') { db.log = r.data.list || []; if (r.data.createdFor) db.createdFor = r.data.createdFor; }
    });
    CLOUD_LISTS.forEach((c) => { db[c].sort((a, b) => a._ord - b._ord); db[c].forEach((x) => delete x._ord); });
    // keep what only this phone knows: password hashes, and registers still waiting to send
    db.staff.forEach((x) => { const o = (old.staff || []).find((y) => y.id === x.id); if (o && o.pw) x.pw = o.pw; });
    // (only once this phone has worked with the shared data: the made-up sample on a new phone is thrown away)
    if (seen) Object.entries(old.registers || {}).forEach(([k, r]) => { if (!r.synced) db.registers[k] = r; });
    uniqueSymbols(db);
    s.db = db; LS.set(s.key(school), db); LS.set('kat:cloud:' + school, 1);
    this.lastSync = new Date(); this.err = null; s.emit();
  }
  listen() {
    const s = this.store, school = this.member.school_id;
    if (this.chan) this.sb.removeChannel(this.chan);
    this.chan = this.sb.channel('school-' + school).on('postgres_changes', { event: '*', schema: 'public', table: 'docs', filter: 'school_id=eq.' + school }, (p) => {
      const r = p.eventType === 'DELETE' ? p.old : p.new; if (!r || !r.coll) return;
      const key = r.coll + '\u0001' + r.id, db = s.db;
      if (p.eventType === 'DELETE') {
        delete this.last[key];
        if (CLOUD_MAPS.includes(r.coll)) delete db[r.coll][r.id];
        else if (CLOUD_LISTS.includes(r.coll)) db[r.coll] = db[r.coll].filter((x) => String(x.id) !== r.id);
      } else {
        const js = JSON.stringify(r.data); if (this.last[key] === js) return; this.last[key] = js;
        const d = Object.assign({}, r.data);
        if (CLOUD_MAPS.includes(r.coll)) { if (r.coll === 'registers') d.synced = true; db[r.coll][r.id] = d; }
        else if (CLOUD_LISTS.includes(r.coll)) {
          const ord = d._ord; delete d._ord; const i = db[r.coll].findIndex((x) => String(x.id) === r.id);
          if (i >= 0) { if (r.coll === 'staff' && db.staff[i].pw) d.pw = db.staff[i].pw; db[r.coll][i] = d; } else db[r.coll].splice(Math.min(ord, db[r.coll].length), 0, d);
        } else if (r.coll === 'settings') db.settings = d;
        else if (r.coll === 'log') db.log = d.list || [];
      }
      LS.set(s.key(school), db); this.lastSync = new Date(); s.emit();
    }).subscribe();
  }
  soon(ms) { if (!this.ready) return; clearTimeout(this._t); this._t = setTimeout(() => this.push(), ms == null ? 700 : ms); }
  // send only what changed since the last send
  async push(force) {
    const s = this.store; if ((!this.ready && !force) || !s.db || !this.member) return;
    if (s.offline) { if (s.pending()) this.hadWaiting = true; return; }
    if (this.busy) { this.again = true; return; }
    this.busy = true;
    try {
      const school = this.member.school_id, now = this.rows(s.db), up = [], gone = [];
      const waiting = Object.keys(s.db.registers).filter((k) => !s.db.registers[k].synced);
      Object.entries(now).forEach(([k, r]) => { const js = JSON.stringify(r.data); if (this.last[k] !== js) up.push(Object.assign({ school_id: school, updated_at: new Date().toISOString() }, r)); });
      Object.keys(this.last).forEach((k) => { if (!now[k]) gone.push(k); });
      for (let i = 0; i < up.length; i += 400) {
        const part = up.slice(i, i + 400);
        const { error } = await this.sb.from('docs').upsert(part, { onConflict: 'school_id,coll,id' });
        if (error) throw error;
        part.forEach((r) => { this.last[r.coll + '\u0001' + r.id] = JSON.stringify(r.data); });
      }
      for (const k of gone) {
        const [coll, id] = k.split('\u0001');
        const { error } = await this.sb.from('docs').delete().match({ school_id: school, coll, id });
        if (error) throw error; delete this.last[k];
      }
      const n = waiting.length; waiting.forEach((k) => { const r = s.db.registers[k]; if (r) { r.synced = true; r.sentAt = r.sentAt || stamp(); } });
      LS.set(s.key(school), s.db);
      this.lastSync = new Date(); this.err = null;
      if (n && this.hadWaiting) s.toast('Signal is back. ' + n + (n === 1 ? ' register was' : ' registers were') + ' sent to the office.');
      this.hadWaiting = false; s.emit();
    } catch (e) { this.err = e.message || String(e); this.hadWaiting = true; s.emit(); }
    finally { this.busy = false; if (this.again) { this.again = false; this.soon(200); } }
  }
}
const cloud = new Cloud();
