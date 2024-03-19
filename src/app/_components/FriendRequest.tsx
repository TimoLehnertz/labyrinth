import React from "react";
import TimeDiff from "./TimeDiff";

export interface FriendRequestProps {
  requestedAt: Date;
  requestID: string;
  initiatorName: string;
  accept: (requestID: string, username: string) => void;
  deny: (requestID: string) => void;
}

export default function FriendRequest({
  requestedAt,
  requestID,
  initiatorName,
  accept,
  deny,
}: FriendRequestProps) {
  return (
    <div className="flex space-x-2">
      <span>
        FriendRequest by {initiatorName} <TimeDiff date={requestedAt} /> ago
      </span>
      <button
        onClick={() => accept(requestID, initiatorName)}
        className="p-2 rounded-sm dark:bg-neutral-700 bg-neutral-300"
      >
        Accept
      </button>
      <button
        onClick={() => deny(requestID)}
        className="p-2 rounded-sm dark:bg-red-800 bg-red-300"
      >
        Delete
      </button>
    </div>
  );
}
