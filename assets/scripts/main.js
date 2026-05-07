const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const COUNT = 80;
const ACCENT = '189, 40, 40';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.screen.height;
}

function initParticles() {
  particles = [];
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5
    });
  }
}

function drawMesh() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.35;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${ACCENT}, 0.9)`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${ACCENT}, 1)`;
    ctx.fill();
  }
}

function updateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }
}

function meshLoop() {
  drawMesh();
  updateParticles();
  requestAnimationFrame(meshLoop);
}

resizeCanvas();
initParticles();
meshLoop();
let resizeTimer;
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
  const newWidth = window.innerWidth;
  if (newWidth === lastWidth) return;
  lastWidth = newWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    resizeCanvas();
    initParticles();
  }, 250);
});


const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// mobile menu
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  navToggle.classList.remove('open');
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });


document.getElementById('portfolioFilter').addEventListener('change', function() {
  const selected = this.value;
  document.querySelectorAll('.portfolio-item').forEach(item => {
    const tag = item.querySelector('.portfolio-tag');
    if (!tag) return;
    if (selected === 'all' || tag.textContent.trim() === selected) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });
});

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// fancybox
$(document).ready(function() {
  $('[data-fancybox="portfolio"]').fancybox({
    buttons: ['zoom', 'slideShow', 'fullScreen', 'close'],
    loop: true,
    protect: true
  });
});
