import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

const useOnBackspaceAction = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    setCursor: React.Dispatch<SetStateAction<CursorType>>,
    setOrder: React.Dispatch<SetStateAction<string[]>>,
    scheduleUpdate: ScheduleUpdate
) => {
    return useCallback((blocks: Map<string, BlockType>, order: string[], id: string) => {
        const index = order.findIndex((blockId) => blockId === id);
        if (index === -1 || index === 0) return null;

        const currentBlock = blocks.get(id);
        const prevBlock = blocks.get(order[index - 1]);
        if (!currentBlock || !prevBlock) return null;

        const newCursorPos = prevBlock.text.length;

        const mergedBlock: BlockType = {
            ...prevBlock,
            text: prevBlock.text + currentBlock.text,
            images: [...(prevBlock.images ?? []), ...(currentBlock.images ?? [])],
        };

        const newBlocks = new Map(blocks);
        newBlocks.set(mergedBlock.id, mergedBlock);
        newBlocks.delete(currentBlock.id);

        const newOrder = [...order];
        newOrder.splice(index, 1);

        setBlocks(new Map(newBlocks));
        setOrder(newOrder);

        const newCursor: CursorType = {
            blockId: mergedBlock.id,
            position: newCursorPos,
        };

        scheduleUpdate("block:change", newCursor, currentBlock.id, {
            deleted: [currentBlock],
            updated: [mergedBlock],
        });

        setCursor(newCursor);

        return { newCursor, newBlocks, newOrder };
    }, [setBlocks, setOrder, setCursor, scheduleUpdate]);
};

export { useOnBackspaceAction };