import fs from "node:fs";
import path from "node:path";
import { MENU, PEAK_HOURS, RETENTION, TOP_DISHES, type Dish } from "../lib/menu-data";

export type OrderStatus = "pending" | "preparing" | "ready" | "completed" | "cancelled";

export type OrderItem = {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
};

export type Order = {
  id: string;
  code: string;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  status: OrderStatus;
  guestName: string;
  guestPhone: string;
  createdAt: string;
};

export type BookingStatus = "confirmed" | "cancelled";

export type Booking = {
  id: string;
  code: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  status: BookingStatus;
  createdAt: string;
};

export type LoyaltyMember = {
  phone: string;
  name: string;
  points: number;
  tier: "Bronze" | "Silver" | "Gold";
  totalSpent: number;
  visitCount: number;
  claimedRewards: string[];
};

export type EatsyDB = {
  dishes: Dish[];
  orders: Order[];
  bookings: Booking[];
  loyalty: Record<string, LoyaltyMember>;
};

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "eatsy_db.json");

function initialSeed(): EatsyDB {
  return {
    dishes: MENU,
    orders: [
      {
        id: "ord_101",
        code: "#EAT-1042",
        tableNumber: "12",
        items: [
          { dishId: "d1", name: "Sunday Roast Beef", price: 16.5, quantity: 1, emoji: "🍖" },
          { dishId: "d8", name: "Masala Chai", price: 3.2, quantity: 2, emoji: "☕" },
        ],
        subtotal: 22.9,
        serviceFee: 2.29,
        total: 25.19,
        status: "preparing",
        guestName: "Hamza Malik",
        guestPhone: "+447911123456",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: "ord_102",
        code: "#EAT-1043",
        tableNumber: "04",
        items: [
          { dishId: "d2", name: "Fish & Chips", price: 14.0, quantity: 2, emoji: "🐟" },
          { dishId: "d6", name: "Halloumi Fries", price: 6.0, quantity: 1, emoji: "🧀" },
        ],
        subtotal: 34.0,
        serviceFee: 3.4,
        total: 37.4,
        status: "pending",
        guestName: "Sarah Jenkins",
        guestPhone: "+447700900077",
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: "ord_100",
        code: "#EAT-1041",
        tableNumber: "08",
        items: [
          { dishId: "d3", name: "Chicken Tikka Masala", price: 13.5, quantity: 2, emoji: "🍛" },
          { dishId: "d9", name: "Craft Lager", price: 5.8, quantity: 2, emoji: "🍺" },
        ],
        subtotal: 38.6,
        serviceFee: 3.86,
        total: 42.46,
        status: "completed",
        guestName: "David Miller",
        guestPhone: "+447700900123",
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
    ],
    bookings: [
      {
        id: "res_201",
        code: "#RES-882",
        name: "Ali Khan",
        phone: "+447812345678",
        guests: 4,
        date: new Date().toISOString().split("T")[0] || "",
        time: "19:30",
        status: "confirmed",
        createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      },
      {
        id: "res_202",
        code: "#RES-883",
        name: "Emma Watson",
        phone: "+447987654321",
        guests: 2,
        date: new Date().toISOString().split("T")[0] || "",
        time: "20:00",
        status: "confirmed",
        createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      },
    ],
    loyalty: {
      "+447911123456": {
        phone: "+447911123456",
        name: "Hamza Malik",
        points: 420,
        tier: "Gold",
        totalSpent: 420.0,
        visitCount: 14,
        claimedRewards: [],
      },
      "+447700900077": {
        phone: "+447700900077",
        name: "Sarah Jenkins",
        points: 150,
        tier: "Silver",
        totalSpent: 150.0,
        visitCount: 5,
        claimedRewards: [],
      },
    },
  };
}

function loadDB(): EatsyDB {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const data = initialSeed();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
      return data;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as EatsyDB;
  } catch (err) {
    console.error("[EatsyDB] Error loading DB, falling back to seed:", err);
    return initialSeed();
  }
}

function saveDB(db: EatsyDB) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("[EatsyDB] Error saving DB:", err);
  }
}

