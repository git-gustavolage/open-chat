import Users from "./icons/Users";

interface CommunityCardProps {
    roomId: string;
    name: string;
    onClick: (roomId: string) => void;
}

export default function CommunityCard({ roomId, name, onClick }: CommunityCardProps) {

    return (
        <div onClick={() => onClick(roomId)} className="max-w-[450px] p-4 ring-2 ring-neutral-200 hover:ring-pink-400 rounded-lg duration-200 ease-in-out cursor-pointer scale-[0.98] hover:scale-100">
            <span className="h-32 w-full flex items-center justify-center text-6xl">🖕</span>

            <div className="flex flex-col pt-2 gap-y-1">
                <p className="font-bold">{name}</p>
                <span className="text-pink-600">#{roomId}</span>

                <div className="inline-flex gap-1 items-center py-1 text-sm text-neutral-600">
                    <Users size={18} /> 0 Membros
                </div>
            </div>
        </div>
    )
}