// Brasa Burger scenes: the burger builds itself while you scroll; the menu slides sideways like a grill.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  const sec = $(".montagem"), cams = $$(".cam", sec), nomes = $$(".mt__nomes li", sec), conta = $(".mt__conta span", sec);
  const pilha = $(".mt__pilha", sec);
  if (reduz) {
    gsap.set([$(".mt__fim", sec)], { autoAlpha: 1 }); gsap.set(nomes, { opacity: 0 });
  } else {
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.to($(".mt__abre", sec), { y: -40, autoAlpha: 0, duration: 0.6 }, 0);
    tl.to($(".mt__conta", sec), { opacity: 1, duration: 0.3 }, 0.4);
    cams.forEach((c, i) => {
      const at = 0.5 + i;
      gsap.set(c, { y: () => -innerHeight * 1.15, rotation: (i % 2 ? 1 : -1) * (12 + i * 4) });
      (tl.to(c, { y: 0, rotation: 0, duration: 0.8, ease: "bounce.out" }, at));
      tl.fromTo(nomes[i], { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.3 }, at);
      if (i < cams.length - 1) tl.to(nomes[i], { opacity: 0, x: 30, duration: 0.25 }, at + 0.85);
    });
    tl.to(pilha, { "--sombra": 1, duration: cams.length }, 0.5);
    const fim = 0.5 + cams.length;
    tl.to(nomes[cams.length - 1], { opacity: 0, duration: 0.3 }, fim);
    tl.to($(".mt__conta", sec), { opacity: 0, duration: 0.3 }, fim);
    tl.to(pilha, { scale: 1.08, duration: 0.6 }, fim);
    tl.to($(".mt__fim", sec), { autoAlpha: 1, y: 0, duration: 0.5 }, fim + 0.2);
    tl.to({}, { duration: 0.5 });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: () => "+=" + innerHeight * 4.2, pin: true, scrub: true, animation: tl, invalidateOnRefresh: true,
      onUpdate: () => { const n = Math.min(cams.length, Math.max(1, Math.floor(tl.time() - 0.3) + 1)); conta.textContent = String(n).padStart(2, "0"); } });
    gsap.to($(".mt__fita span", sec), { xPercent: -45, ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: () => "+=" + innerHeight * 4.2, scrub: true } });
  }

  // grill: horizontal menu
  const ch = $(".chapa"), trilho = $(".ch__trilho", ch), barra = $(".ch__barra i", ch);
  const anda = gsap.to(trilho, { x: () => -Math.max(0, trilho.scrollWidth - innerWidth), ease: "none",
    scrollTrigger: { trigger: ch, start: "top top", end: () => "+=" + Math.max(innerHeight, trilho.scrollWidth - innerWidth), pin: true, scrub: true,
      invalidateOnRefresh: true, onUpdate: (s) => { barra.style.transform = `scaleX(${s.progress})`; } } });
  if (!reduz) $$(".card img", ch).forEach((im, i) => gsap.fromTo(im, { rotation: i % 2 ? 14 : -14, scale: 0.85 }, { rotation: 0, scale: 1, ease: "none",
    scrollTrigger: { trigger: im.parentElement, containerAnimation: anda, start: "left right", end: "center center", scrub: true } }));

  if (!reduz) gsap.to(".rd__fita span", { xPercent: -30, ease: "none", scrollTrigger: { trigger: ".rodape", start: "top bottom", end: "bottom bottom", scrub: true } });
};
