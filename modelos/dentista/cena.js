// Lumi Odontologia scenes: the shade-guide fan opens over the photo while the tone reads up to BL1 and the picture brightens;
// the implant comes apart into labelled parts; a panoramic scan lights tooth by tooth.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  // 1 · shade guide
  const es = $(".escala"), abas = $$(".aba", es), tom = $(".es__tom b", es), foto = $(".es__foto img", es);
  const N = abas.length, A = () => (innerWidth < 760 ? 40 : 56), ang = (i) => -A() + (2 * A() * i) / (N - 1);
  const marcar = (k) => { abas.forEach((a, i) => a.classList.toggle("on", i === k)); tom.textContent = abas[k].textContent; };
  marcar(0);
  if (reduz) { abas.forEach((a, i) => gsap.set(a, { rotation: ang(i) })); marcar(N - 1); gsap.set(foto, { filter: "brightness(1.04) saturate(1)", scale: 1 }); }
  else {
    // already half open on arrival, so the first screen shows the idea without scrolling
    if (innerWidth < 760) gsap.set(abas, { rotation: (i) => ang(i) * 0.85 });   // phones: no entrance, the fan is simply there
    else gsap.fromTo(abas, { y: 260, rotation: 0 }, { y: 0, rotation: (i) => ang(i) * 0.85, duration: 1.1, stagger: 0.03, ease: "power3.out", delay: 0.15 });
    const o = { k: 0 };
    const tl = gsap.timeline({ defaults: { ease: "none" } });
    abas.forEach((a, i) => tl.fromTo(a, { rotation: () => ang(i) * 0.85 }, { rotation: () => ang(i), duration: 0.8, immediateRender: false }, 0));
    tl.to(o, { k: N - 1, duration: 1.3, onUpdate: () => marcar(Math.round(o.k)) }, 0.1)
      .to(foto, { filter: "brightness(1.05) saturate(1.02)", scale: 1, duration: 1.3 }, 0.1)
      .to(abas, { y: (i) => (i === N - 1 ? -26 : 0), duration: 0.25 }, 1.4)
      .to({}, { duration: 0.2 });
    ScrollTrigger.create({ trigger: es, start: "top top", end: () => "+=" + innerHeight * 1.5, pin: true, scrub: true, animation: tl, invalidateOnRefresh: true });
  }

  // 2 · exploded implant: each label snaps in as its part moves, never left half-faded
  const ip = $(".implante"), rots = $$(".ip__rot", ip);
  if (!reduz) {
    const ti = gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to(".ip__coroa", { y: -104, duration: 1 }, 0)
      .to(".ip__pilar", { y: -44, duration: 1 }, 0)
      .to(".ip__osso", { y: 54, duration: 1 }, 0);
    rots.forEach((r, i) => ti.fromTo(r, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.12, ease: "none" }, 0.25 + i * 0.2));
    ti.to({}, { duration: 0.35 });
    ScrollTrigger.create({ trigger: ip, start: "top top", end: () => "+=" + innerHeight * 1.3, pin: true, scrub: true, animation: ti });
  }

  // 3 · panoramic scan (on a phone the film slides under a fixed beam)
  const rx = $(".raiox"), tela = $(".rx__tela", rx), svg = $(".rx__svg", rx), linha = $(".rx__linha", rx), dentes = $$(".dente", rx), falas = $$(".rx__falas li", rx);
  const xs = dentes.map((d) => +d.dataset.x);
  const varrer = (p) => {
    const x = 20 + p * 960; linha.setAttribute("x", x - 3);
    dentes.forEach((d, i) => d.classList.toggle("on", xs[i] <= x));
    falas.forEach((f, i) => f.classList.toggle("on", p >= (i + 0.4) / (falas.length + 0.4)));
    const sw = svg.getBoundingClientRect().width, tw = tela.clientWidth;
    svg.style.transform = sw > tw + 2 ? `translateX(${Math.min(0, Math.max(tw - sw, tw / 2 - (x / 1000) * sw))}px)` : "";
  };
  varrer(reduz ? 1 : 0.12);
  if (!reduz) ScrollTrigger.create({ trigger: rx, start: "top top", end: () => "+=" + innerHeight * 1.5, pin: true, scrub: true, onUpdate: (s) => varrer(0.12 + s.progress * 0.88) });

};
