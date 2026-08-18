import Link from "next/link";

export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-50 px-6 py-24 text-center">
      <span className="text-sm font-semibold text-sky-600">준비중</span>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="max-w-md text-sm leading-6 text-slate-500">{description}</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
      >
        메인으로 돌아가기
      </Link>
    </div>
  );
}
