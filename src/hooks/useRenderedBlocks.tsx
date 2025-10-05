import { useMemo, type RefObject } from "react";
import Block from "../components/Block";
import type { BlockType, RemoteCursorType } from "../types";
import ImageBlock from "../components/ImageBlock";

interface Params {
    blocks: Map<string, BlockType>;
    order: string[];
    inputsRef: RefObject<Map<string, HTMLInputElement | null>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
    handlePaste?: (e: React.ClipboardEvent<HTMLInputElement>, id: string) => void;
    cursorsByBlock: Map<string, RemoteCursorType[]>;
    onDeleteBock: (id: string) => void;
}

export function useRenderedBlocks({
    blocks,
    order,
    inputsRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    cursorsByBlock,
    onDeleteBock,
}: Params) {
    return useMemo(() => {
        return order.map((id) => {
            const block = blocks.get(id)!;
            const cursors = cursorsByBlock.get(id) || [];

            if (block.type === "image") {
                return <ImageBlock key={id} block={block} onDelete={onDeleteBock} />
            }

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
                    }}
                    onChange={(e) => handleChange(e, id)}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                    onPaste={(e) => handlePaste?.(e, id)}
                    remoteCursors={cursors}
                />
            );
        });
    }, [blocks, order, handleChange, handleKeyDown, handlePaste, cursorsByBlock, inputsRef, onDeleteBock]);
}
