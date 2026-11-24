import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const OUT = process.env.OUT || 'dist';
const C = 'content';
const J = f => JSON.parse(fs.readFileSync(path.join(C, f), 'utf8'));
const S = { ...J('settings.json'), ...(process.env.FONT ? { font: process.env.FONT } : {}) }, H = J('home.json'), A = J('about.json'), P = J('pages.json');
const md = dir => fs.readdirSync(path.join(C, dir)).filter(f => f.endsWith('.md')).map(f => { const m = matter(fs.readFileSync(path.join(C, dir, f), 'utf8')); return { ...m.data, slug: f.replace(/\.md$/, ''), body: m.content }; });
const projects = md('projects').sort((a, b) => (a.order || 99) - (b.order || 99));
const posts = md('blog').sort((a, b) => String(b.date).localeCompare(String(a.date)));
const legal = md('legal');

const e = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const date = d => { const x = new Date(d); return isNaN(x) ? e(d) : x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
const dparts = d => { const x = new Date(d); return isNaN(x) ? ['', '', ''] : [x.toLocaleDateString('en-US', { month: 'short' }), String(x.getDate()).padStart(2, '0'), x.getFullYear()]; };

/* icons */
const ARW = `<svg class="ic" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="2" height="2"/><rect x="4" y="3" width="2" height="2"/><rect x="6" y="4" width="2" height="2"/><rect x="4" y="5" width="2" height="2"/><rect x="2" y="7" width="2" height="2"/></svg>`;
const MARK = `<svg class="mk" viewBox="0 0 99 200" fill="currentColor" aria-hidden="true"><path d="M48.8324 200H0V169.351C2.09552e-05 142.382 21.8636 120.52 48.8324 120.52V200Z" /><path d="M48.8324 79.4799H98.7021V120.52H48.8324V79.4799C21.8636 79.4799 0 57.6179 0 30.6491V0H48.8324V79.4799Z" /></svg>`;
const LOGO = `<svg class="logo-svg" viewBox="0 0 1280 200" fill="currentColor" role="img" aria-label="Elementa"><path d="M48.8324 200H0V169.351C2.09552e-05 142.382 21.8636 120.52 48.8324 120.52V200Z" /><path d="M48.8324 79.4799H98.7021V120.52H48.8324V79.4799C21.8636 79.4799 0 57.6179 0 30.6491V0H48.8324V79.4799Z" /><path d="M1135.96 200C1107.89 200 1091.31 184.225 1091.31 160.428C1091.31 136.364 1109.22 121.39 1139.97 118.984L1181.15 115.775V112.032C1181.15 90.107 1168.05 82.353 1150.4 82.353C1129.28 82.353 1117.25 91.7113 1117.25 107.487H1095.32C1095.32 80.2139 1117.78 62.2995 1151.47 62.2995C1183.82 62.2995 1205.75 79.4118 1205.75 114.706V196.791H1184.36L1181.68 175.668C1175 190.642 1157.08 200 1135.96 200ZM1143.18 180.481C1166.98 180.481 1181.42 164.973 1181.42 140.374V133.422L1147.99 136.096C1125.8 138.235 1116.71 146.791 1116.71 159.626C1116.71 173.529 1126.87 180.481 1143.18 180.481Z" /><path d="M1061.76 196.791H1036.63V87.1658H1010.96V66.0428H1036.63V25.1337H1061.76V66.0428H1087.43V87.1658H1061.76V196.791Z" /><path d="M906.899 196.791H881.765V66.0428H904.492L907.166 86.0963C915.455 71.123 932.033 62.2995 950.482 62.2995C984.974 62.2995 1000.75 83.4225 1000.75 116.845V196.791H975.615V122.46C975.615 95.9893 963.316 85.2941 944.065 85.2941C920.535 85.2941 906.899 102.139 906.899 127.54V196.791Z" /><path d="M803.96 200C765.457 200 738.987 172.193 738.987 131.551C738.987 90.6417 764.922 62.2995 802.89 62.2995C840.056 62.2995 864.388 87.9679 864.388 126.738V136.096L763.318 136.364C765.19 163.904 779.628 179.144 804.495 179.144C824.013 179.144 836.848 171.123 841.126 156.15H864.655C858.238 184.225 836.313 200 803.96 200ZM802.89 83.4225C780.965 83.4225 767.061 96.5241 763.853 119.519H839.254C839.254 97.861 825.083 83.4225 802.89 83.4225Z" /><path d="M552.809 196.791H527.675V66.0428H550.135L552.542 83.1551C559.226 70.8556 573.13 62.2995 591.579 62.2995C611.9 62.2995 626.338 72.4599 633.023 88.7701C639.173 72.4599 654.948 62.2995 675.269 62.2995C705.215 62.2995 723.397 81.0161 723.397 111.23V196.791H698.798V117.38C698.798 96.7915 687.301 85.0268 669.654 85.0268C650.67 85.0268 638.103 98.3957 638.103 119.251V196.791H613.237V117.112C613.237 96.5241 602.007 85.2941 584.36 85.2941C565.376 85.2941 552.809 98.3957 552.809 119.251V196.791Z" /><path d="M449.87 200C411.367 200 384.896 172.193 384.896 131.551C384.896 90.6417 410.832 62.2995 448.8 62.2995C485.966 62.2995 510.298 87.9679 510.298 126.738V136.096L409.228 136.364C411.1 163.904 425.538 179.144 450.405 179.144C469.923 179.144 482.757 171.123 487.036 156.15H510.565C504.148 184.225 482.223 200 449.87 200ZM448.8 83.4225C426.875 83.4225 412.971 96.5241 409.763 119.519H485.164C485.164 97.861 470.993 83.4225 448.8 83.4225Z" /><path d="M367.149 196.791H342.016V1.52588e-05H367.149V196.791Z" /><path d="M263.675 200C225.173 200 198.702 172.193 198.702 131.551C198.702 90.6417 224.638 62.2995 262.606 62.2995C299.772 62.2995 324.103 87.9679 324.103 126.738V136.096L223.034 136.364C224.905 163.904 239.344 179.144 264.21 179.144C283.729 179.144 296.563 171.123 300.841 156.15H324.371C317.953 184.225 296.028 200 263.675 200ZM262.606 83.4225C240.681 83.4225 226.777 96.5241 223.568 119.519H298.97C298.97 97.861 284.798 83.4225 262.606 83.4225Z" /><path d="M1279.75 25C1279.75 38.8071 1268.56 50 1254.75 50C1240.94 50 1229.75 38.8071 1229.75 25C1229.75 11.1929 1240.94 0 1254.75 0C1268.56 0 1279.75 11.1929 1279.75 25ZM1236 25C1236 35.3553 1244.39 43.75 1254.75 43.75C1265.1 43.75 1273.5 35.3553 1273.5 25C1273.5 14.6447 1265.1 6.25 1254.75 6.25C1244.39 6.25 1236 14.6447 1236 25Z" /><path d="M1250.35 38.8615H1244.36V11.5385H1254.92C1261.57 11.5385 1265.34 14.7508 1265.34 20.4C1265.34 23.9446 1263.82 26.4554 1260.79 28.0062L1265.59 38.8615H1259.06L1254.96 29.2985H1250.35V38.8615ZM1250.35 16.8554V24.0554H1254.89C1257.51 24.0554 1259.02 22.7262 1259.02 20.4C1259.02 18.1108 1257.58 16.8554 1254.92 16.8554H1250.35Z" /></svg>`;
const MENU_IC = `<svg class="mb-svg" viewBox="0 0 99 200" fill="currentColor" aria-hidden="true"><g class="mb-a"><path d="M48.8324 200H0V169.351C2.09552e-05 142.382 21.8636 120.52 48.8324 120.52V200Z" /></g><g class="mb-b"><path d="M48.8324 79.4799H98.7021V120.52H48.8324V79.4799C21.8636 79.4799 0 57.6179 0 30.6491V0H48.8324V79.4799Z" /></g></svg>`;
const CHEV = `<svg class="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>`;
const CHECK = `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M2 5.2l2 2 4-4.4"/></svg>`;
const SOC = {
  X: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M9.3 6.9 14.2 1.3h-1.2L8.8 6.1 5.5 1.3H1.6l5.1 7.4-5.1 5.9h1.2l4.4-5.1 3.6 5.1h3.9L9.3 6.9Zm-1.6 1.8-.5-.7-4.1-5.9h1.8l3.3 4.7.5.7 4.3 6.2H11.2L7.7 8.7Z"/></svg>`,
  Portfolio: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="8" cy="8" r="6.3"/><path d="M1.8 8h12.4M8 1.7c1.8 1.8 2.6 4 2.6 6.3S9.8 12.5 8 14.3C6.2 12.5 5.4 10.3 5.4 8S6.2 3.5 8 1.7Z"/></svg>`,
  Email: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="1.8" y="3.3" width="12.4" height="9.4" rx="1.5"/><path d="m2.3 4 5.7 4.6L13.7 4"/></svg>`
};
const BARS = n => `<span class="barcode" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i style="width:${[1, 2, 1, 3, 1, 1, 2][i % 7]}px"></i>`).join('')}</span>`;

/* atoms */
const lbl = t => `<div class="lbl">${ARW}<span>${e(t)}</span></div>`;
const btn = (t, href, cls = '') => `<a class="btn ${cls}" href="${href}"><span class="b-t"><span class="rl"><span data-t="${e(t)}">${e(t)}</span></span></span><span class="b-a">${ARW}</span></a>`;
const mono = (t, href, cls = '') => `<a class="mlink ${cls}" href="${href}"><span>${t}</span><i>${ARW}</i></a>`;
const hl = t => `<span class="hl">${e(t)}</span>`;
const brand = (cls = '') => `<span class="brand ${cls}">${LOGO}</span>`;
const monoAv = (size = 28) => S.founder_photo ? `<span class="mono-av ph" style="width:${size}px;height:${size}px"><img src="${e(size > 60 ? (S.founder_portrait || S.founder_photo) : S.founder_photo)}" alt="${e(S.founder_name)}" loading="lazy"></span>` : `<span class="mono-av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .45)}px">${e(S.founder_initial)}</span>`;
const pills = (arr, cls = '') => `<div class="pills ${cls}">${(arr || []).map(t => `<span>${e(t)}</span>`).join('')}</div>`;
const meter = (pct, n = 24) => `<span class="meter" style="--n:${n}">${Array.from({ length: n }, (_, i) => `<i class="${i < Math.round(n * pct / 100) ? 'on' : ''}"></i>`).join('')}</span>`;
const LOGOS = new Set(['beevia','buqqit','deyconnect','leetlogic','talkroots','taskure']);
const logoOf = n => { const k = String(n || '').toLowerCase().replace(/[^a-z]/g, ''); return LOGOS.has(k) ? `/brand/clients/${k}.svg` : ''; };
const img = (src, alt = '', cls = '', eager = false) => src ? `<img class="${cls}" src="${e(src)}" alt="${e(alt)}"${eager ? '' : ' loading="lazy"'} decoding="async">` : '';
const isVid = s => /\.(mp4|webm|mov)$/i.test(String(s || ''));
const media = (src, alt = '', eager = false) => !src ? '' : isVid(src) ? `<video class="js-vid" data-src="${e(src)}" muted loop playsinline preload="none"></video>` : img(src, alt, '', eager);
const scr = (tag, html, cls = '') => `<${tag} class="${cls} js-scr">${html}</${tag}>`;
const soc = (cls = 'socs') => `<div class="${cls}">${S.socials.map(s => `<a href="${e(s.url)}" target="_blank" rel="noopener" aria-label="${e(s.name)}">${SOC[s.name] || SOC.Portfolio}</a>`).join('')}</div>`;

const navItems = [['Home', '/'], ['About', '/about'], ['Case Studies', '/case-studies'], ['Blogs', '/blog'], ['404', '/404']];

function page({ title, desc = S.seo_description, body, preload = false, cls = '' }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${e(title)}</title><meta name="description" content="${e(desc)}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(desc)}"><meta property="og:image" content="/assets/og.jpg"><meta name="theme-color" content="#000000">
<link rel="icon" href="/favicon.svg"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${S.font === 'Satoshi' ? '' : 'Geist:wght@300;400;500;600&family='}Geist+Mono:wght@400;500&display=swap" rel="stylesheet">${S.font === 'Satoshi' ? '<link rel="preload" href="/fonts/satoshi-500.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/satoshi-400.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/fonts/satoshi.css">' : ''}
<link rel="stylesheet" href="/style.css">${S.font === 'Satoshi' ? '<style>html:root{--f:"Satoshi",system-ui,sans-serif}</style>' : ''}<script>document.documentElement.classList.add('js')</script></head>
<body class="${cls}">
${preload ? `<div class="pre" aria-hidden="true"><div class="pre-c"><div class="pre-row"><span class="pre-t js-pre-t">${e(S.wordmark)}®</span><span class="pre-n js-pre-n">000%</span></div><div class="pre-line"><i class="js-pre-l"></i><span class="pre-glow js-pre-g"></span></div></div></div><script>(function(){try{var n=performance.getEntriesByType('navigation')[0],r=n&&n.type==='reload';if(!r&&sessionStorage.getItem('el_intro')){var p=document.querySelector('.pre');p&&p.remove()}else sessionStorage.setItem('el_intro','1')}catch(e){}})()</script>` : ''}
<div class="tiles" aria-hidden="true">${Array.from({ length: 24 }, (_, i) => `<i style="--d:${((i * 7) % 24) * 22}ms"></i>`).join('')}</div>
<header class="top"><a class="logo" href="/">${brand()}</a><span class="tag">${e(S.tagline)}</span>
<nav>${navItems.map(([l, h]) => `<a href="${h}"><span class="rl"><span data-t="${e(l)}">${e(l)}</span></span></a>`).join('')}<a class="pill" href="/contact"><span class="rl"><span data-t="Contact us">Contact us</span></span></a></nav>
<button class="mbtn js-menu" aria-label="Open menu"><span class="mb-ic">${MENU_IC}</span><span>Menu</span></button><span class="prog js-prog"></span></header>
${menu()}
<main>${body}</main>
<script src="/vendor/lenis.min.js" defer></script><script src="/main.js" defer></script></body></html>`;
}

