// app.js — Fancy Aroma Smart Digital Menu (Vanilla JS, ES Modules)
import { menuItems, drinkItems, categories, drinkSubCats, languages, currencies, i18n } from './data/menu.js';

// ============================================================
// STATE
// ============================================================
const state = {
  lang: 'en',
  currency: currencies[0],
  activeCategory: 'All',
  activeDrinkSub: 'Hot Drinks',
  search: '',
  qrSheetOpen: false,
  settingsOpen: false,
  langDropOpen: false,
  curDropOpen: false,
};

// ============================================================
// HELPERS
// ============================================================
function t(key) { return (i18n[state.lang] || i18n.en)[key] || i18n.en[key] || key; }

function formatPrice(etbPrice) {
  const c = state.currency;
  const val = (etbPrice * c.rate).toFixed(c.code === 'ETB' ? 0 : 2);
  return c.format(val);
}

function getText(obj) {
  if (typeof obj === 'string') return obj;
  return obj[state.lang] || obj.en || '';
}

function el(sel, root = document) { return root.querySelector(sel); }
function els(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function closeAllDropdowns() {
  state.langDropOpen = false;
  state.curDropOpen = false;
  el('.lang-btn')?.classList.remove('open');
  el('.cur-btn')?.classList.remove('open');
  el('.lang-menu')?.classList.remove('open');
  el('.cur-menu')?.classList.remove('open');
}

// ============================================================
// QR CODE SVG (pure SVG, no library)
// ============================================================
function generateQRSVG() {
  // Simple decorative QR pattern (visual representation)
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="white"/>
    <!-- Finder top-left -->
    <rect x="5" y="5" width="30" height="30" rx="3" fill="#2D4A1E"/>
    <rect x="10" y="10" width="20" height="20" rx="2" fill="white"/>
    <rect x="14" y="14" width="12" height="12" rx="1" fill="#2D4A1E"/>
    <!-- Finder top-right -->
    <rect x="65" y="5" width="30" height="30" rx="3" fill="#2D4A1E"/>
    <rect x="70" y="10" width="20" height="20" rx="2" fill="white"/>
    <rect x="74" y="14" width="12" height="12" rx="1" fill="#2D4A1E"/>
    <!-- Finder bottom-left -->
    <rect x="5" y="65" width="30" height="30" rx="3" fill="#2D4A1E"/>
    <rect x="10" y="70" width="20" height="20" rx="2" fill="white"/>
    <rect x="14" y="74" width="12" height="12" rx="1" fill="#2D4A1E"/>
    <!-- Data modules -->
    <rect x="40" y="5" width="5" height="5" fill="#C9A84C"/>
    <rect x="48" y="5" width="5" height="5" fill="#2D4A1E"/>
    <rect x="56" y="5" width="5" height="5" fill="#C9A84C"/>
    <rect x="40" y="13" width="5" height="5" fill="#2D4A1E"/>
    <rect x="48" y="13" width="5" height="5" fill="#C9A84C"/>
    <rect x="56" y="13" width="5" height="5" fill="#2D4A1E"/>
    <rect x="40" y="21" width="5" height="5" fill="#C9A84C"/>
    <rect x="48" y="21" width="5" height="5" fill="#2D4A1E"/>
    <rect x="56" y="21" width="5" height="5" fill="#C9A84C"/>
    <rect x="5" y="40" width="5" height="5" fill="#2D4A1E"/>
    <rect x="13" y="40" width="5" height="5" fill="#C9A84C"/>
    <rect x="21" y="40" width="5" height="5" fill="#2D4A1E"/>
    <rect x="29" y="40" width="5" height="5" fill="#C9A84C"/>
    <rect x="40" y="40" width="5" height="5" fill="#2D4A1E"/>
    <rect x="48" y="40" width="5" height="5" fill="#C9A84C"/>
    <rect x="56" y="40" width="5" height="5" fill="#2D4A1E"/>
    <rect x="64" y="40" width="5" height="5" fill="#C9A84C"/>
    <rect x="72" y="40" width="5" height="5" fill="#2D4A1E"/>
    <rect x="80" y="40" width="5" height="5" fill="#C9A84C"/>
    <rect x="88" y="40" width="5" height="5" fill="#2D4A1E"/>
    <rect x="5" y="48" width="5" height="5" fill="#C9A84C"/>
    <rect x="13" y="48" width="5" height="5" fill="#2D4A1E"/>
    <rect x="21" y="56" width="5" height="5" fill="#C9A84C"/>
    <rect x="29" y="56" width="5" height="5" fill="#2D4A1E"/>
    <rect x="40" y="48" width="5" height="5" fill="#2D4A1E"/>
    <rect x="48" y="56" width="5" height="5" fill="#C9A84C"/>
    <rect x="56" y="48" width="5" height="5" fill="#2D4A1E"/>
    <rect x="64" y="56" width="5" height="5" fill="#C9A84C"/>
    <rect x="72" y="48" width="5" height="5" fill="#2D4A1E"/>
    <rect x="80" y="56" width="5" height="5" fill="#C9A84C"/>
    <rect x="88" y="48" width="5" height="5" fill="#2D4A1E"/>
    <rect x="40" y="64" width="5" height="5" fill="#C9A84C"/>
    <rect x="48" y="72" width="5" height="5" fill="#2D4A1E"/>
    <rect x="56" y="64" width="5" height="5" fill="#C9A84C"/>
    <rect x="64" y="72" width="5" height="5" fill="#2D4A1E"/>
    <rect x="72" y="64" width="5" height="5" fill="#C9A84C"/>
    <rect x="80" y="72" width="5" height="5" fill="#2D4A1E"/>
    <rect x="88" y="64" width="5" height="5" fill="#C9A84C"/>
    <rect x="40" y="80" width="5" height="5" fill="#2D4A1E"/>
    <rect x="48" y="88" width="5" height="5" fill="#C9A84C"/>
    <rect x="56" y="80" width="5" height="5" fill="#2D4A1E"/>
    <rect x="64" y="88" width="5" height="5" fill="#C9A84C"/>
    <rect x="72" y="80" width="5" height="5" fill="#2D4A1E"/>
    <rect x="80" y="88" width="5" height="5" fill="#C9A84C"/>
    <rect x="88" y="80" width="5" height="5" fill="#2D4A1E"/>
  </svg>`;
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================
function renderBadge(item) {
  if (!item.badge) return '';
  const cls = item.badge === 'popular' ? 'popular' : item.badge === 'new' ? 'new' : 'special';
  const label = item.badge === 'popular' ? 'Popular' : item.badge === 'new' ? 'New' : "Chef's Special";
  return `<div class="card-badge ${cls}">${item.badgeIcon} ${label}</div>`;
}

function renderFoodCard(item) {
  return `
  <article class="food-card" data-id="${item.id}" tabindex="0" aria-label="${getText(item.name)}">
    <div class="card-img">
      <img src="${item.image}" alt="${getText(item.name)}" loading="lazy" />
      ${renderBadge(item)}
    </div>
    <div class="card-body">
      <h3 class="card-name">${getText(item.name)}</h3>
      <p class="card-desc">${getText(item.desc)}</p>
      <div class="card-footer">
        <span class="price-badge" data-etb="${item.price}">${formatPrice(item.price)}</span>
        <button class="add-btn" data-id="${item.id}" aria-label="${t('add')}" title="${t('add')}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function getFilteredFood() {
  const q = state.search.toLowerCase().trim();
  return menuItems.filter(item => {
    const matchCat = state.activeCategory === 'All' || item.category === state.activeCategory;
    const matchQ = !q || getText(item.name).toLowerCase().includes(q) || getText(item.desc).toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

function getFilteredDrinks() {
  const q = state.search.toLowerCase().trim();
  return drinkItems.filter(item => {
    const matchSub = item.subCategory === state.activeDrinkSub;
    const matchQ = !q || getText(item.name).toLowerCase().includes(q) || getText(item.desc).toLowerCase().includes(q);
    return matchSub && matchQ;
  });
}

function renderCategoryTabs() {
  return categories.map(cat => `
    <button class="cat-tab${state.activeCategory === cat ? ' active' : ''}" data-cat="${cat}">
      ${cat}
    </button>`).join('');
}

function renderDrinkSubTabs() {
  return drinkSubCats.map(sub => `
    <button class="sub-tab${state.activeDrinkSub === sub ? ' active' : ''}" data-sub="${sub}">
      ${sub}
    </button>`).join('');
}

function renderQRPanel(isSheet = false) {
  return `
    <div class="qr-panel${isSheet ? ' qr-panel-sheet' : ''}">
      <p class="qr-panel-title">${t('qr_title')} <br/><span style="font-family:var(--font-body);font-size:0.75rem;color:var(--accent)">${t('qr_title_am')}</span></p>
      <p class="qr-panel-subtitle">${t('qr_sub')}</p>
      <div class="qr-code-wrap">${generateQRSVG()}</div>
      <div class="qr-table-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        Table 7
      </div>
      <p class="qr-note">${t('qr_note')}</p>
    </div>`;
}

// ============================================================
// MAIN RENDER
// ============================================================
function render() {
  const dir = languages.find(l => l.code === state.lang)?.dir || 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', state.lang);

  const foodItems = getFilteredFood();
  const drinkItemsFiltered = getFilteredDrinks();

  const app = el('#app');
  app.innerHTML = `
  <!-- HEADER -->
  <header class="header" id="header">
    <div class="header-logo">
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="#2D4A1E"/>
        <path d="M18 6 C10 12, 8 20, 14 26 C16 28, 20 28, 22 26 C28 20, 26 12, 18 6Z" fill="#C9A84C" opacity="0.9"/>
        <ellipse cx="18" cy="22" rx="5" ry="3" fill="#1B3A12"/>
        <path d="M14 20 Q18 16 22 20" stroke="#C9A84C" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <circle cx="18" cy="13" r="2" fill="#F5EDD8"/>
        <path d="M11 18 Q9 22 11 25" stroke="#C9A84C" stroke-width="1" fill="none" stroke-linecap="round"/>
        <path d="M25 18 Q27 22 25 25" stroke="#C9A84C" stroke-width="1" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="wordmark">
        Fancy Aroma
        <span>Smart Digital Menu</span>
      </div>
    </div>
    <div class="header-controls">
      <!-- Language Dropdown -->
      <div class="ctrl-dropdown">
        <button class="ctrl-btn lang-btn" id="lang-btn" aria-haspopup="listbox" aria-expanded="${state.langDropOpen}">
          ${languages.find(l=>l.code===state.lang)?.flag} ${languages.find(l=>l.code===state.lang)?.label}
          <span class="arrow">▾</span>
        </button>
        <div class="dropdown-menu lang-menu${state.langDropOpen ? ' open' : ''}" role="listbox" id="lang-menu">
          ${languages.map(l => `
            <div class="dropdown-item${l.code===state.lang?' active':''}" data-lang="${l.code}" role="option">
              <span class="flag">${l.flag}</span> ${l.full}
            </div>`).join('')}
        </div>
      </div>
      <!-- Currency Dropdown -->
      <div class="ctrl-dropdown">
        <button class="ctrl-btn cur-btn" id="cur-btn" aria-haspopup="listbox" aria-expanded="${state.curDropOpen}">
          ${state.currency.code} ${state.currency.symbol}
          <span class="arrow">▾</span>
        </button>
        <div class="dropdown-menu cur-menu${state.curDropOpen ? ' open' : ''}" role="listbox" id="cur-menu">
          ${currencies.map(c => `
            <div class="dropdown-item${c.code===state.currency.code?' active':''}" data-cur="${c.code}" role="option">
              ${c.symbol} ${c.code}
            </div>`).join('')}
        </div>
      </div>
      <!-- Mobile Settings -->
      <button class="ctrl-btn settings-btn" id="settings-btn">${t('settings')}</button>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero" id="hero" aria-label="Hero">
    <div class="hero-bg" id="hero-bg"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-tag">${t('tagline')}</div>
      <h1>${t('hero_title')}</h1>
      <p>${t('hero_sub')}</p>
      <a href="#menu" class="hero-cta">${t('hero_cta')}</a>
    </div>
  </section>

  <!-- MENU SECTION -->
  <section class="menu-section" id="menu">
    <div class="section-wrapper">
      <div class="section-header">
        <p class="section-label">Fancy Aroma</p>
        <h2 class="section-title">${t('menu_title')}</h2>
        <div class="section-divider"></div>
      </div>

      <!-- Search -->
      <div class="search-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search" class="search-input" id="search-input"
          placeholder="${t('search_placeholder')}"
          value="${state.search}"
          aria-label="${t('search_placeholder')}"
        />
      </div>

      <!-- Category Tabs -->
      <nav class="cat-tabs" id="cat-tabs" aria-label="Menu categories">
        ${renderCategoryTabs()}
      </nav>

      <!-- Grid + QR Sidebar -->
      <div class="layout-with-qr">
        <div>
          <div class="food-grid" id="food-grid">
            ${foodItems.length > 0
              ? foodItems.map(renderFoodCard).join('')
              : `<div class="empty-state">
                  <div class="icon">🍽️</div>
                  <h3>${t('no_results')}</h3>
                  <p>${t('no_results_sub')}</p>
                </div>`
            }
          </div>
        </div>
        ${renderQRPanel()}
      </div>
    </div>
  </section>

  <!-- DRINKS SECTION -->
  <section class="drinks-section" id="drinks">
    <div class="section-wrapper">
      <div class="drinks-divider">
        <span class="drinks-divider-text">☕ ${t('drinks_label')} ☕</span>
      </div>
      <nav class="sub-tabs" id="sub-tabs" aria-label="Drink subcategories">
        ${renderDrinkSubTabs()}
      </nav>
      <div class="food-grid" id="drinks-grid">
        ${drinkItemsFiltered.length > 0
          ? drinkItemsFiltered.map(renderFoodCard).join('')
          : `<div class="empty-state">
              <div class="icon">🍵</div>
              <h3>${t('no_results')}</h3>
              <p>${t('no_results_sub')}</p>
            </div>`
        }
      </div>
      <p class="rates-note">${t('rates_note')}</p>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="wordmark">Fancy Aroma</div>
    <div style="font-family:var(--font-display);color:var(--accent);font-size:1rem;margin-bottom:8px">ፋንሲ አሮማ</div>
    <div class="footer-divider"></div>
    <p>Debre Berhan, Ethiopia · Smart Digital Menu System</p>
    <p style="margin-top:8px;font-size:0.75rem;opacity:0.4">© 2026 Fancy Aroma. All rights reserved.</p>
  </footer>

  <!-- QR FAB (Mobile) -->
  <button class="qr-fab" id="qr-fab" aria-label="View QR Code">📷</button>

  <!-- QR Bottom Sheet -->
  <div class="qr-sheet${state.qrSheetOpen ? ' open' : ''}" id="qr-sheet">
    <div class="qr-sheet-backdrop" id="qr-backdrop"></div>
    <div class="qr-sheet-content">
      <div class="sheet-handle"></div>
      ${renderQRPanel(true)}
    </div>
  </div>

  <!-- SETTINGS MODAL (Mobile) -->
  <div class="settings-modal${state.settingsOpen ? ' open' : ''}" id="settings-modal">
    <div class="settings-backdrop" id="settings-backdrop"></div>
    <div class="settings-content" role="dialog" aria-modal="true" aria-label="${t('settings')}">
      <button class="settings-close" id="settings-close">✕</button>
      <h2 class="settings-title">${t('settings')}</h2>
      <p class="settings-group-label">${t('language')}</p>
      <div class="settings-options">
        ${languages.map(l => `
          <button class="settings-option${l.code===state.lang?' active':''}" data-lang="${l.code}">
            ${l.flag} ${l.full}
          </button>`).join('')}
      </div>
      <p class="settings-group-label">${t('currency')}</p>
      <div class="settings-options">
        ${currencies.map(c => `
          <button class="settings-option${c.code===state.currency.code?' active':''}" data-cur="${c.code}">
            ${c.symbol} ${c.code}
          </button>`).join('')}
      </div>
    </div>
  </div>

  <!-- BOTTOM NAV (Mobile) -->
  <nav class="bottom-nav" id="bottom-nav" aria-label="Main navigation">
    <div class="bottom-nav-inner">
      <a class="nav-item active" href="#hero" aria-label="Home">
        <span class="nav-icon">🏠</span><span>Home</span>
      </a>
      <a class="nav-item" href="#menu" aria-label="Menu">
        <span class="nav-icon">🍽️</span><span>Menu</span>
      </a>
      <a class="nav-item" href="#drinks" aria-label="Drinks">
        <span class="nav-icon">☕</span><span>Drinks</span>
      </a>
      <button class="nav-item" id="nav-qr" aria-label="QR Code">
        <span class="nav-icon">📷</span><span>QR Code</span>
      </button>
      <button class="nav-item" id="nav-settings" aria-label="Settings">
        <span class="nav-icon">⚙️</span><span>Settings</span>
      </button>
    </div>
  </nav>
  `;

  // Animate hero bg
  setTimeout(() => el('#hero-bg')?.classList.add('loaded'), 50);

  attachEvents();
}

// ============================================================
// EVENT BINDING
// ============================================================
function attachEvents() {
  // ---- Language dropdown ----
  el('#lang-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.langDropOpen = !state.langDropOpen;
    state.curDropOpen = false;
    el('.lang-btn').classList.toggle('open', state.langDropOpen);
    el('.cur-btn')?.classList.remove('open');
    el('.lang-menu').classList.toggle('open', state.langDropOpen);
    el('.cur-menu')?.classList.remove('open');
  });

  els('.lang-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      state.lang = item.dataset.lang;
      closeAllDropdowns();
      render();
    });
  });

  // ---- Currency dropdown ----
  el('#cur-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.curDropOpen = !state.curDropOpen;
    state.langDropOpen = false;
    el('.cur-btn').classList.toggle('open', state.curDropOpen);
    el('.lang-btn')?.classList.remove('open');
    el('.cur-menu').classList.toggle('open', state.curDropOpen);
    el('.lang-menu')?.classList.remove('open');
  });

  els('.cur-menu .dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      state.currency = currencies.find(c => c.code === item.dataset.cur);
      closeAllDropdowns();
      animatePrices();
    });
  });

  // ---- Click outside to close dropdowns ----
  document.addEventListener('click', () => closeAllDropdowns(), { once: false });

  // ---- Search ----
  el('#search-input')?.addEventListener('input', (e) => {
    state.search = e.target.value;
    updateGrids();
  });

  // ---- Category tabs ----
  el('#cat-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;
    state.activeCategory = btn.dataset.cat;
    els('.cat-tab').forEach(t => t.classList.toggle('active', t.dataset.cat === state.activeCategory));
    updateFoodGrid();
  });

  // ---- Drink sub tags ----
  el('#sub-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.sub-tab');
    if (!btn) return;
    state.activeDrinkSub = btn.dataset.sub;
    els('.sub-tab').forEach(t => t.classList.toggle('active', t.dataset.sub === state.activeDrinkSub));
    updateDrinksGrid();
  });

  // ---- Add buttons ----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    btn.classList.remove('pulse');
    void btn.offsetWidth;
    btn.classList.add('pulse');
    btn.addEventListener('animationend', () => btn.classList.remove('pulse'), { once: true });
  });

  // ---- QR FAB ----
  el('#qr-fab')?.addEventListener('click', () => { state.qrSheetOpen = true; render(); });
  el('#nav-qr')?.addEventListener('click', () => { state.qrSheetOpen = true; render(); });
  el('#qr-backdrop')?.addEventListener('click', () => { state.qrSheetOpen = false; render(); });

  // ---- Settings ----
  el('#settings-btn')?.addEventListener('click', () => { state.settingsOpen = true; render(); });
  el('#nav-settings')?.addEventListener('click', () => { state.settingsOpen = true; render(); });
  el('#settings-backdrop')?.addEventListener('click', () => { state.settingsOpen = false; render(); });
  el('#settings-close')?.addEventListener('click', () => { state.settingsOpen = false; render(); });

  // ---- Settings options (lang) ----
  els('.settings-modal .settings-option[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.lang = btn.dataset.lang;
      state.settingsOpen = false;
      render();
    });
  });

  // ---- Settings options (cur) ----
  els('.settings-modal .settings-option[data-cur]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currency = currencies.find(c => c.code === btn.dataset.cur);
      state.settingsOpen = false;
      animatePrices();
    });
  });

  // ---- Keyboard: close modals with Escape ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.qrSheetOpen) { state.qrSheetOpen = false; render(); }
      if (state.settingsOpen) { state.settingsOpen = false; render(); }
    }
  });
}

