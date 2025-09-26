import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";
import { v4 as uuidv4 } from 'uuid';

const useOnEnterAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {

    return useCallback((blocks: BlockType[], id: string, pos: number) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);
        const currentBlock = blocks[index];

        const prevText = currentBlock.text.slice(0, pos);
        const afterText = currentBlock.text.slice(pos);

        currentBlock.text = prevText;

        const newBlock: BlockType = {
            id: uuidv4(),
            text: afterText,
        }

        blocks[index] = currentBlock;
        blocks.splice(index + 1, 0, newBlock);

        const newCursor = {
            blockId: newBlock.id,
            position: 0
        };

        scheduleUpdate("enter", newCursor, currentBlock.id, {
            updated: [currentBlock],
            created: [newBlock],
        })

        setBlocks(blocks);
        setCursor(newCursor);

    }, [setBlocks, setCursor, scheduleUpdate]);
}
export { useOnEnterAction }