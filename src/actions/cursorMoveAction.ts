// actions/cursorMoveAction.ts
import React, { useCallback } from "react";

export const useCursorMoveAction = (
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string, index: number) => {
            setCursor({ blockId: id, index });
        },
        [setCursor]
    );
};