function menu() {
  return `<div class="menu" aria-hidden="true"><div class="m-scrim js-close"></div><aside class="m-panel" data-lenis-prevent>
<div class="m-card m-main"><div class="m-top"><span>Menu · 2026</span><span class="js-clock" data-tz="${e(S.timezone)}"></span></div>
<nav class="m-nav">${P.menu.links.map((l, i) => `<a href="${e(l.url)}" style="--i:${i}"><span>${e(l.label)}</span></a>`).join('')}</nav>
<div class="m-legal"><a href="/legal/privacy-policy">Privacy Policy</a><a href="/legal/terms-of-service">Terms of Service</a></div></div>
<div class="m-row"><div class="m-card m-contact"><span class="m-loc">${e(S.location)}</span><a class="m-mail" href="mailto:${e(S.email)}">${e(S.email)}</a>${soc()}</div>
<div class="m-card m-slots"><div class="m-sl"><span class="m-bars"><i></i><i></i></span><div><b>${e(S.slots_line)}</b><span>${e(S.slots_sub)}</span></div></div>${mono('Book <b>a call</b>', '/contact')}</div></div>
<div class="m-copy">${e(S.copyright)}</div></aside></div>`;
}

/* shared blocks */
const caseCard = (p, i) => `<a class="case" href="/case-studies/${p.slug}" data-cats="${e((p.categories || []).join('|'))}"><div class="c-media">${img(p.cover, p.title)}${p.video ? `<video class="js-vid" data-src="${e(p.video)}" muted loop playsinline preload="none" poster="${e(p.cover)}"></video>` : ''}</div>
${logoOf(p.title) ? `<span class="c-logo c-logo-i"><img src="${logoOf(p.title)}" alt="${e(p.title)}" loading="lazy" decoding="async"></span>` : `<span class="c-logo">${MARK}${e(p.title)}</span>`}<div class="c-low"><div><h3 class="js-hscr">${e(p.title)}.</h3><span class="c-meta">${e(p.year)} · ${e(p.meta)}</span></div>${pills(p.tags, 'outline')}</div></a>`;
const caseGrid = list => `<div class="cases">${list.map(caseCard).join('')}</div>`;

