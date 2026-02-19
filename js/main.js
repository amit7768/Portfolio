async function inject(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(url);
  const html = await res.text();
  el.innerHTML = html;
}

function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    // basic active matching
    const isActive =
      (href === "/index.html" && (path === "/" || path.endsWith("/index.html"))) ||
      (href !== "/index.html" && path.endsWith(href)) ||
      (href === "/projects.html" && path.startsWith("/projects/")) ||
      (href === "/notes.html" && path.startsWith("/notes/"));

    if (isActive) a.classList.add("active");
  });
}

function setYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

(async function boot() {
  await inject("site-header", "/components/header.html");
  await inject("site-footer", "/components/footer.html");

  setActiveNav();
  setYear();
})();


(function () {
  function initNav() {
    // ---- Mobile menu toggle ----
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");

    if (toggle && nav) {
      const closeMenu = () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      };

      toggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });

      // Close on outside click
      document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
      });

      // Close on Escape
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMenu();
      });

      // Close after clicking a link (mobile)
      nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", closeMenu);
      });
    }

    // ---- Active nav pill ----
    const pathname = window.location.pathname;

    // Highlight Projects pill on /projects/* pages
    // Highlight Notes pill on /notes/* pages
    let activeKey = null;

    if (pathname.includes("/projects/")) activeKey = "projects";
    else if (pathname.includes("/notes/")) activeKey = "notes";
    else {
      const file = pathname.split("/").pop() || "index.html";
      const map = {
        "index.html": "home",
        "projects.html": "projects",
        "notes.html": "notes",
        "about.html": "about",
      };
      activeKey = map[file] || null;
    }

    if (activeKey) {
      document
        .querySelectorAll(`.nav-link[data-nav="${activeKey}"]`)
        .forEach((el) => el.classList.add("is-active"));
    }
  }

  // Wait until header exists (for injected components)
  function waitForHeader() {
    const hasNav = document.querySelector("#site-nav") && document.querySelector(".nav-toggle");
    if (hasNav) return initNav();
    requestAnimationFrame(waitForHeader);
  }

  waitForHeader();
})();


