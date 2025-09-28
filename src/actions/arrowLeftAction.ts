import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";

export const useOnArrowLeftAction = (setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: ScheduleUpdate) => {
    return useCallback((blocks: BlockType[], id: string, pos: number, ctrl = false) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);

        const currentBlock = blocks[index];
        const prevBlock = blocks[index - 1];

        let newIndex = index;
        let newCursorPos = pos;

        if (!ctrl) {
            newCursorPos = pos - 1;

            if (pos - 1 < 0) {
                if (prevBlock) {
                    newIndex = index - 1;
                    newCursorPos = prevBlock.text.length;
                } else {
                    newCursorPos = 0;
                }
            }
        } else {
            if (pos > 0) {
                const leftPart = currentBlock.text.slice(0, pos);

                const match = leftPart.match(/[\wÀ-ú]+(?=\W*$)/);
                if (match) {
                    newCursorPos = leftPart.lastIndexOf(match[0]);
                } else {
                    newCursorPos = 0;
                }
            } else {
                if (prevBlock) {
                    newIndex = index - 1;
                    newCursorPos = prevBlock.text.length;
                } else {
                    newCursorPos = 0;
                }
            }
        }

        const newCursor = {
            blockId: blocks[newIndex].id,
            position: Math.max(0, newCursorPos),
        }

        scheduleUpdate("arrowLeft", newCursor);

        setCursor(newCursor);

        return newCursor;
    }, [setCursor, scheduleUpdate]);
};
