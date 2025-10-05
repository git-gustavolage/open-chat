import React, { useState, useRef, useCallback, useEffect } from "react";
import type { BlockType, CursorType } from "../types";
import { useChangeAction } from "../actions/changeAction";
import { useOnEnterAction } from "../actions/enterAction";
import { useOnBackspaceAction } from "../actions/backspaceAction";
import { useOnDeleteAction } from "../actions/deleteAction";
import { useOnArrowUpAction } from "../actions/arrowUpAction";
import { useOnArrowDownAction } from "../actions/arrowDownAction";
import { useOnArrowLeftAction } from "../actions/arrowLeftAction";
import { useOnArrowRightAction } from "../actions/arrowRightAction";
import { useSchedule } from "../hooks/useSchedule";
import { useOnSelectLastBlock } from "../actions/selectLastBlock";
import { useCursorsByBlock } from "../hooks/useCursorByBlocks";
import { useRenderedBlocks } from "../hooks/useRenderedBlocks";
import { usePasteAction } from "../actions/pasteAction";
import { useDeleteImage } from "../actions/deleteImage";

interface WhiteboardEditorProps {
    roomId: string;
    username: string;
}

export default function WhiteboardEditor({ roomId, username }: WhiteboardEditorProps) {
    const [blocks, setBlocks] = useState<Map<string, BlockType>>(new Map());
    const [order, setOrder] = useState<string[]>([]);
    const [cursor, setCursor] = useState<CursorType>({ blockId: "", position: 0 });

    const inputsRef = useRef<Map<string, HTMLInputElement | null>>(new Map());
    const blocksRef = useRef(blocks);
    const orderRef = useRef(order);

    const { schedule: scheduleUpdates, remoteCursors } = useSchedule(
        roomId,
        username,
        setBlocks,
        setOrder
    );

    useEffect(() => {
        blocksRef.current = blocks;
    }, [blocks]);

    useEffect(() => {
        orderRef.current = order;
    }, [order]);

    useEffect(() => {
        const { blockId, position } = cursor;
        if (!blockId) return;

        const input = inputsRef.current.get(blockId);
        if (input) {
            input.focus();
            input.setSelectionRange(position, position);
        }
    }, [cursor]);

    const selectLastBlock = useOnSelectLastBlock(setCursor, setBlocks, setOrder);
    const changeAction = useChangeAction(setBlocks, setCursor, setOrder, scheduleUpdates);
    const handleEnter = useOnEnterAction(setBlocks, setCursor, setOrder, scheduleUpdates);
    const handleBackspace = useOnBackspaceAction(setBlocks, setCursor, setOrder, scheduleUpdates);
    const handleDelete = useOnDeleteAction(setBlocks, setCursor, setOrder, scheduleUpdates);
    const handlePaste = usePasteAction(setBlocks, scheduleUpdates);
    const handleDeleteImage = useDeleteImage(setBlocks, scheduleUpdates);
    const handleArrowUp = useOnArrowUpAction(setCursor, scheduleUpdates);
    const handleArrowDown = useOnArrowDownAction(setCursor, scheduleUpdates);
    const handleArrowLeft = useOnArrowLeftAction(setCursor, scheduleUpdates);
    const handleArrowRight = useOnArrowRightAction(setCursor, scheduleUpdates);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        changeAction(e, blocksRef.current, orderRef.current, id);
    }, [changeAction]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        const input = inputsRef.current.get(id);
        if (!input) return;

        const index = orderRef.current.findIndex((item) => item === id);
        if (index === -1) return;

        const pos = input.selectionStart ?? 0;
        let currentBlocks = blocksRef.current;
        let currentOrder = orderRef.current;
        let blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);

        switch (e.key) {
            case "Enter":
                e.preventDefault();
                {
                    const result = handleEnter(currentBlocks, currentOrder, id, pos);
                    if (result) {
                        currentBlocks = result.newBlocks;
                        currentOrder = result.newOrder;
                        blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);
                    }
                }
                break;

            case "Backspace":
                if (pos === 0 && index > 0) {
                    e.preventDefault();
                    const result = handleBackspace(currentBlocks, currentOrder, id);
                    if (result) {
                        currentBlocks = result.newBlocks;
                        currentOrder = result.newOrder;
                        blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);
                    }
                }
                break;

            case "Delete":
                if (pos === input.value.length && index < currentOrder.length - 1) {
                    e.preventDefault();
                    const result = handleDelete(currentBlocks, currentOrder, id);
                    if (result) {
                        currentBlocks = result.newBlocks;
                        currentOrder = result.newOrder;
                        blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);
                    }
                }
                break;

            case "ArrowUp":
                e.preventDefault();
                handleArrowUp(blockList, currentOrder, id, pos);
                break;

            case "ArrowDown":
                e.preventDefault();
                handleArrowDown(blockList, currentOrder, id, pos);
                break;

            case "ArrowLeft":
                e.preventDefault();
                handleArrowLeft(blockList, id, pos, e.ctrlKey);
                break;

            case "ArrowRight":
                e.preventDefault();
                handleArrowRight(blockList, id, pos, e.ctrlKey);
                break;
        }
    },
        [
            handleEnter,
            handleBackspace,
            handleDelete,
            handleArrowUp,
            handleArrowDown,
            handleArrowLeft,
            handleArrowRight,
        ]
    );

    const handleEditorClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            selectLastBlock(orderRef.current, blocksRef.current);
        }
    };

    const cursorsByBlock = useCursorsByBlock(remoteCursors);
    const renderedBlocks = useRenderedBlocks({
        blocks,
        order,
        inputsRef,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleDeleteImage,
        cursorsByBlock,
    });

    useEffect(() => {
        selectLastBlock(orderRef.current, blocksRef.current);
    }, []);

    return (
        <div className="w-full min-h-full h-full flex flex-col items-center justify-between gap-8 pb-32">
            <div
                className="w-full h-full bg-bg-light py-4 px-4 overflow-y-auto ring-1 ring-border-color"
                onClick={handleEditorClick}
            >
                {renderedBlocks}
            </div>
        </div>
    );
}
