// actions/homeAction.ts
import React, { useCallback } from "react";

export const useHomeAction = (
    setCursor: React.Dispatch<React.SetStateAction<{ blockId: string; index: number }>>
) => {
    return useCallback(
        (id: string) => {
            setCursor({ blockId: id, index: 0 });
        },
        [setCursor]
    );
};