document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const realSite = document.getElementById("real-site");
  const introButtons = document.querySelectorAll("#intro .buttons .btn");
  const navLinks = document.querySelectorAll('.ul-list a[href^="#"]');
  const navItems = document.querySelectorAll(".ul-list li");
  const sections = document.querySelectorAll("main section[id]");

  let hasEnteredSite = false;
  let autoTimer = null;

  // ===============================
  // 1. ANIMAÇÃO DE ENTRADA DO INTRO
  // ===============================
  const animations = [
    { selector: ".top-tags", className: "from-top", delay: 0 },
    { selector: ".left h1", className: "from-left", delay: 0.2 },
    { selector: ".desc", className: "from-left", delay: 0.45 },
    { selector: ".live-line", className: "from-bottom", delay: 0.7 },
    { selector: ".buttons", className: "zoom-in", delay: 0.95 },
    { selector: ".site-link", className: "from-bottom", delay: 1.15 },
    { selector: ".right", className: "from-right", delay: 0.45 },
    { selector: ".stats", className: "from-bottom", delay: 1.25 },
  ];

  animations.forEach(({ selector, className, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.animationDelay = `${delay}s`;
    el.classList.add(className);
  });

  // ===============================
  // 2. ENTRADA NO SITE REAL
  // ===============================
  function goToSite(targetId = null) {
    if (hasEnteredSite) return;
    hasEnteredSite = true;

    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }

    if (intro) {
      intro.classList.add("smooth-out");
    }

    setTimeout(() => {
      if (intro) intro.style.display = "none";
      if (realSite) realSite.style.display = "block";

      initScrollAnimations();
      updateActiveMenu();

      if (targetId && targetId.startsWith("#")) {
        scrollToSection(targetId);
      } else {
        window.scrollTo(0, 0);
      }
    }, 1200);
  }

  // ===============================
  // 3. AUTO-ENTRADA
  // ===============================
  autoTimer = setTimeout(() => {
    goToSite();
  }, 3800);

  // ===============================
  // 4. CLIQUE NOS BOTÕES DO INTRO
  // ===============================
  introButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const isExternal = btn.getAttribute("target") === "_blank";
      if (isExternal) return;

      e.preventDefault();
      const target = btn.getAttribute("href");
      goToSite(target);
    });
  });

  // ===============================
  // 5. SCROLL SUAVE
  // ===============================
  function scrollToSection(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    if (target.classList.contains("reveal")) {
      target.classList.add("active");
    }

    const headerOffset = 100;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  navLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetSelector = this.getAttribute("href");
      if (!targetSelector) return;

      scrollToSection(targetSelector);
    });
  });

  // ===============================
  // 6. MENU ATIVO NO SCROLL
  // ===============================
  function updateActiveMenu() {
    let currentSectionId = "";

    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      const link = item.querySelector("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        item.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveMenu);
  window.addEventListener("load", updateActiveMenu);
  window.addEventListener("resize", updateActiveMenu);
});

// ===============================
// 7. REVEAL AO ROLAR
// ===============================
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("active"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}