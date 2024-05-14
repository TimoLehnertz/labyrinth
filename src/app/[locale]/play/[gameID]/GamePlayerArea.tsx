import React from "react";
import { components } from "@/app/backend";
import GamePlayerCircle from "./GamePlayerCircle";
import { client } from "@/app/clientAPI";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];

interface Props {
  gamePlayers: GamePlayer[];
  playerToMove: number;
  playerClicked?: (gamePlayer: GamePlayer) => void;
}
export default function GamePlayerArea({
  gamePlayers,
  playerToMove,
  playerClicked,
}: Props) {
  const user = client.useUser();
  gamePlayers = gamePlayers.sort((a, b) => a.playerIndex - b.playerIndex);
  return (
    <div className="flex flex-wrap flex-row gap-4 p-4">
      {gamePlayers.map((gamePlayer, key) => (
        <GamePlayerCircle
          key={key}
          gamePlayer={gamePlayer}
          isToMove={gamePlayer.playerIndex === playerToMove}
          isMe={
            user?.id === gamePlayer.userID && gamePlayer.playerName === null
          }
          playerClicked={playerClicked}
        />
      ))}
    </div>
  );
}
