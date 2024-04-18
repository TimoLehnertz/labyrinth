import { playerIndexToColor } from "@/app/_components/Labyrinth/PathTileElem";
import { components } from "@/app/backend";
import React from "react";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];

interface Props {
  gamePlayer: GamePlayer;
  isToMove: boolean;
  isMe: boolean;
}
export default function GamePlayerCircle({
  gamePlayer,
  isToMove,
  isMe,
}: Props) {
  return isToMove ? (
    <div
      className="relative bg-gray-500 rounded-full w-20 h-20 text-ellipsis border-2 flex items-center justify-center"
      style={{ borderColor: playerIndexToColor(gamePlayer.playerIndex) }}
    >
      {gamePlayer.botType === "player" ? gamePlayer.user?.username : "Bot"}
    </div>
  ) : (
    <div
      className="relative bg-gray-700 rounded-full w-20 h-20 text-ellipsis border-2 flex items-center justify-center"
      style={{ borderColor: playerIndexToColor(gamePlayer.playerIndex) }}
    >
      {gamePlayer.botType === "player" ? gamePlayer.user?.username : "Bot"}
    </div>
  );
}
