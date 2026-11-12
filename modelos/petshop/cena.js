// Pelúcia Pet scenes: a foam line washes the photo from "antes" to "depois"; the pet grows P→M→G with the price; the pickup route draws itself.
window.cena = ({ gsap, ScrollTrigger, reduz, $, $$ }) => {
  const bolhas = (box, n0) => $$("i", box).forEach((b, i) => {
    const s = 10 + ((i * 17) % 36);
    Object.assign(b.style, { width: s + "px", height: s + "px", left: ((i * 41 + n0) % 100) + "%", animationDuration: 4 + ((i * 7) % 6) + "s", animationDelay: -((i * 13) % 60) / 10 + "s", "--dx": ((i * 29) % 60) - 30 + "px" });
  });
  bolhas($(".co__bolhas"), 0); bolhas($(".rd__bolhas"), 7);

  // 1 · before/after wipe
  const co = $(".cortina");
  if (reduz) { co.style.setProperty("--p", "100%"); gsap.set(".co__rot--d", { opacity: 1 }); }
  else {
    const tl = gsap.timeline({ defaults: { ease: "none" } })
      .to(co, { "--p": "100%", duration: 1 }, 0)
      .to(".co__rot--a", { opacity: 0, duration: 0.2 }, 0.75)
      .to(".co__rot--d", { opacity: 1, duration: 0.2 }, 0.15)
      .to({}, { duration: 0.2 });
    ScrollTrigger.create({ trigger: co, start: "top top", end: () => "+=" + innerHeight * 2, pin: true, scrub: true, animation: tl });
  }

  // 2 · sizes
  const ps = $(".portes-sec"), bola = $(".pt__bola", ps), imgs = $$(".pt__bola img", ps), falas = $$(".pt__fala", ps);
  if (!reduz) {
    const tp = gsap.timeline({ defaults: { ease: "none" } });
    [0.55, 0.8, 1.08].forEach((s, i) => {
      if (i) {
        tp.to(bola, { scale: s, duration: 1, ease: "power2.inOut" }, i - 1 + 0.4);
        tp.to(imgs[i - 1], { opacity: 0, duration: 0.3 }, i - 1 + 0.7).to(imgs[i], { opacity: 1, duration: 0.3 }, i - 1 + 0.7);
        tp.to(falas[i - 1], { opacity: 0, y: -30, duration: 0.25 }, i - 1 + 0.7).fromTo(falas[i], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.25 }, i - 1 + 0.8);
      }
    });
    tp.to({}, { duration: 0.4 });
    ScrollTrigger.create({ trigger: ps, start: "top top", end: () => "+=" + innerHeight * 2.4, pin: true, scrub: true, animation: tp });
  } else gsap.set(bola, { scale: 0.9 });

  // 3 · route
  const ro = $(".rota"), linha = $(".ro__linha", ro), van = $(".ro__van", ro), passos = $$(".ro__passos li", ro);
  const L = linha.getTotalLength();
  linha.style.strokeDasharray = L;
  const por = (p) => {
    linha.style.strokeDashoffset = L * (1 - p);
    const pt = linha.getPointAtLength(L * p); van.setAttribute("cx", pt.x); van.setAttribute("cy", pt.y);
    passos.forEach((li, i) => li.classList.toggle("on", p >= i / 3 - 0.001));
  };
  por(reduz ? 1 : 0);
  if (!reduz) ScrollTrigger.create({ trigger: ro, start: "top top", end: () => "+=" + innerHeight * 1.6, pin: true, scrub: true, onUpdate: (s) => por(s.progress) });
};
