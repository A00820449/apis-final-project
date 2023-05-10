import { getDashboardLayout } from "@/components/dashboardLayout";
import { UserSessionProps, getServerSidePropsUserSession } from "@/lib/session";
import { Container, Typography } from "@mui/material";
import Link from "next/link";
import { NextPageWithLayout } from "../_app";
import CopyToClipboard from "@/components/copyToClipboard";
import { useUser } from "@/lib/hooks";

// gets User session info and redirects to /login if not found
export const getServerSideProps = getServerSidePropsUserSession

const Dashboard : NextPageWithLayout<UserSessionProps> = () =>  {
    const {user} = useUser()
    let url : string = "http://localhost/"

    if (typeof window !== "undefined") {
        url = window.location.href
    }

    const urlObject = new URL(url)
    urlObject.pathname = `/@${user.businessID}`

    url = urlObject.toString()
    console.log(url)

    return (
        <Container sx={{marginTop: "1rem"}}>
            <Typography variant="h4">Hello, {user.businessName}</Typography>
            <div style={{display: "flex", alignItems: "center"}}>
                <span style={{marginRight: "1rem"}}>URL for appointments:</span><CopyToClipboard text={url}/>
            </div>
            <div>
                <Link href={"/api/redirectLogout"}>Logout</Link>
            </div>
        </Container>
    )
}

Dashboard.getLayout = getDashboardLayout

export default Dashboard