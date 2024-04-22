import Link from "next/link";
import React from "react";

interface PrimaryButtonProps {
  children: JSX.Element | string;
  onClick?: () => void;
  href?: string;
  type?: "submit" | "reset" | "button";
  className?: string;
}

export default function PrimaryButton({
  children,
  onClick,
  href,
  type,
  className,
}: PrimaryButtonProps) {
  const className1 =
    "bg-sky-900 rounded-lg p-2 hover:bg-slate-500 text-center bg-gradient-to-r from-indigo-500 to-blue-900 text-white " +
    className;
  if (href) {
    return (
      <Link href={href} className={className1}>
        {children}
      </Link>
    );
  } else {
    return (
      <button type={type} onClick={onClick} className={className1}>
        {children}
      </button>
    );
  }
}
