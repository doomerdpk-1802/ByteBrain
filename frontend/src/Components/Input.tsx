interface GenericInputProps {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  register?: any;
}

export default function GenericInput({
  name,
  label,
  placeholder,
  type,
  register,
}: GenericInputProps) {
  return (
    <div className="flex w-full items-center justify-between mb-4 gap-2">
      <label htmlFor={name} className="mb-1 text-gray-700 font-medium">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600"
        {...register}
      />
    </div>
  );
}
