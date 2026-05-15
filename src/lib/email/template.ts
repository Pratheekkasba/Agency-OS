function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildEmailHtml(options: {
  headline: string;
  paragraphs: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  listSections?: { title: string; items: string[] }[];
  footerNote?: string;
}): string {
  const { headline, paragraphs, ctaLabel, ctaUrl, listSections, footerNote } = options;
  const year = new Date().getFullYear();

  const paragraphsHtml = paragraphs
    .map(
      (p) =>
        `<p style="color: #9CA3AF; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">${escapeHtml(p)}</p>`
    )
    .join("");

  const listsHtml =
    listSections
      ?.filter((s) => s.items.length > 0)
      .map(
        (s) => `
        <p style="color: #E5E7EB; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin: 20px 0 8px;">${escapeHtml(s.title)}</p>
        <ul style="margin: 0 0 16px; padding-left: 20px; color: #D1D5DB; font-size: 14px; line-height: 1.7;">
          ${s.items.map((item) => `<li style="margin-bottom: 6px;">${escapeHtml(item)}</li>`).join("")}
        </ul>`
      )
      .join("") ?? "";

  const ctaHtml =
    ctaLabel && ctaUrl
      ? `
        <div style="text-align: center; margin: 28px 0 24px;">
          <a href="${escapeHtml(ctaUrl)}" style="display: inline-block; background-color: #5B5CF6; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
            ${escapeHtml(ctaLabel)}
          </a>
        </div>`
      : "";

  const footerExtra = footerNote
    ? `<p style="color: #6B7280; font-size: 12px; line-height: 1.5; margin-top: 16px;">${escapeHtml(footerNote)}</p>`
    : "";

  return `
    <div style="font-family: 'Inter', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B0B0F; color: #FFFFFF; padding: 40px; border-radius: 16px; border: 1px solid #2D2D3D;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: 700; margin: 0; color: #FFFFFF;">
          Agency<span style="color: #5B5CF6;"> OS</span>
        </h1>
      </div>
      <div style="background-color: #131317; border: 1px solid #2D2D3D; border-radius: 12px; padding: 30px;">
        <h2 style="font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px; color: #FFFFFF;">${escapeHtml(headline)}</h2>
        ${paragraphsHtml}
        ${listsHtml}
        ${ctaHtml}
        ${footerExtra}
      </div>
      <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
        © ${year} Agency OS. All rights reserved.
      </div>
    </div>
  `;
}
