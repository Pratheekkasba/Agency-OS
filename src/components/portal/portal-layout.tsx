"use client";

export function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .glass-dock {
              background: rgba(37, 37, 43, 0.6);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
          }
          .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
              font-size: 1.25rem;
          }
          .step-line {
              position: absolute;
              left: 11px;
              top: 24px;
              bottom: -24px;
              width: 1px;
              background: rgba(45, 45, 53, 0.5);
              z-index: 0;
          }
          .step-line-last { display: none; }
          `,
        }}
      />
      <div className="bg-[#0B0B0F] text-[#fcf8fe] font-body min-h-screen selection:bg-primary/30 antialiased relative">
        {children}
      </div>
    </>
  );
}
