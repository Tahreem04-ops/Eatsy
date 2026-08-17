import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "ur" | "pl" | "ar";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "ur", label: "اردو", flag: "UR" },
  { code: "pl", label: "Polski", flag: "PL" },
  { code: "ar", label: "العربية", flag: "AR" },
];

type Dict = Record<string, string>;

const en: Dict = {
  brand: "Eatsy",
  nav_menu: "Table Menu",
  nav_kitchen: "Kitchen KDS",
  nav_loyalty: "Loyalty",
  nav_analytics: "Analytics",
  nav_book: "Book a Table",
  hero_kicker: "Commission-free ordering for UK high streets",
  hero_title: "Your restaurant's own digital twin",
  hero_sub:
    "QR table ordering, live stock, loyalty and analytics — keep 100% of every order instead of paying 30% to delivery apps.",
  cta_order: "Order Now",
  cta_book: "Book a Table",
  wait_time: "Live wait time",
  minutes: "min",
  feat_title: "Everything the high street needs",
  f1: "QR Table Ordering",
  f1d: "Scan, browse, order and pay from the table — no app download, no queue at the till.",
  f2: "Real-Time Stock",
  f2d: "Sold-out dishes vanish from the menu instantly across every table.",
  f3: "Smart Loyalty Engine",
  f3d: "Personalised SMS and email offers triggered by how often each guest visits.",
  f4: "Four Languages",
  f4d: "English, Urdu, Polish and Arabic with full right-to-left support.",
  f5: "Analytics Dashboard",
  f5d: "Dish heatmaps, peak hours and retention curves in one clean view.",
  f6: "Google Business Sync",
  f6d: "'Order Now' straight from Maps, with live wait times and location detection.",
  menu_title: "Menu",
  table: "Table",
  add: "Add",
  sold_out: "Sold out",
  low_stock: "Only {n} left",
  cart: "Your order",
  empty_cart: "Nothing added yet.",
  subtotal: "Subtotal",
  service: "Service (10%)",
  total: "Total",
  pay: "Pay from phone",
  order_placed: "Order sent to the kitchen",
  loyalty_title: "Loyalty & Referrals",
  loyalty_sub: "Points, tiers and AI-picked offers that bring guests back.",
  analytics_title: "Analytics",
  analytics_sub: "What sells, when it sells, and who comes back.",
  book_title: "Book a Table",
  book_sub: "Pick a slot — confirmation lands by SMS in seconds.",
  name: "Name",
  phone: "Phone",
  guests: "Guests",
  date: "Date",
  time: "Time",
  confirm: "Confirm booking",
  booked: "Table booked. Confirmation sent.",
  all: "All",
  detected: "Location detected",
  footer: "Built for independent UK restaurants, pubs and takeaways.",
};

const ur: Dict = {
  ...en,
  nav_menu: "ٹیبل مینو",
  nav_kitchen: "کچن پورٹل",
  nav_loyalty: "لائلٹی",
  nav_analytics: "تجزیات",
  nav_book: "ٹیبل بک کریں",
  hero_kicker: "برطانوی ہائی اسٹریٹ کے لیے بغیر کمیشن آرڈرنگ",
  hero_title: "آپ کے ریستوران کا اپنا ڈیجیٹل ٹوئن",
  hero_sub:
    "کیو آر ٹیبل آرڈرنگ، لائیو اسٹاک، لائلٹی اور تجزیات — ہر آرڈر کا 100٪ آپ کا۔",
  cta_order: "ابھی آرڈر کریں",
  cta_book: "ٹیبل بک کریں",
  wait_time: "موجودہ انتظار",
  minutes: "منٹ",
  feat_title: "ہائی اسٹریٹ کے لیے ہر ضرورت",
  f1: "کیو آر ٹیبل آرڈرنگ",
  f1d: "اسکین کریں، مینو دیکھیں، آرڈر کریں اور فون سے ادائیگی کریں۔",
  f2: "ریئل ٹائم اسٹاک",
  f2d: "ڈش ختم ہوتے ہی مینو سے خودکار غائب ہو جاتی ہے۔",
  f3: "اسمارٹ لائلٹی انجن",
  f3d: "ذاتی نوعیت کی ایس ایم ایس اور ای میل پیشکشیں۔",
  f4: "چار زبانیں",
  f4d: "انگریزی، اردو، پولش اور عربی مکمل سپورٹ کے ساتھ۔",
  f5: "تجزیاتی ڈیش بورڈ",
  f5d: "مقبول ڈشز، مصروف اوقات اور واپس آنے والے گاہک۔",
  f6: "گوگل بزنس سنک",
  f6d: "گوگل میپس سے سیدھا 'آرڈر ناؤ'۔",
  menu_title: "مینو",
  table: "ٹیبل",
  add: "شامل کریں",
  sold_out: "ختم",
  low_stock: "صرف {n} باقی",
  cart: "آپ کا آرڈر",
  empty_cart: "ابھی کچھ شامل نہیں۔",
  subtotal: "ذیلی رقم",
  service: "سروس (10%)",
  total: "کل",
  pay: "فون سے ادائیگی",
  order_placed: "آرڈر کچن کو بھیج دیا گیا",
  loyalty_title: "لائلٹی اور ریفرل",
  loyalty_sub: "پوائنٹس، ٹئیرز اور ذہین پیشکشیں۔",
  analytics_title: "تجزیات",
  analytics_sub: "کیا بکتا ہے، کب بکتا ہے، کون واپس آتا ہے۔",
  book_title: "ٹیبل بک کریں",
  book_sub: "وقت منتخب کریں — تصدیق ایس ایم ایس پر۔",
  name: "نام",
  phone: "فون",
  guests: "مہمان",
  date: "تاریخ",
  time: "وقت",
  confirm: "بکنگ کی تصدیق",
  booked: "ٹیبل بک ہو گیا۔",
  all: "سب",
  detected: "مقام معلوم ہو گیا",
  footer: "آزاد برطانوی ریستورانوں کے لیے۔",
};

