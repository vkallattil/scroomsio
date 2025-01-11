import type { WSContext, WSMessageReceive } from "hono/ws";
import { v4 as uuidv4 } from "uuid";

const activeConnections = new Map<string, WSContext<unknown>>();

export const onMessageHandler = (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext<unknown>
) => {
  console.log(`Message from client: ${event.data}`);
  ws.send(`${event.data}`);
};

export const onOpenHandler = (event: Event, ws: WSContext<unknown>) => {
  console.log("Connection opened");
  const id = uuidv4();
  (ws as any).connectionId = id;
  activeConnections.set(id, ws);
};

export const onCloseHandler = (event: Event, ws: WSContext<unknown>) => {
  const connectionId = (ws as any).connectionId;
  if (connectionId) {
    activeConnections.delete(connectionId);
    console.log(
      `Connection ${connectionId} closed. Total: ${activeConnections.size}`
    );
  }
};
