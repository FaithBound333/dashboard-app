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
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();
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

function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
  catch { return {}; }
}
function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// =====================
// Downloads (official pages)
// =====================
const DOWNLOADS = {
  launchers: [
    { name: "Roblox", url: "https://www.roblox.com/download", icon: "🧱", meta: "roblox.com" },
    { name: "Steam", url: "https://store.steampowered.com/about/", icon: "🎮", meta: "steampowered.com" },
    { name: "Epic Games Launcher", url: "https://store.epicgames.com/en-US/download", icon: "🛒", meta: "epicgames.com" },
  ],
  vpns: [
    { name: "Proton VPN", url: "https://protonvpn.com/download", icon: "🛡️", meta: "protonvpn.com" },
    { name: "Mullvad VPN", url: "https://mullvad.net/en/download/vpn/windows", icon: "🧅", meta: "mullvad.net" },
    { name: "NordVPN", url: "https://nordvpn.com/download/windows/", icon: "🌐", meta: "nordvpn.com" },
    { name: "ExpressVPN", url: "https://www.expressvpn.com/vpn-download", icon: "⚡", meta: "expressvpn.com" },
  ]
};

// =====================
// Default data (same as before + merged defaults)
// =====================
function defaultData() {
  return {
    version: 2,
    categories: [
      {
        id: makeId(),
        name: "Web",
        icon: "🌐",
        links: [
          { id: makeId(), name: "Google", url: "https://www.google.com", favourite: false },
          { id: makeId(), name: "Wikipedia", url: "https://www.wikipedia.org", favourite: false },
          { id: makeId(), name: "BBC", url: "https://www.bbc.co.uk", favourite: false },
          { id: makeId(), name: "Reddit", url: "https://www.reddit.com", favourite: false },
          { id: makeId(), name: "Stack Overflow", url: "https://stackoverflow.com", favourite: false }
        ]
      },
      {
        id: makeId(),
        name: "Gaming",
        icon: "🎮",
        links: [
          { id: makeId(), name: "Poki", url: "https://poki.com", favourite: false },
          { id: makeId(), name: "CrazyGames", url: "https://www.crazygames.com", favourite: false },
          { id: makeId(), name: "Coolmath Games", url: "https://www.coolmathgames.com", favourite: false },
          { id: makeId(), name: "itch.io", url: "https://itch.io", favourite: false },
          { id: makeId(), name: "Steam", url: "https://store.steampowered.com", favourite: false },
          { id: makeId(), name: "Roblox", url: "https://www.roblox.com", favourite: false }
        ]
      },
      {
        id: makeId(),
        name: "Learning",
        icon: "📚",
        links: [
          { id: makeId(), name: "Khan Academy", url: "https://www.khanacademy.org", favourite: false },
          { id: makeId(), name: "MDN Web Docs", url: "https://developer.mozilla.org", favourite: false },
          { id: makeId(), name: "W3Schools", url: "https://www.w3schools.com", favourite: false },
          { id: makeId(), name: "FreeCodeCamp", url: "https://www.freecodecamp.org", favourite: false }
        ]
      },
      {
        id: makeId(),
        name: "Tools",
        icon: "🧰",
        links: [
          { id: makeId(), name: "GitHub", url: "https://github.com", favourite: false },
          { id: makeId(), name: "ChatGPT", url: "https://chat.openai.com", favourite: false },
          { id: makeId(), name: "Google Drive", url: "https://drive.google.com", favourite: false },
          { id: makeId(), name: "Gmail", url: "https://mail.google.com", favourite: false },
          { id: makeId(), name: "Google Calendar", url: "https://calendar.google.com", favourite: false }
        ]
      },
      {
        id: makeId(),
        name: "Media",
        icon: "🎬",
        links: [
          { id: makeId(), name: "YouTube", url: "https://www.youtube.com", favourite: false },
          { id: makeId(), name: "Spotify", url: "https://open.spotify.com", favourite: false },
          { id: makeId(), name: "Twitch", url: "https://www.twitch.tv", favourite: false }
        ]
      },
      {
        id: makeId(),
        name: "Social",
        icon: "💬",
        links: [
          { id: makeId(), name: "Discord", url: "https://discord.com", favourite: false },
          { id: makeId(), name: "X", url: "https://x.com", favourite: false }
        ]
      }
    ]
  };
}

