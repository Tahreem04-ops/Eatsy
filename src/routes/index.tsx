import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  QrCode,
  Radio,
  Sparkles,
  Languages,
  BarChart3,
  MapPin,
  Clock,
  ArrowRight,
  PoundSterling,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eatsy — Commission-Free Ordering for UK Restaurants" },
      {
        name: "description",
        content:
          "QR table ordering, live stock, loyalty and analytics for UK high-street restaurants, pubs and takeaways. Keep 100% of every order.",
      },
      { property: "og:title", content: "Eatsy — Commission-Free Ordering for UK Restaurants" },
      {
        property: "og:description",
        content:
          "Replace third-party delivery apps with your own digital twin: QR ordering, real-time menus, loyalty and analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useI18n();
  const [wait, setWait] = useState(14);

  useEffect(() => {
    const id = setInterval(() => setWait((w) => Math.max(6, Math.min(28, w + (Math.random() > 0.5 ? 1 : -1)))), 4000);
    return () => clearInterval(id);
  }, []);

  const features = [
    { icon: QrCode, k: "f1" },
    { icon: Radio, k: "f2" },
    { icon: Sparkles, k: "f3" },
    { icon: Languages, k: "f4" },
    { icon: BarChart3, k: "f5" },
    { icon: MapPin, k: "f6" },
  ];

  return (
    <SiteShell>
      <section className="hero-wash">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <PoundSterling className="size-3.5" /> {t("hero_kicker")}
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-semibold md:text-6xl">
              {t("hero_title")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
              >
                {t("cta_order")} <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                {t("cta_book")}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-accent" /> {t("wait_time")}:{" "}
                <strong className="text-foreground">
                  {wait} {t("minutes")}
                </strong>
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-accent" /> {t("detected")}: Manchester M1
              </span>
            </div>
          </div>

          <div className="ink-panel rounded-3xl p-7 shadow-[var(--shadow-lift)]">
            <p className="text-xs font-semibold tracking-widest uppercase opacity-70">Commission saved</p>
            <p className="font-display mt-2 text-5xl font-semibold">£4,120</p>
            <p className="mt-1 text-sm opacity-70">this month vs 30% marketplace fees</p>
            <div className="mt-7 space-y-3">
              {[
                { l: "Direct orders", v: "1,284" },
                { l: "Repeat guests", v: "63%" },
                { l: "Avg. order value", v: "£24.60" },
                { l: "Tables live now", v: "18 / 24" },
              ].map((r) => (
                <div
                  key={r.l}
                  className="flex items-center justify-between rounded-xl bg-[oklch(1_0_0_/_0.08)] px-4 py-3 text-sm"
                >
                  <span className="opacity-80">{r.l}</span>
                  <span className="font-semibold">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-20">
        <h2 className="text-3xl font-semibold md:text-4xl">{t("feat_title")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, k }) => (
            <article key={k} className="surface p-6 transition-shadow hover:shadow-[var(--shadow-lift)]">
              <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{t(k)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`${k}d`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="surface flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Scan. Order. Done.</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Every table gets its own code. Guests land on the menu with the table already selected —
              no app, no account, no commission.
            </p>
          </div>
          <Link
            to="/menu"
            search={{ table: "12" }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
          >
            <QrCode className="size-4" /> Try table 12
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
