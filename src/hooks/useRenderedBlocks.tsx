import { useMemo, useCallback, type RefObject } from "react";
import Block from "../components/Block";
import type { BlockType, RemoteCursorType } from "../types";

interface Params {
    blocks: Map<string, BlockType>;
    order: string[];
    inputsRef: RefObject<Map<string, HTMLInputElement | null>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
    handlePaste: (e: React.ClipboardEvent<HTMLInputElement>, blocks: Map<string, BlockType>, id: string) => void;
    handleDeleteImage: (blocks: Map<string, BlockType>, id: string, index: number) => void;
    cursorsByBlock: Map<string, RemoteCursorType[]>;
}

export function useRenderedBlocks({
    blocks,
    order,
    inputsRef,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleDeleteImage,
    cursorsByBlock,
}: Params) {

    const createHandlers = useCallback((id: string) => {
        return {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, id),
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, id),
            onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => handlePaste(e, blocks, id),
            onDeleteImage: (index: number) => handleDeleteImage(blocks, id, index),
        };
    }, [handleChange, handleKeyDown, handlePaste, handleDeleteImage, blocks]);

    const createInputRef = useCallback((id: string) => {
        return (el: HTMLInputElement | null) => {
            if (el) inputsRef.current?.set(id, el);
            else inputsRef.current?.delete(id);
        };
    }, [inputsRef]);

    const renderedBlocks = order.map((id) => {
        const block = blocks.get(id);
        if (!block) return null;

        const cursors = cursorsByBlock.get(id) || [];
        const handlers = createHandlers(id);
        const refHandler = createInputRef(id);

        return (
            <Block
                key={id}
                id={block.id}
                value={block.text}
                images={block.images}
                inputRef={refHandler}
                onChange={handlers.onChange}
                onKeyDown={handlers.onKeyDown}
                onPaste={handlers.onPaste}
                onDeleteImage={(index) => handlers.onDeleteImage(index)}
                remoteCursors={cursors}
            />
        );
    });

    return renderedBlocks;
}
