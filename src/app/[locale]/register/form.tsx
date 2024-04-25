"use client";

import { FormEvent, useState } from "react";
import { SubmitButton } from "../../_components/submit-button";
import toast from "react-hot-toast";
import { z, ZodError } from "zod";
import BlockInput from "@/app/_components/blockInput";
import { useRouter } from "next/navigation";
import { client } from "../../clientAPI";

const registerSchema = z
  .object({
    username: z.string().min(2),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    email: z.string().email(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState<ZodError<
    z.infer<typeof registerSchema>
  > | null>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      username: formData.get("username"),
    };
    const validated = registerSchema.safeParse(form);
    if (!validated.success) {
      // console.log(validated.error);
      setError(validated.error);
      return false;
    }
    const response = await client.api.POST("/users/register", {
      body: {
        email: validated.data.email,
        username: validated.data.username,
        password: validated.data.password,
      },
    });
    if (response.error?.message === "email taken") {
      toast("This email is already in use");
      return false;
    }
    if (response.error?.message === "username taken") {
      toast("This username is already in use");
      return false;
    }
    if (!response?.error) {
      if (
        await client.login(validated.data.username, validated.data.password)
      ) {
        router.push("/");
        router.refresh();
      }
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
