console.log("app.js loaded");

// =====================
// Storage keys
// =====================
const STORAGE_KEY = "dashboard_data_v2";
const SETTINGS_KEY = "dashboard_settings_v1";
const PASS_HASH_KEY = "dashboard_pass_hash_v1";
const UNLOCKED_SESSION_KEY = "dashboard_unlocked_v1";

// =====================
// Helpers
// =====================
function makeId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  ).toUpperCase();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString();
  } catch {
    return String(url || "").trim();
  }
}

function shortUrl(u) {
  try {
    const url = new URL(u);
    return url.hostname.replace("www.", "");
  } catch {
    return u;
  }
}

function faviconUrl(url) {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return "";
  }
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
  } catch {
    return {};
  }
}
function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

function cloneData(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// =====================
// Downloads (official pages)
// =====================
const DOWNLOADS = {
  launchers: [
    {
      name: "Roblox",
      url: "https://www.roblox.com/download",
      icon: "🧱",
      meta: "roblox.com",
    },
    {
      name: "Steam",
      url: "https://store.steampowered.com/about/",
      icon: "🎮",
      meta: "steampowered.com",
    },
    {
      name: "Epic Games Launcher",
      url: "https://store.epicgames.com/en-US/download",
      icon: "🛒",
      meta: "epicgames.com",
    },
  ],
  vpns: [
    {
      name: "Proton VPN",
      url: "https://protonvpn.com/download",
      icon: "🛡️",
      meta: "protonvpn.com",
    },
    {
      name: "Mullvad VPN",
      url: "https://mullvad.net/en/download/vpn/windows",
      icon: "🧅",
      meta: "mullvad.net",
    },
    {
      name: "NordVPN",
      url: "https://nordvpn.com/download/windows/",
      icon: "🌐",
      meta: "nordvpn.com",
    },
    {
      name: "ExpressVPN",
      url: "https://www.expressvpn.com/vpn-download",
      icon: "⚡",
      meta: "expressvpn.com",
    },
  ],
};

// =====================
// Default data
// =====================
function defaultData() {
  return {
    version: 2,
    categories: [
      {
        id: makeId(),
        name: "Web",
        icon: "🌐",
        color: "#0ea5e9",
        links: [
          {
            id: makeId(),
            name: "Google",
            url: "https://www.google.com",
            favourite: false,
            tags: ["search"],
            note: "",
          },
          {
            id: makeId(),
            name: "Wikipedia",
            url: "https://www.wikipedia.org",
            favourite: false,
            tags: ["reference"],
            note: "",
          },
          {
            id: makeId(),
            name: "BBC",
            url: "https://www.bbc.co.uk",
            favourite: false,
            tags: ["news"],
            note: "",
          },
          {
            id: makeId(),
            name: "Reddit",
            url: "https://www.reddit.com",
            favourite: false,
            tags: ["community"],
            note: "",
          },
          {
            id: makeId(),
            name: "Stack Overflow",
            url: "https://stackoverflow.com",
            favourite: false,
            tags: ["dev", "help"],
            note: "",
          },
        ],
      },
      {
        id: makeId(),
        name: "Gaming",
        icon: "🎮",
        color: "#22c55e",
        links: [
          {
            id: makeId(),
            name: "Poki",
            url: "https://poki.com",
            favourite: false,
            tags: ["games"],
            note: "",
          },
          {
            id: makeId(),
            name: "CrazyGames",
            url: "https://www.crazygames.com",
            favourite: false,
            tags: ["games"],
            note: "",
          },
          {
            id: makeId(),
            name: "Coolmath Games",
            url: "https://www.coolmathgames.com",
            favourite: false,
            tags: ["games"],
            note: "",
          },
          {
            id: makeId(),
            name: "itch.io",
            url: "https://itch.io",
            favourite: false,
            tags: ["indie"],
            note: "",
          },
          {
            id: makeId(),
            name: "Steam",
            url: "https://store.steampowered.com",
            favourite: false,
            tags: ["launcher"],
            note: "",
          },
          {
            id: makeId(),
            name: "Roblox",
            url: "https://www.roblox.com",
            favourite: false,
            tags: ["launcher"],
            note: "",
          },
        ],
      },
      {
        id: makeId(),
        name: "Learning",
        icon: "📚",
        color: "#f97316",
        links: [
          {
            id: makeId(),
            name: "Khan Academy",
            url: "https://www.khanacademy.org",
            favourite: false,
            tags: ["math", "learning"],
            note: "",
          },
          {
            id: makeId(),
            name: "MDN Web Docs",
            url: "https://developer.mozilla.org",
            favourite: false,
            tags: ["dev", "docs"],
            note: "",
          },
          {
            id: makeId(),
            name: "W3Schools",
            url: "https://www.w3schools.com",
            favourite: false,
            tags: ["dev"],
            note: "",
          },
          {
            id: makeId(),
            name: "FreeCodeCamp",
            url: "https://www.freecodecamp.org",
            favourite: false,
            tags: ["dev", "learning"],
            note: "",
          },
        ],
      },
      {
        id: makeId(),
        name: "Tools",
        icon: "🧰",
        color: "#a855f7",
        links: [
          {
            id: makeId(),
            name: "GitHub",
            url: "https://github.com",
            favourite: false,
            tags: ["dev"],
            note: "",
          },
          {
            id: makeId(),
            name: "ChatGPT",
            url: "https://chat.openai.com",
            favourite: false,
            tags: ["ai"],
            note: "",
          },
          {
            id: makeId(),
            name: "Google Drive",
            url: "https://drive.google.com",
            favourite: false,
            tags: ["storage"],
            note: "",
          },
          {
            id: makeId(),
            name: "Gmail",
            url: "https://mail.google.com",
            favourite: false,
            tags: ["email"],
            note: "",
          },
          {
            id: makeId(),
            name: "Google Calendar",
            url: "https://calendar.google.com",
            favourite: false,
            tags: ["calendar"],
            note: "",
          },
        ],
      },
      {
        id: makeId(),
        name: "Media",
        icon: "🎬",
        color: "#facc15",
        links: [
          {
            id: makeId(),
            name: "YouTube",
            url: "https://www.youtube.com",
            favourite: false,
            tags: ["video"],
            note: "",
          },
          {
            id: makeId(),
            name: "Spotify",
            url: "https://open.spotify.com",
            favourite: false,
            tags: ["music"],
            note: "",
          },
          {
            id: makeId(),
            name: "Twitch",
            url: "https://www.twitch.tv",
            favourite: false,
            tags: ["stream"],
            note: "",
          },
        ],
      },
      {
        id: makeId(),
        name: "Social",
        icon: "💬",
        color: "#ec4899",
        links: [
          {
            id: makeId(),
            name: "Discord",
            url: "https://discord.com",
            favourite: false,
            tags: ["chat"],
            note: "",
          },
          {
            id: makeId(),
            name: "X",
            url: "https://x.com",
            favourite: false,
            tags: ["social"],
            note: "",
          },
        ],
      },
    ],
  };
}

function fixV2(data) {
  if (!data.categories) data.categories = [];
  for (const cat of data.categories) {
    if (!cat.id) cat.id = makeId();
    if (!cat.icon) cat.icon = "📁";
    if (!cat.color) cat.color = "#4f46e5";
    if (!Array.isArray(cat.links)) cat.links = [];
    for (const link of cat.links) {
      if (!link.id) link.id = makeId();
      if (typeof link.favourite !== "boolean") link.favourite = false;
      link.url = normalizeUrl(link.url);
      if (!Array.isArray(link.tags)) link.tags = [];
      if (typeof link.note !== "string") link.note = "";
    }
  }
}

function mergeDefaults(current) {
  const def = defaultData();
  const byName = (name) => String(name || "").trim().toLowerCase();

  for (const dcat of def.categories) {
    const existing = current.categories.find(
      (c) => byName(c.name) === byName(dcat.name)
    );
    if (!existing) {
      current.categories.push(dcat);
      continue;
    }
    if (!existing.icon) existing.icon = dcat.icon || "📁";
    if (!existing.color) existing.color = dcat.color || "#4f46e5";
    const existingUrls = new Set(
      existing.links.map((l) => normalizeUrl(l.url))
    );
    for (const dlink of dcat.links) {
      const nu = normalizeUrl(dlink.url);
      if (!existingUrls.has(nu)) {
        existing.links.push({
          id: makeId(),
          name: dlink.name,
          url: nu,
          favourite: false,
          tags: dlink.tags || [],
          note: dlink.note || "",
        });
      }
    }
  }

  fixV2(current);
  return current;
}

function migrateAndFix(raw) {
  if (!raw) return defaultData();

  if (raw.version === 2 && Array.isArray(raw.categories)) {
    fixV2(raw);
    return mergeDefaults(raw);
  }

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const iconMap = {
      Web: "🌐",
      Gaming: "🎮",
      Tools: "🧰",
      Social: "💬",
      Learning: "📚",
      Media: "🎬",
    };
    const categories = Object.entries(raw).map(([name, links]) => {
      const safeLinks = Array.isArray(links) ? links : [];
      return {
        id: makeId(),
        name,
        icon: iconMap[name] || "📁",
        color: "#4f46e5",
        links: safeLinks.map((l) => ({
          id: makeId(),
          name: l?.name || "Link",
          url: normalizeUrl(l?.url || "#"),
          favourite: Boolean(l?.favourite),
          tags: [],
          note: "",
        })),
      };
    });
    const v2 = { version: 2, categories };
    fixV2(v2);
    return mergeDefaults(v2);
  }

  return defaultData();
}

function loadData() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return migrateAndFix(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return defaultData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  pushUndoState();
}

// =====================
// Theme
// =====================
const settings = loadSettings();
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const themeColorMeta = document.getElementById("themeColorMeta");
const accentColorInput = document.getElementById("accentColorInput");
const accentResetBtn = document.getElementById("accentResetBtn");

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeText.textContent = isDark ? "Light" : "Dark";
  settings.theme = isDark ? "dark" : "light";
  saveSettings(settings);
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", isDark ? "#020617" : settings.accent || "#4f46e5");
  }
}

function applyAccent(color) {
  const root = document.documentElement;
  root.style.setProperty("--accent", color);
  settings.accent = color;
  saveSettings(settings);
  if (!document.body.classList.contains("dark") && themeColorMeta) {
    themeColorMeta.setAttribute("content", color);
  }
}

const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

if (settings.accent) {
  applyAccent(settings.accent);
  if (accentColorInput) accentColorInput.value = settings.accent;
}

applyTheme(
  settings.theme === "dark" ||
    (!settings.theme && prefersDark)
);

themeToggle?.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark"));
});

