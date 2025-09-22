import { useEffect, useState, useRef, type SetStateAction, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { BlockType, RemoteCursorType, ScheduleUpdate } from "../types";

type RoomUpdatedType = {
    updatedBlocks: BlockType[] | null,
    updatedCursors: RemoteCursorType[] | null,
    userId: string,
}

type RoomDataType = {
    blocks: BlockType[],
    cursors: RemoteCursorType[],
    userId: string,
}

export default function useSchedule(roomId: string, userId: string, setBlocks: React.Dispatch<SetStateAction<BlockType[]>>) {
    const [remoteCursors, setRemoteCursors] = useState<RemoteCursorType[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    const loadData = useCallback(() => {
        if (!socketRef.current) return;

        socketRef.current.emit("load");
    }, []);

    const handleConnect = () => {
        setConnected(true);
        loadData();
    }

    const handleInit = useCallback(({ data }: { data: RoomDataType }) => {
        const { blocks, cursors } = data;

        if (blocks) {
            setBlocks(blocks);
        }

        if (cursors) {
            setRemoteCursors(cursors);
        }
    }, [setBlocks]);

    const handleChange = useCallback(({ updatedBlocks, updatedCursors }: RoomUpdatedType) => {
        if (updatedBlocks) {
            setBlocks(updatedBlocks);
        }

        setRemoteCursors((prev) => {
            const cursors = [...prev];

            if (updatedCursors) {
                updatedCursors.forEach(cursor => {
                    const index = cursors.findIndex(c => c.userId === cursor.userId);
                    if (index >= 0) {
                        cursors[index] = cursor;
                    } else {
                        cursors.push(cursor);
                    }
                })
            }

            return cursors;
        })
    }, [setBlocks]);

    const handleCursorRemove = (userId: string) => {
        setRemoteCursors(prev => {
            const cursors = [...prev];
            const index = cursors.findIndex(c => c.userId === userId);
            if (index >= 0) {
                cursors.splice(index, 1);
            }

            return cursors;
        });
    }

    useEffect(() => {
        const socket = io("http://localhost:3001", { query: { roomId, userId } });

        socketRef.current = socket;

        socket.on("connect", handleConnect);

        socket.on("init", handleInit);

        socket.on("change", handleChange);

        socket.on("cursor:remove", handleCursorRemove);

        return () => {
            socket.disconnect();
        };
    }, []);


    const schedule: ScheduleUpdate = (action, cursor, target, blocks) => {
        if (!socketRef.current) return;
        if (!connected) return;

        const newCursor = { ...cursor, userId: userId };

        switch (action) {
            case "change":
                if (!target) return;
                socketRef.current.emit("change", { target, cursor: newCursor });
                break;

            case "enter":
                socketRef.current.emit("enter", { cursor: newCursor, target, blocks });
                break;

            case "backspace":
                socketRef.current.emit("backspace", { cursor: newCursor, target, blocks });
                break;
            
            case "delete":
                socketRef.current.emit("delete", { cursor: newCursor, target, blocks })
                break;
        }
    };

    return {
        connected,
        schedule,
        remoteCursors
    };
}
