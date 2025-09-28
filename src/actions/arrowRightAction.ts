import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

export const useOnArrowRightAction = (setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {
    return useCallback((blocks: BlockType[], id: string, pos: number, ctrl = false) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);

        const currentBlock = blocks[index];
        const newxtBlock = blocks[index + 1];

        let newIndex = index;
        let newCursorPos = pos;

        if (!ctrl) {

            newCursorPos = pos + 1;

            if (currentBlock && pos + 1 > currentBlock.text.length) {
                if (newxtBlock) {
                    newIndex = index + 1;
                    newCursorPos = 0;
                } else {
                    newCursorPos = currentBlock.text.length;
                }
            }
        } else {

            if (pos < currentBlock.text.length) {
                const rightPart = currentBlock.text.slice(pos);

                const match = rightPart.match(/\w[\wÀ-ú]*/);
                if (match) {
                    newCursorPos = pos + rightPart.indexOf(match[0]) + match[0].length;
                } else {
                    newCursorPos = currentBlock.text.length;
                }
            } else {

                if (newxtBlock) {
                    newIndex = index + 1;
                    newCursorPos = 0;
                } else {
                    newCursorPos = currentBlock.text.length;
                }
            }
        }

        const newCursor = {
            blockId: blocks[newIndex].id,
            position: Math.min(newCursorPos, blocks[newIndex]?.text.length ?? 0),
        }

        scheduleUpdate("arrowChange", newCursor);

        setCursor(newCursor);

        return newCursor;
    }, [setCursor, scheduleUpdate]);
};