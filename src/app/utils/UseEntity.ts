import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { client } from "../clientAPI";

export function useEntity<T>(
  namespace: string,
  property: string,
  data?: any,
  onchange?: () => void
): [T[], Dispatch<SetStateAction<T[]>>] {
  const [entities, setEntities] = useState<T[]>([]);
  useEffect(() => {
    const sendRequestsSocket = io(
      `${process.env.NEXT_PUBLIC_BACKEND}/${namespace}`,
      {
        withCredentials: true,
        transports: ["websocket"],
        auth: { Bearer: client.getToken() },
        extraHeaders: {
          Bearer: client.getToken(),
        },
      }
    );
    sendRequestsSocket.auth = {
      Bearer: client.getToken(),
    };
    sendRequestsSocket.emit(property, data);
    sendRequestsSocket.on("init", (data) => {
      console.log(`init of ${namespace}/${property}: `, data);
      setEntities(data);
      onchange?.();
    });
    sendRequestsSocket.on("add", (data) => {
      console.log(`added ${namespace}/${property}: `, data);
      setEntities((prevEntities) => prevEntities.concat([data]));
      onchange?.();
    });
    sendRequestsSocket.on("remove", (removal) => {
      console.log(`removed ${namespace}/${property}: `, removal);
      setEntities((prevEntities) =>
        prevEntities.filter((entity) => (entity as any).id !== removal.id)
      );
      onchange?.();
    });
    sendRequestsSocket.on("update", (update) => {
      console.log(`updated ${namespace}/${property}: `, update);
      setEntities((prevEntities) => {
        const newEntities = [];
        for (const prevEntity of prevEntities) {
          if ((prevEntity as any).id === update.id) {
            newEntities.push(update);
          } else {
            newEntities.push(prevEntity);
          }
        }
        return newEntities;
      });
    });
    return () => {
      sendRequestsSocket.disconnect();
    };
  }, [namespace, property]);
  return [entities, setEntities];
}
