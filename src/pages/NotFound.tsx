import { Link } from "react-router";

export default function NotFound() {

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col gap-2">
            <h3 className="font-inter font-black text-3xl tracking-tight">Página não encontrada!</h3>
            <h2 className="text-2xl">:(</h2>
            <Link to={"/"} className="py-1.5 px-8 bg-neutral-800 rounded-sm text-white">Voltar para o início</Link>
        </div>
    )
}