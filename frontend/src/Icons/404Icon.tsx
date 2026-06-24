export default function Icon404() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      width="100%"
      height="auto"
      role="img"
      aria-labelledby="title desc"
    >
      <title id="title">404 - Page Not Found</title>

      <rect width="100%" height="100%" fill="#f8fafc" rx="20" ry="20" />

      <text
        x="50%"
        y="38%"
        textAnchor="middle"
        fontSize="180"
        fontWeight="700"
        fill="#94a3b8"
        fontFamily="Inter, Arial, sans-serif"
      >
        404
      </text>

      <text
        x="50%"
        y="57%"
        textAnchor="middle"
        fontSize="50"
        fontWeight="600"
        fill="#334155"
        fontFamily="Inter, Arial, sans-serif"
      >
        Page Not Found
      </text>

      <text
        x="50%"
        y="68%"
        textAnchor="middle"
        fontSize="32"
        fill="#64748b"
        fontFamily="Inter, Arial, sans-serif"
      >
        The page you’re looking for doesn’t exist or has been moved.
      </text>
    </svg>
  );
}
