import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";
import { v4 as uuidv4 } from "uuid";

const useOnEnterAction = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    setCursor: React.Dispatch<SetStateAction<CursorType>>,
    setOrder: React.Dispatch<SetStateAction<string[]>>,
    scheduleUpdate: ScheduleUpdate
) => {
    return useCallback((blocks: Map<string, BlockType>, order: string[], id: string, pos: number) => {
        const index = order.findIndex((blockId) => blockId === id);
        if (index === -1) return;

        const currentBlock = blocks.get(id);
        if (!currentBlock) return;

        const beforeText = currentBlock.text.slice(0, pos);
        const afterText = currentBlock.text.slice(pos);

        const updatedBlock: BlockType = {
            ...currentBlock,
            text: beforeText,
        };

        const newBlock: BlockType = {
            id: uuidv4(),
            text: afterText,
            images: [],
        };

        const newBlocks = new Map(blocks);
        newBlocks.set(updatedBlock.id, updatedBlock);
        newBlocks.set(newBlock.id, newBlock);

        const newOrder = [...order];
        newOrder.splice(index + 1, 0, newBlock.id);

        setBlocks(newBlocks);
        setOrder(newOrder);

        const newCursor: CursorType = {
            blockId: newBlock.id,
            position: 0,
        };

        scheduleUpdate("block:change", newCursor, updatedBlock.id, {
            updated: [updatedBlock],
            created: [newBlock],
        });

        setCursor(newCursor);

        return { newCursor, newBlocks, newOrder };
    }, [setBlocks, setOrder, setCursor, scheduleUpdate]);
};

export { useOnEnterAction };