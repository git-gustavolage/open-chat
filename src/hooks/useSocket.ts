import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(roomId: string, userId: string) {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    const connect = useCallback(() => {
        const url = import.meta.env.VITE_SOCKET_URL;
        const socket = io(url, { query: { roomId, userId } });

        socketRef.current = socket;
        socket.on("connect", () => setConnected(true));

        return socket;
    }, [roomId, userId]);

    useEffect(() => {
        const socket = connect();

        return () => {
            socket.disconnect();
            setConnected(false);
        };
    }, [connect]);

    const emit = useCallback((event: string, payload: any) => {
        if (!socketRef.current || !connected) return;
        socketRef.current.emit(event, payload);
    }, [connected]);

    const on = useCallback((event: string, handler: (...args: any[]) => void) => {
        if (!socketRef.current) return;
        socketRef.current.on(event, handler);

        return () => {
            socketRef.current?.off(event, handler);
        };
    }, []);

    return { connected, emit, on };
}
