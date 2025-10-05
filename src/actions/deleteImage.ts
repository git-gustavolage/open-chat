import { useCallback, type SetStateAction } from "react";
import type { BlockType, ScheduleUpdate } from "../types";

export const useDeleteImage = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    scheduleUpdates: ScheduleUpdate
) => {
    return useCallback((blocks: Map<string, BlockType>, id: string, index: number) => {
        const currentBlock = blocks.get(id);
        if (!currentBlock) return;

        const newImages = currentBlock.images.filter((_, i) => i !== index  )
        const updatedBlock: BlockType = { ...currentBlock, images: newImages };

        setBlocks((prev) => {
            const next = new Map(prev);
            next.set(updatedBlock.id, updatedBlock);
            return next;
        });

        scheduleUpdates("block:change", null, id, { updated: [updatedBlock] });
    }, [setBlocks, scheduleUpdates]);
};
