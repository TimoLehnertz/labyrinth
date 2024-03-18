"use client";

import { useRouter } from "next/navigation";
import { SubmitButton } from "../../_components/submit-button";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import BlockInput from "../../_components/blockInput";

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
      <BlockInput id="email" label="email" name="email" type="email" />
      <BlockInput
        id="password"
        label="Password"
        name="password"
        type="password"
      />
      <SubmitButton text="Login" />
    </form>
  );
}
