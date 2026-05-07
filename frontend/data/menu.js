// data/menu.js
// Static menu data for Fancy Aroma

export const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Drinks', 'Specials'];
export const drinkSubCats = ['Hot Drinks', 'Cold Drinks', 'Fresh Juices', 'Smoothies', 'Soft Drinks', 'Alcohol'];

export const menuItems = [
  // === FOOD ===
  {
    id: 1, category: 'Breakfast',
    name: { en: 'Chechebsa', am: 'ጨቸብሳ' },
    desc: { en: 'Torn flatbread tossed with spiced butter, berbere & honey', am: 'በቅቤ፣ በርበሬ እና ማር የታጠበ ቆሎ' },
    price: 120, badge: 'popular', badgeIcon: '🔥',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    available: true,
  },
  {
    id: 2, category: 'Breakfast',
    name: { en: 'Firfir', am: 'ፍርፍር' },
    desc: { en: 'Shredded injera simmered in rich tomato, chili & niter kibbeh sauce', am: 'የፈረሰ ኢንጀራ ከቲማቲም እና ቅቤ ጋር' },
    price: 95, badge: 'popular', badgeIcon: '🔥',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
    available: true,
  },
  {
    id: 3, category: 'Dinner',
    name: { en: 'Doro Wat', am: 'ዶሮ ወጥ' },
    desc: { en: 'Slow-cooked whole chicken in bold berbere stew with boiled egg', am: 'ዶሮ ወጥ ከኮክተል እንቁላል ጋር' },
    price: 280, badge: 'special', badgeIcon: '⭐',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    available: true,
  },
  {
    id: 4, category: 'Dinner',
    name: { en: 'Tibs', am: 'ጥብስ' },
    desc: { en: 'Sautéed beef cubes with rosemary, jalapeño, onion & tomato', am: 'የተቀቀለ ቤፍ ከቃሪያ እና ቲማቲም ጋር' },
    price: 260, badge: 'popular', badgeIcon: '🔥',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    available: true,
  },
  {
    id: 5, category: 'Lunch',
    name: { en: 'Shiro Wat', am: 'ሽሮ ወጥ' },
    desc: { en: 'Creamy ground chickpea stew blended with Ethiopian spices & niter kibbeh', am: 'ሽሮ ከቅቤ እና ቅመም ጋር' },
    price: 85, badge: null,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    available: true,
  },
  {
    id: 6, category: 'Lunch',
    name: { en: 'Misir Alicha', am: 'ምስር አልጫ' },
    desc: { en: 'Yellow lentil stew spiced with turmeric, garlic and onion — mild & comforting', am: 'ቢጫ ምስር ከቱርሜሪክ ጋር' },
    price: 75, badge: 'new', badgeIcon: '✨',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    available: true,
  },
  {
    id: 7, category: 'Specials',
    name: { en: 'Beyaynetu Platter', am: 'ቤያይነቱ' },
    desc: { en: 'Festive combination plate of 7 traditional dishes on fresh injera', am: '7 ዓይነት ምግቦች ከኢንጀራ ጋር' },
    price: 420, badge: 'special', badgeIcon: '⭐',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
    available: true,
  },
  {
    id: 8, category: 'Breakfast',
    name: { en: 'Enkolo Tibs', am: 'እንቆ ጥብስ' },
    desc: { en: 'Pan-fried eggs with tomato, onion & green chili — Ethiopian style', am: 'ቲማቲም እና ቃሪያ ጋር የጠበሰ እንቆ' },
    price: 65, badge: null,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
    available: true,
  },
];

