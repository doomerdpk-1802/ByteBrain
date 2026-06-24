import type React from "react";

interface IconProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Icon: React.FC<IconProps> = ({
  children,
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="p-2 bg-gray-200 text-xs rounded-md font-medium transition-all hover:bg-gray-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};
