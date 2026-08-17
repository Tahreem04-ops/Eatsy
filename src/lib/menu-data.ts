export type Category = "mains" | "grill" | "sides" | "drinks" | "desserts";

export type Dish = {
  id: string;
  name: Record<"en" | "ur" | "pl" | "ar", string>;
  desc: string;
  price: number;
  category: Category;
  stock: number;
  tags: string[];
  emoji: string;
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "mains", label: "Mains" },
  { id: "grill", label: "Grill" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

export const MENU: Dish[] = [
  {
    id: "d1",
    name: { en: "Sunday Roast Beef", ur: "روسٹ بیف", pl: "Pieczeń wołowa", ar: "لحم مشوي" },
    desc: "Yorkshire pudding, roast potatoes, seasonal veg, red wine gravy",
    price: 16.5,
    category: "mains",
    stock: 6,
    tags: ["Signature"],
    emoji: "🍖",
  },
  {
    id: "d2",
    name: { en: "Fish & Chips", ur: "فش اینڈ چپس", pl: "Ryba z frytkami", ar: "سمك ورقائق" },
    desc: "Beer-battered haddock, triple-cooked chips, mushy peas",
    price: 14.0,
    category: "mains",
    stock: 3,
    tags: ["Best seller"],
    emoji: "🐟",
  },
  {
    id: "d3",
    name: { en: "Chicken Tikka Masala", ur: "چکن تکہ مسالہ", pl: "Kurczak tikka masala", ar: "دجاج تكا مسالا" },
    desc: "Charred thigh, tomato cream sauce, basmati, naan",
    price: 13.5,
    category: "mains",
    stock: 12,
    tags: ["Spicy"],
    emoji: "🍛",
  },
  {
    id: "d4",
    name: { en: "Lamb Seekh Kebab", ur: "سیخ کباب", pl: "Kebab jagnięcy", ar: "كباب لحم" },
    desc: "Clay oven, mint yoghurt, pickled onion",
    price: 11.0,
    category: "grill",
    stock: 0,
    tags: ["Halal"],
    emoji: "🥩",
  },
  {
    id: "d5",
    name: { en: "Peri Peri Half Chicken", ur: "پیری پیری چکن", pl: "Kurczak peri peri", ar: "دجاج بيري بيري" },
    desc: "Flame grilled, medium heat, house slaw",
    price: 12.5,
    category: "grill",
    stock: 9,
    tags: ["Halal"],
    emoji: "🍗",
  },
  {
    id: "d6",
    name: { en: "Halloumi Fries", ur: "ہالومی فرائز", pl: "Frytki halloumi", ar: "بطاطس حلومي" },
    desc: "Honey, chilli, black seed",
    price: 6.0,
    category: "sides",
    stock: 2,
    tags: ["Veg"],
    emoji: "🧀",
  },
  {
    id: "d7",
    name: { en: "Loaded Chips", ur: "لوڈڈ چپس", pl: "Frytki z dodatkami", ar: "بطاطس محملة" },
    desc: "Cheese curds, gravy, spring onion",
    price: 5.5,
    category: "sides",
    stock: 20,
    tags: [],
    emoji: "🍟",
  },
  {
    id: "d8",
    name: { en: "Masala Chai", ur: "مسالہ چائے", pl: "Herbata masala", ar: "شاي بالحليب" },
    desc: "Cardamom, clove, whole milk",
    price: 3.2,
    category: "drinks",
    stock: 40,
    tags: [],
    emoji: "☕",
  },
  {
    id: "d9",
    name: { en: "Craft Lager", ur: "کرافٹ لیگر", pl: "Lager rzemieślniczy", ar: "جعة" },
    desc: "Local brewery, 4.2%, pint",
    price: 5.8,
    category: "drinks",
    stock: 30,
    tags: [],
    emoji: "🍺",
  },
  {
    id: "d10",
    name: { en: "Sticky Toffee Pudding", ur: "ٹافی پڈنگ", pl: "Pudding toffi", ar: "حلوى التوفي" },
    desc: "Butterscotch, clotted cream",
    price: 7.0,
    category: "desserts",
    stock: 4,
    tags: [],
    emoji: "🍮",
  },
  {
    id: "d11",
    name: { en: "Baklava Plate", ur: "بقلاوہ", pl: "Baklawa", ar: "بقلاوة" },
    desc: "Pistachio, rose syrup, three pieces",
    price: 6.5,
    category: "desserts",
    stock: 7,
    tags: [],
    emoji: "🍯",
  },
  {
    id: "d12",
    name: { en: "Mixed Grill Platter", ur: "مکس گرل", pl: "Półmisek z grilla", ar: "مشاوي مشكلة" },
    desc: "Lamb chop, wings, kofta, grilled tomato",
    price: 22.0,
    category: "grill",
    stock: 5,
    tags: ["Share"],
    emoji: "🍽️",
  },
];

export const PEAK_HOURS = [
  { hour: "11", orders: 8 },
  { hour: "12", orders: 34 },
  { hour: "13", orders: 52 },
  { hour: "14", orders: 29 },
  { hour: "15", orders: 14 },
  { hour: "16", orders: 11 },
  { hour: "17", orders: 26 },
  { hour: "18", orders: 61 },
  { hour: "19", orders: 88 },
  { hour: "20", orders: 74 },
  { hour: "21", orders: 45 },
  { hour: "22", orders: 19 },
];

export const RETENTION = [
  { month: "Feb", returning: 31, new: 69 },
  { month: "Mar", returning: 38, new: 62 },
  { month: "Apr", returning: 44, new: 56 },
  { month: "May", returning: 49, new: 51 },
  { month: "Jun", returning: 57, new: 43 },
  { month: "Jul", returning: 63, new: 37 },
];

export const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const HEATMAP_SLOTS = ["12:00", "14:00", "17:00", "19:00", "21:00"];
export const HEATMAP: number[][] = [
  [22, 14, 9, 41, 27],
  [26, 17, 12, 46, 30],
  [31, 19, 15, 52, 34],
  [38, 24, 21, 63, 45],
  [58, 33, 30, 88, 71],
  [72, 49, 44, 96, 84],
  [66, 61, 38, 70, 40],
];

export const TOP_DISHES = [
  { name: "Fish & Chips", sold: 412, revenue: 5768 },
  { name: "Chicken Tikka Masala", sold: 388, revenue: 5238 },
  { name: "Sunday Roast Beef", sold: 264, revenue: 4356 },
  { name: "Mixed Grill Platter", sold: 173, revenue: 3806 },
  { name: "Peri Peri Half Chicken", sold: 241, revenue: 3012 },
];
