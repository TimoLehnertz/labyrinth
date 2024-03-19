"use client";
import React from "react";
import { BoardPosition, Game } from "labyrinth-game-logic";
import PathTileElem from "./PathTileElem";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export interface LabyrinthProps {}

export default function Labyrinth({}: LabyrinthProps) {
  useEffect(() => {
    // Create a socket connection
    const socket = io("http://localhost:3001", {
      withCredentials: true,
    });

    // Listen for incoming messages
    socket.on("message", (message) => {
      console.log("received " + message);
    });
    socket.send("gameABC", "Hello world");
    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const game = Game.buildFromSetup({
    playerCount: 2,
    seed: "Hello world",
    boardHeight: 7,
    boardWidth: 9,
  });
  const gameState = game.gameState;
  const cols = [];
  for (let x = 0; x < gameState.board.width; x++) {
    const colTiles = [];
    for (let y = 0; y < gameState.board.height; y++) {
      colTiles.push(
        <PathTileElem
          key={`tile-${x}-${y}`}
          openSides={
            gameState.board.getTile(new BoardPosition(x, y)).openSides.headings
          }
          treasure={
            gameState.board.getTile(new BoardPosition(x, y)).treasure?.id ??
            null
          }
        />
      );
    }
    const col = (
      <div key={`col${x}`} className="flex flex-col space-y-2">
        {colTiles}
      </div>
    );
    cols.push(col);
  }
  const connect = () => {};
  return (
    <div>
      <div className="flex flex-row w-max h-max space-x-2">{cols}</div>
      <button onClick={connect}>Connect</button>
    </div>
  );
}
