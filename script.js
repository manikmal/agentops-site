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
  const count = width < 720 ? 42 : 82;
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

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const opacity = 1 - distance / 150;
        context.strokeStyle = `rgba(4, 217, 217, ${opacity * 0.24})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }
  }

  for (const particle of particles) {
    context.fillStyle = "rgba(164, 246, 63, 0.8)";
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  }

  animationFrame = requestAnimationFrame(drawNetwork);
}

const mouse = { x: -999, y: -999 };

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

if (canvas && context) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", resizeCanvas);
}

window.addEventListener("pagehide", () => {
  cancelAnimationFrame(animationFrame);
});
