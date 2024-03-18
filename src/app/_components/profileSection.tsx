import { getServerSession } from "next-auth";
import React from "react";
import { CgProfile } from "react-icons/cg";
import Logout from "./logout";
import Link from "next/link";

export default async function profileSection() {
  const session = await getServerSession();
  if (!session) {
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
    <div>
      <CgProfile />
      <Logout></Logout>
    </div>
  );
}
