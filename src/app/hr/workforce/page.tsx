"use client";

import Link from "next/link";
import { useState } from "react";
import type { ChangeEvent } from "react";

type EmploymentType = "정규직" | "계약직" | "파트/기타";
type EmployeeStatus = "재직" | "휴직" | "퇴사";

type Employee = {
  id: string;
  empNo: string;
  name: string;
  department: string;
  position: string;
  employmentType: EmploymentType;
  hireDate: string;
  salary: number;
  status: EmployeeStatus;
};

const employmentTypes: EmploymentType[] = ["정규직", "계약직", "파트/기타"];
const statuses: EmployeeStatus[] = ["재직", "휴직", "퇴사"];

const typeColors: Record<EmploymentType, string> = {
  정규직: "#2563eb",
  계약직: "#16a34a",
  "파트/기타": "#f59e0b",
};

const initialEmployees: Employee[] = [
  {
    id: "1",
    empNo: "EMP001",
    name: "김하늘",
    department: "진료부",
    position: "과장",
    employmentType: "정규직",
    hireDate: "2019-03-02",
    salary: 520,
    status: "재직",
  },
  {
    id: "2",
    empNo: "EMP002",
    name: "박서준",
    department: "간호부",
    position: "주임",
    employmentType: "정규직",
    hireDate: "2021-07-15",
    salary: 380,
    status: "재직",
  },
  {
    id: "3",
    empNo: "EMP003",
    name: "이수아",
    department: "원무과",
    position: "사원",
    employmentType: "계약직",
    hireDate: "2023-11-01",
    salary: 290,
    status: "재직",
  },
  {
    id: "4",
    empNo: "EMP004",
    name: "최민재",
    department: "시설팀",
    position: "사원",
    employmentType: "파트/기타",
    hireDate: "2024-05-20",
    salary: 210,
    status: "휴직",
  },
];

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

