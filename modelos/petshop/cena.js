// Pelúcia Pet scenes: a foam line wipes through the three steps of a visit; the pet grows P, M, G with the price; the pickup route draws itself.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;
  const bolhas = (box, n0) => box && qa("i", box).forEach((b, i) => {
    const s = 12 + ((i * 17) % 34);
    Object.assign(b.style, { width: s + "px", height: s + "px", left: ((i * 41 + n0) % 100) + "%", animationDuration: 4 + ((i * 7) % 6) + "s", animationDelay: -((i * 13) % 60) / 10 + "s", "--dx": ((i * 29) % 60) - 30 + "px" });
  });
  bolhas(q(".es__bolhas"), 0); bolhas(q(".rd__bolhas"), 7);
  const lim = (v) => Math.min(1, Math.max(0, v));

  // 1 · the visit: two wipes, three photos, the step list follows
  const es = q(".espuma"), palco = q(".es__palco", es), linha = q(".es__linha", es), passos = qa(".es__passo", es);
  const visita = (p) => {
    const w1 = lim(p / 0.42), w2 = lim((p - 0.5) / 0.42), x = w1 - 1 < 0 ? 1 - w1 : 1 - w2;
    palco.style.setProperty("--p1", (1 - w1) * 100 + "%"); palco.style.setProperty("--p2", (1 - w2) * 100 + "%");
    palco.style.setProperty("--px", x * 100 + "%");
    linha.style.visibility = x > 0.005 && x - 0.995 < 0 ? "visible" : "hidden";
    const k = w2 - 0.5 > 0 ? 2 : w1 - 0.5 > 0 ? 1 : 0;
    passos.forEach((li, i) => li.classList.toggle("on", i === k));
  };
  visita(reduz ? 1 : 0);
  if (!reduz) ScrollTrigger.create({ trigger: es, start: "top top", end: () => "+=" + innerHeight * 2, pin: true, scrub: true, onUpdate: (s) => visita(s.progress) });

  // 2 · sizes: the circle grows and the photo, letter and price switch cleanly
  const ps = q(".portes-sec"), bola = q(".pt__bola", ps), imgs = qa(".pt__bola img", ps), falas = qa(".pt__fala", ps);
  const porte = (k) => { imgs.forEach((im, i) => im.classList.toggle("on", i === k)); falas.forEach((f, i) => f.classList.toggle("on", i === k)); };
  porte(0);
  if (reduz) gsap.set(bola, { scale: 0.9 });
  else {
    const tp = gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .fromTo(bola, { scale: 0.62 }, { scale: 0.8, duration: 0.6 }, 0.5)
      .to(bola, { scale: 1, duration: 0.6 }, 1.6)
      .to({}, { duration: 0.6 });
    ScrollTrigger.create({ trigger: ps, start: "top top", end: () => "+=" + innerHeight * 2, pin: true, scrub: true, animation: tp,
      onUpdate: () => porte(tp.time() - 1.9 > 0 ? 2 : tp.time() - 0.8 > 0 ? 1 : 0) });
  }

  // 3 · route
  const ro = q(".rota"), traco = q(".ro__linha", ro), van = q(".ro__van", ro), etapas = qa(".ro__passos li", ro);
  const L = traco.getTotalLength();
  traco.style.strokeDasharray = L;
  const ir = (p) => {
    traco.style.strokeDashoffset = L * (1 - p);
    const pt = traco.getPointAtLength(L * p); van.setAttribute("cx", pt.x); van.setAttribute("cy", pt.y);
    const k = p - 0.9 > 0 ? 2 : p - 0.45 > 0 ? 1 : 0;
    etapas.forEach((li, i) => li.classList.toggle("on", i === k));
  };
  ir(reduz ? 1 : 0.06);
  if (!reduz) ScrollTrigger.create({ trigger: ro, start: "top top", end: () => "+=" + innerHeight * 1.5, pin: true, scrub: true, onUpdate: (s) => ir(0.06 + s.progress * 0.94) });
};
