import { useCallback, type SetStateAction } from "react";
import type { BlockType, ScheduleUpdate } from "../types";
import { resizeImage } from "../util/resizeImage";

export const usePasteAction = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    scheduleUpdates: ScheduleUpdate
) => {
    return useCallback((e: React.ClipboardEvent<HTMLInputElement>, blocks: Map<string, BlockType>, id: string) => {
        const currentBlock = blocks.get(id);
        if (!currentBlock) return;

        const items = e.clipboardData.items;
        if (!items) return;

        for (const item of items) {
            if (!item.type.startsWith("image/")) continue;

            const file = item.getAsFile();
            if (!file) continue;

            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;

                const resized = await resizeImage(base64, 300, 300, 0.2);

                const newImages = [...currentBlock.images, resized];
                const updatedBlock: BlockType = { ...currentBlock, images: newImages };

                setBlocks((prev) => {
                    const next = new Map(prev);
                    next.set(updatedBlock.id, updatedBlock);
                    return next;
                });

                scheduleUpdates("block:change", null, id, { updated: [updatedBlock] });
            };

            reader.readAsDataURL(file);
            e.preventDefault();
            break;
        }
    }, [setBlocks, scheduleUpdates]);
};
