import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType, ScheduleUpdate } from "../types";
import { v4 as uuidv4 } from "uuid";

const mesureTextWidth = (font: string, text: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
        context.font = font;
        return context.measureText(text).width;
    }
    return 0;
};

const computeBlockStyle = (element: HTMLInputElement) => {
    const styles = window.getComputedStyle(element);
    const font = `${styles.fontSize} ${styles.fontFamily}`;
    const text = element.value;
    const max_width = parseFloat(styles.width.replace("px", ""));
    const currentWidth = mesureTextWidth(font, text);

    return { currentWidth, max_width, font };
};
const useCursorChangeAction = (
    setBlocks: React.Dispatch<SetStateAction<BlockType[]>>,
    setCursor: React.Dispatch<SetStateAction<CursorType>>,
    scheduleUpdates: ScheduleUpdate
) => {
    return useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, blocks: BlockType[], id: string) => {
            const index = blocks.findIndex((block) => block.id === id);
            if (index === -1) return;

            const oldBlock = blocks[index];
            const updatedBlock: BlockType = { ...oldBlock, text: e.target.value };

            const { currentWidth, max_width, font } = computeBlockStyle(e.target);

            let newBlocks = [...blocks];
            let newBlock: BlockType | null = null;

            let newCursorPos = e.target.selectionStart ?? 0;
            let newBlockId = updatedBlock.id;
            let newIndex = index;

            if (currentWidth >= max_width) {
                // Quebra de linha automática
                const words = e.target.value.split(" ");
                let line = "";
                let overflow = "";

                if (words.length > 1) {
                    for (let i = 0; i < words.length; i++) {
                        const testLine = line ? line + " " + words[i] : words[i];
                        const testWidth = mesureTextWidth(font, testLine);

                        if (testWidth > max_width) {
                            overflow = words.slice(i).join(" ");
                            break;
                        } else {
                            line = testLine;
                        }
                    }
                } else {
                    // Caso seja uma palavra única
                    const word = words[0];
                    let cutIndex = word.length;
                    let fitted = "";

                    for (let i = 0; i < word.length; i++) {
                        const testLine = word.slice(0, i + 1);
                        const testWidth = mesureTextWidth(font, testLine);

                        if (testWidth > max_width) {
                            cutIndex = i;
                            break;
                        }
                        fitted = testLine;
                    }

                    line = fitted;
                    overflow = word.slice(cutIndex);
                }

                const fittedBlock: BlockType = { ...updatedBlock, text: line };
                newBlock = { id: uuidv4(), text: overflow };

                newBlocks = [
                    ...blocks.slice(0, index),
                    fittedBlock,
                    newBlock,
                    ...blocks.slice(index + 1),
                ];

                newBlockId = newBlock.id;
                newCursorPos = newBlock.text.length;
                newIndex = index + 1;
            } else {
                newBlocks = [
                    ...blocks.slice(0, index),
                    updatedBlock,
                    ...blocks.slice(index + 1),
                ];
            }

            setBlocks(newBlocks);

            const newCursor: CursorType = {
                blockId: newBlockId,
                position: newCursorPos,
            };

            scheduleUpdates("change", newCursor, updatedBlock.id, {
                created: newBlock ? [newBlock] : null,
                updated: [updatedBlock],
            });

            setCursor(newCursor);

            return { newCursorPos, newIndex };
        },
        [setBlocks, setCursor, scheduleUpdates]
    );
};


export { useCursorChangeAction };
