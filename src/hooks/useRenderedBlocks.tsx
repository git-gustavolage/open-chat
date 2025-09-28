import { useMemo, type RefObject } from "react";
import Block from "../Block";
import type { RemoteCursorType } from "../types";

interface BlockType {
    id: string;
    text: string;
}

interface Params {
    blocks: Map<string, BlockType>;
    order: string[];
    inputsRef: RefObject<Map<string, HTMLInputElement | null>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
    cursorsByBlock: Map<string, RemoteCursorType[]>;
}

export function useRenderedBlocks({
    blocks,
    order,
    inputsRef,
    handleChange,
    handleKeyDown,
    cursorsByBlock,
}: Params) {
    return useMemo(() => {
        return order.map((id) => {
            const block = blocks.get(id)!;
            const cursors = cursorsByBlock.get(id) || [];

            return (
                <Block
                    key={id}
                    id={block.id}
                    value={block.text}
                    inputRef={(el) => {
                        if (el) {
                            inputsRef.current?.set(id, el);
                        } else {
                            inputsRef.current?.delete(id);
                        }
                    }
                    }
                    onChange={(e) => handleChange(e, id)}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                    remoteCursors={cursors}
                />
            );
        });
    }, [blocks, order, handleChange, handleKeyDown, cursorsByBlock, inputsRef]);
}
