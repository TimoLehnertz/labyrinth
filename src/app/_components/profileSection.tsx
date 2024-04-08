import React from "react";
import { CgProfile } from "react-icons/cg";
import Logout from "./logout";
import Link from "next/link";

export default async function profileSection() {
  if (true) {
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
      <span>-username-</span>
      <Logout></Logout>
    </div>
  );
}
