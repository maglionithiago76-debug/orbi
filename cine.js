/* Orbi cinematic scroll scenes (owner 2026-11-05: model sites must move like the reference reels).
   Drop-in: <script src="../../cine.js" defer></script>, then author sections with data-cine:
   - mask:   giant word filled with a photo; the scroll flies into the word until the photo fills the screen.
   - list:   huge words in a reel; the active one swaps the photo with a wipe (services, menu, steps).
   - track:  vertical scroll moves a row of photos sideways on an arc.
   - reveal: a photo opens from a slit to full screen while the title splits apart.
   Colours per section: --cx-bg, --cx-fg, --cx-ac; display font: --cx-font. Respects prefers-reduced-motion. */
(() => {
  const css = `
  .cx.cx{position:relative;display:block;overflow:visible!important;padding:0!important;margin:0!important;max-width:none!important;width:auto;border:0;background:var(--cx-bg,#111);color:var(--cx-fg,#fff);--cx-m:clamp(18px,4vw,48px)}
  .cx-pin{position:sticky;top:0;height:100svh;overflow:hidden}
  .cx h2,.cx .cx-word,.cx .cx-words b,.cx .cx-ttl,.cx .cx-big{font-family:var(--cx-font,inherit)}
  .cx img{display:block;max-width:none}
  /* mask */
  .cx-mask{height:320vh}
  .cx-mask .cx-word{position:absolute;left:50%;top:50%;white-space:nowrap;line-height:.84;letter-spacing:-.03em;color:transparent;background-size:cover;background-position:50% 50%;-webkit-background-clip:text;background-clip:text;translate:-50% -50%;will-change:transform;padding:.06em .02em}
  .cx-mask .cx-full{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;will-change:transform,opacity}
  .cx-mask .cx-shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.78),rgba(0,0,0,.1) 55%,transparent);opacity:0}
  .cx-mask .cx-kick{position:absolute;left:var(--cx-m);right:var(--cx-m);top:clamp(80px,14vh,130px);font:700 15px/1.3 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--cx-ac,currentColor);text-align:center}
  .cx-mask .cx-cap{position:absolute;left:var(--cx-m);right:var(--cx-m);bottom:clamp(28px,8vh,80px);color:#fff;max-width:640px;opacity:0;transform:translateY(30px)}
  .cx-cap h2{font-size:clamp(38px,5.6vw,84px);line-height:.95;letter-spacing:-.02em}
  .cx-cap p{margin-top:12px;font-size:18px;max-width:34ch;opacity:.9}
  /* list */
  .cx-list .cx-pics{position:absolute;right:var(--cx-m);top:50%;width:min(42vw,560px);height:min(74vh,700px);translate:0 -50%;border-radius:22px;overflow:hidden;background:rgba(127,127,127,.2)}
  .cx-list .cx-pics img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;will-change:clip-path,transform}
  .cx-list .cx-kick{position:absolute;left:var(--cx-m);top:clamp(84px,14vh,130px);font:700 15px/1.3 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--cx-ac,currentColor);z-index:2}
  .cx-list .cx-words{position:absolute;left:var(--cx-m);top:50%;list-style:none;margin:0;padding:0;will-change:transform;z-index:2}
  .cx-list .cx-words li{height:var(--cx-row);display:flex;flex-direction:column;justify-content:center;transform-origin:0 50%;will-change:transform,opacity}
  .cx-list .cx-words b{font-size:var(--cx-fs);line-height:.9;letter-spacing:-.03em;font-weight:inherit;display:flex;align-items:center;gap:.25em;white-space:nowrap}
  .cx-list .cx-words b::after{content:"→";font-family:system-ui,sans-serif;font-size:.45em;opacity:var(--cx-on,0);transform:translateX(calc((1 - var(--cx-on,0)) * -20px))}
  .cx-list .cx-words span{display:block;margin-top:8px;font:600 16px/1.35 system-ui,sans-serif;max-width:32ch;opacity:var(--cx-on,0)}
  .cx-list .cx-words li.on b{color:var(--cx-ac,currentColor)}
  .cx-list .cx-n{position:absolute;right:calc(var(--cx-m) + 18px);bottom:calc(50% - min(37vh,350px) + 16px);z-index:3;font:700 14px/1 system-ui,sans-serif;color:#fff;background:rgba(0,0,0,.55);padding:8px 12px;border-radius:99px;font-variant-numeric:tabular-nums}
  /* track */
  .cx-track .cx-ttl{position:absolute;left:0;top:clamp(76px,12vh,120px);white-space:nowrap;font-size:clamp(70px,13vw,220px);line-height:.85;letter-spacing:-.03em;color:transparent;-webkit-text-stroke:2px var(--cx-ac,currentColor);will-change:transform;opacity:.9}
  .cx-track .cx-row{position:absolute;left:0;top:56%;display:flex;gap:clamp(16px,2.4vw,34px);padding:0 var(--cx-m);translate:0 -50%;will-change:transform}
  .cx-track figure{margin:0;flex:none;width:clamp(230px,26vw,400px);will-change:transform}
  .cx-track figure div{aspect-ratio:3/4;border-radius:18px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.35)}
  .cx-track figure img{width:124%;height:100%;object-fit:cover;margin-left:-12%;will-change:transform}
  .cx-track figcaption{margin-top:12px;font:600 15px/1.3 system-ui,sans-serif;display:flex;justify-content:space-between;gap:10px}
  .cx-track figcaption b{color:var(--cx-ac,currentColor)}
  /* reveal */
  .cx-reveal{height:260vh}
  .cx-reveal .cx-win{position:absolute;inset:0;overflow:hidden;will-change:clip-path}
  .cx-reveal .cx-win img{width:100%;height:100%;object-fit:cover;will-change:transform}
  .cx-reveal .cx-win::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.75),transparent 55%);opacity:var(--cx-sh,0)}
  .cx-reveal .cx-big{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.04em;font-size:clamp(64px,11vw,190px);line-height:.88;letter-spacing:-.03em;text-align:center;pointer-events:none;z-index:2}
  .cx-reveal .cx-big span{display:block;white-space:nowrap;will-change:transform}
  .cx-reveal .cx-txt{position:absolute;left:var(--cx-m);right:var(--cx-m);bottom:clamp(28px,8vh,80px);color:#fff;max-width:620px;opacity:0;transform:translateY(30px);z-index:3}
  .cx-reveal .cx-txt h3{font-family:var(--cx-font,inherit);font-size:clamp(32px,4.4vw,64px);line-height:.95}
  .cx-reveal .cx-txt p{margin-top:10px;font-size:18px;max-width:34ch}
  @media(max-width:760px){
    .cx-list .cx-pics{left:var(--cx-m);right:var(--cx-m);width:auto;top:clamp(120px,17vh,150px);height:40vh;translate:none}
    .cx-list .cx-words{top:auto;bottom:0;height:calc(100svh - 40vh - clamp(120px,17vh,150px) - 10px);display:block}
    .cx-list .cx-n{bottom:auto;top:calc(clamp(120px,17vh,150px) + 40vh - 44px);right:calc(var(--cx-m) + 12px)}
    .cx-list .cx-words span{font-size:14px}
    .cx-track figure{width:68vw}
    .cx-cap p,.cx-reveal .cx-txt p{font-size:16px}
  }
  @media(prefers-reduced-motion:reduce){
    .cx-mask,.cx-reveal,.cx-list,.cx-track{height:auto!important}
    .cx-pin{position:relative;height:auto;min-height:100svh}
    .cx-mask .cx-full{opacity:1}.cx-mask .cx-word{display:none}.cx-mask .cx-cap,.cx-reveal .cx-txt{opacity:1;transform:none}
    .cx-track .cx-row{position:relative;top:auto;translate:none;overflow-x:auto;padding-top:220px;padding-bottom:40px}
  }`;
  document.head.appendChild(Object.assign(document.createElement('style'), { textContent: css }));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), ease = t => 1 - Math.pow(1 - t, 3), io = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const prog = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / (el.offsetHeight - innerHeight)); };
  const seen = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  const scenes = [];

  document.querySelectorAll('[data-cine="mask"]').forEach(s => {
    const word = s.querySelector('.cx-word'), full = s.querySelector('.cx-full'), cap = s.querySelector('.cx-cap'), shade = s.querySelector('.cx-shade'), kick = s.querySelector('.cx-kick');
    const [ox, oy] = (s.dataset.o || '.5 .5').split(' ').map(Number);
    const fit = () => { word.style.fontSize = '100px'; word.style.fontSize = 100 * innerWidth * .9 / word.scrollWidth + 'px'; word.style.transformOrigin = `${ox * 100}% ${oy * 100}%`; };
    fit(); document.fonts && document.fonts.ready.then(fit); addEventListener('resize', fit);
    scenes.push({ s, f(p) {
      const z = io(clamp((p - .1) / .55));
      word.style.transform = `translateY(${(1 - ease(clamp(p / .1))) * 30}px) scale(${1 + Math.pow(z, 2.4) * 16})`;
      word.style.backgroundPosition = `${50 + (p - .3) * 30}% 50%`;
      const f = clamp((p - .34) / .16); full.style.opacity = f; full.style.transform = `scale(${1.4 - ease(clamp((p - .34) / .5)) * .4})`;
      word.style.opacity = 1 - clamp((p - .46) / .06);
      if (kick) kick.style.opacity = 1 - clamp((p - .08) / .1);
      const c = ease(clamp((p - .66) / .16)); cap.style.opacity = c; cap.style.transform = `translateY(${(1 - c) * 30}px)`; shade.style.opacity = c;
    } });
  });

  document.querySelectorAll('[data-cine="list"]').forEach(s => {
    const items = [...s.querySelectorAll('.cx-words li')], pics = [...s.querySelectorAll('.cx-pics img')], ul = s.querySelector('.cx-words'), n = items.length;
    let num = s.querySelector('.cx-n'); if (!num) { num = document.createElement('div'); num.className = 'cx-n'; s.querySelector('.cx-pin').append(num); }
    s.style.height = (100 + n * 70) + 'vh';
    let row = 0;
    const size = () => { const mob = innerWidth < 760; const longest = Math.max(...items.map(i => i.querySelector('b').textContent.length));
      const fs = Math.min(mob ? innerWidth * .92 / (longest * .6) : innerWidth * .5 / (longest * .58), mob ? 78 : 150);
      s.style.setProperty('--cx-fs', fs + 'px'); row = fs * (mob ? 1.55 : 1.6); s.style.setProperty('--cx-row', row + 'px'); };
    size(); addEventListener('resize', size);
    scenes.push({ s, f(p) {
      const mob = innerWidth < 760, f = clamp((p - .04) / .9) * (n - 1), a = Math.round(f);
      const mid = mob ? ul.offsetHeight / 2 : 0;
      ul.style.transform = `translateY(${mid - row / 2 - f * row}px)`;
      items.forEach((li, i) => { const d = Math.abs(i - f), on = clamp(1 - d * 1.6);
        li.style.opacity = clamp(1 - d * .62, .12); li.style.transform = `scale(${1 - clamp(d) * .3})`; li.style.setProperty('--cx-on', on); li.classList.toggle('on', i === a); });
      pics.forEach((im, i) => { const r = i === 0 ? 1 : ease(clamp(f - i + 1));
        im.style.clipPath = `inset(${(1 - r) * 100}% 0 0 0)`; im.style.transform = `scale(${1.25 - r * .25 + (i === a ? (f - a) * .04 : 0)})`; });
      num.textContent = `${String(a + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    } });
  });

  document.querySelectorAll('[data-cine="track"]').forEach(s => {
    const rowEl = s.querySelector('.cx-row'), figs = [...rowEl.children], ttl = s.querySelector('.cx-ttl');
    let dist = 0;
    const size = () => { dist = Math.max(0, rowEl.scrollWidth - innerWidth); s.style.height = (innerHeight * 1.3 + dist * 1.15) + 'px'; };
    size(); addEventListener('resize', size); addEventListener('load', size);
    scenes.push({ s, f(p) {
      const x = -dist * clamp((p - .06) / .88);
      rowEl.style.transform = `translateX(${x}px)`;
      if (ttl) ttl.style.transform = `translateX(${innerWidth * .3 - p * (ttl.scrollWidth * .7)}px)`;
      figs.forEach(fg => { const r = fg.getBoundingClientRect(), d = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
        const c = clamp(d, -1.1, 1.1); fg.style.transform = `translateY(${c * c * 90}px) rotate(${c * 7}deg) scale(${1 - Math.abs(c) * .1})`;
        const im = fg.querySelector('img'); if (im) im.style.transform = `translateX(${d * -9}%)`; });
    } });
  });

  document.querySelectorAll('[data-cine="reveal"]').forEach(s => {
    const win = s.querySelector('.cx-win'), img = win.querySelector('img'), sp = [...s.querySelectorAll('.cx-big span')], txt = s.querySelector('.cx-txt');
    scenes.push({ s, f(p) {
      const e = io(clamp((p - .04) / .6)), mob = innerWidth < 760;
      win.style.clipPath = `inset(${(1 - e) * 44}% ${(1 - e) * (mob ? 30 : 40)}% round ${(1 - e) * 26}px)`;
      img.style.transform = `scale(${1.45 - e * .45})`;
      sp.forEach((x, i) => { const dir = i % 2 ? 1 : -1; x.style.transform = `translateX(${dir * e * 70}vw)`; });
      const t = ease(clamp((p - .66) / .16)); txt.style.opacity = t; txt.style.transform = `translateY(${(1 - t) * 30}px)`; s.style.setProperty('--cx-sh', t);
    } });
  });

  let dirty = true;
  addEventListener('scroll', () => dirty = true, { passive: true }); addEventListener('resize', () => dirty = true);
  (function tick() { if (dirty) { dirty = false; scenes.forEach(({ s, f }) => { if (seen(s)) f(prog(s)); }); } requestAnimationFrame(tick); })();
})();
