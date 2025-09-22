import React, { useState, useRef, useCallback, useEffect } from "react";
import type { BlockType, CursorType } from "./types";
import { useCursorChangeAction } from "./actions/cursorChangeAction";
import { useOnEnterAction } from "./actions/enterAction";
import { useOnBackspaceAction } from "./actions/backspaceAction";
import { useOnDeleteAction } from "./actions/deleteAction";
import { useOnArrowUpAction } from "./actions/arrowUpAction";
import { useOnArrowDownAction } from "./actions/arrowDownAction";
import { useOnArrowLeftAction } from "./actions/arrowLeftAction";
import { useOnArrowRightAction } from "./actions/arrowRightAction";
import Block from "./Block";
import Debug from "./components/Debug";
import useSchedule from "./hooks/useSchedule";

export default function WhiteboardEditor() {
    const [blocks, setBlocks] = useState<BlockType[]>([]);
    const [cursor, setCursor] = useState<CursorType>({ blockId: 0, position: 0 });
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const userIdRef = useRef(crypto.randomUUID());

    const { schedule: scheduleUpdates, remoteCursors } = useSchedule("room1", userIdRef.current, setBlocks);

    const selectBlock = (index: number, position: number) => {
        setTimeout(() => {
            const prevInput = inputsRef.current[index];
            if (prevInput) {
                prevInput.focus();
                prevInput.setSelectionRange(position, position);
            }
        }, 0);
    }

    const handleChange = useCursorChangeAction(setBlocks, setCursor, scheduleUpdates);
    const handleEnter = useOnEnterAction(setBlocks, setCursor, scheduleUpdates);
    const handleBackspace = useOnBackspaceAction(setBlocks, setCursor, scheduleUpdates);
    const handleDelete = useOnDeleteAction(setBlocks, setCursor, scheduleUpdates);
    const handleArrowUp = useOnArrowUpAction(setCursor, scheduleUpdates);
    const handleArrowDown = useOnArrowDownAction(setCursor, scheduleUpdates);
    const handleArrowLeft = useOnArrowLeftAction(setCursor, scheduleUpdates);
    const handleArrowRight = useOnArrowRightAction(setCursor, scheduleUpdates);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number, id: number) => {
        const input = inputsRef.current[index];
        if (!input) return;

        const pos = input.selectionStart ?? 0;

        if (e.key === "Enter") {
            e.preventDefault();
            handleEnter(blocks, id, pos);
            selectBlock(index + 1, 0);
        }

        if (e.key === "Backspace" && pos === 0 && index > 0) {
            e.preventDefault();
            const { newCursorPos } = handleBackspace(blocks, id);
            selectBlock(index - 1, newCursorPos);
        }

        if (e.key === "Delete" && pos === input.value.length && index < blocks.length - 1) {
            e.preventDefault();
            const { newCursorPos } = handleDelete(blocks, id);
            selectBlock(index, newCursorPos);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            const { newCursorPos } = handleArrowUp(blocks, id, pos);
            selectBlock(index - 1, newCursorPos);
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            const { newCursorPos } = handleArrowDown(blocks, id, pos);
            selectBlock(index + 1, newCursorPos);
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            const { newIndex, newCursorPos } = handleArrowLeft(blocks, id, pos, e.ctrlKey);
            selectBlock(newIndex, newCursorPos);
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            const { newIndex, newCursorPos } = handleArrowRight(blocks, id, pos, e.ctrlKey);
            selectBlock(newIndex, newCursorPos);
        }
    }, [inputsRef, handleEnter, handleBackspace, handleDelete, handleArrowUp, handleArrowDown, handleArrowLeft, handleArrowRight, blocks]);

    const selectLastBlock = useCallback(() => {
        if (blocks.length === 0) {
            const newId = Date.now() + Math.floor(Math.random() * 1000);
            const newBlock = { id: newId, text: "" };
            setBlocks([newBlock]);
        }
        const lastIndex = blocks.length - 1;
        const lastBlock = inputsRef.current[lastIndex];
        if (!lastBlock) return;
        const length = lastBlock.value.length;
        lastBlock.focus();
        lastBlock.setSelectionRange(length, length);
        setCursor({ blockId: lastIndex, position: length });
    }, [blocks.length]);

    const handleEditorClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            selectLastBlock();
        }
    };

    useEffect(() => {
        selectLastBlock();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-between gap-8 pt-[100px]">
            <div
                className="w-[800px] max-lg:w-[600px] max-md:w-[95%] h-[calc(100%-140px)] bg-white py-8 px-12 rounded-md shadow-sm overflow-y-auto"
                onClick={handleEditorClick}
            >
                {blocks.map((block, i) => (
                    <Block
                        key={block.id}
                        inputRef={(el) => { inputsRef.current[i] = el }}
                        block={block}
                        onChange={(e) => handleChange(e, blocks, block.id)}
                        onKeyDown={(e, id) => handleKeyDown(e, i, id)}
                        remoteCursors={remoteCursors}
                    />
                ))}
            </div>

            {/**<Debug cursor={cursor} blocks={blocks} />**/}
        </div>
    );
}
