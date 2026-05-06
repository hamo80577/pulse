import type { ReactNode } from "react";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-10 text-[#111827]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[420px] flex-col justify-center">
        <section className="grid gap-7">
          <div className="grid gap-2 text-center">
            <h1 className="text-[15px] font-semibold uppercase leading-none tracking-[0.18em] text-[#132238]">
              Pulse
            </h1>
            <p className="text-[28px] font-semibold leading-tight tracking-normal text-[#0f172a]">
              {title}
            </p>
          </div>

          <div className="rounded-2xl border border-[#dbe3ee] bg-white/95 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
