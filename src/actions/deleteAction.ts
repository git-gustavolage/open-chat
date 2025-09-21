import { useCallback, type SetStateAction } from "react";
import type { Block, Cursor } from "../types";

const useOnDeleteAction = (setBlocks: React.Dispatch<SetStateAction<Block[]>>, setCursor: React.Dispatch<SetStateAction<Cursor>>) => {

    return useCallback((blocks: Block[], index: number, pos: number) => {
        const newBlocks = [...blocks];
        const currentText = newBlocks[index].text;

        const newIndex = index;
        const newCursorPos = pos;

        const nextText = newBlocks[index + 1].text;

        newBlocks[index].text = currentText + nextText;
        newBlocks.splice(index + 1, 1);

        setBlocks(newBlocks);
        setCursor({
            blockId: newIndex,
            position: newCursorPos,
        })

        return { newIndex, newCursorPos }
    }, [setBlocks, setCursor])
}

export { useOnDeleteAction }