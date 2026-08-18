import Link from "next/link";

export default function FireSafetyPlanPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
          >
            업무 지킴이
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href="/design"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
          >
            디자인
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-900">소방도면</span>
        </div>
      </header>

      <section className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            소방도면
          </h1>
          <span className="text-sm font-medium text-slate-400">
            A3 · 420 × 297 mm
          </span>
        </div>

        <div className="mt-6 flex-1 overflow-auto bg-slate-200/70 px-6 pb-16">
          <div className="mx-auto flex min-h-full w-full max-w-6xl items-start justify-center py-4">
            <div
              className="w-full shrink-0 rounded-sm bg-white shadow-[0_8px_30px_rgba(15,23,42,0.15)]"
              style={{ maxWidth: "1587px", aspectRatio: "420 / 297" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
