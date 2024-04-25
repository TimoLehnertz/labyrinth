"server only";
import { cookies } from "next/headers";
import type { paths } from "./backend";
import createClient from "openapi-fetch";
import { decode, verify } from "jwt-js-decode";
import { User } from "./clientAPI";
import { z } from "zod";

const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
});

async function getLoggedInUser(): Promise<User | null> {
  const token = cookies().get("jwt")?.value;
  if (!token) {
    return null;
  }
  // if (!process.env.AUTH_SECRET) {
  //   throw new Error("AUTH_SECRET not provided");
  // }
  // const res = await verify(token, process.env.AUTH_SECRET);
  // if (!res) {
  //   return null;
  // }
  // const parsed = decode(token);
  // const tokenUser = userSchema.parse(parsed.payload);
  try {
    const user = await server.api.GET("/auth/profile");
    if (user.data) {
      return user.data;
    }
  } catch (e) {}
  return null;
}

async function isLoggedIn(): Promise<boolean> {
  return (await getLoggedInUser()) !== null;
}

export const server = {
  isLoggedIn,
  getLoggedInUser,
  api: createClient<paths>({
    // baseUrl: "http://localhost:3001",
    baseUrl: process.env.NEXT_PUBLIC_BACKEND,

    fetch: (url, options) => {
      const jwt = cookies().get("jwt")?.value;
      if (!options) {
        options = { headers: { "Content-Type": "application/json" } };
      }
      if (jwt) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${jwt}`,
        };
      }
      return fetch(url, options);
    },
  }),
};
