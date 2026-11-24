// Brasa Burger scenes: the Clássico is built layer by layer (two layers are already down on arrival);
// on wide screens the menu slides sideways like a grill, on phones it is a swipe row.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;
  const sec = q(".montagem"), foto = q(".mt__pilha", sec), nomes = qa(".mt__nomes li", sec), pips = qa(".mt__pips i", sec);
  const T = nomes.map((li) => +li.dataset.t), N = T.length, N0 = 2;
  // n = layers on the plate; N + 1 = finished
  const mostrar = (n) => {
    nomes.forEach((li, i) => li.classList.toggle("on", i === Math.min(n, N) - 1));
    pips.forEach((p, i) => p.classList.toggle("on", n - i > 0));
    sec.classList.toggle("fim", n - N > 0);
  };
  if (reduz) { foto.style.setProperty("--t", "0%"); mostrar(N + 1); }
  else {
    const o = { t: T[N0 - 1] };
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    T.slice(N0).forEach((t, k) => tl.to(o, { t, duration: 0.55, onUpdate: () => foto.style.setProperty("--t", o.t + "%") }, k));
    tl.to(o, { t: 0, duration: 0.3, onUpdate: () => foto.style.setProperty("--t", o.t + "%") }, N - N0).to({}, { duration: 0.6 });
    const upd = () => {
      const t = tl.time();
      mostrar(t - (N - N0) - 0.2 >= 0 ? N + 1 : N0 + T.slice(N0).filter((_, k) => t - k - 0.3 >= 0).length);
    };
    upd();
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 2.6, pin: true, scrub: true, animation: tl, onUpdate: upd });
  }

  // the grill: pinned sideways track on wide screens only
  const ch = q(".chapa"), trilho = q(".ch__trilho", ch), barra = q(".ch__barra i", ch);
  ScrollTrigger.matchMedia({
    "(min-width: 761px)": () => {
      gsap.to(trilho, { x: () => -Math.max(0, trilho.scrollWidth - innerWidth), ease: "none",
        scrollTrigger: { trigger: ch, start: "top top", end: () => "+=" + Math.max(innerHeight, trilho.scrollWidth - innerWidth), pin: true, scrub: true,
          invalidateOnRefresh: true, onUpdate: (s) => { barra.style.transform = "scaleX(" + s.progress + ")"; } } });
    },
  });
  if (!reduz) gsap.fromTo(".fg__foto", { scale: 1.12 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".fogo", start: "top bottom", end: "bottom bottom", scrub: true } });
};
