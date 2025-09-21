import { useCallback, type SetStateAction } from "react";
import type { Block, Cursor } from "../types";

export const useOnArrowRightAction = (setCursor: React.Dispatch<SetStateAction<Cursor>>) => {
    return useCallback((blocks: Block[], index: number, pos: number, ctrl = false) => {
        const block = blocks[index].text;
        let newIndex = index;
        let newCursorPos = pos;

        if (!ctrl) {

            newCursorPos = pos + 1;

            if (block && pos + 1 > block.length) {
                if (index < blocks.length - 1) {
                    newIndex = index + 1;
                    newCursorPos = 0;
                } else {
                    newCursorPos = block.length;
                }
            }
        } else {

            if (pos < block.length) {
                const rightPart = block.slice(pos);

                const match = rightPart.match(/\w[\wÀ-ú]*/);
                if (match) {
                    newCursorPos = pos + rightPart.indexOf(match[0]) + match[0].length;
                } else {
                    newCursorPos = block.length;
                }
            } else {

                if (index < blocks.length - 1) {
                    newIndex = index + 1;
                    newCursorPos = 0;
                } else {
                    newCursorPos = block.length;
                }
            }
        }

        setCursor({
            blockId: newIndex,
            position: Math.min(newCursorPos, blocks[newIndex]?.text.length ?? 0),
        });

        return { newIndex, newCursorPos };
    }, [setCursor]);
};