const faq = () => { const f = H.faq; return `<section class="sec faq"><div class="sec-l">${lbl(f.label)}</div><div class="center">${scr('h2', e(f.title), 'h78')}</div>
<div class="qa-list">${f.items.map((q, i) => `<details class="qa"${i ? '' : ' open'}><summary><span>${e(q.q)}</span><i>${CHEV}</i></summary><div class="ans"><p>${e(q.a)}</p></div></details>`).join('')}</div>
<div class="skip"><h3 class="js-scr">${e(f.skip_title)}</h3><span class="vline"></span><p class="mono-s">${e(f.skip_text)}</p>${btn(f.skip_button, '/contact')}</div></section>`; };

const cta = () => { const c = H.cta; return `<section class="ctas"><div class="cta-card"><div class="cta-bg">${img(c.image)}</div><div class="grain"></div>
<div class="cta-in">${brand('sm')}<span class="mono-s">${e(c.label)}</span>${scr('h2', e(c.title), 'h78')}<p>${e(c.text)}</p>
<div class="duo"><span class="duo-me">${monoAv(120)}</span><span class="duo-plus">+</span><span class="duo-you">${e(c.you)}</span></div>${mono(`${e(c.button_a)} <b>${e(c.button_b)}</b>`, '/contact')}</div></div></section>`; };

