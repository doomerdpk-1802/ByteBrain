import { GenericButton } from "./Button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight text-balance dark:text-gray-100">
          Your Second Brain,
          <span className="block text-blue-600 dark:text-blue-400">Amplified</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed text-balance dark:text-gray-400">
          A second brain application for capturing, organizing, and retrieving information so you don't have to rely on remembering everything yourself.
        </p>

        <div className="flex justify-center">
          <GenericButton
            onClick={() => {
              navigate("/signup");
            }}
          >
            Get Started
          </GenericButton>
        </div>
      </div>
    </section>
  );
}
