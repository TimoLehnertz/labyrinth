"use client";
import React, { FormEvent } from "react";
import InlineInput from "../../_components/InlineInput";
import { SubmitButton } from "../../_components/submit-button";

export default function AddFriendsForm() {
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const response = await fetch("/api/friends/request", {
      method: "POST",
    });
    console.log(response);
    return false;
  }
  return (
    <form onSubmit={handleSubmit} className="flex space-x-4 items-center">
      <InlineInput
        id="friendName"
        label="username"
        name="friendName"
        type="text"
      />
      <SubmitButton text="Add friend" />
    </form>
  );
}
