"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import FriendRequest from "./FriendRequest";
import toast from "react-hot-toast";
import Friend from "./Friend";

interface FriendRequest {
  initiator: string;
  id: string;
  requested: string;
  requestedat: string;
  users_friend_request_initiatorTousers: {
    username: string;
  };
}

interface Friend {
  friendUsername: string;
  friendID: string;
  since: string;
}

export default function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  /**
   * Requests
   */
  useEffect(() => {
    const socket = io("http://localhost:3001/friendRequests", {
      withCredentials: true,
    });
    console.log("socket inited");
    socket.on("data", (data) => {
      const newFriendRequests = JSON.parse(data);
      setFriendRequests((prevFriendRequests) =>
        prevFriendRequests.concat(newFriendRequests)
      );
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const removeFriendRequest = (requestID: string) => {
    setFriendRequests((prevFriendRequests) =>
      prevFriendRequests.filter(
        (friendRequest) => friendRequest.id !== requestID
      )
    );
  };
  const accept = async (requestID: string, username: string) => {
    const response = await fetch("http://localhost:3001/acceptFriendRequest", {
      method: "POST",
      body: JSON.stringify({ requestId: requestID }),
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
    });
    console.log(response);
    if (response.status === 200) {
      toast("You are now friends with " + username);
      removeFriendRequest(requestID);
    } else {
      toast.error("An error occoured");
    }
  };
  const deny = async (requestID: string) => {
    const response = await fetch("http://localhost:3001/denyFriendRequest", {
      method: "POST",
      body: JSON.stringify({ requestId: requestID }),
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
    });
    console.log(response);
    if (response.status === 200) {
      toast("Deleted friend request");
      removeFriendRequest(requestID);
    } else {
      toast.error("An error occoured");
    }
  };
  /**
   * friends
   */
  const [friends, setFriends] = useState<Friend[]>([]);
  useEffect(() => {
    fetch("http://localhost:3001/getFriends", {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
    }).then(async (friends) => {
      setFriends(await friends.json());
    });
  }, []);
  const deleteFriend = async (friendID: string) => {
    fetch("http://localhost:3001/removeFriend", {
      method: "POST",
      body: JSON.stringify({ friendID: friendID }),
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
    }).then(async (res) => {
      if (res.status === 200) {
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend.friendID !== friendID)
        );
      } else {
        toast("An error occoured");
      }
    });
  };
  return (
    <div>
      <p className="mb-2">Friend requests</p>
      <div className="flex flex-col space-y-2 mb-5">
        {friendRequests.map((friendRequest, i) => {
          return (
            <FriendRequest
              key={i}
              accept={accept}
              deny={deny}
              initiatorName={
                friendRequest.users_friend_request_initiatorTousers.username
              }
              requestID={friendRequest.id}
              requestedAt={new Date(friendRequest.requestedat)}
            />
          );
        })}
      </div>
      <p>Your friends</p>
      <div className="flex flex-col space-y-2">
        {friends.map((friend, i) => {
          return (
            <Friend
              key={i}
              deleteFriend={deleteFriend}
              friendID={friend.friendID}
              friendName={friend.friendUsername}
              friendSince={new Date(friend.since)}
            />
          );
        })}
      </div>
    </div>
  );
}
