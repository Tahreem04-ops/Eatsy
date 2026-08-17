import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SiteShell } from "@/components/site-shell";
import { useI18n } from "@/lib/i18n";
import { HEATMAP, HEATMAP_DAYS, HEATMAP_SLOTS } from "@/lib/menu-data";
import { getAnalyticsServerFn } from "@/server/api";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Eatsy Restaurant Insights" },
      {
        name: "description",
        content:
          "Dish heatmaps, peak trading hours, retention curves and commission saved — the numbers behind your high-street venue.",
      },
      { property: "og:title", content: "Analytics — Eatsy Restaurant Insights" },
      {
        property: "og:description",
        content: "Popular-dish heatmaps, peak times and customer retention in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { t } = useI18n();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    getAnalyticsServerFn()
      .then(setAnalytics)
      .catch((err) => console.error("Error loading analytics:", err));
  }, []);

  const max = Math.max(...HEATMAP.flat());

  const kpis = [
    { label: "Orders total", value: analytics ? String(analytics.totalOrdersCount) : "1,284", delta: "Live DB count" },
    { label: "Avg. order value", value: analytics ? `£${analytics.avgOrderValue.toFixed(2)}` : "£24.60", delta: "+£1.80" },
    { label: "Total Revenue", value: analytics ? `£${analytics.totalRevenue.toFixed(2)}` : "£4,120", delta: "Live revenue" },
    { label: "Commission saved", value: analytics ? `£${analytics.commissionSaved.toFixed(2)}` : "£1,236", delta: "vs 30% delivery fees" },
  ];

  const peakHours = analytics?.peakHours || [];
  const retention = analytics?.retention || [];
  const topDishes = analytics?.topDishes || [];
  const maxSold = topDishes[0]?.sold || 1;

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <h1 className="text-3xl font-semibold md:text-4xl">{t("analytics_title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("analytics_sub")}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="surface p-5">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <p className="font-display mt-2 text-3xl font-semibold">{k.value}</p>
              <p className="mt-1 text-xs font-semibold text-success">{k.delta}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Peak hours</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Bar dataKey="orders" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Customer retention</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-foreground)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="returning"
                    stroke="var(--color-chart-1)"
                    fill="var(--color-chart-1)"
                    fillOpacity={0.25}
                  />
                  <Area
                    type="monotone"
                    dataKey="new"
                    stroke="var(--color-chart-2)"
                    fill="var(--color-chart-2)"
                    fillOpacity={0.25}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Popular dish heatmap</h2>
            <p className="text-sm text-muted-foreground">Orders by day and service slot</p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[420px] border-separate border-spacing-1 text-xs">
                <thead>
                  <tr>
                    <th />
                    {HEATMAP_SLOTS.map((s) => (
                      <th key={s} className="pb-1 font-medium text-muted-foreground">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP.map((row, i) => (
                    <tr key={HEATMAP_DAYS[i]}>
                      <td className="pe-2 text-end font-medium text-muted-foreground">
                        {HEATMAP_DAYS[i]}
                      </td>
                      {row.map((v, j) => (
                        <td key={j}>
                          <div
                            className="grid h-10 place-items-center rounded-lg font-semibold"
                            style={{
                              backgroundColor: `color-mix(in oklab, var(--color-chart-1) ${Math.round(
                                (v / max) * 100,
                              )}%, var(--color-secondary))`,
                              color:
                                v / max > 0.55
                                  ? "var(--color-primary-foreground)"
                                  : "var(--color-foreground)",
                            }}
                          >
                            {v}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface p-6">
            <h2 className="text-lg font-semibold">Top dishes (Live DB)</h2>
            <ul className="mt-5 space-y-4">
              {topDishes.map((d: any) => (
                <li key={d.name}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-muted-foreground">
                      {d.sold} sold · £{d.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(d.sold / maxSold) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
