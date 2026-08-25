/* =========================================================================
   script.js
   รวมฟังก์ชันการทำงานทั้งหมดของเว็บไซต์ Portfolio
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1) NAVBAR: เปลี่ยนพื้นหลังเมื่อ Scroll
     =================================================================== */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* ===================================================================
     2) HAMBURGER MENU (มือถือ)
     =================================================================== */
  const navToggle = document.getElementById('navbarToggle');
  const navMenu = document.getElementById('navbarMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // ปิดเมนูอัตโนมัติเมื่อคลิกลิงก์ใด ๆ (บนมือถือ)
  document.querySelectorAll('.navbar__link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  /* ===================================================================
     3) SMOOTH SCROLL + ACTIVE MENU HIGHLIGHT
     =================================================================== */
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id]');

  // Smooth scroll ทำงานผ่าน CSS (scroll-behavior: smooth) อยู่แล้ว
  // แต่เพิ่ม JS เพื่อรองรับ browser เก่า และคำนวณ offset ของ navbar ให้แม่นยำ
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  // ไฮไลต์เมนูที่ Active ตาม Section ที่กำลังมองเห็น
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((section) => sectionObserver.observe(section));


  /* ===================================================================
     4) SCROLL REVEAL ANIMATION (Fade In เมื่อ Scroll)
     =================================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // แสดงครั้งเดียวพอ ไม่ต้องซ้ำ
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));


  /* ===================================================================
     5) PROGRESS BAR ANIMATION (Skills Section)
     =================================================================== */
  const skillCards = document.querySelectorAll('.skill-card');

  const animateCounter = (el, target) => {
    let current = 0;
    const duration = 1100; // ms
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = `${Math.round(current)}%`;
    }, stepTime);
  };

  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const fill = card.querySelector('.skill-bar__fill');
          const valueEl = card.querySelector('.skill-card__value');
          const percent = fill.dataset.fill;

          fill.style.width = `${percent}%`;
          animateCounter(valueEl, Number(percent));

          obs.unobserve(card);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillCards.forEach((card) => skillObserver.observe(card));


  /* ===================================================================
     6) SCROLL TO TOP BUTTON
     =================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 480);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ===================================================================
     7) DYNAMIC CURRENT YEAR (Footer)
     =================================================================== */
  document.getElementById('currentYear').textContent = new Date().getFullYear();


  /* ===================================================================
     8) FORM VALIDATION (Contact Form)
     =================================================================== */
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formSuccess = document.getElementById('formSuccess');

  const setError = (input, errorId, message) => {
    document.getElementById(errorId).textContent = message;
    input.closest('.form-group').classList.toggle('has-error', Boolean(message));
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.remove('show');

    let isValid = true;

    // ตรวจสอบชื่อ
    if (nameInput.value.trim().length < 2) {
      setError(nameInput, 'nameError', 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร');
      isValid = false;
    } else {
      setError(nameInput, 'nameError', '');
    }

    // ตรวจสอบอีเมล
    if (!isValidEmail(emailInput.value.trim())) {
      setError(emailInput, 'emailError', 'กรุณากรอกอีเมลให้ถูกต้อง');
      isValid = false;
    } else {
      setError(emailInput, 'emailError', '');
    }

    // ตรวจสอบข้อความ
    if (messageInput.value.trim().length < 10) {
      setError(messageInput, 'messageError', 'กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร');
      isValid = false;
    } else {
      setError(messageInput, 'messageError', '');
    }

    if (isValid) {
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }
  });


  /* ===================================================================
     9) HERO NETWORK ANIMATION (ลายเซ็นของหน้าเว็บ)
     วาดโครงข่ายจุด-เส้นแบบ Neural Network เคลื่อนไหวช้า ๆ บน Hero Section
     =================================================================== */
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  const heroSection = document.querySelector('.hero');
  let nodes = [];
  let animationId;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const resizeCanvas = () => {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  };

  const createNodes = () => {
    const density = Math.max(18, Math.floor((canvas.width * canvas.height) / 42000));
    nodes = Array.from({ length: density }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1.2,
    }));
  };

  const drawFrame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // อัปเดตตำแหน่งจุด
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
      if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
    });

    // วาดเส้นเชื่อมระหว่างจุดที่อยู่ใกล้กัน
    const maxDist = 150;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = 1 - dist / maxDist;
          ctx.strokeStyle = `rgba(47, 123, 246, ${opacity * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // วาดจุด (nodes)
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(16, 40, 95, 0.5)';
      ctx.fill();
    });

    animationId = requestAnimationFrame(drawFrame);
  };

  if (!prefersReducedMotion) {
    resizeCanvas();
    createNodes();
    drawFrame();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationId);
      resizeCanvas();
      createNodes();
      drawFrame();
    });
  }


  /* ===================================================================
     10) TYPING EFFECT (Hero Role)
     พิมพ์และลบข้อความสลับกันไปเรื่อย ๆ แบบ Typewriter
     =================================================================== */
  const typingEl = document.getElementById('typingText');
  const typingPhrases = [
    'นักศึกษาวิศวกรรมปัญญาประดิษฐ์และนวัตกรรมดิจิทัล',
    'AI & Machine Learning Enthusiast',
    'Web Developer',
    'IoT Maker',
  ];

  if (typingEl) {
    if (prefersReducedMotion) {
      // ถ้าผู้ใช้ตั้งค่าลดการเคลื่อนไหว ให้แสดงข้อความแรกแบบนิ่ง ๆ พอ
      typingEl.textContent = typingPhrases[0];
    } else {
      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const typeLoop = () => {
        const currentPhrase = typingPhrases[phraseIndex];

        if (!isDeleting) {
          charIndex++;
          typingEl.textContent = currentPhrase.slice(0, charIndex);
          if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeLoop, 1800); // หยุดพักก่อนเริ่มลบ
            return;
          }
        } else {
          charIndex--;
          typingEl.textContent = currentPhrase.slice(0, charIndex);
          if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % typingPhrases.length;
          }
        }

        const speed = isDeleting ? 35 : 65;
        setTimeout(typeLoop, speed);
      };

      typeLoop();
    }
  }


  /* ===================================================================
     11) CUSTOM CURSOR (วงแหวน + จุด ตามเมาส์)
     ทำงานเฉพาะอุปกรณ์ที่มีเมาส์จริง (hover: hover) และไม่เปิดถ้าลดการเคลื่อนไหว
     =================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const hasFineCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFineCursor && !prefersReducedMotion && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.classList.remove('cursor--hidden');
      cursorRing.classList.remove('cursor--hidden');
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.classList.add('cursor--hidden');
      cursorRing.classList.add('cursor--hidden');
    });

    // วงแหวนตามเมาส์แบบหน่วงเวลาเล็กน้อย (lerp) เพื่อความลื่นไหล
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // ขยายวงแหวนเมื่อ Hover องค์ประกอบที่คลิกได้
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .tilt');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor--hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor--hover'));
    });
  }


  /* ===================================================================
     12) PARTICLE TRAIL (อนุภาคไล่ตามเมาส์)
     =================================================================== */
  const particleCanvas = document.getElementById('particleCanvas');

  if (hasFineCursor && !prefersReducedMotion && particleCanvas) {
    const pctx = particleCanvas.getContext('2d');
    let particles = [];
    let lastSpawn = 0;

    const resizeParticleCanvas = () => {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    };
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);

    window.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSpawn > 30) { // จำกัดอัตราการสร้างอนุภาคใหม่
        lastSpawn = now;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 3 + 1.5,
          life: 1,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.2,
          hue: Math.random() > 0.5 ? '47, 123, 246' : '34, 211, 238',
        });
      }
    });

    const drawParticles = () => {
      pctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        pctx.beginPath();
        pctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        pctx.fillStyle = `rgba(${p.hue}, ${p.life * 0.6})`;
        pctx.fill();
      });

      particles = particles.filter((p) => p.life > 0);
      requestAnimationFrame(drawParticles);
    };
    drawParticles();
  }


  /* ===================================================================
     13) 3D TILT CARDS (Skills / Portfolio / About)
     คำนวณมุมเอียงตามตำแหน่งเมาส์เทียบกับศูนย์กลางการ์ด พร้อม Glare
     =================================================================== */
  const tiltCards = document.querySelectorAll('.tilt');
  const hasHover = window.matchMedia('(hover: hover)').matches;

  if (hasHover && !prefersReducedMotion) {
    const maxTilt = 8; // องศาการเอียงสูงสุด

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const percentX = (e.clientX - rect.left) / rect.width;
        const percentY = (e.clientY - rect.top) / rect.height;

        const rotateY = (percentX - 0.5) * (maxTilt * 2);
        const rotateX = -(percentY - 0.5) * (maxTilt * 2);

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
        card.style.setProperty('--mx', `${percentX * 100}%`);
        card.style.setProperty('--my', `${percentY * 100}%`);
        card.classList.add('tilt--active');
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.classList.remove('tilt--active');
      });
    });
  }


  /* ===================================================================
     14) COPY EMAIL BUTTON
     =================================================================== */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyToast = document.getElementById('copyToast');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'toonwarit14@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
      } catch (err) {
        // สำรองกรณี Clipboard API ใช้งานไม่ได้: สร้าง input ชั่วคราวเพื่อคัดลอก
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      copyToast.classList.add('show');
      setTimeout(() => copyToast.classList.remove('show'), 1800);
    });
  }

});