function fixV2(data) {
  if (!data.categories) data.categories = [];
  for (const cat of data.categories) {
    if (!cat.id) cat.id = makeId();
    if (!cat.icon) cat.icon = "📁";
    if (!Array.isArray(cat.links)) cat.links = [];
    for (const link of cat.links) {
      if (!link.id) link.id = makeId();
      if (typeof link.favourite !== "boolean") link.favourite = false;
      link.url = normalizeUrl(link.url);
    }
  }
}

function mergeDefaults(current) {
  const def = defaultData();
  const byName = (name) => String(name || "").trim().toLowerCase();

  for (const dcat of def.categories) {
    const existing = current.categories.find(c => byName(c.name) === byName(dcat.name));
    if (!existing) {
      current.categories.push(dcat);
      continue;
    }
    if (!existing.icon) existing.icon = dcat.icon || "📁";
    const existingUrls = new Set(existing.links.map(l => normalizeUrl(l.url)));
    for (const dlink of dcat.links) {
      const nu = normalizeUrl(dlink.url);
      if (!existingUrls.has(nu)) {
        existing.links.push({ id: makeId(), name: dlink.name, url: nu, favourite: false });
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
    const iconMap = { Web: "🌐", Gaming: "🎮", Tools: "🧰", Social: "💬", Learning: "📚", Media: "🎬" };
    const categories = Object.entries(raw).map(([name, links]) => {
      const safeLinks = Array.isArray(links) ? links : [];
      return {
        id: makeId(),
        name,
        icon: iconMap[name] || "📁",
        links: safeLinks.map(l => ({
          id: makeId(),
          name: l?.name || "Link",
          url: normalizeUrl(l?.url || "#"),
          favourite: Boolean(l?.favourite)
        }))
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
    return defaultData();
  }
}
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// =====================
// Theme
// =====================
const settings = loadSettings();
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeText.textContent = isDark ? "Light" : "Dark";
  settings.theme = isDark ? "dark" : "light";
  saveSettings(settings);
}
applyTheme(settings.theme === "dark");

themeToggle.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("dark"));
});

// =====================
// Lock screen (basic)
// =====================
const lockOverlay = document.getElementById("lockOverlay");
const unlockPassword = document.getElementById("unlockPassword");
const unlockBtn = document.getElementById("unlockBtn");
const unlockError = document.getElementById("unlockError");

function hasPassword() { return Boolean(localStorage.getItem(PASS_HASH_KEY)); }
function isUnlockedThisSession() { return sessionStorage.getItem(UNLOCKED_SESSION_KEY) === "1"; }
function setUnlockedThisSession(val) { sessionStorage.setItem(UNLOCKED_SESSION_KEY, val ? "1" : "0"); }

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
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
  if (hash === stored) { setUnlockedThisSession(true); hideLock(); }
  else { unlockError.classList.remove("hidden"); }
}
unlockBtn.addEventListener("click", tryUnlock);
unlockPassword.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });

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

function showPage(key) {
  Object.values(pages).forEach(p => p.classList.remove("show"));
  pages[key].classList.add("show");
  navItems.forEach(btn => btn.classList.toggle("active", btn.dataset.page === key));

  pageTitle.textContent =
    key === "dashboard" ? "Dashboard" :
    key === "categories" ? "Categories" :
    key === "downloads" ? "Downloads" :
    "Settings";

  dashboardTools.style.display = (key === "dashboard") ? "flex" : "none";
}
navItems.forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.page)));

// Sidebar collapsible groups (saved)
document.querySelectorAll(".side-group").forEach(group => {
  const key = group.getAttribute("data-group") || makeId();
  const collapsed = settings[`group_${key}`] === true;
  if (collapsed) group.classList.add("collapsed");

  const header = group.querySelector(".group-header");
  header.addEventListener("click", () => {
    group.classList.toggle("collapsed");
    settings[`group_${key}`] = group.classList.contains("collapsed");
    saveSettings(settings);
  });
});

// =====================
// App state
// =====================
let data = loadData();
saveData();

// =====================
// Dashboard rendering + favourites
// =====================
const favSection = document.getElementById("favSection");
const favGrid = document.getElementById("favGrid");
const linkGrid = document.getElementById("linkGrid");
const searchInput = document.getElementById("searchInput");