accentColorInput?.addEventListener("input", (e) => {
  const val = e.target.value || "#4f46e5";
  applyAccent(val);
});

accentResetBtn?.addEventListener("click", () => {
  applyAccent("#4f46e5");
  if (accentColorInput) accentColorInput.value = "#4f46e5";
});

// =====================
// Lock screen (basic)
// =====================
const lockOverlay = document.getElementById("lockOverlay");
const unlockPassword = document.getElementById("unlockPassword");
const unlockBtn = document.getElementById("unlockBtn");
const unlockError = document.getElementById("unlockError");

function hasPassword() {
  return Boolean(localStorage.getItem(PASS_HASH_KEY));
}
function isUnlockedThisSession() {
  return sessionStorage.getItem(UNLOCKED_SESSION_KEY) === "1";
}
function setUnlockedThisSession(val) {
  sessionStorage.setItem(UNLOCKED_SESSION_KEY, val ? "1" : "0");
}

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function showLock() {
  lockOverlay.classList.remove("hidden");
  lockOverlay.setAttribute("aria-hidden", "false");
  unlockPassword.value = "";
  unlockError.classList.add("hidden");
  unlockPassword.focus();
}
function hideLock() {
  lockOverlay.classList.add("hidden");
  lockOverlay.setAttribute("aria-hidden", "true");
}
async function tryUnlock() {
  unlockError.classList.add("hidden");
  const pass = unlockPassword.value || "";
  const hash = await sha256(pass);
  const stored = localStorage.getItem(PASS_HASH_KEY);
  if (hash === stored) {
    setUnlockedThisSession(true);
    hideLock();
  } else {
    unlockError.classList.remove("hidden");
  }
}
unlockBtn?.addEventListener("click", tryUnlock);
unlockPassword?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

// =====================
// Generic app modal
// =====================
const appModal = document.getElementById("appModal");
const appModalTitle = document.getElementById("appModalTitle");
const appModalBody = document.getElementById("appModalBody");
const appModalInputs = document.getElementById("appModalInputs");
const appModalOk = document.getElementById("appModalOk");
const appModalCancel = document.getElementById("appModalCancel");

let appModalResolve = null;

function openModal({ title, body, inputs = [], okText = "OK", cancelText = "Cancel" }) {
  appModalTitle.textContent = title || "";
  appModalBody.textContent = body || "";
  appModalInputs.innerHTML = inputs
    .map(
      (inp, i) => `
      <div style="margin-top:8px;">
        ${
          inp.label
            ? `<div class="tiny" style="margin-bottom:4px;">${escapeHtml(
                inp.label
              )}</div>`
            : ""
        }
        <input
          class="input w-full"
          type="${escapeHtml(inp.type || "text")}"
          data-idx="${i}"
          value="${escapeHtml(inp.value || "")}"
          placeholder="${escapeHtml(inp.placeholder || "")}"
        />
      </div>
    `
    )
    .join("");

  appModalOk.textContent = okText;
  appModalCancel.textContent = cancelText;

  appModal.classList.remove("hidden");
  appModal.setAttribute("aria-hidden", "false");

  const firstInput = appModalInputs.querySelector("input");
  if (firstInput) firstInput.focus();

  return new Promise((resolve) => {
    appModalResolve = resolve;
  });
}

function closeModal(result) {
  appModal.classList.add("hidden");
  appModal.setAttribute("aria-hidden", "true");
  if (appModalResolve) {
    appModalResolve(result);
    appModalResolve = null;
  }
}

appModalOk.addEventListener("click", () => {
  const values = Array.from(
    appModalInputs.querySelectorAll("input")
  ).map((inp) => inp.value);
  closeModal({ ok: true, values });
});

appModalCancel.addEventListener("click", () => {
  closeModal({ ok: false, values: [] });
});

appModal.addEventListener("click", (e) => {
  if (e.target === appModal) {
    closeModal({ ok: false, values: [] });
  }
});

// =====================
// Toast
// =====================
const toastEl = document.getElementById("toast");
let toastTimer = null;

function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => toastEl.classList.add("hidden"), 200);
  }, 2000);
}

// =====================
// Pages / Navigation
// =====================
const navItems = Array.from(document.querySelectorAll(".nav-item"));
const pages = {
  dashboard: document.getElementById("page-dashboard"),
  categories: document.getElementById("page-categories"),
  downloads: document.getElementById("page-downloads"),
  settings: document.getElementById("page-settings"),
};
const pageTitle = document.getElementById("pageTitle");
const dashboardTools = document.getElementById("dashboardTools");
const sidebar = document.querySelector(".sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

function showPage(key) {
  Object.values(pages).forEach((p) => p && p.classList.remove("show"));
  if (pages[key]) pages[key].classList.add("show");
  navItems.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.page === key)
  );

  pageTitle.textContent =
    key === "dashboard"
      ? "Dashboard"
      : key === "categories"
      ? "Categories"
      : key === "downloads"
      ? "Downloads"
      : "Settings";

  if (dashboardTools) {
    dashboardTools.style.display = key === "dashboard" ? "flex" : "none";
  }
}

navItems.forEach((btn) =>
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
    if (window.innerWidth <= 760) {
      sidebar?.classList.remove("open");
    }
  })
);

sidebarToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
});

// Sidebar collapsible groups (saved)
document.querySelectorAll(".side-group").forEach((group) => {
  const key = group.getAttribute("data-group") || makeId();
  const collapsed = settings[`group_${key}`] === true;
  if (collapsed) group.classList.add("collapsed");

  const header = group.querySelector(".group-header");
  if (!header) return;
  header.addEventListener("click", () => {
    group.classList.toggle("collapsed");
    settings[`group_${key}`] = group.classList.contains("collapsed");
    saveSettings(settings);
  });
});

// =====================
// App state + undo/redo
// =====================
let data = loadData();

const UNDO_LIMIT = 30;
let undoStack = [];
let redoStack = [];

function pushUndoState() {
  undoStack.push(cloneData(data));
  if (undoStack.length > UNDO_LIMIT) undoStack.shift();
  redoStack = [];
}

function undo() {
  if (undoStack.length === 0) return;
  const prev = undoStack.pop();
  redoStack.push(cloneData(data));
  data = prev;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderCategories();
  renderDashboard();
  renderTagFilters();
  showToast("Undo");
}

function redo() {
  if (redoStack.length === 0) return;
  const next = redoStack.pop();
  undoStack.push(cloneData(data));
  data = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderCategories();
  renderDashboard();
  renderTagFilters();
  showToast("Redo");
}

pushUndoState();

