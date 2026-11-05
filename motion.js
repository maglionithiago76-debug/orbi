/* Orbi scroll motion, shared by every model site and app (owner 2026-11-04: "when you scroll, things happen").
   Drop-in: <script src="../../motion.js" defer></script>. Works on existing markup, no classes needed:
   - section headings rise word by word when they enter;
   - groups (option lists, grids, menus) come in one by one;
   - photos are scrubbed with the scroll: they open from a rounded window and settle from a slight zoom;
   - [data-speed="0.2"] moves an element in parallax; [data-count] counts up to its number.
   Respects prefers-reduced-motion (shows everything still). Skips anything already using .rv. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const css = `
  .m-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}
  .m-w>span{display:inline-block;transform:translateY(105%) rotate(4deg);transform-origin:0 100%;transition:transform .9s cubic-bezier(.2,.75,.15,1)}
  .m-h.m-in .m-w>span{transform:none}
  .m-st>*{opacity:0;transform:translateY(34px) scale(.97);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.75,.15,1)}
  .m-st.m-in>*{opacity:1;transform:none}
  ${Array.from({ length: 14 }, (_, i) => `.m-st.m-in>*:nth-child(${i + 1}){transition-delay:${i * 70}ms}`).join('')}
  .m-img{will-change:clip-path,transform}`;
  document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));

  const skip = el => el.closest('.rv, .hero, header, nav, .demo, .fab, .toast, [data-m="off"]');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('m-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });

  // Headings: split into words that rise in turn.
  document.querySelectorAll('main h2, section h2').forEach(h => {
    if (skip(h) || h.dataset.mDone || h.querySelector('*:not(br):not(em):not(i):not(b)')) return;
    h.dataset.mDone = 1;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w, i) => {
          if (!w) return;
          if (/^\s+$/.test(w)) return frag.append(w);
          const o = document.createElement('span'); o.className = 'm-w';
          const s = document.createElement('span'); s.textContent = w; o.append(s); frag.append(o);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
    walk(h);
    h.querySelectorAll('.m-w>span').forEach((s, i) => s.style.transitionDelay = i * 55 + 'ms');
    h.classList.add('m-h'); io.observe(h);
  });

  // Groups: children come in one by one.
  const groups = 'main ul, main ol, .grid, .opts, .sizes, .chips, .list, .menu, .items, .cards, .svc, .gallery, .info, .hours, .k4, .c2, .c2b, .steps';
  document.querySelectorAll(groups).forEach(g => {
    if (skip(g) || g.closest('.m-st') || g.children.length < 2) return;
    g.classList.add('m-st'); io.observe(g);
  });

  // Photos: scrubbed clip + zoom, tied to the scroll position.
  const imgs = [...document.querySelectorAll('main img, section img, main picture img')].filter(i => !skip(i) && !i.closest('.m-st') && (i.width || 300) > 140);
  imgs.forEach(i => i.classList.add('m-img'));
  const par = [...document.querySelectorAll('[data-speed]')];
  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    for (const i of imgs) {
      const r = i.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * .75)));
      const e = 1 - Math.pow(1 - p, 3);
      i.style.clipPath = `inset(${(1 - e) * 12}% ${(1 - e) * 8}% round ${18 + (1 - e) * 30}px)`;
      i.style.transform = `scale(${1.16 - e * .16})`;
    }
    for (const el of par) {
      const r = el.getBoundingClientRect();
      el.style.translate = `0 ${((r.top + r.height / 2) - vh / 2) * -(+el.dataset.speed || .2)}px`;
    }
  };
  const ask = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); frame();

  // Counters.
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), dec = (el.dataset.count.split(/[.,]/)[1] || '').length;
    const pre = el.dataset.pre || '', suf = el.dataset.suf || '', t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1400), v = to * (1 - Math.pow(1 - k, 3));
      el.textContent = pre + v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
})();
