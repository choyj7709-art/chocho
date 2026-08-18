import Link from "next/link";
import type { ReactNode } from "react";

export type SubMenuItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

export default function SubMenuPage({
  title,
  items,
}: {
  title: string;
  items: SubMenuItem[];
}) {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-4 px-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
          >
            업무 지킴이
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-900">{title}</span>
        </div>
      </header>

      <section className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-900/5 ring-1 ring-transparent transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-violet-200"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                {item.icon}
              </span>
              <span className="text-lg font-bold text-slate-900">
                {item.label}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-400 transition-colors group-hover:text-slate-900">
                바로가기
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={2}
                >
                  <path
                    d="M4 10h12M12 6l4 4-4 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
