const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");



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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const response = await fetch("/.netlify/functions/lead-to-slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Lead submission failed");

      leadForm.reset();
      if (formStatus) {
        formStatus.textContent = "Message sent — I'll be in touch within 24 hours.";
        formStatus.dataset.state = "success";
      }
    } catch (error) {
      const email = "manikmalhotra6@gmail.com";
      if (formStatus) {
        formStatus.textContent = "Something went wrong. Email ";
        const link = document.createElement("a");
        link.href = `mailto:${email}`;
        link.textContent = email;
        formStatus.appendChild(link);
        const tail = document.createTextNode(" directly.");
        formStatus.appendChild(tail);
        formStatus.dataset.state = "error";
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

// Proximity-based mesh grid spotlight sync
const syncGrids = document.querySelectorAll(".portfolio-grid, .service-grid, .timeline, .integrations-badges, .estimator-options, .blueprint-grid, .blueprint-tabs");

syncGrids.forEach((grid) => {
  grid.addEventListener("pointermove", (e) => {
    const cards = grid.querySelectorAll(".service-card, .portfolio-card, .timeline-step, .badge-capsule, .estimator-pill, .blueprint-card, .blueprint-tab-btn");
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const maxSpotlightDistance = 280;
      if (distance < maxSpotlightDistance) {
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        const opacity = Math.max(0, 1 - (distance / maxSpotlightDistance));
        card.style.setProperty("--spotlight-opacity", `${opacity}`);
      } else {
        card.style.setProperty("--spotlight-opacity", "0");
      }
    });
  });
  
  grid.addEventListener("pointerleave", () => {
    const cards = grid.querySelectorAll(".service-card, .portfolio-card, .timeline-step, .badge-capsule, .estimator-pill");
    cards.forEach((card) => {
      card.style.setProperty("--spotlight-opacity", "0");
    });
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
let canvasW = 0;
let canvasH = 0;

function resizeCanvas() {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = canvas.getBoundingClientRect();
  canvasW = bounds.width;
  canvasH = bounds.height;
  canvas.width = Math.floor(canvasW * ratio);
  canvas.height = Math.floor(canvasH * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles(canvasW, canvasH);
}

const techLabels = ["GPT-4", "Claude", "Docker", "Python", "LangChain", "Git", "VectorDB", "APIs"];

function createParticles(width, height) {
  particles = [];
  
  // 1. Central Core Node
  particles.push({
    x: width / 2,
    y: height / 2,
    isCore: true,
    radius: 7,
    label: "Agent Core",
    pulse: 0
  });

  // 2. Tech Orbiting Nodes
  techLabels.forEach((label, idx) => {
    particles.push({
      isOrbiting: true,
      label: label,
      radius: 4,
      orbitRadius: 85 + idx * 22,
      angle: (idx * (Math.PI * 2)) / techLabels.length,
      speed: 0.0015 + (idx * 0.0003),
      pulse: 0
    });
  });

  // 3. Floating Data Packets
  const dataCount = 20;
  for (let i = 0; i < dataCount; i++) {
    const vx = (Math.random() - 0.5) * 0.42;
    const vy = (Math.random() - 0.5) * 0.42;
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx,
      vy,
      baseVx: vx,
      baseVy: vy,
      radius: Math.random() * 1.5 + 1,
      isData: true
    });
  }
}

function drawNetwork() {
  if (!canvas || !context) return;
  const width = canvasW;
  const height = canvasH;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(8, 10, 10, 0.5)";
  context.fillRect(0, 0, width, height);

  // Position Core node at center
  const coreNode = particles.find(p => p.isCore);
  if (coreNode) {
    coreNode.x = width / 2;
    coreNode.y = height / 2;
    coreNode.pulse += 0.03;
  }

  // Update positions
  for (const particle of particles) {
    if (particle.isCore) continue;
    
    if (particle.isOrbiting) {
      particle.angle += particle.speed;
      particle.x = (coreNode ? coreNode.x : width / 2) + Math.cos(particle.angle) * particle.orbitRadius;
      particle.y = (coreNode ? coreNode.y : height / 2) + Math.sin(particle.angle) * particle.orbitRadius;
      particle.pulse += 0.05;
      continue;
    }

    // Standard floating data packets
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

  // Connect Core to Orbiters
  if (coreNode) {
    particles.forEach(p => {
      if (p.isOrbiting) {
        context.strokeStyle = "rgba(124, 92, 252, 0.15)";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(coreNode.x, coreNode.y);
        context.lineTo(p.x, p.y);
        context.stroke();
      }
    });
  }

  // Connect nodes to neighbors
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    if (a.isCore) continue;
    
    const maxDist = a.isOrbiting ? 120 : 80;
    const neighbors = [];
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const b = particles[j];
      if (b.isCore) continue;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = dx * dx + dy * dy;
      if (dist < maxDist * maxDist) neighbors.push({ b, dist });
    }
    neighbors.sort((x, y) => x.dist - y.dist);
    const k = Math.min(a.isOrbiting ? 4 : 3, neighbors.length);
    for (let n = 0; n < k; n++) {
      const d = Math.sqrt(neighbors[n].dist);
      const opacity = 1 - d / maxDist;
      context.strokeStyle = `rgba(124, 92, 252, ${opacity * 0.12})`;
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(a.x, a.y);
      context.lineTo(neighbors[n].b.x, neighbors[n].b.y);
      context.stroke();
    }
  }

  // Draw nodes & text labels
  for (const particle of particles) {
    if (particle.isCore) {
      const glowGrad = context.createRadialGradient(particle.x, particle.y, 2, particle.x, particle.y, particle.radius * 2.5);
      glowGrad.addColorStop(0, "rgba(124, 92, 252, 0.8)");
      glowGrad.addColorStop(1, "rgba(124, 92, 252, 0)");
      context.fillStyle = glowGrad;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 2.5, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#a78bfa";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.font = "bold 9px monospace";
      context.fillStyle = "#e2e8f0";
      context.fillText(particle.label, particle.x - 27, particle.y - 12);
      continue;
    }

    if (particle.isOrbiting) {
      context.fillStyle = "rgba(167, 139, 250, 0.9)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      context.font = "8px monospace";
      context.fillStyle = "rgba(226, 232, 240, 0.75)";
      context.fillText(particle.label, particle.x + 8, particle.y + 3);
      continue;
    }

    context.fillStyle = "rgba(124, 92, 252, 0.4)";
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
if (canvas && context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const initCanvas = () => {
    resizeCanvas();
    cancelAnimationFrame(animationFrame);
    drawNetwork();
    window.addEventListener("resize", debounce(resizeCanvas, 180));
  };
  if ("requestIdleCallback" in window) {
    requestIdleCallback(initCanvas, { timeout: 2000 });
  } else {
    setTimeout(initCanvas, 200);
  }
}

// Module-scope timer handles so visibilitychange and pagehide can cancel them
let traceTimeout = null;
let elapsedInterval = null;

// Tab visibility pause per D-17
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
    clearTimeout(traceTimeout);
    clearInterval(elapsedInterval);
  } else if (canvas && context && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cancelAnimationFrame(animationFrame);
    drawNetwork();
  }
});

// Existing pagehide cancel — keep unchanged
window.addEventListener("pagehide", () => {
  cancelAnimationFrame(animationFrame);
  clearTimeout(traceTimeout);
  clearInterval(elapsedInterval);
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

  let currentLoop = 0;
  let currentStep = 0;
  let stepStart = null;

  function typeText(el, text, speed = 20) {
    el.textContent = "";
    let index = 0;
    function type() {
      if (index < text.length) {
        el.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  function activateRow(stepIndex) {
    rows.forEach((row, i) => {
      row.classList.toggle("active", i === stepIndex);
      const tag = row.querySelector(".flow-tag");
      if (tag) {
        if (i < stepIndex) {
          tag.textContent = "OK";
          tag.className = "flow-tag tag-ok";
        } else if (i === stepIndex) {
          tag.textContent = "RUN";
          tag.className = "flow-tag tag-run";
        } else {
          tag.textContent = "QUE";
          tag.className = "flow-tag tag-que";
        }
      }
    });

    const activeRow = rows[stepIndex];
    if (activeRow) {
      const p = activeRow.querySelector("p");
      if (p && p.dataset.taskText) {
        typeText(p, p.dataset.taskText);
      }
      const em = activeRow.querySelector("em");
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
  }

  function resetRows() {
    clearInterval(elapsedInterval);
    rows.forEach((row) => {
      row.classList.remove("active");
      const em = row.querySelector("em");
      if (em) em.textContent = "•";
      const tag = row.querySelector(".flow-tag");
      if (tag) {
        tag.textContent = "QUE";
        tag.className = "flow-tag tag-que";
      }
      const p = row.querySelector("p");
      if (p && p.dataset.taskText) {
        p.textContent = p.dataset.taskText;
      }
    });
  }

  function populateRows(loop) {
    loop.steps.forEach((step, i) => {
      if (!rows[i]) return;
      const strong = rows[i].querySelector("strong");
      const p = rows[i].querySelector("p");
      if (strong) strong.textContent = step.agent;
      if (p) {
        p.dataset.taskText = step.task;
        p.textContent = step.task;
      }
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

const copyrightYear = document.getElementById("copyright-year");
if (copyrightYear) {
  copyrightYear.textContent = new Date().getFullYear();
}

// Scroll-linked timeline progress tracking
const timeline = document.querySelector("[data-timeline]");
const timelineFill = document.querySelector("[data-timeline-fill]");

if (timeline && timelineFill) {
  const updateTimelineProgress = () => {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Trigger progress fill starting when timeline top reaches 70% of viewport height
    const triggerPoint = windowHeight * 0.7;
    const totalHeight = rect.height;
    
    const startScroll = rect.top - triggerPoint;
    const scrolled = -startScroll;
    
    let percent = (scrolled / totalHeight) * 100;
    percent = Math.max(0, Math.min(100, percent));
    
    timeline.style.setProperty("--scroll-fill", `${percent}%`);
  };
  
  window.addEventListener("scroll", updateTimelineProgress, { passive: true });
  window.addEventListener("resize", updateTimelineProgress, { passive: true });
  updateTimelineProgress(); // Initial execution
}

// Sliding hover dock highlight (navbar)
const navContainer = document.querySelector("[data-nav]");
const hoverPill = document.querySelector("[data-nav-hover-pill]");
const navItems = document.querySelectorAll(".nav-link");

if (navContainer && hoverPill) {
  navItems.forEach((item) => {
    item.addEventListener("pointerenter", () => {
      // Calculate layout bounds relative to the navigation container
      const parentRect = navContainer.getBoundingClientRect();
      const rect = item.getBoundingClientRect();
      const left = rect.left - parentRect.left;
      
      hoverPill.style.width = `${rect.width}px`;
      hoverPill.style.transform = `translate3d(${left}px, -50%, 0)`;
      hoverPill.style.opacity = "1";
    });
  });

  navContainer.addEventListener("pointerleave", () => {
    hoverPill.style.opacity = "0";
  });
}

// Interactive Scope Estimator Logic
const estimatorPills = document.querySelectorAll(".estimator-pill");
const resultTime = document.querySelector("[data-result-time]");
const resultStack = document.querySelector("[data-result-stack]");

if (estimatorPills.length > 0 && resultTime && resultStack) {
  let selectedTime = 0;
  let selectedStack = new Set();
  
  estimatorPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const isSelected = pill.classList.toggle("active");
      const time = parseInt(pill.dataset.time, 10);
      const stackItems = pill.dataset.stack.split(", ");
      
      if (isSelected) {
        selectedTime += time;
        stackItems.forEach(item => selectedStack.add(item));
      } else {
        selectedTime -= time;
        selectedStack.clear();
        document.querySelectorAll(".estimator-pill.active").forEach((activePill) => {
          activePill.dataset.stack.split(", ").forEach(item => selectedStack.add(item));
        });
      }
      
      resultTime.textContent = selectedTime > 0 ? `${selectedTime} weeks` : `0 weeks`;
      resultStack.textContent = selectedStack.size > 0 
        ? Array.from(selectedStack).join(", ") 
        : "Select modules to design your stack";
    });
  });
}

// Magnetic CTA Button Pull Animation
const magneticButtons = document.querySelectorAll(".btn-magnetic");

if (magneticButtons.length > 0 && window.matchMedia("(pointer: fine)").matches) {
  magneticButtons.forEach((btn) => {
    const wrap = btn.parentElement;
    if (!wrap) return;
    
    wrap.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Pull button towards cursor (max 14px translate)
      btn.style.transform = `translate3d(${x * 0.32}px, ${y * 0.32}px, 0)`;
      
      // Parallax text label translation
      const text = btn.querySelector("span");
      if (text) {
        text.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
      }
    });

    wrap.addEventListener("mouseleave", () => {
      btn.style.transform = "translate3d(0, 0, 0)";
      const text = btn.querySelector("span");
      if (text) {
        text.style.transform = "translate3d(0, 0, 0)";
      }
    });
  });
}

// AI Agent Blueprint Tab Filter Logic
const blueprintTabs = document.querySelectorAll(".blueprint-tab-btn");
const blueprintCards = document.querySelectorAll(".blueprint-card");

if (blueprintTabs.length > 0 && blueprintCards.length > 0) {
  blueprintTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      blueprintTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const category = tab.dataset.tab;
      
      blueprintCards.forEach((card) => {
        if (card.dataset.category === category) {
          card.style.display = "flex";
          card.style.animation = "none";
          card.offsetHeight;
          card.style.animation = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}


