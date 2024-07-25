import { Link } from "react-router-dom";

export default function Logo({ color, highlight }) {
  return (
    <Link
      to="/"
      className="logo"
    >
      <div style={{ color: color || "black" }}>
        Super
        <span
          className="logo-b"
          style={{ color: highlight || "black" }}
        >
          Treats
        </span>
      </div>
    </Link>
  );
}
