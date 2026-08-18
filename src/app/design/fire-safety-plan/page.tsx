"use client";

import Link from "next/link";
import { useState } from "react";

export default function FireSafetyPlanPage() {
  const [edgeColor, setEdgeColor] = useState("#1e3a8a");
  const [middleColor, setMiddleColor] = useState("#ffffff");

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
                className="shrink-0 basis-[10%]"
                style={{ backgroundColor: edgeColor }}
              />
              <div
                className="min-h-0 flex-1"
                style={{ backgroundColor: middleColor }}
              />
              <div
                className="shrink-0 basis-[12%]"
                style={{ backgroundColor: edgeColor }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
