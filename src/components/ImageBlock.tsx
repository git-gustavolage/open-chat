import { useState } from "react";
import type { BlockType } from "../types";

interface ImageBlockProps {
    block: BlockType;
    onDelete: (id: string) => void;
}

export default function ImageBlock({ block, onDelete }: ImageBlockProps) {

    const [hover, setHover] = useState(false);

    return (
        <div className="relative inline-block" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>

            <img src={block.text} alt="pasted" className="max-w-full rounded-md min-w-[150px]" />
            {hover && <button
                onClick={() => onDelete(block.id)}
                className="absolute top-1 right-1 bg-neutral-200 text-black rounded-full px-2 py-0 cursor-pointer"
            >
                x
            </button>}
        </div>
    );
}