// ============================================================
// PARTIAL UPDATE (avoid full re-render for search/tabs)
// ============================================================
function updateFoodGrid() {
  const grid = el('#food-grid');
  if (!grid) return;
  const items = getFilteredFood();
  grid.innerHTML = items.length > 0
    ? items.map(renderFoodCard).join('')
    : `<div class="empty-state"><div class="icon">🍽️</div><h3>${t('no_results')}</h3><p>${t('no_results_sub')}</p></div>`;
}

function updateDrinksGrid() {
  const grid = el('#drinks-grid');
  if (!grid) return;
  const items = getFilteredDrinks();
  grid.innerHTML = items.length > 0
    ? items.map(renderFoodCard).join('')
    : `<div class="empty-state"><div class="icon">🍵</div><h3>${t('no_results')}</h3><p>${t('no_results_sub')}</p></div>`;
}

function updateGrids() {
  updateFoodGrid();
  updateDrinksGrid();
}

function animatePrices() {
  // Update all price badges with flip animation
  els('.price-badge').forEach(badge => {
    const etb = parseFloat(badge.dataset.etb);
    badge.classList.add('price-flip');
    badge.addEventListener('animationend', () => {
      badge.textContent = formatPrice(etb);
      badge.classList.remove('price-flip');
    }, { once: true });
  });
  // Also update the currency button label
  const curBtn = el('.cur-btn');
  if (curBtn) {
    curBtn.childNodes[0].textContent = `${state.currency.code} ${state.currency.symbol} `;
  }
}

// ============================================================
// BOOT
// ============================================================
render();
