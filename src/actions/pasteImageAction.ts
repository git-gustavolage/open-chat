import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { BlockType, ScheduleUpdate } from "../types";

export const usePasteImageAction = (
    setBlocks: React.Dispatch<React.SetStateAction<Map<string, BlockType>>>,
    setOrder: React.Dispatch<React.SetStateAction<string[]>>,
    orderRef: React.RefObject<string[]>,
    scheduleUpdates?: ScheduleUpdate
) => {
    return useCallback((e: React.ClipboardEvent<HTMLInputElement>, id: string) => {
        const items = e.clipboardData.items;
        if (!items) return;

        for (const item of items) {
            if (!item.type.startsWith("image/")) continue;

            const file = item.getAsFile();
            if (!file) continue;

            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;

                let createdBlock: BlockType = {
                    id: uuidv4(),
                    text: base64,
                    type: "image",
                };

                let replaced = false;

                setBlocks((prev) => {
                    const next = new Map(prev);
                    const currentBlock = next.get(id);

                    if (currentBlock && currentBlock.text.length === 0) {
                        const updatedBlock: BlockType = {
                            ...currentBlock,
                            text: base64,
                            type: "image",
                        };
                        next.set(id, updatedBlock);
                        createdBlock = updatedBlock;
                        replaced = true;
                    } else {
                        next.set(createdBlock.id, createdBlock);
                    }

                    return next;
                });

                if (!replaced && createdBlock) {
                    const index = orderRef.current.findIndex((ord) => ord === id);
                    const newOrder = [
                        ...orderRef.current.slice(0, index + 1),
                        createdBlock.id,
                        ...orderRef.current.slice(index + 1),
                    ];
                    setOrder(newOrder);
                }

                if (scheduleUpdates && createdBlock) {
                    // scheduleUpdates(
                    //     replaced ? "update:image" : "create:image",
                    //     { blockId: createdBlock.id, position: 0 },
                    //     id,
                    //     replaced
                    //         ? { updated: [createdBlock] }
                    //         : { created: [createdBlock] }
                    // );
                }
            };

            reader.readAsDataURL(file);
            e.preventDefault();
            break;
        }
    }, [setBlocks, setOrder, orderRef, scheduleUpdates]);
};
