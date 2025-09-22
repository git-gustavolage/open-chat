import { useEffect, useRef } from "react";
import type { BlockType, RemoteCursorType } from "./types";
import { RemoteCursor } from "./RemoteCursor";

interface BlocksProps {
    block: BlockType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: number) => void;
    remoteCursors: RemoteCursorType[];
    inputRef: (el: HTMLInputElement | null) => void;
}

export default function Block({ block, onChange, onKeyDown, remoteCursors, inputRef }: BlocksProps) {

    const localRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef) inputRef(localRef.current);
    }, [inputRef, block]);

    return (
        <>
            <div key={block.id} className="relative">
                <input
                    ref={localRef}
                    value={block.text}
                    onChange={(e) => onChange(e, block.id)}
                    onKeyDown={(e) => onKeyDown(e, block.id)}
                    className="block w-full outline-none"
                    spellCheck="false"
                />
                {remoteCursors
                    .filter((c) => c.blockId === block.id)
                    .map((c) => (
                        <RemoteCursor key={c.userId} cursor={c} inputRef={localRef} />
                    ))}
            </div>
        </>
    )
}