const contactForm = (subject = 'New project inquiry') => { const c = H.contact; return `<form class="cform js-form" data-subject="${e(subject)}" action="https://formsubmit.co/ajax/${e(S.email)}">
<label class="fld"><span>${ARW}Name</span><input name="name" placeholder="Jane Smith" required></label>
<label class="fld"><span>${ARW}Email</span><input type="email" name="email" placeholder="example@email.com" required></label>
<label class="fld sel"><span>${ARW}What are you looking for?</span><select name="looking_for">${c.looking_for.map(o => `<option>${e(o)}</option>`).join('')}</select>${CHEV}</label>
<label class="fld sel"><span>${ARW}What’s your budget?</span><select name="budget">${c.budgets.map(o => `<option>${e(o)}</option>`).join('')}</select>${CHEV}</label>
<label class="fld full"><span>${ARW}Tell us more</span><textarea name="message" rows="4" placeholder="Got anything else to add?"></textarea></label>
<div class="f-low"><button class="btn" type="submit"><span class="b-t"><span class="rl"><span data-t="${e(c.button)}">${e(c.button)}</span></span></span><span class="b-a">${ARW}</span></button><small>By submitting, you agree to our <a href="/legal/terms-of-service">Terms</a> and <a href="/legal/privacy-policy">Privacy Policy</a>.</small><span class="f-ok">Thanks. We will reply within a day.</span></div></form>`; };

const contactSec = () => `<section class="contact"><div class="ct-card"><div class="rail">${BARS(26)}<span class="vt js-clock" data-tz="${e(S.timezone)}"></span></div>
<div class="ct-in">${scr('h2', e(H.contact.title), 'h80')}${contactForm()}</div></div>${footer()}</section>`;

const footer = () => `<footer class="ft"><div class="ft-img">${img(H.contact.footer_image)}<div class="ft-brand">${brand()}<span class="tag">${e(S.tagline)}</span></div></div>
<div class="ft-r"><a class="ft-mail" href="mailto:${e(S.email)}">${e(S.email)}</a><span class="ft-loc">${e(S.location)}</span>
<div class="pills outline ft-nav">${[['Home', '/'], ['About', '/about'], ['Case Studies', '/case-studies'], ['Blogs', '/blog'], ['Contact', '/contact']].map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</div>
${soc()}<div class="ft-low"><div class="ft-copy">${e(S.copyright)}<br>All rights reserved.</div>
<div class="ft-links"><span class="ft-made">${MARK}Built by Elementa</span><a href="/legal/privacy-policy">Privacy Policy</a><a href="/legal/terms-of-service">Terms of Service</a></div>
<div class="ft-cred">${monoAv(24)}<span>${e(S.footer_credit)}</span></div></div></div></footer>`;

const services = () => { const s = H.services; return `<section class="sec svcs"><div class="sv-head"><div></div><div>${scr('h2', e(s.title), 'h80')}<p class="muted">${e(s.text)}</p>${btn(s.button, '/contact')}</div></div>
<div class="sv-list">${s.items.map((x, i) => `<div class="sv" style="--i:${i}"><div class="sv-n"><span class="js-roll" data-to="/0${i + 1}">/0${i + 1}</span><i class="dots" aria-hidden="true"></i></div>
<div class="sv-b"><h3>${e(x.title)}</h3><p>${e(x.text)}</p><div class="sv-img">${img(x.image, x.title)}</div>${pills(x.tags)}</div></div>`).join('')}</div></section>`; };

const pricing = () => { const p = H.pricing; return `<section class="sec pricing"><div class="sec-l">${lbl(p.label)}</div><div class="center">${scr('h2', `${e(p.title_a)}<br>${e(p.title_b)}`, 'h78')}</div>
<div class="plans">${p.plans.map((x, i) => `<div class="plan${i === 2 ? ' dark' : ''}">${i === 2 ? `<div class="pl-bg">${img(p.image)}</div>` : ''}<div class="pl-top"><span class="pl-n">0${i + 1}<i>${'•'.repeat(i + 1)}</i></span><span class="pl-t">Timeline: <b>${e(x.timeline)}</b></span></div>
<h3>${e(x.name)}${x.badge ? `<em>${e(x.badge)}</em>` : ''}<span>${e(x.sub)}</span></h3><ul>${x.items.map(t => `<li>${CHECK}${e(t)}</li>`).join('')}</ul>
<div class="pl-low">${btn(x.button, '/contact')}<span class="pl-p">$<b class="js-roll" data-to="${e(x.price)}">${e(x.price)}</b><small>${e(p.per)}</small></span></div></div>`).join('')}</div>
<div class="pr-note">${BARS(30)}<p>${e(p.note)}</p></div></section>`; };

const postRow = p => { const [m, d, y] = dparts(p.date); return `<a class="pr" href="/blog/${p.slug}"><div class="pr-b"><span class="mono-s">${e(p.category)}</span><h4>${e(p.title)}</h4><p>${e(p.excerpt)}</p><span class="mlink"><span>Read more</span><i>${ARW}</i></span></div><span class="dbadge"><small>${m}</small><b>${d}</b><small>${y}</small></span></a>`; };

const articles = (list, title = H.articles.title, text = H.articles.text) => `<section class="sec arts"><div class="sec-l">${lbl(H.articles.label)}</div><div class="center">${scr('h2', e(title), 'h78')}<p class="muted">${e(text)}</p>${btn(H.articles.button, '/blog')}</div>
<div class="arts-g"><div class="arts-img">${img(H.articles.image)}</div><div class="arts-l">${list.slice(0, 3).map(postRow).join('')}</div></div></section>`;

