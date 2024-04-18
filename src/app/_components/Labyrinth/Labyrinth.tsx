"use client";
import React from "react";
import { BoardPosition, Game } from "labyrinth-game-logic";
import PathTileElem from "./PathTileElem";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export interface LabyrinthProps {
  seed: string;
  boardWidth: number;
  boardHeight: number;
}

export default function Labyrinth({
  seed,
  boardWidth,
  boardHeight,
}: LabyrinthProps) {
  // useEffect(() => {
  //   // Create a socket connection
  //   const socket = io("http://localhost:3001", {
  //     withCredentials: true,
  //   });

  //   // Listen for incoming messages
  //   socket.on("message", (message) => {
  //     console.log("received " + message);
  //   });
  //   socket.send("gameABC", "Hello world");
  //   // Clean up the socket connection on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const game = Game.buildFromSetup({
    playerCount: 2,
    seed,
    boardHeight,
    boardWidth,
  });
  const gameState = game.gameState;
  const cols = [];
  for (let x = 0; x < gameState.board.width; x++) {
    const colTiles = [];
    for (let y = 0; y < gameState.board.height; y++) {
      colTiles.push(
        <PathTileElem
          x={x}
          y={y}
          key={`tile-${x}-${y}`}
          gameState={game.gameState}
          ownPlayerIndex={null}
        />
      );
    }
    const col = (
      <div key={`col${x}`} className="flex flex-col space-y-1">
        {colTiles}
      </div>
    );
    cols.push(col);
  }
  return (
    <div>
      <div className="flex flex-row w-max h-max space-x-1">{cols}</div>
    </div>
  );
}
