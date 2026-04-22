// Scene: gate, parallax, hotspots with flavor card + scene crossfade.
(function () {
  const gate = document.getElementById("gate");
  const enter = document.getElementById("enter");
  const audioBtn = document.getElementById("audio-toggle");
  const flavor = document.getElementById("flavor");
  const layers = document.querySelectorAll(".layer");
  const hotspots = document.querySelectorAll(".hotspot");

  const card = document.getElementById("flavor-card");
  const cardScent = card.querySelector(".flavor-scent");
  const cardTitle = card.querySelector("#flavor-title");
  const cardLore = card.querySelector("#flavor-lore");
  const cardGo = card.querySelector(".flavor-go");
  const cardClose = card.querySelector(".flavor-close");
  const veil = document.getElementById("veil");

  let lastFocused = null;

  // Enter the wood
  function openDoor() {
    gate.classList.add("hidden");
    document.body.classList.remove("unlit");
    window.SherwoodAudio.init();
    setTimeout(() => gate.remove(), 1400);
  }
  enter.addEventListener("click", openDoor);
  gate.addEventListener("click", (e) => { if (e.target === gate) openDoor(); });

  // Audio toggle
  audioBtn.addEventListener("click", () => {
    const playing = window.SherwoodAudio.toggle();
    audioBtn.innerHTML = playing ? "&#9835;" : "&#9834;";
  });

  // Parallax on mouse + scroll
  let mx = 0, my = 0, sy = 0;
  let tmx = 0, tmy = 0;

  window.addEventListener("mousemove", (e) => {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener("scroll", () => { sy = window.scrollY; }, { passive: true });

  function tick() {
    mx += (tmx - mx) * 0.08;
    my += (tmy - my) * 0.08;
    layers.forEach((layer) => {
      const s = parseFloat(layer.dataset.speed) || 0;
      const xShift = -mx * s * 30;
      const yShift = -my * s * 18 + sy * s * 0.35;
      layer.style.transform = `translate3d(${xShift}px, ${yShift}px, 0)`;
    });
    requestAnimationFrame(tick);
  }
  tick();

  // Flavor card: open, close, keyboard, CTA
  function openCard(hotspot) {
    lastFocused = hotspot;
    cardScent.textContent = hotspot.dataset.scent || "";
    cardTitle.textContent = hotspot.dataset.title || "";
    cardLore.textContent = hotspot.dataset.lore || "";
    cardGo.textContent = hotspot.dataset.cta || "Onward";
    cardGo.dataset.target = hotspot.dataset.target || "";
    flavor.classList.remove("show");
    card.classList.add("show");
    setTimeout(() => cardGo.focus(), 100);
  }

  function closeCard() {
    card.classList.remove("show");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // Scene transition: veil fades in, scroll to target, veil fades out
  function transitionTo(sceneId) {
    const target = document.getElementById(sceneId);
    if (!target) return;
    veil.classList.add("show");
    window.SherwoodAudio.fadeTo(0.18, 400);
    setTimeout(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      setTimeout(() => {
        veil.classList.remove("show");
        window.SherwoodAudio.fadeTo(0.45, 900);
      }, 120);
    }, 480);
  }

  // Hotspot interactions
  hotspots.forEach((h) => {
    // Quick scent preview on hover/focus
    h.addEventListener("mouseenter", () => {
      flavor.textContent = h.dataset.scent || "";
      flavor.classList.add("show");
    });
    h.addEventListener("mouseleave", () => flavor.classList.remove("show"));
    h.addEventListener("focus", () => {
      flavor.textContent = h.dataset.scent || "";
      flavor.classList.add("show");
    });
    h.addEventListener("blur", () => flavor.classList.remove("show"));

    // Click opens the full flavor card
    h.addEventListener("click", (e) => {
      e.preventDefault();
      openCard(h);
    });
  });

  // Close button + backdrop click + Escape key
  cardClose.addEventListener("click", closeCard);
  card.addEventListener("click", (e) => { if (e.target === card) closeCard(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && card.classList.contains("show")) closeCard();
  });

  // CTA button: close card, then crossfade to the target scene
  cardGo.addEventListener("click", () => {
    const target = cardGo.dataset.target;
    closeCard();
    setTimeout(() => transitionTo(target), 180);
  });

  // Volume dips when the user enters the tavern
  const tavern = document.getElementById("tavern");
  if (tavern && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        window.SherwoodAudio.fadeTo(en.isIntersecting ? 0.25 : 0.45, 800);
      });
    }, { threshold: 0.35 });
    io.observe(tavern);
  }
})();
