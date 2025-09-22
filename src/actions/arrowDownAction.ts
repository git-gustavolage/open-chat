import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

export const useOnArrowDownAction = (setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {

    return useCallback((blocks: BlockType[], id: number, pos: number) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);

        const nextBlock = blocks[index + 1];

        if (!nextBlock) {
            return { newCursorPos: pos };
        }

        const newCursorPos = Math.min(pos, nextBlock.text.length);

        const newCursor = {
            blockId: nextBlock.id,
            position: newCursorPos,
        };

        scheduleUpdate("arrowDown", newCursor);

        setCursor(newCursor);

        return { newCursorPos };
    }, [setCursor, scheduleUpdate])
}
