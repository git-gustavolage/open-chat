import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

export const useOnArrowUpAction = (setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {

    return useCallback((blocks: BlockType[], id: number, pos: number) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);

        const prevBlock = blocks[index - 1];
        
        if (!prevBlock) {
            return { newCursorPos: pos };
        }

        const newCursorPos = Math.min(pos, prevBlock.text.length);

        const newCursor = {
            blockId: prevBlock.id,
            position: newCursorPos,
        }

        scheduleUpdate("arrowUp", newCursor);

        setCursor(newCursor);

        return { newCursorPos };
    }, [setCursor, scheduleUpdate])
}
