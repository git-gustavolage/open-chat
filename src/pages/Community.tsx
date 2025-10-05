import { useParams } from "react-router";
import StarIcon from "../components/icons/StarIcon";
import UsersIcon from "../components/icons/UsersIcon";

export default function Community() {

    const { roomId } = useParams<{ roomId: string }>();

    return (
        <div>
            <div className="w-full h-[45px] border-b border-border-color sticky top-0 bg-bg-light z-50 backdrop-blur-xs"></div>
            <div className="p-4 flex flex-col gap-4">

                <div className="w-full pb-8 px-4 border-b border-border-color flex flex-row gap-4">
                    <div>
                        <span className="size-[256px] flex bg-bg-dark ring-1 ring-border-color rounded-lg"></span>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-text-title text-4xl font-semibold">{roomId}</h3>
                            <span className="text-text-muted text-sm">Quem sabe uma descrição</span>
                        </div>

                        <div className="flex flex-col items-start gap-4">
                            <div className="inline-flex gap-1 items-center text-text-muted">
                                <UsersIcon size={18} />0 Membros
                            </div>
                            <div className="inline-flex items-center gap-4">
                                <button className="py-1.5 px-8 min-w-[130px] bg-pink-700 border border-pink-700 text-neutral-50 font-semibold rounded-sm">Entrar</button>
                                <button className="inline-flex gap-1 items-center rounded-sm border border-border-color bg-bg-dark text-text-title">
                                    <span className="p-2 border-r border-border-color"><StarIcon size={18} /></span>
                                    <span className="py-1.5 px-2">Estrelar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
