"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FriendRequest from "./FriendRequest";
import Friend from "./Friend";
import { client } from "../clientAPI";
import { components } from "../backend";
import toast from "react-hot-toast";
import { useEntity } from "../utils/UseEntity";

type FriendRequest = components["schemas"]["FriendRequest"];
type Friendship = components["schemas"]["Friendship"];

export default function FriendRequests() {
  const [sentRequests] = useEntity<FriendRequest>("friends", "sent-requests");
  const [receivedRequests, setReceivedRequests] = useEntity<FriendRequest>(
    "friends",
    "received-requests"
  );
  const [friendships] = useEntity<Friendship>("friends", "friends");

  const accept = async (friendRequest: FriendRequest) => {
    const res = await client.api.POST("/friends/request", {
      params: {
        query: {
          username: friendRequest.initiatorUser.username,
        },
      },
    });
    if (res.error) {
      toast(res.error.message);
    } else {
      toast(`You are now friends with ${friendRequest.initiatorUser.username}`);
    }
  };
  const deny = async (friendRequest: FriendRequest) => {
    const res = await client.api.DELETE("/friends/request", {
      params: {
        query: {
          requestID: friendRequest.id,
        },
      },
    });
    if (res.error) {
      toast(res.error.message);
    }
  };
  /**
   * friends
   */
  const endFriendship = async (friendship: Friendship) => {
    const res = await client.api.DELETE("/friends/friend", {
      params: {
        query: {
          friendshipID: friendship.id,
        },
      },
    });
    if (res.error) {
      toast(res.error.message);
    }
  };
  const ignoreFriendRequest = async (friendRequest: FriendRequest) => {
    const res = await client.api.PUT("/friends/ignore-request", {
      params: {
        query: {
          requestID: friendRequest.id,
        },
      },
    });
    if (res.error) {
      toast(res.error.message);
    }
    setReceivedRequests((prevReceivedRequests) =>
      prevReceivedRequests.filter((receivedRequests) => {
        receivedRequests.id !== friendRequest.id;
      })
    );
  };
  return (
    <div>
      <p>Your friends</p>
      <div className="flex flex-col space-y-2">
        {friendships.map((friendship, i) => {
          return (
            <Friend
              key={i}
              endFriendship={endFriendship}
              friendship={friendship}
            />
          );
        })}
      </div>
      <p className="mb-2">Received requests</p>
      <div className="flex flex-col space-y-2 mb-5">
        {receivedRequests.map((friendRequest, i) => {
          return (
            <FriendRequest
              key={i}
              accept={accept}
              deny={deny}
              ignore={ignoreFriendRequest}
              friendRequest={friendRequest}
            />
          );
        })}
      </div>
      <p className="mb-2">Sent requests</p>
      <div className="flex flex-col space-y-2 mb-5">
        {sentRequests.map((friendRequest, i) => {
          return (
            <FriendRequest
              key={i}
              accept={accept}
              deny={deny}
              ignore={ignoreFriendRequest}
              friendRequest={friendRequest}
            />
          );
        })}
      </div>
    </div>
  );
}
