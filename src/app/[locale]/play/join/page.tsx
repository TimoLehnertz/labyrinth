"use server";
import React from "react";
import Labyrinth from "@/app/_components/Labyrinth/Labyrinth";
import { server } from "@/app/serverAPI";
import { redirect } from "next/navigation";
import Link from "next/link";
import PrimaryButton from "@/app/_components/buttons/PrimaryButton";

export default async function page() {
  if (!(await server.isLoggedIn())) {
    redirect("/");
  }
  const res = await server.api.GET("/game/availableToJoin");
  if (res.error) {
    redirect("/");
  }
  return (
    <div>
      <h1 className="text-3xl text-center mt-4">Games to join</h1>
      <div className="flex justify-center mt-10">
        <div className="flex flex-row space-x-5">
          {res.data.length === 0 && (
            <p>There are currently no games available to join :/</p>
          )}
          {res.data.map((e, i) => (
            <PrimaryButton key={"btn" + i}>
              <Link key={i} href={`/play/${e.id}/lobby`}>
                <b>{e.ownerUser.username}</b>&apos;s game
              </Link>
            </PrimaryButton>
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center mt-5">
        <Labyrinth boardHeight={7} boardWidth={7} seed="ds"></Labyrinth>
      </div>
    </div>
  );
}
