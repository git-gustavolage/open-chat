import type { BlockType, CursorType } from "../types";

export default function Debug({ cursor, blocks, order }: { cursor: CursorType, blocks: Map<string, BlockType>, order: string[] }) {

    const temp: BlockType[] = [];

    blocks.forEach(block => {
        temp.push(block);
    });

    return (
        <div className="w-full text-sm pl-4">
            <pre className="max-w-[1000px]">
                <p>{JSON.stringify(cursor, null, 2)}</p>
                {temp.map((item, i) => (
                    <p key={i}>{JSON.stringify({id: item.id, text: item.text, images: item.images?.length})}</p>
                ))}
                <p>{JSON.stringify(order, null, 2)}</p>
            </pre>
        </div>
    )
}