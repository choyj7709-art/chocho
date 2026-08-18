import SubMenuPage from "@/components/SubMenuPage";

const items = [
  {
    href: "/design/fire-safety-plan",
    label: "소방도면",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" strokeWidth={1.8}>
        <path
          d="M4 20V6.5c2 1.3 4-1.3 6 0s4 1.3 6 0v8c-2 1.3-4-1.3-6 0s-4 1.3-6 0"
          stroke="currentColor"
          strokeLinejoin="round"
        />
        <path d="M4 20v-4" stroke="currentColor" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function DesignPage() {
  return <SubMenuPage title="디자인" items={items} />;
}
