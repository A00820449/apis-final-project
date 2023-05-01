import DashboardLayout from "@/components/dashboardLayout";
import { UserSessionProps, getServerSidePropsUserSession } from "@/lib/session";
import { Container } from "@mui/material";
import Link from "next/link";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

// gets User session info and redirects to /login if not found
export const getServerSideProps = getServerSidePropsUserSession

const Dashboard : NextPageWithLayout<UserSessionProps> = ({user}: UserSessionProps) =>  {
    return (
        <Container sx={{marginTop: "1rem"}}>
            Hello, {user.businessName}
            <div>
                <Link href={"/api/redirectLogout"}>Logout</Link>
            </div>
        </Container>
    )
}

Dashboard.getLayout = (page: ReactElement) => {
    return <DashboardLayout>
        {page}
    </DashboardLayout>
}

export default Dashboard