const results = (head = true) => { const r = H.results; return `<section class="sec results">${head ? `<div class="sec-l">${lbl(r.label)}</div><div class="split"><div></div><div>${scr('h2', `${e(r.title_a)} ${hl(r.title_hl)}.`, 'h80')}<p class="muted">${e(r.text)}</p></div></div>` : ''}
<div class="rs-g"><div class="rs-stats"><div class="st st1"><b class="js-roll" data-to="${e(r.stat_1)}">${e(r.stat_1)}</b><span>${e(r.stat_1_label)}</span></div><div class="st st2"><b class="js-roll" data-to="${e(r.stat_2)}">${e(r.stat_2)}</b><span>${e(r.stat_2_label)}</span></div></div>
<div class="rs-card js-car"><div class="rs-img">${img(r.image)}<div class="rs-top"><span class="rs-logo js-car-logo">${MARK}${e(r.items[0].name)}</span><span class="mono-s js-car-year">${e(r.items[0].year)}</span></div><div class="rs-who"><span class="rs-av">${img(r.image)}</span><span class="js-car-role">${e(r.items[0].role)}</span></div></div>
<div class="rs-txt">${r.items.map((x, i) => `<div class="rs-q${i ? '' : ' on'}" data-name="${e(x.name)}" data-year="${e(x.year)}" data-role="${e(x.role)}"><p>${e(x.text_white)} <span>${e(x.text_muted)}</span></p></div>`).join('')}
<div class="rs-nav"><div class="rs-dots">${r.items.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div><div class="rs-arr"><button class="js-prev" aria-label="Previous">${CHEV}</button><button class="js-next" aria-label="Next">${CHEV}</button></div></div></div></div></div></section>`; };

/* ---------------- pages ---------------- */
function home() {
  const h = H.hero, n = H.numbers, st = H.statement, sg = H.stages, ab = H.about, cs = H.cases, hw = H.how, f = H.feature, d = H.demo;
  const fp = projects.find(p => p.slug === f.project) || projects[0];
  const body = `
<section class="hero"><div class="h-media"><video class="js-vid hv" src="${e(h.video)}" poster="${e(h.poster)}" autoplay muted loop playsinline preload="auto"></video><div class="grain anim"></div><div class="h-shade"></div></div>
<div class="h-frame"><div class="rail">${BARS(30)}<span class="vt">${e(h.status)}</span><span class="vt js-clock" data-tz="${e(S.timezone)}"></span></div>
<span class="h-dots"><i></i><i></i><i></i></span>
<div class="h-in"><span class="mono-s h-eye">${e(h.eyebrow)}</span>
<h1 class="h90">${h.title_highlight ? `${hl(h.title_highlight)} ` : ''}${e(h.title_before)} <span class="hl rot js-rot" data-words="${e(JSON.stringify(h.rotating_words))}">${e(h.rotating_words[0])}</span> ${e(h.title_after)}</h1>
<p class="h-p">${e(h.text)}</p><div class="h-cta">${btn(h.button, '/contact')}${mono(`${e(h.demo_lead)} <b>${e(h.demo_strong)}</b>`, '#pricing')}</div></div>
<i class="h-grid" aria-hidden="true"></i>
<div class="h-card"><div class="hc-l"><div class="hc-top">${brand('sm')}</div><div class="hc-b"><span class="vt">//2026</span><div><p>${e(h.card_text)}</p><span>${e(h.card_name)}</span></div></div></div><div class="hc-img">${monoAv(84)}</div></div></div></section>

<section class="nums">${lbl(n.label)}<div class="nm-row"><h3>${e(n.title)}</h3><div class="nm-v">${meter(n.meter, 22)}<div><b class="js-roll" data-to="${e(n.value)}">${e(n.value)}</b><span class="mono-s">${e(n.value_label)}</span></div></div>
<div class="nm-logos"><div class="mq"><div class="mq-t">${[...n.clients, ...n.clients].map(c => logoOf(c) ? `<span class="lg lg-i"><img src="${logoOf(c)}" alt="${e(c)}" loading="lazy" decoding="async"></span>` : `<span class="lg">${e(c)}</span>`).join('')}</div></div></div></div></section>

<section class="stmt"><h2 class="h78 js-scr">${e(st.title)}</h2><span class="vline"></span><p>${e(st.text)}</p></section>

<section class="stages js-stages"><div class="sg-card"><div class="sg-img">${img(sg.image)}</div><div class="grain"></div>
<div class="sg-band js-band"><div class="sg-track">${[0, 1, 2, 3].map(() => sg.labels.map(l => `<span>${e(l)}</span>`).join('')).join('')}</div></div>
<p class="sg-txt">${e(sg.text)}</p>${BARS(34)}<span class="sg-brand">${brand('sm')}</span></div></section>

<section class="sec about-s"><div class="ab-l"><h2 class="h80 js-scr">${e(ab.title_a)} ${hl(ab.title_hl)}<br>${e(ab.title_b)}</h2></div>
<div class="ab-r"><div class="ab-stats"><div><b class="js-roll" data-to="${e(ab.stat_1)}">${e(ab.stat_1)}</b><span class="mono-s">${e(ab.stat_1_label)}</span></div><div><b><span class="js-roll" data-to="${e(ab.stat_2)}">${e(ab.stat_2)}</span> ${e(ab.stat_2_suffix)}</b><span class="mono-s">${e(ab.stat_2_label)}</span></div></div>
<p class="ab-p">${e(ab.text_a)} <span>${e(ab.text_b)}</span></p>${mono(e(ab.link), '/about')}</div></section>

<section class="sec cs-s"><div class="split"><div></div><div>${scr('h2', e(cs.title), 'h80')}<p class="muted">${e(cs.text_a)}<br>${e(cs.text_b)}</p></div></div>${caseGrid((projects.filter(p => p.homepage !== false).length >= 2 ? projects.filter(p => p.homepage !== false) : projects).slice(0, 6))}</section>

${services()}

<section class="sec how"><div class="sec-l">${lbl(hw.label)}</div><div class="split"><div></div><div><h2 class="h80 js-scr">${e(hw.title_a)}<br>${e(hw.title_b)}<br>${hl(hw.title_hl)}</h2></div></div>
<div class="steps">${hw.steps.map((s, i) => `<div class="step s${i + 1}"><span class="mono-s">0${i + 1}.</span><h4>${e(s.title).replace(' ', '<br>')}</h4><p>${e(s.text)}</p></div>`).join('')}
<div class="tile t1"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg></div><div class="tile t2"><svg viewBox="0 0 28 16" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M2 3l6 9 6-8 6 8 6-9"/></svg></div></div></section>

<section class="sec feat"><div class="ft-g"><div class="fc-img">${img('/assets/feature-car.jpg', fp.title)}<div class="fc-top">${brand('sm')}<span class="mono-s">${e(f.meta)}</span></div>${BARS(30)}</div>
<div class="fc fc-ch"><span class="chip">Challenge</span><p class="p24">${e(f.challenge_white)} <span>${e(f.challenge_muted)}</span></p><span class="mlink"><span>What it runs on</span><i>${ARW}</i></span></div>
<div class="fc fc-im"><span class="chip">Impact</span><div class="fc-v">${meter(80, 7)}<b class="js-roll" data-to="${e(f.value)}">${e(f.value)}</b></div><p class="mono-s">${e(f.value_text)}</p><div class="fc-live"><i class="dot"></i><b>${e(f.status)}</b><span>${e(f.status_text)}</span></div></div>
<div class="fc fc-st"><span class="chip">${e(f.stack_title)}</span><p class="mono-s">${e(f.stack_text)}</p>${pills(f.stack, 'outline')}</div>
<div class="fc fc-q"><p class="p24">${e(f.brief_white)} <span>${e(f.brief_muted)}</span></p><div class="who">${monoAv(28)}<div><b>${e(f.brief_by)}</b><span>${e(f.brief_role)}</span></div></div></div></div></section>

${results()}

<section class="sec demo"><a class="dm-card" href="${e(d.link)}"><div class="dm-img js-par">${img(d.image)}</div><div class="grain"></div><span class="pill-s">${e(d.pill)}</span><h3>${e(d.title)}</h3><p>${e(d.text)}</p><span class="dm-play js-follow">${ARW}</span><span class="dm-brand">${brand('sm')}</span></a></section>

<div id="pricing"></div>${pricing()}
${articles(posts)}
${faq()}
${cta()}
${contactSec()}`;
  return page({ title: `${S.studio_name} | Brands, products and AI agents for founders`, body, preload: true, cls: 'home' });
}

