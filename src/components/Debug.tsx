import type { BlockType, CursorType } from "../types";

export default function Debug({ cursor, blocks, order }: { cursor: CursorType, blocks: Map<string, BlockType>, order: string[] }) {
    return (
        <pre className="w-[800px] max-lg:w-[600px] max-md:w-[95%] mt-2 text-sm bg-white p-2 rounded mb-[50px]">
            <p>{JSON.stringify(cursor, null, 2)}</p>
            <p>{JSON.stringify(order, null, 2)}</p>
            <p>{JSON.stringify(blocks.values())}</p>
        </pre>
    )
}