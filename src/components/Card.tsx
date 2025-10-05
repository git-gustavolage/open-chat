import UsersIcon from "./icons/UsersIcon";

interface CommunityCardProps {
    roomId: string;
    name: string;
    onClick: (roomId: string) => void;
}

export default function CommunityCard({ roomId, name, onClick }: CommunityCardProps) {

    return (
        <div onClick={() => onClick(roomId)} className="max-w-[450px] bg-bg-dark p-4 ring-2 ring-border-color hover:ring-primary rounded-lg duration-200 ease-in-out cursor-pointer scale-[0.98] hover:scale-100">
            <span className="h-32 w-full flex items-center justify-center text-6xl"></span>

            <div className="flex flex-col pt-2 gap-y-1">
                <p className="font-bold">{name}</p>
                <span className="text-primary">#{roomId}</span>

                <div className="inline-flex gap-1 items-center py-1 text-sm text-text-muted">
                    <UsersIcon size={18} /> 0 Membros
                </div>
            </div>
        </div>
    )
}