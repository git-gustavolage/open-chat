import { useCallback, type SetStateAction } from "react";
import type { BlockType, CursorType } from "../types";

const useCursorChangeAction = (setBlocks: React.Dispatch<SetStateAction<BlockType[]>>, setCursor: React.Dispatch<SetStateAction<CursorType>>) => {

    return useCallback((e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        setBlocks((prev) => {
            const updated = [...prev];
            const index = updated.findIndex(block => block.id === id);
            if (index >= 0) {
                updated[index].text = e.target.value;
            }
            
            return updated;
        });

        setCursor({
            blockId: id,
            position: e.target.selectionStart ?? 0,
        });

        
    }, [setBlocks, setCursor]);
}

export { useCursorChangeAction }