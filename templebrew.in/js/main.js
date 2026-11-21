/**
 * TEMPLEBREW MAIN CONTROLLER
 * Animations, Steam simulation, ScrollTrigger, Soundscape & Navigation
 * Domain: https://templebrew.in
 */

(function () {
  'use strict';

  // ==========================================
  // 1. ORGANIC RISING COFFEE STEAM SIMULATOR
  // ==========================================
  function initSteamSimulation() {
    const canvas = document.getElementById('steamCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = window.innerWidth <= 860 ? 35 : 65;

    class SteamParticle {
      constructor() {
        this.reset();
      }

      reset() {
        // Emit from near the bottom right (around the brass tumbler / coffee cup)
        const emitterX = window.innerWidth > 1100 ? width * 0.82 : width * 0.5;
        const emitterY = height * 0.72;

        this.x = emitterX + (Math.random() - 0.5) * 40;
        this.y = emitterY + (Math.random() - 0.5) * 20;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = -(Math.random() * 1.2 + 0.8);
        this.radius = Math.random() * 20 + 15;
        this.maxRadius = this.radius * (Math.random() * 3 + 3);
        this.growth = (this.maxRadius - this.radius) / 120;
        this.life = 0;
        this.maxLife = Math.random() * 80 + 100;
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.12 + 0.05;
        this.curlFreq = Math.random() * 0.03 + 0.01;
        this.curlAmp = Math.random() * 1.2 + 0.5;
      }

      update() {
        this.life++;
        this.x += this.vx + Math.sin(this.life * this.curlFreq) * this.curlAmp;
        this.y += this.vy;
        this.radius += this.growth;

        // Fade in then fade out
        if (this.life < 30) {
          this.alpha = (this.life / 30) * this.maxAlpha;
        } else {
          this.alpha = (1 - (this.life - 30) / (this.maxLife - 30)) * this.maxAlpha;
        }

        if (this.life >= this.maxLife || this.y < height * 0.2) {
          this.reset();
        }
      }

      draw() {
        if (this.alpha <= 0.002) return;
        ctx.save();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, `rgba(244, 232, 211, ${this.alpha})`);
        grad.addColorStop(0.4, `rgba(230, 185, 106, ${this.alpha * 0.6})`);
        grad.addColorStop(1, 'rgba(23, 9, 5, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      const p = new SteamParticle();
      p.life = Math.random() * p.maxLife; // Stagger initial life
      particles.push(p);
    }

    function renderSteam() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(renderSteam);
    }

    renderSteam();
  }

  // ==========================================
  // 2. SLIDE NAVIGATION & SCROLL TRACKING
  // ==========================================
  function initSlideNavigation() {
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.slide-dot');
    const headerNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

    // Update active dot based on scroll position
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const slideId = entry.target.id;
          
          navDots.forEach(dot => {
            const href = dot.getAttribute('href');
            if (href === `#${slideId}`) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });

          headerNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${slideId}`) {
              link.classList.add('text-warm-gold');
            } else {
              link.classList.remove('text-warm-gold');
            }
          });
        }
      });
    }, {
      threshold: 0.4
    });

    slides.forEach(slide => observer.observe(slide));

    // Smooth Scroll for Navigation Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElem = document.querySelector(targetId);
          if (targetElem) {
            e.preventDefault();
            targetElem.scrollIntoView({ behavior: 'smooth' });

            // Close mobile drawer if open
            closeMobileDrawer();
          }
        }
      });
    });
  }

  // ==========================================
  // 3. MOBILE DRAWER NAVIGATION
  // ==========================================
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMobileDrawer);

  // ==========================================
  // 4. GSAP SCROLL REVEALS & CARD HOVERS
  // ==========================================
  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);

    // Slide 2: Products Cards Stagger Reveal
    gsap.from('.product-card', {
      scrollTrigger: {
        trigger: '#slide-2',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 60,
      opacity: 0,
      duration: 1.1,
      stagger: 0.25,
      ease: 'power3.out'
    });

    // Slide 3: Story Visual & Narrative Entrance
    gsap.from('.story-visual-column', {
      scrollTrigger: {
        trigger: '#slide-3',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      x: -50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.story-narrative-column', {
      scrollTrigger: {
        trigger: '#slide-3',
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    // Slide 3: 6 Brand Values Progressive Cards Reveal
    gsap.from('.value-card', {
      scrollTrigger: {
        trigger: '.values-section-wrap',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power2.out'
    });

    // Slide 4: Contact & Map Panel Reveal
    gsap.from('.contact-info-panel', {
      scrollTrigger: {
        trigger: '#slide-4',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 45,
      opacity: 0,
      duration: 1.0,
      ease: 'power3.out'
    });

    gsap.from('.map-container-card', {
      scrollTrigger: {
        trigger: '#slide-4',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 45,
      opacity: 0,
      duration: 1.0,
      delay: 0.2,
      ease: 'power3.out'
    });

    // 3D Card Tilt Effect on Value Cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotX = -(y / (rect.height / 2)) * 8;
        const rotY = (x / (rect.width / 2)) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // =======================================================
  // 5. PROCEDURAL TEMPLE TOWN AMBIENCE (Web Audio API)
  // Generates warm meditative coffee tones & temple chimes
  // =======================================================
  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let ambientInterval = null;

  function toggleAudio() {
    const audioBtn = document.getElementById('ambientAudioBtn');
    const audioIcon = document.getElementById('audioIcon');

    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      isPlaying = true;
      startAmbience();
      if (audioBtn) audioBtn.classList.add('playing');
      if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-2');
    } else {
      isPlaying = false;
      stopAmbience();
      if (audioBtn) audioBtn.classList.remove('playing');
      if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-x');
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function playTempleChime(freq, delaySec = 0) {
    if (!audioCtx || !masterGain || !isPlaying) return;

    const osc = audioCtx.createOscillator();
    const chimeGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delaySec);

    // Warm bell envelope
    chimeGain.gain.setValueAtTime(0.0001, audioCtx.currentTime + delaySec);
    chimeGain.gain.exponentialRampToValueAtTime(0.35, audioCtx.currentTime + delaySec + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delaySec + 4.5);

    osc.connect(chimeGain);
    chimeGain.connect(masterGain);

    osc.start(audioCtx.currentTime + delaySec);
    osc.stop(audioCtx.currentTime + delaySec + 5.0);
  }

  function startAmbience() {
    // Warm meditative chord tones (D, A, F#, A)
    const bellFrequencies = [293.66, 440.00, 587.33, 739.99, 880.00];

    // Initial chord
    playTempleChime(bellFrequencies[0], 0.1);
    playTempleChime(bellFrequencies[2], 0.4);

    // Recurring gentle temple bell resonance
    ambientInterval = setInterval(() => {
      if (!isPlaying) return;
      const f1 = bellFrequencies[Math.floor(Math.random() * bellFrequencies.length)];
      playTempleChime(f1, 0);
      if (Math.random() > 0.4) {
        const f2 = bellFrequencies[Math.floor(Math.random() * bellFrequencies.length)];
        playTempleChime(f2, 0.6);
      }
    }, 4500);
  }

  function stopAmbience() {
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
  }

  const audioBtn = document.getElementById('ambientAudioBtn');
  if (audioBtn) {
    audioBtn.addEventListener('click', toggleAudio);
  }

  // ==========================================
  // 6. INITIALIZATION
  // ==========================================
  function initAll() {
    initSteamSimulation();
    initSlideNavigation();
    initScrollAnimations();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

