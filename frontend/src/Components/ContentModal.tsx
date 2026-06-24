import type { ReactNode } from "react";

interface ContentType {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function ContentModal({
  title,
  children,
  isOpen,
  setIsOpen,
}: ContentType) {
  if (!isOpen) return null;

  return (
    <div className="fixed h-screen inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-md shadow-lg relative border border-gray-200">
        <div className="flex justify-between items-center p-4 ">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Close modal"
          >
            X
          </button>
        </div>

        <div className="p-4 flex flex-col items-center gap-2">{children}</div>
      </div>
    </div>
  );
}
