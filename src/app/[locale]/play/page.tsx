import { Game } from "labyrinth-game-logic";
import React from "react";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";

export default function page() {
  const game = Game.buildFromSetup({
    playerCount: 2,
    seed: "Hello world",
  });
  const state = { ...game.gameState };
  // const state = Object.assign({}, game.gameState);
  return <div>{<Labyrinth></Labyrinth>}</div>;
}
