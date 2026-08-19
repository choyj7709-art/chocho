import SubMenuPage from "@/components/SubMenuPage";

const items = [
  {
    href: "/hr/workforce",
    label: "인력관리",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={1.8}>
        <circle cx="9" cy="8" r="3" stroke="currentColor" />
        <path
          d="M3.5 20c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5"
          stroke="currentColor"
          strokeLinecap="round"
        />
        <path
          d="M15.5 5.5c1.4.4 2.5 1.7 2.5 3.2s-1.1 2.8-2.5 3.2M18 14.7c1.9.6 3.5 2.4 3.5 4.6"
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/hr/attendance",
    label: "직원 근태 정리",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={1.8}>
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" />
        <path d="M4 9.5h16" stroke="currentColor" />
        <path d="M8 3.5v3M16 3.5v3" stroke="currentColor" strokeLinecap="round" />
        <path
          d="M9 13.5l2 2 4-4.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function HrPage() {
  return <SubMenuPage title="인사관리" items={items} />;
}
