import { treasureIDToPath } from "@/app/_components/Labyrinth/PathTileElem";
import { Treasure } from "labyrinth-game-logic";
import Image from "next/image";

interface Props {
  treasure: Treasure;
  large: boolean;
}
export default function TreasureCard({ treasure, large }: Props) {
  return (
    <div
      className="rounded-2xl bg-gray-400 hover:bg-gray-500 relative"
      style={{
        width: large ? "4rem" : "3rem",
        height: large ? "4rem" : "3rem",
      }}
    >
      <Image
        src={treasureIDToPath(treasure.id)}
        width={100}
        height={100}
        alt=""
        className="absolute inset-0 scale-75"
      ></Image>
    </div>
  );
}