export const db = {
  getDishes(): Dish[] {
    const data = loadDB();
    return data.dishes;
  },

  updateStock(dishId: string, stock: number): Dish[] {
    const data = loadDB();
    const dish = data.dishes.find((d) => d.id === dishId);
    if (dish) {
      dish.stock = Math.max(0, stock);
      saveDB(data);
    }
    return data.dishes;
  },

  getOrders(status?: OrderStatus): Order[] {
    const data = loadDB();
    if (!status) return data.orders;
    return data.orders.filter((o) => o.status === status);
  },

  createOrder(payload: {
    tableNumber: string;
    items: { dishId: string; quantity: number }[];
    guestName?: string;
    guestPhone?: string;
  }): Order {
    const data = loadDB();
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of payload.items) {
      const dish = data.dishes.find((d) => d.id === item.dishId);
      if (!dish) continue;

      const qty = Math.min(item.quantity, dish.stock > 0 ? dish.stock : item.quantity);
      if (dish.stock > 0) {
        dish.stock = Math.max(0, dish.stock - qty);
      }

      const itemTotal = dish.price * qty;
      subtotal += itemTotal;

      orderItems.push({
        dishId: dish.id,
        name: dish.name.en,
        price: dish.price,
        quantity: qty,
        emoji: dish.emoji,
      });
    }

    const serviceFee = Number((subtotal * 0.1).toFixed(2));
    const total = Number((subtotal + serviceFee).toFixed(2));
    const orderCode = `#EAT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      code: orderCode,
      tableNumber: payload.tableNumber || "12",
      items: orderItems,
      subtotal: Number(subtotal.toFixed(2)),
      serviceFee,
      total,
      status: "pending",
      guestName: payload.guestName || "Guest",
      guestPhone: payload.guestPhone || "",
      createdAt: new Date().toISOString(),
    };

    data.orders.unshift(newOrder);

    // Update loyalty if phone provided
    if (payload.guestPhone) {
      const phone = payload.guestPhone.trim();
      const existing = data.loyalty[phone] || {
        phone,
        name: payload.guestName || "Valued Guest",
        points: 0,
        tier: "Bronze",
        totalSpent: 0,
        visitCount: 0,
        claimedRewards: [],
      };

      existing.visitCount += 1;
      existing.totalSpent = Number((existing.totalSpent + total).toFixed(2));
      existing.points += Math.floor(total * 10); // 10 points per £1

      if (existing.totalSpent >= 400) existing.tier = "Gold";
      else if (existing.totalSpent >= 100) existing.tier = "Silver";
      else existing.tier = "Bronze";

      data.loyalty[phone] = existing;
    }

    saveDB(data);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order[] {
    const data = loadDB();
    const order = data.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      saveDB(data);
    }
    return data.orders;
  },

  getBookings(): Booking[] {
    const data = loadDB();
    return data.bookings;
  },

  createBooking(payload: {
    name: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
  }): Booking {
    const data = loadDB();
    const bookingCode = `#RES-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking: Booking = {
      id: `res_${Date.now()}`,
      code: bookingCode,
      name: payload.name,
      phone: payload.phone,
      guests: payload.guests,
      date: payload.date,
      time: payload.time,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    data.bookings.unshift(newBooking);
    saveDB(data);
    return newBooking;
  },

  getLoyaltyMember(phone: string): LoyaltyMember {
    const data = loadDB();
    const normalizedPhone = phone.trim();

    if (data.loyalty[normalizedPhone]) {
      return data.loyalty[normalizedPhone];
    }

    // Default guest profile if phone not found
    return {
      phone: normalizedPhone || "+447911123456",
      name: "Guest Member",
      points: 240,
      tier: "Silver",
      totalSpent: 240.0,
      visitCount: 7,
      claimedRewards: [],
    };
  },

  claimLoyaltyOffer(phone: string, offerId: string): LoyaltyMember {
    const data = loadDB();
    const normalizedPhone = phone.trim() || "+447911123456";
    let member = data.loyalty[normalizedPhone];

    if (!member) {
      member = {
        phone: normalizedPhone,
        name: "Guest Member",
        points: 240,
        tier: "Silver",
        totalSpent: 240.0,
        visitCount: 7,
        claimedRewards: [],
      };
      data.loyalty[normalizedPhone] = member;
    }

    if (!member.claimedRewards.includes(offerId)) {
      member.claimedRewards.push(offerId);
      member.points = Math.max(0, member.points - 50); // deduct 50 points per reward claim
      saveDB(data);
    }

    return member;
  },

  getAnalytics() {
    const data = loadDB();
    const completedOrders = data.orders.filter((o) => o.status !== "cancelled");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

    // Compute dish sales counters
    const dishSalesMap: Record<string, { name: string; sold: number; revenue: number }> = {};
    for (const order of completedOrders) {
      for (const item of order.items) {
        const entry = dishSalesMap[item.dishId];
        if (entry) {
          entry.sold += item.quantity;
          entry.revenue += item.price * item.quantity;
        } else {
          dishSalesMap[item.dishId] = {
            name: item.name,
            sold: item.quantity,
            revenue: item.price * item.quantity,
          };
        }
      }
    }

    const topDishesList = Object.values(dishSalesMap).sort((a, b) => b.sold - a.sold);
    const topDishes = topDishesList.length > 0 ? topDishesList.slice(0, 5) : TOP_DISHES;

    const totalOrdersCount = completedOrders.length;
    const commissionSaved = Number((totalRevenue * 0.3).toFixed(2));
    const avgOrderValue = totalOrdersCount > 0 ? Number((totalRevenue / totalOrdersCount).toFixed(2)) : 24.6;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrdersCount,
      commissionSaved,
      avgOrderValue,
      topDishes,
      peakHours: PEAK_HOURS,
      retention: RETENTION,
    };
  },
};
