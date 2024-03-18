import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import AddFriendsForm from "./AddFriendsForm";
import { getToken } from "next-auth/jwt";
import Chat from "../../_components/Chat";

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  console.log("session: ", session.user);
  return (
    <div>
      <h1 className="font-xl">Friends</h1>
      <div>
        <AddFriendsForm />
        <Chat></Chat>
      </div>
    </div>
  );
}
