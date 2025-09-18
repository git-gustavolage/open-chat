import React from "react";
import type { BlockUpdate } from "../types/types";

type UpdatesModalProps = {
    isOpen: boolean;
    onClose: () => void;
    pendingUpdates: BlockUpdate[];
};

export const UpdatesModal: React.FC<UpdatesModalProps> = ({
    isOpen,
    onClose,
    pendingUpdates,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm max-w-2xl w-full h-[400px] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-zinc-200">
                    <h3 className="text-lg font-bold">Atualizações pendentes:</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <ul className="p-4 space-y-2">
                    {pendingUpdates.map((u, i) => (
                        <li key={i} className="text-sm">
                            [{u.updatedAt.toLocaleTimeString()}] {u.updatedBy} alterou{" "}
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{u.blockId}</code> de "
                            {u.oldValue}" para "{u.newValue}"
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};