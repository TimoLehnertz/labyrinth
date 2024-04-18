"use client";
import { Board, CardRatios, TreasureCardChances } from "labyrinth-game-logic";
import React, { ChangeEvent, useEffect, useState } from "react";
import { activities, animalNames } from "./animals";
import CardRatiosSettings from "./CardRatiosSettings";
import TreasureDistributionSettings from "./TreasureDistributionSettings";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";
import { client, User } from "@/app/clientAPI";
import { io } from "socket.io-client";
import { components } from "@/app/backend";
import toast from "react-hot-toast";
import GameLobby from "./GameLobby";
import { useRouter } from "next/navigation";

type DbGame = components["schemas"]["Game"];

export function useGame(
  initialGame: DbGame,
  user: User
): [DbGame, (game: DbGame) => void, boolean, boolean] {
  const [game, setGame] = useState<DbGame>(initialGame);
  const [allowChange, setAllowChange] = useState<boolean>(true);
  const [allowEdit, setAllowEdit] = useState<boolean>(
    user.id === game.ownerUserID
    // true
  );
  // console.log(client.useUser()?.id === game.ownerUserID);
  const updateGame = (game: DbGame) => {
    if (!allowEdit || !allowChange) {
      return;
    }
    setAllowChange(false);
    client.api
      .PUT("/game", {
        body: {
          id: initialGame.id,
          visibility: game.visibility,
          gameSetup: JSON.parse(game.gameSetup),
          ownerID: game.ownerUserID,
        },
      })
      .then((res) => {
        if (res.error) {
          toast.error(res.error.message);
        }
        setAllowChange(true);
      })
      .catch(() => {
        toast.error("an error occurred");
        setAllowChange(true);
      });
  };
  const update = (data: any) => {
    // console.log("game updated", data);
    // console.log("me", user);
    // console.log("I can edit", user.id === data.ownerUserID);
    setAllowEdit(user.id === data.ownerUserID);
    setGame(data);
  };

  useEffect(() => {
    const socket = io(`http://localhost:3001/game`, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { Bearer: client.getToken() },
      extraHeaders: {
        Bearer: client.getToken(),
      },
    });
    socket.auth = {
      Bearer: client.getToken(),
    };
    socket.emit("getGame", initialGame.id);
    socket.on("update", update);

    return () => {
      socket.disconnect();
    };
  }, []);
  return [game, updateGame, allowChange, allowEdit];
}

function getSizeOptions(selectedValue: number) {
  const validSizes = Board.getValidSizes(14);
  return validSizes.map((size, i) => {
    return (
      // <option value={size} key={i} selected={selectedValue === size}>
      <option value={size} key={i}>
        {size}
      </option>
    );
  });
}

function generateRandomSeed() {
  const animal1Index = Math.floor(Math.random() * 0.999 * animalNames.length);
  const activityIndex = Math.floor(Math.random() * 0.999 * activities.length);
  const animal2Index = Math.floor(Math.random() * 0.999 * animalNames.length);
  return `A ${animalNames[animal1Index].toLowerCase()} ${activities[activityIndex]} ${animalNames[animal2Index].toLowerCase()}`;
}

interface Props {
  initialGame: DbGame;
  user: User;
}
export default function GameSettings({ initialGame, user }: Props) {
  const [game, setGameSetup, allowChange, allowEdit] = useGame(
    initialGame,
    user
  );
  const router = useRouter();

  // console.log("edit: ", allowEdit);
  // useEffect(() => {
  //   const newGameSetup = { ...game };
  //   const setup = JSON.parse(newGameSetup.gameSetup);
  //   setup.seed = generateRandomSeed();
  //   newGameSetup.gameSetup = JSON.stringify(setup);
  //   setGameSetup(newGameSetup);
  // }, [game]);

  useEffect(() => {
    if (game.started) {
      router.push(`/play/${game.id}`);
    }
  }, [game, router]);

  const cardRatiosChanged = (cardRatios: CardRatios) => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.cardsRatio = cardRatios;
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGameSetup(newGameSetup);
  };
  const treasureDistributionChanged = (
    treasureCardChances: TreasureCardChances
  ) => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.treasureCardChances = treasureCardChances;
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGameSetup(newGameSetup);
  };

  const widthChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.boardWidth = parseInt(event.target.value);
    setup.playerCount = Board.getMaxPlayerCount(
      setup.boardWidth,
      setup.boardHeight
    );
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGameSetup(newGameSetup);
  };

  const heightChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.boardHeight = parseInt(event.target.value);
    setup.playerCount = Board.getMaxPlayerCount(
      setup.boardWidth,
      setup.boardHeight
    );
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGameSetup(newGameSetup);
  };

  const regenerateSeed = () => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.seed = generateRandomSeed();
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGameSetup(newGameSetup);
  };

  const seedChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.seed = event.target.value;
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGameSetup(newGameSetup);
  };
  const gameSetup = JSON.parse(game.gameSetup);
  return (
    <div>
      <GameLobby game={game}></GameLobby>
      <details>
        <summary>Advanced game settings</summary>
        <br />
        <CardRatiosSettings
          readonly={allowEdit}
          value={gameSetup.cardsRatio}
          onChange={cardRatiosChanged}
        />
        <br />
        <TreasureDistributionSettings
          readonly={allowEdit}
          value={gameSetup.treasureCardChances}
          onChange={treasureDistributionChanged}
        />
      </details>
      <br />
      <p className="text-xl text-center">Map editor</p>
      <br />
      <div className="flex flex-row space-x-10 justify-center">
        {allowEdit ? (
          <div className="flex flex-col space-y-2">
            <div>
              <label htmlFor="width" className="mr-2">
                Width
              </label>
              <select
                name="width"
                id="width"
                onChange={widthChanged}
                className="text-black"
                // value={JSON.parse(game.gameSetup).boardWidth}
              >
                {getSizeOptions(gameSetup.boardWidth)}
              </select>
            </div>
            <div>
              <label htmlFor="height" className="mr-2">
                height
              </label>
              <select
                name="height"
                id="height"
                onChange={heightChanged}
                className="text-black"
                // value={JSON.parse(game.gameSetup).boardWidth}
              >
                {getSizeOptions(gameSetup.boardHeight)}
              </select>
            </div>
          </div>
        ) : (
          <>
            <div>Boardwidth: {gameSetup.boardWidth}</div>
            <div>boardheight: {gameSetup.boardHeight}</div>
            <div>{"=>"}</div>
          </>
        )}

        <div>{gameSetup.playerCount} Maximum Players</div>
      </div>
      <br />
      <div className="flex flex-col gap-2">
        <label htmlFor="seed" className="text-xl text-center">
          Seed
        </label>
        {allowEdit ? (
          <input
            type="text"
            className="w-72 bg-gray-800 text-white p-2 rounded"
            value={gameSetup.seed}
            onChange={seedChanged}
          />
        ) : (
          <p>{gameSetup.seed}</p>
        )}

        {allowEdit ? (
          <PrimaryButton type="button" onClick={regenerateSeed}>
            Regenerate
          </PrimaryButton>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-row justify-center mt-10">
        <Labyrinth
          seed={JSON.parse(game.gameSetup).seed}
          boardWidth={JSON.parse(game.gameSetup).boardWidth}
          boardHeight={JSON.parse(game.gameSetup).boardHeight}
        ></Labyrinth>
      </div>
    </div>
  );
}