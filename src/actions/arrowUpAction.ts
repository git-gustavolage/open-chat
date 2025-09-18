// actions/arrowUpAction.ts
import React, { useCallback } from "react";
import type { BlockType } from "../types/types";

const findBlockIndex = (blocks: BlockType[], id: string): number =>
    blocks.findIndex((b) => b.id === id);

export const useArrowUpAction = (
    blocks: BlockType[],
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string, cursorIndex: number) => {
            const idx = findBlockIndex(blocks, id);
            if (idx > 0) {
                const prevBlock = blocks[idx - 1];
                setCursor({
                    blockId: prevBlock.id,
                    index: Math.min(prevBlock.value.length, cursorIndex),
                });
            }
        },
        [blocks, setCursor]
    );
};