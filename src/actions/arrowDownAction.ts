import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

export const useOnArrowDownAction = (setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {
    return useCallback((blocks: BlockType[], order: string[], id: string, pos: number) => {
        const index = order.findIndex(blockId => blockId === id);
        if (index < 0 || index >= order.length - 1) return;

        const nextId = order[index + 1];
        const nextBlock = blocks.find(block => block.id === nextId);
        if (!nextBlock) return;

        const newCursorPos = Math.min(pos, nextBlock.text.length);

        const newCursor = {
            blockId: nextBlock.id,
            position: newCursorPos,
        };

        scheduleUpdate("arrowDown", newCursor);
        setCursor(newCursor);
    }, [setCursor, scheduleUpdate]);
};