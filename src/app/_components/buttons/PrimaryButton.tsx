import Link from "next/link";
import React from "react";

interface PrimaryButtonProps {
  children: JSX.Element | string;
  onClick?: () => void;
  href?: string;
  type?: "submit" | "reset" | "button";
}

export default function PrimaryButton({
  children,
  onClick,
  href,
  type,
}: PrimaryButtonProps) {
  const className =
    "bg-sky-900 rounded-lg p-2 hover:bg-slate-500 text-center bg-gradient-to-r from-indigo-500 to-blue-900 text-white";
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
