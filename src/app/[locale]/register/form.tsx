"use client";

import { FormEvent, useState } from "react";
import { SubmitButton } from "../../_components/submit-button";
import toast from "react-hot-toast";
import { SafeParseError, ZodError } from "zod";
import { registerSchema } from "../../api/register/route";
import { register } from "@/_lib/apiInterface";
import BlockInput from "@/app/_components/blockInput";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState<ZodError<{
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
  }> | null>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      username: formData.get("username"),
    };
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      setError(result.error);
      return false;
    }
    const response = await register(result.data);
    if (response.emailExists) {
      toast("This email is already in use");
      return false;
    }
    if (response.usernameExists) {
      toast("This username is already in use");
      return false;
    }
    const signInResponse = await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });
    if (!signInResponse?.error) {
      router.push("/");
      router.refresh();
    }
    return false;
  };
  return (
    <form method="POST" onSubmit={handleSubmit}>
      <BlockInput
        id="email"
        label="Email"
        name="email"
        type="email"
        zodError={error}
      ></BlockInput>

      <BlockInput
        id="username"
        label="Username"
        name="username"
        type="text"
        zodError={error}
      ></BlockInput>

      <BlockInput
        id="password"
        label="Password"
        name="password"
        type="password"
        zodError={error}
      ></BlockInput>

      <BlockInput
        id="confirmPassword"
        label="Confirm password"
        name="confirmPassword"
        type="password"
        zodError={error}
      ></BlockInput>
      <SubmitButton text="Register"></SubmitButton>
    </form>
  );
}
