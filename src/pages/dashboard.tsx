import { UserSessionProps, getServerSidePropsUserSession } from "@/lib/session";
import { Container } from "@mui/material";
import Link from "next/link";

// gets User session info and redirects to /login if not found
export const getServerSideProps = getServerSidePropsUserSession

export default function Dashboard({user}: UserSessionProps)  {
    return (
        <Container sx={{marginTop: "1rem"}}>
            Hello, {user.businessName}
            <div>
                <Link href={"/api/redirectLogout"}>Logout</Link>
            </div>
        </Container>
    )
}
