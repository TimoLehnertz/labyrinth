import { redirect } from "next/navigation";
import React from "react";
import AddFriendsForm from "./AddFriendsForm";
import { server } from "../../serverAPI";

export default async function Page() {
  const user = await server.getLoggedInUser();
  if (!user) {
    redirect("/");
  }
  return (
    <div className="p-4">
      <div>
        <AddFriendsForm />
        {/* <Chat></Chat> */}
      </div>
    </div>
  );
}
