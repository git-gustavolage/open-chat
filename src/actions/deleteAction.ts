import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

const useOnDeleteAction = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    setOrder: React.Dispatch<SetStateAction<string[]>>,
    setCursor: React.Dispatch<SetStateAction<CursorType>>,
    scheduleUpdate: ScheduleUpdate
) => {
    return useCallback((blocks: Map<string, BlockType>, order: string[], id: string) => {
        const index = order.findIndex((blockId) => blockId === id);
        if (index === -1 || index >= order.length - 1) return null;

        const currentBlock = blocks.get(id);
        const nextBlock = blocks.get(order[index + 1]);
        if (!currentBlock || !nextBlock) return null;

        const newCursorPos = currentBlock.text.length;

        const mergedBlock: BlockType = {
            ...currentBlock,
            text: currentBlock.text + nextBlock.text,
        };

        const newBlocks = new Map(blocks);
        newBlocks.set(mergedBlock.id, mergedBlock);
        newBlocks.delete(nextBlock.id);

        const newOrder = [...order];
        newOrder.splice(index + 1, 1);

        setBlocks(newBlocks);
        setOrder(newOrder);

        const newCursor: CursorType = {
            blockId: mergedBlock.id,
            position: newCursorPos,
        };

        scheduleUpdate("delete", newCursor, mergedBlock.id, {
            updated: [mergedBlock],
            deleted: [nextBlock],
        });

        setCursor(newCursor);

        return { newCursor, newBlocks, newOrder };
    }, [setBlocks, setOrder, setCursor, scheduleUpdate]);
};

export { useOnDeleteAction };