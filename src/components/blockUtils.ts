import type { BlockType } from "../types/types";

export const splitBlock = (
    blocks: BlockType[],
    blockId: string,
    cursorIndex: number
): { blocks: BlockType[]; newCursor: { blockId: string; index: number } } => {
    const idx = blocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return { blocks, newCursor: { blockId, index: cursorIndex } };
    const curr = blocks[idx];
    const before = curr.value.slice(0, cursorIndex);
    const after = curr.value.slice(cursorIndex);

    const newBlock: BlockType = {
        id: Math.random().toString(36).slice(2),
        value: after,
        position: idx + 1,
        createdAt: new Date(),
    };

    const updated = [...blocks];
    updated[idx] = { ...curr, value: before };
    updated.splice(idx + 1, 0, newBlock);

    return {
        blocks: updated.map((b, i) => ({ ...b, position: i })),
        newCursor: { blockId: newBlock.id, index: 0 },
    };
};

export const mergeBlocks = (
    blocks: BlockType[],
    currentIdx: number,
    mergeWithNext: boolean
): { blocks: BlockType[]; newCursor: { blockId: string; index: number } } => {
    if (mergeWithNext) {
        if (currentIdx === blocks.length - 1) return { blocks, newCursor: { blockId: blocks[currentIdx].id, index: blocks[currentIdx].value.length } };
        const curr = blocks[currentIdx];
        const next = blocks[currentIdx + 1];
        const mergedValue = curr.value + next.value;
        const updated = [...blocks];
        updated[currentIdx] = { ...curr, value: mergedValue };
        updated.splice(currentIdx + 1, 1);
        return {
            blocks: updated.map((b, i) => ({ ...b, position: i })),
            newCursor: { blockId: curr.id, index: curr.value.length },
        };
    } else {
        if (currentIdx === 0) return { blocks, newCursor: { blockId: blocks[currentIdx].id, index: 0 } };
        const prev = blocks[currentIdx - 1];
        const curr = blocks[currentIdx];
        const mergedValue = prev.value + curr.value;
        const updated = [...blocks];
        updated[currentIdx - 1] = { ...prev, value: mergedValue };
        updated.splice(currentIdx, 1);
        return {
            blocks: updated.map((b, i) => ({ ...b, position: i })),
            newCursor: { blockId: prev.id, index: prev.value.length },
        };
    }
};

export const updateBlock = (
    blocks: BlockType[],
    blockId: string,
    newValue: string
): BlockType[] => {
    return blocks.map((b) => (b.id === blockId ? { ...b, value: newValue } : b));
};