function about() {
  const h = A.hero, st = A.story, r = A.record, t = A.team;
  const body = `<section class="sec about-s ab-hero"><div class="ab-l"><h1 class="h90 js-scr">${e(h.title_a)} ${hl(h.title_hl)}<br>${e(h.title_b)}</h1><p class="side">${e(h.side_a)} <span>${e(h.side_b)}</span></p></div>
<div class="ab-r"><div class="ab-stats"><div><b class="js-roll" data-to="${e(h.stat_1)}">${e(h.stat_1)}</b><span class="mono-s">${e(h.stat_1_label)}</span></div><div><b class="js-roll" data-to="${e(h.stat_2)}">${e(h.stat_2)}</b><span class="mono-s">${e(h.stat_2_label)}</span></div></div>
<p class="ab-p">${e(h.text_a)} <span>${e(h.text_b)}</span></p>${mono(e(h.link), '/contact')}</div>
<div class="ab-photo"><div class="ab-pimg js-par">${img(h.image)}</div><span class="sg-brand">${brand('sm')}</span></div></section>
<section class="sec ab-nums"><div class="an-row">${A.numbers.map(x => `<div><b>${e(x.value)}</b><span class="mono-s">${e(x.label)}</span></div>`).join('')}</div></section>
<section class="sec ab-story"><div class="split"><div></div><div><p class="p24">${e(st.white)} <span>${e(st.muted)}</span></p><div class="who">${monoAv(28)}<div><b>${e(st.author)}</b><span>${e(st.role)}</span></div></div>
<div class="proc">${A.process.map(x => `<span>${e(x)}</span>`).join('')}</div><div class="stack"><h4>${e(A.stack_title)}</h4>${pills(A.stack, 'outline')}</div></div></div></section>
<section class="sec record"><div class="split"><div></div><div>${scr('h2', e(r.title), 'h80')}<p class="muted">${e(r.text)}</p><div class="rec">${r.rows.map(x => `<div class="rr"><b>${e(x.what)}</b><span>${e(x.who)}</span><span>${e(x.years)}</span></div>`).join('')}</div>${btn(r.button, '/contact')}</div></div></section>
<section class="sec team"><div class="split"><div></div><div>${scr('h2', e(t.title), 'h80')}<p class="muted">${e(t.text)}</p></div></div>
<div class="tm-g${t.cards.length === 1 ? ' one' : ''}">${t.cards.map((c, i) => `<div class="tm tm${i + 1}"><div class="tm-img">${c.image ? img(c.image, c.name) : `<span class="tm-mono">${e(S.founder_initial)}</span>`}</div><div class="tm-low"><b>${e(c.name)}</b><span class="tm-b">${brand('sm')}</span><span class="mono-s">${e(c.role)}<br>${e(c.sub)}</span></div></div>`).join('')}</div></section>
${services()}${pricing()}${faq()}${cta()}${contactSec()}`;
  return page({ title: `About | ${S.studio_name}`, body });
}

