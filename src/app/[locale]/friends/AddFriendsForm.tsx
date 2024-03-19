"use client";
import React, { FormEvent, useEffect } from "react";
import InlineInput from "../../_components/InlineInput";
import { SubmitButton } from "../../_components/submit-button";
import toast from "react-hot-toast";
import FriendRequests from "../../_components/FriendRequests";

export default function AddFriendsForm() {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      friendName: formData.get("friendName"),
    };
    const response = await fetch("http://localhost:3001/addFriend", {
      method: "POST",
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      toast("Friend request has been sent");
    }
    return false;
  }
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex space-x-4 items-center mb-5"
      >
        <InlineInput
          id="friendName"
          label="username"
          name="friendName"
          type="text"
        />
        <SubmitButton text="Add friend" />
      </form>
      <FriendRequests></FriendRequests>
    </div>
  );
}
