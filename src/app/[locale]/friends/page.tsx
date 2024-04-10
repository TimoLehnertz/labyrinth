import { redirect } from "next/navigation";
import React from "react";
import AddFriendsForm from "./AddFriendsForm";
import Chat from "../../_components/Chat";
import { server } from "../../serverAPI";

export default async function Page() {
  const user = await server.getLoggedInUser();
  if (!user) {
    redirect("/");
  }
  return (
    <div>
      <div>
        <AddFriendsForm />
        {/* <Chat></Chat> */}
      </div>
    </div>
  );
}
