import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

const useOnBackspaceAction = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    setOrder: React.Dispatch<SetStateAction<string[]>>,
    setCursor: React.Dispatch<SetStateAction<CursorType>>,
    scheduleUpdate: ScheduleUpdate
) => {
    return useCallback((blocks: Map<string, BlockType>, order: string[], id: string) => {
        const index = order.findIndex((blockId) => blockId === id);
        if (index === -1 || index === 0) return null;

        const currentBlock = blocks.get(id);
        const prevBlock = blocks.get(order[index - 1]);
        const isImage = prevBlock?.type == "image";
        if (!currentBlock || !prevBlock) return null;

        const newCursorPos = isImage ? 0 : prevBlock.text.length;

        const mergedBlock: BlockType = {
            ...prevBlock,
            text: (isImage ? "" : prevBlock.text) + currentBlock.text,
            type: "text",
        };

        const newBlocks = new Map(blocks);
        newBlocks.set(mergedBlock.id, mergedBlock);
        newBlocks.delete(currentBlock.id);

        const newOrder = [...order];
        newOrder.splice(index, 1);

        setBlocks(newBlocks);
        setOrder(newOrder);

        const newCursor: CursorType = {
            blockId: mergedBlock.id,
            position: newCursorPos,
        };

        scheduleUpdate("backspace", newCursor, currentBlock.id, {
            deleted: [currentBlock],
            updated: [mergedBlock],
        });

        setCursor(newCursor);

        return { newCursor, newBlocks, newOrder };
    }, [setBlocks, setOrder, setCursor, scheduleUpdate]);
};

export { useOnBackspaceAction };