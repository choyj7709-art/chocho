"use client";

import Link from "next/link";
import { useState } from "react";

type AttendanceStatus = "정상" | "지각" | "조퇴" | "결근" | "연차" | "휴일근무";

type AttendanceRecord = {
  id: string;
  date: string;
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  note: string;
};

const statuses: AttendanceStatus[] = ["정상", "지각", "조퇴", "결근", "연차", "휴일근무"];

const statusColors: Record<AttendanceStatus, string> = {
  정상: "#16a34a",
  지각: "#f59e0b",
  조퇴: "#f59e0b",
  결근: "#dc2626",
  연차: "#2563eb",
  휴일근무: "#7c3aed",
};

const initialRecords: AttendanceRecord[] = [
  {
    id: "1",
    date: "2026-08-17",
    name: "김하늘",
    department: "진료부",
    checkIn: "08:55",
    checkOut: "18:02",
    status: "정상",
    note: "",
  },
  {
    id: "2",
    date: "2026-08-17",
    name: "박서준",
    department: "간호부",
    checkIn: "09:12",
    checkOut: "18:05",
    status: "지각",
    note: "대중교통 지연",
  },
  {
    id: "3",
    date: "2026-08-17",
    name: "이수아",
    department: "원무과",
    checkIn: "",
    checkOut: "",
    status: "연차",
    note: "개인 사유",
  },
  {
    id: "4",
    date: "2026-08-18",
    name: "최민재",
    department: "시설팀",
    checkIn: "",
    checkOut: "",
    status: "결근",
    note: "미승인",
  },
];

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

function toMinutes(time: string): number | null {
  if (!time || !time.includes(":")) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

function workHoursLabel(checkIn: string, checkOut: string): string {
  const start = toMinutes(checkIn);
  const end = toMinutes(checkOut);
  if (start === null || end === null || end <= start) return "-";
  return `${Math.round(((end - start) / 60) * 10) / 10}h`;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);

  function updateRecord<K extends keyof AttendanceRecord>(
    id: string,
    key: K,
    value: AttendanceRecord[K]
  ) {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  function addRecord() {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const today = new Date().toISOString().slice(0, 10);
    setRecords((prev) => [
      ...prev,
      {
        id,
        date: today,
        name: "",
        department: "",
        checkIn: "",
        checkOut: "",
        status: "정상",
        note: "",
      },
    ]);
  }

  function removeRecord(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  const sortedRecords = [...records].sort((a, b) => (a.date < b.date ? 1 : -1));

  const totalCount = records.length;
  const statusCounts = records.reduce<Record<AttendanceStatus, number>>(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { 정상: 0, 지각: 0, 조퇴: 0, 결근: 0, 연차: 0, 휴일근무: 0 }
  );
  const attendanceRate =
    totalCount > 0
      ? Math.round(((totalCount - statusCounts.결근) / totalCount) * 1000) / 10
      : 0;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6">
          <Link href="/" className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700">
            업무 지킴이
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/hr" className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700">
            인사관리
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-900">직원 근태 정리</span>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">직원 근태 정리</h1>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="전체 기록" value={`${totalCount}건`} />
          <StatCard label="출근율" value={`${attendanceRate}%`} sub="결근 제외" />
          {statuses.map((s) => (
            <StatCard key={s} label={s} value={`${statusCounts[s]}건`} />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">근태 기록</h2>
            <button
              type="button"
              onClick={addRecord}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              + 기록 추가
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 pr-2 font-medium">날짜</th>
                  <th className="pb-2 pr-2 font-medium">성명</th>
                  <th className="pb-2 pr-2 font-medium">부서</th>
                  <th className="pb-2 pr-2 font-medium">출근</th>
                  <th className="pb-2 pr-2 font-medium">퇴근</th>
                  <th className="pb-2 pr-2 font-medium">근무시간</th>
                  <th className="pb-2 pr-2 font-medium">상태</th>
                  <th className="pb-2 pr-2 font-medium">비고</th>
                  <th className="pb-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-1.5 pr-2">
                      <input
                        type="date"
                        value={r.date}
                        onChange={(e) => updateRecord(r.id, "date", e.target.value)}
                        className="h-8 rounded border border-slate-200 px-1.5 text-slate-800"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        value={r.name}
                        onChange={(e) => updateRecord(r.id, "name", e.target.value)}
                        placeholder="이름"
                        className="h-8 w-20 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        value={r.department}
                        onChange={(e) => updateRecord(r.id, "department", e.target.value)}
                        placeholder="부서"
                        className="h-8 w-20 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        type="time"
                        value={r.checkIn}
                        onChange={(e) => updateRecord(r.id, "checkIn", e.target.value)}
                        className="h-8 rounded border border-slate-200 px-1.5 text-slate-800"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        type="time"
                        value={r.checkOut}
                        onChange={(e) => updateRecord(r.id, "checkOut", e.target.value)}
                        className="h-8 rounded border border-slate-200 px-1.5 text-slate-800"
                      />
                    </td>
                    <td className="py-1.5 pr-2 text-slate-600">
                      {workHoursLabel(r.checkIn, r.checkOut)}
                    </td>
                    <td className="py-1.5 pr-2">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          updateRecord(r.id, "status", e.target.value as AttendanceStatus)
                        }
                        className="h-8 rounded border px-1.5 font-medium"
                        style={{
                          color: statusColors[r.status],
                          borderColor: statusColors[r.status],
                        }}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        value={r.note}
                        onChange={(e) => updateRecord(r.id, "note", e.target.value)}
                        placeholder="비고"
                        className="h-8 w-32 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5">
                      <button
                        type="button"
                        onClick={() => removeRecord(r.id)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedRecords.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-400">
                      등록된 근태 기록이 없습니다. &quot;+ 기록 추가&quot;로 시작하세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