function allLinks() {
  const out = [];
  for (const cat of data.categories) {
    for (const link of cat.links) {
      out.push({ catId: cat.id, catName: cat.name, catIcon: cat.icon, link });
    }
  }
  return out;
}

function findLinkById(linkId) {
  for (const cat of data.categories) {
    const idx = cat.links.findIndex(l => l.id === linkId);
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
}

function renderCard(item) {
  const l = item.link;
  const starClass = l.favourite ? "star-btn on" : "star-btn";
  return `
    <a class="card" href="${escapeHtml(l.url)}" target="_blank" rel="noreferrer">
      <button class="${starClass}" type="button" data-action="toggleFav" data-linkid="${escapeHtml(l.id)}" aria-label="Favourite">⭐</button>
      <div class="card-icon">${escapeHtml(item.catIcon || "🔗")}</div>
      <div class="card-title">${escapeHtml(l.name)}</div>
      <div class="card-meta">${escapeHtml(item.catName)}</div>
    </a>
  `;
}

function renderDashboard() {
  const q = (searchInput.value || "").trim().toLowerCase();

  const items = allLinks().filter(item => {
    const text = `${item.link.name} ${item.catName}`.toLowerCase();
    return text.includes(q);
  });

  const favs = items.filter(i => i.link.favourite);
  const rest = items.filter(i => !i.link.favourite);

  if (favs.length > 0) {
    favSection.classList.remove("hidden");
    favGrid.innerHTML = favs.map(renderCard).join("");
  } else {
    favSection.classList.add("hidden");
    favGrid.innerHTML = "";
  }

  linkGrid.innerHTML = rest.map(renderCard).join("");
}

searchInput.addEventListener("input", renderDashboard);

document.getElementById("page-dashboard").addEventListener("click", (e) => {
  const btn = e.target.closest('button[data-action="toggleFav"]');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  toggleFavouriteById(btn.getAttribute("data-linkid"));
});

// =====================
// Downloads page render
// =====================
const downloadsLaunchersGrid = document.getElementById("downloadsLaunchersGrid");
const downloadsVpnsGrid = document.getElementById("downloadsVpnsGrid");

function renderDownloadCard(item) {
  return `
    <a class="card" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">
      <div class="card-icon">${escapeHtml(item.icon || "⬇️")}</div>
      <div class="card-title">${escapeHtml(item.name)}</div>
      <div class="card-meta">${escapeHtml(item.meta || shortUrl(item.url))}</div>
    </a>
  `;
}

function renderDownloads() {
  downloadsLaunchersGrid.innerHTML = DOWNLOADS.launchers.map(renderDownloadCard).join("");
  downloadsVpnsGrid.innerHTML = DOWNLOADS.vpns.map(renderDownloadCard).join("");
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

function findCategoryById(catId) {
  return data.categories.find(c => c.id === catId);
}

function renderCategories() {
  categoriesWrap.innerHTML = "";

  for (const cat of data.categories) {
    const item = document.createElement("div");
    item.className = "acc-item";
    item.setAttribute("data-catid", cat.id);

    item.innerHTML = `
      <div class="acc-header">
        <div class="acc-title">
          <span class="cat-emoji">${escapeHtml(cat.icon || "📁")}</span>
          <span>${escapeHtml(cat.name)}</span>
        </div>
        <div class="acc-actions">
          <button type="button" data-action="addLink" data-catid="${escapeHtml(cat.id)}">+ Link</button>
          <button type="button" data-action="setIcon" data-catid="${escapeHtml(cat.id)}">Icon</button>
          <button type="button" data-action="renameCat" data-catid="${escapeHtml(cat.id)}">Rename</button>
          <button type="button" data-action="deleteCat" data-catid="${escapeHtml(cat.id)}">Delete</button>
          <span class="acc-arrow">▾</span>
        </div>
      </div>

      <div class="acc-body">
        <div class="link-list">
          ${cat.links.map(l => `
            <div class="link-item" draggable="true" data-catid="${escapeHtml(cat.id)}" data-linkid="${escapeHtml(l.id)}">
              <div class="link-left">
                <div class="drag" title="Drag to reorder">⠿</div>
                <div class="link-text">
                  <div class="link-name">${escapeHtml(l.name)}</div>
                  <div class="link-url">${escapeHtml(shortUrl(l.url))}</div>
                </div>
              </div>

              <div class="link-actions">
                <button type="button" data-action="openLink" data-linkid="${escapeHtml(l.id)}">🔗</button>
                <button type="button" data-action="toggleFav" data-linkid="${escapeHtml(l.id)}">${l.favourite ? "⭐" : "☆"}</button>
                <button type="button" data-action="editLink" data-linkid="${escapeHtml(l.id)}">✏️</button>
                <button type="button" data-action="deleteLink" data-linkid="${escapeHtml(l.id)}">🗑️</button>
              </div>
            </div>
          `).join("")}
        </div>
        ${cat.links.length === 0 ? `<div class="tiny" style="padding-top:10px;">No links yet. Click + Link.</div>` : ``}
      </div>
    `;

    categoriesWrap.appendChild(item);
  }
}

categoriesWrap.addEventListener("click", (e) => {
  const actionBtn = e.target.closest("button[data-action]");
  if (actionBtn) return;

  const header = e.target.closest(".acc-header");
  if (!header) return;

  const item = header.closest(".acc-item");
  item.classList.toggle("open");
});

categoriesWrap.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");

  if (action === "addLink") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const name = (quickName.value || "").trim() || prompt("Link name?");
    const url = normalizeUrl((quickUrl.value || "").trim() || prompt("Link URL? (include https://)"));
    if (!name || !url) return;

    cat.links.push({ id: makeId(), name: name.trim(), url, favourite: false });
    quickName.value = "";
    quickUrl.value = "";
    saveData();
    renderCategories();
    renderDashboard();
    return;
  }

  if (action === "setIcon") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const icon = prompt("Category icon (emoji):", cat.icon || "📁");
    if (!icon) return;

    cat.icon = icon.trim().slice(0, 4);
    saveData();
    renderCategories();
    renderDashboard();
    return;
  }

  if (action === "renameCat") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const next = prompt("New category name:", cat.name);
    if (!next) return;

    const trimmed = next.trim();
    if (!trimmed || trimmed.toLowerCase() === cat.name.toLowerCase()) return;

    const exists = data.categories.some(c => c.id !== cat.id && c.name.trim().toLowerCase() === trimmed.toLowerCase());
    if (exists) return alert("That category already exists.");

    cat.name = trimmed;
    saveData();
    renderCategories();
    renderDashboard();
    return;
  }

  if (action === "deleteCat") {
    const catId = btn.getAttribute("data-catid");
    const cat = findCategoryById(catId);
    if (!cat) return;

    const ok = confirm(`Delete category "${cat.name}" and all its links?`);
    if (!ok) return;

    data.categories = data.categories.filter(c => c.id !== catId);
    saveData();
    renderCategories();
    renderDashboard();
    return;
  }

  const linkId = btn.getAttribute("data-linkid");
  if (!linkId) return;

  if (action === "openLink") {
    const found = findLinkById(linkId);
    if (!found) return;
    window.open(found.link.url, "_blank", "noreferrer");
    return;
  }

  if (action === "toggleFav") {
    toggleFavouriteById(linkId);
    return;
  }

  if (action === "editLink") {
    const found = findLinkById(linkId);
    if (!found) return;

    const name = prompt("Link name:", found.link.name);
    if (!name) return;

    const url = normalizeUrl(prompt("Link URL:", found.link.url));
    if (!url) return;

    found.link.name = name.trim();
    found.link.url = url;
    saveData();
    renderCategories();
    renderDashboard();
    return;
  }

  if (action === "deleteLink") {
    const found = findLinkById(linkId);
    if (!found) return;

    found.cat.links.splice(found.idx, 1);
    saveData();
    renderCategories();
    renderDashboard();
    return;
  }
});

