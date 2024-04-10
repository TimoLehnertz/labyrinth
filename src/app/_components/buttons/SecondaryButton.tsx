import Link from "next/link";
import React from "react";

interface SecondaryButtonProps {
  children: JSX.Element | string;
  onClick?: () => void;
  href?: string;
  type?: "submit" | "reset" | "button";
}

export default function SecondaryButton({
  children,
  onClick,
  href,
  type,
}: SecondaryButtonProps) {
  const className =
    "bg-slate-500 rounded-lg p-2 hover:bg-slate-500 text-center text-white";
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  } else {
    return (
      <button type={type} onClick={onClick} className={className}>
        {children}
      </button>
    );
  }
}
