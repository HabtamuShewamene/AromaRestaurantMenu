export const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Specials'];
export const drinkSubCats = ['Hot Drinks', 'Cold Drinks', 'Fresh Juices', 'Smoothies', 'Soft Drinks', 'Alcohol'];

export const menuItems = [];
export const drinkItems = [];

export const languages = [];
export const currencies = [];

export const i18n = {
  en: {
    tagline: 'Est. in Debre Berhan, Ethiopia',
    hero_title: 'Fancy Aroma Smart Digital Menu',
    hero_sub: 'Experience the Real Taste of Ethiopia',
    hero_cta: 'Explore Our Menu ↓',
    search_placeholder: 'Search food or drink...',
    menu_title: 'Our Menu',
    drinks_label: 'Drinks & Beverages',
    qr_title: 'Fancy Aroma',
    qr_title_am: 'ፋንሲ አሮማ',
    qr_sub: 'Scan to view this menu on your phone',
    qr_note: 'No app required · Works on any device',
    rates_note: 'Exchange rates updated: May 2026',
    settings: '⚙ Settings',
    language: 'Language',
    currency: 'Currency',
    add: 'Add to Order',
    no_results: 'No items found',
    no_results_sub: 'Try a different search term or category',
  },
  am: {
    tagline: 'በደብረ ብርሃን፣ ኢትዮጵያ',
    hero_title: 'ፋንሲ አሮማ ዲጂታል ሜኑ',
    hero_sub: 'የኢትዮጵያን ትክክለኛ ጣዕም ይፈልጉ',
    hero_cta: 'ምናሌውን ይፈልጉ ↓',
    search_placeholder: 'ምግብ ወይም መጠጥ ፈልጉ...',
    menu_title: 'ምናሌአችን',
    drinks_label: 'መጠጦች',
    qr_title: 'ፋንሲ አሮማ',
    qr_title_am: 'Fancy Aroma',
    qr_sub: 'ምናሌውን በስልክዎ ላይ ለማየት ቁጥጥር',
    qr_note: 'ምንም መተግበሪያ አያስፈልግም · በማንኛውም ሃ',
    rates_note: 'ምንዛሬ ዋጋ ተሰምሯል: ሜይ 2026',
    settings: '⚙ ቅንብሮች',
    language: 'ቋንቋ',
    currency: 'ምንዛሬ',
    add: 'ወደ ትዕዛዝ ጨምር',
    no_results: 'ምንም አልተገኘም',
    no_results_sub: 'ሌላ ቃል ወይም ምድብ ሞክሩ',
  },
};

['om', 'ti', 'ar', 'fr', 'zh'].forEach((code) => {
  i18n[code] = i18n.en;
});
