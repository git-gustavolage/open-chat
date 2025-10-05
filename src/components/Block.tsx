import { memo, useEffect, useRef, type ClipboardEvent } from "react";
import { RemoteCursor } from "./RemoteCursor";
import type { RemoteCursorType } from "../types";
import ImageBlock from "./ImageBlock";

interface BlocksProps {
    id: string;
    value: string;
    images: string[],
    onChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
    onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;
    onDeleteImage: (index: number) => void;
    inputRef: (el: HTMLInputElement | null) => void;
    remoteCursors: RemoteCursorType[];
}

function BlockComponent({ id, value, images, onChange, onKeyDown, onPaste, onDeleteImage, inputRef, remoteCursors }: BlocksProps) {
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
            <div
                className="w-full flex gap-1 flex-wrap"
                onClick={() => localRef.current?.focus()}
            >
                {Array.isArray(images) && images.map((image, i) => (
                    <ImageBlock key={i} imageSrc={image} onClick={() => onDeleteImage(i)} />
                ))}
            </div>
            {renderedCursors}
        </div>
    );
}

const Block = memo(BlockComponent, (prev, next) => {
    if (prev.id !== next.id) return false;
    if (prev.value !== next.value) return false;

    if (prev.images) {
        if (prev.images.length !== next.images.length) return false;
        if (!prev.images.every((img, i) => img === next.images[i])) return false;
    }

    if (prev.remoteCursors.length !== next.remoteCursors.length) return false;
    if (!prev.remoteCursors.every((c, i) => c.userId === next.remoteCursors[i].userId)) return false;

    return true;
});

export default Block;
