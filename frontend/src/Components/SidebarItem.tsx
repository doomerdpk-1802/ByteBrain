import type { ReactNode } from "react";

export interface SidebarItemData {
  icon: ReactNode;
  text: string;
  onClick: () => void;
  isOpen?: boolean;
}

export function SidebarItem(props: SidebarItemData) {
  const { icon, text, onClick, isOpen } = props;
  const open = isOpen ?? true;

  return (
    <div
      onClick={onClick}
      className="p-3 flex items-center gap-4 cursor-pointer rounded-lg hover:bg-blue-100 transition-colors"
    >
      <div className="text-blue-600 flex-shrink-0">{icon}</div>
      {open && <p className="text-gray-900 text-sm font-medium">{text}</p>}
    </div>
  );
}
