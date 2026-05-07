const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");

const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  Array.from(marqueeTrack.children).forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  });
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });

const navLinks = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      }
    }
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

document.querySelectorAll("section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

if (leadForm) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = leadForm.querySelector("button[type='submit']");
    const formData = new FormData(leadForm);
    const payload = Object.fromEntries(formData.entries());

    if (formStatus) formStatus.textContent = "Sending your request...";
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch("/.netlify/functions/lead-to-slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Lead submission failed");

      leadForm.reset();
      if (formStatus) formStatus.textContent = "Thanks. Your request has been sent to Manik.";
    } catch (error) {
      const email = "manikmalhotra6@gmail.com";
      if (formStatus) {
        formStatus.innerHTML = `Something went wrong. Please email <a href="mailto:${email}">${email}</a>.`;
      }
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const start = parseInt(el.dataset.counterStart, 10);
  const end = parseInt(el.dataset.counterEnd, 10);
  const suffix = el.dataset.counterSuffix ?? '';
  const duration = 1200;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(start + (end - start) * easeOut(progress));
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.16 }
);

document.querySelectorAll("[data-counter-end]").forEach((el) => counterObserver.observe(el));

document.querySelectorAll(".agent-card, .portfolio-card, .package-card, .devops-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(124, 92, 252, 0.12), transparent 34%)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.backgroundImage = "";
  });
});

// ============================================================
// CANVAS — particle network
// ============================================================

function debounce(fn, ms) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

const canvas = document.querySelector("[data-agent-canvas]");
const context = canvas ? canvas.getContext("2d") : null;
let particles = [];
let animationFrame = 0;

function resizeCanvas() {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = canvas.getBoundingClientRect();
  canvas.width = Math.floor(bounds.width * ratio);
  canvas.height = Math.floor(bounds.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles(bounds.width, bounds.height);
}

function createParticles(width, height) {
  const count = 35;   // fixed ≤40 cap per D-13; no mobile branch
  particles = Array.from({ length: count }, () => {
    const vx = (Math.random() - 0.5) * 0.42;
    const vy = (Math.random() - 0.5) * 0.42;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx,
      vy,
      baseVx: vx,
      baseVy: vy,
      radius: Math.random() * 1.8 + 1
    };
  });
}

