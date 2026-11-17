// =========================================================
// EASY EDIT ZONE: CHANGE YOUR DETAILS HERE ANYTIME
// =========================================================
const PORTFOLIO_CONFIG = {
  name: 'NAMISH MAHAJAN',
  handle: 'satoru0xx',
  age: 13,
  location: 'India',
  avatarFile: 'avatar.png',
  githubUsername: 'satoru0xx',
  careerGoal: 'Software Engineering',
  interests: 'Gaming & Emerging Tech',

  audioFile: 'teapot.mp3',
  songTitle: 'Teapot - LuKremBo (Loop)',
  defaultVolume: 0.5,

  roles: [
    'HTML & CSS Developer',
    'Learning JavaScript',
    'Future Software Engineer',
    'Gamer & Tech Enthusiast'
  ],

  skills: [
    {
      name: 'HTML5',
      level: '100%',
      color: '#f97316',
      info: 'HTML5: Semantic structure, Canvas API, SEO & modern layouts.'
    },
    {
      name: 'CSS3',
      level: '95%',
      color: '#38bdf8',
      info: 'CSS3: 3D transforms, Glassmorphism, Keyframe animations, Grid & Flexbox.'
    },
    {
      name: 'JS',
      level: 'LEARNING...',
      color: '#facc15',
      info: 'JavaScript: Currently mastering DOM manipulation, Fetch APIs & interactive logic!'
    }
  ],

  buttons: [
    {
      label: 'GitHub Profile',
      url: 'https://github.com/satoru0xx',
      primary: true
    },
    {
      label: 'Copy Username',
      copyText: 'satoru0xx',
      primary: false
    }
  ]
};

// 1. APPLY CONFIG
document.title = `${PORTFOLIO_CONFIG.name} | ${PORTFOLIO_CONFIG.handle}`;
document.getElementById('boot-header').textContent = `[ SYSTEM READY // USER: ${PORTFOLIO_CONFIG.handle.toUpperCase()} ]`;
document.getElementById('display-name').textContent = PORTFOLIO_CONFIG.name;
document.getElementById('display-meta').textContent = `@${PORTFOLIO_CONFIG.handle} • Age ${PORTFOLIO_CONFIG.age} • ${PORTFOLIO_CONFIG.location}`;
document.getElementById('display-goal').textContent = PORTFOLIO_CONFIG.careerGoal;
document.getElementById('display-interests').textContent = PORTFOLIO_CONFIG.interests;
document.getElementById('gh-title').textContent = `GITHUB TELEMETRY (${PORTFOLIO_CONFIG.githubUsername})`;

const avatarImg = document.getElementById('profile-avatar');
avatarImg.src = PORTFOLIO_CONFIG.avatarFile;
avatarImg.onerror = () => {
  avatarImg.src = `https://github.com/${PORTFOLIO_CONFIG.githubUsername}.png`;
};

const skillsContainer = document.getElementById('skills-container');
const skillDetailBox = document.getElementById('skill-detail-box');
skillDetailBox.textContent = PORTFOLIO_CONFIG.skills[0].info;

PORTFOLIO_CONFIG.skills.forEach((skill, idx) => {
  const btn = document.createElement('button');
  btn.className = `skill-pill ${idx === 0 ? 'active-skill' : ''}`;
  btn.innerHTML = `<span class="dot" style="background:${skill.color};box-shadow:0 0 8px ${skill.color};"></span> ${skill.name} <small>${skill.level}</small>`;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-pill').forEach(p => p.classList.remove('active-skill'));
    btn.classList.add('active-skill');
    skillDetailBox.textContent = skill.info;
  });
  skillsContainer.appendChild(btn);
});

