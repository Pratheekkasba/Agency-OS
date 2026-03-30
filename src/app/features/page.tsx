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

const sections = [
  {
    id: "client-portal",
    eyebrow: "Client Portal",
    title: "Give clients a live window into your work.",
    body: "Share a secure, always‑up‑to‑date portal instead of long email threads. Clients see what’s shipped, what’s in progress, and what’s next—without you writing a single status update.",
    bullets: [
      "Timeline view of every request and deliverable",
      "Approvals, comments, and files in one place",
      "Read‑only for clients, powerful for your team",
    ],
  },
  {
    id: "ai-inbox",
    eyebrow: "AI Inbox",
    title: "Your shared inbox, with a brain.",
    body: "Every message from Gmail, WhatsApp, Slack, and more lands in one AI‑powered inbox. Intent is tagged, priority is set, and a first draft is ready before you even open the thread.",
    bullets: [
      "Automatic intent and priority tagging",
      "AI‑drafted replies your team can approve",
      "Assignments so nothing slips through",
    ],
  },
  {
    id: "analytics",
    eyebrow: "Analytics",
    title: "See the real health of your agency.",
    body: "Go beyond gut feel. Track response times, workload, and client satisfaction so you can fix issues before they turn into churn.",
    bullets: [
      "Response time and SLAs by client",
      "Workload across your team and channels",
      "Signals on at‑risk accounts",
    ],
  },
  {
    id: "integrations",
    eyebrow: "Integrations",
    title: "Works with the tools you already use.",
    body: "Agency OS sits on top of your existing stack. Connect channels in minutes and keep your team in the tools they know.",
    bullets: [
      "Gmail, Slack, WhatsApp and more (with more coming)",
      "No complex setup or custom dev required",
      "Built to plug into your future workflows",
    ],
  },
];

export default function FeaturesPage() {
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

      <section className="pt-28 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.border}`,
              color: C.muted,
            }}
          >
            Product overview
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
            One system, four pillars.
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: C.muted,
              maxWidth: 540,
              margin: "0 auto",
            }}
          >
            Agency OS replaces your client portal, shared inbox, project tracker, and
            reporting stack with one platform designed for modern agencies.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-14 md:space-y-20">
          {sections.map((s, idx) => (
            <article
              key={s.id}
              id={s.id}
              className={`grid gap-8 md:gap-12 md:grid-cols-2 items-center ${
                idx % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-wide mb-4"
                  style={{
                    border: `1px solid ${C.border}`,
                    background: "rgba(15,23,42,0.7)",
                    color: C.muted,
                  }}
                >
                  {s.eyebrow}
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(1.6rem,3vw,2rem)",
                    lineHeight: 1.25,
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  {s.title}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: C.muted,
                    marginBottom: 16,
                  }}
                >
                  {s.body}
                </p>
                <ul className="space-y-2.5">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: C.muted }}
                    >
                      <span
                        className="mt-1 w-4 h-4 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 30%, #bfdbfe, #5b5cf6)",
                        }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Placeholder visual block for future UI/illustrations */}
              <div className="relative h-full">
                <div
                  className="h-full min-h-[220px] rounded-2xl border overflow-hidden relative"
                  style={{
                    borderColor: C.border,
                    background:
                      "radial-gradient(circle at top, rgba(91,92,246,0.18), transparent 60%) , #050816",
                    boxShadow: "0 22px 60px rgba(15,23,42,0.8)",
                  }}
                >
                  {s.id === "client-portal" ? (
                    <img 
                      src="/portal.png" 
                      alt="Client Portal Interface" 
                      className="w-full h-full object-cover object-left-top scale-105 transform origin-top"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full px-6 py-8">
                      <p
                        className="text-xs md:text-sm text-center"
                        style={{ color: C.muted, maxWidth: 260 }}
                      >
                        Future space for product visuals. For now, this page is focused
                        on clearly explaining how Agency OS works.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

