import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

const useCursorChangeAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdates: ScheduleUpdate) => {

    return useCallback((e: React.ChangeEvent<HTMLInputElement>, blocks: BlockType[], id: number) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);

        const currentBlock = blocks[index];
        currentBlock.text = e.target.value;

        blocks[index] = currentBlock;

        const newCursor = {
            blockId: id,
            position: e.target.selectionStart ?? 0,
        }
        
        
        scheduleUpdates("change", newCursor, currentBlock);
        
        setCursor(newCursor);
        setBlocks(blocks);
        
    }, [setBlocks, setCursor, scheduleUpdates]);
}

export { useCursorChangeAction }