import React from "react";
import { CgProfile } from "react-icons/cg";
import Logout from "./logout";
import Link from "next/link";
import { server } from "../serverAPI";

export default async function profileSection() {
  const user = await server.getLoggedInUser();
  if (!user) {
    return (
      <>
        <Link
          href="/login"
          className="dark:hover:text-neutral-300 hover:text-neutral-400"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="dark:hover:text-neutral-300 hover:text-neutral-400"
        >
          Register
        </Link>
      </>
    );
  }
  return (
    <div className="flex space-x-2">
      <CgProfile />
      <span>{user.username}</span>
      <Logout></Logout>
    </div>
  );
}
