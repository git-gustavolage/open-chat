import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";
import { v4 as uuidv4 } from 'uuid';

const useOnEnterAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {

    return useCallback((blocks: BlockType[], id: string, pos: number) => {
        const index = blocks.findIndex(block => block.id === id);
        if (index === -1) return;

        const currentBlock: BlockType = { ...blocks[index], text: blocks[index].text.slice(0, pos) };
        const newBlock: BlockType = { id: uuidv4(), text: blocks[index].text.slice(pos) };

        const newBlocks = [
            ...blocks.slice(0, index),
            currentBlock,
            newBlock,
            ...blocks.slice(index + 1),
        ];
        
        const newCursor = {
            blockId: newBlock.id,
            position: 0
        };

        scheduleUpdate("enter", newCursor, currentBlock.id, {
            updated: [currentBlock],
            created: [newBlock],
        });

        setBlocks(newBlocks);
        setCursor(newCursor);
    }, [setBlocks, setCursor, scheduleUpdate]);
}
export { useOnEnterAction }