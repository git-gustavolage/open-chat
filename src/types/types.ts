export type BlockType = {
    id: string;
    value: string;
    position: number;
    createdAt: Date;
};

export type BlockUpdate = {
    blockId: string;
    oldValue: string;
    newValue: string;
    updatedAt: Date;
    updatedBy: string;
};
