// Socket.IO configuration and event types

export const SOCKET_EVENTS = {
  NOTIFICATION: "notification",
} as const;

export const SOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:3001",
  transports: ["websocket"] as const,
  autoConnect: true,
} as const;

// Socket event payload types
export interface SocketEvents {
  [SOCKET_EVENTS.NOTIFICATION]: (notification: any) => void;
}
