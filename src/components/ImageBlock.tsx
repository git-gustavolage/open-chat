import { useState } from "react";
import XIcon from "./icons/XIcon";

interface ImageBlockProps {
    imageSrc: string;
    onClick: () => void;
}

export default function ImageBlock({ imageSrc, onClick }: ImageBlockProps) {

    const [hover, setHover] = useState(false);

    return (
        <div className="relative inline-block" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>

            <img
                src={imageSrc}
                className="max-w-full min-w-[150px] select-none"
                draggable="false"
                onClick={(e) => e.stopPropagation()}
            />
            {hover && <button
                onClick={onClick}
                className="absolute top-2 right-2 bg-neutral-200/50 text-text-title rounded-full p-1 cursor-pointer"
            >
                <XIcon size={16} />
            </button>}
        </div>
    );
}
