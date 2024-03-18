"use client";
import { FaMoon } from "react-icons/fa";
import { useEffect, useState } from "react";
import { TiWeatherSunny } from "react-icons/ti";

export default function ThemeToggle() {
  const [darkMode, setDarkmode] = useState(true);

  useEffect(() => {
    setDarkmode(localStorage.getItem("theme") === "dark");
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className={`relative w-16 h-8 flex items-center dark:bg-gray ${darkMode ? "bg-neutral-600" : "bg-neutral-200"} group shadow-inner cursor-pointer rounded-full p-1 ${darkMode ? "font-white" : "font-black"}`}
      onClick={() => setDarkmode(!darkMode)}
    >
      {darkMode && <FaMoon className="absolute left-1"></FaMoon>}
      {!darkMode && (
        <TiWeatherSunny className="absolute right-1"></TiWeatherSunny>
      )}
      <p
        className={`absolute  ${darkMode ? "left-10 bg-neutral-100" : "left-1 bg-neutral-600"} rounded-full h-5 w-5 transition-all`}
      ></p>
    </div>
  );
}
