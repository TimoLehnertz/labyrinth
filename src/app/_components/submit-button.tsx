"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton(props: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="p-2 dark:bg-blue-500 rounded-md border hover:bg-blue-600 hover:text-white border-blue-500 dark:hover:bg-blue-600 dark:border-0"
    >
      {props.text}
    </button>
  );
}