// =====================
// Dashboard rendering + favourites
// =====================
const favSection = document.getElementById("favSection");
const favGrid = document.getElementById("favGrid");
const linkGrid = document.getElementById("linkGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const tagFilterRow = document.getElementById("tagFilterRow");
const tagFilterChips = document.getElementById("tagFilterChips");
let activeTagFilter = null;

function allLinks() {
  const out = [];
  for (const cat of data.categories) {
    for (const link of cat.links) {
      out.push({
        catId: cat.id,
        catName: cat.name,
        catIcon: cat.icon,
        catColor: cat.color,
        link,
      });
    }
  }
  return out;
}

function findLinkById(linkId) {
  for (const cat of data.categories) {
    const idx = cat.links.findIndex((l) => l.id === linkId);
    if (idx !== -1) return { cat, idx, link: cat.links[idx] };
  }
  return null;
}

function toggleFavouriteById(linkId) {
  const found = findLinkById(linkId);
  if (!found) return;
  found.link.favourite = !found.link.favourite;
  saveData();
  renderCategories();
  renderDashboard();
  renderTagFilters();
}

function collectAllTags() {
  const tags = new Set();
  for (const cat of data.categories) {
    for (const link of cat.links) {
      if (Array.isArray(link.tags)) {
        for (const t of link.tags) {
          const trimmed = String(t || "").trim();
          if (trimmed) tags.add(trimmed);
        }
      }
    }
  }
  return Array.from(tags).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}

function renderTagFilters() {
  if (!tagFilterChips || !tagFilterRow) return;
  const tags = collectAllTags();
  if (tags.length === 0) {
    tagFilterRow.classList.add("hidden");
    return;
  }
  tagFilterRow.classList.remove("hidden");
  tagFilterChips.innerHTML = tags
    .map(
      (t) => `
      <button
        type="button"
        class="tag-chip ${activeTagFilter === t ? "active" : ""}"
        data-tag="${escapeHtml(t)}"
      >${escapeHtml(t)}</button>
    `
    )
    .join("");
}

tagFilterChips?.addEventListener("click", (e) => {
  const chip = e.target.closest(".tag-chip");
  if (!chip) return;
  const tag = chip.getAttribute("data-tag");
  activeTagFilter = activeTagFilter === tag ? null : tag;
  renderTagFilters();
  renderDashboard();
});

function renderCard(item) {
  const l = item.link;
  const starClass = l.favourite ? "star-btn on" : "star-btn";
  const iconSrc = faviconUrl(l.url);
  const clicks = l.clicks || 0;
  const note = l.note || "";

  return `
    <a class="card" href="${escapeHtml(l.url)}" target="_blank" rel="noreferrer">
      <button
        class="${starClass}"
        type="button"
        data-action="toggleFav"
        data-linkid="${escapeHtml(l.id)}"
        aria-label="Toggle favourite"
      >⭐</button>
      <div class="card-icon">
        ${
          iconSrc
            ? `<img src="${escapeHtml(iconSrc)}" alt="" loading="lazy" />`
            : escapeHtml(item.catIcon || "🔗")
        }
      </div>
      <div class="card-title">${escapeHtml(l.name)}</div>
      <div class="card-meta">
        ${escapeHtml(item.catName)} · ${clicks} click${clicks === 1 ? "" : "s"}
        ${note ? ` · ${escapeHtml(note)}` : ""}
      </div>
    </a>
  `;
}

function sortItems(items) {
  const mode = sortSelect?.value || "name";
  if (mode === "name") {
    return items.sort((a, b) =>
      a.link.name.toLowerCase().localeCompare(b.link.name.toLowerCase())
    );
  }
  if (mode === "clicks") {
    return items.sort(
      (a, b) => (b.link.clicks || 0) - (a.link.clicks || 0)
    );
  }
  if (mode === "recent") {
    return items.sort(
      (a, b) => (b.link.lastOpened || 0) - (a.link.lastOpened || 0)
    );
  }
  return items;
}

function renderDashboard() {
  if (!favGrid || !linkGrid) return;
  const q = (searchInput?.value || "").trim().toLowerCase();

  const items = allLinks().filter((item) => {
    const text = `${item.link.name} ${item.catName} ${(item.link.note || "")} ${(item.link.tags || []).join(" ")}`.toLowerCase();
    const matchesSearch = text.includes(q);
    const matchesTag =
      !activeTagFilter ||
      (Array.isArray(item.link.tags) &&
        item.link.tags.includes(activeTagFilter));
    return matchesSearch && matchesTag;
  });

  const favs = sortItems(items.filter((i) => i.link.favourite));
  const rest = sortItems(items.filter((i) => !i.link.favourite));

  if (favs.length > 0) {
    favSection?.classList.remove("hidden");
    favGrid.innerHTML = favs.map(renderCard).join("");
  } else {
    favSection?.classList.add("hidden");
    favGrid.innerHTML = "";
  }

  linkGrid.innerHTML = rest.map(renderCard).join("");
}

function debounce(fn, delay = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

searchInput?.addEventListener("input", debounce(renderDashboard, 150));
sortSelect?.addEventListener("change", renderDashboard);

document
  .getElementById("page-dashboard")
  ?.addEventListener("click", (e) => {
    const btn = e.target.closest('button[data-action="toggleFav"]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    toggleFavouriteById(btn.getAttribute("data-linkid"));
  });

// =====================
// Downloads page render
// =====================
const downloadsLaunchersGrid = document.getElementById(
  "downloadsLaunchersGrid"
);
const downloadsVpnsGrid = document.getElementById("downloadsVpnsGrid");

function renderDownloadCard(item) {
  const iconSrc = faviconUrl(item.url);
  return `
    <a class="card" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">
      <div class="card-icon">
        ${
          iconSrc
            ? `<img src="${escapeHtml(iconSrc)}" alt="" loading="lazy" />`
            : escapeHtml(item.icon || "⬇️")
        }
      </div>
      <div class="card-title">${escapeHtml(item.name)}</div>
      <div class="card-meta">${escapeHtml(item.meta || shortUrl(item.url))}</div>
    </a>
  `;
}

function renderDownloads() {
  if (downloadsLaunchersGrid) {
    downloadsLaunchersGrid.innerHTML = DOWNLOADS.launchers
      .map(renderDownloadCard)
      .join("");
  }
  if (downloadsVpnsGrid) {
    downloadsVpnsGrid.innerHTML = DOWNLOADS.vpns
      .map(renderDownloadCard)
      .join("");
  }
}

// =====================
// Categories (accordion + CRUD + drag reorder)
// =====================
const categoriesWrap = document.getElementById("categoriesWrap");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const expandAllBtn = document.getElementById("expandAllBtn");
const collapseAllBtn = document.getElementById("collapseAllBtn");
const quickName = document.getElementById("quickName");
const quickUrl = document.getElementById("quickUrl");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");

function findCategoryById(catId) {
  return data.categories.find((c) => c.id === catId);
}

function renderCategories() {
  if (!categoriesWrap) return;
  categoriesWrap.innerHTML = "";

  for (const cat of data.categories) {
    const item = document.createElement("div");
    item.className = "acc-item";
    item.setAttribute("data-catid", cat.id);

    const color = cat.color || "#4f46e5";

    item.innerHTML = `
      <div class="acc-header" style="border-left-color:${escapeHtml(color)};">
        <div class="acc-title">
          <span class="cat-emoji">${escapeHtml(cat.icon || "📁")}</span>
          <span>${escapeHtml(cat.name)}</span>
        </div>
        <div class="acc-actions">
          <button type="button" data-action="addLink" data-catid="${escapeHtml(
            cat.id
          )}">+ Link</button>
          <button type="button" data-action="setIcon" data-catid="${escapeHtml(
            cat.id
          )}">Icon</button>
          <button type="button" data-action="setColor" data-catid="${escapeHtml(
            cat.id
          )}">Color</button>
          <button type="button" data-action="renameCat" data-catid="${escapeHtml(
            cat.id
          )}">Rename</button>
          <button type="button" data-action="deleteCat" data-catid="${escapeHtml(
            cat.id
          )}">Delete</button>
          <span class="acc-arrow" aria-hidden="true">▾</span>
        </div>
      </div>

      <div class="acc-body">
        <div class="link-list">
          ${cat.links
            .map(
              (l) => `
            <div class="link-item" draggable="true" data-catid="${escapeHtml(
              cat.id
            )}" data-linkid="${escapeHtml(l.id)}">
              <div class="link-left">
                <div class="drag" title="Drag to reorder" aria-hidden="true">⠿</div>
                <div class="link-text">
                  <div class="link-name">${escapeHtml(l.name)}</div>
                  <div class="link-url">
                    ${escapeHtml(shortUrl(l.url))}
                    ${
                      l.tags && l.tags.length
                        ? ` · <span class="tiny">${escapeHtml(
                            l.tags.join(", ")
                          )}</span>`
                        : ""
                    }
                  </div>
                  ${
                    l.note
                      ? `<div class="tiny" style="margin-top:2px;">${escapeHtml(
                          l.note
                        )}</div>`
                      : ""
                  }
                </div>
              </div>

              <div class="link-actions">
                <button type="button" data-action="openLink" data-linkid="${escapeHtml(
                  l.id
                )}" aria-label="Open link">🔗</button>
                <button type="button" data-action="toggleFav" data-linkid="${escapeHtml(
                  l.id
                )}" aria-label="Toggle favourite">${
                l.favourite ? "⭐" : "☆"
              }</button>
                <button type="button" data-action="editLink" data-linkid="${escapeHtml(
                  l.id
                )}" aria-label="Edit link">✏️</button>
                <button type="button" data-action="deleteLink" data-linkid="${escapeHtml(
                  l.id
                )}" aria-label="Delete link">🗑️</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        ${
          cat.links.length === 0
            ? `<div class="tiny" style="padding-top:10px;">No links yet. Click + Link.</div>`
            : ``
        }
      </div>
    `;

    categoriesWrap.appendChild(item);
  }
}

// Accordion open/close
categoriesWrap?.addEventListener("click", (e) => {
  const actionBtn = e.target.closest("button[data-action]");
  if (actionBtn) return;

  const header = e.target.closest(".acc-header");
  if (!header) return;

  const item = header.closest(".acc-item");
  item.classList.toggle("open");
});

// Category + link actions
categoriesWrap?.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");

  if (action === "addLink") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const res = await openModal({
      title: "Add link",
      body: "Enter a name and URL.",
      inputs: [
        {
          label: "Name",
          placeholder: "e.g. My site",
          value: quickName?.value || "",
        },
        {
          label: "URL",
          placeholder: "https://...",
          value: quickUrl?.value || "",
        },
      ],
    });
    if (!res.ok) return;
    const [nameRaw, urlRaw] = res.values;
    const name = (nameRaw || "").trim();
    const url = normalizeUrl(urlRaw || "");
    if (!name || !url) return;

    cat.links.push({
      id: makeId(),
      name,
      url,
      favourite: false,
      tags: [],
      note: "",
    });
    if (quickName) quickName.value = "";
    if (quickUrl) quickUrl.value = "";
    saveData();
    renderCategories();
    renderDashboard();
    renderTagFilters();
    showToast("Link added");
    return;
  }

  if (action === "setIcon") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const res = await openModal({
      title: "Category icon",
      body: "Set an emoji icon for this category.",
      inputs: [
        {
          label: "Icon",
          placeholder: "e.g. 💼",
          value: cat.icon || "📁",
        },
      ],
    });
    if (!res.ok) return;
    const [iconRaw] = res.values;
    if (!iconRaw) return;
    cat.icon = iconRaw.trim().slice(0, 4);
    saveData();
    renderCategories();
    renderDashboard();
    showToast("Icon updated");
    return;
  }

  if (action === "setColor") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const res = await openModal({
      title: "Category color",
      body: "Set a hex color (e.g. #22c55e).",
      inputs: [
        {
          label: "Color",
          value: cat.color || "#4f46e5",
        },
      ],
    });
    if (!res.ok) return;
    const [colorRaw] = res.values;
    const color = (colorRaw || "").trim();
    if (!color) return;
    cat.color = color;
    saveData();
    renderCategories();
    renderDashboard();
    showToast("Color updated");
    return;
  }

  if (action === "renameCat") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const res = await openModal({
      title: "Rename category",
      body: "Enter a new name for this category.",
      inputs: [
        {
          label: "Name",
          value: cat.name,
        },
      ],
    });
    if (!res.ok) return;
    const [nextRaw] = res.values;
    const trimmed = (nextRaw || "").trim();
    if (!trimmed || trimmed.toLowerCase() === cat.name.toLowerCase()) return;

    const exists = data.categories.some(
      (c) =>
        c.id !== cat.id &&
        c.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      await openModal({
        title: "Name in use",
        body: "That category already exists.",
        inputs: [],
        okText: "OK",
        cancelText: "Close",
      });
      return;
    }

    cat.name = trimmed;
    saveData();
    renderCategories();
    renderDashboard();
    renderTagFilters();
    showToast("Category renamed");
    return;
  }

  if (action === "deleteCat") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const res = await openModal({
      title: "Delete category",
      body: `Delete category "${cat.name}" and all its links?`,
      inputs: [],
      okText: "Delete",
      cancelText: "Cancel",
    });
    if (!res.ok) return;

    data.categories = data.categories.filter((c) => c.id !== catId);
    saveData();
    renderCategories();
    renderDashboard();
    renderTagFilters();
    showToast("Category deleted");
    return;
  }

  const linkId = btn.getAttribute("data-linkid");
  if (!linkId) return;

  if (action === "openLink") {
    const found = findLinkById(linkId);
    if (!found) return;

    found.link.clicks = (found.link.clicks || 0) + 1;
    found.link.lastOpened = Date.now();
    saveData();
    renderDashboard();
    renderTagFilters();

    window.open(found.link.url, "_blank", "noreferrer");
    return;
  }

  if (action === "toggleFav") {
    toggleFavouriteById(linkId);
    showToast("Favourite updated");
    return;
  }

  if (action === "editLink") {
    const found = findLinkById(linkId);
    if (!found) return;

    const existingTags = Array.isArray(found.link.tags)
      ? found.link.tags.join(", ")
      : "";
    const res = await openModal({
      title: "Edit link",
      body: "Update the name, URL, tags, and note.",
      inputs: [
        {
          label: "Name",
          value: found.link.name,
        },
        {
          label: "URL",
          value: found.link.url,
        },
        {
          label: "Tags (comma separated)",
          value: existingTags,
        },
        {
          label: "Note",
          value: found.link.note || "",
        },
      ],
    });
    if (!res.ok) return;
    const [nameRaw, urlRaw, tagsRaw, noteRaw] = res.values;
    const name = (nameRaw || "").trim();
    const url = normalizeUrl(urlRaw || "");
    if (!name || !url) return;

    const tags = String(tagsRaw || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    found.link.name = name;
    found.link.url = url;
    found.link.tags = tags;
    found.link.note = noteRaw || "";
    saveData();
    renderCategories();
    renderDashboard();
    renderTagFilters();
    showToast("Link updated");
    return;
  }

  if (action === "deleteLink") {
    const found = findLinkById(linkId);
    if (!found) return;

    const res = await openModal({
      title: "Delete link",
      body: `Delete "${found.link.name}"?`,
      inputs: [],
      okText: "Delete",
      cancelText: "Cancel",
    });
    if (!res.ok) return;

    found.cat.links.splice(found.idx, 1);
    saveData();
    renderCategories();
    renderDashboard();
    renderTagFilters();
    showToast("Link deleted");
    return;
  }
});

expandAllBtn?.addEventListener("click", () => {
  document
    .querySelectorAll(".acc-item")
    .forEach((i) => i.classList.add("open"));
});
collapseAllBtn?.addEventListener("click", () => {
  document
    .querySelectorAll(".acc-item")
    .forEach((i) => i.classList.remove("open"));
});

addCategoryBtn?.addEventListener("click", async () => {
  const res = await openModal({
    title: "New category",
    body: "Enter a name and optional icon.",
    inputs: [
      { label: "Name", placeholder: "e.g. Work", value: "" },
      { label: "Icon (emoji)", placeholder: "e.g. 💼", value: "📁" },
    ],
  });

  if (!res.ok) return;
  const [nameRaw, iconRaw] = res.values;
  const name = (nameRaw || "").trim();
  if (!name) return;

  const exists = data.categories.some(
    (c) => c.name.trim().toLowerCase() === name.toLowerCase()
  );
  if (exists) {
    await openModal({
      title: "Name in use",
      body: "That category already exists.",
      inputs: [],
      okText: "OK",
      cancelText: "Close",
    });
    return;
  }

  const icon = (iconRaw || "📁").trim().slice(0, 4);

  data.categories.push({
    id: makeId(),
    name,
    icon,
    color: "#4f46e5",
    links: [],
  });
  saveData();
  renderCategories();
  renderDashboard();
  renderTagFilters();
  showToast("Category added");
});

// Drag & drop reorder (within same category)
let dragState = null;

categoriesWrap?.addEventListener("dragstart", (e) => {
  const item = e.target.closest(".link-item");
  if (!item) return;

  dragState = {
    catId: item.getAttribute("data-catid"),
    linkId: item.getAttribute("data-linkid"),
  };
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", dragState.linkId);
});

categoriesWrap?.addEventListener("dragover", (e) => {
  const target = e.target.closest(".link-item");
  if (!target) return;
  e.preventDefault();
  target.classList.add("drag-over");
  e.dataTransfer.dropEffect = "move";
});

categoriesWrap?.addEventListener("dragleave", (e) => {
  const target = e.target.closest(".link-item");
  if (!target) return;
  target.classList.remove("drag-over");
});

categoriesWrap?.addEventListener("drop", (e) => {
  const target = e.target.closest(".link-item");
  if (!target) return;

  e.preventDefault();
  target.classList.remove("drag-over");
  if (!dragState) return;

  const targetCatId = target.getAttribute("data-catid");
  const targetLinkId = target.getAttribute("data-linkid");

  if (dragState.catId !== targetCatId) {
    dragState = null;
    return;
  }

  const cat = findCategoryById(targetCatId);
  if (!cat) {
    dragState = null;
    return;
  }

  const fromIndex = cat.links.findIndex(
    (l) => l.id === dragState.linkId
  );
  const toIndex = cat.links.findIndex(
    (l) => l.id === targetLinkId
  );

  if (
    fromIndex === -1 ||
    toIndex === -1 ||
    fromIndex === toIndex
  ) {
    dragState = null;
    return;
  }

  const [moved] = cat.links.splice(fromIndex, 1);
  cat.links.splice(toIndex, 0, moved);

  dragState = null;
  saveData();
  renderCategories();
  renderDashboard();
  renderTagFilters();
  showToast("Order updated");
});

// =====================
// Settings: Export / Import / Reset
// =====================
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const resetDataBtn = document.getElementById("resetDataBtn");

exportBtn?.addEventListener("click", () => {
  const payload = JSON.stringify(data, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "dashboard-data.json";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
  showToast("Exported JSON");
});

importBtn?.addEventListener("click", () => importFile?.click());

importFile?.addEventListener("change", () => {
  const file = importFile.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!parsed || parsed.version !== 2 || !Array.isArray(parsed.categories)) {
        await openModal({
          title: "Import failed",
          body: "Invalid JSON format.",
          inputs: [],
          okText: "OK",
          cancelText: "Close",
        });
        return;
      }
      fixV2(parsed);
      data = mergeDefaults(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      pushUndoState();
      renderCategories();
      renderDashboard();
      renderTagFilters();
      await openModal({
        title: "Import complete",
        body: "Imported successfully.",
        inputs: [],
        okText: "OK",
        cancelText: "Close",
      });
      showToast("Imported JSON");
    } catch {
      await openModal({
        title: "Import failed",
        body: "Could not read JSON.",
        inputs: [],
        okText: "OK",
        cancelText: "Close",
      });
    }
  };
  reader.readAsText(file);
  importFile.value = "";
});

resetDataBtn?.addEventListener("click", async () => {
  const res = await openModal({
    title: "Reset data",
    body: "Reset saved categories + links back to defaults?",
    inputs: [],
    okText: "Reset",
    cancelText: "Cancel",
  });
  if (!res.ok) return;

  localStorage.removeItem(STORAGE_KEY);
  data = loadData();
  pushUndoState();
  renderCategories();
  renderDashboard();
  renderTagFilters();
  showToast("Data reset");
});

// =====================
// Settings: Password controls
// =====================
const setPasswordBtn = document.getElementById("setPasswordBtn");
const removePasswordBtn = document.getElementById("removePasswordBtn");
const lockNowBtn = document.getElementById("lockNowBtn");

setPasswordBtn?.addEventListener("click", async () => {
  const res1 = await openModal({
    title: "Set password",
    body: "Set a password (remember it).",
    inputs: [{ label: "Password", type: "password" }],
  });
  if (!res1.ok) return;
  const [p1] = res1.values;
  if (!p1) return;

  const res2 = await openModal({
    title: "Confirm password",
    body: "Re-enter your password.",
    inputs: [{ label: "Password", type: "password" }],
  });
  if (!res2.ok) return;
  const [p2] = res2.values;
  if (!p2) return;

  if (p1 !== p2) {
    await openModal({
      title: "Mismatch",
      body: "Passwords do not match.",
      inputs: [],
      okText: "OK",
      cancelText: "Close",
    });
    return;
  }

  const hash = await sha256(p1);
  localStorage.setItem(PASS_HASH_KEY, hash);
  setUnlockedThisSession(true);
  await openModal({
    title: "Password set",
    body: "Password has been set.",
    inputs: [],
    okText: "OK",
    cancelText: "Close",
  });
  showToast("Password set");
});

removePasswordBtn?.addEventListener("click", async () => {
  const res = await openModal({
    title: "Remove password",
    body: "Remove password lock?",
    inputs: [],
    okText: "Remove",
    cancelText: "Cancel",
  });
  if (!res.ok) return;

  localStorage.removeItem(PASS_HASH_KEY);
  setUnlockedThisSession(true);
  hideLock();
  await openModal({
    title: "Password removed",
    body: "Password lock has been removed.",
    inputs: [],
    okText: "OK",
    cancelText: "Close",
  });
  showToast("Password removed");
});

lockNowBtn?.addEventListener("click", async () => {
  if (!hasPassword()) {
    await openModal({
      title: "No password set",
      body: "Set a password first.",
      inputs: [],
      okText: "OK",
      cancelText: "Close",
    });
    return;
  }
  setUnlockedThisSession(false);
  showLock();
});

// =====================
// Undo/redo buttons
// =====================
undoBtn?.addEventListener("click", () => undo());
redoBtn?.addEventListener("click", () => redo());

// =====================
// Command palette
// =====================
async function openCommandPalette() {
  const res = await openModal({
    title: "Command palette",
    body: "Type a command or page name.",
    inputs: [
      {
        label: "Command",
        placeholder: "e.g. dashboard, categories, lock, export, add category",
        value: "",
      },
    ],
    okText: "Run",
    cancelText: "Cancel",
  });
  if (!res.ok) return;
  const [cmdRaw] = res.values;
  const cmd = (cmdRaw || "").trim().toLowerCase();
  if (!cmd) return;

  if (["dash", "dashboard", "home"].includes(cmd)) {
    showPage("dashboard");
    return;
  }
  if (["cat", "cats", "categories"].includes(cmd)) {
    showPage("categories");
    return;
  }
  if (["down", "downloads"].includes(cmd)) {
    showPage("downloads");
    return;
  }
  if (["settings", "prefs", "options"].includes(cmd)) {
    showPage("settings");
    return;
  }
  if (["lock"].includes(cmd)) {
    if (hasPassword()) {
      setUnlockedThisSession(false);
      showLock();
    }
    return;
  }
  if (["export"].includes(cmd)) {
    exportBtn?.click();
    return;
  }
  if (["add category", "new category"].includes(cmd)) {
    addCategoryBtn?.click();
    return;
  }
  if (["undo"].includes(cmd)) {
    undo();
    return;
  }
  if (["redo"].includes(cmd)) {
    redo();
    return;
  }

  showToast("Unknown command");
}

// =====================
// Keyboard shortcuts
// =====================
document.addEventListener("keydown", (e) => {
  // Ctrl+K or Cmd+K -> focus search
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchInput?.focus();
    return;
  }

  // Ctrl+P -> command palette
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
    e.preventDefault();
    openCommandPalette();
    return;
  }

  // Ctrl+L -> lock (if password set)
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
    e.preventDefault();
    if (hasPassword()) {
      setUnlockedThisSession(false);
      showLock();
    }
    return;
  }

  // Ctrl+Z -> undo
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undo();
    return;
  }

  // Ctrl+Y -> redo
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
    e.preventDefault();
    redo();
    return;
  }

  // "g" then "d" / "c" -> go to dashboard/categories
  if (e.key.toLowerCase() === "g") {
    const handler = (ev) => {
      if (ev.key.toLowerCase() === "d") {
        showPage("dashboard");
      } else if (ev.key.toLowerCase() === "c") {
        showPage("categories");
      }
      document.removeEventListener("keydown", handler);
    };
    document.addEventListener("keydown", handler, { once: true });
  }
});

// =====================
// Init
// =====================
showPage("dashboard");
renderCategories();
renderDashboard();
renderDownloads();
renderTagFilters();

if (hasPassword() && !isUnlockedThisSession()) showLock();
else hideLock();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
// ======================================================
// EXTRA FEATURES PACK (10 FEATURES)
// Paste below everything else in app.js
// ======================================================

// Small helper: safe get element
function $(sel) {
  return document.querySelector(sel);
}

// ------------------------------------------------------
// FEATURE 1: CLICK TRACKING + ANALYTICS (MODAL)
// ------------------------------------------------------

// Wrap link opening so we can track clicks + lastOpened
(function setupClickTracking() {
  const dashboardPage = document.getElementById("page-dashboard");
  if (!dashboardPage) return;

  dashboardPage.addEventListener("click", (e) => {
    const card = e.target.closest("a.card");
    if (!card) return;
    const href = card.getAttribute("href");
    if (!href) return;

    // Find link by URL
    const nu = normalizeUrl(href);
    let found = null;
    for (const cat of data.categories) {
      for (const link of cat.links) {
        if (normalizeUrl(link.url) === nu) {
          found = link;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      found.clicks = (found.clicks || 0) + 1;
      found.lastOpened = Date.now();
      saveData();
      renderDashboard();
    }

    // Let the link open normally
  });
})();

// Create Analytics button in topbar
(function setupAnalyticsButton() {
  const tools = document.getElementById("dashboardTools");
  if (!tools) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";
  btn.textContent = "📊 Analytics";
  btn.title = "View link analytics";
  tools.appendChild(btn);

  btn.addEventListener("click", openAnalyticsModal);

  function openAnalyticsModal() {
    const items = allLinks();
    const sortedByClicks = [...items].sort(
      (a, b) => (b.link.clicks || 0) - (a.link.clicks || 0)
    );
    const top = sortedByClicks.slice(0, 10);

    const bodyLines = top.map((item, i) => {
      const c = item.link.clicks || 0;
      const last = item.link.lastOpened
        ? new Date(item.link.lastOpened).toLocaleString()
        : "never";
      return `${i + 1}. ${item.link.name} (${item.catName}) – ${c} click${
        c === 1 ? "" : "s"
      }, last: ${last}`;
    });

    openModal({
      title: "📊 Analytics",
      body:
        top.length === 0
          ? "No clicks tracked yet. Open some links first."
          : bodyLines.join("\n"),
      inputs: [],
      okText: "Close",
      cancelText: "Close",
    });
  }
})();

// ------------------------------------------------------
// FEATURE 2: QUICK-LAUNCH BAR (TOP 5 MOST USED)
// ------------------------------------------------------
(function setupQuickLaunchBar() {
  const dash = document.getElementById("page-dashboard");
  if (!dash) return;

  const bar = document.createElement("div");
  bar.className = "quick-launch";
  bar.innerHTML = `
    <div class="quick-launch-title tiny">Quick launch (top 5)</div>
    <div class="quick-launch-row" id="quickLaunchRow"></div>
  `;
  dash.insertBefore(bar, dash.firstChild);

  function renderQuickLaunch() {
    const row = document.getElementById("quickLaunchRow");
    if (!row) return;
    const items = allLinks()
      .filter((i) => (i.link.clicks || 0) > 0)
      .sort((a, b) => (b.link.clicks || 0) - (a.link.clicks || 0))
      .slice(0, 5);

    if (items.length === 0) {
      row.innerHTML = `<span class="tiny">No usage yet. Open some links and they’ll appear here.</span>`;
      return;
    }

    row.innerHTML = items
      .map((item) => {
        const iconSrc = faviconUrl(item.link.url);
        return `
          <a
            href="${escapeHtml(item.link.url)}"
            class="quick-launch-item"
            target="_blank"
            rel="noreferrer"
          >
            ${
              iconSrc
                ? `<img src="${escapeHtml(iconSrc)}" alt="" loading="lazy" />`
                : `<span class="quick-launch-emoji">${escapeHtml(
                    item.catIcon || "🔗"
                  )}</span>`
            }
            <span class="quick-launch-name">${escapeHtml(item.link.name)}</span>
          </a>
        `;
      })
      .join("");
  }

  // Re-render when dashboard renders
  const _origRenderDashboard = renderDashboard;
  renderDashboard = function () {
    _origRenderDashboard();
    renderQuickLaunch();
  };

  renderQuickLaunch();
})();

// ------------------------------------------------------
// FEATURE 3: KEYBOARD SHORTCUTS (Ctrl+K, Ctrl+P, G+D, G+C, Ctrl+L, Ctrl+Z/Y)
// ------------------------------------------------------
(function setupKeyboardShortcuts() {
  let lastGTime = 0;

  document.addEventListener("keydown", (e) => {
    const isInput =
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable;

    // Ctrl+K – focus search
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const inp = document.getElementById("searchInput");
      if (inp) inp.focus();
      return;
    }

    // Ctrl+P – command palette
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      openCommandPalette();
      return;
    }

    // Ctrl+L – lock (if password set)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "l") {
      if (hasPassword()) {
        e.preventDefault();
        showLock();
      }
      return;
    }

    // Ctrl+Z / Ctrl+Y – undo/redo (categories)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
      return;
    }
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "y") {
      e.preventDefault();
      redo();
      return;
    }

    if (isInput) return;

    // G then D / C – go to Dashboard / Categories
    const now = Date.now();
    if (e.key.toLowerCase() === "g") {
      lastGTime = now;
      return;
    }
    if (now - lastGTime < 800) {
      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        showPage("dashboard");
        lastGTime = 0;
        return;
      }
      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        showPage("categories");
        lastGTime = 0;
        return;
      }
    }
  });
})();

// ------------------------------------------------------
// FEATURE 4: COMMAND PALETTE (uses appModal)
// ------------------------------------------------------
function openCommandPalette() {
  const commands = [
    { id: "goto_dashboard", label: "Go to Dashboard" },
    { id: "goto_categories", label: "Go to Categories" },
    { id: "goto_downloads", label: "Go to Downloads" },
    { id: "goto_settings", label: "Go to Settings" },
    { id: "lock", label: "Lock screen" },
    { id: "export", label: "Export JSON" },
    { id: "import", label: "Import JSON" },
    { id: "toggle_theme", label: "Toggle dark/light theme" },
  ];

  openModal({
    title: "⌕ Command palette",
    body:
      "Type a command (e.g. 'dash', 'cat', 'lock', 'export'). Matching is fuzzy.",
    inputs: [
      {
        label: "Command",
        type: "text",
        value: "",
        placeholder: "dashboard, categories, lock, export, settings...",
      },
    ],
    okText: "Run",
    cancelText: "Cancel",
  }).then((res) => {
    if (!res.ok) return;
    const q = (res.values[0] || "").toLowerCase().trim();
    if (!q) return;

    const match = commands.find((c) =>
      c.label.toLowerCase().includes(q)
    );

    if (!match) {
      showToast("No matching command");
      return;
    }

    switch (match.id) {
      case "goto_dashboard":
        showPage("dashboard");
        break;
      case "goto_categories":
        showPage("categories");
        break;
      case "goto_downloads":
        showPage("downloads");
        break;
      case "goto_settings":
        showPage("settings");
        break;
      case "lock":
        if (hasPassword()) showLock();
        else showToast("No password set");
        break;
      case "export":
        document.getElementById("exportBtn")?.click();
        break;
      case "import":
        document.getElementById("importBtn")?.click();
        break;
      case "toggle_theme":
        document.getElementById("themeToggle")?.click();
        break;
    }
  });
}

// ------------------------------------------------------
// FEATURE 5: AUTO-TAGGING FOR LINKS (based on URL)
// ------------------------------------------------------
(function setupAutoTagging() {
  function autoTagLink(link) {
    const url = String(link.url || "").toLowerCase();
    const tags = new Set(link.tags || []);

    if (url.includes("youtube") || url.includes("twitch")) tags.add("video");
    if (url.includes("spotify") || url.includes("soundcloud")) tags.add("music");
    if (url.includes("discord")) tags.add("chat");
    if (url.includes("github")) tags.add("dev");
    if (url.includes("docs") || url.includes("developer.mozilla")) tags.add("docs");
    if (url.includes("game") || url.includes("steam") || url.includes("epicgames"))
      tags.add("games");
    if (url.includes("mail") || url.includes("gmail") || url.includes("outlook"))
      tags.add("email");

    link.tags = Array.from(tags);
  }

  function autoTagAll() {
    for (const cat of data.categories) {
      for (const link of cat.links) {
        autoTagLink(link);
      }
    }
  }

  // Run once on load
  autoTagAll();

  // Wrap saveData so auto-tagging runs before saving
  const _origSaveData = saveData;
  saveData = function () {
    autoTagAll();
    _origSaveData();
  };
})();

// ------------------------------------------------------
// FEATURE 6: NOTES EDITOR (right-click card to edit note)
// ------------------------------------------------------
(function setupNotesEditor() {
  const dash = document.getElementById("page-dashboard");
  if (!dash) return;

  dash.addEventListener("contextmenu", (e) => {
    const card = e.target.closest("a.card");
    if (!card) return;
    e.preventDefault();

    const href = card.getAttribute("href");
    if (!href) return;
    const nu = normalizeUrl(href);

    let found = null;
    for (const cat of data.categories) {
      for (const link of cat.links) {
        if (normalizeUrl(link.url) === nu) {
          found = link;
          break;
        }
      }
      if (found) break;
    }
    if (!found) return;

    openModal({
      title: `📝 Note for "${found.name}"`,
      body: "Add a short note. It will show under the card meta.",
      inputs: [
        {
          label: "Note",
          type: "text",
          value: found.note || "",
          placeholder: "e.g. school login, work, favourite playlist...",
        },
      ],
      okText: "Save",
      cancelText: "Cancel",
    }).then((res) => {
      if (!res.ok) return;
      found.note = res.values[0] || "";
      saveData();
      renderDashboard();
    });
  });
})();

// ------------------------------------------------------
// FEATURE 7: DAILY WALLPAPER MODE + CUSTOM BACKGROUND UPLOAD
// ------------------------------------------------------
(function setupBackgrounds() {
  const bgEl = document.querySelector(".bg");
  if (!bgEl) return;

  function applyDailyGradient() {
    const day = new Date().getDate();
    const gradients = [
      "radial-gradient(circle at 0% 0%, #4f46e5 0, transparent 60%), radial-gradient(circle at 100% 0%, #06b6d4 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
      "radial-gradient(circle at 0% 0%, #ec4899 0, transparent 60%), radial-gradient(circle at 100% 0%, #22c55e 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
      "radial-gradient(circle at 0% 0%, #f97316 0, transparent 60%), radial-gradient(circle at 100% 0%, #3b82f6 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
      "radial-gradient(circle at 0% 0%, #a855f7 0, transparent 60%), radial-gradient(circle at 100% 0%, #22d3ee 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
    ];
    const g = gradients[day % gradients.length];
    bgEl.style.backgroundImage = g;
  }

  function applyCustomBackground() {
    if (!settings.bgImage) return;
    bgEl.style.backgroundImage = `url(${settings.bgImage})`;
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.opacity = settings.bgOpacity ?? 0.9;
    bgEl.style.filter = `blur(${settings.bgBlur || 0}px)`;
  }

  // Decide which to use
  if (settings.bgImage) {
    applyCustomBackground();
  } else {
    applyDailyGradient();
  }

  // Add controls into Settings page
  const settingsPage = document.getElementById("page-settings");
  if (!settingsPage) return;

  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="panel-title">Background</div>
    <div class="panel-text">
      Daily gradient wallpaper, or upload your own background image.
    </div>
    <div class="row">
      <button type="button" class="btn" id="bgUseDailyBtn">Use daily gradient</button>
      <button type="button" class="btn" id="bgUploadBtn">Upload image</button>
      <input type="file" id="bgFileInput" accept="image/*" class="hidden" />
    </div>
    <div class="row">
      <label class="tiny" for="bgBlurRange">Blur</label>
      <input id="bgBlurRange" type="range" min="0" max="20" value="${
        settings.bgBlur || 0
      }" />
      <label class="tiny" for="bgOpacityRange">Opacity</label>
      <input id="bgOpacityRange" type="range" min="30" max="100" value="${
        (settings.bgOpacity || 0.9) * 100
      }" />
    </div>
  `;
  settingsPage.appendChild(panel);

  const bgUseDailyBtn = document.getElementById("bgUseDailyBtn");
  const bgUploadBtn = document.getElementById("bgUploadBtn");
  const bgFileInput = document.getElementById("bgFileInput");
  const bgBlurRange = document.getElementById("bgBlurRange");
  const bgOpacityRange = document.getElementById("bgOpacityRange");

  bgUseDailyBtn?.addEventListener("click", () => {
    delete settings.bgImage;
    delete settings.bgBlur;
    delete settings.bgOpacity;
    saveSettings(settings);
    applyDailyGradient();
    showToast("Using daily gradient");
  });

  bgUploadBtn?.addEventListener("click", () => {
    bgFileInput?.click();
  });

  bgFileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      settings.bgImage = reader.result;
      saveSettings(settings);
      applyCustomBackground();
      showToast("Background updated");
    };
    reader.readAsDataURL(file);
  });

  bgBlurRange?.addEventListener("input", (e) => {
    const v = Number(e.target.value || 0);
    settings.bgBlur = v;
    saveSettings(settings);
    applyCustomBackground();
  });

  bgOpacityRange?.addEventListener("input", (e) => {
    const v = Number(e.target.value || 90);
    settings.bgOpacity = v / 100;
    saveSettings(settings);
    applyCustomBackground();
  });
})();

