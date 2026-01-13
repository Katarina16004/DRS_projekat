import { Link } from "react-router-dom";

export default function NotFoundStranica() {
  return (
    <main
      className="min-h-screen flex items-center justify-center font-inter"
      style={{
        background: `linear-gradient(135deg, #C3FDB8 0%, #FFF8C6 50%, #BDEDFF 100%)`,
      }}
    >
      <div
        className="shadow-2xl rounded-2xl px-10 py-14 text-center max-w-md w-full"
        style={{
          background: "rgba(255, 255, 255, 0.90)",
          border: "1px solid #54C571",
        }}
      >
        <h1
          className="text-6xl font-extrabold mb-4 font-poppins"
          style={{ color: "#54C571" }}
        >
          404
        </h1>
        <h2
          className="text-3xl font-bold mb-4 font-poppins"
          style={{ color: "#82CAFF" }}
        >
          Page Not Found
        </h2>
        <p className="mb-6 font-poppins" style={{ color: "#555" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-xl transition font-semibold font-poppins shadow-md"
          style={{
            background: "#54C571",
            color: "#fff",
            border: "1px solid #54C571",
          }}
          onMouseOver={e =>
            (e.currentTarget.style.background = "#D462FF")
          }
          onMouseOut={e =>
            (e.currentTarget.style.background = "#54C571")
          }
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}