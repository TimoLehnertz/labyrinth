"use client";

import { useRouter } from "next/navigation";
import { SubmitButton } from "../../_components/submit-button";
import { FormEvent } from "react";
import BlockInput from "../../_components/blockInput";
import { client } from "../../clientAPI";

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const usernameEmail = formData.get("usernameEmail");
    const password = formData.get("password");
    if (!usernameEmail || !password) {
      return;
    }
    const response = await client.api.POST("/auth/login", {
      body: {
        usernameEmail: usernameEmail.toString(),
        password: password.toString(),
      },
    });
    console.log(response);
    if (response.data) {
      localStorage.setItem("jwt", response.data.access_token);
      document.cookie = `jwt=${response.data.access_token}`;
      // router.push("/");
      // router.refresh();
    }
    return false;
  };

  const test = async () => {
    console.log(await client.getLoggedInUser());
    console.log(localStorage.getItem("jwt"));
    const friends = await client.api.GET("/friends");
    console.log(friends);
  };
  return (
    <form onSubmit={handleSubmit}>
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
      <button type="button" onClick={test}>
        test
      </button>
    </form>
  );
}
