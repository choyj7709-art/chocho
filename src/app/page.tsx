import Link from "next/link";

const menus = [
  {
    href: "/hr",
    label: "인사관리",
    description: "입/퇴사, 근태, 연차, 인사기록을 한곳에서 관리하세요.",
    accent: "from-sky-500 to-sky-600",
    ring: "group-hover:ring-sky-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={1.8}>
        <circle cx="12" cy="8" r="3.25" stroke="currentColor" />
        <path
          d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/affairs",
    label: "총무관리",
    description: "비품, 시설, 계약 등 원내 살림살이를 편리하게 처리하세요.",
    accent: "from-amber-500 to-amber-600",
    ring: "group-hover:ring-amber-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={1.8}>
        <rect x="4" y="8" width="16" height="11" rx="1.5" stroke="currentColor" />
        <path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8" stroke="currentColor" />
      </svg>
    ),
  },
  {
    href: "/design",
    label: "디자인",
    description: "브랜드 가이드, 서식, 안내물 디자인 자료를 모아서 관리하세요.",
    accent: "from-violet-500 to-violet-600",
    ring: "group-hover:ring-violet-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={1.8}>
        <path
          d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.7 1.5-1.4 0-.4-.15-.75-.4-1.02-.25-.28-.4-.63-.4-1.03 0-.72.58-1.3 1.3-1.3H15.5A3.5 3.5 0 0 0 19 11.75C19 6.9 15.5 3 12 3Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="7.2" r="1" fill="currentColor" stroke="none" />
        <circle cx="14.5" cy="7.2" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight text-slate-900">
            업무 지킴이
          </span>
          <span className="text-sm text-slate-400">사내 업무 포털</span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-sky-950 via-slate-900 to-slate-900 px-6 py-24 text-center sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,#38bdf8,transparent_45%),radial-gradient(circle_at_80%_0%,#34d399,transparent_40%)]"
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-sky-300">
            병의원 업무 지원 시스템
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            업무 지킴이
          </h1>
        </div>
      </section>

      <section className="mx-auto -mt-12 w-full max-w-5xl flex-1 px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {menus.map((menu) => (
            <Link
              key={menu.href}
              href={menu.href}
              className={`group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-900/5 ring-1 ring-transparent transition-all hover:-translate-y-1 hover:shadow-xl ${menu.ring}`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${menu.accent} text-white`}
              >
                {menu.icon}
              </span>
              <span className="text-lg font-bold text-slate-900">
                {menu.label}
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