function caseStudies() {
  const c = P.case_studies; const ORDER = ['Branding', 'UI/UX', 'Websites', 'Motion', 'AI agents']; const used = [...new Set(projects.flatMap(p => p.categories || []))]; const tags = [...ORDER.filter(t => used.includes(t)), ...used.filter(t => !ORDER.includes(t))];
  const body = `<section class="sec cs-hero"><div class="csh-l"><h1 class="h80 js-scr">${e(c.title)}</h1><p class="muted">${e(c.text)}</p></div>
<div class="csh-r"><input class="srch js-search" placeholder="${e(c.search)}"><span class="mono-s">${e(c.filter_label)}</span><div class="pills filt js-filt"><button class="on" data-t="">${e(c.all)}</button>${tags.map(t => `<button data-t="${e(t)}">${e(t)}</button>`).join('')}</div>
<div class="nm-v">${meter(100, 22)}<div><b class="js-roll js-count-shown" data-to="${projects.length}">${projects.length}</b><span class="mono-s">${e(c.meter_label)}</span></div></div></div></section>
<section class="sec cs-list">${caseGrid(projects)}</section>${faq()}${cta()}${contactSec()}`;
  return page({ title: `Case Studies | ${S.studio_name}`, body });
}

function caseStudy(p) {
  const c = P.case_study; const more = projects.filter(x => x.slug !== p.slug).slice(0, 2);
  const stats = [[p.stat_1, p.stat_1_label], [p.stat_2, p.stat_2_label]].filter(s => s[0]);
  const body = `<section class="pd-hero"><div class="pd-bg js-par">${media(p.hero_image, p.title, true)}</div><div class="pd-shade"></div>
<div class="pd-in"><div></div><div><h1 class="h90 js-scr">${e(p.title)}.</h1><p class="muted">${e(p.summary)}</p><span class="mono-s">${e(c.team_label)}</span><div class="pd-team"><div class="who">${monoAv(53)}<div><b>${e(S.founder_name)}</b><span>${e(p.role)}</span></div></div></div></div></div><span class="pd-logo">${MARK}${e(p.title)}</span></section>
<section class="sec pd-info"><div class="split"><div></div><div><div class="pd-tbl"><div><span class="mono-s">${e(c.client)}</span><b>${e(p.title)}</b></div><div><span class="mono-s">${e(c.year)}</span><b>${e(p.year)}</b></div><div><span class="mono-s">${e(c.role)}</span><b>${e(p.role)}</b></div><div><span class="mono-s">${e(c.work)}</span>${pills(p.work, 'outline')}</div></div>
<p class="p24">${e(p.intro_white)} <span>${e(p.intro_muted)}</span></p>${p.link ? btn(c.live, p.link) : btn('Start a similar project', '/contact')}</div></div></section>
<section class="pd-wide"><div class="pdw js-par">${media(p.image_wide, p.title)}</div></section>
<section class="sec pd-prob"><div class="sec-l">${lbl(c.problem_label)}</div><div class="split"><div></div><div>${scr('h2', e(c.problem_title), 'h80')}<p class="muted">${e(p.problem)}</p></div></div>
<div class="pd-two"><div>${media(p.image_a, p.title)}</div><div>${media(p.image_b, p.title)}</div></div></section>
<section class="sec pd-res"><div class="sec-l">${lbl(c.results_label)}</div><div class="split"><div></div><div>${stats.length ? `<div class="ab-stats">${stats.map(s => `<div><b class="js-roll" data-to="${e(s[0])}">${e(s[0])}</b><span class="mono-s">${e(s[1])}</span></div>`).join('')}</div>` : ''}
<p class="p28">${e(p.results_white)}</p><p class="muted">${e(p.results_muted)}</p></div></div></section>
${(p.gallery || []).filter(Boolean).map(g => `<section class="pd-wide"><div class="pdw js-par">${media(g, p.title)}</div></section>`).join('')}${p.body && p.body.trim() ? `<section class="sec post-b"><div class="split"><div></div><div class="md">${marked.parse(p.body)}</div></div></section>` : ''}
<section class="sec pd-more"><div class="split"><div></div><div>${scr('h2', e(c.more_title), 'h80')}<p class="muted">${e(c.more_text)}</p>${mono(e(c.all), '/case-studies')}</div></div>${caseGrid(more)}</section>
${faq()}${cta()}${contactSec()}`;
  return page({ title: `${p.title} | ${S.studio_name}`, desc: p.summary, body });
}

function blog() {
  const b = P.blog;
  const body = `<section class="sec bl"><div class="bl-l"><h1 class="h80 js-scr">${e(b.title)}</h1><p class="muted">${e(b.text)}</p>${soc()}</div>
<div class="bl-r">${posts.map(p => { const [m, d, y] = dparts(p.date); return `<a class="bp" href="/blog/${p.slug}"><span class="dbadge"><small>${m}</small><b>${d}</b><small>${y}</small></span><h3>${e(p.title)}</h3><div class="bp-img">${img(p.cover, p.title)}</div><div class="bp-low"><p>${e(p.excerpt)}</p><span class="mono-s">${date(p.date)} · ${e(p.category)}</span></div><span class="mlink"><span>${e(b.read)}</span><i>${ARW}</i></span></a>`; }).join('')}</div></section>
${cta()}${contactSec()}`;
  return page({ title: `Blog | ${S.studio_name}`, body });
}

