import { LegalPageShell } from "@/components/legal-page-shell";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Overview</h2>
        <p>
          Agency OS (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy explains what
          information we collect, how we use it, and your choices when using our agency management
          platform and client portals.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Information we collect</h2>
        <p>
          We collect account information (name, email), agency and client workspace data you submit,
          and usage data needed to operate the service (authentication logs, device/browser metadata).
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">How we use information</h2>
        <p>
          We use your data to provide the product, secure accounts, send service-related emails,
          improve features, and comply with legal obligations. We do not sell personal information.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p>
          Questions about privacy? Email{" "}
          <a href="mailto:privacy@agency-os.tech" className="text-[#5B5CF6] hover:underline">
            privacy@agency-os.tech
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
