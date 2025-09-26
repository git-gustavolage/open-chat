import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

const useOnDeleteAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {

    return useCallback((blocks: BlockType[], id: string) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);

        const currentBlock = blocks[index];
        const nextBlock = blocks[index + 1];

        const newCursorPos = currentBlock.text.length;

        currentBlock.text += nextBlock.text;
        blocks.splice(index + 1, 1);

        const newCursor = {
            blockId: id,
            position: newCursorPos
        }

        scheduleUpdate("delete", newCursor, currentBlock.id, {
            updated: [currentBlock],
            deleted: [nextBlock],
        });

        setBlocks(blocks);
        setCursor(newCursor);

        return { newCursorPos };

    }, [setBlocks, setCursor, scheduleUpdate])
}

export { useOnDeleteAction }