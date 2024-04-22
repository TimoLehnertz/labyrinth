import { playerIndexToColor } from "@/app/_components/Labyrinth/PathTileElem";
import { components } from "@/app/backend";
import React from "react";
import { parseBotType } from "./LabyrinthGameUI";

type GamePlayer = components["schemas"]["PlayerPlaysGame"];

interface Props {
  gamePlayer: GamePlayer;
  isToMove: boolean;
  isMe: boolean;
  playerClicked?: (gamePlayer: GamePlayer) => void;
}
export default function GamePlayerCircle({
  gamePlayer,
  isToMove,
  isMe,
  playerClicked,
}: Props) {
  const displayName = isMe ? "You" : playerIndexToColor(gamePlayer.playerIndex);
  //   const displayName = isMe
  // ? "You"
  // : gamePlayer.botType === null
  //   ? gamePlayer.user?.username
  //   : parseBotType(gamePlayer.botType);
  const content = (
    <div
      className="relative rounded-full w-16 h-16 text-ellipsis flex items-center justify-center hover:brightness-75"
      onClick={() => playerClicked?.(gamePlayer)}
      style={{ backgroundColor: playerIndexToColor(gamePlayer.playerIndex) }}
    >
      {displayName}
    </div>
  );
  return isToMove ? (
    <div
      className="p-[0.3rem] bg-neutral-500 rounded-3xl border-[0.2rem]"
      onClick={() => playerClicked?.(gamePlayer)}
    >
      {content}
    </div>
  ) : (
    <div className="p-[0.5rem]">{content}</div>
  );
}