// ------------------------------------------------------
// FEATURE 8: SIMPLE "SYNC" VIA CLIPBOARD (COPY/PASTE JSON)
// ------------------------------------------------------
(function setupClipboardSync() {
  const settingsPage = document.getElementById("page-settings");
  if (!settingsPage) return;

  const dataPanel = document.querySelector("#page-settings .panel");
  if (!dataPanel) return;

  const row = dataPanel.querySelector(".row");
  if (!row) return;

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "btn";
  copyBtn.textContent = "Copy JSON to clipboard";

  const pasteBtn = document.createElement("button");
  pasteBtn.type = "button";
  pasteBtn.className = "btn";
  pasteBtn.textContent = "Paste JSON from clipboard";

  row.appendChild(copyBtn);
  row.appendChild(pasteBtn);

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(data, null, 2)
      );
      showToast("Copied JSON to clipboard");
    } catch {
      showToast("Clipboard not available");
    }
  });

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      data = migrateAndFix(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      renderCategories();
      renderDashboard();
      renderTagFilters();
      showToast("Imported from clipboard JSON");
    } catch {
      showToast("Failed to import from clipboard");
    }
  });
})();

// ------------------------------------------------------
// FEATURE 9: EMOJI ICON PICKER FOR CATEGORIES
// ------------------------------------------------------
(function setupEmojiPicker() {
  const categoriesWrap = document.getElementById("categoriesWrap");
  if (!categoriesWrap) return;

  const EMOJIS =
    "📁 🌐 🎮 🧰 💬 📚 🎬 🎧 📝 🧱 🛡️ ⚙️ ⭐ 🔗 💻 🖥️ 📱 🎯 🚀 🧪 🧠 🧮 🧾 🕹️ 🎲 🎵 🎶 🎤 🎧 🎼 🎹 🎻 🎺 🎷 🥁 🎬 📺 📻 📰".split(
      " "
    );

  categoriesWrap.addEventListener("click", (e) => {
    const btn = e.target.closest('button[data-action="setIcon"]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    openEmojiPicker(cat);
  });

  function openEmojiPicker(cat) {
    const body = EMOJIS.map((e, i) =>
      ((i + 1) % 12 === 0 ? e + "\n" : e + " ")
    ).join("");

    openModal({
      title: `Choose icon for "${cat.name}"`,
      body:
        body +
        "\n\nType a single emoji below, or paste one. You can also pick from above.",
      inputs: [
        {
          label: "Emoji",
          type: "text",
          value: cat.icon || "📁",
          placeholder: "e.g. 🎮",
        },
      ],
      okText: "Save",
      cancelText: "Cancel",
    }).then((res) => {
      if (!res.ok) return;
      const val = (res.values[0] || "").trim();
      if (!val) return;
      cat.icon = val[0];
      saveData();
      renderCategories();
      renderDashboard();
    });
  }
})();

// ------------------------------------------------------
// FEATURE 10: SMALL ANALYTICS BADGE ON CARDS (MOST USED)
// ------------------------------------------------------
(function setupCardBadges() {
  const _origRenderCard = renderCard;

  renderCard = function (item) {
    const html = _origRenderCard(item);
    const clicks = item.link.clicks || 0;
    if (clicks === 0) return html;

    // Add a tiny badge in the meta line
    return html.replace(
      '</div>\n    </a>',
      ` · 🔁 ${clicks}x</div>\n    </a>`
    );
  };

  // Re-render once to apply
  renderDashboard();
})();
// ======================================================
// DASHBOARD EXPANSION PACK (Piece 1/3 - Core features)
// Paste this at the VERY BOTTOM of app.js, above Piece 2 & 3
// ======================================================

// Small helper
function $(sel) {
  return document.querySelector(sel);
}

// ======================================================
// 1) CLICK TRACKING (clicks + lastOpened)
// ======================================================
(function setupClickTracking() {
  const dash = document.getElementById("page-dashboard");
  if (!dash) return;

  dash.addEventListener("click", (e) => {
    const card = e.target.closest("a.card");
    if (!card) return;
    const href = card.getAttribute("href");
    if (!href) return;

    const nu = normalizeUrl(href);
    let found = null;

    for (const cat of data.categories) {
      for (const link of cat.links) {
        if (normalizeUrl(link.url) === nu) {
          found = link;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      found.clicks = (found.clicks || 0) + 1;
      found.lastOpened = Date.now();
      saveData();
      renderDashboard();
    }
  });
})();

// ======================================================
// 2) ANALYTICS MODAL + BUTTON IN TOPBAR
// ======================================================
(function setupAnalytics() {
  const tools = document.getElementById("dashboardTools");
  if (!tools) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";
  btn.textContent = "📊 Analytics";
  btn.title = "View link analytics";
  tools.appendChild(btn);

  btn.addEventListener("click", () => {
    const items = allLinks();
    if (items.length === 0) {
      openModal({
        title: "📊 Analytics",
        body: "No links found.",
        inputs: [],
        okText: "Close",
        cancelText: "Close",
      });
      return;
    }

    const sorted = [...items].sort(
      (a, b) => (b.link.clicks || 0) - (a.link.clicks || 0)
    );
    const top = sorted.slice(0, 15);

    const lines = top.map((item, i) => {
      const c = item.link.clicks || 0;
      const last = item.link.lastOpened
        ? new Date(item.link.lastOpened).toLocaleString()
        : "never";
      return `${i + 1}. ${item.link.name} (${item.catName}) – ${c} click${
        c === 1 ? "" : "s"
      }, last: ${last}`;
    });

    openModal({
      title: "📊 Top links",
      body:
        lines.length === 0
          ? "No clicks tracked yet. Open some links first."
          : lines.join("\n"),
      inputs: [],
      okText: "Close",
      cancelText: "Close",
    });
  });
})();

// ======================================================
// 3) QUICK LAUNCH BAR (TOP 5 MOST USED)
// ======================================================
(function setupQuickLaunch() {
  const dash = document.getElementById("page-dashboard");
  if (!dash) return;

  const bar = document.createElement("div");
  bar.className = "quick-launch";
  bar.innerHTML = `
    <div class="quick-launch-title tiny">Quick launch (top 5)</div>
    <div class="quick-launch-row" id="quickLaunchRow"></div>
  `;
  dash.insertBefore(bar, dash.firstChild);

  function renderQuickLaunch() {
    const row = document.getElementById("quickLaunchRow");
    if (!row) return;

    const items = allLinks()
      .filter((i) => (i.link.clicks || 0) > 0)
      .sort((a, b) => (b.link.clicks || 0) - (a.link.clicks || 0))
      .slice(0, 5);

    if (items.length === 0) {
      row.innerHTML =
        '<span class="tiny">No usage yet. Open some links and they’ll appear here.</span>';
      return;
    }

    row.innerHTML = items
      .map((item) => {
        const iconSrc = faviconUrl(item.link.url);
        return `
          <a
            href="${escapeHtml(item.link.url)}"
            class="quick-launch-item"
            target="_blank"
            rel="noreferrer"
          >
            ${
              iconSrc
                ? `<img src="${escapeHtml(iconSrc)}" alt="" loading="lazy" />`
                : `<span class="quick-launch-emoji">${escapeHtml(
                    item.catIcon || "🔗"
                  )}</span>`
            }
            <span class="quick-launch-name">${escapeHtml(item.link.name)}</span>
          </a>
        `;
      })
      .join("");
  }

  const _origRenderDashboard = renderDashboard;
  renderDashboard = function () {
    _origRenderDashboard();
    renderQuickLaunch();
  };

  renderQuickLaunch();
})();

// ======================================================
// 4) KEYBOARD SHORTCUTS + COMMAND PALETTE
// ======================================================
function openCommandPalette() {
  const commands = [
    { id: "goto_dashboard", label: "Go to Dashboard" },
    { id: "goto_categories", label: "Go to Categories" },
    { id: "goto_downloads", label: "Go to Downloads" },
    { id: "goto_settings", label: "Go to Settings" },
    { id: "lock", label: "Lock screen" },
    { id: "export", label: "Export JSON" },
    { id: "import", label: "Import JSON" },
    { id: "toggle_theme", label: "Toggle dark/light theme" },
  ];

  openModal({
    title: "⌕ Command palette",
    body:
      "Type part of a command (e.g. 'dash', 'cat', 'lock', 'export'). Matching is fuzzy.",
    inputs: [
      {
        label: "Command",
        type: "text",
        value: "",
        placeholder: "dashboard, categories, lock, export, settings...",
      },
    ],
    okText: "Run",
    cancelText: "Cancel",
  }).then((res) => {
    if (!res.ok) return;
    const q = (res.values[0] || "").toLowerCase().trim();
    if (!q) return;

    const match =
      commands.find((c) => c.label.toLowerCase().includes(q)) || null;

    if (!match) {
      showToast("No matching command");
      return;
    }

    switch (match.id) {
      case "goto_dashboard":
        showPage("dashboard");
        break;
      case "goto_categories":
        showPage("categories");
        break;
      case "goto_downloads":
        showPage("downloads");
        break;
      case "goto_settings":
        showPage("settings");
        break;
      case "lock":
        if (hasPassword()) showLock();
        else showToast("No password set");
        break;
      case "export":
        document.getElementById("exportBtn")?.click();
        break;
      case "import":
        document.getElementById("importBtn")?.click();
        break;
      case "toggle_theme":
        document.getElementById("themeToggle")?.click();
        break;
    }
  });
}

(function setupKeyboardShortcuts() {
  let lastGTime = 0;

  document.addEventListener("keydown", (e) => {
    const isInput =
      e.target.tagName === "INPUT" ||
      e.target.tagName === "TEXTAREA" ||
      e.target.isContentEditable;

    // Ctrl+K – focus search
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const inp = document.getElementById("searchInput");
      if (inp) inp.focus();
      return;
    }

    // Ctrl+P – command palette
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "p") {
      e.preventDefault();
      openCommandPalette();
      return;
    }

    // Ctrl+L – lock (if password set)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "l") {
      if (hasPassword()) {
        e.preventDefault();
        showLock();
      }
      return;
    }

    // Ctrl+Z / Ctrl+Y – undo/redo
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
      return;
    }
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === "y") {
      e.preventDefault();
      redo();
      return;
    }

    if (isInput) return;

    // G then D / C – go to Dashboard / Categories
    const now = Date.now();
    if (e.key.toLowerCase() === "g") {
      lastGTime = now;
      return;
    }
    if (now - lastGTime < 800) {
      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        showPage("dashboard");
        lastGTime = 0;
        return;
      }
      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        showPage("categories");
        lastGTime = 0;
        return;
      }
    }
  });
})();
// ======================================================
// DASHBOARD EXPANSION PACK (Piece 2/3)
// Paste this DIRECTLY under Piece 1
// ======================================================

