import { ReactElement, ReactNode } from "react"
import NavBar from "./navbar";

type LayoutProps = {
    children: ReactNode
}

export default function DashboardLayout({children}: LayoutProps) {
    return (
        <>
        <NavBar/>
        <main>{children}</main>
        </>
    )
}

export const getDashboardLayout = (page: ReactElement) => {
    return <DashboardLayout>
        {page}
    </DashboardLayout>
}