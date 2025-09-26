import { useEffect, useRef, memo } from "react";
import type { BlockType, RemoteCursorType } from "./types";
import { RemoteCursor } from "./RemoteCursor";

interface BlocksProps {
    block: BlockType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
    remoteCursors: RemoteCursorType[];
    inputRef: (el: HTMLInputElement | null) => void;
}

function BlockComponent({ block, onChange, onKeyDown, remoteCursors, inputRef }: BlocksProps) {
    const localRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef) inputRef(localRef.current);
    }, [inputRef, block]);

    return (
        <div className="relative">
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
    );
}

const Block = memo(BlockComponent, (prev, next) => {
    return (
        prev.block.id === next.block.id &&
        prev.block.text === next.block.text
    );
});

export default Block;
