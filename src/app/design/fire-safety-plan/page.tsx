"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { ChangeEvent, PointerEvent, ReactNode, RefObject } from "react";

const evacuationSteps: ReactNode[] = [
  <>&quot;불이야&quot;라고 크게 외치십시오.</>,
  <>
    <strong className="font-bold">발신기(비상벨)</strong>를 누르십시오.
  </>,
  <>
    <strong className="font-bold">낮은 자세</strong>로 피난안내도의 피난 동선을
    따라 신속하게 대피하십시오.
  </>,
];

const extinguisherSteps: ReactNode[] = [
  <>
    소화기를 바닥에 내려놓고 손잡이의 <strong className="font-bold">안전핀</strong>
    을 뽑는다.
  </>,
  <>
    한손은 <strong className="font-bold">손잡이</strong>, 다른 한손은{" "}
    <strong className="font-bold">호스</strong>를 잡는다.
  </>,
  <>
    손잡이를 힘껏 누르고 <strong className="font-bold">빗자루로 쓸듯이</strong>{" "}
    방사한다.
  </>,
];

function StepList({ title, steps }: { title: string; steps: ReactNode[] }) {
  return (
    <div>
      <div className="flex items-center gap-[0.6vw] border-b-2 border-red-600 pb-[0.6vw]">
        <span className="h-[0.9vw] w-[0.9vw] shrink-0 rounded-full bg-red-600" />
        <span className="text-[clamp(0.95rem,1.9vw,1.4rem)] font-extrabold tracking-tight text-red-600">
          {title}
        </span>
      </div>
      <ol className="mt-[1.2vw] flex flex-col gap-[1.1vw]">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-[0.8vw]">
            <span className="flex h-[1.7vw] w-[1.7vw] shrink-0 items-center justify-center rounded-full bg-red-600 text-[0.95vw] font-bold text-white">
              {i + 1}
            </span>
            <span className="pt-[0.1vw] text-[clamp(0.7rem,1.35vw,0.95rem)] leading-[1.55] text-slate-800">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const legendItems: { label: string; bg: string; icon: ReactNode }[] = [
  {
    label: "현위치",
    bg: "#2563eb",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]">
        <circle cx="12" cy="12" r="7" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "피난경로",
    bg: "#dc2626",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[60%] w-[60%]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12h13M12 6l7 6-7 6" />
      </svg>
    ),
  },
  {
    label: "비상구",
    bg: "#16a34a",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[62%] w-[62%]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="8" height="16" rx="0.6" />
        <path d="M12 12h7m0 0-3-3m3 3-3 3" />
      </svg>
    ),
  },
  {
    label: "소화기",
    bg: "#dc2626",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[62%] w-[62%]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="7" width="6" height="12" rx="2" />
        <rect x="10.4" y="4" width="3.2" height="3" rx="0.5" />
        <path d="M9 11H6.2a1 1 0 0 0-1 1v1.3" />
        <path d="M4.8 14 3.3 17.5" />
      </svg>
    ),
  },
  {
    label: "완강기",
    bg: "#2563eb",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-[62%] w-[62%]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="6.5" r="2" fill="currentColor" stroke="none" />
        <path d="M9 8.7v3" />
        <path d="M9 11.7c-2.2 0-3.4 1.4-3.4 3.4v3" />
        <circle cx="16" cy="7" r="2.4" />
      </svg>
    ),
  },
];

function LegendDisplayItem({
  label,
  bg,
  icon,
}: {
  label: string;
  bg: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-[0.5vw]">
      <span
        className="flex aspect-square w-[3.3vw] min-w-[30px] items-center justify-center rounded-[0.4vw] border-2"
        style={{ color: bg, borderColor: bg }}
      >
        {icon}
      </span>
      <span className="text-[clamp(0.55rem,1vw,0.75rem)] font-semibold text-slate-800">
        {label}
      </span>
    </div>
  );
}

