import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { BlockType, CursorType, RemoteCursorType } from "./types";
import { useChangeAction } from "./actions/changeAction";
import { useOnEnterAction } from "./actions/enterAction";
import { useOnBackspaceAction } from "./actions/backspaceAction";
import { useOnDeleteAction } from "./actions/deleteAction";
import { useOnArrowUpAction } from "./actions/arrowUpAction";
import { useOnArrowDownAction } from "./actions/arrowDownAction";
import { useOnArrowLeftAction } from "./actions/arrowLeftAction";
import { useOnArrowRightAction } from "./actions/arrowRightAction";
import Block from "./Block";
import useSchedule from "./hooks/useSchedule";
import Debug from "./components/Debug";
import { v4 as uuidv4 } from "uuid";

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

    const debugRef = useRef(false);
    
    const { schedule: scheduleUpdates, remoteCursors } = useSchedule(roomId, username, setBlocks, setOrder);

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

    const changeAction = useChangeAction(setBlocks, setOrder, setCursor, scheduleUpdates);
    const handleEnter = useOnEnterAction(setBlocks, setOrder, setCursor, scheduleUpdates);
    const handleBackspace = useOnBackspaceAction(setBlocks, setOrder, setCursor, scheduleUpdates);
    const handleDelete = useOnDeleteAction(setBlocks, setOrder, setCursor, scheduleUpdates);
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

        const index = orderRef.current.findIndex(item => item === id);
        if (index === -1) return;

        const pos = input.selectionStart ?? 0;
        let currentBlocks = blocksRef.current;
        let currentOrder = orderRef.current;
        let blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);

        if (e.key === "Enter") {
            e.preventDefault();
            const result = handleEnter(currentBlocks, currentOrder, id, pos);
            if (result) {
                currentBlocks = result.newBlocks;
                currentOrder = result.newOrder;
                blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);
            }
        }

        if (e.key === "Backspace" && pos === 0 && index > 0) {
            e.preventDefault();
            const result = handleBackspace(currentBlocks, currentOrder, id);
            if (result) {
                currentBlocks = result.newBlocks;
                currentOrder = result.newOrder;
                blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);
            }
        }

        if (e.key === "Delete" && pos === input.value.length && index < currentOrder.length - 1) {
            e.preventDefault();
            const result = handleDelete(currentBlocks, currentOrder, id);
            if (result) {
                currentBlocks = result.newBlocks;
                currentOrder = result.newOrder;
                blockList = currentOrder.map((blockId) => currentBlocks.get(blockId)!);
            }
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            handleArrowUp(blockList, currentOrder, id, pos);
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            handleArrowDown(blockList, currentOrder, id, pos);
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            handleArrowLeft(blockList, id, pos, e.ctrlKey);
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            handleArrowRight(blockList, id, pos, e.ctrlKey);
        }
    }, [
        handleEnter,
        handleBackspace,
        handleDelete,
        handleArrowUp,
        handleArrowDown,
        handleArrowLeft,
        handleArrowRight,
    ]);

    const selectLastBlock = useCallback(() => {
        const currentOrder = orderRef.current;
        const currentBlocks = blocksRef.current;
        
        if (currentOrder.length === 0) {
            const newId = uuidv4();
            const newBlock = { id: newId, text: "" };
            setBlocks((prev) => {
                const next = new Map(prev);
                next.set(newId, newBlock);
                return next;
            });
            setOrder([newId]);
            setCursor({ blockId: newId, position: 0 });
            return;
        }

        const lastIndex = currentOrder.length - 1;
        const lastId = currentOrder[lastIndex];
        const lastBlock = currentBlocks.get(lastId);
        if (!lastBlock) return;

        const length = lastBlock.text.length;
        setCursor({ blockId: lastId, position: length });
    }, []);

    const handleEditorClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            selectLastBlock();
        }
    };

    const cursorsByBlock = useMemo(() => {
        const map = new Map<string, RemoteCursorType[]>();
        remoteCursors.forEach(cursor => {
            if (!map.has(cursor.blockId)) {
                map.set(cursor.blockId, []);
            }
            map.get(cursor.blockId)!.push(cursor);
        });
        return map;
    }, [remoteCursors]);

    const renderedBlocks = useMemo(() => {
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
                            inputsRef.current.set(id, el);
                        } else {
                            inputsRef.current.delete(id);
                        }
                    }}
                    onChange={(e) => handleChange(e, id)}
                    onKeyDown={(e) => handleKeyDown(e, id)}
                    remoteCursors={cursors}
                />
            );
        });
    }, [blocks, order, handleChange, handleKeyDown, cursorsByBlock]);

    useEffect(() => {
        selectLastBlock();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-between gap-8 pt-[100px]">
            <div
                className="w-[800px] max-lg:w-[600px] max-md:w-[95%] h-[calc(100%-140px)] bg-white py-8 px-12 rounded-md shadow-sm overflow-y-auto"
                onClick={handleEditorClick}
            >
                {renderedBlocks}
            </div>

            {debugRef.current && (
                <Debug cursor={cursor} blocks={blocks} order={order} />
            )}
        </div>
    );
}
