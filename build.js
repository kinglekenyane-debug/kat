// Builds the deployable KAT website into site/: index.html + local libraries + icons + manifest + service worker (works offline, installs to the home screen)
const fs = require('fs'), path = require('path'); const d = __dirname; const L = process.env.LIBS || path.join(d, 'node_modules');
const out = path.join(d, 'docs'); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'lib'), { recursive: true }); fs.mkdirSync(path.join(out, 'icons'), { recursive: true });
const libs = {
  'https://cdn.jsdelivr.net/npm/preact@10.19.3/dist/preact.umd.js': 'preact/dist/preact.umd.js',
  'https://cdn.jsdelivr.net/npm/preact@10.19.3/hooks/dist/hooks.umd.js': 'preact/hooks/dist/hooks.umd.js',
  'https://cdn.jsdelivr.net/npm/htm@3.1.1/dist/htm.umd.js': 'htm/dist/htm.umd.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js': 'xlsx/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js': 'jspdf/dist/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js': 'jspdf-autotable/dist/jspdf.plugin.autotable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js': 'pdfjs-dist/build/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js': 'pdfjs-dist/build/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js': '@supabase/supabase-js/dist/umd/supabase.js',
};
// the shared school database. The publishable key is meant to be public: the database's own rules decide who may read what.
const CLOUD = { url: 'https://jyqkvnnamcawgepqloom.supabase.co', key: 'sb_publishable_OacFCbKUrU294VpMEpt_lQ_rE5_pgSk' };
const crest = 'data:image/jpeg;base64,' + fs.readFileSync(process.env.CREST || path.join(d, 'assets', 'crest.jpeg')).toString('base64');
let js = ['core.js', 'tools.js', 'timetable.js', 'cloud.js', 'admin.js', 'ui.js'].map((f) => fs.readFileSync(path.join(d, 'src', f), 'utf8')).join('\n');
js = js.replace("'__CREST__'", JSON.stringify(crest));
let html = fs.readFileSync(path.join(d, 'src/index.html'), 'utf8').replace('/*STYLE*/', () => fs.readFileSync(path.join(d, 'src/style.css'), 'utf8'))
  .replace('<script>\n/*SCRIPT*/', () => '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>\n<script>window.KAT_CLOUD = ' + JSON.stringify(CLOUD) + ';</script>\n<script>\n/*SCRIPT*/').replace('/*SCRIPT*/', () => js);
const files = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon.svg'];
for (const [url, rel] of Object.entries(libs)) { const name = path.basename(rel); fs.copyFileSync(path.join(L, rel), path.join(out, 'lib', name)); html = html.split(url).join('lib/' + name); files.push('lib/' + name); }
const VERSION = 'kat-' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  + '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="icons/icon-192.png">'
  + '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="KAT"><meta name="description" content="KAT, Keeping Attendance Today. Attendance registers for Ficksburg High School.">'
  + html.split('<div id="teng">')[0] + '</head><body style="margin:0"><div id="teng">' + html.split('<div id="teng">').slice(1).join('<div id="teng">')
  + '<script>if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));</script></body></html>';
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.writeFileSync(path.join(out, 'manifest.webmanifest'), JSON.stringify({ name: 'KAT · Keeping Attendance Today', short_name: 'KAT', start_url: './', scope: './', display: 'standalone', background_color: '#12329A', theme_color: '#12329A', description: 'Attendance registers for Ficksburg High School', icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' }, { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }, { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }] }, null, 1));
fs.writeFileSync(path.join(out, 'sw.js'), `// KAT offline support: keeps a copy of the app on the phone so it opens without signal
const CACHE = '${VERSION}'; const FILES = ${JSON.stringify(files)};
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname.endsWith('supabase.co')) return; // the shared database: always live, never a saved copy
  if (url.origin !== location.origin) { e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return res; }).catch(() => r))); return; }
  // own files: use the network when there is signal (so updates arrive), fall back to the saved copy offline
  e.respondWith(fetch(e.request).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, cp)); return res; }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html'))));
});
`);
fs.writeFileSync(path.join(out, 'icons/icon.svg'), fs.readFileSync(path.join(d, 'assets', 'kat-icon.svg'), 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/, ''));
for (const n of [192, 512]) fs.copyFileSync(path.join(d, 'assets', 'icon-' + n + '.png'), path.join(out, 'icons', 'icon-' + n + '.png'));
fs.writeFileSync(path.join(out, '_headers'), '/sw.js\n  Cache-Control: no-cache\n/index.html\n  Cache-Control: no-cache\n');
console.log('site built', VERSION, files.length, 'files');
