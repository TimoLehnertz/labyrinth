"use client";

import { useRouter } from "next/navigation";
import { SubmitButton } from "../submit-button";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (!response?.error) {
      router.push("/");
      router.refresh();
    }
    return false;
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <SubmitButton text="login" />
    </form>
  );
}
