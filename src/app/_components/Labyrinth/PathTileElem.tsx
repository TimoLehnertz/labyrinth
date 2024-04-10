"use client";
import React from "react";
import Image from "next/image";

import { PathTile, TileType } from "labyrinth-game-logic";

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

export interface PathTileProps {
  pathTile: PathTile;
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

function idToPath(id: number) {
  id++;
  if (id < 10) {
    return `/img/treasures/00${id}.png`;
  } else if (id < 100) {
    return `/img/treasures/0${id}.png`;
  } else {
    return `/img/treasures/${id}.png`;
  }
}

export default function PathTileElem({ pathTile }: PathTileProps) {
  const content = [];
  let i = 0;
  const imagePath = openSidesToImg(pathTile);

  let treasureImage = <></>;
  if (pathTile.treasure) {
    treasureImage = (
      <Image
        src={idToPath(pathTile.treasure.id)}
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

  return (
    <div className="relative w-10 h-10">
      <Image
        className={rotationToClass(pathTile.rotation) + " absolute inset-0"}
        src={imagePath}
        alt=""
        width={400}
        height={400}
      ></Image>
      {treasureImage}
      {homePosition}
    </div>
  );
}
