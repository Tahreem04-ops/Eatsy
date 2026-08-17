import { createServerFn } from "@tanstack/react-start";
import { db, type OrderStatus } from "./db";

export const getMenuServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.getDishes();
});

export const updateStockServerFn = createServerFn({ method: "POST" })
  .validator((data: { dishId: string; stock: number }) => data)
  .handler(async ({ data }) => {
    return db.updateStock(data.dishId, data.stock);
  });

export const placeOrderServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      tableNumber: string;
      items: { dishId: string; quantity: number }[];
      guestName?: string;
      guestPhone?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    return db.createOrder(data);
  });

export const getOrdersServerFn = createServerFn({ method: "GET" })
  .validator((data?: { status?: OrderStatus }) => data)
  .handler(async ({ data }) => {
    return db.getOrders(data?.status);
  });

export const updateOrderStatusServerFn = createServerFn({ method: "POST" })
  .validator((data: { orderId: string; status: OrderStatus }) => data)
  .handler(async ({ data }) => {
    return db.updateOrderStatus(data.orderId, data.status);
  });

export const createBookingServerFn = createServerFn({ method: "POST" })
  .validator(
    (data: { name: string; phone: string; guests: number; date: string; time: string }) => data,
  )
  .handler(async ({ data }) => {
    return db.createBooking(data);
  });

export const getBookingsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.getBookings();
});

export const getLoyaltyServerFn = createServerFn({ method: "GET" })
  .validator((data?: { phone?: string }) => data)
  .handler(async ({ data }) => {
    return db.getLoyaltyMember(data?.phone || "+447911123456");
  });

export const claimLoyaltyOfferServerFn = createServerFn({ method: "POST" })
  .validator((data: { phone?: string; offerId: string }) => data)
  .handler(async ({ data }) => {
    return db.claimLoyaltyOffer(data.phone || "+447911123456", data.offerId);
  });

export const getAnalyticsServerFn = createServerFn({ method: "GET" }).handler(async () => {
  return db.getAnalytics();
});
