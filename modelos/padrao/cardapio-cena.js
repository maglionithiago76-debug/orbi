// Digital menu base: the section bar follows the scroll and keeps the current section in view.
window.cena = (kit) => {
  const { ScrollTrigger } = kit, qa = kit.$$;
  const elos = qa(".cd-nav a"), secs = qa(".cd-sec");
  const marcar = (i) => elos.forEach((a, k) => {
    a.classList.toggle("on", k === i);
    if (k === i) a.parentElement.scrollTo({ left: a.offsetLeft - 18, behavior: "smooth" });
  });
  secs.forEach((s, i) => ScrollTrigger.create({ trigger: s, start: "top 45%", end: "bottom 45%", onToggle: (t) => t.isActive && marcar(i) }));
};
