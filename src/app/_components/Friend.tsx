import React from "react";
import TimeDiff from "./TimeDiff";

export interface FriendProps {
  friendName: string;
  friendID: string;
  friendSince: Date;
  deleteFriend: (friendID: string) => void;
}

export default function Friend({
  friendName,
  friendID,
  friendSince,
  deleteFriend,
}: FriendProps) {
  return (
    <div className="flex space-x-2 content-center">
      <span>{friendName}</span>
      <span>Friends since</span>
      <TimeDiff date={friendSince} />
      <button
        onClick={() => {
          // @todo confirm
          deleteFriend(friendID);
        }}
        className="p-2 rounded-sm text-red-800 dark:text-red-300"
      >
        End friendship
      </button>
    </div>
  );
}
