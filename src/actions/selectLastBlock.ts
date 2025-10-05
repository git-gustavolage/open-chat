import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType } from "../types";
import { v4 as uuidv4 } from "uuid";

export const useOnSelectLastBlock = (
    setCursor: React.Dispatch<SetStateAction<CursorType>>,
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    setOrder: React.Dispatch<SetStateAction<string[]>>
) => {
    return useCallback((order: string[], blocksMap: Map<string, BlockType>) => {
        const currentOrder = order;
        const currentBlocks = blocksMap;

        if (currentOrder.length === 0) {
            const newId = uuidv4();
            const newBlock: BlockType = { id: newId, text: "", type: "text" };
            setBlocks((prev) => {
                const next = new Map(prev);
                next.set(newId, newBlock);
                return next;
            });
            setOrder([newId]);
            setCursor({ blockId: newId, position: 0 });
            return;
        }

        const lastIndex = currentOrder.length - 1;
        const lastId = currentOrder[lastIndex];
        const lastBlock = currentBlocks.get(lastId);
        if (!lastBlock) return;

        const length = lastBlock.text.length;
        setCursor({ blockId: lastId, position: length });
    }, [setCursor, setBlocks, setOrder]);
}
