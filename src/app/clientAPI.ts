"use client";
import type { paths } from "./backend";
import createClient from "openapi-fetch";
import { decode, verify } from "jwt-js-decode";
import { z } from "zod";
import { useState } from "react";

const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

function getCookie(name: string): string | undefined {
  try {
    if (document === undefined) {
      // weird stuff
      return undefined;
    }
  } catch (e) {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
}

function useUser(): User | null {
  const token = getCookie("jwt");
  if (!token) {
    return null;
  }
  const parsed = decode(token);
  return userSchema.parse(parsed.payload);
}

// function useUserOrThrow(): User {
//   const user = useUser();
//   if (user === null) {
//     throw new Error("Not logged in");
//   }
//   return user;
// }

function useIsLoggedIn(): boolean {
  return useUser() !== null;
}

export const client = {
  useIsLoggedIn,
  useUser,
  // useUserOrThrow,
  getToken: () => localStorage.getItem("jwt") ?? "",
  login: async (usernameEmail: string, password: string): Promise<boolean> => {
    const response = await client.api.POST("/auth/login", {
      body: {
        usernameEmail,
        password,
      },
    });
    if (response.data) {
      localStorage.setItem("jwt", response.data.access_token);
      document.cookie = `jwt=${response.data.access_token};path=/`;
      return true;
    }
    return false;
  },
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
      return fetch(url, options);
    },
  }),
};
