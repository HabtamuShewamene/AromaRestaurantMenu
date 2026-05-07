"use client";

import { useMemo, useState } from "react";
import { categories, currencies, drinkItems, drinkSubCats, i18n, languages, menuItems } from "../data/menu.js";

// @ts-ignore
function getText(value: any, lang: string) {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.en || "";
}

// @ts-ignore
function formatPrice(price: number, currency: any) {
  const converted = (price * currency.rate).toFixed(currency.code === "ETB" ? 0 : 2);
  return currency.format(converted);
}

function renderBadgeIcon(badge: string) {
  switch (badge) {
    case "popular": return "🔥 Popular";
    case "new": return "✨ New";
    case "special": return "⭐ Chef's Special";
    default: return "";
  }
}

// @ts-ignore
function MenuCard({ item, currency, lang, onClick }: any) {
  return (
    <article
      className="food-card"
      tabIndex={0}
      role="button"
      aria-label={getText(item.name, lang)}
      onClick={() => onClick(item)}
      onKeyDown={(e) => e.key === "Enter" && onClick(item)}
    >
      <div className="card-img">
        <img src={item.image || item.img} alt={getText(item.name, lang)} loading="lazy" />
        {item.badge && <div className={`card-badge ${item.badge}`}>{renderBadgeIcon(item.badge)}</div>}
      </div>
      <div className="card-body">
        <h3 className="card-name">{getText(item.name, lang)}</h3>
        <p className="card-desc" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          {getText(item.desc, lang)}
        </p>
        <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="price-badge">{formatPrice(item.price, currency)}</span>
          <button className="add-btn" aria-label="Add to Order" title="Add to Order" onClick={(e) => { e.stopPropagation(); /* pulse logic omitted */ }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

// @ts-ignore
function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="empty-state">
      <div className="icon" style={{ fontSize: '3rem', marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-muted)' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', opacity: 0.7 }}>{subtitle}</p>
    </div>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const [currencyCode, setCurrencyCode] = useState("ETB");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDrinkSub, setActiveDrinkSub] = useState("Hot Drinks");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Dropdowns
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [curDropOpen, setCurDropOpen] = useState(false);

  // Modals
  const [qrSheetOpen, setQrSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // @ts-ignore
  const copy = i18n[lang] || i18n.en;
  // @ts-ignore
  const currency = currencies.find((entry) => entry.code === currencyCode) || currencies[0];
  // @ts-ignore
  const langMeta = languages.find((entry) => entry.code === lang) || languages[0];
  const query = search.toLowerCase().trim();

  const filteredFood = useMemo(() => {
    // @ts-ignore
    return menuItems.filter((item) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const haystack = `${getText(item.name, lang)} ${getText(item.desc, lang)}`.toLowerCase();
      const matchSearch = !query || haystack.includes(query);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, lang, query]);

  const filteredDrinks = useMemo(() => {
    // @ts-ignore
    return drinkItems.filter((item) => {
      const matchSubCategory = item.subCategory === activeDrinkSub;
      const haystack = `${getText(item.name, lang)} ${getText(item.desc, lang)}`.toLowerCase();
      const matchSearch = !query || haystack.includes(query);
      return matchSubCategory && matchSearch;
    });
  }, [activeDrinkSub, lang, query]);

  return (
    <div dir={langMeta.dir} onClick={() => { setLangDropOpen(false); setCurDropOpen(false); }}>
      {/* HEADER */}
      <header className="header">
        <div className="header-logo">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width: 36, height: 36}}>
            <circle cx="18" cy="18" r="18" fill="#2D4A1E" />
            <path d="M18 6 C10 12, 8 20, 14 26 C16 28, 20 28, 22 26 C28 20, 26 12, 18 6Z" fill="#C9A84C" opacity="0.9" />
            <ellipse cx="18" cy="22" rx="5" ry="3" fill="#1B3A12" />
            <path d="M14 20 Q18 16 22 20" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <circle cx="18" cy="13" r="2" fill="#F5EDD8" />
          </svg>
          <div className="wordmark">
            Aroma Restaurant
            <span>Smart Digital Menu</span>
          </div>
        </div>
        <div className="header-controls">
          <div className="ctrl-dropdown">
            <button className="ctrl-btn" onClick={(e) => { e.stopPropagation(); setLangDropOpen(!langDropOpen); setCurDropOpen(false); }}>
              {langMeta.flag} {langMeta.label} <span className="arrow" style={{ transform: langDropOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>
            <div className={`dropdown-menu ${langDropOpen ? 'open' : ''}`}>
              {languages.map((l: any) => (
                <div key={l.code} className={`dropdown-item ${l.code === lang ? 'active' : ''}`} onClick={() => setLang(l.code)}>
                  <span className="flag">{l.flag}</span> {l.full}
                </div>
              ))}
            </div>
          </div>
          <div className="ctrl-dropdown">
            <button className="ctrl-btn" onClick={(e) => { e.stopPropagation(); setCurDropOpen(!curDropOpen); setLangDropOpen(false); }}>
              {currency.code} {currency.symbol} <span className="arrow" style={{ transform: curDropOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>
            <div className={`dropdown-menu ${curDropOpen ? 'open' : ''}`}>
              {currencies.map((c: any) => (
                <div key={c.code} className={`dropdown-item ${c.code === currencyCode ? 'active' : ''}`} onClick={() => setCurrencyCode(c.code)}>
                  {c.symbol} {c.code}
                </div>
              ))}
            </div>
          </div>
          <button className="settings-btn ctrl-btn" onClick={() => setSettingsOpen(true)}>{copy.settings}</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg loaded" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-tag">{copy.tagline}</div>
          <h1>{copy.hero_title}</h1>
          <p>{copy.hero_sub}</p>
          <a href="#menu" className="hero-cta">{copy.hero_cta}</a>
        </div>
      </section>

      {/* MENU SECTION */}
      <section className="menu-section" id="menu">
        <div className="section-wrapper">
          <div className="section-header">
            <p className="section-label">Aroma Restaurant</p>
            <h2 className="section-title">{copy.menu_title}</h2>
            <div className="section-divider"></div>
          </div>

          <div className="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="search-input"
              placeholder={copy.search_placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <nav className="cat-tabs">
            {categories.map((cat: string) => (
              <button key={cat} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                {cat}
              </button>
            ))}
          </nav>

          <div className="layout-with-qr">
            <div>
              <div className="food-grid">
                {filteredFood.length > 0 ? (
                  filteredFood.map((item: any) => (
                    <MenuCard key={item.id} item={item} currency={currency} lang={lang} onClick={setSelectedItem} />
                  ))
                ) : (
                  <EmptyState icon="🍽️" title={copy.no_results} subtitle={copy.no_results_sub} />
                )}
              </div>
            </div>
            {/* Desktop QR Panel */}
            <div className="qr-panel">
              <p className="qr-panel-title">{copy.qr_title}</p>
              <p className="qr-panel-subtitle">{copy.qr_sub}</p>
              <div className="qr-code-wrap">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#2D4A1E" /><rect x="10" y="10" width="20" height="20" rx="2" fill="white" /><rect x="14" y="14" width="12" height="12" rx="1" fill="#2D4A1E" />
                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#2D4A1E" /><rect x="70" y="10" width="20" height="20" rx="2" fill="white" /><rect x="74" y="14" width="12" height="12" rx="1" fill="#2D4A1E" />
                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#2D4A1E" /><rect x="10" y="70" width="20" height="20" rx="2" fill="white" /><rect x="14" y="74" width="12" height="12" rx="1" fill="#2D4A1E" />
                  <rect x="40" y="5" width="5" height="5" fill="#C9A84C" /><rect x="48" y="5" width="5" height="5" fill="#2D4A1E" /><rect x="56" y="5" width="5" height="5" fill="#C9A84C" />
                  <rect x="40" y="13" width="5" height="5" fill="#2D4A1E" /><rect x="48" y="13" width="5" height="5" fill="#C9A84C" /><rect x="56" y="13" width="5" height="5" fill="#2D4A1E" />
                  <rect x="40" y="21" width="5" height="5" fill="#C9A84C" /><rect x="48" y="21" width="5" height="5" fill="#2D4A1E" /><rect x="56" y="21" width="5" height="5" fill="#C9A84C" />
                  <rect x="5" y="40" width="5" height="5" fill="#2D4A1E" /><rect x="13" y="40" width="5" height="5" fill="#C9A84C" /><rect x="21" y="40" width="5" height="5" fill="#2D4A1E" /><rect x="29" y="40" width="5" height="5" fill="#C9A84C" />
                  <rect x="40" y="40" width="5" height="5" fill="#2D4A1E" /><rect x="48" y="40" width="5" height="5" fill="#C9A84C" /><rect x="56" y="40" width="5" height="5" fill="#2D4A1E" /><rect x="64" y="40" width="5" height="5" fill="#C9A84C" />
                  <rect x="72" y="40" width="5" height="5" fill="#2D4A1E" /><rect x="80" y="40" width="5" height="5" fill="#C9A84C" /><rect x="88" y="40" width="5" height="5" fill="#2D4A1E" />
                  <rect x="5" y="48" width="5" height="5" fill="#C9A84C" /><rect x="13" y="48" width="5" height="5" fill="#2D4A1E" /><rect x="21" y="56" width="5" height="5" fill="#C9A84C" /><rect x="29" y="56" width="5" height="5" fill="#2D4A1E" />
                  <rect x="40" y="48" width="5" height="5" fill="#2D4A1E" /><rect x="48" y="56" width="5" height="5" fill="#C9A84C" /><rect x="56" y="48" width="5" height="5" fill="#2D4A1E" /><rect x="64" y="56" width="5" height="5" fill="#C9A84C" />
                  <rect x="72" y="48" width="5" height="5" fill="#2D4A1E" /><rect x="80" y="56" width="5" height="5" fill="#C9A84C" /><rect x="88" y="48" width="5" height="5" fill="#2D4A1E" />
                  <rect x="40" y="64" width="5" height="5" fill="#C9A84C" /><rect x="48" y="72" width="5" height="5" fill="#2D4A1E" /><rect x="56" y="64" width="5" height="5" fill="#C9A84C" />
                  <rect x="64" y="72" width="5" height="5" fill="#2D4A1E" /><rect x="72" y="64" width="5" height="5" fill="#C9A84C" /><rect x="80" y="72" width="5" height="5" fill="#2D4A1E" /><rect x="88" y="64" width="5" height="5" fill="#C9A84C" />
                  <rect x="40" y="80" width="5" height="5" fill="#2D4A1E" /><rect x="48" y="88" width="5" height="5" fill="#C9A84C" /><rect x="56" y="80" width="5" height="5" fill="#2D4A1E" />
                  <rect x="64" y="88" width="5" height="5" fill="#C9A84C" /><rect x="72" y="80" width="5" height="5" fill="#2D4A1E" /><rect x="80" y="88" width="5" height="5" fill="#C9A84C" /><rect x="88" y="80" width="5" height="5" fill="#2D4A1E" />
                </svg>
              </div>
              <div className="qr-table-label">Table 7</div>
              <p className="qr-note">{copy.qr_note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* DRINKS SECTION */}
      <section className="drinks-section" id="drinks">
        <div className="section-wrapper">
          <div className="drinks-divider">
            <span className="drinks-divider-text">☕ {copy.drinks_label} ☕</span>
          </div>
          <nav className="sub-tabs">
            {drinkSubCats.map((sub: string) => (
              <button key={sub} className={`sub-tab ${activeDrinkSub === sub ? 'active' : ''}`} onClick={() => setActiveDrinkSub(sub)}>
                {sub}
              </button>
            ))}
          </nav>
          <div className="food-grid">
            {filteredDrinks.length > 0 ? (
              filteredDrinks.map((item: any) => (
                <MenuCard key={item.id} item={item} currency={currency} lang={lang} onClick={setSelectedItem} />
              ))
            ) : (
              <EmptyState icon="🍵" title={copy.no_results} subtitle={copy.no_results_sub} />
            )}
          </div>
          <p className="rates-note">{copy.rates_note}</p>
        </div>
      </section>

      <footer className="footer">
        <div className="wordmark">Fancy Aroma</div>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontSize: '1rem', marginBottom: 8 }}>ፋንሲ አሮማ</div>
        <div className="footer-divider"></div>
        <p>Debre Berhan, Ethiopia · Smart Digital Menu System</p>
        <p style={{ marginTop: 8, fontSize: '0.75rem', opacity: 0.4 }}>© 2026 Aroma Restaurant. All rights reserved.</p>
      </footer>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 1, backdropFilter: 'blur(4px)' }} onClick={() => setSelectedItem(null)}></div>
          <div style={{ position: 'relative', background: 'var(--white)', width: '100%', maxWidth: 680, maxHeight: '90vh', borderRadius: 24, overflowY: 'auto' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
              <img src={selectedItem.image || selectedItem.img} alt={getText(selectedItem.name, lang)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setSelectedItem(null)} style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', fontSize: '1rem', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{getText(selectedItem.name, lang)}</h2>
              <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                <span>📁 {selectedItem.category || selectedItem.subCategory}</span>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.65, marginBottom: 20 }}>{getText(selectedItem.desc, lang)}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--secondary-alt)' }}>
                <div style={{ fontFamily: 'var(--font-price)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {formatPrice(selectedItem.price, currency)}
                  <small style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)', display: 'block' }}>{currency.code} · per serving</small>
                </div>
                <button style={{ background: 'var(--primary)', color: '#fff', padding: '10px 24px', borderRadius: 999, fontFamily: 'var(--font-price)', fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ Add to Order</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Bottom Sheet (Mobile) */}
      <button className="qr-fab" onClick={() => setQrSheetOpen(true)}>📷</button>
      <div className={`qr-sheet ${qrSheetOpen ? 'open' : ''}`}>
        <div className="qr-sheet-backdrop" onClick={() => setQrSheetOpen(false)}></div>
        <div className="qr-sheet-content">
          <div className="sheet-handle"></div>
          <div className="qr-panel" style={{ display: 'block', border: 'none', background: 'transparent', boxShadow: 'none' }}>
            <p className="qr-panel-title">{copy.qr_title}</p>
            <p className="qr-panel-subtitle">{copy.qr_sub}</p>
            <div className="qr-code-wrap">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#2D4A1E" /><rect x="10" y="10" width="20" height="20" rx="2" fill="white" /><rect x="14" y="14" width="12" height="12" rx="1" fill="#2D4A1E" />
                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#2D4A1E" /><rect x="70" y="10" width="20" height="20" rx="2" fill="white" /><rect x="74" y="14" width="12" height="12" rx="1" fill="#2D4A1E" />
                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#2D4A1E" /><rect x="10" y="70" width="20" height="20" rx="2" fill="white" /><rect x="14" y="74" width="12" height="12" rx="1" fill="#2D4A1E" />
              </svg>
            </div>
            <p className="qr-note">{copy.qr_note}</p>
          </div>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      <div className={`settings-modal ${settingsOpen ? 'open' : ''}`}>
        <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}></div>
        <div className="settings-content">
          <button className="settings-close" onClick={() => setSettingsOpen(false)}>✕</button>
          <h2 className="settings-title">{copy.settings}</h2>
          <p className="settings-group-label">{copy.language}</p>
          <div className="settings-options">
            {languages.map((l: any) => (
              <button key={l.code} className={`settings-option ${l.code === lang ? 'active' : ''}`} onClick={() => setLang(l.code)}>{l.flag} {l.full}</button>
            ))}
          </div>
          <p className="settings-group-label">{copy.currency}</p>
          <div className="settings-options">
            {currencies.map((c: any) => (
              <button key={c.code} className={`settings-option ${c.code === currencyCode ? 'active' : ''}`} onClick={() => setCurrencyCode(c.code)}>{c.symbol} {c.code}</button>
            ))}
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          <a className="nav-item active" href="#hero"><span className="nav-icon">🏠</span><br/>Home</a>
          <a className="nav-item" href="#menu"><span className="nav-icon">🍽️</span><br/>Menu</a>
          <a className="nav-item" href="#drinks"><span className="nav-icon">☕</span><br/>Drinks</a>
          <button className="nav-item" onClick={() => setQrSheetOpen(true)}><span className="nav-icon">📷</span><br/>QR Code</button>
          <button className="nav-item" onClick={() => setSettingsOpen(true)}><span className="nav-icon">⚙️</span><br/>Settings</button>
        </div>
      </nav>
    </div>
  );
}
