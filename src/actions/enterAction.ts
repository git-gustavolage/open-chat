import { useCallback, type SetStateAction } from "react";
import type { Actions, BlockType, CursorType } from "../types";

const useOnEnterAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>, scheduleUpdate: (action: Actions, target: BlockType, blocks: BlockType[]) => void) => {

    return useCallback((blocks: BlockType[], id: number, pos: number) => {
        blocks = [...blocks];
        const index = blocks.findIndex(block => block.id === id);
        const currentBlock = blocks[index];

        const prevText = currentBlock.text.slice(0, pos);
        const afterText = currentBlock.text.slice(pos);

        currentBlock.text = prevText;

        const newBlock: BlockType = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            text: afterText,
        }

        blocks[index] = currentBlock;
        blocks.splice(index + 1, 0, newBlock);

        scheduleUpdate("enter", currentBlock, [newBlock])

        setBlocks(blocks);

        setCursor({
            blockId: newBlock.id,
            position: 0
        });

    }, [setBlocks, setCursor, scheduleUpdate]);
}
export { useOnEnterAction }