function drawNetwork() {
  if (!canvas || !context) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(8, 10, 10, 0.5)";
  context.fillRect(0, 0, width, height);

  // Update particle positions and apply mouse repel + spring-back
  for (const particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    const mdx = particle.x - mouse.x;
    const mdy = particle.y - mouse.y;
    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

    if (mdist < 120 && mdist > 0) {
      const force = ((120 - mdist) / 120) * 0.6;
      particle.vx += (mdx / mdist) * force;
      particle.vy += (mdy / mdist) * force;
    }

    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
    if (speed > 3) {
      particle.vx = (particle.vx / speed) * 3;
      particle.vy = (particle.vy / speed) * 3;
    }

    particle.vx += (particle.baseVx - particle.vx) * 0.02;
    particle.vy += (particle.baseVy - particle.vy) * 0.02;
  }

  // k-nearest neighbor line drawing — O(n×k), not O(n²)
  // k=6 per D-14 (range 5–8); squared distance avoids sqrt in inner loop
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    const neighbors = [];
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = dx * dx + dy * dy;
      if (dist < 150 * 150) neighbors.push({ b, dist });
    }
    neighbors.sort((x, y) => x.dist - y.dist);
    const k = Math.min(6, neighbors.length);
    for (let n = 0; n < k; n++) {
      const d = Math.sqrt(neighbors[n].dist);
      const opacity = 1 - d / 150;
      context.strokeStyle = `rgba(124, 92, 252, ${opacity * 0.15})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(neighbors[n].b.x, neighbors[n].b.y);
      context.stroke();
    }
  }

  // Draw particles — violet per D-15
  for (const particle of particles) {
    context.fillStyle = "rgba(124, 92, 252, 0.8)";
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  }

  animationFrame = requestAnimationFrame(drawNetwork);
}

const mouse = { x: -999, y: -999 };

// Desktop-only mouse interaction per D-16: (pointer: fine) is true for mouse/trackpad, false for touch-only
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -999;
    mouse.y = -999;
  });
}

// Deferred init via requestIdleCallback per D-17; setTimeout fallback for Safari
if (canvas && context) {
  const initCanvas = () => {
    resizeCanvas();
    drawNetwork();
    window.addEventListener("resize", debounce(resizeCanvas, 180));
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initCanvas, { timeout: 2000 });
  } else {
    setTimeout(initCanvas, 200);
  }
}

// Tab visibility pause per D-17
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else if (canvas && context) {
    drawNetwork();
  }
});

// Existing pagehide cancel — keep unchanged
window.addEventListener("pagehide", () => {
  cancelAnimationFrame(animationFrame);
});

// ============================================================
// AGENT TRACE — dual-loop console animation
// ============================================================
const consoleEl = document.querySelector("[data-agent-trace]");
const consoleLabel = document.querySelector("[data-console-label]");

if (consoleEl) {
  const LOOPS = [
    {
      label: "startup-pipeline",
      steps: [
        { agent: "Orchestrator",  task: "Merge detected on main" },
        { agent: "Build Agent",   task: "Compiling and bundling" },
        { agent: "Test Agent",    task: "Running integration suite" },
        { agent: "Deploy Agent",  task: "Pushing to production" }
      ]
    },
    {
      label: "sme-automation",
      steps: [
        { agent: "Orchestrator",  task: "Weekly report triggered" },
        { agent: "Data Agent",    task: "Pulling campaign metrics" },
        { agent: "Content Agent", task: "Generating summary copy" },
        { agent: "Publish Agent", task: "Sending to Notion + Slack" }
      ]
    }
  ];

  const rows = Array.from(consoleEl.querySelectorAll(".flow-row"));

  let traceTimeout = null;
  let currentLoop = 0;
  let currentStep = 0;
  let stepStart = null;
  let elapsedInterval = null;

  function activateRow(stepIndex) {
    rows.forEach((row, i) => {
      row.classList.toggle("active", i === stepIndex);
    });
    const em = rows[stepIndex] && rows[stepIndex].querySelector("em");
    if (em) {
      em.textContent = "0s";
      stepStart = Date.now();
      clearInterval(elapsedInterval);
      elapsedInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - stepStart) / 1000);
        em.textContent = elapsed + "s";
      }, 1000);
    }
  }

  function resetRows() {
    clearInterval(elapsedInterval);
    rows.forEach((row) => {
      row.classList.remove("active");
      const em = row.querySelector("em");
      if (em) em.textContent = "•";
    });
  }

  function populateRows(loop) {
    loop.steps.forEach((step, i) => {
      if (!rows[i]) return;
      const strong = rows[i].querySelector("strong");
      const p = rows[i].querySelector("p");
      if (strong) strong.textContent = step.agent;
      if (p) p.textContent = step.task;
    });
  }

  function swapLabel(newLabel) {
    if (!consoleLabel) return;
    consoleLabel.classList.add("label-fade");
    setTimeout(() => {
      consoleLabel.textContent = newLabel;
      consoleLabel.classList.remove("label-fade");
    }, 250);
  }

  function runStep() {
    activateRow(currentStep);
    traceTimeout = setTimeout(() => {
      currentStep += 1;
      if (currentStep < LOOPS[currentLoop].steps.length) {
        runStep();
      } else {
        clearInterval(elapsedInterval);
        traceTimeout = setTimeout(() => {
          resetRows();
          currentLoop = (currentLoop + 1) % LOOPS.length;
          currentStep = 0;
          populateRows(LOOPS[currentLoop]);
          swapLabel(LOOPS[currentLoop].label);
          traceTimeout = setTimeout(runStep, 400);
        }, 1200);
      }
    }, 2800);
  }

  function startTrace() {
    populateRows(LOOPS[0]);
    swapLabel(LOOPS[0].label);
    traceTimeout = setTimeout(runStep, 600);
  }

  if (consoleEl.classList.contains("is-visible")) {
    startTrace();
  } else {
    const mo = new MutationObserver(() => {
      if (consoleEl.classList.contains("is-visible")) {
        mo.disconnect();
        startTrace();
      }
    });
    mo.observe(consoleEl, { attributeFilter: ["class"] });
  }
}
