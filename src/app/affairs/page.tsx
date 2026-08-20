import SubMenuPage from "@/components/SubMenuPage";

const items = [
  {
    href: "/affairs/supply-usage",
    label: "물품 사용량",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={1.8}>
        <path
          d="M4 7l8-4 8 4-8 4-8-4Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path d="M4 7v10l8 4 8-4V7" stroke="currentColor" strokeLinejoin="round" />
        <path d="M12 11v10" stroke="currentColor" />
      </svg>
    ),
  },
];

export default function AffairsPage() {
  return <SubMenuPage title="총무관리" items={items} />;
}