const socialContainer = document.getElementById('social-container');
PORTFOLIO_CONFIG.buttons.forEach(btnCfg => {
  if (btnCfg.copyText) {
    const btn = document.createElement('button');
    btn.className = `dock-btn ${btnCfg.primary ? 'primary' : ''}`;
    btn.innerHTML = `<span>${btnCfg.label}</span>`;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btnCfg.copyText);
      const span = btn.querySelector('span');
      span.textContent = `Copied: ${btnCfg.copyText}`;
      setTimeout(() => (span.textContent = btnCfg.label), 2000);
    });
    socialContainer.appendChild(btn);
  } else {
    const a = document.createElement('a');
    a.className = `dock-btn ${btnCfg.primary ? 'primary' : ''}`;
    a.href = btnCfg.url;
    a.target = '_blank';
    a.textContent = btnCfg.label;
    socialContainer.appendChild(a);
  }
});

// 2. AUDIO ENGINE (teapot.mp3 + BUILT-IN SYNTH FALLBACK)
const bgMusic = document.getElementById('bg-music');
const audioToggle = document.getElementById('audio-toggle');
const equalizer = document.getElementById('equalizer');
const volumeSlider = document.getElementById('volume-slider');
const trackStatus = document.getElementById('track-status');

bgMusic.src = PORTFOLIO_CONFIG.audioFile;
bgMusic.volume = PORTFOLIO_CONFIG.defaultVolume;
volumeSlider.value = PORTFOLIO_CONFIG.defaultVolume;
trackStatus.textContent = PORTFOLIO_CONFIG.songTitle;

let synthCtx = null;
let synthGain = null;
let synthInterval = null;
let usingSynth = false;

function startFallbackSynth() {
  usingSynth = true;
  if (!synthCtx) {
    synthCtx = new (window.AudioContext || window.webkitAudioContext)();
    synthGain = synthCtx.createGain();
    synthGain.gain.value = volumeSlider.value * 0.14;
    synthGain.connect(synthCtx.destination);
  }
  if (synthCtx.state === 'suspended') synthCtx.resume();

  const chords = [
    [220.0, 261.63, 329.63, 392.0],
    [174.61, 220.0, 261.63, 329.63],
    [130.81, 196.0, 246.94, 293.66],
    [164.81, 196.0, 246.94, 329.63]
  ];
  let step = 0;

  const playChord = () => {
    if (!usingSynth) return;
    const now = synthCtx.currentTime;
    chords[step % chords.length].forEach(freq => {
      const osc = synthCtx.createOscillator();
      const gain = synthCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.7);
      osc.connect(gain);
      gain.connect(synthGain);
      osc.start(now);
      osc.stop(now + 3.9);
    });
    step++;
  };

  trackStatus.textContent = 'Lo-Fi Synth (Add teapot.mp3)';
  audioToggle.textContent = '||';
  equalizer.classList.add('playing');
  playChord();
  synthInterval = setInterval(playChord, 3800);
}

function stopFallbackSynth() {
  usingSynth = false;
  clearInterval(synthInterval);
  audioToggle.innerHTML = '&#9654;';
  equalizer.classList.remove('playing');
}

function startAudio() {
  bgMusic.play().then(() => {
    trackStatus.textContent = PORTFOLIO_CONFIG.songTitle;
    audioToggle.textContent = '||';
    equalizer.classList.add('playing');
  }).catch(() => {
    startFallbackSynth();
  });
}

function pauseAudio() {
  if (usingSynth) {
    stopFallbackSynth();
  } else {
    bgMusic.pause();
    audioToggle.innerHTML = '&#9654;';
    equalizer.classList.remove('playing');
  }
}

audioToggle.addEventListener('click', () => {
  const isPlaying = usingSynth || !bgMusic.paused;
  isPlaying ? pauseAudio() : startAudio();
});

volumeSlider.addEventListener('input', e => {
  const val = Number(e.target.value);
  bgMusic.volume = val;
  if (synthGain) synthGain.gain.value = val * 0.14;
});

// 3. PARTICLE CONSTELLATION CANVAS
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let trail = [];
let ripples = [];
let mouse = { x: null, y: null, radius: 140 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', e => {
  mouse.x = e.x;
  mouse.y = e.y;
  trail.push({ x: e.x, y: e.y, alpha: 1, size: 4 });
});

