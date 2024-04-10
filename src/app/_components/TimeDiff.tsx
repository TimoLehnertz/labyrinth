"use client";
import React, { useEffect, useState } from "react";

export default function TimeDiff({ date }: { date: Date }) {
  const [diff, setDiff] = useState<string>(getTimeDiffString(date, new Date()));
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDiff(getTimeDiffString(date, new Date()));
    }, 10000); // 10 seconds
    return () => clearInterval(intervalId);
  }, [date]);

  return <span className="text-blue-950 dark:text-blue-200">{diff}</span>;
}

function round(num: number, amount: number): number {
  return Math.round(num / amount) * amount;
}

function getTimeDiffString(date1: Date, date2: Date) {
  const diff = Math.abs(date1.getTime() - date2.getTime()); // Get the absolute difference in milliseconds

  // Convert milliseconds to minutes, hours, days, weeks, months, and years
  const seconds = round(Math.floor(diff / 1000), 10);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)); // Approximation, adjust as needed
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365)); // Approximation, adjust as needed

  // Determine the appropriate string based on the time difference
  if (diff < 10000) {
    return `moments`;
  } else if (minutes < 1) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  } else if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  } else if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    return `${years} year${years !== 1 ? "s" : ""}`;
  }
}