export default function WorkforcePage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);

  function updateEmployee<K extends keyof Employee>(
    id: string,
    key: K,
    value: Employee[K]
  ) {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [key]: value } : e))
    );
  }

  function addEmployee() {
    const seq = employees.length + 1;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setEmployees((prev) => [
      ...prev,
      {
        id,
        empNo: `EMP${String(seq).padStart(3, "0")}`,
        name: "",
        department: "",
        position: "",
        employmentType: "정규직",
        hireDate: "",
        salary: 0,
        status: "재직",
      },
    ]);
  }

  function removeEmployee(id: string) {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === "재직").length;
  const regularCount = employees.filter(
    (e) => e.employmentType === "정규직"
  ).length;
  const regularRatio =
    totalCount > 0 ? Math.round((regularCount / totalCount) * 1000) / 10 : 0;
  const totalSalary = employees.reduce((sum, e) => sum + (e.salary || 0), 0);
  const laborCostRatio =
    monthlyRevenue > 0
      ? Math.round((totalSalary / monthlyRevenue) * 1000) / 10
      : null;

  const departmentCounts = employees.reduce<Record<string, number>>(
    (acc, e) => {
      const key = e.department || "미지정";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {}
  );
  const departmentRows = Object.entries(departmentCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const typeCounts = employees.reduce<Record<EmploymentType, number>>(
    (acc, e) => {
      acc[e.employmentType] = (acc[e.employmentType] || 0) + 1;
      return acc;
    },
    { 정규직: 0, 계약직: 0, "파트/기타": 0 }
  );

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
            href="/hr"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-700"
          >
            인사관리
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-900">인력관리</span>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            인력관리
          </h1>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            월 매출(만원)
            <input
              type="number"
              min={0}
              value={monthlyRevenue || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMonthlyRevenue(Number(e.target.value) || 0)
              }
              placeholder="입력 시 인건비율 계산"
              className="h-9 w-40 rounded border border-slate-300 px-2 text-sm text-slate-900"
            />
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="총 직원 수" value={`${totalCount}명`} sub={`재직 ${activeCount}명`} />
          <StatCard label="정규직 비율" value={`${regularRatio}%`} sub={`정규직 ${regularCount}명`} />
          <StatCard label="총 인건비" value={`${totalSalary.toLocaleString()}만원`} sub="월 급여 합계" />
          <StatCard
            label="인건비율"
            value={laborCostRatio !== null ? `${laborCostRatio}%` : "-"}
            sub="매출 대비"
          />
          <StatCard label="부서 수" value={`${departmentRows.length}개`} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold text-slate-900">부서별 인력 현황</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 font-medium">부서</th>
                  <th className="pb-2 font-medium">인원</th>
                  <th className="pb-2 font-medium">비중</th>
                </tr>
              </thead>
              <tbody>
                {departmentRows.map(([dept, count]) => (
                  <tr key={dept} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 text-slate-800">{dept}</td>
                    <td className="py-2 text-slate-800">{count}명</td>
                    <td className="py-2 text-slate-500">
                      {totalCount > 0
                        ? `${Math.round((count / totalCount) * 1000) / 10}%`
                        : "0%"}
                    </td>
                  </tr>
                ))}
                {departmentRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-slate-400">
                      등록된 직원이 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold text-slate-900">고용형태별 구성</h2>
            <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
              {employmentTypes.map((type) =>
                totalCount > 0 && typeCounts[type] > 0 ? (
                  <div
                    key={type}
                    style={{
                      width: `${(typeCounts[type] / totalCount) * 100}%`,
                      backgroundColor: typeColors[type],
                    }}
                  />
                ) : null
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {employmentTypes.map((type) => (
                <div key={type} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: typeColors[type] }}
                  />
                  <span className="text-slate-600">{type}</span>
                  <span className="font-semibold text-slate-900">
                    {typeCounts[type]}명
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">직원 목록</h2>
            <button
              type="button"
              onClick={addEmployee}
              className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              + 직원 추가
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-2 pr-2 font-medium">사번</th>
                  <th className="pb-2 pr-2 font-medium">성명</th>
                  <th className="pb-2 pr-2 font-medium">부서</th>
                  <th className="pb-2 pr-2 font-medium">직급</th>
                  <th className="pb-2 pr-2 font-medium">고용형태</th>
                  <th className="pb-2 pr-2 font-medium">입사일</th>
                  <th className="pb-2 pr-2 font-medium">월 급여(만원)</th>
                  <th className="pb-2 pr-2 font-medium">상태</th>
                  <th className="pb-2 font-medium" />
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-1.5 pr-2">
                      <input
                        value={e.empNo}
                        onChange={(ev) => updateEmployee(e.id, "empNo", ev.target.value)}
                        className="h-8 w-24 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        value={e.name}
                        onChange={(ev) => updateEmployee(e.id, "name", ev.target.value)}
                        placeholder="이름"
                        className="h-8 w-20 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        value={e.department}
                        onChange={(ev) => updateEmployee(e.id, "department", ev.target.value)}
                        placeholder="부서"
                        className="h-8 w-24 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        value={e.position}
                        onChange={(ev) => updateEmployee(e.id, "position", ev.target.value)}
                        placeholder="직급"
                        className="h-8 w-20 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <select
                        value={e.employmentType}
                        onChange={(ev) =>
                          updateEmployee(
                            e.id,
                            "employmentType",
                            ev.target.value as EmploymentType
                          )
                        }
                        className="h-8 rounded border border-slate-200 px-1.5 text-slate-800"
                      >
                        {employmentTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        type="date"
                        value={e.hireDate}
                        onChange={(ev) => updateEmployee(e.id, "hireDate", ev.target.value)}
                        className="h-8 rounded border border-slate-200 px-1.5 text-slate-800"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        type="number"
                        min={0}
                        value={e.salary || ""}
                        onChange={(ev) =>
                          updateEmployee(e.id, "salary", Number(ev.target.value) || 0)
                        }
                        className="h-8 w-24 rounded border border-transparent px-1.5 text-slate-800 hover:border-slate-200 focus:border-slate-300 focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 pr-2">
                      <select
                        value={e.status}
                        onChange={(ev) =>
                          updateEmployee(e.id, "status", ev.target.value as EmployeeStatus)
                        }
                        className="h-8 rounded border border-slate-200 px-1.5 text-slate-800"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1.5">
                      <button
                        type="button"
                        onClick={() => removeEmployee(e.id)}
                        className="text-slate-400 hover:text-red-600"
                        title="삭제"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-400">
                      등록된 직원이 없습니다. &quot;+ 직원 추가&quot;로 시작하세요.
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
