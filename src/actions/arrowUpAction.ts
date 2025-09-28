import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

export const useOnArrowUpAction = (setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {
    return useCallback((blocks: BlockType[], order: string[], id: string, pos: number) => {
        const index = order.findIndex(blockId => blockId === id);
        if (index <= 0) return;

        const prevId = order[index - 1];
        const prevBlock = blocks.find(block => block.id === prevId);
        if (!prevBlock) return;

        const newCursorPos = Math.min(pos, prevBlock.text.length);

        const newCursor = {
            blockId: prevBlock.id,
            position: newCursorPos,
        };

        scheduleUpdate("arrowChange", newCursor);
        setCursor(newCursor);
    }, [setCursor, scheduleUpdate]);
};