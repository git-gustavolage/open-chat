import { useState } from "react";
import CommunityCard from "../components/Card";
import { useNavigate } from "react-router";
import Modal from "../components/Modal";
import StarIcon from "../components/icons/StarIcon";

export default function Home() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");

    const handleClick = (roomId: string) => {
        setRoomId(roomId);
        if (window.localStorage.getItem("username")) {
            navigate(`/room/${roomId}`);
            return;
        }
        setOpen(true);
    }

    const handleJoin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (username && roomId) {
            window.localStorage.setItem("username", username);
            navigate(`/room/${roomId}`);
            setOpen(false);
        }
    }

    return (
        <div className="w-full p-8">

            <Modal open={open} onClose={() => setOpen(false)}>
                <Modal.Header>
                    <span className="inline-flex gap-2 items-center text-neutral-800 text-xl font-semibold"><StarIcon /> Quem é você?</span>
                </Modal.Header>
                <div className="w-full h-full pt-4 flex flex-col gap-4">
                    <p className="text-lg text-zinc-800">Identifique-se para poder acessar a comunidade:</p>
                    <div className="w-full h-full flex flex-col justify-between gap-4">
                        <input
                            id="username"
                            name="username"
                            autoFocus
                            autoComplete="off"
                            spellCheck="false"
                            type="text"
                            placeholder="username"
                            className="w-full py-1.5 px-3 border border-neutral-300 rounded-sm"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div className="w-full flex flex-row gap-4 items-center justify-end">
                            <button
                                className="min-w-[130px] py-1.5 px-8 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-sm cursor-pointer duration-200 ease-in-out"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={!username}
                                className="min-w-[130px] py-1.5 px-8 bg-pink-700 hover:bg-pink-800 border border-pink-700 text-white font-semibold rounded-sm cursor-pointer duration-200 ease-in-out disabled:opacity-60 disabled:pointer-events-none"
                                onClick={handleJoin}
                            >
                                Entrar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <h3 className="text-2xl font-bold text-neutral-800 mb-4">Comunidades: </h3>
            <div className="w-full grid grid-cols-1 gap-8">
                <CommunityCard
                    name="IFRO (KGB)"
                    roomId="room1"
                    onClick={handleClick}
                />
            </div>
        </div>
    )
}
