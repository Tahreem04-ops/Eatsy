import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, QrCode, ShoppingBag, Wifi } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { CATEGORIES, type Category, type Dish } from "@/lib/menu-data";
import { cn } from "@/lib/utils";
import { getMenuServerFn, placeOrderServerFn } from "@/server/api";

type Search = { table?: string | undefined };

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    table: typeof search["table"] === "string" ? (search["table"] as string) : "12",
  }),
  head: () => ({
    meta: [
      { title: "Table Menu — Eatsy QR Ordering" },
      {
        name: "description",
        content:
          "Scan, browse the live menu with real-time stock, and pay from your phone. Sold-out dishes disappear instantly.",
      },
      { property: "og:title", content: "Table Menu — Eatsy QR Ordering" },
      {
        property: "og:description",
        content: "Live menu with real-time stock, four languages and phone payment at the table.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { table = "12" } = Route.useSearch();
  const { t, lang } = useI18n();
  const cart = useCart();
  const [cat, setCat] = useState<Category | "all">("all");
  const [dishesList, setDishesList] = useState<Dish[]>([]);
  const [placing, setPlacing] = useState(false);
  const [guestPhone, setGuestPhone] = useState("+447911123456");

  async function fetchMenu() {
    try {
      const liveDishes = await getMenuServerFn();
      setDishesList(liveDishes);
    } catch (err) {
      console.error("Error fetching live menu:", err);
    }
  }

  useEffect(() => {
    fetchMenu();
    const interval = setInterval(fetchMenu, 4000);
    return () => clearInterval(interval);
  }, []);

  const dishes = useMemo(
    () => dishesList.filter((d) => (cat === "all" ? true : d.category === cat)),
    [cat, dishesList],
  );

  const place = async () => {
    if (!cart.count || placing) return;
    try {
      setPlacing(true);
      const itemsPayload = cart.lines.map((l) => ({
        dishId: l.dish.id,
        quantity: l.qty,
      }));

      const newOrder = await placeOrderServerFn({
        data: {
          tableNumber: table,
          items: itemsPayload,
          guestName: "Table Guest",
          guestPhone: guestPhone,
        },
      });

      toast.success(`${t("order_placed")} ${newOrder.code} · ${t("table")} ${table}`);
      cart.clear();
      await fetchMenu();
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <div className="surface flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <QrCode className="size-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold">{t("menu_title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("table")} {table} · The Copper Kettle, Manchester
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
            <Wifi className="size-3.5 animate-pulse" /> Live DB stock
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[{ id: "all" as const, label: t("all") }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id as Category | "all")}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                cat === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {dishes.map((d) => (
              <DishCard key={d.id} dish={d} stock={d.stock} lang={lang} />
            ))}
            {dishes.length > 0 && dishes.every((d) => d.stock === 0) && (
              <p className="text-sm text-muted-foreground">{t("sold_out")}</p>
            )}
          </div>

          <aside className="surface h-fit p-6 lg:sticky lg:top-24">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ShoppingBag className="size-5 text-primary" /> {t("cart")}
            </h2>

            {cart.lines.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{t("empty_cart")}</p>
            ) : (
              <>
                <ul className="mt-4 space-y-3">
                  {cart.lines.map((l) => (
                    <li key={l.dish.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex-1">
                        {l.dish.emoji} {l.dish.name[lang]}
                      </span>
                      <span className="flex items-center gap-2">
                        <button
                          onClick={() => cart.remove(l.dish.id)}
                          className="grid size-7 place-items-center rounded-md border border-border"
                          aria-label="minus"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-4 text-center font-semibold">{l.qty}</span>
                        <button
                          onClick={() => cart.add(l.dish)}
                          className="grid size-7 place-items-center rounded-md border border-border"
                          aria-label="plus"
                        >
                          <Plus className="size-3" />
                        </button>
                      </span>
                      <span className="w-14 text-end font-semibold">
                        £{(l.dish.price * l.qty).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <label className="text-xs text-muted-foreground block mb-1">
                    Phone number (for loyalty points):
                  </label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs"
                    placeholder="+447911123456"
                  />
                </div>
              </>
            )}

            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <Row label={t("subtotal")} value={cart.subtotal} />
              <Row label={t("service")} value={cart.service} />
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span>{t("total")}</span>
                <span>£{cart.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={place}
              disabled={!cart.count || placing}
              className="mt-5 w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {placing ? "Sending to kitchen..." : t("pay")}
            </button>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>£{value.toFixed(2)}</span>
    </div>
  );
}

function DishCard({ dish, stock, lang }: { dish: Dish; stock: number; lang: "en" | "ur" | "pl" | "ar" }) {
  const { t } = useI18n();
  const cart = useCart();
  const out = stock === 0;

  return (
    <article
      className={cn(
        "surface flex flex-col p-5 transition-all",
        out ? "opacity-45 grayscale" : "hover:shadow-[var(--shadow-lift)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl">{dish.emoji}</span>
        <div className="flex flex-wrap justify-end gap-1">
          {dish.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold">{dish.name[lang]}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{dish.desc}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="font-display text-lg font-semibold">£{dish.price.toFixed(2)}</span>
        {out ? (
          <span className="rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive">
            {t("sold_out")}
          </span>
        ) : (
          <button
            onClick={() => cart.add(dish)}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("add")}
          </button>
        )}
      </div>
      {!out && stock <= 3 && (
        <p className="mt-2 text-xs font-semibold text-accent-foreground">{t("low_stock", { n: stock })}</p>
      )}
    </article>
  );
}
