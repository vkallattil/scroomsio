import type { WSContext, WSMessageReceive } from "hono/ws";
import { v4 as uuidv4 } from "uuid";

const activeConnections = new Map<string, WSContext<unknown>>();
const connectionIds = new Map<WSContext<unknown>, string>();

export const onMessageHandler = (
  event: MessageEvent<WSMessageReceive>,
  ws: WSContext<unknown>
) => {  
  const connectionId = connectionIds.get(ws);
  console.log(`Message from client ${connectionId}: ${event.data}`);
  for (const [id, ws] of activeConnections) {
    console.log(`Sending message to client ${id}`);
    ws.send(`${event.data}`);
  }
};

export const onOpenHandler = (event: Event, ws: WSContext<unknown>) => {
  console.log("Connection opened");
  const id = uuidv4();
  connectionIds.set(ws, id);
  activeConnections.set(id, ws);
  console.log([...activeConnections.keys()]);
};

export const onCloseHandler = (event: Event, ws: WSContext<unknown>) => {
  const connectionId = connectionIds.get(ws);
  if (connectionId) {
    activeConnections.delete(connectionId);
    connectionIds.delete(ws);
    console.log(
      `Connection ${connectionId} closed. Total: ${activeConnections.size}`
    );
  }
  console.log([...activeConnections.keys()]);
};
