import { useState, useCallback, useEffect } from "react";
import type { BlockType, RemoteCursorType, ScheduleUpdate, UpdateRegister } from "../types";
import { useSocket } from "./useSocket";

type RoomUpdatedType = {
    updatedCursors: RemoteCursorType[] | null;
    dispatch?: UpdateRegister;
    create_after?: BlockType;
};

type RoomDataType = {
    blocks: BlockType[];
    cursors: RemoteCursorType[];
    userId: string;
};

export function useSchedule(
    roomId: string,
    userId: string,
    setBlocks: React.Dispatch<React.SetStateAction<Map<string, BlockType>>>,
    setOrder: React.Dispatch<React.SetStateAction<string[]>>
) {
    const { connected, emit, on } = useSocket(roomId, userId);
    const [remoteCursors, setRemoteCursors] = useState<RemoteCursorType[]>([]);

    const handleInit = useCallback(({ data }: { data: RoomDataType }) => {
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
    }, [setBlocks, setOrder]);

    const handleChange = useCallback(({ updatedCursors, dispatch, create_after }: RoomUpdatedType) => {
        setRemoteCursors((prev) => {
            const cursors = [...prev];
            updatedCursors?.forEach((cursor) => {
                const index = cursors.findIndex((c) => c.userId === cursor.userId);
                if (index >= 0) cursors[index] = cursor;
                else cursors.push(cursor);
            });
            return cursors;
        });

        if (!dispatch) return;
        const { updated, created, deleted } = dispatch;

        setBlocks(prev => {
            const next = new Map(prev);

            updated?.forEach(item => next.set(item.id, item));
            created?.forEach(item => next.set(item.id, item));
            deleted?.forEach(item => next.delete(item.id));

            return next;
        });

        setOrder((prev) => {
            let next = [...prev];
            created?.forEach((item) => {
                if (!next.includes(item.id)) {
                    const idx = next.indexOf(create_after!.id);
                    if (idx >= 0) next.splice(idx + 1, 0, item.id);
                    else next.push(item.id);
                }
            });
            deleted?.forEach((item) => {
                next = next.filter((id) => id !== item.id);
            });
            return next;
        });
    }, [setBlocks, setOrder]);

    const handleCursorRemove = useCallback((uid: string) => setRemoteCursors((prev) => prev.filter((c) => c.userId !== uid)), []);

    useEffect(() => {
        const offInit = on("init", handleInit);
        const offChange = on("change", handleChange);
        const offCursorRemove = on("cursor:remove", handleCursorRemove);

        if (connected) emit("load", {});

        return () => {
            offInit?.();
            offChange?.();
            offCursorRemove?.();
        };
    }, [on, emit, connected, handleInit, handleChange, handleCursorRemove]);

    const schedule: ScheduleUpdate = (action, cursor, target_id, register) => {
        if (!connected) return;
        const newCursor = { ...cursor, userId };
        emit(action, { cursor: newCursor, target_id, register });
    };

    return { connected, schedule, remoteCursors };
}