function PlaceButton({
  label,
  bg,
  icon,
  onClick,
}: {
  label: string;
  bg: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${label} 배치`}
      className="flex h-8 w-8 items-center justify-center rounded transition-transform hover:-translate-y-0.5 hover:bg-slate-100"
      style={{ color: bg }}
    >
      {icon}
    </button>
  );
}

type PlacedIcon = { id: string; label: string; x: number; y: number };

function PlacedMarker({
  marker,
  bg,
  icon,
  canvasRef,
  onMove,
  onRemove,
}: {
  marker: PlacedIcon;
  bg: string;
  icon: ReactNode;
  canvasRef: RefObject<HTMLDivElement | null>;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
}) {
  const dragging = useRef(false);

  function updatePosition(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    onMove(marker.id, x, y);
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    updatePosition(e.clientX, e.clientY);
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      className="absolute flex aspect-square w-[2.4vw] min-w-[22px] -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab items-center justify-center active:cursor-grabbing"
      style={{ left: `${marker.x}%`, top: `${marker.y}%`, color: bg }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={() => onRemove(marker.id)}
      title="드래그로 이동 · 더블클릭으로 삭제"
    >
      {icon}
    </div>
  );
}

export default function FireSafetyPlanPage() {
  const [edgeColor, setEdgeColor] = useState("#1e3a8a");
  const [middleColor, setMiddleColor] = useState("#ffffff");
  const [floor, setFloor] = useState("2F");
  const [planImage, setPlanImage] = useState<string | null>(null);
  const [placedIcons, setPlacedIcons] = useState<PlacedIcon[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPlanImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function addMarker(label: string) {
    const id = `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setPlacedIcons((prev) => [...prev, { id, label, x: 50, y: 50 }]);
  }

  function moveMarker(id: string, x: number, y: number) {
    setPlacedIcons((prev) =>
      prev.map((m) => (m.id === id ? { ...m, x, y } : m))
    );
  }

  function removeMarker(id: string) {
    setPlacedIcons((prev) => prev.filter((m) => m.id !== id));
  }

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
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
              도면 이미지
              <span className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                업로드
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </span>
            </label>
            {planImage && (
              <button
                type="button"
                onClick={() => setPlanImage(null)}
                className="text-sm font-medium text-slate-400 hover:text-red-600"
              >
                이미지 제거
              </button>
            )}
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              아이콘 배치
              <div className="flex items-center gap-1.5">
                {legendItems.map((item) => (
                  <PlaceButton
                    key={item.label}
                    label={item.label}
                    bg={item.bg}
                    icon={item.icon}
                    onClick={() => addMarker(item.label)}
                  />
                ))}
              </div>
            </div>
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
                <span
                  className="inline-block text-[clamp(1.75rem,4.8vw,3.25rem)] font-extrabold tracking-[0.5em] text-white"
                  style={{ marginRight: "-0.5em" }}
                >
                  피난안내도
                </span>
                <span
                  className="inline-block text-[clamp(0.8rem,1.7vw,1.2rem)] font-medium tracking-[0.15em] text-white/80"
                  style={{ marginRight: "-0.15em" }}
                >
                  Emergency Evacuation Plan
                </span>
                <span className="absolute right-[4%] top-1/2 -translate-y-1/2 text-[clamp(2rem,5.2vw,3.5rem)] font-extrabold text-white">
                  {floor}
                </span>
              </div>
              <div
                className="flex min-h-0 flex-1"
                style={{ backgroundColor: middleColor }}
              >
                <div className="flex basis-[25%] flex-col gap-[2.2vw] border-r border-slate-200 px-[1.6vw] py-[2vw]">
                  <StepList title="화재시 대피방법" steps={evacuationSteps} />
                  <StepList title="소화기 사용방법" steps={extinguisherSteps} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div
                    ref={canvasRef}
                    className="relative min-h-0 flex-1 overflow-hidden"
                    style={
                      planImage
                        ? undefined
                        : {
                            backgroundImage:
                              "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
                            backgroundSize: "5% 5%",
                          }
                    }
                  >
                    {planImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={planImage}
                        alt="업로드한 소방도면"
                        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                      />
                    ) : (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[2vw] text-center">
                        <span className="text-[clamp(0.7rem,1.3vw,0.95rem)] font-medium text-slate-400">
                          위 &quot;도면 이미지&quot;에서 파일을 업로드하세요
                        </span>
                      </div>
                    )}
                    {placedIcons.map((marker) => {
                      const meta = legendItems.find(
                        (item) => item.label === marker.label
                      );
                      if (!meta) return null;
                      return (
                        <PlacedMarker
                          key={marker.id}
                          marker={marker}
                          bg={meta.bg}
                          icon={meta.icon}
                          canvasRef={canvasRef}
                          onMove={moveMarker}
                          onRemove={removeMarker}
                        />
                      );
                    })}
                  </div>
                  <div className="flex shrink-0 items-end justify-center gap-[3vw] border-t border-slate-200 px-[1.5vw] py-[1.3vw]">
                    {legendItems.map((item) => (
                      <LegendDisplayItem key={item.label} {...item} />
                    ))}
                  </div>
                </div>
              </div>
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
