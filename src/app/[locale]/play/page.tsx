import React from "react";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";

export default function page() {
  return (
    <div>
      <h1 className="text-3xl text-center">Play the crazy labyrinth!</h1>
      <div className="flex justify-center mt-10">
        <div className="flex flex-col space-y-5 w-64">
          <PrimaryButton href="/play/online">Play online</PrimaryButton>
          <PrimaryButton href="/play?online=1">Challenge the AI</PrimaryButton>
          <PrimaryButton href="/play?online=1">Play local</PrimaryButton>
        </div>
      </div>
      <div className="flex flex-row justify-center mt-10">
        <Labyrinth boardHeight={7} boardWidth={7} seed="ds"></Labyrinth>
      </div>
    </div>
  );
}
