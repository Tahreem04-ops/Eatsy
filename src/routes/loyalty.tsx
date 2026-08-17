import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gift, Mail, MessageSquare, Share2, Sparkles, Star, Trophy, Phone } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-shell";
import { useI18n } from "@/lib/i18n";
import { getLoyaltyServerFn, claimLoyaltyOfferServerFn } from "@/server/api";
import type { LoyaltyMember } from "@/server/db";

export const Route = createFileRoute("/loyalty")({
  head: () => ({
    meta: [
      { title: "Loyalty & Referrals — Eatsy Guest Engine" },
      {
        name: "description",
        content:
          "Points, tiers and AI-picked SMS and email offers that bring guests back to your restaurant without paying a marketplace.",
      },
      { property: "og:title", content: "Loyalty & Referrals — Eatsy Guest Engine" },
      {
        property: "og:description",
        content: "Smart loyalty tiers, referral links and personalised offers sent by SMS or email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoyaltyPage,
});

const OFFERS = [
  {
    id: "off_1",
    title: "We miss you",
    body: "It's been 3 weeks. Claim 20% off your next tikka masala.",
    channel: "SMS",
    segment: "Lapsing regular",
    lift: "+34% return rate",
  },
  {
    id: "off_2",
    title: "Friday roast, sorted",
    body: "You ordered roast 3 Sundays in a row — complimentary side of Halloumi Fries.",
    channel: "Email",
    segment: "Weekly loyalist",
    lift: "+18% covers",
  },
  {
    id: "off_3",
    title: "Bring a friend",
    body: "Share your code KETTLE-AZ and both get a free dessert.",
    channel: "SMS",
    segment: "Referral ready",
    lift: "1.7 invites/guest",
  },
];

const TIERS = [
  { name: "Bronze", spend: "£0+", perk: "10 points per £1", icon: Star },
  { name: "Silver", spend: "£100+", perk: "Free side every 5th visit", icon: Gift },
  { name: "Gold", spend: "£400+", perk: "Priority tables + birthday meal", icon: Trophy },
];

function LoyaltyPage() {
  const { t } = useI18n();
  const [phone, setPhone] = useState("+447911123456");
  const [member, setMember] = useState<LoyaltyMember | null>(null);

  async function fetchLoyalty(searchPhone: string) {
    try {
      const data = await getLoyaltyServerFn({ data: { phone: searchPhone } });
      setMember(data);
    } catch (err) {
      console.error("Error loading loyalty:", err);
    }
  }

  useEffect(() => {
    fetchLoyalty(phone);
  }, []);

  const handleClaim = async (offerId: string, offerTitle: string) => {
    try {
      const updated = await claimLoyaltyOfferServerFn({ data: { phone, offerId } });
      setMember(updated);
      toast.success(`Reward claimed! ${offerTitle}`);
    } catch {
      toast.error("Failed to claim reward");
    }
  };

  const points = member?.points ?? 240;
  const progress = Math.min(100, Math.round((points / 1000) * 100));

  return (
    <SiteShell>
      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">{t("loyalty_title")}</h1>
            <p className="mt-2 text-muted-foreground">{t("loyalty_sub")}</p>
          </div>

          <div className="surface p-3 flex items-center gap-2">
            <Phone className="size-4 text-accent" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-transparent text-sm outline-none font-mono"
              placeholder="+447911123456"
            />
            <button
              onClick={() => fetchLoyalty(phone)}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
            >
              Lookup
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="ink-panel rounded-3xl p-7 shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-widest uppercase opacity-70">
                {member?.name || "Guest"}'s Points
              </p>
              <span className="rounded-full bg-accent/20 px-3 py-0.5 text-xs font-bold text-accent">
                {member?.tier || "Silver"} Tier
              </span>
            </div>
            <p className="font-display mt-2 text-5xl font-semibold">{points.toLocaleString()}</p>
            <p className="mt-1 text-sm opacity-70">
              Total Spent: £{(member?.totalSpent ?? 240).toFixed(2)} · Visits: {member?.visitCount ?? 7}
            </p>
            <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-[oklch(1_0_0_/_0.16)]">
              <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
            </div>
            <button
              onClick={() => toast.success("Referral link copied · KETTLE-AZ")}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
            >
              <Share2 className="size-4" /> Share referral code
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {TIERS.map(({ name, spend, perk, icon: Icon }) => (
              <article
                key={name}
                className={`surface p-5 ${member?.tier === name ? "border-accent ring-2 ring-accent/30" : ""}`}
              >
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-3 text-lg font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{spend}</p>
                <p className="mt-3 text-sm">{perk}</p>
              </article>
            ))}
          </div>
        </div>

        <h2 className="mt-14 flex items-center gap-2 text-2xl font-semibold">
          <Sparkles className="size-5 text-accent" /> Offers picked for your guests
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {OFFERS.map((o) => {
            const claimed = member?.claimedRewards.includes(o.id);
            return (
              <article key={o.id} className="surface flex flex-col p-6">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
                  {o.channel === "SMS" ? (
                    <MessageSquare className="size-3.5" />
                  ) : (
                    <Mail className="size-3.5" />
                  )}
                  {o.channel}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{o.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{o.body}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
                  <span className="text-muted-foreground">{o.segment}</span>
                  <span className="font-semibold text-success">{o.lift}</span>
                </div>
                <button
                  disabled={claimed}
                  onClick={() => handleClaim(o.id, o.title)}
                  className={`mt-4 rounded-full px-4 py-2 text-xs font-semibold ${
                    claimed
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  {claimed ? "Reward Claimed ✓" : "Claim Offer (50 pts)"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
