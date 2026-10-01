import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import type { ServerMessage } from "../../../shared/contracts";
import {
  setConnectionStatus,
  updateHighestBid,
} from "../store/auctionSlice.js";

export const useAuctionSocket = (url: string) => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const cleanUrl = import.meta.env.VITE_WS_URL || "localhost:4000";
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    const socket = new WebSocket(`${protocol}${cleanUrl}`);
    socketRef.current = socket;

    socket.onopen = () => {
      dispatch(setConnectionStatus(true));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ServerMessage;

        if (data.type === "NEW_BID") {
          dispatch(updateHighestBid(data.payload));
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message", error);
      }
    };

    socket.onclose = () => {
      dispatch(setConnectionStatus(false));
      socketRef.current = null;
    };

    return () => {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
      }

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [url, dispatch]);

  const sendBid = (amount: number, userId: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "PLACE_BID",
          payload: { amount, userId },
        }),
      );
    }
  };

  return { sendBid };
};
