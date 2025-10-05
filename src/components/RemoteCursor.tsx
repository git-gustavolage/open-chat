import { useEffect, useState } from "react";
import type { RemoteCursorType } from "../types";

type Props = {
    cursor: RemoteCursorType;
    inputRef: React.RefObject<HTMLInputElement | null>;
    username: string;
};

export const RemoteCursor: React.FC<Props> = ({ cursor, inputRef, username }) => {
    const [left, setLeft] = useState(0);
    const [height, setHeight] = useState(0);
    const [selectionLeft, setSelectionLeft] = useState(0);
    const [selectionWidth, setSelectionWidth] = useState(0);

    useEffect(() => {
        if (!inputRef.current) return;
        const input = inputRef.current;

        const style = window.getComputedStyle(input);
        const font = style.font;

        const caretPos = cursor.selectionEnd !== undefined ? cursor.selectionEnd : cursor.position;

        const valueBeforeCaret = input.value.slice(0, caretPos);
        const spanCaret = document.createElement("span");
        spanCaret.style.visibility = "hidden";
        spanCaret.style.position = "absolute";
        spanCaret.style.whiteSpace = "pre";
        spanCaret.style.font = font;
        spanCaret.innerText = valueBeforeCaret;
        input.parentElement?.appendChild(spanCaret);
        const newLeft = spanCaret.getBoundingClientRect().width;
        spanCaret.remove();
        setLeft(newLeft);
        setHeight(input.offsetHeight);

        if (cursor.selectionEnd !== undefined && cursor.selectionEnd !== cursor.position) {
            const start = Math.min(cursor.position, cursor.selectionEnd);
            const end = Math.max(cursor.position, cursor.selectionEnd);

            const valueBeforeStart = input.value.slice(0, start);
            const valueBeforeEnd = input.value.slice(0, end);

            const spanStart = document.createElement("span");
            spanStart.style.visibility = "hidden";
            spanStart.style.position = "absolute";
            spanStart.style.whiteSpace = "pre";
            spanStart.style.font = font;
            spanStart.innerText = valueBeforeStart;
            input.parentElement?.appendChild(spanStart);
            const selLeft = spanStart.getBoundingClientRect().width;
            spanStart.remove();

            const spanEnd = document.createElement("span");
            spanEnd.style.visibility = "hidden";
            spanEnd.style.position = "absolute";
            spanEnd.style.whiteSpace = "pre";
            spanEnd.style.font = font;
            spanEnd.innerText = valueBeforeEnd;
            input.parentElement?.appendChild(spanEnd);
            const selRight = spanEnd.getBoundingClientRect().width;
            spanEnd.remove();

            setSelectionLeft(selLeft);
            setSelectionWidth(selRight - selLeft);
        } else {
            setSelectionWidth(0);
        }
    }, [cursor.position, cursor.selectionEnd, inputRef]);

    return (
        <>
            <div
                style={{
                    position: "absolute",
                    left: left,
                    top: 0,
                    width: 2,
                    height: height,
                    backgroundColor: cursor.color ?? "blue",
                    pointerEvents: "none",
                }}
            />
            <div
                className="rounded-t-md text-xs cursor-none select-none -top-5 text-white"
                style={{
                    position: "absolute",
                    left: left,
                    backgroundColor: cursor.color ?? "blue",
                    padding: "2px 4px",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                }}
            >
                {username}
            </div>
            {selectionWidth > 0 && (
                <div
                    style={{
                        position: "absolute",
                        left: selectionLeft,
                        top: 0,
                        width: selectionWidth,
                        height: height,
                        backgroundColor: `${cursor.color ?? "blue"}33`,
                        pointerEvents: "none",
                    }}
                />
            )}
        </>
    );
};