// Brasa Burger scenes: the Clássico is built layer by layer (two layers are already down on arrival);
// on wide screens the menu slides sideways like a grill, on phones it is a swipe row.
window.cena = (kit) => {
  const { gsap, ScrollTrigger, reduz } = kit, q = kit.$, qa = kit.$$;
  const sec = q(".montagem"), foto = q(".mt__pilha", sec), nomes = qa(".mt__nomes li", sec), pips = qa(".mt__pips i", sec);
  const Y = nomes.map((li) => li.dataset.t), N = Y.length;
  // n = the layer being named (1..N); N + 1 = finished
  const mostrar = (n) => {
    const k = Math.min(n, N) - 1;
    nomes.forEach((li, i) => li.classList.toggle("on", i === k));
    pips.forEach((p, i) => p.classList.toggle("on", n - i > 0));
    foto.style.setProperty("--y", Y[k] + "%");
    sec.classList.toggle("fim", n - N > 0);
  };
  mostrar(reduz ? N + 1 : 2);
  if (!reduz) ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 2.4, pin: true, scrub: true,
    onUpdate: (s) => mostrar(Math.min(N + 1, 2 + Math.floor(s.progress * (N - 0.4)))) });

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
