import { Navbar } from "@/components/ui/navbar";

const C = {
  bg: "#0B0B0F",
  surface: "#12121A",
  primary: "#5B5CF6",
  accent: "#8B5CF6",
  text: "#FFFFFF",
  muted: "#9CA3AF",
  border: "#1F1F2B",
};

const plans = [
  {
    name: "Starter",
    badge: "Free while in beta",
    price: "$0",
    cadence: "per month",
    highlight: "Perfect for solo founders and small teams getting started.",
    features: [
      "Unlimited client projects",
      "Client portal access",
      "Basic analytics",
      "Email support",
    ],
    cta: "Join Early Access",
    popular: true,
  },
  {
    name: "Pro",
    badge: "Coming soon",
    price: "$49",
    cadence: "per seat / month",
    highlight: "For growing agencies that want AI‑powered workflows.",
    features: [
      "Everything in Starter",
      "AI inbox triage",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Get Notified",
    popular: false,
  },
  {
    name: "Enterprise",
    badge: "Custom",
    price: "Let’s talk",
    cadence: "",
    highlight: "For larger teams with security, compliance, and custom needs.",
    features: [
      "Dedicated onboarding",
      "Security review & SSO",
      "Custom integrations",
      "Dedicated success manager",
    ],
    cta: "Talk to us",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Space Grotesk', sans-serif",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      <section className="pt-28 pb-20 md:pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <p
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.border}`,
              color: C.muted,
            }}
          >
            Simple, transparent pricing
          </p>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.1rem,4.2vw,2.8rem)",
              lineHeight: 1.2,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Simple, transparent pricing.
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: C.muted,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Start free while we’re in early access. As we ship more, pricing
            scales with the value you unlock.
          </p>
          <p
            className="mt-4 text-sm"
            style={{ color: "#6b7280" }}
          >
            Early users get lifetime benefits on future paid plans.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-6 md:p-7 flex flex-col h-full"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                boxShadow: plan.popular
                  ? "0 0 32px rgba(91,92,246,0.25)"
                  : "none",
              }}
            >
              <div
                className="absolute top-0 left-0 w-full h-px"
                style={{
                  background: plan.popular
                    ? `linear-gradient(90deg, transparent, ${C.primary}80, ${C.accent}70, transparent)`
                    : `linear-gradient(90deg, transparent, ${C.border}, transparent)`,
                }}
              />
              <div className="flex items-center justify-between mb-3">
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {plan.name}
                </h2>
                <span
                  className="px-2.5 py-1 rounded-full text-[11px]"
                  style={{
                    border: `1px solid ${
                      plan.popular ? `${C.primary}60` : "rgba(148,163,184,0.2)"
                    }`,
                    backgroundColor: plan.popular
                      ? `${C.primary}22`
                      : "rgba(15,23,42,0.7)",
                    color: plan.popular ? C.primary : C.muted,
                  }}
                >
                  {plan.badge}
                </span>
              </div>

              <div className="mb-3">
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 28,
                    fontWeight: 700,
                  }}
                >
                  {plan.price}
                </div>
                {plan.cadence && (
                  <p
                    style={{
                      fontSize: 13,
                      color: C.muted,
                    }}
                  >
                    {plan.cadence}
                  </p>
                )}
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: C.muted,
                  lineHeight: 1.6,
                }}
                className="mb-5"
              >
                {plan.highlight}
              </p>

              <ul className="flex-1 flex flex-col gap-2 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: C.muted }}
                  >
                    <span
                      className="mt-1 w-3 h-3 rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, #bbf7d0, #22c55e)",
                      }}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
                style={{
                  backgroundColor: plan.name === "Starter" ? C.primary : "transparent",
                  color: plan.name === "Starter" ? "#ffffff" : C.muted,
                  border:
                    plan.name === "Starter"
                      ? "none"
                      : `1px solid ${C.border}`,
                  boxShadow:
                    plan.name === "Starter"
                      ? "0 0 20px rgba(91,92,246,0.3)"
                      : "none",
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-10 text-center">
          <p
            style={{
              fontSize: 12,
              color: "#4b5563",
            }}
          >
            Pricing will evolve as we launch more capabilities. Early customers
            lock in preferential pricing and lifetime benefits.
          </p>
        </div>
      </section>
    </main>
  );
}

