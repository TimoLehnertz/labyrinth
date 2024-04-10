"use client";

import { useRouter } from "next/navigation";
import { SubmitButton } from "../../_components/submit-button";
import { FormEvent, useState } from "react";
import BlockInput from "../../_components/blockInput";
import { client } from "../../clientAPI";

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const usernameEmail = formData.get("usernameEmail");
    const password = formData.get("password");
    if (!usernameEmail || !password) {
      return;
    }
    const loginSuccess = await client.login(
      usernameEmail.toString(),
      password.toString()
    );
    if (loginSuccess) {
      router.push("/");
      router.refresh();
    } else {
      setError("Invalid credentials");
    }
    return false;
  };
  return (
    <form onSubmit={handleSubmit}>
      {error ? <p className="text-red">{error}</p> : <></>}
      <BlockInput
        id="usernameEmail"
        label="username or email"
        name="usernameEmail"
        type="text"
      />
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
