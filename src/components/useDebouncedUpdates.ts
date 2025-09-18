import React, { useCallback, useRef } from "react";
import type { BlockUpdate } from "../types/types";

export const useDebouncedUpdates = <T extends BlockUpdate>(
    onAddPending: (update: T) => void,
    delay: number = 300
) => {
    const pendingOldValues = useRef<Map<string, string>>(new Map());
    const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const scheduleUpdate = useCallback((
        blockId: string,
        oldValue: string,
        newValue: string,
        updatedBy: string
    ) => {
        if (!timeouts.current.has(blockId)) {
            // First change in the series: capture the old value before the batch
            pendingOldValues.current.set(blockId, oldValue);
        }

        // Clear any existing timeout for this block
        if (timeouts.current.has(blockId)) {
            clearTimeout(timeouts.current.get(blockId));
            timeouts.current.delete(blockId);
        }

        // Schedule a new timeout with the current newValue (will be the final one for the last call)
        const timeoutId = setTimeout(() => {
            const batchOldValue = pendingOldValues.current.get(blockId)!;
            onAddPending({
                blockId,
                oldValue: batchOldValue,
                newValue,
                updatedAt: new Date(),
                updatedBy,
            } as T);
            pendingOldValues.current.delete(blockId);
            timeouts.current.delete(blockId);
        }, delay);

        timeouts.current.set(blockId, timeoutId);
    }, [onAddPending, delay]);

    // Cleanup on unmount or when component re-renders if needed
    React.useEffect(() => {
        return () => {
            timeouts.current.forEach((timeout) => clearTimeout(timeout));
            timeouts.current.clear();
            pendingOldValues.current.clear();
        };
    }, []);

    return scheduleUpdate;
};