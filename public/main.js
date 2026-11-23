(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const html = document.documentElement, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=?/<>[]{}アイウエオカキクケコサシスセソタチツテトナニヌネ';
  const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

  /* ---------- scramble text ---------- */
  function scramble(el, dur) {
    if (reduce) return;
    const nodes = []; const walk = n => n.childNodes.forEach(c => { if (c.nodeType === 3 && c.textContent.trim()) nodes.push([c, c.textContent]); else if (c.nodeType === 1) walk(c); });
    walk(el); if (!nodes.length) return;
    const total = nodes.reduce((a, [, t]) => a + t.length, 0); const D = dur || Math.min(1100, 450 + total * 9); const t0 = performance.now();
    let last = 0;
    const tick = t => {
      const p = Math.min(1, (t - t0) / D);
      if (t - last > 45 || p === 1) {
        last = t; let k = 0;
        nodes.forEach(([n, s]) => { let out = ''; for (let i = 0; i < s.length; i++, k++) { const ch = s[i]; out += (ch === ' ' || k / total < p * 1.15 - .15) ? ch : rnd(); } n.textContent = out; });
      }
      if (p < 1) requestAnimationFrame(tick); else nodes.forEach(([n, s]) => n.textContent = s);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- reveal observer ---------- */
  const io = new IntersectionObserver(es => es.forEach(x => {
    if (!x.isIntersecting) return; const el = x.target; io.unobserve(el);
    el.classList.add('in');
    if (el.classList.contains('js-scr')) scramble(el);
    if (el.classList.contains('js-roll')) roll(el);
  }), { rootMargin: '0px 0px -10% 0px' });

  /* rolling digits */
  function prepRoll(el) {
    const raw = el.dataset.to || el.textContent; let k = 0;
    el.setAttribute('aria-label', raw);
    el.innerHTML = [...raw].map(ch => /[0-9]/.test(ch) ? `<span class="dg"><span class="dc" style="--dd:${(k++ * .06).toFixed(2)}s">${Array.from({ length: 20 }, (_, i) => `<span>${i % 10}</span>`).join('')}</span></span>` : `<span>${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  }
  function roll(el) { const ds = [...(el.dataset.to || '')].filter(c => /[0-9]/.test(c)); el.querySelectorAll('.dc').forEach((c, i) => { c.style.transform = `translateY(-${(10 + +ds[i]) * 5}%)`; }); }
  if (!reduce) $$('.js-roll').forEach(prepRoll);

  /* auto reveal targets */
  const rvSel = '.lbl,.muted,.p24,.p28,.ab-p,.side,.nm-row>*,.stmt p,.sv-b,.step,.fc,.rs-card,.rs-stats .st,.plan,.pr,.qa,.skip>*,.cta-in>*,.cform>*,.ft-r>*,.pd-tbl,.rr,.tm,.bp,.an-row>div,.proc,.stack,.md>*,.news,.pr-note,.h-cta,.h-p,.h-eye,.h-card,.cp-l>*,.su-form>*,.nf-box,.mlink,.btn,.pills';
  $$(rvSel).forEach(el => { if (el.closest('.top,.menu,.pre')) return; el.classList.add('rv'); });
  // stagger siblings
  const g = new Map(); $$('.rv').forEach(el => { const p = el.parentElement; const n = g.get(p) || 0; g.set(p, n + 1); el.style.transitionDelay = Math.min(n, 6) * 70 + 'ms'; });
  $$('.case,.sv-img,.fc-img,.arts-img,.ab-photo,.pdw,.pd-two>div,.dm-card,.sg-card,.ft-img,.cta-card').forEach(el => el.classList.add('im'));
  const startObs = () => $$('.rv,.im,.js-scr,.js-roll').forEach(el => io.observe(el));

  /* ---------- preloader + page reveal ---------- */
  const pre = $('.pre');
  const ready = () => { html.classList.add('ready'); setTimeout(startObs, pre ? 250 : 120); setTimeout(() => { pre && pre.remove(); const t = $('.tiles'); t && t.remove(); }, 1400); };
  if (pre) {
    const n = $('.js-pre-n'), l = $('.js-pre-l'), t = $('.js-pre-t'), t0 = performance.now(), D = 2100; let flipped = false;
    const words = ['Design & AI studio', 'Brands · Websites · AI agents', 'Est. 2020'];
    scramble(t, 600);
    const tick = now => { const k = Math.min(1, (now - t0) / D), v = 1 - Math.pow(1 - k, 2.4); n.textContent = String(Math.round(v * 100)).padStart(3, '0'); l.style.transform = `scaleX(${v})`;
      if (k > .45 && !flipped) { flipped = true; t.textContent = words[1]; scramble(t, 550); }
      if (k < 1) requestAnimationFrame(tick); else setTimeout(ready, 250); };
    requestAnimationFrame(tick);
  } else requestAnimationFrame(() => requestAnimationFrame(ready));

  /* ---------- hero rotating word ---------- */
  const rot = $('.js-rot');
  if (rot && !reduce) { let words; try { words = JSON.parse(rot.dataset.words); } catch { words = []; } let i = 0;
    if (words.length === 1) setInterval(() => { if (!document.hidden) scramble(rot, 650); }, 4200);
    if (words.length > 1) setInterval(() => { if (document.hidden) return; i = (i + 1) % words.length; rot.textContent = words[i]; scramble(rot, 650); }, 3200); }

  /* ---------- menu ---------- */
  const setMenu = on => { document.body.classList.toggle('menu-open', on); const mn = $('.menu'); mn && mn.setAttribute('aria-hidden', on ? 'false' : 'true'); };
  $$('.js-menu').forEach(b => b.addEventListener('click', () => { const on = !document.body.classList.contains('menu-open'); setMenu(on); if (on) $$('.m-nav a span, .m-top span').forEach(s => s.closest('.m-top') && scramble(s, 500)); }));
  $$('.m-nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  $$('.js-close').forEach(b => b.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', ev => { if (ev.key === 'Escape') document.body.classList.remove('menu-open'); });

  /* ---------- hover scramble on case titles ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) $$('.case').forEach(c => { const h = c.querySelector('.js-hscr'); let busy = false; c.addEventListener('mouseenter', () => { if (busy || !h) return; busy = true; scramble(h, 450); setTimeout(() => busy = false, 500); }); });

  /* ---------- clocks ---------- */
  const clocks = $$('.js-clock'); const tickC = () => clocks.forEach(c => { try { const d = new Date(); const s = d.toLocaleString('en-US', { timeZone: c.dataset.tz, month: 'long', day: 'numeric' }) + ', ' + d.toLocaleString('en-GB', { timeZone: c.dataset.tz, hour: '2-digit', minute: '2-digit' }); c.textContent = s.toUpperCase(); } catch { } });
  tickC(); setInterval(tickC, 30000);

  /* ---------- videos: play only when visible ---------- */
  const vio = new IntersectionObserver(es => es.forEach(x => { const v = x.target;
    if (x.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; const p = v.play(); p && p.then(() => v.classList.add('playing')).catch(() => { }); }
    else if (!v.paused) v.pause(); }), { rootMargin: '100px' });
  $$('.js-vid').forEach(v => vio.observe(v));

  /* ---------- scroll driven (one rAF, cached geometry) ---------- */
  const prog = $('.js-prog'), stages = $('.js-stages'), band = $('.js-band'), pars = $$('.js-par'), svs = $$('.sv');
  let geo = {}, vh = innerHeight, docH = 1;
  const measure = () => {
    vh = innerHeight; docH = Math.max(1, document.documentElement.scrollHeight - vh);
    if (stages) { const r = stages.querySelector('.sg-card').getBoundingClientRect(); geo.st = { top: r.top + scrollY, h: r.height }; }
    const hdr = ($('.top') || {}).offsetHeight || 50; const T = hdr + (innerWidth < 810 ? 12 : 30);
    if (svs.length) {
      const list = svs[0].parentElement; let ly = 0, el = list; while (el) { ly += el.offsetTop; el = el.offsetParent; }
      let acc = 0;
      geo.sv = svs.map(s => { const h3 = s.querySelector('.sv-b h3'); const band = h3 ? Math.round(h3.getBoundingClientRect().bottom - s.getBoundingClientRect().top + 6) : 70; const o = { s, band, doc: ly + acc }; acc += s.offsetHeight; return o; });
      geo.sv.forEach((o, i) => { o.top = i === 0 ? T : T + geo.sv[i - 1].band; o.s.style.setProperty('--st', o.top + 'px'); });
    }
    geo.pars = pars.map(el => { const r = el.parentElement.getBoundingClientRect(); return { el, top: r.top + scrollY, h: r.height }; });
  };
  let ticking = false;
  const frame = () => {
    ticking = false; const y = scrollY;
    if (prog) prog.style.transform = `scaleX(${(y / docH).toFixed(4)})`;
    if (geo.st && band) { const { top, h } = geo.st; const p = Math.min(1, Math.max(0, (y + vh - top) / (vh + h))); band.style.setProperty('--by', ((1 - p) * (h - 30)).toFixed(1) + 'px'); }
    if (geo.sv && geo.sv.length) geo.sv.forEach((o, i) => { const nx = geo.sv[i + 1]; if (!nx || i === 0) { if (i === 0 && nx) { /* first row: hidden under row 2 as row 3 arrives */ } return; }
      const vtop = nx.doc - y; const sh = geo.sv[i - 1].band; const p = Math.min(1, Math.max(0, (nx.top + sh - vtop) / sh)); o.s.style.transform = p ? `translate3d(0,${(-sh * p).toFixed(1)}px,0)` : ''; });
    if (!reduce) geo.pars.forEach(o => { if (o.top + o.h < y - 100 || o.top > y + vh + 100) return; const off = ((o.top + o.h / 2) - (y + vh / 2)) * -0.08; o.el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`; });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  measure(); frame();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); onScroll(); });
  addEventListener('load', () => { measure(); onScroll(); });
  if ('ResizeObserver' in window) { let to; new ResizeObserver(() => { clearTimeout(to); to = setTimeout(() => { measure(); onScroll(); }, 150); }).observe(document.body); }

  /* ---------- demo play button follows the pointer ---------- */
  const dm = $('.dm-card'), play = $('.js-follow');
  if (dm && play && matchMedia('(hover:hover)').matches && !reduce) {
    let tx = 0, ty = 0, x = 0, y = 0, run = false;
    const loop = () => { x += (tx - x) * .12; y += (ty - y) * .12; play.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`; if (Math.abs(tx - x) > .3 || Math.abs(ty - y) > .3) requestAnimationFrame(loop); else run = false; };
    const kick = () => { if (!run) { run = true; requestAnimationFrame(loop); } };
    dm.addEventListener('mousemove', ev => { const r = dm.getBoundingClientRect(); tx = ev.clientX - (r.left + r.width / 2); ty = ev.clientY - (r.top + r.height * .52); kick(); });
    dm.addEventListener('mouseleave', () => { tx = 0; ty = 0; kick(); });
  }

  /* ---------- results carousel ---------- */
  $$('.js-car').forEach(car => {
    const qs = $$('.rs-q', car), dots = $$('.rs-dots i', car); let k = 0, timer;
    const logo = $('.js-car-logo', car), yr = $('.js-car-year', car), role = $('.js-car-role', car);
    const go = n => { k = (n + qs.length) % qs.length; qs.forEach((q, i) => q.classList.toggle('on', i === k)); dots.forEach((d, i) => d.classList.toggle('on', i === k));
      const q = qs[k]; logo.lastChild.textContent = q.dataset.name; yr.textContent = q.dataset.year; role.textContent = q.dataset.role; if (!reduce) { scramble(logo, 450); scramble(role, 450); } };
    const auto = () => { clearInterval(timer); timer = setInterval(() => { if (!document.hidden) go(k + 1); }, 5500); };
    $('.js-next', car).addEventListener('click', () => { go(k + 1); auto(); }); $('.js-prev', car).addEventListener('click', () => { go(k - 1); auto(); });
    auto();
  });

  /* ---------- FAQ smooth open ---------- */
  $$('details.qa').forEach(d => { const sm = d.querySelector('summary'), an = d.querySelector('.ans');
    sm.addEventListener('click', ev => { ev.preventDefault(); if (reduce) { d.open = !d.open; return; }
      if (d.open) { an.animate([{ height: an.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.7,0,.2,1)' }).onfinish = () => { d.open = false; }; }
      else { d.open = true; const h = an.offsetHeight; an.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' }); } }); });

  /* ---------- case study filters ---------- */
  const filt = $('.js-filt'), srch = $('.js-search');
  if (filt) {
    let tag = '';
    const cards = $$('.cs-list .case'); const count = $('.js-count-shown');
    const apply = () => { const q = (srch.value || '').toLowerCase().trim(); let n = 0;
      cards.forEach(c => { const tags = [...c.querySelectorAll('.pills span')].map(s => s.textContent); const ok = (!tag || tags.includes(tag)) && (!q || c.textContent.toLowerCase().includes(q)); c.classList.toggle('hide', !ok); if (ok) n++; });
      if (count) { count.dataset.to = String(n); count.textContent = n; } };
    $$('button', filt).forEach(b => b.addEventListener('click', () => { tag = b.dataset.t; $$('button', filt).forEach(x => x.classList.toggle('on', x === b)); apply(); }));
    srch.addEventListener('input', apply);
  }

  /* ---------- forms (FormSubmit) ---------- */
  $$('.js-form').forEach(f => f.addEventListener('submit', async ev => {
    ev.preventDefault(); const b = f.querySelector('button[type=submit]'); b.disabled = true; b.style.opacity = .6;
    const data = Object.fromEntries(new FormData(f)); data._subject = f.dataset.subject; data._template = 'table'; data._captcha = 'false';
    try { const r = await fetch(f.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) }); if (!r.ok) throw 0; f.reset(); f.classList.add('sent'); }
    catch { alert('Sorry, that did not send. Please email ' + f.action.split('/').pop()); }
    b.disabled = false; b.style.opacity = '';
  }));
})();
