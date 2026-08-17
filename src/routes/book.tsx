import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { useI18n } from "@/lib/i18n";
import { createBookingServerFn } from "@/server/api";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a Table — Eatsy Reservations" },
      {
        name: "description",
        content:
          "Reserve a table in seconds with live wait times synced to your Google Business listing. SMS confirmation included.",
      },
      { property: "og:title", content: "Book a Table — Eatsy Reservations" },
      {
        property: "og:description",
        content: "Live wait times, instant SMS confirmation and Google Maps booking sync.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

const SLOTS = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"];

function BookPage() {
  const { t } = useI18n();
  const [slot, setSlot] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0] || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || submitting) return;

    try {
      setSubmitting(true);
      const res = await createBookingServerFn({
        data: {
          name,
          phone,
          guests,
          date,
          time: slot,
        },
      });

      toast.success(`${t("booked")} Code: ${res.code} · ${res.date} @ ${res.time}`);
      setName("");
      setPhone("");
    } catch {
      toast.error("Failed to process reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-4xl px-5 py-12">
        <h1 className="text-3xl font-semibold md:text-4xl">{t("book_title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("book_sub")}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <form className="surface space-y-5 p-6" onSubmit={handleSubmit}>
            <Field label={t("name")}>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field"
                placeholder="Sarah Ahmed"
              />
            </Field>
            <Field label={t("phone")}>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field"
                placeholder="+44 7700 900123"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("date")}>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="field"
                />
              </Field>
              <Field label={t("guests")}>
                <div className="flex items-center gap-2">
                  {[1, 2, 4, 6, 8].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGuests(g)}
                      className={`size-10 rounded-lg border text-sm font-semibold ${
                        guests === g
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <Field label={t("time")}>
              <div className="flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                      slot === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Reserving..." : t("confirm")}
            </button>
          </form>

          <aside className="surface space-y-4 p-6 text-sm">
            <h2 className="text-lg font-semibold">The Copper Kettle</h2>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 text-accent" /> 42 High Street, Manchester M1
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4 text-accent" /> {t("wait_time")}: 14 {t("minutes")}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4 text-accent" /> 18 of 24 tables seated
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="size-4 text-accent" /> Synced with your Google listing
            </p>
            <div className="rounded-xl bg-secondary p-4 text-muted-foreground">
              Guests arriving from Google Maps skip straight to this page with their location and
              party size pre-filled.
            </div>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
