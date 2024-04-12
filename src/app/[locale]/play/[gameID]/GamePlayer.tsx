"use client";
import { client } from "@/app/clientAPI";
import { components } from "@/app/backend";
import React, { useEffect, useState } from "react";
import SecondaryButton from "@/app/_components/buttons/SecondaryButton";
import toast from "react-hot-toast";
import { playerIndexToColor } from "@/app/_components/Labyrinth/PathTileElem";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];
type Game = components["schemas"]["Game"];

interface Props {
  gamePlayer: GamePlayer;
  game: Game;
}
export default function GamePlayer({ gamePlayer, game }: Props) {
  const user = client.useUser();
  const [isSelf, setSelf] = useState<boolean>(false);
  const [isHost, setHost] = useState<boolean>(false);
  const [meHost, setMeHost] = useState<boolean>(false);
  const [isBot, setBot] = useState<boolean>(false);

  useEffect(() => {
    setSelf(user?.id === gamePlayer.userID);
    setHost(game.ownerUserID === gamePlayer.userID);
    setMeHost(user?.id === game.ownerUserID);
    setBot(gamePlayer.botType !== "player");
  }, [user, game]);
  const makeAdmin = async () => {
    if (gamePlayer.userID === null) {
      return;
    }
    const res = await client.api.PUT("/game/makeAdmin", {
      params: {
        query: {
          gameID: game.id,
          userID: gamePlayer.userID,
        },
      },
    });
    if (res.error) {
      toast.error("an error occured");
    }
  };

  const kick = async () => {
    const res = await client.api.DELETE("/game/leave", {
      params: {
        query: {
          gameID: game.id,
          userIndex: gamePlayer.playerIndex,
        },
      },
    });
    if (res.error) {
      toast.error("an error occured");
    }
  };
  return (
    <div className="flex flex-row gap-2">
      <div
        className="bg-gray-600 rounded-md p-1 pl-2 pr-2"
        style={{
          backgroundColor: playerIndexToColor(gamePlayer.playerIndex),
          opacity: 0.8,
        }}
      >
        {playerIndexToColor(gamePlayer.playerIndex)}
      </div>
      <span
        className="flex min-w-16"
        style={{ color: gamePlayer.ready ? "green" : "red" }}
      >
        {isSelf ? "You" : gamePlayer.user?.username}
        <div className="ml-2" style={{ color: "#CCC" }}>
          {isHost ? "(Host)" : ""}
        </div>
      </span>
      {meHost && !isSelf ? (
        <>
          <SecondaryButton onClick={kick}>Kick</SecondaryButton>
        </>
      ) : (
        <></>
      )}
      {meHost && !isBot && !isSelf ? (
        <SecondaryButton onClick={makeAdmin}>Make admin</SecondaryButton>
      ) : (
        <></>
      )}
    </div>
  );
}
