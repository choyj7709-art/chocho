"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { readSheet } from "read-excel-file/browser";

type UsageRow = {
  date: Date;
  department: string;
  item: string;
  quantity: number;
};

type GroupStat = {
  department: string;
  item: string;
  thisMonthTotal: number;
  lastMonthTotal: number;
  diff: number;
  diffRate: number | null;
};

type ItemPivotRow = {
  item: string;
  byDept: Record<string, number>;
  totalThisMonth: number;
  totalLastMonth: number;
  diff: number;
  diffRate: number | null;
};

const DATE_HEADERS = ["날짜", "일자", "사용일자", "사용일"];
const DEPT_HEADERS = ["부서명", "부서", "창고명", "창고"];
const ITEM_HEADERS = ["품목명", "품목", "물품명", "물품"];
const QTY_HEADERS = ["사용량", "수량", "사용수량"];

function findColumnIndex(headers: string[], candidates: string[]): number {
  return headers.findIndex((h) =>
    candidates.some((c) => String(h ?? "").trim().includes(c))
  );
}

type HeaderMatch = {
  headerRowIndex: number;
  dateIdx: number;
  deptIdx: number;
  itemIdx: number;
  qtyIdx: number;
};

function findHeaderRow(sheet: unknown[][]): HeaderMatch | null {
  const scanLimit = Math.min(sheet.length, 10);
  for (let i = 0; i < scanLimit; i++) {
    const headers = sheet[i].map((h) => String(h ?? "").trim());
    const dateIdx = findColumnIndex(headers, DATE_HEADERS);
    const deptIdx = findColumnIndex(headers, DEPT_HEADERS);
    const itemIdx = findColumnIndex(headers, ITEM_HEADERS);
    const qtyIdx = findColumnIndex(headers, QTY_HEADERS);
    if (dateIdx !== -1 && deptIdx !== -1 && itemIdx !== -1 && qtyIdx !== -1) {
      return { headerRowIndex: i, dateIdx, deptIdx, itemIdx, qtyIdx };
    }
  }
  return null;
}

function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    epoch.setUTCDate(epoch.getUTCDate() + value);
    return Number.isNaN(epoch.getTime()) ? null : epoch;
  }
  if (typeof value === "string") {
    // Handles plain dates as well as formats like "2026/06/01 -1" (date + line no.)
    const match = value.match(/(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})/);
    if (match) {
      const [, y, m, d] = match;
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const parsed = new Date(value.trim());
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString();
}

type DeptUsage = {
  department: string;
  thisMonth: number;
  lastMonth: number;
  diff: number;
  diffRate: number | null;
};

function DiffBadge({ diff, diffRate }: { diff: number; diffRate: number | null }) {
  if (diffRate === null) {
    return <span className="font-semibold text-sky-600">신규</span>;
  }
  if (diff === 0) {
    return <span className="text-slate-400">변동 없음</span>;
  }
  return (
    <span className={`font-semibold ${diff > 0 ? "text-red-600" : "text-blue-600"}`}>
      {diff > 0 ? "▲" : "▼"} {formatNumber(Math.abs(diff))} ({diff > 0 ? "+" : ""}
      {formatNumber(diffRate)}%)
    </span>
  );
}

