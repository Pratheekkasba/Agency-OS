import { LegalPageShell } from "@/components/legal-page-shell";

export default function TermsOfServicePage() {
  return (
    <LegalPageShell title="Terms of Service">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Agreement</h2>
        <p>
          By using Agency OS, you agree to these Terms of Service. If you use the product on behalf
          of an organization, you represent that you have authority to bind that organization.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Use of the service</h2>
        <p>
          You may use Agency OS for lawful agency operations. You are responsible for content you
          upload, client communications, and compliance with applicable laws. Do not misuse the
          platform, attempt unauthorized access, or interfere with other users.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Client portals</h2>
        <p>
          Agencies issue unique Access IDs to clients. Clients must keep credentials confidential.
          Agencies control what project data is visible in each portal.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Limitation of liability</h2>
        <p>
          Agency OS is provided &quot;as is&quot; to the extent permitted by law. We are not liable
          for indirect or consequential damages arising from use of the service.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <p>
          Legal inquiries:{" "}
          <a href="mailto:legal@agency-os.tech" className="text-[#5B5CF6] hover:underline">
            legal@agency-os.tech
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
