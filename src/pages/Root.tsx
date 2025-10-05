import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

export default function Root() {

    return (
        <>
            <Sidebar />
            <Outlet />
        </>
    )
}