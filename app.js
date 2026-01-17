console.log("app.js loaded");

// ---------------- THEME ----------------
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeText.textContent = isDark ? "Light" : "Dark";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
applyTheme(localStorage.getItem("theme") === "dark");

themeToggle.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark"));
});

// ---------------- DEFAULT DATA (NORMAL SITES) ----------------
const DEFAULT_DATA = {
  "Web": [
    { name: "Google", url: "https://www.google.com" },
    { name: "Wikipedia", url: "https://www.wikipedia.org" },
    { name: "BBC", url: "https://www.bbc.co.uk" },
    { name: "Reddit", url: "https://www.reddit.com" }
  ],
  "Gaming": [
    { name: "Poki", url: "https://poki.com" },
    { name: "CrazyGames", url: "https://www.crazygames.com" },
    { name: "Coolmath Games", url: "https://www.coolmathgames.com" },
    { name: "itch.io", url: "https://itch.io" },
    { name: "Steam", url: "https://store.steampowered.com" }
  ],
  "Tools": [
    { name: "GitHub", url: "https://github.com" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
    { name: "Google Drive", url: "https://drive.google.com" },
    { name: "Gmail", url: "https://mail.google.com" }
  ],
  "Social": [
    { name: "Discord", url: "https://discord.com" },
    { name: "YouTube", url: "https://www.youtube.com" },
    { name: "Spotify", url: "https://open.spotify.com" }
  ]
};

function loadData() {
  const raw = localStorage.getItem("linkData_v1");
  if (!raw) return structuredClone(DEFAULT_DATA);
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return structuredClone(DEFAULT_DATA);
    return parsed;
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}
function saveData() {
  localStorage.setItem("linkData_v1", JSON.stringify(data));
}

let data = loadData();

// ---------------- NAV (PAGES) ----------------
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const pages = {
  dashboard: document.getElementById("page-dashboard"),
  categories: document.getElementById("page-categories"),
  settings: document.getElementById("page-settings"),
};
const pageTitle = document.getElementById("pageTitle");
const dashboardTools = document.getElementById("dashboardTools");

function showPage(key) {
  Object.values(pages).forEach(p => p.classList.remove("show"));
  pages[key].classList.add("show");

  navItems.forEach(btn => btn.classList.toggle("active", btn.dataset.page === key));

  pageTitle.textContent =
    key === "dashboard" ? "Dashboard" :
    key === "categories" ? "Categories" :
    "Settings";

  dashboardTools.style.display = (key === "dashboard") ? "flex" : "none";
}
navItems.forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.page)));

// ---------------- SIDEBAR COLLAPSIBLE SECTIONS ----------------
document.querySelectorAll(".group-header").forEach(header => {
  header.addEventListener("click", () => {
    header.closest(".side-group").classList.toggle("collapsed");
  });
});

// ---------------- DASHBOARD ----------------
const linkGrid = document.getElementById("linkGrid");
const searchInput = document.getElementById("searchInput");

function allLinksFlat() {
  return Object.entries(data).flatMap(([category, links]) =>
    (links || []).map(l => ({ ...l, category }))
  );
}

function renderDashboard() {
  linkGrid.innerHTML = "";

  const q = (searchInput.value || "").trim().toLowerCase();
  const links = allLinksFlat().filter(item => {
    const t = `${item.name} ${item.category}`.toLowerCase();
    return t.includes(q);
  });

  for (const item of links) {
    const a = document.createElement("a");
    a.className = "card";
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noreferrer";

    a.innerHTML = `
      <div class="card-icon">🔗</div>
      <div class="card-title">${escapeHtml(item.name)}</div>
      <div class="card-meta">${escapeHtml(item.category)}</div>
    `;
    linkGrid.appendChild(a);
  }
}
searchInput.addEventListener("input", renderDashboard);

// ---------------- CATEGORIES (DROPDOWN TABS + CRUD) ----------------
const categoriesWrap = document.getElementById("categoriesWrap");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const newLinkName = document.getElementById("newLinkName");
const newLinkUrl = document.getElementById("newLinkUrl");

