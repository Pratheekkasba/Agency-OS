import Link from "next/link";
import { LegalPageShell } from "@/components/legal-page-shell";
import { Mail, MessageCircle, BookOpen } from "lucide-react";

export default function SupportPage() {
  return (
    <LegalPageShell title="Support">
      <p>
        Need help with Agency OS? We&apos;re here for agencies and their clients using the platform.
      </p>

      <div className="grid gap-4">
        <a
          href="mailto:support@agency-os.tech"
          className="flex items-start gap-4 p-4 rounded-xl border border-[#1F1F2B] bg-[#131317] hover:border-[#5B5CF6]/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-[#5B5CF6]/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-[#5B5CF6]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Email support</p>
            <p className="text-[#6B7280] text-xs mt-1">support@agency-os.tech · Usually within 24 hours</p>
          </div>
        </a>

        <div className="flex items-start gap-4 p-4 rounded-xl border border-[#1F1F2B] bg-[#131317]">
          <div className="w-10 h-10 rounded-lg bg-[#5B5CF6]/10 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-[#5B5CF6]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Client Access ID issues</p>
            <p className="text-[#6B7280] text-xs mt-1">
              If your portal code (e.g. OS-XXXX) doesn&apos;t work, contact your agency directly —
              they can confirm or regenerate your Access ID.
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-start gap-4 p-4 rounded-xl border border-[#1F1F2B] bg-[#131317] hover:border-[#5B5CF6]/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-[#5B5CF6]/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-[#5B5CF6]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Sign in help</p>
            <p className="text-[#6B7280] text-xs mt-1">Return to login or role selection</p>
          </div>
        </Link>
      </div>
    </LegalPageShell>
  );
}