// ======================================================
// 5) AUTO‑TAGGING BASED ON URL
// ======================================================
(function setupAutoTagging() {
  function autoTagLink(link) {
    const url = String(link.url || "").toLowerCase();
    const tags = new Set(link.tags || []);

    if (url.includes("youtube") || url.includes("twitch")) tags.add("video");
    if (url.includes("spotify") || url.includes("soundcloud")) tags.add("music");
    if (url.includes("discord")) tags.add("chat");
    if (url.includes("github")) tags.add("dev");
    if (url.includes("docs") || url.includes("developer.mozilla")) tags.add("docs");
    if (url.includes("game") || url.includes("steam") || url.includes("itch.io"))
      tags.add("games");
    if (url.includes("mail") || url.includes("gmail") || url.includes("outlook"))
      tags.add("email");

    link.tags = Array.from(tags);
  }

  function autoTagAll() {
    for (const cat of data.categories) {
      for (const link of cat.links) {
        autoTagLink(link);
      }
    }
  }

  autoTagAll();

  const _origSaveData = saveData;
  saveData = function () {
    autoTagAll();
    _origSaveData();
  };
})();

// ======================================================
// 6) NOTES EDITOR (RIGHT‑CLICK CARD TO EDIT NOTE)
// ======================================================
(function setupNotesEditor() {
  const dash = document.getElementById("page-dashboard");
  if (!dash) return;

  dash.addEventListener("contextmenu", (e) => {
    const card = e.target.closest("a.card");
    if (!card) return;
    e.preventDefault();

    const href = card.getAttribute("href");
    if (!href) return;

    const nu = normalizeUrl(href);
    let found = null;

    for (const cat of data.categories) {
      for (const link of cat.links) {
        if (normalizeUrl(link.url) === nu) {
          found = link;
          break;
        }
      }
      if (found) break;
    }

    if (!found) return;

    openModal({
      title: `📝 Note for "${found.name}"`,
      body: "Add a short note. It will show under the card meta.",
      inputs: [
        {
          label: "Note",
          type: "text",
          value: found.note || "",
          placeholder: "e.g. school login, work, favourite playlist...",
        },
      ],
      okText: "Save",
      cancelText: "Cancel",
    }).then((res) => {
      if (!res.ok) return;
      found.note = res.values[0] || "";
      saveData();
      renderDashboard();
    });
  });
})();

