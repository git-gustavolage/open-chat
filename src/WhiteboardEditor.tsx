import React, { useState, useRef, useCallback, useEffect } from "react";
import type { Actions, BlockType, CursorType, RemoteCursorType } from "./types";
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



export default function WhiteboardEditor() {
    const [blocks, setBlocks] = useState<BlockType[]>([]);
    const [cursor, setCursor] = useState<CursorType>({ blockId: 0, position: 0 });
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const [remoteCursors, setRemoteCursors] = useState<RemoteCursorType[]>([]);

    const scheduleUpdates = useCallback((action: Actions, target: BlockType,  blocks: BlockType[]) => {
        console.log(action, target, blocks);
    }, []);

    const handleCursorChange = useCursorChangeAction(setBlocks, setCursor);
    const handleEnter = useOnEnterAction(setBlocks, setCursor, scheduleUpdates);
    const handleBackspace = useOnBackspaceAction(setBlocks, setCursor, scheduleUpdates);
    // const handleDelete = useOnDeleteAction(setBlocks, setCursor);
    // const handleArrowUp = useOnArrowUpAction(setCursor);
    // const handleArrowDown = useOnArrowDownAction(setCursor);
    // const handleArrowLeft = useOnArrowLeftAction(setCursor);
    // const handleArrowRight = useOnArrowRightAction(setCursor);

    console.log(blocks);
    

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, index: number, id: number) => {
        const input = inputsRef.current[index];
        if (!input) return;

        const pos = input.selectionStart ?? 0;

        if (e.key === "Enter") {
            e.preventDefault();
            handleEnter(blocks, id, pos);
            setTimeout(() => {
                const prevInput = inputsRef.current[index + 1];
                if (prevInput) {
                    prevInput.focus();
                    prevInput.setSelectionRange(0, 0);
                }
            }, 0);
        }

        if (e.key === "Backspace" && pos === 0 && index > 0) {
            e.preventDefault();
            const { newCursorPos } = handleBackspace(blocks, id);
            setTimeout(() => {
                const prevInput = inputsRef.current[index - 1];
                if (prevInput) {
                    prevInput.focus();
                    prevInput.setSelectionRange(newCursorPos, newCursorPos);
                }
            }, 0);
        }

        // if (e.key === "Delete" && pos === input.value.length && index < blocks.length - 1) {
        //     e.preventDefault();
        //     const { newIndex, newCursorPos } = handleDelete(blocks, index, pos);
        //     setTimeout(() => {
        //         input.focus();
        //         input.setSelectionRange(newCursorPos, newCursorPos);
        //     }, 0);
        // }

        // if (e.key === "ArrowUp" && index > 0) {
        //     e.preventDefault();
        //     handleArrowUp(inputsRef.current[index - 1], index, pos);
        // }

        // if (e.key === "ArrowDown" && index < blocks.length - 1) {
        //     e.preventDefault();
        //     handleArrowDown(inputsRef.current[index + 1], index, pos);
        // }

        // if (e.key === "ArrowLeft") {
        //     e.preventDefault();
        //     const { newIndex, newCursorPos } = handleArrowLeft(blocks, index, pos, e.ctrlKey);
        //     const input = inputsRef.current[newIndex];
        //     if (input) {
        //         input?.focus();
        //         input?.setSelectionRange(newCursorPos, newCursorPos);
        //     }
        // }

        // if (e.key === "ArrowRight") {
        //     e.preventDefault();
        //     const { newIndex, newCursorPos } = handleArrowRight(blocks, index, pos, e.ctrlKey);
        //     const input = inputsRef.current[newIndex];
        //     if (input) {
        //         input?.focus();
        //         input?.setSelectionRange(newCursorPos, newCursorPos);
        //     }
        // }
    }, [inputsRef, handleEnter, handleBackspace, blocks]);

    const selectLastBlock = useCallback(() => {
        console.log("Select last block");
        
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
                        inputRef={(el) => {
                            inputsRef.current[i] = el;
                        }}
                        block={block}
                        onChange={handleCursorChange}
                        onKeyDown={(e, id) => handleKeyDown(e, i, id)}
                        remoteCursors={remoteCursors}
                    />
                ))}
            </div>

            <Debug cursor={cursor} blocks={blocks} />
        </div>
    );
}
