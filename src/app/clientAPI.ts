import type { paths } from "./backend";
import createClient from "openapi-fetch";
import { decode, verify } from "jwt-js-decode";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
}

async function getLoggedInUser(): Promise<User | null> {
  const token = getCookie("jwt");
  if (!token) {
    return null;
  }
  const parsed = decode(token);
  return userSchema.parse(parsed.payload);
}

async function isLoggedIn(): Promise<boolean> {
  return (await getLoggedInUser()) !== null;
}

export const client = {
  isLoggedIn,
  getLoggedInUser,
  api: createClient<paths>({
    baseUrl: "http://localhost:3001",
    // baseUrl: process.env.BACKEND,

    fetch: (url, options) => {
      const token = localStorage.getItem("jwt");
      if (!options) {
        options = {
          headers: { "Content-Type": "application/json" },
        };
      }
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      console.log(options);
      return fetch(url, options);
    },
  }),
};
