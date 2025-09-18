import React, { useEffect, useRef } from "react";
import type { BlockType } from "../types/types";

type BlockProps = {
    block: BlockType;
    isActive: boolean;
    cursorIndex: number;
    onChange: (id: string, newValue: string) => void;
    onCursorMove: (id: string, newIndex: number) => void;
    onEnter: (id: string, cursorIndex: number, currentValue: string) => void;
    onArrowUp: (id: string, cursorIndex: number) => void;
    onArrowDown: (id: string, cursorIndex: number) => void;
    onHome: (id: string) => void;
    onEnd: (id: string) => void;
    onBackspaceAtStart: (id: string, cursorIndex: number, currentValue: string) => void;
    onDeleteAtEnd: (id: string, cursorIndex: number, currentValue: string) => void;
    inputRef?: (el: HTMLInputElement | null) => void;
};

export const Block: React.FC<BlockProps> = ({
    block,
    isActive,
    cursorIndex,
    onChange,
    onCursorMove,
    onEnter,
    onArrowUp,
    onArrowDown,
    onHome,
    onEnd,
    onBackspaceAtStart,
    onDeleteAtEnd,
    inputRef,
}) => {
    const localRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef) inputRef(localRef.current);
    }, [inputRef, block.id]);

    useEffect(() => {
        if (isActive && localRef.current) {
            const el = localRef.current;
            const idx = Math.max(0, Math.min(cursorIndex, el.value.length));
            el.focus();
            el.setSelectionRange(idx, idx);
        }
    }, [isActive, cursorIndex, block.value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isActive) return;

        const el = localRef.current;
        const pos = el?.selectionStart ?? 0;
        const currentValueLength = el?.value.length ?? block.value.length;

        if (e.key === "Enter") {
            e.preventDefault();
            const currentValue = el?.value ?? block.value;
            onEnter(block.id, pos, currentValue);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            onArrowUp(block.id, pos);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onArrowDown(block.id, pos);
        } else if (e.key === "Home") {
            e.preventDefault();
            onHome(block.id);
        } else if (e.key === "End") {
            e.preventDefault();
            onEnd(block.id);
        } else if (e.key === "Backspace") {
            if (pos === 0) {
                e.preventDefault();
                const currentValue = el?.value ?? block.value;
                onBackspaceAtStart(block.id, pos, currentValue);
            }
        } else if (e.key === "Delete") {
            if (pos === currentValueLength) {
                e.preventDefault();
                const currentValue = el?.value ?? block.value;
                onDeleteAtEnd(block.id, pos, currentValue);
            }
        }
    };

    return (
        <div>
            <input
                ref={localRef}
                value={block.value}
                onChange={(e) => {
                    onChange(block.id, e.target.value);
                    onCursorMove(block.id, e.target.selectionStart ?? 0);
                }}
                onSelect={(e) => {
                    onCursorMove(block.id, (e.target as HTMLInputElement).selectionStart ?? 0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full p-0 border-0 bg-transparent focus:outline-none text-inherit leading-normal"
                spellCheck={false}
            />
        </div>
    );
};