// actions/backspaceAction.ts
import React, { useCallback } from "react";
import type { BlockType } from "../types/types";

export const useBackspaceAtStartAction = (
    setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>,
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string, cursorIndex: number, currentValue: string) => {
            setBlocks((prev) => {
                const idx = prev.findIndex((b) => b.id === id);
                if (idx <= 0) return prev;
                const prevBlock = prev[idx - 1];
                const mergedValue = prevBlock.value + currentValue;

                const updated = [...prev];
                updated[idx - 1] = { ...prevBlock, value: mergedValue };
                updated.splice(idx, 1);

                const newBlocks = updated.map((b, i) => ({ ...b, position: i }));
                setCursor({ blockId: prevBlock.id, index: prevBlock.value.length + cursorIndex });
                return newBlocks;
            });
        },
        [setBlocks, setCursor]
    );
};