expandAllBtn.addEventListener("click", () => {
  document.querySelectorAll(".acc-item").forEach(i => i.classList.add("open"));
});
collapseAllBtn.addEventListener("click", () => {
  document.querySelectorAll(".acc-item").forEach(i => i.classList.remove("open"));
});

addCategoryBtn.addEventListener("click", () => {
  const name = prompt("Category name:");
  if (!name) return;
  const trimmed = name.trim();
  if (!trimmed) return;

  const exists = data.categories.some(c => c.name.trim().toLowerCase() === trimmed.toLowerCase());
  if (exists) return alert("That category already exists.");

  const icon = prompt("Category icon (emoji):", "📁") || "📁";

  data.categories.push({ id: makeId(), name: trimmed, icon: icon.trim().slice(0, 4), links: [] });
  saveData();
  renderCategories();
  renderDashboard();
});

// Drag & drop reorder (within same category)
let dragState = null;

categoriesWrap.addEventListener("dragstart", (e) => {
  const item = e.target.closest(".link-item");
  if (!item) return;

  dragState = { catId: item.getAttribute("data-catid"), linkId: item.getAttribute("data-linkid") };
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", dragState.linkId);
});

categoriesWrap.addEventListener("dragover", (e) => {
  const target = e.target.closest(".link-item");
  if (!target) return;
  e.preventDefault();
  target.classList.add("drag-over");
  e.dataTransfer.dropEffect = "move";
});

