"use client";
import React from "react";
import { Game, Heading, ShiftPosition } from "labyrinth-game-logic";
import { getTile } from "./LabyrinthMoveCreator";

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
  const cards = [];
  for (let y = 0; y < gameState.board.height + 2; y++) {
    for (let x = 0; x < gameState.board.width + 2; x++) {
      cards.push(
        getTile(
          x,
          y,
          gameState,
          new ShiftPosition(Heading.NORTH, 1),
          () => {},
          null,
          `${Math.random()}`,
          [],
          () => {}
        )
      );
    }
  }
  return (
    <div
      className="grid gap-[0.1rem] max-w-[50rem] flex-grow"
      style={{
        gridTemplateColumns: `repeat(${gameState.board.width + 2}, minmax(0, 1fr))`,
      }}
    >
      {cards}
    </div>
  );
}
