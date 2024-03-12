"use client";
import { useFormState } from "react-dom";
import { SubmitButton } from "../submit-button";
import { login } from "./login";

const initiatState: { message?: string; loggedIn: boolean } = {
  loggedIn: false,
};

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initiatState);
  return (
    <form action={formAction}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <SubmitButton text="login" />
      {state.message ? <p>{state.message}</p> : null}
    </form>
  );
}
