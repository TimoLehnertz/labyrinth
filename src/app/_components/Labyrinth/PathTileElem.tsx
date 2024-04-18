"use client";
import React from "react";
import Image from "next/image";

import {
  BoardPosition,
  Game,
  GameState,
  PathTile,
  TileType,
} from "labyrinth-game-logic";

export function playerIndexToColor(playerIndex: number) {
  switch (playerIndex % 16) {
    case 0:
      return "red";
    case 1:
      return "green";
    case 2:
      return "blue";
    case 3:
      return "yellow";
    case 4:
      return "purple";
    case 5:
      return "orange";
    case 6:
      return "cyan";
    case 7:
      return "magenta";
    case 8:
      return "lime";
    case 9:
      return "teal";
    case 10:
      return "pink";
    case 11:
      return "indigo";
    case 12:
      return "brown";
    case 13:
      return "maroon";
    case 14:
      return "olive";
    case 15:
      return "navy";
    default:
      return "black"; // Fallback color
  }
}

function openSidesToImg(pathTile: PathTile) {
  switch (pathTile.tileType) {
    case TileType.L:
      return "/img/L.png";
    case TileType.STREIGHT:
      return "/img/streight.png";
    case TileType.T:
      return "/img/T.png";
  }
}

function rotationToClass(rotation: number): string {
  switch (rotation) {
    default:
      return "";
    case 1:
      return "rotate-90";
    case 2:
      return "rotate-180";
    case 3:
      return "-rotate-90";
  }
}

export function treasureIDToPath(id: number) {
  id++;
  if (id < 10) {
    return `/img/treasures/00${id}.png`;
  } else if (id < 100) {
    return `/img/treasures/0${id}.png`;
  } else {
    return `/img/treasures/${id}.png`;
  }
}

function buildPlayerIndicators(
  gameState: GameState,
  x: number,
  y: number,
  ownPlayerIndex: number | null
) {
  const playerIndices: number[] = [];
  const playerPositions = gameState.allPlayerStates.getPlayerPositions();
  let meInside = false;
  for (
    let playerIndex = 0;
    playerIndex < playerPositions.length;
    playerIndex++
  ) {
    const playerPosition = playerPositions[playerIndex];
    if (playerPosition.equals(new BoardPosition(x, y))) {
      if (playerIndex === ownPlayerIndex) {
        meInside = true;
      } else {
        playerIndices.push(playerIndex);
      }
    }
  }
  if (meInside && ownPlayerIndex !== null) {
    playerIndices.push(ownPlayerIndex);
  }
  const playerIndicators = [];
  let i = 0;
  for (const playerIndex of playerIndices) {
    playerIndicators.push(
      <div
        key={i}
        className="rounded-full w-3 h-3 border mr-[-0.1rem]"
        style={{ backgroundColor: playerIndexToColor(playerIndex) }}
      ></div>
    );
    i++;
  }
  return (
    <div className="absolute inset-0 flex justify-center items-center players">
      {playerIndicators}
    </div>
  );
}

export interface Props {
  gameState: GameState;
  ownPlayerIndex: number | null;
  x?: number;
  y?: number;
  rotation?: number;
  onClick?: (position: BoardPosition) => void;
  displayDot?: boolean;
}
export default function PathTileElem({
  gameState,
  x,
  y,
  ownPlayerIndex,
  displayDot,
  onClick,
}: Props) {
  let pathTile;
  if (x === undefined || y === undefined) {
    pathTile = gameState.board.looseTile;
  } else {
    pathTile = gameState.board.getTile(new BoardPosition(x, y));
  }
  const imagePath = openSidesToImg(pathTile);

  let treasureImage = <></>;
  if (pathTile.treasure) {
    treasureImage = (
      <Image
        src={treasureIDToPath(pathTile.treasure.id)}
        width={50}
        height={50}
        alt=""
        className="absolute inset-0 scale-[35%]"
      ></Image>
    );
  }
  let homePosition = <></>;
  if (pathTile.homeOfPlayerIndex !== null) {
    const backgroundColor = playerIndexToColor(pathTile.homeOfPlayerIndex);
    homePosition = (
      <div
        className="absolute inset-0 scale-[40%] rounded-full border-solid border-2 border-gray-900"
        style={{ backgroundColor, filter: "opacity(0.8)" }}
      ></div>
    );
  }

  const clicked = () => {
    if (x === undefined || y === undefined) {
      return;
    }
    onClick?.(new BoardPosition(x, y));
  };

  return (
    <div className="relative aspect-square" onClick={clicked}>
      <Image
        className={rotationToClass(pathTile.rotation) + " absolute inset-0"}
        src={imagePath}
        alt=""
        width={400}
        height={400}
      ></Image>
      {displayDot && (
        <div className="absolute inset-0 rounded-full bg-slate-700 scale-[45%] opacity-70"></div>
      )}
      {treasureImage}
      {homePosition}
      {x !== undefined &&
        y !== undefined &&
        buildPlayerIndicators(gameState, x, y, ownPlayerIndex)}
    </div>
  );
}
