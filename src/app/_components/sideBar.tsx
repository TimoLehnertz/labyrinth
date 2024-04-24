"use client";
import { useEffect, useRef } from "react";

interface Props {
  children?: React.ReactNode;
}
export default function SideBar({ children }: Props) {
  let isOpen = false;
  const asideRef = useRef<HTMLElement>(null);
  const setOpen = (state: boolean) => {
    isOpen = state;
    if (isOpen) {
      asideRef.current?.classList.remove("-translate-x-full");
    } else {
      asideRef.current?.classList.add("-translate-x-full");
    }
  };
  useEffect(() => {
    const handleClick = () => setOpen(false);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
  return (
    <div>
      <aside
        ref={asideRef}
        className={`fixed top-12 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full px-3 py-4 overflow-y-auto bg-gray-200 dark:bg-gray-800">
          <div>{children} </div>
        </div>
      </aside>
      <div
        className="fixed top-0 left-0 z-10 flex flex-col gap-2 m-3 sm:hidden"
        onClick={(e) => {
          let newState = !isOpen;
          setTimeout(() => {
            setOpen(newState);
          }, 0);
        }}
      >
        <div className="w-8 h-[0.2rem] rounded bg-slate-300" />
        <div className="w-8 h-[0.2rem] rounded bg-slate-300" />
        <div className="w-8 h-[0.2rem] rounded bg-slate-300" />
      </div>
    </div>
  );
}
