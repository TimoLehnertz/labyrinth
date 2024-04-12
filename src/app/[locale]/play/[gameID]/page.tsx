import React, { useEffect, useState } from "react";
import { server } from "@/app/serverAPI";
import GameSettings from "./GameSettings";
import { redirect } from "next/navigation";
import GameLobby from "./GameLobby";

interface Props {
  params: {
    gameID: string;
  };
}

export default async function Page({ params }: Props) {
  const user = await server.getLoggedInUser();
  if (user === null) {
    redirect("/");
    return;
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
    return;
  }
  return (
    <div>
      <GameSettings initialGame={response.data} user={user}></GameSettings>
    </div>
  );
}
