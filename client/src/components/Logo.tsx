import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group" aria-label="TechPad home">
      <img
        src="/icon.svg"
        alt="TechPad"
        className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105"
      />
      <span className="text-xl sm:text-2xl font-bold text-blue-600">
        TechPad
      </span>
    </Link>
  );
}

export default Logo;
