import { HTMLInputTypeAttribute } from "react";
import { ZodError, ZodIssue } from "zod";

export default function blockInput({
  type,
  label,
  name,
  id,
  maxLength,
  minLength,
  zodError,
}: {
  type: HTMLInputTypeAttribute;
  label: string;
  name: string;
  id: string;
  maxLength?: number;
  minLength?: number;
  zodError?: ZodError | null;
}) {
  const errors: ZodIssue[] = [];
  if (zodError) {
    for (const issue of zodError.issues) {
      if (issue.path.includes(name)) {
        errors.push(issue);
      }
    }
  }
  return (
    <div className="">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={type}
        placeholder={label}
        name={name}
        maxLength={maxLength}
        minLength={minLength}
      />
      {errors.map((error, index) => (
        <p key={index} className="text-red-400">
          {error.message}
        </p>
      ))}
    </div>
  );
}
