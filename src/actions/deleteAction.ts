// actions/deleteAction.ts
import React, { useCallback } from "react";
import type { BlockType } from "../types/types";

export const useDeleteAtEndAction = (
    setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>,
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string, cursorIndex: number, currentValue: string) => {
            setBlocks((prev) => {
                const idx = prev.findIndex((b) => b.id === id);
                if (idx >= prev.length - 1) return prev;
                const nextBlock = prev[idx + 1];
                const mergedValue = currentValue + nextBlock.value;

                const curr = prev[idx];
                const updated = [...prev];
                updated[idx] = { ...curr, value: mergedValue };
                updated.splice(idx + 1, 1);

                const newBlocks = updated.map((b, i) => ({ ...b, position: i }));
                setCursor({ blockId: id, index: cursorIndex });
                return newBlocks;
            });
        },
        [setBlocks, setCursor]
    );
};