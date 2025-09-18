// actions/changeAction.ts
import React, { useCallback } from "react";
import type { BlockType } from "../types/types";
import { updateBlock } from "../components/blockUtils";

type ScheduleUpdateFn = (
    blockId: string,
    oldValue: string,
    newValue: string,
    updatedBy: string
) => void;

export const useChangeAction = (
    setBlocks: React.Dispatch<React.SetStateAction<BlockType[]>>,
    currentUser: string,
    scheduleUpdate: ScheduleUpdateFn
) => {
    return useCallback(
        (id: string, newValue: string) => {
            setBlocks((prev) => {
                const oldValue = prev.find((b) => b.id === id)?.value ?? "";
                const newBlocks = updateBlock(prev, id, newValue);
                scheduleUpdate(id, oldValue, newValue, currentUser);
                return newBlocks;
            });
        },
        [setBlocks, currentUser, scheduleUpdate]
    );
};