// ======================================================
// 7) BACKGROUND SYSTEM (DAILY GRADIENT + CUSTOM UPLOAD)
// ======================================================
(function setupBackgrounds() {
  const bgEl = document.querySelector(".bg");
  if (!bgEl) return;

  function applyDailyGradient() {
    const day = new Date().getDate();
    const gradients = [
      "radial-gradient(circle at 0% 0%, #4f46e5 0, transparent 60%), radial-gradient(circle at 100% 0%, #06b6d4 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
      "radial-gradient(circle at 0% 0%, #ec4899 0, transparent 60%), radial-gradient(circle at 100% 0%, #22c55e 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
      "radial-gradient(circle at 0% 0%, #f97316 0, transparent 60%), radial-gradient(circle at 100% 0%, #3b82f6 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
      "radial-gradient(circle at 0% 0%, #a855f7 0, transparent 60%), radial-gradient(circle at 100% 0%, #22d3ee 0, transparent 60%), linear-gradient(180deg, #0f172a, #020617)",
    ];
    const g = gradients[day % gradients.length];
    bgEl.style.backgroundImage = g;
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.opacity = 1;
    bgEl.style.filter = "none";
  }

  function applyCustomBackground() {
    if (!settings.bgImage) {
      applyDailyGradient();
      return;
    }
    bgEl.style.backgroundImage = `url(${settings.bgImage})`;
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.opacity = settings.bgOpacity ?? 0.9;
    bgEl.style.filter = `blur(${settings.bgBlur || 0}px)`;
  }

  if (settings.bgImage) applyCustomBackground();
  else applyDailyGradient();

  const settingsPage = document.getElementById("page-settings");
  if (!settingsPage) return;

  const panel = document.createElement("div");
  panel.className = "panel";
  panel.innerHTML = `
    <div class="panel-title">Background</div>
    <div class="panel-text">Daily gradient wallpaper, or upload your own background image.</div>
    <div class="row">
      <button type="button" class="btn" id="bgUseDailyBtn">Use daily gradient</button>
      <button type="button" class="btn" id="bgUploadBtn">Upload image</button>
      <input type="file" id="bgFileInput" accept="image/*" class="hidden" />
    </div>
    <div class="row">
      <label class="tiny" for="bgBlurRange">Blur</label>
      <input id="bgBlurRange" type="range" min="0" max="20" value="${settings.bgBlur || 0}" />
      <label class="tiny" for="bgOpacityRange">Opacity</label>
      <input id="bgOpacityRange" type="range" min="30" max="100" value="${(settings.bgOpacity || 0.9) * 100}" />
    </div>
  `;
  settingsPage.appendChild(panel);

  const bgUseDailyBtn = document.getElementById("bgUseDailyBtn");
  const bgUploadBtn = document.getElementById("bgUploadBtn");
  const bgFileInput = document.getElementById("bgFileInput");
  const bgBlurRange = document.getElementById("bgBlurRange");
  const bgOpacityRange = document.getElementById("bgOpacityRange");

  bgUseDailyBtn?.addEventListener("click", () => {
    delete settings.bgImage;
    delete settings.bgBlur;
    delete settings.bgOpacity;
    saveSettings(settings);
    applyDailyGradient();
    showToast("Using daily gradient");
  });

  bgUploadBtn?.addEventListener("click", () => bgFileInput?.click());

  bgFileInput?.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      settings.bgImage = reader.result;
      saveSettings(settings);
      applyCustomBackground();
      showToast("Background updated");
    };
    reader.readAsDataURL(file);
  });

  bgBlurRange?.addEventListener("input", (e) => {
    settings.bgBlur = Number(e.target.value || 0);
    saveSettings(settings);
    applyCustomBackground();
  });

  bgOpacityRange?.addEventListener("input", (e) => {
    settings.bgOpacity = Number(e.target.value || 90) / 100;
    saveSettings(settings);
    applyCustomBackground();
  });
})();

