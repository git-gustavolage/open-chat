// actions/endAction.ts
import React, { useCallback } from "react";
import type { BlockType } from "../types/types";

export const useEndAction = (
    blocks: BlockType[],
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string) => {
            const b = blocks.find((b) => b.id === id);
            if (b) {
                setCursor({ blockId: id, index: b.value.length });
            }
        },
        [blocks, setCursor]
    );
};