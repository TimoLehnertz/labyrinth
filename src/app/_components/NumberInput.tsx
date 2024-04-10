import React, { useEffect, useState } from "react";

interface Props {
  label: string;
  name?: string;
  value?: number;
  min?: number;
  max?: number;
  isPercent?: boolean;
  step?: number;
  flip?: boolean;
  readonly?: boolean;
  onChange?: (newValue: number, oldValue: number) => void;
}

export default function NumberInput({
  label,
  name,
  value,
  min,
  max,
  step,
  isPercent,
  flip,
  readonly,
  onChange,
}: Props) {
  const [inputValue, setInputValue] = useState(value ?? 0);
  useEffect(() => {
    setInputValue(value ?? 0);
  });
  if (isNaN(inputValue)) {
    setInputValue(0);
  }
  if (isPercent) {
    min = 0;
    max = 100;
  }
  const change = (e: any) => {
    if (readonly) {
      return;
    }
    const oldValue = inputValue;
    let newValue = parseFloat(e.target.value);
    if (max !== undefined && newValue > max) {
      newValue = max;
    }
    if (min !== undefined && newValue < min) {
      newValue = min;
    }
    setInputValue(newValue);
    onChange?.(newValue, oldValue);
  };
  return (
    <div
      className={`flex ${flip ? "flex-row-reverse" : "flex-row"} gap-2 items-center justify-end`}
    >
      <label htmlFor="input" className={flip ? "text-right" : "text-left"}>
        {label}
      </label>
      <input
        id="input"
        type="number"
        name={name}
        className="dark:bg-gray-800 bg-gray-200 border-none p-2 rounded-md w-24"
        value={inputValue}
        min={min}
        max={max}
        onChange={change}
        step={step}
      />
      {isPercent ? <span>%</span> : <></>}
    </div>
  );
}
