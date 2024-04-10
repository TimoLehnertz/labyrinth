"use client";
import React from "react";
import TimeDiff from "./TimeDiff";
import { components } from "../backend";
import { client } from "../clientAPI";

export interface FriendProps {
  friendship: components["schemas"]["Friendship"];
  endFriendship: (friendship: components["schemas"]["Friendship"]) => void;
}

export default function Friend({ friendship, endFriendship }: FriendProps) {
  const ownUser = client.getLoggedInUserOrThrow();
  let friendUser: components["schemas"]["User"] | null = null;
  if (ownUser.id === friendship.usera) {
    friendUser = friendship.userbUser;
  } else {
    friendUser = friendship.useraUser;
  }
  return (
    <div className="flex space-x-2 content-center">
      <span>{friendUser.username}</span>
      <span>Friends since</span>
      <TimeDiff date={new Date(friendship.since)} />
      <button
        onClick={() => endFriendship(friendship)}
        className="p-2 rounded-sm text-red-800 dark:text-red-300"
      >
        End friendship
      </button>
    </div>
  );
}
