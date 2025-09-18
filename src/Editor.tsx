import React, { useEffect, useRef, useState, useCallback } from "react";
import { Block } from "./Block";

import { useChangeAction } from "./actions/changeAction";
import { useEnterAction } from "./actions/enterAction";
import { useBackspaceAtStartAction } from "./actions/backspaceAction";
import { useDeleteAtEndAction } from "./actions/deleteAction";
import { useArrowUpAction } from "./actions/arrowUpAction";
import { useArrowDownAction } from "./actions/arrowDownAction";
import { useHomeAction } from "./actions/homeAction";
import { useEndAction } from "./actions/endAction";
import { useCursorMoveAction } from "./actions/cursorMoveAction";
import type { BlockType, BlockUpdate } from "./types/types";
import { useDebouncedUpdates } from "./components/useDebouncedUpdates";
import { Toolbar } from "./components/Toolbar";
import { UpdatesModal } from "./components/UpdatesModal";

type EditorProps = {
    initialBlocks: BlockType[];
    currentUser: string;
};

export const Editor: React.FC<EditorProps> = ({ initialBlocks, currentUser }) => {
    const [blocks, setBlocks] = useState<BlockType[]>(() =>
        initialBlocks.map((b, i) => ({ ...b, position: i }))
    );

    const [cursor, setCursor] = useState<{ blockId: string; index: number }>({
        blockId: initialBlocks[0]?.id ?? "",
        index: 0,
    });

    const [pendingUpdates, setPendingUpdates] = useState<BlockUpdate[]>([]);
    const [showModal, setShowModal] = useState(false);
    const refs = useRef<Record<string, HTMLInputElement | null>>({});

    const scheduleUpdate = useDebouncedUpdates<BlockUpdate>(
        (update) => {
            setPendingUpdates((prev) => [...prev, update]);
        },
        300
    );

    const handleChange = useChangeAction(setBlocks, currentUser, scheduleUpdate);
    const handleEnter = useEnterAction(setBlocks, setCursor);
    const handleBackspaceAtStart = useBackspaceAtStartAction(setBlocks, setCursor);
    const handleDeleteAtEnd = useDeleteAtEndAction(setBlocks, setCursor);
    const handleArrowUp = useArrowUpAction(blocks, setCursor);
    const handleArrowDown = useArrowDownAction(blocks, setCursor);
    const handleHome = useHomeAction(setCursor);
    const handleEnd = useEndAction(blocks, setCursor);
    const handleCursorMove = useCursorMoveAction(setCursor);
    const handleEditorClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            const lastBlock = blocks[blocks.length - 1];
            const lastBlockLength = lastBlock.value.length;
            handleCursorMove(lastBlock.id, lastBlockLength)
            if (cursor.blockId != lastBlock.id) {
                console.log("cahnge cursor");
                
            } else {
                console.log("else");
                
            }
        }
    }

    const setInputRef = useCallback((id: string) => (el: HTMLInputElement | null) => {
        refs.current[id] = el;
    }, []);

    useEffect(() => {
        const el = refs.current[cursor.blockId];
        if (el) {
            const idx = Math.max(0, Math.min(cursor.index, el.value.length));
            el.focus();
            el.setSelectionRange(idx, idx);
        }
    }, [cursor.blockId, cursor.index]);

    const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position);

    const handleOpenUpdates = () => setShowModal(true);

    return (
        <>
            <div className="w-full flex items-center justify-center min-h-screen h-screen bg-stone-100">
                <div
                    className="mt-[110px] mb-[30px] w-[800px] max-lg:w-[600px] max-md:w-[95%] h-[calc(100%-140px)] bg-white py-8 px-12 rounded-md shadow-sm overflow-y-auto"
                    onClick={handleEditorClick}
                >

                    {sortedBlocks.map((block) => (
                        <Block
                            key={block.id}
                            block={block}
                            isActive={cursor.blockId === block.id}
                            cursorIndex={cursor.blockId === block.id ? cursor.index : 0}
                            onChange={handleChange}
                            onCursorMove={handleCursorMove}
                            onEnter={handleEnter}
                            onArrowUp={handleArrowUp}
                            onArrowDown={handleArrowDown}
                            onHome={handleHome}
                            onEnd={handleEnd}
                            onBackspaceAtStart={handleBackspaceAtStart}
                            onDeleteAtEnd={handleDeleteAtEnd}
                            inputRef={setInputRef(block.id)}
                        />
                    ))}
                </div>
            </div>

            <Toolbar onOpenUpdates={handleOpenUpdates} />
            <UpdatesModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                pendingUpdates={pendingUpdates}
            />
        </>
    );
};
