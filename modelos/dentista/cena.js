// Lumi Odontologia scenes: a shade-guide fan opens and the smile brightens; the implant explodes into labelled parts; a panoramic scan lights tooth by tooth.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  // 1 · shade guide
  const es = $(".escala"), abas = $$(".aba", es), tom = $(".es__tom b", es), foto = $(".es__foto img", es);
  const N = abas.length, ang = (i) => -62 + (124 * i) / (N - 1);
  const marcar = (k) => { abas.forEach((a, i) => a.classList.toggle("on", i === k)); tom.textContent = abas[k].textContent; };
  marcar(0);
  if (reduz) { abas.forEach((a, i) => gsap.set(a, { rotation: ang(i) })); marcar(N - 1); gsap.set(foto, { filter: "brightness(1.04) saturate(1)", scale: 1 }); }
  else {
    gsap.from(abas, { y: 260, duration: 1, stagger: 0.04, ease: "power3.out", delay: 0.2 });
    const o = { k: 0 };
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    abas.forEach((a, i) => tl.fromTo(a, { rotation: (i - N / 2) * 1.5 }, { rotation: ang(i), duration: 1 }, 0));
    tl.to(o, { k: N - 1, duration: 1.4, onUpdate: () => marcar(Math.round(o.k)) }, 0.3)
      .to(foto, { filter: "brightness(1.05) saturate(1.02)", scale: 1, duration: 1.4 }, 0.3)
      .to(abas, { y: (i) => (i === N - 1 ? -26 : 0), duration: 0.3 }, 1.5)
      .to({}, { duration: 0.3 });
    ScrollTrigger.create({ trigger: es, start: "top top", end: () => "+=" + innerHeight * 2, pin: true, scrub: true, animation: tl });
  }

  // 2 · exploded implant
  const ip = $(".implante"), rots = $$(".ip__rot", ip);
  if (reduz) gsap.set(rots, { opacity: 1 });
  else {
    const ti = gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to(".ip__coroa", { y: -120, duration: 1 }, 0)
      .to(".ip__pilar", { y: -55, duration: 1 }, 0)
      .to(".ip__osso", { y: 60, duration: 1 }, 0);
    rots.forEach((r, i) => ti.fromTo(r, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 }, 0.6 + i * 0.25));
    ti.to({}, { duration: 0.5 });
    ScrollTrigger.create({ trigger: ip, start: "top top", end: () => "+=" + innerHeight * 1.8, pin: true, scrub: true, animation: ti });
  }

  // 3 · panoramic scan
  const rx = $(".raiox"), linha = $(".rx__linha", rx), dentes = $$(".dente", rx), falas = $$(".rx__falas li", rx);
  const xs = dentes.map((d) => +d.getAttribute("x") + +d.getAttribute("width") / 2);
  const varrer = (p) => {
    const x = p * 994; linha.setAttribute("x", x);
    dentes.forEach((d, i) => d.classList.toggle("on", xs[i] <= x + 3));
    falas.forEach((f, i) => f.classList.toggle("on", p >= (i + 0.5) / (falas.length + 0.5)));
  };
  varrer(reduz ? 1 : 0);
  if (!reduz) ScrollTrigger.create({ trigger: rx, start: "top top", end: () => "+=" + innerHeight * 2, pin: true, scrub: true, onUpdate: (s) => varrer(s.progress) });

  // 5 · clinic mosaic parallax
  if (!reduz) $$(".mo__f img").forEach((im, i) => gsap.fromTo(im, { yPercent: -8 - i * 2 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".clinica", start: "top bottom", end: "bottom top", scrub: true } }));
};
