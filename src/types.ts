export interface BlockType {
    id: string;
    text: string;
    type: "text" | "image";
}

export type CursorType = {
    blockId: BlockType["id"];
    position: number;
    selectionEnd?: number
};

export type RemoteCursorType = {
    userId: string;
    blockId: BlockType["id"];
    position: number;
    selectionEnd?: number;
    color: string;
};

export type Actions = "create:image" | "change" | "enter" | "backspace" | "delete" | "arrowChange";

export type UpdateRegister = {
    created?: BlockType[] | null,
    updated?: BlockType[] | null,
    deleted?: BlockType[] | null,
}

export type ScheduleUpdate = (action: Actions, cursor: CursorType, target_id?: BlockType["id"], register?: UpdateRegister | null) => void
