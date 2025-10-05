import { memo, useEffect, useRef, type ClipboardEvent } from "react";
import { RemoteCursor } from "./RemoteCursor";
import type { RemoteCursorType } from "../types";

interface BlocksProps {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
    onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;
    inputRef: (el: HTMLInputElement | null) => void;
    remoteCursors: RemoteCursorType[];
}

function BlockComponent({ id, value, onChange, onKeyDown, onPaste, inputRef, remoteCursors }: BlocksProps) {
    const localRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const el = localRef.current;
        if (inputRef) inputRef(el);

        return () => {
            if (inputRef) inputRef(null);
        };
    }, [inputRef]);

    const renderedCursors = remoteCursors.map(cursor => (
        <RemoteCursor
            key={cursor.userId}
            cursor={cursor}
            inputRef={localRef}
            username={cursor.userId}
        />
    ));

    return (
        <div className="relative">
            <input
                ref={localRef}
                value={value}
                onChange={(e) => onChange(e, id)}
                onKeyDown={(e) => onKeyDown(e, id)}
                onPaste={onPaste}
                className="block w-full outline-none"
                spellCheck="false"
            />
            {renderedCursors}
        </div>
    );
}

const Block = memo(BlockComponent, (prev, next) => {
    if (prev.id !== next.id) return false;
    if (prev.value !== next.value) return false;
    if (prev.remoteCursors !== next.remoteCursors) return false;

    return true;
});

export default Block;
