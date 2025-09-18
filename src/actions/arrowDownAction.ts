// actions/arrowDownAction.ts
import React, { useCallback } from "react";
import type { BlockType } from "../types/types";

const findBlockIndex = (blocks: BlockType[], id: string): number =>
    blocks.findIndex((b) => b.id === id);

export const useArrowDownAction = (
    blocks: BlockType[],
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string, cursorIndex: number) => {
            const idx = findBlockIndex(blocks, id);
            if (idx < blocks.length - 1) {
                const nextBlock = blocks[idx + 1];
                setCursor({
                    blockId: nextBlock.id,
                    index: Math.min(nextBlock.value.length, cursorIndex),
                });
            }
        },
        [blocks, setCursor]
    );
};