import { useCallback, type SetStateAction } from "react";
import type { Block, Cursor } from "../types";

export const useOnArrowLeftAction = (setCursor: React.Dispatch<SetStateAction<Cursor>>) => {
    return useCallback((blocks: Block[], index: number, pos: number, ctrl = false) => {
        const block = blocks[index].text;
        let newIndex = index;
        let newCursorPos = pos;

        if (!ctrl) {

            newCursorPos = pos - 1;

            if (pos - 1 < 0) {
                if (index > 0) {
                    newIndex = index - 1;
                    newCursorPos = blocks[newIndex].text.length;
                } else {
                    newCursorPos = 0;
                }
            }
        } else {

            if (pos > 0) {
                const leftPart = block.slice(0, pos);

                const match = leftPart.match(/[\wÀ-ú]+(?=\W*$)/);
                if (match) {
                    newCursorPos = leftPart.lastIndexOf(match[0]);
                } else {
                    newCursorPos = 0;
                }
            } else {

                if (index > 0) {
                    newIndex = index - 1;
                    newCursorPos = blocks[newIndex].text.length;
                } else {
                    newCursorPos = 0;
                }
            }
        }

        setCursor({
            blockId: newIndex,
            position: Math.max(0, newCursorPos),
        });

        return { newIndex, newCursorPos };
    }, [setCursor]);
};
