import Link from "next/link";
import React from "react";

interface SecondaryButtonProps {
  children: JSX.Element | string;
  onClick?: () => void;
  href?: string;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  className?: string;
}

export default function SecondaryButton({
  children,
  onClick,
  href,
  type,
  disabled,
  className,
}: SecondaryButtonProps) {
  const className1 =
    "bg-slate-500 rounded-lg p-2 hover:bg-slate-500 text-center text-white " +
    className;
  if (href) {
    return (
      <Link href={href} className={className1} aria-disabled={disabled}>
        {children}
      </Link>
    );
  } else {
    return (
      <button
        type={type}
        onClick={onClick}
        className={className1}
        aria-disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
