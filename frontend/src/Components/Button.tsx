interface GenericButtonProps {
  children: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const GenericButton: React.FC<GenericButtonProps> = ({
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
      className="px-6 py-2 my-2 bg-blue-600 text-xs sm:text-lg text-white rounded-md font-medium transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
};
