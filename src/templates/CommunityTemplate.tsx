import HomeIcon from "../components/icons/HomeIcon";
import FileIcon from "../components/icons/FileIcon";
import DotsThreeIcon from "../components/icons/DotsThreeIcon";
import { NavLink, Outlet, useParams } from "react-router";

export default function CommunityTemplate() {

    const { roomId } = useParams<{ roomId: string }>();

    return (
        <div className="w-full h-full flex flex-row bg-bg-dark">
            <div className="w-[300px] h-screen max-h-screen max-w-[300px] flex flex-col border-r border-border-color">
                <div className="w-full h-full ">

                    <div className="w-full inline-flex items-center justify-between py-2 px-3 rounded-tl-xl border-b border-border-color text-text-title">
                        <h2 className="font-semibold tracking-tight text-lg font-inter">{roomId}</h2>
                        <DotsThreeIcon size={24} />
                    </div>

                    <div className="flex flex-col gap-2 py-4 px-2">

                        <NavigationButton to={`/room/${roomId}`} end>
                            <HomeIcon size={20} />
                            <span>Início</span>
                        </NavigationButton>

                        <NavigationButton to={`/room/${roomId}/text`}>
                            <FileIcon size={20} />
                            <span>Texto</span>
                        </NavigationButton>

                    </div>
                </div>
            </div>

            <div className="w-full max-h-screen overflow-y-auto bg-bg-light">
                <Outlet />
            </div>
        </div>
    )
}

interface NavigationButtonProps {
    to: string;
    end?: boolean;
    children: React.ReactNode;
}

function NavigationButton({ to, end = false, children }: NavigationButtonProps) {
    const baseStyle = "w-full inline-flex items-center gap-2 py-1 px-3 rounded-sm cursor-pointer border border-bg-dark text-text-muted";
    const hoverStyle = "hover:bg-bg-light hover:border-border-color";
    const focusStyle = "focus:bg-bg-light focus:text-text-title focus:outline-none";
    const activeStyle = "text-text-title bg-bg-light focus:outline-none border-border-color";
    const inactiveStyle = "bg-bg-dark " + focusStyle;

    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `${baseStyle} ${hoverStyle} ${isActive ? activeStyle : inactiveStyle}`}
        >
            {children}
        </NavLink>
    )
}
