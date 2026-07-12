import { ReactNode, MouseEventHandler } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success"
    | "gradient"
    | "icon";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  to?: string;
  type?: "button" | "reset" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: "md" | "lg" | "xl" | "full";
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 border border-transparent shadow-sm",
  secondary:
    "bg-surface-100 text-surface-700 hover:bg-surface-200 active:bg-surface-300 border border-surface-200",
  outline:
    "bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100 border border-primary-300",
  ghost:
    "bg-transparent text-surface-600 hover:bg-surface-100 active:bg-surface-200 border border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-transparent shadow-sm",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 border border-transparent shadow-sm",
  gradient:
    "text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 border border-transparent shadow-sm",
  icon:
    "bg-white/90 text-surface-700 hover:bg-white active:bg-surface-100 border border-transparent shadow-sm backdrop-blur-sm",
};

const sizeStyles: Record<string, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
  xl: "px-6 py-3 text-base",
};

const roundedStyles: Record<string, string> = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  type = "button",
  className = "",
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = "lg",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium motion-safe:transition-all motion-safe:duration-150 cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";

  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles[rounded]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