function ItemUsageDashboard({
  itemLabel,
  data,
  currentMonthLabel,
  previousMonthLabel,
}: {
  itemLabel: string;
  data: DeptUsage[];
  currentMonthLabel: string;
  previousMonthLabel: string;
}) {
  const maxValue = Math.max(1, ...data.flatMap((d) => [d.thisMonth, d.lastMonth]));
  const totalThisMonth = data.reduce((sum, d) => sum + d.thisMonth, 0);
  const totalLastMonth = data.reduce((sum, d) => sum + d.lastMonth, 0);
  const totalDiff = totalThisMonth - totalLastMonth;
  const totalDiffRate = totalLastMonth > 0 ? (totalDiff / totalLastMonth) * 100 : totalThisMonth > 0 ? null : 0;

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900">
          &quot;{itemLabel}&quot; 창고별 사용량
          <span className="ml-2 font-normal text-slate-400">
            {currentMonthLabel} vs {previousMonthLabel}
          </span>
        </h2>
        <div className="text-sm">
          <span className="font-semibold text-slate-900">{formatNumber(totalThisMonth)}개</span>
          <span className="ml-2">
            <DiffBadge diff={totalDiff} diffRate={totalDiffRate} />
          </span>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {data.map((d) => (
          <div key={d.department}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">{d.department}</span>
              <DiffBadge diff={d.diff} diffRate={d.diffRate} />
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="w-10 shrink-0 text-[11px] text-slate-400">이번달</span>
              <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: `${(d.thisMonth / maxValue) * 100}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs font-semibold text-slate-700">
                {formatNumber(d.thisMonth)}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="w-10 shrink-0 text-[11px] text-slate-400">지난달</span>
              <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-300"
                  style={{ width: `${(d.lastMonth / maxValue) * 100}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs font-semibold text-slate-500">
                {formatNumber(d.lastMonth)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SupplyUsagePage() {
  const [rows, setRows] = useState<UsageRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("전체");
  const [dashboardQuery, setDashboardQuery] = useState("");
  const [listQuery, setListQuery] = useState("");

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setLoading(true);
    setFileName(file.name);
    try {
      const sheet = await readSheet(file);
      if (sheet.length < 2) {
        throw new Error("데이터가 없습니다. 헤더와 데이터 행이 필요합니다.");
      }
      const headerMatch = findHeaderRow(sheet);
      if (!headerMatch) {
        throw new Error(
          "필수 열을 찾을 수 없습니다. 날짜/부서명(창고명)/품목명/사용량 열이 필요합니다."
        );
      }
      const { headerRowIndex, dateIdx, deptIdx, itemIdx, qtyIdx } = headerMatch;

      const parsed: UsageRow[] = [];
      for (const r of sheet.slice(headerRowIndex + 1)) {
        const date = parseDateValue(r[dateIdx]);
        const department = String(r[deptIdx] ?? "").trim();
        const item = String(r[itemIdx] ?? "").trim();
        const quantity = Number(r[qtyIdx]);
        if (!date || !department || !item || !Number.isFinite(quantity)) continue;
        parsed.push({ date, department, item, quantity });
      }

      if (parsed.length === 0) {
        throw new Error("읽을 수 있는 유효한 데이터 행이 없습니다.");
      }

      setRows(parsed);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : "파일을 읽는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const { groups, departments, itemNameOptions, currentMonthLabel, previousMonthLabel } = useMemo(() => {
    if (rows.length === 0) {
      return {
        groups: [] as GroupStat[],
        departments: [] as string[],
        itemNameOptions: [] as string[],
        currentMonthLabel: "",
        previousMonthLabel: "",
      };
    }

    const maxDate = rows.reduce((max, r) => (r.date > max ? r.date : max), rows[0].date);
    const currentKey = monthKey(maxDate);
    const prevDate = new Date(maxDate.getFullYear(), maxDate.getMonth() - 1, 1);
    const prevKey = monthKey(prevDate);

    const byGroup = new Map<string, { department: string; item: string; thisMonth: number; lastMonth: number }>();
    for (const r of rows) {
      const key = `${r.department}__${r.item}`;
      const entry = byGroup.get(key) ?? { department: r.department, item: r.item, thisMonth: 0, lastMonth: 0 };
      const rKey = monthKey(r.date);
      if (rKey === currentKey) entry.thisMonth += r.quantity;
      else if (rKey === prevKey) entry.lastMonth += r.quantity;
      byGroup.set(key, entry);
    }

    const groupStats: GroupStat[] = Array.from(byGroup.values()).map((g) => {
      const diff = g.thisMonth - g.lastMonth;
      const diffRate = g.lastMonth > 0 ? (diff / g.lastMonth) * 100 : g.thisMonth > 0 ? null : 0;
      return {
        department: g.department,
        item: g.item,
        thisMonthTotal: g.thisMonth,
        lastMonthTotal: g.lastMonth,
        diff,
        diffRate,
      };
    });

    groupStats.sort((a, b) =>
      a.department === b.department
        ? a.item.localeCompare(b.item)
        : a.department.localeCompare(b.department)
    );

    const deptList = Array.from(new Set(rows.map((r) => r.department))).sort();
    const itemNames = Array.from(new Set(rows.map((r) => r.item))).sort();

    return {
      groups: groupStats,
      departments: deptList,
      itemNameOptions: itemNames,
      currentMonthLabel: `${maxDate.getFullYear()}년 ${maxDate.getMonth() + 1}월`,
      previousMonthLabel: `${prevDate.getFullYear()}년 ${prevDate.getMonth() + 1}월`,
    };
  }, [rows]);

  const itemRows = useMemo(() => {
    const byItem = new Map<string, ItemPivotRow>();
    for (const g of groups) {
      const row =
        byItem.get(g.item) ??
        ({ item: g.item, byDept: {}, totalThisMonth: 0, totalLastMonth: 0, diff: 0, diffRate: 0 } as ItemPivotRow);
      row.byDept[g.department] = (row.byDept[g.department] ?? 0) + g.thisMonthTotal;
      row.totalThisMonth += g.thisMonthTotal;
      row.totalLastMonth += g.lastMonthTotal;
      byItem.set(g.item, row);
    }
    const list = Array.from(byItem.values()).map((row) => {
      const diff = row.totalThisMonth - row.totalLastMonth;
      const diffRate =
        row.totalLastMonth > 0 ? (diff / row.totalLastMonth) * 100 : row.totalThisMonth > 0 ? null : 0;
      return { ...row, diff, diffRate };
    });
    list.sort((a, b) => a.item.localeCompare(b.item));
    return list;
  }, [groups]);

  const filteredItemRows = itemRows.filter((row) => {
    const deptOk = departmentFilter === "전체" || (row.byDept[departmentFilter] ?? 0) > 0;
    const itemOk = listQuery.trim() === "" || row.item === listQuery.trim();
    return deptOk && itemOk;
  });

  const itemDashboardData = useMemo(() => {
    const term = dashboardQuery.trim();
    if (!term) return null;
    // Requires an exact item name match (picked from the datalist) so that
    // similarly-named items with different specs aren't mixed together.
    const matched = groups.filter((g) => g.item === term);
    if (matched.length === 0) return null;

    const byDept = new Map<string, { department: string; thisMonth: number; lastMonth: number }>();
    for (const g of matched) {
      const e = byDept.get(g.department) ?? { department: g.department, thisMonth: 0, lastMonth: 0 };
      e.thisMonth += g.thisMonthTotal;
      e.lastMonth += g.lastMonthTotal;
      byDept.set(g.department, e);
    }

    const list: DeptUsage[] = Array.from(byDept.values())
      .map((e) => {
        const diff = e.thisMonth - e.lastMonth;
        const diffRate = e.lastMonth > 0 ? (diff / e.lastMonth) * 100 : e.thisMonth > 0 ? null : 0;
        return { ...e, diff, diffRate };
      })
      .sort((a, b) => b.thisMonth - a.thisMonth);

    return { label: term, list };
  }, [groups, dashboardQuery]);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-6">
          <Link href="/" className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700">
            업무 지킴이
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/affairs" className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700">
            총무관리
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-900">물품 사용량</span>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">물품 사용량</h1>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            엑셀 업로드
            <span className="cursor-pointer rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              파일 선택
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </span>
          </label>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          엑셀 파일에 <strong className="font-semibold text-slate-500">날짜(일자), 부서명(창고명), 품목명, 사용량(수량)</strong> 열이
          포함되어야 합니다 (열 이름·순서는 상관없이 자동으로 인식되고, 단가/공급가액/부가세/합계/거래처명 등
          다른 열은 무시됩니다). 각 행은 사용 기록 1건입니다.
        </p>

        {loading && <p className="mt-4 text-sm text-slate-500">파일을 읽는 중입니다...</p>}
        {error && (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {fileName && !error && !loading && rows.length > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{fileName}</span> · {rows.length}건 로드됨 ·
            기준월 <span className="font-semibold text-slate-700">{currentMonthLabel}</span> (전월 대비{" "}
            {previousMonthLabel})
          </p>
        )}

        {groups.length > 0 && (
          <>
            <datalist id="item-name-options">
              {itemNameOptions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                대시보드 품목
                <input
                  type="text"
                  list="item-name-options"
                  value={dashboardQuery}
                  onChange={(e) => setDashboardQuery(e.target.value)}
                  placeholder="정확한 품목명을 목록에서 선택"
                  className="h-9 w-64 rounded border border-slate-300 px-2 text-sm text-slate-800"
                />
              </label>
              {dashboardQuery.trim() !== "" && !itemDashboardData && (
                <span className="text-xs text-amber-600">
                  목록에 있는 품목명과 정확히 일치해야 그래프가 표시됩니다.
                </span>
              )}
            </div>

            {itemDashboardData && (
              <ItemUsageDashboard
                itemLabel={itemDashboardData.label}
                data={itemDashboardData.list}
                currentMonthLabel={currentMonthLabel}
                previousMonthLabel={previousMonthLabel}
              />
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-9 rounded border border-slate-300 px-2 text-sm text-slate-800"
              >
                <option value="전체">전체 부서/창고</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="text"
                list="item-name-options"
                value={listQuery}
                onChange={(e) => setListQuery(e.target.value)}
                placeholder="목록 품목명 검색"
                className="h-9 w-64 rounded border border-slate-300 px-2 text-sm text-slate-800"
              />
              <span className="text-xs text-slate-400">{filteredItemRows.length}개 품목</span>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm" style={{ minWidth: `${640 + departments.length * 100}px` }}>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
                    <th className="px-4 py-3 font-medium">품목명</th>
                    {departments.map((d) => (
                      <th key={d} className="whitespace-nowrap px-4 py-3 font-medium">
                        {d}
                      </th>
                    ))}
                    <th className="whitespace-nowrap px-4 py-3 font-medium">
                      합계
                      <span className="ml-1 font-normal text-slate-400">({currentMonthLabel})</span>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">전월 대비</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItemRows.map((row) => (
                    <tr key={row.item} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 font-medium text-slate-900">{row.item}</td>
                      {departments.map((d) => (
                        <td key={d} className="px-4 py-2.5 text-slate-600">
                          {row.byDept[d] ? formatNumber(row.byDept[d]) : "-"}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 font-semibold text-slate-900">
                        {formatNumber(row.totalThisMonth)}
                      </td>
                      <td className="px-4 py-2.5">
                        <DiffBadge diff={row.diff} diffRate={row.diffRate} />
                      </td>
                    </tr>
                  ))}
                  {filteredItemRows.length === 0 && (
                    <tr>
                      <td colSpan={departments.length + 3} className="px-4 py-8 text-center text-slate-400">
                        조건에 맞는 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {rows.length === 0 && !loading && !error && (
          <div className="mt-10 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <span className="text-sm font-medium text-slate-400">
              엑셀 파일을 업로드하면 부서·품목별 사용량 통계가 여기에 표시됩니다.
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
