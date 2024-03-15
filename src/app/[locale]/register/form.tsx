"use client";

import { FormEvent } from "react";
import { SubmitButton } from "../submit-button";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { registerSchema } from "../../api/register/route";
import { register } from "@/_lib/apiInterface";
// import { registerSchema } from "@/lib/";

function generateZodError(zodError: ZodError): string {
  let errorMessage = "";
  let delimiter = "";
  zodError.errors.flat().forEach((error) => {
    if (error.path.length > 0) {
      errorMessage += `${delimiter}${error.path.join(".")}: ${error.message}`;
    } else {
      errorMessage += `${delimiter}${error.message}`;
    }
    delimiter = ", ";
  });
  return errorMessage;
}

export default function Form() {
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
      toast.error(generateZodError(result.error));
      return false;
    }
    const response = await register(result.data);
    console.log(response);
    return false;
  };
  return (
    <div>
      <form method="POST" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" />
        <br />
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <br />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <br />
        <label htmlFor="confirmPassword">Confirm password</label>
        <input type="password" name="confirmPassword" id="confirmPassword" />
        <br />
        <SubmitButton text="Register"></SubmitButton>
      </form>
    </div>
  );
}