const pl: Dict = {
  ...en,
  nav_menu: "Menu przy stoliku",
  nav_loyalty: "Lojalność",
  nav_analytics: "Analityka",
  nav_book: "Rezerwuj stolik",
  hero_kicker: "Zamówienia bez prowizji dla brytyjskich lokali",
  hero_title: "Cyfrowy bliźniak Twojej restauracji",
  hero_sub:
    "Zamawianie z kodu QR, stan na żywo, lojalność i analityka — zatrzymaj 100% każdego zamówienia.",
  cta_order: "Zamów teraz",
  cta_book: "Rezerwuj stolik",
  wait_time: "Czas oczekiwania",
  minutes: "min",
  feat_title: "Wszystko, czego potrzebuje lokal",
  f1: "Zamawianie z QR",
  f1d: "Skanuj, przeglądaj, zamawiaj i płać przy stoliku.",
  f2: "Stan magazynu na żywo",
  f2d: "Wyprzedane dania znikają z menu natychmiast.",
  f3: "Silnik lojalnościowy",
  f3d: "Spersonalizowane oferty SMS i e-mail.",
  f4: "Cztery języki",
  f4d: "Angielski, urdu, polski i arabski.",
  f5: "Panel analityczny",
  f5d: "Mapy popularności dań, szczyty i retencja.",
  f6: "Synchronizacja z Google",
  f6d: "„Zamów teraz” prosto z Map Google.",
  menu_title: "Menu",
  table: "Stolik",
  add: "Dodaj",
  sold_out: "Wyprzedane",
  low_stock: "Zostało tylko {n}",
  cart: "Twoje zamówienie",
  empty_cart: "Nic jeszcze nie dodano.",
  subtotal: "Suma częściowa",
  service: "Serwis (10%)",
  total: "Razem",
  pay: "Zapłać telefonem",
  order_placed: "Zamówienie wysłane do kuchni",
  loyalty_title: "Lojalność i polecenia",
  loyalty_sub: "Punkty, poziomy i trafne oferty.",
  analytics_title: "Analityka",
  analytics_sub: "Co się sprzedaje i kto wraca.",
  book_title: "Rezerwuj stolik",
  book_sub: "Wybierz godzinę — potwierdzenie SMS-em.",
  name: "Imię",
  phone: "Telefon",
  guests: "Goście",
  date: "Data",
  time: "Godzina",
  confirm: "Potwierdź rezerwację",
  booked: "Stolik zarezerwowany.",
  all: "Wszystko",
  detected: "Wykryto lokalizację",
  footer: "Dla niezależnych lokali w UK.",
};

const ar: Dict = {
  ...en,
  nav_menu: "قائمة الطاولة",
  nav_loyalty: "الولاء",
  nav_analytics: "التحليلات",
  nav_book: "احجز طاولة",
  hero_kicker: "طلبات بدون عمولة للمطاعم البريطانية",
  hero_title: "التوأم الرقمي لمطعمك",
  hero_sub: "طلب عبر رمز QR، مخزون مباشر، ولاء وتحليلات — احتفظ بـ100٪ من كل طلب.",
  cta_order: "اطلب الآن",
  cta_book: "احجز طاولة",
  wait_time: "وقت الانتظار",
  minutes: "دقيقة",
  feat_title: "كل ما يحتاجه المطعم",
  f1: "الطلب عبر QR",
  f1d: "امسح، تصفح، اطلب وادفع من الطاولة.",
  f2: "مخزون فوري",
  f2d: "الأطباق المنتهية تختفي من القائمة فوراً.",
  f3: "محرك ولاء ذكي",
  f3d: "عروض مخصصة عبر الرسائل والبريد.",
  f4: "أربع لغات",
  f4d: "الإنجليزية والأردية والبولندية والعربية.",
  f5: "لوحة تحليلات",
  f5d: "الأطباق الأكثر طلباً وأوقات الذروة.",
  f6: "مزامنة جوجل",
  f6d: "«اطلب الآن» مباشرة من خرائط جوجل.",
  menu_title: "القائمة",
  table: "طاولة",
  add: "أضف",
  sold_out: "نفد",
  low_stock: "بقي {n} فقط",
  cart: "طلبك",
  empty_cart: "لم تتم إضافة شيء.",
  subtotal: "المجموع",
  service: "الخدمة (10%)",
  total: "الإجمالي",
  pay: "ادفع من الهاتف",
  order_placed: "تم إرسال الطلب للمطبخ",
  loyalty_title: "الولاء والإحالات",
  loyalty_sub: "نقاط ومستويات وعروض ذكية.",
  analytics_title: "التحليلات",
  analytics_sub: "ما يُباع ومن يعود.",
  book_title: "احجز طاولة",
  book_sub: "اختر الوقت — التأكيد برسالة نصية.",
  name: "الاسم",
  phone: "الهاتف",
  guests: "الضيوف",
  date: "التاريخ",
  time: "الوقت",
  confirm: "تأكيد الحجز",
  booked: "تم حجز الطاولة.",
  all: "الكل",
  detected: "تم تحديد الموقع",
  footer: "لمطاعم بريطانيا المستقلة.",
};

const DICTS: Record<Lang, Dict> = { en, ur, pl, ar };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  rtl: boolean;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const rtl = lang === "ur" || lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl ? "rtl" : "ltr";
  }, [lang, rtl]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      rtl,
      t: (key, vars) => {
        let s = DICTS[lang][key] ?? DICTS.en[key] ?? key;
        if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
        return s;
      },
    }),
    [lang, rtl],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
