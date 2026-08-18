"use client";

import Link from "next/link";
import { useState } from "react";

export default function FireSafetyPlanPage() {
  const [edgeColor, setEdgeColor] = useState("#1e3a8a");
  const [middleColor, setMiddleColor] = useState("#ffffff");
  const [floor, setFloor] = useState("2F");

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
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 pt-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            소방도면
          </h1>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              상단/하단 색상
              <input
                type="color"
                value={edgeColor}
                onChange={(e) => setEdgeColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-slate-300 p-0.5"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              중간 색상
              <input
                type="color"
                value={middleColor}
                onChange={(e) => setMiddleColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-slate-300 p-0.5"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              층수 표기
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="h-8 w-20 rounded border border-slate-300 px-2 text-sm font-semibold text-slate-900"
              />
            </label>
            <span className="text-sm font-medium text-slate-400">
              A3 · 420 × 297 mm
            </span>
          </div>
        </div>

        <div className="mt-6 flex-1 overflow-auto bg-slate-200/70 px-6 pb-16">
          <div className="mx-auto flex min-h-full w-full max-w-6xl items-start justify-center py-4">
            <div
              className="flex w-full shrink-0 flex-col overflow-hidden rounded-sm shadow-[0_8px_30px_rgba(15,23,42,0.15)]"
              style={{ maxWidth: "1587px", aspectRatio: "420 / 297" }}
            >
              <div
                className="relative flex shrink-0 basis-[15%] flex-col items-center justify-center gap-1"
                style={{ backgroundColor: edgeColor }}
              >
                <span className="text-[clamp(1.75rem,4.8vw,3.25rem)] font-extrabold tracking-[0.5em] text-white">
                  피난안내도
                </span>
                <span className="text-[clamp(0.65rem,1.4vw,1rem)] font-medium tracking-[0.15em] text-white/80">
                  Emergency Evacuation Plan
                </span>
                <span className="absolute right-[4%] top-1/2 -translate-y-1/2 text-[clamp(1rem,2.6vw,1.75rem)] font-extrabold text-white">
                  {floor}
                </span>
              </div>
              <div
                className="min-h-0 flex-1"
                style={{ backgroundColor: middleColor }}
              />
              <div
                className="shrink-0 basis-[10%]"
                style={{ backgroundColor: edgeColor }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
