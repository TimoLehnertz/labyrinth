"use client";
import {
  BoardPosition,
  Game,
  GameState,
  Heading,
  Move,
  PathTile,
  printBoard,
  ShiftPosition,
  Treasure,
} from "labyrinth-game-logic";
import React, { useEffect, useState } from "react";
import PathTileElem from "./PathTileElem";
import SecondaryButton from "../buttons/SecondaryButton";

function isEdge(x: number, y: number, width: number, height: number): boolean {
  return x === 0 || y === 0 || x === width - 1 || y === height - 1;
}

function isCorner(
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  return (
    (x === 0 && y === 0) ||
    (x === width + 1 && y === 0) ||
    (x === width + 1 && y === height + 1) ||
    (x === 0 && y === height + 1)
  );
}

function headingByCoordinate(
  x: number,
  y: number,
  width: number,
  height: number
): Heading {
  let heading = Heading.NORTH;
  if (y === 0) {
    heading = Heading.NORTH;
  } else if (x === width + 1) {
    heading = Heading.EAST;
  } else if (y === height + 1) {
    heading = Heading.SOUTH;
  } else if (x === 0) {
    heading = Heading.WEST;
  }
  return heading;
}

function offsetByCoordinate(x: number, y: number, heading: Heading): number {
  switch (heading) {
    case Heading.NORTH:
    case Heading.SOUTH:
      return x - 1;
    case Heading.EAST:
    case Heading.WEST:
      return y - 1;
  }
}

function getEmptyEdgeTile(key: string) {
  return <div key={key} className="aspect-square"></div>;
}

function getShiftPositionTile(
  shiftPosition: ShiftPosition,
  currentShiftPosition: ShiftPosition | null,
  setShiftPosition: (shiftPosition: ShiftPosition) => void,
  gameState: GameState,
  ownPlayerIndex: number | null,
  key: string
) {
  const isHere =
    currentShiftPosition !== null && shiftPosition.equals(currentShiftPosition);
  return (
    <div
      key={key}
      className="aspect-square relative bg-gray-500 rounded-xl hover:bg-gray-600"
      onClick={() => shiftPosition && setShiftPosition(shiftPosition)}
    >
      {isHere && (
        <PathTileElem gameState={gameState} ownPlayerIndex={ownPlayerIndex} />
      )}
    </div>
  );
}

export function getTile(
  x: number,
  y: number,
  gameState: GameState,
  shiftPosition: ShiftPosition | null,
  setShiftPosition: (shiftPosition: ShiftPosition) => void,
  ownPlayerIndex: number | null,
  key: string,
  clickablePositions: BoardPosition[],
  tileClicked: (position: BoardPosition) => void
) {
  const width = gameState.board.width;
  const height = gameState.board.height;
  if (!isEdge(x, y, width + 2, height + 2)) {
    let isClickable = false;
    for (const clickablePosition of clickablePositions) {
      if (clickablePosition.equals(new BoardPosition(x - 1, y - 1))) {
        isClickable = true;
        break;
      }
    }
    return (
      <PathTileElem
        key={`tile-${x}-${y}`}
        gameState={gameState}
        x={x - 1}
        y={y - 1}
        ownPlayerIndex={ownPlayerIndex}
        displayDot={isClickable}
        onClick={isClickable ? tileClicked : undefined}
      />
    );
  }
  if (
    isCorner(x, y, width, height) ||
    ownPlayerIndex !== gameState.allPlayerStates.playerIndexToMove
  ) {
    return getEmptyEdgeTile(key);
  }
  const heading = headingByCoordinate(x, y, width, height);
  const offset = offsetByCoordinate(x, y, heading);
  if (offset % 2 === 0) {
    return getEmptyEdgeTile(key);
  }
  const index = (offset - 1) / 2;
  return getShiftPositionTile(
    new ShiftPosition(heading, index),
    shiftPosition,
    setShiftPosition,
    gameState,
    ownPlayerIndex,
    key
  );
}

