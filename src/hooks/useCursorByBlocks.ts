import { useMemo } from "react";
import type { RemoteCursorType } from "../types";

export function useCursorsByBlock(remoteCursors: RemoteCursorType[]) {
    return useMemo(() => {
        const map = new Map<string, RemoteCursorType[]>();
        remoteCursors.forEach(cursor => {
            if (!map.has(cursor.blockId)) {
                map.set(cursor.blockId, []);
            }
            map.get(cursor.blockId)!.push(cursor);
        });
        return map;
    }, [remoteCursors]);
}
