import React from "react";
import TimeDiff from "./TimeDiff";
import { Schema } from "zod";
import { components } from "../backend";
import { client } from "../clientAPI";

export interface FriendRequestProps {
  friendRequest: components["schemas"]["FriendRequest"];
  accept: (friendRequest: components["schemas"]["FriendRequest"]) => void;
  ignore: (friendRequest: components["schemas"]["FriendRequest"]) => void;
  deny: (friendRequest: components["schemas"]["FriendRequest"]) => void;
}

export default function FriendRequest({
  friendRequest,
  accept,
  ignore,
  deny,
}: FriendRequestProps) {
  const ownUser = client.getLoggedInUserOrThrow();
  let isIncoming = false;
  let otherUser: components["schemas"]["User"];
  if (ownUser.id === friendRequest.initiator) {
    // this is a sent friend request
    otherUser = friendRequest.requestedUser;
  } else {
    // this is a received friend request
    isIncoming = true;
    otherUser = friendRequest.initiatorUser;
  }
  return (
    <div className="flex space-x-2 content-center">
      {isIncoming ? (
        <>
          <span className="font-bold">{otherUser.username}</span>
          <span>
            wants to be friends with you (
            <TimeDiff date={new Date(friendRequest.requestedAt)} /> ago)
          </span>
          <button
            onClick={() => accept(friendRequest)}
            className="p-2 rounded-sm dark:bg-neutral-700 bg-neutral-300"
          >
            Accept
          </button>
          <button
            onClick={() => ignore(friendRequest)}
            className="p-2 rounded-sm dark:bg-neutral-700 bg-neutral-300"
          >
            Ignore
          </button>
        </>
      ) : (
        <>
          <span>
            Waiting for <span className="font-bold">{otherUser.username}</span>{" "}
            to accept (sent{" "}
            <TimeDiff date={new Date(friendRequest.requestedAt)} /> ago)
          </span>
        </>
      )}
      <button
        onClick={() => deny(friendRequest)}
        className="p-2 rounded-sm dark:bg-red-800 bg-red-300"
      >
        Delete
      </button>
    </div>
  );
}
