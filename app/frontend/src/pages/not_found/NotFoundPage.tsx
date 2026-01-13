import { Link } from "react-router-dom";

export default function NotFoundStranica() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-orange-200/50 via-white/30 to-orange-400/40 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-md border border-orange-300 shadow-2xl rounded-2xl px-10 py-14 text-center max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-orange-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-700 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition font-semibold shadow-md"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
