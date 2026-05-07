"use client";

import { useMemo, useState } from "react";

const { categories, currencies, drinkItems, drinkSubCats, i18n, languages, menuItems } = require("../data/menu.js");

function getText(value: any, lang: string) {
  if (typeof value === "string") {
    return value;
  }

  return value?.[lang] || value?.en || "";
}

function formatPrice(price: number, currency: any) {
  const converted = (price * currency.rate).toFixed(currency.code === "ETB" ? 0 : 2);
  return currency.format(converted);
}

function MenuCard({ item, currency, lang }: { item: any; currency: any; lang: string }) {
  return (
    <article className="food-card" aria-label={getText(item.name, lang)}>
      <div className="card-img">
        <img src={item.image} alt={getText(item.name, lang)} loading="lazy" />
      </div>
      <div className="card-body">
        <h3 className="card-name">{getText(item.name, lang)}</h3>
        <div className="card-footer">
          <span className="price-inline">{formatPrice(item.price, currency)}</span>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </div>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const [currencyCode, setCurrencyCode] = useState("ETB");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDrinkSub, setActiveDrinkSub] = useState("Hot Drinks");

  const copy = i18n[lang] || i18n.en;
  const currency = currencies.find((entry: any) => entry.code === currencyCode) || currencies[0];
  const langMeta = languages.find((entry: any) => entry.code === lang) || languages[0];
  const query = search.toLowerCase().trim();

  const filteredFood = useMemo(() => {
    return menuItems.filter((item: any) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const haystack = `${getText(item.name, lang)} ${getText(item.desc, lang)}`.toLowerCase();
      const matchSearch = !query || haystack.includes(query);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, lang, query]);

  const filteredDrinks = useMemo(() => {
    return drinkItems.filter((item: any) => {
      const matchSubCategory = item.subCategory === activeDrinkSub;
      const haystack = `${getText(item.name, lang)} ${getText(item.desc, lang)}`.toLowerCase();
      const matchSearch = !query || haystack.includes(query);
      return matchSubCategory && matchSearch;
    });
  }, [activeDrinkSub, lang, query]);

  return (
    <main dir={langMeta.dir} className="app-shell">
      <section className="hero">
        <div className="hero-bg loaded" />
        <div className="hero-overlay" />
        <div className="hero-topbar">
          <button className="hero-icon" type="button" aria-label="Close">
            {"\u00d7"}
          </button>
          <div className="hero-appname">royalhotelmenu.vercel.app</div>
          <button className="hero-icon" type="button" aria-label="Screen">
            {"\u25a1"}
          </button>
        </div>
        <div className="hero-content hero-content-left">
          <div className="hero-brandbar">
            <div className="hero-brandrow hero-brandrow-centered">
              <img className="hero-logo" src="/Aroma logo.png" alt="Aroma Restaurant logo" />
              <span className="hero-brand">Aroma Restaurant</span>
            </div>
            <select className="hero-lang" value={lang} onChange={(event) => setLang(event.target.value)}>
              {languages.map((option: any) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="hero-copy">
            <h1 className="hero-title">Your Table, Your Taste</h1>
          </div>
        </div>
      </section>

      <section className="menu-panel">
        <div className="section-wrapper mobile-wrapper">
          <div className="search-wrap search-wrap-panel">
            <span className="search-icon" aria-hidden="true">
              {"\u2315"}
            </span>
            <input
              className="search-input panel-search-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.search_placeholder}
              aria-label={copy.search_placeholder}
            />
            <button className="panel-grid-btn" type="button" aria-label="Grid view">
              {"\u22ee"}
            </button>
          </div>

          <div className="panel-header">
            <h2 className="panel-title">Menu</h2>
            <select
              className="panel-currency"
              value={currencyCode}
              onChange={(event) => setCurrencyCode(event.target.value)}
              aria-label="Currency"
            >
              {currencies.map((option: any) => (
                <option key={option.code} value={option.code}>
                  {option.code}
                </option>
              ))}
            </select>
          </div>

          <nav className="cat-tabs panel-tabs" aria-label="Menu categories">
            {categories.map((category: string) => (
              <button
                key={category}
                className={`cat-tab${activeCategory === category ? " active" : ""}`}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>

          <div className="menu-group">
            <div className="group-heading">
              <h3>APPETIZERS / STARTERS</h3>
            </div>
            <div className="food-grid">
              {filteredFood.length ? (
                filteredFood.map((item: any) => <MenuCard key={item.id} item={item} currency={currency} lang={lang} />)
              ) : (
                <EmptyState icon="Food" title={copy.no_results} subtitle={copy.no_results_sub} />
              )}
            </div>
          </div>

          <div className="menu-group drinks-group">
            <div className="group-heading">
              <h3>{copy.drinks_label}</h3>
            </div>
            <nav className="sub-tabs panel-subtabs" aria-label="Drink subcategories">
              {drinkSubCats.map((subCategory: string) => (
                <button
                  key={subCategory}
                  className={`sub-tab${activeDrinkSub === subCategory ? " active" : ""}`}
                  type="button"
                  onClick={() => setActiveDrinkSub(subCategory)}
                >
                  {subCategory}
                </button>
              ))}
            </nav>
            <div className="food-grid">
              {filteredDrinks.length ? (
                filteredDrinks.map((item: any) => <MenuCard key={item.id} item={item} currency={currency} lang={lang} />)
              ) : (
                <EmptyState icon="Drink" title={copy.no_results} subtitle={copy.no_results_sub} />
              )}
            </div>
          </div>

          <p className="rates-note">{copy.rates_note}</p>
        </div>
      </section>
    </main>
  );
}
