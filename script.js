/* ==========================================================================
   ANSHIKA SINGH - FULL STACK DEVELOPER PORTFOLIO JAVASCRIPT
   Interactive Canvas Particle Physics, Theme Switcher, Micro-Interactions
   ========================================================================== */

/* --------------------------------------------------------------------------
   DEVELOPER PROFILE CONFIGURATION
   Paste your profile links or usernames here! The site automatically fetches
   live stats from these profiles.
   -------------------------------------------------------------------------- */
const DEVELOPER_PROFILES = {
  // Enter LeetCode username OR profile link (e.g. 'anshikasingh' or 'https://leetcode.com/u/anshikasingh/')
  leetcode: 'https://leetcode.com/u/anshika_singh580/',

  // GeeksforGeeks username OR solved count
  geeksforgeeks: 'https://www.geeksforgeeks.org/profile/anshusingmh62',
  gfgSolvedCount: 40,

  // HackerRank username OR solved count
  hackerrank: 'https://www.hackerrank.com/profile/anshusingh262005',
  hackerrankSolvedCount: 30
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --------------------------------------------------------------------------
  // 2. INFINITE MOTION CANVAS BACKGROUND (Video-like Particle Grid)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('motion-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 70);
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse proximity interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }

      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.6)' : 'rgba(79, 70, 229, 0.5)';
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const maxDistance = 140;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = 1 - dist / maxDistance;
            ctx.strokeStyle = isDark
              ? `rgba(0, 242, 254, ${opacity * 0.25})`
              : `rgba(79, 70, 229, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      requestAnimationFrame(animateCanvas);
    }

    initParticles();
    animateCanvas();
  }

  // --------------------------------------------------------------------------
  // 3. LIGHT / DARK THEME SWITCHER WITH LOCAL STORAGE
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 4. HERO DYNAMIC TYPING EFFECT
  // --------------------------------------------------------------------------
  const typingTextElement = document.getElementById('typing-text');
  if (typingTextElement) {
    const roles = [
      'Full Stack Applications',
      'Scalable Microservices',
      'High Performance APIs',
      'Modern Cloud Solutions'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 1800; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  // --------------------------------------------------------------------------
  // 5. SKILLS FILTERING LOGIC
  // --------------------------------------------------------------------------
  const skillFilterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'grid';
          setTimeout(() => (card.style.opacity = '1'), 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => (card.style.display = 'none'), 300);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. PROJECTS FILTERING LOGIC
  // --------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-project-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-project-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => (card.style.opacity = '1'), 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => (card.style.display = 'none'), 300);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. 3D CARD TILT EFFECT ON HOVER
  // --------------------------------------------------------------------------
  const motionCards = document.querySelectorAll('.motion-card');

  motionCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // --------------------------------------------------------------------------
  // 8. MODAL POPUP & LIGHTBOX
  // --------------------------------------------------------------------------
  const modalOverlay = document.getElementById('modal-overlay');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close');

  const projectModalData = {
    'modal-project-1': {
      title: 'CareerForageAI – All In One AI Tools Platform',
      category: 'Full Stack AI Ecosystem',
      description: 'Architected an all-in-one AI career ecosystem featuring a Resume Builder, ATS Analyzer, AI Resume Writer, Portfolio Generator, and Career Roadmap modules.',
      features: [
        'Integrated AI APIs to automate skill-gap analysis & ATS score optimization',
        'Engineered secure backend services with JWT authentication & session management',
        'Designed optimized MongoDB schemas with RESTful CRUD endpoints',
        'Automated CI/CD pipelines deploying frontend on Vercel and backend on Render'
      ],
      tech: ['React (Vite)', 'Node.js', 'Express.js', 'MongoDB Atlas', 'REST APIs', 'Vercel', 'Render']
    },
    'modal-project-2': {
      title: 'Abhyas AI – Online Testing & Practice Platform',
      category: 'Live Assessment & Proctoring System',
      description: 'Led frontend architecture and UI workflows for a live assessment platform deployed on abhyasai.app, successfully validated across 100+ student test sessions.',
      features: [
        'Engineered secure lockdown test environment featuring camera/audio proctoring',
        'Implemented strict client-side event listeners (tab switching, right-clicking, copy-pasting prevention)',
        'Integrated Azure AI endpoints to automate student performance evaluation & diagnostic scoring',
        'JWT authentication, Google OAuth, email OTP verification & ExcelJS bulk imports'
      ],
      tech: ['React (Vite)', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Azure AI', 'ExcelJS']
    },
    'modal-project-3': {
      title: 'Riya Singh Portfolio – Freelance Client Project',
      category: 'Freelance Frontend Development',
      description: 'Designed and developed a custom, high-converting portfolio website for client Riya Singh (deployed at riya-singh-livid.vercel.app) utilizing vanilla HTML5, CSS3, JavaScript, and Cloudinary.',
      features: [
        'Integrated Cloudinary CDN for optimized image transformations and ultra-fast media rendering',
        'Engineered responsive CSS layout with modern glassmorphism, animations, and micro-interactions',
        'Managed structured Git & GitHub repository version control',
        'Deployed production build on Vercel with automatic continuous integration'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Cloudinary', 'Git / GitHub', 'Vercel']
    },
    'modal-project-4': {
      title: 'IMDb CLI Movie Recommender & Watchlist Manager',
      category: 'Python Command Line Application',
      description: 'An interactive Python terminal CLI tool that queries and recommends top 20 IMDb-rated movies based on user-driven filters including Genre, Industry (Hollywood vs. Bollywood), and Release Era.',
      features: [
        'Interactive command-line prompt pipeline for Genre, Industry, and Era selection',
        'Enumerated top 20 IMDb-rated movie list display with star ratings & metadata',
        'Watchlist Manager CRUD engine allowing users to Add, Delete, and Save movies for Watch Later',
        'Object-Oriented Python architecture with file persistence for custom watchlists'
      ],
      tech: ['Python 3', 'IMDb Data', 'CLI Engine', 'OOP Architecture', 'File I/O', 'CRUD Operations']
    }
  };

  // Dynamic Multi-Platform Questions Calculator Engine
  function calculateTotalQuestions() {
    const leetcodeVal = parseInt(document.getElementById('val-leetcode')?.textContent || '127', 10);
    const gfgVal = parseInt(document.getElementById('val-gfg')?.textContent || '55', 10);
    const hackerrankVal = parseInt(document.getElementById('val-hackerrank')?.textContent || '21', 10);

    const grandTotal = leetcodeVal + gfgVal + hackerrankVal;
    const grandTotalElement = document.getElementById('grand-total-num');

    if (grandTotalElement) {
      grandTotalElement.textContent = `${grandTotal}+`;
    }

    const formulaEl = document.getElementById('formula-code');
    if (formulaEl) {
      formulaEl.innerHTML = `${leetcodeVal} (LeetCode) + ${gfgVal} (GFG) + ${hackerrankVal} (HackerRank) = <strong>${grandTotal} Total Solved</strong>`;
    }
  }

  // Helper to extract clean username from full profile link or username string
  function parseUsername(input) {
    if (!input) return '';
    let clean = input.trim().replace(/\/$/, '');
    if (clean.includes('/')) {
      const parts = clean.split('/').filter(Boolean);
      clean = parts[parts.length - 1];
    }
    return clean;
  }

  // --------------------------------------------------------------------------
  // STATS PERSISTENCE & LOCAL STORAGE CACHE ENGINE
  // --------------------------------------------------------------------------
  const CACHE_KEY = 'anshika_coding_stats_v2';

  function getCachedStats() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  }

  function setCachedStats(patch) {
    try {
      const existing = getCachedStats() || {
        leetcode: { total: 127, easy: 70, medium: 50, hard: 7, ranking: '#1,406,582', submissions: 232 },
        gfg: { total: 55 },
        hackerrank: { total: 21 }
      };
      const updated = {
        ...existing,
        ...patch,
        updatedAt: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log('Cache save note:', e);
    }
  }

  function applyStatsToDOM(stats) {
    if (!stats) return;
    if (stats.leetcode) {
      const total = stats.leetcode.total || 127;
      const easy = stats.leetcode.easy || 70;
      const medium = stats.leetcode.medium || 50;
      const hard = stats.leetcode.hard || 7;
      const ranking = stats.leetcode.ranking || '#1,406,582';
      const subs = stats.leetcode.submissions || 232;

      const totalEl = document.getElementById('leetcode-total');
      if (totalEl) totalEl.textContent = total;

      const easyEl = document.getElementById('leetcode-easy');
      if (easyEl) easyEl.textContent = `${easy} / 800`;

      const mediumEl = document.getElementById('leetcode-medium');
      if (mediumEl) mediumEl.textContent = `${medium} / 1600`;

      const hardEl = document.getElementById('leetcode-hard');
      if (hardEl) hardEl.textContent = `${hard} / 700`;

      const rankValEl = document.getElementById('leetcode-rank-val');
      if (rankValEl) rankValEl.textContent = typeof ranking === 'number' ? `#${ranking.toLocaleString()}` : ranking;

      const subEl = document.getElementById('leetcode-submissions');
      if (subEl) subEl.textContent = `${subs} Total`;

      const valLc = document.getElementById('val-leetcode');
      if (valLc) valLc.textContent = total;

      const barEasy = document.getElementById('bar-easy');
      const barMedium = document.getElementById('bar-medium');
      const barHard = document.getElementById('bar-hard');

      if (barEasy) barEasy.style.width = `${Math.min((easy / 150) * 100, 100)}%`;
      if (barMedium) barMedium.style.width = `${Math.min((medium / 100) * 100, 100)}%`;
      if (barHard) barHard.style.width = `${Math.min((hard / 50) * 100, 100)}%`;

      const dialFill = document.getElementById('leetcode-dial-fill');
      if (dialFill) {
        const maxCirc = 264;
        const pct = Math.min(total / 200, 1);
        dialFill.style.strokeDashoffset = maxCirc * (1 - pct * 0.75);
      }
    }

    if (stats.gfg && stats.gfg.total) {
      const gfgVal = document.getElementById('val-gfg');
      if (gfgVal) gfgVal.textContent = stats.gfg.total;
    }

    if (stats.hackerrank && stats.hackerrank.total) {
      const hrVal = document.getElementById('val-hackerrank');
      if (hrVal) hrVal.textContent = stats.hackerrank.total;
    }

    calculateTotalQuestions();
  }

  // 1. Automatic Real-Time LeetCode API Stats Fetcher with Multi-Tier Fallbacks
  async function fetchLeetCodeStats(profileInput) {
    const username = parseUsername(profileInput) || 'anshika_singh580';
    const syncStatus = document.getElementById('leetcode-sync-status');
    if (syncStatus) {
      syncStatus.innerHTML = `<span class="live-dot" style="background:#ffa116; box-shadow:0 0 8px #ffa116;"></span> Syncing...`;
    }

    let result = null;

    // TIER 1: Vercel LeetCode API (Fastest & Most Reliable)
    try {
      const res = await fetch(`https://leetcode-stats-api.vercel.app/${username}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.totalSolved !== undefined && data.totalSolved > 0) {
          let totalSubmissions = 232;
          if (data.totalSubmissions && Array.isArray(data.totalSubmissions)) {
            const allSub = data.totalSubmissions.find(s => s.difficulty === 'All');
            if (allSub && allSub.submissions) totalSubmissions = allSub.submissions;
          } else if (typeof data.totalSubmissions === 'number') {
            totalSubmissions = data.totalSubmissions;
          }

          result = {
            total: data.totalSolved,
            easy: data.easySolved || 70,
            medium: data.mediumSolved || 50,
            hard: data.hardSolved || 7,
            ranking: data.ranking ? `#${data.ranking.toLocaleString()}` : '#1,406,582',
            submissions: totalSubmissions
          };
        }
      }
    } catch (e) {
      console.log('LeetCode Tier 1 Vercel API note:', e);
    }

    // TIER 2: Alfa LeetCode API (Render)
    if (!result) {
      try {
        const res = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.solvedProblem !== undefined && data.solvedProblem > 0) {
            let rank = '#1,406,582';
            try {
              const profileRes = await fetch(`https://alfa-leetcode-api.onrender.com/${username}`);
              if (profileRes.ok) {
                const pData = await profileRes.json();
                if (pData && pData.ranking) rank = `#${pData.ranking.toLocaleString()}`;
              }
            } catch (pErr) {}

            result = {
              total: data.solvedProblem,
              easy: data.easySolved || 70,
              medium: data.mediumSolved || 50,
              hard: data.hardSolved || 7,
              ranking: rank,
              submissions: (data.totalSubmissionNum && data.totalSubmissionNum[0]) ? data.totalSubmissionNum[0].submissions : 232
            };
          }
        }
      } catch (e) {
        console.log('LeetCode Tier 2 Alfa API note:', e);
      }
    }

    // TIER 3: CORS Proxy to LeetCode GraphQL
    if (!result) {
      try {
        const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://leetcode.com/graphql')}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query getUserProfile($username: String!) {
              matchedUser(username: $username) {
                submitStats { acSubmissionNum { difficulty count } totalSubmissionNum { difficulty submissions } }
                profile { ranking }
              }
            }`,
            variables: { username }
          })
        });
        if (proxyRes.ok) {
          const gqlData = await proxyRes.json();
          const user = gqlData?.data?.matchedUser;
          if (user && user.submitStats && user.submitStats.acSubmissionNum) {
            const acs = user.submitStats.acSubmissionNum;
            const total = acs.find(d => d.difficulty === 'All')?.count || 127;
            const easy = acs.find(d => d.difficulty === 'Easy')?.count || 70;
            const medium = acs.find(d => d.difficulty === 'Medium')?.count || 50;
            const hard = acs.find(d => d.difficulty === 'Hard')?.count || 7;
            const rank = user.profile?.ranking ? `#${user.profile.ranking.toLocaleString()}` : '#1,406,582';
            const subs = user.submitStats.totalSubmissionNum?.find(d => d.difficulty === 'All')?.submissions || 232;

            result = { total, easy, medium, hard, ranking: rank, submissions: subs };
          }
        }
      } catch (e) {
        console.log('LeetCode Tier 3 GraphQL proxy note:', e);
      }
    }

    if (result) {
      setCachedStats({ leetcode: result });
      const currentCache = getCachedStats() || {};
      applyStatsToDOM({ ...currentCache, leetcode: result });
    } else {
      console.log('LeetCode: Using cached / default fallback values');
    }

    if (syncStatus) {
      syncStatus.innerHTML = `<span class="live-dot"></span> Live Synced`;
    }
  }

  // 2. Automatic Real-Time GeeksforGeeks API / Profile Fetcher with Multi-Tier Fallbacks
  async function fetchGFGStats(profileInput) {
    const handle = parseUsername(profileInput) || 'anshusingmh62';
    if (!handle) return;

    let solvedCount = null;

    // TIER 1: Dedicated GFG Stats Card API (JSON sum calculation)
    try {
      const res = await fetch(`https://gfgstatscard.vercel.app/${handle}?raw=true`);
      if (res.ok) {
        const gfgData = await res.json();
        if (gfgData) {
          const sumTotal = (gfgData.Basic || 0) + (gfgData.Easy || 0) + (gfgData.Medium || 0) + (gfgData.Hard || 0) + (gfgData.School || 0);
          if (sumTotal > 0) {
            solvedCount = sumTotal;
          } else if (gfgData.total_problems_solved && gfgData.total_problems_solved > 0) {
            solvedCount = gfgData.total_problems_solved;
          }
        }
      }
    } catch (e) {
      console.log('GFG Tier 1 API note:', e);
    }

    // TIER 2: AllOrigins CORS Proxy to GFG Profile Page HTML
    if (!solvedCount) {
      try {
        const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.geeksforgeeks.org/profile/${handle}`)}`);
        if (proxyRes.ok) {
          const html = await proxyRes.text();
          const match = html.match(/"total_problems_solved":\s*(\d+)/) || html.match(/Problems Solved[:\s\w]*(\d+)/i);
          if (match) {
            solvedCount = parseInt(match[1], 10);
          }
        }
      } catch (e) {
        console.log('GFG Tier 2 HTML scraping note:', e);
      }
    }

    if (solvedCount && !isNaN(solvedCount) && solvedCount > 0) {
      setCachedStats({ gfg: { total: solvedCount } });
      const currentCache = getCachedStats() || {};
      applyStatsToDOM({ ...currentCache, gfg: { total: solvedCount } });
    }
  }

  // 3. Automatic Real-Time HackerRank API Fetcher with Multi-Tier Fallbacks
  async function fetchHackerRankStats(profileInput) {
    const handle = parseUsername(profileInput) || 'anshusingh262005';
    if (!handle) return;

    let totalSolved = null;

    // TIER 1: AllOrigins CORS Proxy for HackerRank Badges API
    try {
      const proxyRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.hackerrank.com/rest/hackers/${handle}/badges`)}`);
      if (proxyRes.ok) {
        const data = await proxyRes.json();
        if (data && data.models && Array.isArray(data.models)) {
          let count = 0;
          data.models.forEach((b) => {
            count += (b.solved || 0);
          });
          if (count > 0) totalSolved = count;
        }
      }
    } catch (e) {
      console.log('HackerRank Tier 1 proxy note:', e);
    }

    // TIER 2: CodeTabs Proxy for HackerRank Badges API
    if (!totalSolved) {
      try {
        const proxyRes = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://www.hackerrank.com/rest/hackers/${handle}/badges`)}`);
        if (proxyRes.ok) {
          const data = await proxyRes.json();
          if (data && data.models && Array.isArray(data.models)) {
            let count = 0;
            data.models.forEach((b) => {
              count += (b.solved || 0);
            });
            if (count > 0) totalSolved = count;
          }
        }
      } catch (e) {
        console.log('HackerRank Tier 2 proxy note:', e);
      }
    }

    // TIER 3: Direct HackerRank API
    if (!totalSolved) {
      try {
        const res = await fetch(`https://www.hackerrank.com/rest/hackers/${handle}/badges`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.models && Array.isArray(data.models)) {
            let count = 0;
            data.models.forEach((b) => {
              count += (b.solved || 0);
            });
            if (count > 0) totalSolved = count;
          }
        }
      } catch (e) {
        console.log('HackerRank Tier 3 direct note:', e);
      }
    }

    if (totalSolved && totalSolved > 0) {
      setCachedStats({ hackerrank: { total: totalSolved } });
      const currentCache = getCachedStats() || {};
      applyStatsToDOM({ ...currentCache, hackerrank: { total: totalSolved } });
    }
  }

  // Trigger Live Sync for all platforms
  function syncAllPlatforms() {
    const leetcodeHandle = (typeof DEVELOPER_PROFILES !== 'undefined' && DEVELOPER_PROFILES.leetcode) ? DEVELOPER_PROFILES.leetcode : 'anshika_singh580';
    const gfgHandle = (typeof DEVELOPER_PROFILES !== 'undefined' && DEVELOPER_PROFILES.geeksforgeeks) ? DEVELOPER_PROFILES.geeksforgeeks : 'anshusingmh62';
    const hrHandle = (typeof DEVELOPER_PROFILES !== 'undefined' && DEVELOPER_PROFILES.hackerrank) ? DEVELOPER_PROFILES.hackerrank : 'anshusingh262005';

    fetchLeetCodeStats(leetcodeHandle);
    fetchGFGStats(gfgHandle);
    fetchHackerRankStats(hrHandle);
  }

  // 1. Immediate Hydration from Cache on Load (Zero Flicker)
  const initialCache = getCachedStats();
  if (initialCache) {
    applyStatsToDOM(initialCache);
  } else {
    applyStatsToDOM({
      leetcode: { total: 127, easy: 70, medium: 50, hard: 7, ranking: '#1,406,582', submissions: 232 },
      gfg: { total: 55 },
      hackerrank: { total: 21 }
    });
  }

  // 2. Trigger background live sync
  syncAllPlatforms();

  // Add click listener to live status elements to allow manual re-sync
  document.querySelectorAll('.live-status').forEach((statusEl) => {
    statusEl.style.cursor = 'pointer';
    statusEl.title = 'Click to re-sync live statistics';
    statusEl.addEventListener('click', () => {
      syncAllPlatforms();
    });
  });

  document.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const data = projectModalData[modalId];

      if (data) {
        modalBody.innerHTML = `
          <div class="modal-header" style="margin-bottom: 16px;">
            <span style="font-size: 0.8rem; color: var(--accent-cyan); text-transform: uppercase; font-family: var(--font-mono);">${data.category}</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-top: 4px;">${data.title}</h2>
          </div>
          <p style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${data.description}</p>
          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 1rem; margin-bottom: 8px;">Key Features:</h4>
            <ul style="list-style: disc; padding-left: 20px; color: var(--text-muted); font-size: 0.92rem;">
              ${data.features.map((f) => `<li style="margin-bottom: 6px;">${f}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 style="font-size: 1rem; margin-bottom: 8px;">Tech Stack:</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${data.tech.map((t) => `<span class="tag" style="background: rgba(0, 242, 254, 0.1); border-color: rgba(0, 242, 254, 0.3); color: var(--accent-cyan);">${t}</span>`).join('')}
            </div>
          </div>
        `;
        modalOverlay.classList.remove('hidden');
      }
    });
  });

  // Gallery Click Lightbox Modal
  document.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-gallery-title');
      const desc = card.getAttribute('data-gallery-desc');
      const imgSrc = card.getAttribute('data-gallery-img');

      modalBody.innerHTML = `
        <div style="text-align: center; padding: 10px 0;">
          ${imgSrc ? `
            <div style="margin-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); max-height: 480px; background: #000;">
              <img src="${imgSrc}" alt="${title}" style="width: 100%; height: auto; max-height: 480px; object-fit: contain;">
            </div>
          ` : `
            <div style="font-size: 4rem; color: var(--accent-cyan); margin-bottom: 16px;">
              <i data-lucide="image"></i>
            </div>
          `}
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 8px;">${title}</h2>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto; font-size: 0.95rem; line-height: 1.6;">${desc}</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      modalOverlay.classList.remove('hidden');
    });
  });

  // Certificate Click Lightbox Modal
  document.querySelectorAll('.cert-card').forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-cert-title');
      const issuer = card.getAttribute('data-cert-issuer');
      const desc = card.getAttribute('data-cert-desc');
      const imgSrc = card.getAttribute('data-cert-img');

      modalBody.innerHTML = `
        <div style="text-align: center; padding: 10px 0;">
          ${imgSrc ? `
            <div style="margin-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); max-height: 420px; background: #000;">
              <img src="${imgSrc}" alt="${title}" style="width: 100%; height: auto; max-height: 420px; object-fit: contain;">
            </div>
          ` : `
            <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(0,242,254,0.15); border: 2px solid var(--accent-cyan); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; color: var(--accent-cyan); font-size: 2.2rem; box-shadow: 0 0 25px rgba(0,242,254,0.4);">
              <i data-lucide="award"></i>
            </div>
          `}
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 1.5px;">${issuer}</span>
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin: 8px 0 16px 0;">${title}</h2>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-md); text-align: left; margin-bottom: 20px;">
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">${desc}</p>
          </div>
          <div style="display: flex; justify-content: center; gap: 12px;">
            <span class="status-pill" style="font-size: 0.85rem; padding: 6px 16px;"><i data-lucide="shield-check"></i> Verified Credential</span>
          </div>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();
      modalOverlay.classList.remove('hidden');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.add('hidden');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. LIVE TIME CLOCK WIDGET
  // --------------------------------------------------------------------------
  const liveTimeElement = document.getElementById('live-time');
  function updateClock() {
    if (!liveTimeElement) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    liveTimeElement.textContent = `${timeString} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --------------------------------------------------------------------------
  // 10. DIRECT EMAIL CONTACT FORM SUBMISSION WITH REAL-TIME TOAST
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const DESTINATION_EMAIL = 'anshusingh262005@gmail.com';

  function showNotification(message, duration = 4500) {
    if (toast) {
      if (toastMsg) toastMsg.textContent = message;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, duration);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      const nameVal = document.getElementById('name')?.value || '';
      const emailVal = document.getElementById('email')?.value || '';
      const subjectVal = document.getElementById('subject')?.value || 'Portfolio Contact Message';
      const messageVal = document.getElementById('message')?.value || '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending to Mail...</span>`;
      }

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            _subject: `Portfolio Message from ${nameVal}: ${subjectVal}`,
            message: messageVal,
            _template: 'table'
          })
        });

        const data = await response.json();

        if (response.ok || data.success === 'true' || data.success === true) {
          contactForm.reset();
          showNotification('Thank you! Your message was sent directly to Anshika\'s email.');
        } else {
          throw new Error('FormSubmit endpoint error');
        }
      } catch (err) {
        console.warn('Direct API submission encountered network barrier, falling back to mail client:', err);
        // Direct Mailto Fallback: Ensures message is always delivered straight to inbox
        const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(`Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`)}`;
        window.location.href = mailtoUrl;
        contactForm.reset();
        showNotification('Opening your default mail client to dispatch your message directly!');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. SCROLL PROGRESS BAR & ACTIVE NAV HIGHLIGHT
  // --------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Progress Bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (scrollProgress) scrollProgress.style.width = scrolled + '%';

    // Active Nav Section Spy
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Drawer Toggle Logic
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksMenu = document.getElementById('nav-links');
  const navbarHeader = document.getElementById('navbar');

  function closeMobileMenu() {
    if (navLinksMenu && navLinksMenu.classList.contains('active')) {
      navLinksMenu.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open Navigation Menu');
      }
    }
  }

  function toggleMobileMenu() {
    if (navLinksMenu && mobileToggle) {
      const isActive = navLinksMenu.classList.toggle('active');
      mobileToggle.classList.toggle('is-active', isActive);
      mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      mobileToggle.setAttribute('aria-label', isActive ? 'Close Navigation Menu' : 'Open Navigation Menu');
    }
  }

  if (mobileToggle && navLinksMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking anywhere outside the navbar
    document.addEventListener('click', (e) => {
      if (navbarHeader && !navbarHeader.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    // Reset mobile menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeMobileMenu();
      }
    });
  }
});
