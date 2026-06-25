/* ==========================================================================
   EDITKARO.IN — MAIN SCRIPT
   Navbar · Theme toggle · Mobile menu · Scroll-reveal · Active nav links ·
   Timecode ticker · Stat counters · Portfolio filter + search · Card hover
   preview · Video modal · Featured project player · Before/After comparison ·
   Google Sheets contact form · Google Sheets newsletter subscription
   ========================================================================== */

/* --------------------------------------------------------------------------
   GOOGLE SHEETS INTEGRATION SETUP
   -------------------------------------------------------------------------
   Both forms (Contact + Newsletter) POST to a Google Apps Script Web App.

   Steps to set up your own Web App:
   1. Open Google Sheets → Extensions → Apps Script
   2. Paste the code from google-apps-script.gs (included in this repo)
   3. Deploy → New deployment → Web App
      - Execute as: Me  |  Who has access: Anyone
   4. Copy the Web App URL and paste it below as SHEETS_URL.
   -------------------------------------------------------------------------- */
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbxFB2dgzOal0UoZXtEu611LrbLq8Kz9GV5NSAZHG3jHpw-h_41XVpTAUuUcUFBzNnDtBg/exec";
// ↑ Replace YOUR_SCRIPT_ID with your real deployment ID before going live.

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------------------------ *
   * 1. NAVBAR — solid background after scrolling past the hero
   * ------------------------------------------------------------------ */
  const navbar = document.getElementById("navbar");
  const handleNavbarScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  handleNavbarScroll();
  window.addEventListener("scroll", handleNavbarScroll, { passive: true });


  /* ------------------------------------------------------------------ *
   * 1a. THEME TOGGLE
   * ------------------------------------------------------------------ */
  const THEME_KEY = "editkaro-theme";
  const themeToggle = document.getElementById("themeToggle");

  const getStoredTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
  const storeTheme = (t) => { try { localStorage.setItem(THEME_KEY, t); } catch {} };

  const applyTheme = (theme) => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (themeToggle) {
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
  };

  applyTheme(getStoredTheme() === "light" ? "light" : "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      storeTheme(next);
    });
  }


  /* ------------------------------------------------------------------ *
   * 2. MOBILE NAVIGATION
   * ------------------------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });


  /* ------------------------------------------------------------------ *
   * 3. SCROLL-REVEAL
   * ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--reveal-delay", d);
  });

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => revealObserver.observe(el));


  /* ------------------------------------------------------------------ *
   * 4. ACTIVE NAV-LINK HIGHLIGHTING
   * ------------------------------------------------------------------ */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active-link", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });

  sections.forEach((s) => sectionObserver.observe(s));


  /* ------------------------------------------------------------------ *
   * 5. TIMECODE TICKER
   * ------------------------------------------------------------------ */
  const FPS = 24;
  const startTime = Date.now();
  const timecodeEls = [
    document.getElementById("timecode"),
    document.getElementById("footerTimecode"),
  ].filter(Boolean);

  const pad = (n) => String(n).padStart(2, "0");

  const updateTimecode = () => {
    const ms = Date.now() - startTime;
    const tf = Math.floor((ms / 1000) * FPS);
    const frames = tf % FPS;
    const ts = Math.floor(tf / FPS);
    const secs = ts % 60;
    const tm = Math.floor(ts / 60);
    const mins = tm % 60;
    const hours = Math.floor(tm / 60);
    const formatted = `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
    timecodeEls.forEach((el) => { el.textContent = formatted; });
  };
  updateTimecode();
  setInterval(updateTimecode, 1000 / FPS);


  /* ------------------------------------------------------------------ *
   * 6. ANIMATED STAT COUNTERS
   * ------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll(".stat__number");

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el) => statsObserver.observe(el));


  /* ------------------------------------------------------------------ *
   * 7. PORTFOLIO FILTERING + SEARCH
   * ------------------------------------------------------------------ */
  const cards = Array.from(document.querySelectorAll(".card"));
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("portfolioSearchInput");
  const portfolioEmpty = document.getElementById("portfolioEmpty");
  let activeFilter = "all";

  const applyFilterAndSearch = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visible = 0;

    cards.forEach((card) => {
      const cat = card.getAttribute("data-category") || "";
      const title = (card.getAttribute("data-title") || "").toLowerCase();
      const desc = (card.getAttribute("data-desc") || "").toLowerCase();
      const tag = (card.getAttribute("data-tag") || "").toLowerCase();

      const matchesFilter = activeFilter === "all" || cat === activeFilter;
      const matchesSearch = !query || title.includes(query) || desc.includes(query) || tag.includes(query) || cat.includes(query);

      const show = matchesFilter && matchesSearch;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (portfolioEmpty) portfolioEmpty.hidden = visible > 0;
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeFilter = btn.getAttribute("data-filter");
      applyFilterAndSearch();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilterAndSearch);
  }


  /* ------------------------------------------------------------------ *
   * 8. HOVER / FOCUS CARD PREVIEW (inline video peek)
   * ------------------------------------------------------------------ */
  const startCardPreview = (card) => {
    const thumb = card.querySelector(".card__thumb");
    const pv = card.querySelector(".card__preview");
    if (!thumb || !pv) return;

    const videoUrl = card.getAttribute("data-video");
    if (videoUrl && !pv.src) pv.src = videoUrl;

    const p = pv.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    thumb.classList.add("is-previewing");
  };

  const stopCardPreview = (card) => {
    const thumb = card.querySelector(".card__thumb");
    const pv = card.querySelector(".card__preview");
    if (!thumb || !pv) return;
    pv.pause();
    pv.currentTime = 0;
    thumb.classList.remove("is-previewing");
  };

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => startCardPreview(card));
    card.addEventListener("mouseleave", () => stopCardPreview(card));
    card.addEventListener("focus", () => startCardPreview(card));
    card.addEventListener("blur", () => stopCardPreview(card));
  });


  /* ------------------------------------------------------------------ *
   * 9. VIDEO MODAL / LIGHTBOX
   * ------------------------------------------------------------------ */
  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalCategory = document.getElementById("modalCategory");
  const modalDuration = document.getElementById("modalDuration");
  let lastFocused = null;

  const openModal = (card) => {
    stopCardPreview(card);
    modalTitle.textContent = card.getAttribute("data-title");
    modalDesc.textContent = card.getAttribute("data-desc");
    modalCategory.textContent = card.getAttribute("data-tag");
    modalDuration.textContent = "Duration: " + card.getAttribute("data-duration");

    const videoUrl = card.getAttribute("data-video");
    modalVideo.pause();
    if (videoUrl) modalVideo.setAttribute("src", videoUrl);
    modalVideo.currentTime = 0;

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal__close").focus();
  };

  const closeModal = () => {
    modalVideo.pause();
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused) lastFocused.focus();
  };

  cards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); }
    });
  });

  modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  // Focus trap
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || modal.hidden) return;
    const focusable = Array.from(
      modal.querySelectorAll("button, [href], video, [tabindex]:not([tabindex='-1'])")
    ).filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });


  /* ------------------------------------------------------------------ *
   * 10. FEATURED PROJECT PLAY BUTTON
   * ------------------------------------------------------------------ */
  const featuredPlayBtn = document.getElementById("featuredPlayBtn");
  const featuredVideo = document.getElementById("featuredVideo");

  if (featuredPlayBtn && featuredVideo) {
    featuredPlayBtn.addEventListener("click", () => {
      const isPaused = featuredVideo.paused;
      if (isPaused) {
        featuredVideo.play().catch(() => {});
        featuredPlayBtn.setAttribute("aria-pressed", "true");
        featuredPlayBtn.style.opacity = "0";
      } else {
        featuredVideo.pause();
        featuredPlayBtn.setAttribute("aria-pressed", "false");
        featuredPlayBtn.style.opacity = "1";
      }
    });
    featuredVideo.addEventListener("pause", () => { featuredPlayBtn.style.opacity = "1"; });
    featuredVideo.addEventListener("play", () => { featuredPlayBtn.style.opacity = "0"; });
  }


  /* ------------------------------------------------------------------ *
   * 11. BEFORE / AFTER COMPARISON WIDGET
   * ------------------------------------------------------------------ */
  document.querySelectorAll("[data-compare]").forEach((widget) => {
    const frame = widget.querySelector(".compare__frame");
    const after = widget.querySelector(".compare__media--after");
    const handle = widget.querySelector(".compare__handle");
    if (!frame || !after || !handle) return;

    // Play both videos
    widget.querySelectorAll("video").forEach((v) => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });

    let dragging = false;

    const setPosition = (x) => {
      const rect = frame.getBoundingClientRect();
      let pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
      handle.style.left = pct + "%";
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.setAttribute("aria-valuenow", Math.round(pct));
      handle.setAttribute("aria-valuetext", `${Math.round(pct)} percent`);
    };

    setPosition(frame.getBoundingClientRect().left + frame.getBoundingClientRect().width / 2);

    handle.addEventListener("mousedown", () => { dragging = true; });
    document.addEventListener("mouseup", () => { dragging = false; });
    document.addEventListener("mousemove", (e) => { if (dragging) setPosition(e.clientX); });

    handle.addEventListener("touchstart", () => { dragging = true; }, { passive: true });
    document.addEventListener("touchend", () => { dragging = false; });
    document.addEventListener("touchmove", (e) => {
      if (dragging && e.touches[0]) setPosition(e.touches[0].clientX);
    }, { passive: true });

    handle.addEventListener("keydown", (e) => {
      const rect = frame.getBoundingClientRect();
      const curr = parseFloat(handle.style.left) || 50;
      if (e.key === "ArrowLeft") setPosition(rect.left + (curr - 2) / 100 * rect.width);
      if (e.key === "ArrowRight") setPosition(rect.left + (curr + 2) / 100 * rect.width);
    });
  });


  /* ------------------------------------------------------------------ *
   * 12. CONTACT FORM → GOOGLE SHEETS
   *     Fields: name, email, phone, project-type, message, timestamp
   * ------------------------------------------------------------------ */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");
  const formError = document.getElementById("formError");
  const contactSubmitBtn = document.getElementById("contactSubmitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }

      formSuccess.hidden = true;
      formError.hidden = true;
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.setAttribute("aria-busy", "true");
      const origLabel = contactSubmitBtn.textContent;
      contactSubmitBtn.textContent = "Sending…";

      const payload = {
        sheet: "Contact",
        name:    contactForm.elements["name"].value.trim(),
        email:   contactForm.elements["email"].value.trim(),
        phone:   contactForm.elements["phone"].value.trim(),
        project: contactForm.elements["project-type"].value,
        message: contactForm.elements["message"].value.trim(),
        timestamp: new Date().toISOString(),
      };

      try {
        const res = await fetch(SHEETS_URL, {
          method: "POST",
          mode: "no-cors", // Apps Script doesn't return CORS headers by default
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        // no-cors means we can't read status — assume success if no throw
        formSuccess.hidden = false;
        contactForm.reset();
        setTimeout(() => { formSuccess.hidden = true; }, 7000);
      } catch (err) {
        console.error("Contact form error:", err);
        formError.hidden = false;
      } finally {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.removeAttribute("aria-busy");
        contactSubmitBtn.textContent = origLabel;
      }
    });
  }


  /* ------------------------------------------------------------------ *
   * 13. NEWSLETTER FORM → GOOGLE SHEETS
   *     Fields: email, timestamp
   * ------------------------------------------------------------------ */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMsg = document.getElementById("newsletterMsg");
  const newsletterBtn = document.getElementById("newsletterBtn");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!newsletterForm.checkValidity()) { newsletterForm.reportValidity(); return; }

      newsletterMsg.className = "newsletter__msg";
      newsletterMsg.textContent = "";
      newsletterBtn.disabled = true;
      newsletterBtn.textContent = "Subscribing…";

      const payload = {
        sheet: "Newsletter",
        email: document.getElementById("newsletterEmail").value.trim(),
        timestamp: new Date().toISOString(),
      };

      try {
        await fetch(SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        newsletterMsg.className = "newsletter__msg success";
        newsletterMsg.textContent = "You're in! Check your inbox for a confirmation.";
        newsletterForm.reset();
      } catch (err) {
        console.error("Newsletter error:", err);
        newsletterMsg.className = "newsletter__msg error";
        newsletterMsg.textContent = "Something went wrong. Please try again.";
      } finally {
        newsletterBtn.disabled = false;
        newsletterBtn.textContent = "Subscribe";
      }
    });
  }

});
