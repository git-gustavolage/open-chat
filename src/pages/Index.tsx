import { useState } from "react";

export default function Index() {
    const [showRest, setShowRest] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-roboto">
            <div className="flex flex-col gap-4 w-full max-w-sm">
                {/* Campo de busca */}
                <input
                    type="text"
                    name="comunidade"
                    id="comunidade"
                    placeholder="Buscar comunidades..."
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    onFocus={() => setShowRest(true)}
                />

                {/* Inputs extras aparecem animados */}
                {showRest && (
                    <>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Digite seu nome de usuário..."
                            className="w-full px-4 py-2 rounded-md border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 animate-fade-in-up"
                        />

                        <button className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-pink-600 text-white font-medium hover:bg-pink-700 transition animate-scale-in">
                            <span className="text-lg">＋</span>
                            Criar Comunidade
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
