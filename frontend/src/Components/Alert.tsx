import React, { useEffect, useState } from "react";

interface AlertProps {
  children: React.ReactNode;
  closable?: boolean;
  autoDismiss?: boolean;
  dismissTimeout?: number;
  onClose?: () => void;
}

export default function Alert({
  children,
  closable = true,
  autoDismiss = false,
  dismissTimeout = 5000,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, dismissTimeout);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissTimeout, onClose]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className={`relative flex items-center gap-3 p-4 sm:p-5 rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-white/30 text-gray-800 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]`}
    >
      <span className="text-base sm:text-lg font-medium leading-relaxed flex-1">
        {children}
      </span>

      {closable && (
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
