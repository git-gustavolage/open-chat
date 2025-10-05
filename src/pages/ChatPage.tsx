import { useParams } from "react-router";
import WhiteboardEditor from "../components/WhiteboardEditor";

export default function ChatPage() {

    const { roomId } = useParams<{ roomId: string }>();
    const username = window.localStorage.getItem("username");

    if (!roomId || !username) {
        return (
            <p>Sala Não encontrada...</p>
        )
    }

    return (
        <div className="w-full h-full relative">
            <div className="w-full h-[45px] border-b border-border-color sticky top-0 bg-bg-light/50 z-50 backdrop-blur-xs"></div>
            <div className="max-h-[clac(100%-45px)]">
                <WhiteboardEditor roomId={roomId} username={username} />
            </div>
        </div>
    )
}
