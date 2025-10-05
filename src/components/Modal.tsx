import type { ReactNode } from "react";
import XIcon from "./icons/XIcon";
import { createContext, useContext } from "react";
import { twMerge } from "tailwind-merge";

const ModalContext = createContext({ open: false, onClose: () => { } });

interface ModalProps {
    className?: string;
    open: boolean;
    onClose: () => void;
    children?: ReactNode;
}

interface HeaderProps {
    className?: string;
    children?: ReactNode;
}

const Modal = ({ className, open = true, onClose, children }: ModalProps) => {

    return (
        <ModalContext.Provider value={{ open, onClose }}>
            <div
                className={`fixed inset-0 z-40 flex items-center justify-center bg-black/30 transition-all duration-100 ease-in-out
                ${open ? "visible opacity-100" : "hidden opacity-50"}`}
                onClick={onClose}
            >
                <div
                    className={twMerge("min-w-[600px] max-md:min-w-[95%] bg-white border border-neutral-300 rounded-xl p-4 animate-scale-in", className)}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="inset-0 w-full h-full">
                        {children}
                    </div>
                </div>
            </div>
        </ModalContext.Provider>
    )
}

const Header = ({ className, children }: HeaderProps) => {
    const { onClose } = useContext(ModalContext);

    return (
        <div className={twMerge("w-full flex flex-row items-center justify-between", className)}>
            {children}
            <button className="cursor-pointer text-neutral-600 hover:text-neutral-800" onClick={onClose}><XIcon /></button>
        </div>
    )
}

Modal.Header = Header;

export default Modal;
