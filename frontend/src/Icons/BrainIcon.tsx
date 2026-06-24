export default function BrainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="24 0 250 90"
      className="sm:w-80 w-48 h-auto"
    >
      <rect
        x="25"
        y="25"
        width="40"
        height="40"
        rx="6"
        fill="none"
        stroke="#2563eb"
        strokeWidth="3"
      />
      <path d="M35 45h20M45 35v20" stroke="#2563eb" strokeWidth="2" />
      <circle cx="45" cy="45" r="3" fill="#2563eb" />

      <path
        d="M45 20v8M45 70v8M20 45h8M67 45h8"
        stroke="#2563eb"
        strokeWidth="2"
      />

      <text
        x="90"
        y="55"
        fontFamily="Poppins, sans-serif"
        fontSize="28"
        fontWeight="600"
        fill="#111827"
      >
        Byte
        <tspan fill="#2563eb">Brain</tspan>
      </text>
    </svg>
  );
}
