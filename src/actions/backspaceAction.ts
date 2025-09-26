import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

const useOnBackspaceAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {

    return useCallback((blocks: BlockType[], id: string) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);

        const currentBlock = blocks[index];
        const prevBlock = blocks[index - 1];

        const newCursorPos = prevBlock.text.length;

        prevBlock.text += currentBlock.text;

        blocks[index - 1] = prevBlock;
        blocks.splice(index, 1);

        const newCursor = {
            blockId: prevBlock.id,
            position: newCursorPos
        }

        scheduleUpdate("backspace", newCursor, currentBlock.id, {
            deleted: [currentBlock],
            updated: [prevBlock],
        });

        setBlocks(blocks);
        setCursor(newCursor);

        return { newCursorPos }
    }, [setBlocks, setCursor, scheduleUpdate])
}

export { useOnBackspaceAction }