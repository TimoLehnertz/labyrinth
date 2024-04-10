"use client";
import React, { FormEvent, useEffect } from "react";
import InlineInput from "../../_components/InlineInput";
import { SubmitButton } from "../../_components/submit-button";
import toast from "react-hot-toast";
import FriendRequests from "../../_components/FriendRequests";
import { client } from "../../clientAPI";

export default function AddFriendsForm() {
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const friendUsername = formData.get("friendName")?.toString();
    if (friendUsername === undefined) {
      return false;
    }
    const response = await client.api.POST("/friends/request", {
      params: {
        query: {
          username: friendUsername,
        },
      },
    });
    if (response.error?.message === "already friends") {
      toast(`You are already friends with ${friendUsername}`);
    } else if (response.error?.message === "already sent") {
      toast(`A request to ${friendUsername} has been sent already`);
    } else if (response.error?.message === "invalid user") {
      toast(`${friendUsername} is not around. Try again!`);
    } else if (response.error?.message === "same user") {
      toast(`Nope, you cant be friends with yourself`);
    } else if (response.response.status === 200) {
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
