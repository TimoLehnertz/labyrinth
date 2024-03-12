"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton(props: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" aria-disabled={pending}>
      {props.text}
    </button>
  );
}
