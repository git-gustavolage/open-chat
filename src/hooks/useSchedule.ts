import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { BlockType, RemoteCursorType, ScheduleUpdate, UpdateRegister } from "../types";

type RoomUpdatedType = {
    updatedCursors: RemoteCursorType[] | null;
    dispatch: UpdateRegister;
    create_after?: BlockType;
};

type RoomDataType = {
    blocks: BlockType[];
    cursors: RemoteCursorType[];
    userId: string;
};

export default function useSchedule(
    roomId: string,
    userId: string,
    setBlocks: React.Dispatch<React.SetStateAction<Map<string, BlockType>>>,
    setOrder: React.Dispatch<React.SetStateAction<string[]>>
) {
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
    };

    const handleInit = useCallback(
        ({ data }: { data: RoomDataType }) => {
            const { blocks, cursors } = data;

            if (blocks) {
                setBlocks(() => {
                    const map = new Map<string, BlockType>();
                    blocks.forEach((b) => map.set(b.id, b));
                    return map;
                });
                setOrder(blocks.map((b) => b.id));
            }

            if (cursors) {
                setRemoteCursors(cursors);
            }
        },
        [setBlocks, setOrder]
    );

    const handleChange = useCallback(
        ({ updatedCursors, dispatch, create_after }: RoomUpdatedType) => {
            const { updated, created, deleted } = dispatch;

            setBlocks(prev => {
                const next = new Map(prev);

                updated?.forEach(item => {
                    next.set(item.id, item);
                });

                created?.forEach(item => {
                    if (!next.has(item.id)) {
                        next.set(item.id, item);
                    }
                });

                deleted?.forEach(item => {
                    next.delete(item.id);
                });

                return next;
            });

            setOrder(prev => {
                let next = [...prev];

                created?.forEach(item => {
                    if (!next.includes(item.id)) {
                        const idx = next.indexOf(create_after!.id);
                        if (idx >= 0) {
                            next.splice(idx + 1, 0, item.id);
                        } else {
                            next.push(item.id);
                        }
                    }
                });

                deleted?.forEach(item => {
                    next = next.filter(id => id !== item.id);
                });

                return next;
            });


            setRemoteCursors((prev) => {
                const cursors = [...prev];
                if (updatedCursors) {
                    updatedCursors.forEach((cursor) => {
                        const index = cursors.findIndex((c) => c.userId === cursor.userId);
                        if (index >= 0) {
                            cursors[index] = cursor;
                        } else {
                            cursors.push(cursor);
                        }
                    });
                }
                return cursors;
            });
        },
        [setBlocks, setOrder]
    );

    const handleCursorRemove = (userId: string) => {
        setRemoteCursors((prev) => prev.filter((c) => c.userId === userId));
    };

    useEffect(() => {
        const url = import.meta.env.VITE_SOCKET_URL;
        const socket = io(url, { query: { roomId, userId } });

        socketRef.current = socket;

        socket.on("connect", handleConnect);
        socket.on("init", handleInit);
        socket.on("change", handleChange);
        socket.on("cursor:remove", handleCursorRemove);

        return () => {
            socket.disconnect();
        };
    }, []);

    const schedule: ScheduleUpdate = (action, cursor, target_id, register) => {
        if (!socketRef.current) return;
        if (!connected) return;

        const newCursor = { ...cursor, userId };

        socketRef.current.emit(action, {
            cursor: newCursor,
            target_id,
            register,
        });
    };

    return {
        connected,
        schedule,
        remoteCursors,
    };
}