function renderCategories() {
  categoriesWrap.innerHTML = "";

  const categoryNames = Object.keys(data);

  for (const cat of categoryNames) {
    const item = document.createElement("div");
    item.className = "acc-item";

    item.innerHTML = `
      <div class="acc-header">
        <div class="acc-title">📁 <span>${escapeHtml(cat)}</span></div>
        <div class="acc-actions">
          <button data-action="addlink" type="button">+ Link</button>
          <button data-action="rename" type="button">Rename</button>
          <button data-action="deletecat" type="button">Delete</button>
          <span class="acc-arrow">▾</span>
        </div>
      </div>

      <div class="acc-body">
        <div class="acc-grid"></div>
      </div>
    `;

    const header = item.querySelector(".acc-header");
    const grid = item.querySelector(".acc-grid");

    const links = data[cat] || [];
    if (links.length === 0) {
      const empty = document.createElement("div");
      empty.className = "tiny";
      empty.style.padding = "10px 0 0";
      empty.textContent = "No links yet. Click + Link to add one.";
      item.querySelector(".acc-body").appendChild(empty);
    } else {
      links.forEach((l, idx) => {
        const row = document.createElement("div");
        row.className = "mini";

        row.innerHTML = `
          <div>
            ${escapeHtml(l.name)}
            <div><small>${escapeHtml(shortUrl(l.url))}</small></div>
          </div>
          <div class="mini-actions">
            <button data-action="edit" data-idx="${idx}" type="button">✏️</button>
            <button data-action="remove" data-idx="${idx}" type="button">🗑️</button>
          </div>
        `;

        row.addEventListener("click", (e) => {
          if (e.target.closest("button")) return;
          window.open(l.url, "_blank", "noreferrer");
        });

        grid.appendChild(row);
      });
    }

    // open/close (ignore when clicking action buttons)
    header.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      item.classList.toggle("open");
    });

    // category actions
    item.querySelectorAll(".acc-actions button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;

        if (action === "addlink") {
          const name = (newLinkName.value || "").trim() || prompt("Link name?");
          const url = (newLinkUrl.value || "").trim() || prompt("Link URL? (include https://)");
          if (!name || !url) return;

          data[cat] = data[cat] || [];
          data[cat].push({ name: name.trim(), url: url.trim() });
          saveData();
          newLinkName.value = "";
          newLinkUrl.value = "";
          renderCategories();
          renderDashboard();
        }

        if (action === "rename") {
          const next = prompt("New category name:", cat);
          if (!next) return;
          const trimmed = next.trim();
          if (!trimmed || trimmed === cat) return;
          if (data[trimmed]) return alert("That category already exists.");

          data[trimmed] = data[cat];
          delete data[cat];
          saveData();
          renderCategories();
          renderDashboard();
        }

        if (action === "deletecat") {
          const ok = confirm(`Delete category "${cat}" and all its links?`);
          if (!ok) return;
          delete data[cat];
          saveData();
          renderCategories();
          renderDashboard();
        }
      });
    });

    // link actions
    item.querySelectorAll(".mini-actions button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const idx = Number(btn.dataset.idx);

        if (action === "remove") {
          data[cat].splice(idx, 1);
          saveData();
          renderCategories();
          renderDashboard();
        }

        if (action === "edit") {
          const cur = data[cat][idx];
          const name = prompt("Link name:", cur.name);
          if (!name) return;
          const url = prompt("Link URL:", cur.url);
          if (!url) return;

          data[cat][idx] = { name: name.trim(), url: url.trim() };
          saveData();
          renderCategories();
          renderDashboard();
        }
      });
    });

    categoriesWrap.appendChild(item);
  }
}

addCategoryBtn.addEventListener("click", () => {
  const name = prompt("Category name:");
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;
  if (data[trimmed]) return alert("That category already exists.");

  data[trimmed] = [];
  saveData();
  renderCategories();
  renderDashboard();
});

// ---------------- SETTINGS: RESET DATA ----------------
const resetDataBtn = document.getElementById("resetDataBtn");
resetDataBtn.addEventListener("click", () => {
  const ok = confirm("Reset saved categories + links back to defaults?");
  if (!ok) return;
  localStorage.removeItem("linkData_v1");
  data = loadData();
  renderCategories();
  renderDashboard();
});

// ---------------- HELPERS ----------------
function shortUrl(u) {
  try {
    const url = new URL(u);
    return url.hostname.replace("www.", "");
  } catch {
    return u;
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---------------- INIT ----------------
showPage("dashboard");
renderCategories();
renderDashboard();