function post(p) {
  const pp = P.post; const others = posts.filter(x => x.slug !== p.slug);
  const body = `<section class="pd-hero post-h"><div class="pd-bg js-par">${img(p.cover, p.title, '', true)}</div><div class="pd-shade"></div>
<div class="pd-in"><span class="mono-s rd">${e(p.read)} mins read</span><div><h1 class="h90 js-scr">${e(p.title)}</h1><p class="muted">${e(p.excerpt)}</p><span class="mono-s">${e(pp.written_by)}</span><div class="pd-team"><div class="who">${monoAv(53)}<div><b>${e(S.founder_name)}</b><span>${e(S.founder_role)}</span></div></div></div></div></div></section>
<section class="sec pd-info"><div class="split"><div></div><div><div class="pd-tbl two"><div><span class="mono-s">${e(pp.subject)}</span><b>${e(p.category)}</b></div><div><span class="mono-s">${e(pp.date)}</span><b>${date(p.date)}</b></div></div>
<p class="p24">${e(p.lead)} <span>${e(p.lead_muted)}</span></p><p class="muted">${e(p.detail)}</p></div></div></section>
<section class="pd-wide"><div class="pdw js-par">${img(p.image, p.title)}</div></section>
<section class="sec post-b"><div class="split"><div></div><div class="md">${marked.parse(p.body || '')}<span class="mono-s">${e(pp.written_by)}</span><div class="who">${monoAv(53)}<div><b>${e(S.founder_name)}</b><span>${e(S.founder_role)}</span></div></div>${soc()}
<div class="news"><h3>${e(pp.newsletter_title)}</h3><p class="muted">${e(pp.newsletter_text)}</p><form class="nl js-form" data-subject="Newsletter signup" action="https://formsubmit.co/ajax/${e(S.email)}"><label class="fld"><span>${ARW}Email</span><input type="email" name="email" placeholder="example@email.com" required></label><div class="f-low"><button class="btn" type="submit"><span class="b-t"><span class="rl"><span data-t="Subscribe">Subscribe</span></span></span><span class="b-a">${ARW}</span></button><small>By submitting, you agree to our <a href="/legal/terms-of-service">Terms</a> and <a href="/legal/privacy-policy">Privacy Policy</a>.</small><span class="f-ok">You are on the list.</span></div></form></div></div></div></section>
${articles(others, pp.latest, pp.latest_text)}${faq()}${cta()}${contactSec()}`;
  return page({ title: `${p.title} | ${S.studio_name}`, desc: p.excerpt, body });
}

function contact() {
  const c = P.contact;
  const body = `<section class="cp-hero"><div class="pd-bg">${img(c.image, '', '', true)}</div><div class="pd-shade"></div><div class="cp-in"><div class="cp-l">${lbl(c.label)}<h1 class="h80 js-scr">${e(c.title)}</h1><p>${e(c.text)} <span>${e(c.text_muted)}</span></p>
<div class="cp-info"><span class="mono-s">Email</span><a href="mailto:${e(S.email)}">${e(S.email)}</a><span class="mono-s">Location</span><b>${e(S.location)}</b>${soc()}</div></div>
<form class="cform js-form" data-subject="New project inquiry" action="https://formsubmit.co/ajax/${e(S.email)}"><label class="fld"><span>${ARW}Name</span><input name="name" placeholder="Jane Smith" required></label><label class="fld"><span>${ARW}Email</span><input type="email" name="email" placeholder="example@email.com" required></label>
<label class="fld sel"><span>${ARW}What are you looking for?</span><select name="looking_for">${H.contact.looking_for.map(o => `<option>${e(o)}</option>`).join('')}</select>${CHEV}</label><label class="fld sel"><span>${ARW}What’s your budget?</span><select name="budget">${H.contact.budgets.map(o => `<option>${e(o)}</option>`).join('')}</select>${CHEV}</label>
<label class="fld sel full"><span>${ARW}${e(c.timeline_label)}</span><select name="timeline">${c.timelines.map(o => `<option>${e(o)}</option>`).join('')}</select>${CHEV}</label><label class="fld full"><span>${ARW}Tell us more</span><textarea name="message" rows="3" placeholder="Got anything else to add?"></textarea></label>
<div class="f-low"><button class="btn" type="submit"><span class="b-t"><span class="rl"><span data-t="Send request">Send request</span></span></span><span class="b-a">${ARW}</span></button><small>By submitting, you agree to our <a href="/legal/terms-of-service">Terms</a> and <a href="/legal/privacy-policy">Privacy Policy</a>.</small><span class="f-ok">Thanks. We will reply within a day.</span></div></form></div></section>
<section class="sec cp-note"><div class="sec-l">${lbl(c.reviews_label)}</div><div class="split"><div></div><div>${scr('h2', `${e(c.reviews_title)} ${hl(c.reviews_hl)}.`, 'h80')}<p class="muted">${e(c.results_text)}</p></div></div></section>
${results(false)}${faq()}${cta()}`;
  return page({ title: `Contact | ${S.studio_name}`, body });
}

function notFound() {
  const n = P.notfound;
  const body = `<section class="nf"><div class="nf-card"><div class="nf-bg">${img(n.image, '', '', true)}</div><div class="grain"></div><div class="nf-box"><span class="mono-s">${e(n.kicker_a)}<br>${e(n.kicker_b)}</span><b class="js-scr">404</b><p>${e(n.text)}</p>${btn(n.button, '/')}</div></div></section>${faq()}${cta()}${contactSec()}`;
  return page({ title: `Page not found | ${S.studio_name}`, body });
}

function legalPage(l) {
  const body = `<section class="sec legal"><div class="split"><div><a class="mlink back" href="/"><span>${e(P.legal.back)}</span><i>${ARW}</i></a></div><div><h1 class="h80 js-scr">${e(l.title)}</h1><span class="mono-s">${e(P.legal.updated)}</span><div class="md">${marked.parse(l.body || '')}</div></div></div></section>${contactSec()}`;
  return page({ title: `${String(l.title).replace(/\.$/, '')} | ${S.studio_name}`, body });
}

/* write */
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync('public', OUT, { recursive: true });
const w = (f, html) => { const p = path.join(OUT, f); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, html); };
w('index.html', home());
w('about.html', about());
w('case-studies/index.html', caseStudies());
projects.forEach(p => w(`case-studies/${p.slug}.html`, caseStudy(p)));
w('blog/index.html', blog());
posts.forEach(p => w(`blog/${p.slug}.html`, post(p)));
w('contact.html', contact());
w('404.html', notFound());
legal.forEach(l => w(`legal/${l.slug}.html`, legalPage(l)));
console.log(`Built ${projects.length} projects, ${posts.length} posts.`);
