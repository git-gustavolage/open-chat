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

const useChangeAction = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    setCursor: React.Dispatch<SetStateAction<CursorType>>,
    setOrder: React.Dispatch<SetStateAction<string[]>>,
    scheduleUpdates: ScheduleUpdate
) => {
    return useCallback((e: React.ChangeEvent<HTMLInputElement>, blocks: Map<string, BlockType>, order: string[], id: string) => {
        const index = order.findIndex((blockId) => blockId === id);

        const oldBlock = blocks.get(id);
        if (!oldBlock) return null;

        let updatedBlock: BlockType = { ...oldBlock, text: e.target.value };
        const { currentWidth, max_width, font } = computeBlockStyle(e.target);

        let newBlock: BlockType | null = null;
        let newCursorPos = e.target.selectionStart ?? 0;
        let newBlockId = updatedBlock.id;

        if (currentWidth > max_width) {
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

            if (overflow) {
                updatedBlock = { ...updatedBlock, text: line, images: [] };
                newBlock = { id: uuidv4(), text: overflow, images: updatedBlock.images };

                setBlocks((prev) => {
                    const next = new Map(prev);
                    next.set(updatedBlock.id, updatedBlock);
                    next.set(newBlock!.id, newBlock!);
                    return next;
                });

                setOrder((prevOrder) => {
                    const newOrder = [...prevOrder];
                    newOrder.splice(index + 1, 0, newBlock!.id);
                    return newOrder;
                });

                newBlockId = newBlock.id;
                newCursorPos = newBlock.text.length;
            } else {
                setBlocks((prev) => {
                    const next = new Map(prev);
                    next.set(updatedBlock.id, updatedBlock);
                    return next;
                });
            }
        } else {
            setBlocks((prev) => {
                const next = new Map(prev);
                next.set(updatedBlock.id, updatedBlock);
                return next;
            });
        }

        const newCursor: CursorType = {
            blockId: newBlockId,
            position: newCursorPos,
        };

        scheduleUpdates("block:change", newCursor, updatedBlock.id, {
            created: newBlock ? [newBlock] : null,
            updated: [updatedBlock],
        });

        setCursor(newCursor);

        return newCursor;
    }, [setBlocks, setOrder, setCursor, scheduleUpdates]);
};

export { useChangeAction };