categoriesWrap.addEventListener("dragleave", (e) => {
  const target = e.target.closest(".link-item");
  if (!target) return;
  target.classList.remove("drag-over");
});

categoriesWrap.addEventListener("drop", (e) => {
  const target = e.target.closest(".link-item");
  if (!target) return;

  e.preventDefault();
  target.classList.remove("drag-over");
  if (!dragState) return;

  const targetCatId = target.getAttribute("data-catid");
  const targetLinkId = target.getAttribute("data-linkid");

  if (dragState.catId !== targetCatId) { dragState = null; return; }

  const cat = findCategoryById(targetCatId);
  if (!cat) { dragState = null; return; }

  const fromIndex = cat.links.findIndex(l => l.id === dragState.linkId);
  const toIndex = cat.links.findIndex(l => l.id === targetLinkId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) { dragState = null; return; }

  const [moved] = cat.links.splice(fromIndex, 1);
  cat.links.splice(toIndex, 0, moved);

  dragState = null;
  saveData();
  renderCategories();
  renderDashboard();
});

// =====================
// Settings: Export / Import / Reset
// =====================
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const resetDataBtn = document.getElementById("resetDataBtn");

exportBtn.addEventListener("click", () => {
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
});

importBtn.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", () => {
  const file = importFile.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || ""));
      if (!parsed || parsed.version !== 2 || !Array.isArray(parsed.categories)) {
        alert("Invalid JSON format.");
        return;
      }
      fixV2(parsed);
      data = mergeDefaults(parsed);
      saveData();
      renderCategories();
      renderDashboard();
      alert("Imported successfully.");
    } catch {
      alert("Could not read JSON.");
    }
  };
  reader.readAsText(file);
  importFile.value = "";
});

resetDataBtn.addEventListener("click", () => {
  const ok = confirm("Reset saved categories + links back to defaults?");
  if (!ok) return;

  localStorage.removeItem(STORAGE_KEY);
  data = loadData();
  saveData();
  renderCategories();
  renderDashboard();
});

// =====================
// Settings: Password controls
// =====================
const setPasswordBtn = document.getElementById("setPasswordBtn");
const removePasswordBtn = document.getElementById("removePasswordBtn");
const lockNowBtn = document.getElementById("lockNowBtn");

setPasswordBtn.addEventListener("click", async () => {
  const p1 = prompt("Set a password (remember it):");
  if (!p1) return;

  const p2 = prompt("Confirm password:");
  if (!p2) return;

  if (p1 !== p2) {
    alert("Passwords do not match.");
    return;
  }

  const hash = await sha256(p1);
  localStorage.setItem(PASS_HASH_KEY, hash);
  setUnlockedThisSession(true);
  alert("Password set.");
});

removePasswordBtn.addEventListener("click", () => {
  const ok = confirm("Remove password lock?");
  if (!ok) return;

  localStorage.removeItem(PASS_HASH_KEY);
  setUnlockedThisSession(true);
  hideLock();
  alert("Password removed.");
});

lockNowBtn.addEventListener("click", () => {
  if (!hasPassword()) {
    alert("Set a password first.");
    return;
  }
  setUnlockedThisSession(false);
  showLock();
});

// =====================
// Init
// =====================
showPage("dashboard");
renderCategories();
renderDashboard();
renderDownloads();

if (hasPassword() && !isUnlockedThisSession()) showLock();
else hideLock();
