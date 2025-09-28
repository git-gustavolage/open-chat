import { useState } from "react";
import CommunityCard from "../components/Card";
import { useNavigate } from "react-router";

export default function Index() {

    const [username, setUsername] = useState("");
    const [show, setShow] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleClick = (roomId: string) => {
        setShow(true);
        setRoomId(roomId);
    }

    const join = () => {
        if (roomId && username) {
            navigate(`/chat/${roomId}/${username}`)
        }
    }

    return (
        <div className="w-full p-8">

            <h3 className="text-2xl font-bold text-neutral-800 mb-4">Comunidades: </h3>
            <div className="w-full grid grid-cols-1 gap-8">
                <CommunityCard
                    name="IFRO (KGB)"
                    roomId="room1"
                    onClick={handleClick}
                />
            </div>

            <div className="w-full flex items-center justify-center my-8">
                {show && <div className="flex flex-col gap-4 w-full max-w-sm relative py-8">
                    <button
                        className="absolute top-0 right-0 text-neutral-600 hover:text-neutral-800 p-1 cursor-pointer"
                        onClick={() => setShow(false)}
                    >
                        &#10006;
                    </button>
                    <input
                        type="text"
                        name="comunidade"
                        id="comunidade"
                        placeholder="Digite seu username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    />
                    <button
                        onClick={join}
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-pink-600 text-white font-medium hover:bg-pink-700 transition animate-scale-in disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        Entrar
                    </button>
                </div>}
            </div>

        </div>
    )

    // const [showRest, setShowRest] = useState(false);
    // const [roomId, setRoomId] = useState("");
    // const [username, setUsername] = useState("");
    // const [loading, setLoading] = useState(false);
    // const [message, setMessage] = useState<string | null>(null);

    // const handleClick = async () => {
    //     setLoading(true);
    //     setMessage(null);

    //     try {
    //         let response;

    //         if (roomId.trim()) {
    //             // Buscar room existente
    //             response = await fetch(`https://meu.site/api/v1/rooms/${roomId}`);
    //             if (!response.ok) throw new Error("Sala não encontrada");
    //             const data = await response.json();
    //             setMessage(`Sala encontrada: ${data.name ?? "Sem nome"}`);
    //         } else {
    //             // Criar room nova
    //             response = await fetch(`https://meu.site/api/v1/rooms/`, {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({ username }),
    //             });
    //             if (!response.ok) throw new Error("Erro ao criar sala");
    //             const data = await response.json();
    //             setMessage(`Sala criada com ID: ${data.id}`);
    //         }
    //     } catch (err: any) {
    //         setMessage(err.message || "Erro inesperado");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // return (
    //     <div className="flex flex-col items-center justify-center min-h-screen bg-white font-roboto">
    //         <div className="flex flex-col gap-4 w-full max-w-sm">
    //             <input
    //                 type="text"
    //                 name="comunidade"
    //                 id="comunidade"
    //                 placeholder="Digite o ID da comunidade (ou deixe em branco p/ criar nova)..."
    //                 value={roomId}
    //                 onChange={(e) => setRoomId(e.target.value)}
    //                 className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
    //                 onFocus={() => setShowRest(true)}
    //             />

    //             {showRest && (
    //                 <>
    //                     <input
    //                         type="text"
    //                         name="username"
    //                         id="username"
    //                         placeholder="Digite seu nome de usuário..."
    //                         value={username}
    //                         onChange={(e) => setUsername(e.target.value)}
    //                         className="w-full px-4 py-2 rounded-md border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-fade-in-up"
    //                     />

    //                     <button
    //                         onClick={handleClick}
    //                         disabled={loading}
    //                         className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-pink-600 text-white font-medium hover:bg-pink-700 transition animate-scale-in disabled:opacity-50 disabled:cursor-not-allowed">
    //                         {loading ? "Processando..." : (
    //                             <>
    //                                 <span className="text-lg">＋</span>
    //                                 {roomId ? "Entrar na Comunidade" : "Criar Comunidade"}
    //                             </>
    //                         )}
    //                     </button>
    //                 </>
    //             )}

    //             {message && (
    //                 <p className="text-center text-sm text-gray-600 mt-2">{message}</p>
    //             )}
    //         </div>

    //         <div className="w-full flex flex-row gap-8 px-4">

    //             <div className="w-full">
    //                 <h3 className="text-2xl font-bold text-neutral-800 mb-4">Recentes: </h3>

    //                 <div className="w-full grid grid-cols-2 gap-8">
    //                     <CommunityCard />
    //                     <CommunityCard />
    //                     <CommunityCard />
    //                     <CommunityCard />
    //                 </div>
    //             </div>

    //             <div className="w-full">
    //                 <h3 className="text-2xl font-bold text-neutral-800 mb-4">Sugestões: </h3>

    //                 <div className="w-full grid grid-cols-2 gap-8">
    //                     <CommunityCard />
    //                     <CommunityCard />
    //                     <CommunityCard />
    //                     <CommunityCard />
    //                 </div>
    //             </div>

    //         </div>
    //     </div>
    // );
}