window.addEventListener('click', e => {
  ripples.push({ x: e.x, y: e.y, radius: 5, alpha: 0.8 });
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.8;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const count = Math.min(85, Math.floor((canvas.width * canvas.height) / 14500));
for (let i = 0; i < count; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i; j < particles.length; j++) {
      const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (dist < 115) {
        ctx.strokeStyle = `rgba(124, 58, 237, ${1 - dist / 115})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    if (mouse.x !== null) {
      const dist = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
      if (dist < mouse.radius) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${1 - dist / mouse.radius})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  for (let i = trail.length - 1; i >= 0; i--) {
    const pt = trail[i];
    ctx.fillStyle = `rgba(6, 182, 212, ${pt.alpha})`;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
    pt.alpha -= 0.04;
    pt.size *= 0.95;
    if (pt.alpha <= 0) trail.splice(i, 1);
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    ctx.strokeStyle = `rgba(124, 58, 237, ${rp.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
    ctx.stroke();
    rp.radius += 3.5;
    rp.alpha -= 0.025;
    if (rp.alpha <= 0) ripples.splice(i, 1);
  }

  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// 4. BOOT SCREEN & TYPEWRITER
document.getElementById('enter-screen').addEventListener('click', function () {
  this.classList.add('fade-out');
  document.getElementById('main-interface').classList.remove('hidden');
  startAudio();
  startTypewriter();
});

let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

function startTypewriter() {
  const target = document.getElementById('typewriter');
  const current = PORTFOLIO_CONFIG.roles[phraseIdx];
  target.textContent = isDeleting
    ? current.substring(0, charIdx--)
    : current.substring(0, charIdx++);

  let speed = isDeleting ? 45 : 85;
  if (!isDeleting && charIdx === current.length + 1) {
    speed = 1600;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % PORTFOLIO_CONFIG.roles.length;
    speed = 350;
  }
  setTimeout(startTypewriter, speed);
}

// 5. 3D TILT CARD, THEME SWITCHER & IST CLOCK
const card = document.getElementById('tilt-card');
const glare = document.getElementById('card-glare');

card.addEventListener('mousemove', e => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -9;
  const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 9;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  glare.style.opacity = '1';
  glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.16), transparent 65%)`;
});

card.addEventListener('mouseleave', () => {
  card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  glare.style.opacity = '0';
});

document.querySelectorAll('.theme-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    document.body.dataset.accent = dot.dataset.theme;
  });
});

function updateClock() {
  const istTime = new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false
  });
  document.getElementById('live-clock').textContent = `${istTime} IST`;
}
setInterval(updateClock, 1000);
updateClock();

// 6. GITHUB API FETCHER
async function loadGitHubData() {
  const username = PORTFOLIO_CONFIG.githubUsername;
  const repoContainer = document.getElementById('gh-repos');
  const countBadge = document.getElementById('gh-repo-count');

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error();
    const userData = await userRes.json();
    countBadge.textContent = `${userData.public_repos} Public Repos`;

    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=3`);
    const repos = await reposRes.json();

    if (repos.length === 0) {
      repoContainer.innerHTML = `<div class="repo-item"><span>No public repositories yet</span></div>`;
      return;
    }

    repoContainer.innerHTML = repos.map(repo => `
      <a href="${repo.html_url}" target="_blank" class="repo-item">
        <span>${repo.name}</span>
        <span class="repo-lang">${repo.language || 'HTML/CSS'}</span>
      </a>
    `).join('');
  } catch (err) {
    countBadge.textContent = username;
    repoContainer.innerHTML = `
      <a href="https://github.com/${username}" target="_blank" class="repo-item">
        <span>View Projects on GitHub</span>
        <span class="repo-lang">&rarr;</span>
      </a>
    `;
  }
}
loadGitHubData();
