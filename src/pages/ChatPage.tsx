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
        <div className="w-full relative">
            <div className="w-full h-[45px] border-b border-border-color sticky top-0 bg-bg-dark/50 z-50 backdrop-blur-xs"></div>
            <WhiteboardEditor roomId={roomId} username={username} />
        </div>
    )
}
