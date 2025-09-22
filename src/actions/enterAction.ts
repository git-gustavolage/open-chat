import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

const useOnEnterAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {

    return useCallback((blocks: BlockType[], id: number, pos: number) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);
        const currentBlock = blocks[index];

        const prevText = currentBlock.text.slice(0, pos);
        const afterText = currentBlock.text.slice(pos);

        currentBlock.text = prevText;

        const newBlock: BlockType = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            text: afterText,
        }

        blocks[index] = currentBlock;
        blocks.splice(index + 1, 0, newBlock);

        const newCursor = {
            blockId: newBlock.id,
            position: 0
        };

        scheduleUpdate("enter", newCursor, currentBlock, [newBlock])

        setBlocks(blocks);
        setCursor(newCursor);

    }, [setBlocks, setCursor, scheduleUpdate]);
}
export { useOnEnterAction }