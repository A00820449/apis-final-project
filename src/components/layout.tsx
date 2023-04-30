import { ReactNode } from "react"
import NavBar from "./navbar";
import { useRouter } from "next/router";

interface LayoutProps {
    children: ReactNode
}
export default function Layout({children}: LayoutProps) {
    const router = useRouter()
    const navbarEnabled = !["/signup", "/login"].includes(router.pathname)
    return (
        <>
        {navbarEnabled && <NavBar/>}
        <main>{children}</main>
        </>
    )
}