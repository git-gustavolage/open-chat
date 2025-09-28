import { useParams } from "react-router";
import { Toolbar } from "../components/Toolbar";
import WhiteboardEditor from "../WhiteboardEditor";

export default function ChatPage() {

    const { roomId, username } = useParams<{ roomId: string, username: string }>();

    if (!roomId || !username) {
        return (
            <p>Sala Não encontrada...</p>
        )
    }

    return (
        <>
            <Toolbar />
            <WhiteboardEditor roomId={roomId} username={username} />
        </>
    )
}