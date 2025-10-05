import { useCallback, type SetStateAction } from "react"
import type { BlockType, ScheduleUpdate } from "../types"

export const useDeleteBlock = (
    setBlocks: React.Dispatch<SetStateAction<Map<string, BlockType>>>,
    setOrder: React.Dispatch<SetStateAction<string[]>>,
    scheduleUpdates: ScheduleUpdate,
) => {

    return useCallback((id: string) => {


    }, [setBlocks, setOrder, scheduleUpdates]);
}