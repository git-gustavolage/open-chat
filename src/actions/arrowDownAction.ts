import { useCallback, type SetStateAction } from "react";
import type { Cursor } from "../types";

export const useOnArrowDownAction = (setCursor: React.Dispatch<SetStateAction<Cursor>>) => {

    return useCallback((input: HTMLInputElement | null, index: number, pos: number) => {
        if (input) {
            const newPos = Math.min(pos, input.value.length);
            setCursor({
                blockId: index + 1,
                position: newPos,
            })
            input.focus();
            input.setSelectionRange(newPos, newPos);
        }
    }, [setCursor])
}
