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
  user: User | null
): [DbGame, (game: DbGame) => void, boolean, boolean] {
  const [game, setGame] = useState<DbGame>(initialGame);
  const [allowChange, setAllowChange] = useState<boolean>(true);
  const [allowEdit, setAllowEdit] = useState<boolean>(
    user !== null && user.id === game.ownerUserID
  );
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
          gameMode: game.gameMode,
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
    setAllowEdit(user !== null && user.id === data.ownerUserID);
    setGame(data);
  };

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND}/game`, {
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

export function generateRandomSeed() {
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
  const [game, setGame, allowChange, allowEdit] = useGame(initialGame, user);
  const router = useRouter();

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
    setGame(newGameSetup);
  };
  const treasureDistributionChanged = (
    treasureCardChances: TreasureCardChances
  ) => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.treasureCardChances = treasureCardChances;
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGame(newGameSetup);
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
    setGame(newGameSetup);
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
    setGame(newGameSetup);
  };

  const regenerateSeed = () => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.seed = generateRandomSeed();
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGame(newGameSetup);
  };

  const seedChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newGameSetup = { ...game };
    const setup = JSON.parse(newGameSetup.gameSetup);
    setup.seed = event.target.value;
    newGameSetup.gameSetup = JSON.stringify(setup);
    setGame(newGameSetup);
  };

  // const updateDisplayPaths = (event: ChangeEvent<HTMLInputElement>) => {
  //   const newGameSetup = { ...game };
  //   newGameSetup.displayPaths = !newGameSetup.displayPaths;
  //   setGame(newGameSetup);
  // };

  const updateGameMode = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(parseInt(event.target.value));
    const newGameSetup = { ...game };
    newGameSetup.gameMode = parseInt(event.target.value);
    setGame(newGameSetup);
  };
  const gameSetup = JSON.parse(game.gameSetup);
  return (
    <div>
      <GameLobby game={game}></GameLobby>
      <div className="p-4">
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
        <div className="flex gap-2">
          <select
            id="gameMode"
            className="text-black"
            onChange={updateGameMode}
            defaultValue={game.gameMode + ""}
          >
            <option value="0">Hard (no help)</option>
            <option value="1">Normal (Displays paths)</option>
            <option value="2">Tutorial (Shows the best move)</option>
          </select>
          {/* <input
            type="checkbox"
            id="displayPaths"
            checked={game.displayPaths}
            onChange={updateDisplayPaths}
          /> */}
          <label htmlFor="gameMode">Game mode</label>
        </div>
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
                  value={JSON.parse(game.gameSetup).boardWidth}
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
                  value={JSON.parse(game.gameSetup).boardHeight}
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
    </div>
  );
}
