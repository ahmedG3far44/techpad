import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="text-2xl font-bold text-blue-600" aria-label="TechPad home">
      <span role="img" aria-label="TechPad logo">TechPad</span>
    </Link>
  );
}

export default Logo;
