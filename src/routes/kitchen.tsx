import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChefHat,
  RefreshCw,
  Package,
  Calendar,
  User,
  Phone,
  Layers,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import {
  getOrdersServerFn,
  updateOrderStatusServerFn,
  getMenuServerFn,
  updateStockServerFn,
  getBookingsServerFn,
} from "@/server/api";
import type { Order, OrderStatus, Booking } from "@/server/db";
import type { Dish } from "@/lib/menu-data";
import { toast } from "sonner";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Eatsy — Kitchen Display System (KDS) & Admin" },
      { name: "description", content: "Real-time kitchen order management, table bookings and live stock controls." },
    ],
  }),
  component: KitchenKDS,
});

function KitchenKDS() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "stock" | "bookings">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);
      const [oList, dList, bList] = await Promise.all([
        getOrdersServerFn(),
        getMenuServerFn(),
        getBookingsServerFn(),
      ]);
      setOrders(oList);
      setDishes(dList);
      setBookings(bList);
    } catch (err) {
      console.error("[KDS] Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    try {
      const updated = await updateOrderStatusServerFn({ data: { orderId, status } });
      setOrders(updated);
      toast.success(`Order ${status === "completed" ? "completed" : "updated to " + status}`);
    } catch {
      toast.error("Failed to update order status");
    }
  }

  async function handleStockChange(dishId: string, newStock: number) {
    try {
      const updated = await updateStockServerFn({ data: { dishId, stock: newStock } });
      setDishes(updated);
      toast.success("Stock updated");
    } catch {
      toast.error("Failed to update stock");
    }
  }

  const filteredOrders = orders.filter((o) =>
    statusFilter === "all" ? true : o.status === statusFilter,
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "preparing":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "ready":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "completed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-destructive/15 text-destructive border-destructive/30";
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <ChefHat className="size-3.5 text-accent" /> Staff & Kitchen Portal
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Kitchen Display System
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage live table orders, adjust menu stock levels, and view incoming table bookings.
            </p>
          </div>

          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Sync Now
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border pb-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === "orders"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <UtensilsCrossed className="size-4" /> Live Orders ({orders.filter((o) => o.status !== "completed").length})
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === "stock"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="size-4" /> Stock Control ({dishes.filter((d) => d.stock <= 3).length} low)
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              activeTab === "bookings"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-4" /> Reservations ({bookings.length})
          </button>
        </div>

        {/* Live Orders View */}
        {activeTab === "orders" && (
          <div className="mt-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {["all", "pending", "preparing", "ready", "completed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    statusFilter === st
                      ? "bg-accent text-accent-foreground"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="surface p-12 text-center">
                <CheckCircle2 className="mx-auto size-10 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-semibold">No orders in this status</h3>
                <p className="text-sm text-muted-foreground">
                  New orders placed by guests at tables will pop up automatically.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="surface flex flex-col justify-between p-5 transition-shadow hover:shadow-[var(--shadow-soft)]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-semibold text-muted-foreground">
                          {order.code}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusBadge(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-3 flex items-baseline justify-between">
                        <h3 className="text-xl font-bold">Table {order.tableNumber}</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {order.guestName && (
                        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                          <User className="size-3" /> {order.guestName} ({order.guestPhone || "No phone"})
                        </p>
                      )}

                      {/* Items list */}
                      <div className="mt-4 space-y-2 border-t border-border pt-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                              {item.quantity}x {item.emoji} {item.name}
                            </span>
                            <span className="text-muted-foreground font-mono">
                              £{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-border pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-muted-foreground">Total (incl. service)</span>
                        <span className="font-display text-lg font-semibold text-primary">
                          £{order.total.toFixed(2)}
                        </span>
                      </div>

                      {/* Status Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "preparing")}
                            className="col-span-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                          >
                            Start Preparing
                          </button>
                        )}

                        {order.status === "preparing" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "ready")}
                            className="col-span-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                          >
                            Mark Ready to Serve
                          </button>
                        )}

                        {order.status === "ready" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "completed")}
                            className="col-span-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
                          >
                            Mark Order Served
                          </button>
                        )}

                        {order.status !== "completed" && order.status !== "cancelled" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "cancelled")}
                            className="col-span-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 mt-1"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stock Control View */}
        {activeTab === "stock" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Adjust remaining portions. Updating stock to 0 instantly marks the dish as <strong>Sold Out</strong> on guest table menus.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dishes.map((dish) => (
                <div key={dish.id} className="surface p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{dish.emoji}</span>
                      <h4 className="font-semibold text-sm">{dish.name.en}</h4>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground font-mono">£{dish.price.toFixed(2)}</p>
                    <div className="mt-2">
                      {dish.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                          <AlertTriangle className="size-3" /> Sold Out
                        </span>
                      ) : dish.stock <= 3 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                          Only {dish.stock} left
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                          {dish.stock} portions
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStockChange(dish.id, Math.max(0, dish.stock - 1))}
                      className="grid size-8 place-items-center rounded-lg border border-border bg-secondary text-foreground hover:bg-muted font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono font-semibold text-sm">{dish.stock}</span>
                    <button
                      onClick={() => handleStockChange(dish.id, dish.stock + 5)}
                      className="grid size-8 place-items-center rounded-lg border border-border bg-secondary text-foreground hover:bg-muted font-bold"
                    >
                      +5
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reservations View */}
        {activeTab === "bookings" && (
          <div className="mt-6">
            {bookings.length === 0 ? (
              <div className="surface p-12 text-center">
                <Calendar className="mx-auto size-10 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-semibold">No bookings reserved yet</h3>
                <p className="text-sm text-muted-foreground">Reservations submitted on /book will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bookings.map((res) => (
                  <div key={res.id} className="surface p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-muted-foreground">{res.code}</span>
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 capitalize">
                        {res.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold">{res.name}</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <User className="size-4 text-accent" /> {res.guests} Guests
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="size-4 text-accent" /> {res.date} at {res.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="size-4 text-accent" /> {res.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
