import React from "react";
import { server } from "@/app/serverAPI";
import { redirect } from "next/navigation";
import LabyrinthGameUI from "./LabyrinthGameUI";

interface Props {
  params: {
    gameID: string;
  };
}
export default async function Page({ params }: Props) {
  const user = await server.getLoggedInUser();
  if (user === null) {
    redirect("/");
  }
  const response = await server.api.GET("/game", {
    params: {
      query: {
        gameID: params.gameID,
      },
    },
  });
  if (response.error || !response.data) {
    redirect("/");
  }
  const gamePlayersRes = await server.api.GET("/game/players", {
    params: {
      query: {
        gameID: params.gameID,
      },
    },
  });
  let ownPlayerIndex = null;
  if (gamePlayersRes.data) {
    for (const gamePlayer of gamePlayersRes.data) {
      if (gamePlayer.userID === user.id) {
        ownPlayerIndex = gamePlayer.playerIndex;
        break;
      }
    }
  }
  return (
    <LabyrinthGameUI
      initialGame={response.data}
      user={user}
      ownPlayerIndex={ownPlayerIndex}
    />
  );
}
