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

export type Actions = "change" | "enter" | "backspace" | "delete" | "arrowUp" | "arrowDown" | "arrowLeft" | "arrowRight";

export type ScheduleUpdate = (action: Actions, cursor: CursorType, target?: BlockType | null, blocks?: BlockType[] | null) => void