// ======================================================
// 8) CLIPBOARD SYNC (COPY/PASTE JSON)
// ======================================================
(function setupClipboardSync() {
  const settingsPage = document.getElementById("page-settings");
  if (!settingsPage) return;

  const dataPanel = document.querySelector("#page-settings .panel");
  if (!dataPanel) return;

  const row = dataPanel.querySelector(".row");
  if (!row) return;

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "btn";
  copyBtn.textContent = "Copy JSON to clipboard";

  const pasteBtn = document.createElement("button");
  pasteBtn.type = "button";
  pasteBtn.className = "btn";
  pasteBtn.textContent = "Paste JSON from clipboard";

  row.appendChild(copyBtn);
  row.appendChild(pasteBtn);

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      showToast("Copied JSON to clipboard");
    } catch {
      showToast("Clipboard not available");
    }
  });

  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      data = migrateAndFix(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      renderCategories();
      renderDashboard();
      renderTagFilters();
      showToast("Imported from clipboard JSON");
    } catch {
      showToast("Failed to import from clipboard");
    }
  });
})();
// ======================================================
// DASHBOARD EXPANSION PACK (Piece 3/3)
// Paste this DIRECTLY under Piece 2
// ======================================================

// ======================================================
// 9) EMOJI ICON PICKER FOR CATEGORIES
// ======================================================
(function setupEmojiPicker() {
  const categoriesWrap = document.getElementById("categoriesWrap");
  if (!categoriesWrap) return;

  const EMOJIS =
    "📁 🌐 🎮 🧰 💬 📚 🎬 🎧 📝 🧱 🛡️ ⚙️ ⭐ 🔗 💻 🖥️ 📱 🎯 🚀 🧪 🧠 🧮 🧾 🕹️ 🎲 🎵 🎶 🎤 🎧 🎼 🎹 🎻 🎺 🎷 🥁 🎬 📺 📻 📰".split(
      " "
    );

  categoriesWrap.addEventListener("click", (e) => {
    const btn = e.target.closest('button[data-action="setIcon"]');
    if (!btn) return;

    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    openEmojiPicker(cat);
  });

  function openEmojiPicker(cat) {
    const body = EMOJIS.map((e, i) =>
      ((i + 1) % 12 === 0 ? e + "\n" : e + " ")
    ).join("");

    openModal({
      title: `Choose icon for "${cat.name}"`,
      body:
        body +
        "\n\nType a single emoji below, or paste one. You can also pick from above.",
      inputs: [
        {
          label: "Emoji",
          type: "text",
          value: cat.icon || "📁",
          placeholder: "e.g. 🎮",
        },
      ],
      okText: "Save",
      cancelText: "Cancel",
    }).then((res) => {
      if (!res.ok) return;
      const val = (res.values[0] || "").trim();
      if (!val) return;
      cat.icon = val[0];
      saveData();
      renderCategories();
      renderDashboard();
    });
  }
})();

