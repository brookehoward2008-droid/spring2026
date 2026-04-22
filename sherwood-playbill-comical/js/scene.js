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

  // CTA button: close card, run a button-specific mini-cinematic, then crossfade.
  const ACTION_MAP = { tavern: "cheer", castle: "laugh", programme: "pageturn" };
  const overlay = document.getElementById("action-overlay");
  let sfxCtx = null;
  const getCtx = () => (sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)());

  function playSfx(type) {
    const ctx = getCtx();
    const now = ctx.currentTime;
    if (type === "cheer") {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.55, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) * 0.35;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(350, now);
      f.frequency.exponentialRampToValueAtTime(2400, now + 0.5);
      src.connect(f).connect(ctx.destination);
      src.start();
    } else if (type === "laugh") {
      [480, 420, 370, 330].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const t = now + i * 0.14;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.28, t + 0.02);
        gain.gain.linearRampToValueAtTime(0, t + 0.11);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.14);
      });
    } else if (type === "pageturn") {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        const t = i / d.length;
        d[i] = (Math.random() * 2 - 1) * (0.4 * (1 - t));
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 1400;
      src.connect(f).connect(ctx.destination);
      src.start();
    }
  }

  function performAction(type, cb) {
    overlay.className = "show";
    overlay.innerHTML = "";

    if (type === "cheer") {
      const headline = document.createElement("div");
      headline.className = "cheer-text";
      headline.textContent = "HUZZAH!";
      overlay.appendChild(headline);
      for (let i = 0; i < 9; i++) {
        const t = document.createElement("span");
        t.className = "tankard";
        t.textContent = "\uD83C\uDF7A"; // beer mug
        t.style.left = 5 + i * 10.5 + "%";
        t.style.animationDelay = (i * 0.04) + "s";
        overlay.appendChild(t);
      }
    } else if (type === "laugh") {
      document.body.classList.add("shaking");
      const positions = [
        [12, 28], [78, 22], [30, 66], [66, 70], [46, 40],
        [20, 54], [82, 58], [56, 24], [38, 80]
      ];
      positions.forEach(([x, y], i) => {
        const ha = document.createElement("div");
        ha.className = "ha";
        ha.textContent = i % 2 ? "HA!" : "HA HA!";
        ha.style.left = x + "%";
        ha.style.top = y + "%";
        ha.style.animationDelay = (i * 0.07) + "s";
        overlay.appendChild(ha);
      });
      setTimeout(() => document.body.classList.remove("shaking"), 950);
    } else if (type === "pageturn") {
      const sweep = document.createElement("div");
      sweep.className = "page-sweep";
      overlay.appendChild(sweep);
      const text = document.createElement("div");
      text.className = "page-text";
      text.textContent = "Turn the page...";
      overlay.appendChild(text);
    }

    playSfx(type);

    setTimeout(() => {
      overlay.classList.remove("show");
      overlay.innerHTML = "";
      setTimeout(cb, 220);
    }, 1050);
  }

  cardGo.addEventListener("click", () => {
    const target = cardGo.dataset.target;
    const action = ACTION_MAP[target];
    closeCard();
    if (action) {
      setTimeout(() => performAction(action, () => transitionTo(target)), 160);
    } else {
      setTimeout(() => transitionTo(target), 180);
    }
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