export const drinkItems = [
  {
    id: 101, subCategory: 'Hot Drinks',
    name: { en: 'Ethiopian Coffee (Bunna)', am: 'ቡና' },
    desc: { en: 'Traditionally roasted & brewed Ethiopian coffee served in a jebena', am: 'ባህላዊ ቀጥታ ቡና' },
    price: 45, badge: 'popular', badgeIcon: '🔥',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    available: true,
  },
  {
    id: 102, subCategory: 'Hot Drinks',
    name: { en: 'Spiced Tea', am: 'ሻይ' },
    desc: { en: 'Black tea infused with cardamom, cinnamon and clove — warming and aromatic', am: 'ቅመማ ቅመም ሻይ' },
    price: 35, badge: null,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80',
    available: true,
  },
  {
    id: 103, subCategory: 'Smoothies',
    name: { en: 'Avocado Smoothie', am: 'አቮካዶ ጭማቂ' },
    desc: { en: 'Fresh avocado blended with milk and a touch of honey — thick and velvety', am: 'ትኩስ አቮካዶ ጭማቂ' },
    price: 90, badge: 'new', badgeIcon: '✨',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90bb2c6?w=600&q=80',
    available: true,
  },
  {
    id: 104, subCategory: 'Fresh Juices',
    name: { en: 'Fresh Mango Juice', am: 'ማንጎ ጭማቂ' },
    desc: { en: 'Cold-pressed fresh mango juice — seasonal and unfiltered', am: 'ትኩስ ማንጎ ጭማቂ' },
    price: 70, badge: 'popular', badgeIcon: '🔥',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=80',
    available: true,
  },
  {
    id: 105, subCategory: 'Alcohol',
    name: { en: 'St. George Beer', am: 'ቅዱስ ጊዮርጊስ ቢራ' },
    desc: { en: 'Ethiopia\'s finest premium lager, brewed since 1922 — ice cold', am: 'ኢትዮጵያ ቢራ' },
    price: 80, badge: null,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80',
    available: true,
  },
  {
    id: 106, subCategory: 'Cold Drinks',
    name: { en: 'Tej (Honey Wine)', am: 'ጠጅ' },
    desc: { en: 'Traditional Ethiopian honey mead with a light amber glow and floral sweetness', am: 'ባህላዊ ጠጅ' },
    price: 60, badge: 'special', badgeIcon: '⭐',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80',
    available: true,
  },
];

export const languages = [
  { code: 'en', label: 'EN', full: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { code: 'am', label: 'አማ', full: 'አማርኛ',   flag: '🇪🇹', dir: 'ltr' },
  { code: 'om', label: 'OM', full: 'Oromiffa', flag: '🇪🇹', dir: 'ltr' },
  { code: 'ti', label: 'TI', full: 'ትግርኛ',   flag: '🇪🇹', dir: 'ltr' },
  { code: 'ar', label: 'AR', full: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', label: 'FR', full: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', label: '中文', full: '中文',   flag: '🇨🇳', dir: 'ltr' },
];

export const currencies = [
  { code: 'ETB', symbol: 'Br', rate: 1, format: (n) => `${n} Br` },
  { code: 'USD', symbol: '$',  rate: 0.00701, format: (n) => `$${n}` },
  { code: 'EUR', symbol: '€',  rate: 0.00641, format: (n) => `€${n}` },
  { code: 'CNY', symbol: '¥',  rate: 0.05078, format: (n) => `¥${n}` },
  { code: 'SAR', symbol: 'ر.س', rate: 0.02629, format: (n) => `ر.س ${n}` },
];

export const i18n = {
  en: {
    tagline: 'Est. in Debre Berhan, Ethiopia',
    hero_title: 'Fancy Aroma Smart Digital Menu',
    hero_sub: 'Experience the Real Taste of Ethiopia',
    hero_cta: 'Explore Our Menu ↓',
    search_placeholder: 'Search food or drink...',
    menu_title: 'Our Menu',
    drinks_label: 'Drinks & Beverages',
    qr_title: 'Fancy Aroma', qr_title_am: 'ፋንሲ አሮማ',
    qr_sub: 'Scan to view this menu on your phone',
    qr_note: 'No app required · Works on any device',
    rates_note: 'Exchange rates updated: May 2026',
    settings: '⚙ Settings',
    language: 'Language', currency: 'Currency',
    add: 'Add to Order',
    no_results: 'No items found', no_results_sub: 'Try a different search term or category',
  },
  am: {
    tagline: 'በደብረ ብርሃን፣ ኢትዮጵያ',
    hero_title: 'ፋንሲ አሮማ ዲጂታል ሜኑ',
    hero_sub: 'የኢትዮጵያን ትክክለኛ ጣዕም ይፈልጉ',
    hero_cta: 'ምናሌውን ይፈልጉ ↓',
    search_placeholder: 'ምግብ ወይም መጠጥ ፈልጉ...',
    menu_title: 'ምናሌአችን',
    drinks_label: 'መጠጦች',
    qr_title: 'ፋንሲ አሮማ', qr_title_am: 'Fancy Aroma',
    qr_sub: 'ምናሌውን በስልክዎ ላይ ለማየት ቁጥጥር',
    qr_note: 'ምንም መተግበሪያ አያስፈልግም · በማንኛውም ሃ',
    rates_note: 'ምንዛሬ ዋጋ ተሰምሯል: ሜይ 2026',
    settings: '⚙ ቅንብሮች',
    language: 'ቋንቋ', currency: 'ምንዛሬ',
    add: 'ወደ ትዕዛዝ ጨምር',
    no_results: 'ምንም አልተገኘም', no_results_sub: 'ሌላ ቃል ወይም ምድብ ሞክሩ',
  },
};
// Fallback to English for other langs
['om','ti','ar','fr','zh'].forEach(c => { i18n[c] = i18n.en; });
