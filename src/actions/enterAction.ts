import React, { useCallback } from "react";
import type { BlockType } from "../types/types";

export const useEnterAction = (
    setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>,
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string, cursorIndex: number, currentValue: string) => {
            setBlocks((prev) => {
                const idx = prev.findIndex((b) => b.id === id);
                if (idx === -1) return prev;
                const before = currentValue.slice(0, cursorIndex);
                const after = currentValue.slice(cursorIndex);

                const curr = prev[idx];
                const newBlockId = Math.random().toString(36).slice(2);
                const newBlock: BlockType = {
                    id: newBlockId,
                    value: after,
                    position: idx + 1,
                    createdAt: new Date(),
                };

                const updated = [...prev];
                updated[idx] = { ...curr, value: before };
                updated.splice(idx + 1, 0, newBlock);

                const newBlocks = updated.map((b, i) => ({ ...b, position: i }));
                setCursor({ blockId: newBlockId, index: 0 });
                return newBlocks;
            });
        },
        [setBlocks, setCursor]
    );
};