interface Props {
  gameState: GameState;
  onMove: (move: Move) => void;
  ownPlayerIndex: number | null;
}
export default function LabyrinthMoveCreator({
  gameState,
  onMove,
  ownPlayerIndex,
}: Props) {
  const [displayPositions, setDisplayPositions] = useState(false);
  const [alteredGameState, setAlteredGameState] =
    useState<GameState>(gameState);
  const [shiftPosition, setShiftPosition] = useState<ShiftPosition | null>(
    gameState.board.shiftPosition
  );
  const [rotateBeforeShift, setRotateBeforeShift] = useState<number>(0);

  useEffect(() => {
    setDisplayPositions(false);
    setShiftPosition(gameState.board.shiftPosition);
    setRotateBeforeShift(0);
    setAlteredGameState(gameState);
  }, [gameState]);

  const isToMove =
    ownPlayerIndex === gameState.allPlayerStates.playerIndexToMove;

  const updateShiftPosition = (shiftPosition: ShiftPosition) => {
    setShiftPosition(shiftPosition);
    const shiftedState = gameState.setShiftPosition(shiftPosition);
    setAlteredGameState(shiftedState);
    setDisplayPositions(false);
  };

  const rotate = (cw: boolean) => {
    setRotateBeforeShift(rotateBeforeShift + (cw ? 1 : -1));
    setAlteredGameState(alteredGameState.rotateLooseTile(cw ? 1 : -1));
  };

  const push = () => {
    setAlteredGameState(alteredGameState.insertLooseTile());
    setDisplayPositions(true);
  };

  const tileClicked = (position: BoardPosition) => {
    if (ownPlayerIndex === null) {
      return;
    }
    if (shiftPosition === null) {
      return;
    }
    const treasureAtTile = alteredGameState.board.getTile(position).treasure;
    const searchedTreasure =
      alteredGameState.allPlayerStates.getPlayerState(
        ownPlayerIndex
      ).currentTreasure;
    const collectedTreasure = Treasure.compare(treasureAtTile, searchedTreasure)
      ? treasureAtTile
      : null;
    const move = new Move(
      ownPlayerIndex,
      rotateBeforeShift,
      gameState.board.shiftPosition,
      shiftPosition,
      alteredGameState.allPlayerStates.getPlayerState(ownPlayerIndex).position,
      position,
      collectedTreasure
    );
    onMove(move);
  };

  let clickablePositions: BoardPosition[] = [];
  if (displayPositions && isToMove) {
    clickablePositions = alteredGameState.board.getReachablePositions(
      alteredGameState.allPlayerStates.getPlayerState(ownPlayerIndex).position
    );
  }

  const cards = [];
  for (let y = 0; y < gameState.board.height + 2; y++) {
    for (let x = 0; x < gameState.board.width + 2; x++) {
      cards.push(
        getTile(
          x,
          y,
          alteredGameState,
          displayPositions ? null : shiftPosition,
          updateShiftPosition,
          ownPlayerIndex,
          `${Math.random()}`,
          clickablePositions,
          tileClicked
        )
      );
    }
  }

  return (
    <div>
      <div
        className="grid gap-[0.1rem] max-w-[50rem] flex-grow"
        style={{
          gridTemplateColumns: `repeat(${gameState.board.width + 2}, minmax(0, 1fr))`,
        }}
      >
        {cards}
      </div>
      <div className="flex gap-2 mt-3 p-2">
        {isToMove && !displayPositions && (
          <>
            <SecondaryButton onClick={() => rotate(false)}>
              Rotate left
            </SecondaryButton>
            <SecondaryButton onClick={() => rotate(true)}>
              Rotate right
            </SecondaryButton>
            <SecondaryButton onClick={push}>Push in</SecondaryButton>
          </>
        )}
      </div>
    </div>
  );
}
