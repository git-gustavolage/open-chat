export type CursorType = {
    blockId: number;
    position: number;
    selectionEnd?: number
};

export type RemoteCursorType = {
    userId: string;
    blockId: number;
    position: number;
    selectionEnd?: number;
    color: string;
};

export interface BlockType {
    id: number;
    text: string;
}

export type Actions = "enter" | "backspace";
