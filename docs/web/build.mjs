// snippets.mjs から 4 言語分の印刷用 HTML を生成する。
// 各言語ファイルにはその言語のコードだけが入る (使う言語だけ印刷する想定)。
// 出力: docs/web/dist/{kotlin,python,java,cpp}.html, index.html
// テーマ比較用に docs/web/samples/python-<theme>.html も生成する。
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { snippets, LANGS } from './snippets.mjs'
import { ioPatterns } from './io.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const distDir = join(here, 'dist')
const sampleDir = join(here, 'samples')
mkdirSync(distDir, { recursive: true })
mkdirSync(sampleDir, { recursive: true })

const DEFAULT_THEME = 'category' // dist/ に採用するテーマ

const CAT_LABEL = {
  ds: 'データ構造', graph: 'グラフ', math: '数学', search: '探索',
  util: 'ユーティリティ', dp: '動的計画法', string: '文字列', geometry: '幾何',
  io: '入力',
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const hlComments = (escaped, langId) => {
  const marker = langId === 'python' ? '#' : '//'
  return escaped
    .split('\n')
    .map((line) => {
      const i = line.indexOf(marker)
      if (i < 0) return line
      return line.slice(0, i) + '<span class="cm">' + line.slice(i) + '</span>'
    })
    .join('\n')
}

const MONO_FONT = `ui-monospace,Menlo,Consolas,"Noto Sans Mono",monospace`

const baseCss = `
@page { size: A4; margin: 9mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family:"Hiragino Sans","Noto Sans JP",-apple-system,sans-serif;
       color:#000; margin:0; font-size:9px; line-height:1.35; }
.mast { display:flex; align-items:baseline; gap:10px; padding-bottom:4px; margin-bottom:7px; }
.mast h1 { font-size:16px; margin:0; }
.mast .lang { font-family:${MONO_FONT}; font-weight:700; font-size:11px; padding:1px 8px; }
.mast .note { margin-left:auto; font-size:8px; color:#666; text-align:right; line-height:1.3; }
.legend { font-size:8px; color:#555; margin:-3px 0 7px; }
.cols { columns:2; column-gap:6mm; }
.block { break-inside:avoid; margin-bottom:7px; padding-bottom:5px; }
.bh { display:flex; align-items:baseline; gap:5px; flex-wrap:wrap; }
.bh .cat { font-size:7px; letter-spacing:0.5px; padding:0 4px; border-radius:2px; }
.bh .title { font-size:11px; font-weight:700; }
.bh .sub { font-size:8px; color:#555; }
.bh .cx { margin-left:auto; font-family:${MONO_FONT}; font-weight:700; font-size:8.5px;
          padding:0 4px; white-space:nowrap; }
.lead { font-size:8.6px; margin:3px 0 4px; }
pre { margin:0; font-family:${MONO_FONT}; }
.dia { font-size:8.4px; line-height:1.28; padding:3px 6px; margin-bottom:4px;
       white-space:pre; overflow:hidden; }
.code { font-size:8px; line-height:1.32; padding:2px 0 2px 6px; white-space:pre; overflow:hidden; }
.code .cm { color:#999; }
.pf { margin:4px 0 0; padding-left:13px; }
.pf li { font-size:8.2px; margin:1px 0; }
@media screen {
  body { background:#999; padding:14px; }
  .sheet { background:#fff; max-width:200mm; margin:0 auto; padding:9mm;
           box-shadow:0 1px 6px rgba(0,0,0,.4); }
}
/* 若干のレスポンシブ: 狭い画面は 1 段組・少し拡大・コードは横スクロール (印刷は A4 2 段組のまま) */
@media screen and (max-width:760px) {
  body { background:#fff; padding:0; }
  .sheet { max-width:none; box-shadow:none; padding:16px; font-size:11px; }
  .cols { columns:1; column-rule:none; }
  .dia, .code { overflow-x:auto; }
  .mast .note { font-size:9px; }
}`

const CAT_COLOR = {
  ds: ['#ede9fe', '#6d28d9', '#7c3aed'],
  graph: ['#dbeafe', '#1d4ed8', '#2563eb'],
  math: ['#d1fae5', '#047857', '#059669'],
  search: ['#ffedd5', '#c2410c', '#ea580c'],
  util: ['#cffafe', '#0e7490', '#0891b2'],
  dp: ['#fce7f3', '#be185d', '#db2777'],
  string: ['#e0e7ff', '#4338ca', '#4f46e5'],
  geometry: ['#fee2e2', '#b91c1c', '#dc2626'],
  io: ['#ccfbf1', '#0f766e', '#14b8a6'],
}
const catColorCss = Object.entries(CAT_COLOR)
  .map(([k, [bg, fg, line]]) =>
    `.cat-${k} .bh .cat{background:${bg};color:${fg}} .cat-${k} .code{border-left-color:${line}}`)
  .join('\n')

const THEMES = {
  // A. モノクロ・最密 (黒帯ヘッダ)
  mono: `
.cols { column-rule:0.5px solid #ccc; }
.block { border-bottom:0.5px solid #ddd; }
.mast { border-bottom:2px solid #000; }
.mast .lang { background:#000; color:#fff; }
.bh .cat { background:#eee; color:#444; }
.bh .cx { border:1px solid #000; }
.dia { background:#f6f6f6; border-left:2px solid #999; }
.code { border-left:2px solid #000; }`,
  // B. ヘアライン・余白広め (インク最小)
  hairline: `
body { line-height:1.45; }
.cols { column-rule:0.5px solid #e3e3e3; column-gap:7mm; }
.block { border-bottom:0.5px solid #eee; margin-bottom:9px; padding-bottom:7px; }
.mast { border-bottom:1px solid #000; }
.mast .lang { border:1.5px solid #000; padding:0 7px; }
.bh .cat { border:0.5px solid #bbb; color:#666; }
.bh .cx { color:#000; }
.dia { border-left:1px solid #ddd; color:#333; }
.code { border-left:1px solid #ccc; }
.code .cm { color:#aaa; }`,
  // C. カテゴリ色分け
  category: `
.cols { column-rule:0.5px solid #ddd; }
.block { border-bottom:0.5px solid #eee; }
.mast { border-bottom:2px solid #111; }
.mast .lang { background:#111; color:#fff; }
.bh .cx { border:1px solid #888; }
.dia { background:#fafafa; border-left:2px solid #ccc; }
.code { border-left:2px solid #ccc; }
${catColorCss}`,
}

const renderBlock = (s, langId) => {
  const code = hlComments(esc(s.code[langId]), langId)
  return `<section class="block cat-${s.cat}">
  <div class="bh">
    <span class="cat">${CAT_LABEL[s.cat] ?? s.cat}</span>
    <span class="title">${esc(s.title)}</span>
    <span class="sub">${esc(s.sub)}</span>
    <span class="cx">${esc(s.cx)}</span>
  </div>
  <p class="lead">${esc(s.lead)}</p>
  <pre class="dia">${esc(s.diagram)}</pre>
  <pre class="code">${code}</pre>
  <ul class="pf">${s.pitfalls.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
</section>`
}

const renderIoBlock = (p, langId) => {
  const code = hlComments(esc(p.code[langId]), langId)
  const sample = p.sample ? `<pre class="dia">${esc(p.sample)}</pre>` : ''
  return `<section class="block cat-io">
  <div class="bh">
    <span class="cat">入力</span>
    <span class="title">${esc(p.title)}</span>
    <span class="sub">${esc(p.sub)}</span>
  </div>
  <p class="lead">${esc(p.note)}</p>
  ${sample}<pre class="code">${code}</pre>
</section>`
}

const shell = (title, h1, lang, note, legend, blocks, themeId) => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${baseCss}\n${THEMES[themeId]}</style>
</head>
<body>
<div class="sheet">
  <div class="mast">
    <h1>${h1}</h1>
    <span class="lang">${lang.label}</span>
    <span class="note">${note}</span>
  </div>
  <div class="legend">${legend}</div>
  <div class="cols">
${blocks}
  </div>
</div>
</body>
</html>`

const page = (lang, themeId) =>
  shell(
    `競プロ早見表 — ${lang.label}`,
    '競プロ早見表',
    lang,
    `${snippets.length} topics · 印刷対応 (A4)`,
    '各項目は 使う場面 → 図解 → コード → 罠 の順。<span class="cm">// 灰色はコメント</span>、計算量は右上。',
    snippets.map((s) => renderBlock(s, lang.id)).join('\n'),
    themeId
  )

const ioPage = (lang, themeId) =>
  shell(
    `入力テンプレ — ${lang.label}`,
    '入力テンプレ',
    lang,
    `${ioPatterns.length} patterns · 印刷対応 (A4)`,
    '入力構成の定番パターン。先頭の「テンプレ (高速 I/O)」をコピーして本体に各パターンを埋める。',
    ioPatterns.map((p) => renderIoBlock(p, lang.id)).join('\n'),
    themeId
  )

// dist: 全言語 × デフォルトテーマ (アルゴリズム早見 + 入力テンプレの 2 ページ)
for (const lang of LANGS) {
  writeFileSync(join(distDir, `${lang.id}.html`), page(lang, DEFAULT_THEME))
  writeFileSync(join(distDir, `io-${lang.id}.html`), ioPage(lang, DEFAULT_THEME))
}

// samples: Python × 全テーマ (比較用)
const python = LANGS.find((l) => l.id === 'python')
for (const themeId of Object.keys(THEMES)) {
  writeFileSync(join(sampleDir, `python-${themeId}.html`), page(python, themeId))
}

// index
const algoLinks = LANGS.map((l) => `<li><a href="${l.id}.html">${l.label}</a> — ${l.id}.html</li>`).join('\n')
const ioLinks = LANGS.map((l) => `<li><a href="io-${l.id}.html">${l.label}</a> — io-${l.id}.html</li>`).join('\n')
const index = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>競プロ早見表 (Kotlin / Python / Java / C++)</title>
<style>
:root{color-scheme:light dark;}
body{font-family:-apple-system,"Hiragino Sans","Noto Sans JP",sans-serif;
     max-width:680px;margin:0 auto;padding:32px 18px 60px;line-height:1.6;color:#1a1a1a;}
h1{font-size:22px;margin:0 0 4px;}
.sub{color:#666;margin:0 0 20px;}
h2{font-size:15px;margin:22px 0 6px;}
li{margin:7px 0;} a{font-weight:600;text-decoration:none;color:#1d4ed8;}
a:hover{text-decoration:underline;}
ul{margin:6px 0;padding-left:20px;}
.cols2{display:flex;gap:40px;flex-wrap:wrap;}
.cols2>div{flex:1 1 240px;}
.foot{color:#888;font-size:12px;margin-top:28px;}
@media (max-width:480px){body{padding:20px 16px 48px;} h1{font-size:20px;}}
</style></head>
<body>
<h1>競プロ早見表</h1>
<p class="sub">競技プログラミングの定番アルゴリズムと入力パターンを Kotlin / Python / Java / C++ でまとめた早見表です。使う言語のページを開いてください（A4 印刷にも対応）。</p>
<div class="cols2">
<div>
<h2>アルゴリズム早見表 (${snippets.length} topics)</h2>
<ul>
${algoLinks}
</ul>
</div>
<div>
<h2>入力テンプレ (${ioPatterns.length} patterns)</h2>
<ul>
${ioLinks}
</ul>
</div>
</div>
<p class="foot"><a href="https://github.com/elzup/kyoupro-lib">GitHub: elzup/kyoupro-lib</a></p>
</body></html>`
writeFileSync(join(distDir, 'index.html'), index)

console.log(`built ${LANGS.length} lang pages + ${LANGS.length} io pages (theme:${DEFAULT_THEME}) + ${Object.keys(THEMES).length} python theme samples`)