// ======================================================
// 10) CUSTOM CARD THEMES (YOUTUBE, DISCORD, GITHUB, SPOTIFY)
// ======================================================
(function setupCardThemes() {
  const domainThemeMap = {
    "youtube.com": "card-theme-youtube",
    "youtu.be": "card-theme-youtube",
    "discord.com": "card-theme-discord",
    "discord.gg": "card-theme-discord",
    "github.com": "card-theme-github",
    "spotify.com": "card-theme-spotify",
    "open.spotify.com": "card-theme-spotify",
  };

  function getThemeClassForUrl(url) {
    try {
      const u = new URL(url);
      const host = u.hostname.replace("www.", "").toLowerCase();
      return domainThemeMap[host] || "";
    } catch {
      return "";
    }
  }

  const _origRenderCard = renderCard;

  renderCard = function (item) {
    const html = _origRenderCard(item);
    const themeClass = getThemeClassForUrl(item.link.url);
    if (!themeClass) return html;

    return html.replace(
      'class="card"',
      `class="card ${themeClass}"`
    );
  };

  renderDashboard();
})();

// ======================================================
// 11) UNKNOWN & UNDERRATED WEB EXPANSION PACK (50+ LINKS)
// ======================================================
(function setupUnknownWebExpansion() {
  const byName = (name) => String(name || "").trim().toLowerCase();

  function ensureCategory(name, icon, color) {
    let cat = data.categories.find((c) => byName(c.name) === byName(name));
    if (!cat) {
      cat = {
        id: makeId(),
        name,
        icon,
        color,
        links: [],
      };
      data.categories.push(cat);
    }
    return cat;
  }

  const packs = [
    {
      name: "Indie Games",
      icon: "🎮",
      color: "#22c55e",
      links: [
        { name: "Neal.fun", url: "https://neal.fun", tags: ["games"], note: "Interactive web toys." },
        { name: "Little Alchemy 2", url: "https://littlealchemy2.com", tags: ["puzzle"] },
        { name: "Line Rider", url: "https://www.linerider.com", tags: ["physics"] },
        { name: "Quick, Draw!", url: "https://quickdraw.withgoogle.com", tags: ["ai"] },
        { name: "A Dark Room", url: "https://adarkroom.doublespeakgames.com", tags: ["text"] },
        { name: "Hextris", url: "https://hextris.io", tags: ["arcade"] },
        { name: "2048", url: "https://play2048.co", tags: ["puzzle"] },
        { name: "Slope Game", url: "https://y8.com/games/slope", tags: ["arcade"] },
      ],
    },
    {
      name: "Creative Tools",
      icon: "🎨",
      color: "#f97316",
      links: [
        { name: "Silk", url: "https://weavesilk.com", tags: ["art"] },
        { name: "Patatap", url: "https://patatap.com", tags: ["music"] },
        { name: "Inspirograph", url: "https://nathanfriend.io/inspirograph", tags: ["drawing"] },
        { name: "Typedrummer", url: "https://typedrummer.com", tags: ["music"] },
        { name: "Tixy.land", url: "https://tixy.land", tags: ["code"] },
        { name: "This Is Sand", url: "https://thisissand.com", tags: ["relax"] },
        { name: "Pixilart", url: "https://www.pixilart.com/draw", tags: ["pixel"] },
      ],
    },
    {
      name: "Science & Simulators",
      icon: "🧪",
      color: "#22d3ee",
      links: [
        { name: "PhET Simulations", url: "https://phet.colorado.edu/en/simulations/category/html", tags: ["science"] },
        { name: "Stellarium Web", url: "https://stellarium-web.org", tags: ["space"] },
        { name: "NASA Eyes", url: "https://eyes.nasa.gov", tags: ["space"] },
        { name: "Falstad Circuit Simulator", url: "https://www.falstad.com/circuit", tags: ["electronics"] },
        { name: "MyPhysicsLab", url: "https://www.myphysicslab.com", tags: ["physics"] },
        { name: "GeoGebra Classic", url: "https://www.geogebra.org/classic", tags: ["math"] },
      ],
    },
    {
      name: "Niche Communities",
      icon: "💬",
      color: "#ec4899",
      links: [
        { name: "SpaceHey", url: "https://spacehey.com", tags: ["social"] },
        { name: "Replit", url: "https://replit.com", tags: ["code"] },
        { name: "Scratch", url: "https://scratch.mit.edu", tags: ["code"] },
        { name: "Dev.to", url: "https://dev.to", tags: ["dev"] },
        { name: "CodePen", url: "https://codepen.io", tags: ["code"] },
      ],
    },
    {
      name: "Weird Web",
      icon: "🌀",
      color: "#a855f7",
      links: [
        { name: "Pointer Pointer", url: "https://pointerpointer.com", tags: ["weird"] },
        { name: "The Useless Web", url: "https://theuselessweb.com", tags: ["random"] },
        { name: "Zoomquilt", url: "https://zoomquilt.org", tags: ["trippy"] },
        { name: "Sandspiel", url: "https://sandspiel.club", tags: ["sandbox"] },
        { name: "Staggering Beauty", url: "http://www.staggeringbeauty.com", tags: ["weird"] },
      ],
    },
    {
      name: "Learning Tools",
      icon: "📚",
      color: "#0ea5e9",
      links: [
        { name: "Khan Academy Programming", url: "https://www.khanacademy.org/computing/computer-programming", tags: ["code"] },
        { name: "Exercism", url: "https://exercism.org", tags: ["code"] },
        { name: "Brilliant", url: "https://brilliant.org", tags: ["math"] },
        { name: "Duolingo", url: "https://www.duolingo.com", tags: ["language"] },
        { name: "GeoGuessr", url: "https://www.geoguessr.com", tags: ["geography"] },
      ],
    },
    {
      name: "Web Utilities",
      icon: "🧰",
      color: "#64748b",
      links: [
        { name: "Wayback Machine", url: "https://web.archive.org", tags: ["archive"] },
        { name: "httpbin", url: "https://httpbin.org", tags: ["dev"] },
        { name: "ReqBin", url: "https://reqbin.com", tags: ["dev"] },
        { name: "JSON Formatter", url: "https://jsonformatter.org", tags: ["dev"] },
        { name: "Regex101", url: "https://regex101.com", tags: ["dev"] },
      ],
    },
  ];

  for (const pack of packs) {
    const cat = ensureCategory(pack.name, pack.icon, pack.color);
    const existingUrls = new Set(cat.links.map((l) => normalizeUrl(l.url)));

    for (const link of pack.links) {
      const nu = normalizeUrl(link.url);
      if (existingUrls.has(nu)) continue;

      cat.links.push({
        id: makeId(),
        name: link.name,
        url: nu,
        favourite: false,
        tags: link.tags || [],
        note: link.note || "",
      });
    }
  }

  saveData();
  renderCategories();
  renderDashboard();
  renderTagFilters();
})();
// =========================================================
// PROFESSIONAL ANIMATION ENGINE
// Re-triggers animations on re-render + dynamic card entry
// =========================================================

(function enableProAnimations() {
  if (typeof renderDashboard !== "function") return;

  const originalRender = renderDashboard;

  renderDashboard = function () {
    originalRender();

    // Restart animations on cards
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, i) => {
      card.style.animation = "none";
      void card.offsetHeight; // reflow
      card.style.animation = `cardEnter 0.6s cubic-bezier(0.22,1,0.36,1) forwards`;
      card.style.animationDelay = `${i * 0.04}s`; // stagger effect
    });

    // Restart animations on category titles
    const titles = document.querySelectorAll(".category-title");
    titles.forEach((title, i) => {
      title.style.animation = "none";
      void title.offsetHeight;
      title.style.animation = `titleReveal 0.5s cubic-bezier(0.22,1,0.36,1) forwards`;
      title.style.animationDelay = `${i * 0.06}s`;
    });
  };
})();

// Optional helper for adding new cards dynamically
function animateNewCard(cardElement) {
  if (!cardElement) return;
  cardElement.style.opacity = "0";
  cardElement.style.transform = "translateY(20px) scale(0.98)";
  setTimeout(() => {
    cardElement.style.transition = "all 0.6s cubic-bezier(0.22,1,0.36,1)";
    cardElement.style.opacity = "1";
    cardElement.style.transform = "translateY(0) scale(1)";
  }, 10);
}
// =========================================================
// CURSOR-REACTIVE 3D TILT ENGINE
// Makes cards tilt and glow based on mouse position
// =========================================================

(function enableCursorTilt() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized values (-1 to 1)
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;

      // Tilt strength
      const tiltX = ny * 8;   // rotateX
      const tiltY = nx * -8;  // rotateY

      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;

      // Pass mouse position to CSS glow
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });
})();
// =========================================================
// FIXED CURSOR-REACTIVE 3D ENGINE (NO STYLE OVERRIDES)
// =========================================================

(function enableCardTilt() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;

      const tiltX = ny * 8;
      const tiltY = nx * -8;

      card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });
})();
