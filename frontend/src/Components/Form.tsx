import type { ReactNode } from "react";

interface FormType {
  title: string;
  children: ReactNode;
}

export default function Form({ title, children }: FormType) {
  return (
    <div className="fixed h-screen inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-md shadow-lg relative border border-gray-300">
        <div className="flex justify-center items-center p-4 ">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="p-4 flex flex-col items-center gap-2">{children}</div>
      </div>
    </div>
  );
}
