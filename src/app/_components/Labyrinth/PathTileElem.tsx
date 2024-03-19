import React from "react";

import { PathTile, Heading } from "labyrinth-game-logic";

export interface PathTileProps {
  openSides: Heading[];
  treasure: number | null;
}

export default function PathTileElem({ openSides, treasure }: PathTileProps) {
  const content = [];
  let i = 0;
  for (const heading of openSides) {
    switch (heading) {
      case Heading.NORTH:
        content.push(
          <div
            key={i}
            className="absolute left-[33%] right-[33%] top-0 bottom-[33%] bg-orange-200"
          ></div>
        );
        break;
      case Heading.EAST:
        content.push(
          <div
            key={i}
            className="absolute left-[33%] right-0 top-[33%] bottom-[33%] bg-orange-200"
          ></div>
        );
        break;
      case Heading.SOUTH:
        content.push(
          <div
            key={i}
            className="absolute left-[33%] right-[33%] top-[33%] bottom-0 bg-orange-200"
          ></div>
        );
        break;
      case Heading.WEST:
        content.push(
          <div
            key={i}
            className="absolute left-0 right-[33%] top-[33%] bottom-[33%] bg-orange-200"
          ></div>
        );
        break;
    }
    i++;
  }
  return (
    <div className="relative w-20 h-20 bg-orange-600">
      {treasure ?? ""}
      {content}
    </div>
  );
}
