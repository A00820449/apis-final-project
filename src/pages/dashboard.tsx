import { withSessionSsr } from "@/lib/session";
import { Container } from "@mui/material";
import { User } from "./api/user";
import { getUserData } from "@/lib/db";
import Link from "next/link";

export const getServerSideProps = withSessionSsr(async ({req})=>{

    if (!req.session.user_id) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    const user = await getUserData(req.session.user_id)
    
    if (!user) {
        req.session.destroy()
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    return {
        props: {
            user: user
        }
    }
})

const Dashboard = ({user}: {user: User | null}) => {
    return (
        <Container sx={{marginTop: "1rem"}}>
            Hello, {user?.businessName}
            <div>
                <Link href={"/api/redirectLogout"}>Logout</Link>
            </div>
        </Container>
    )
}

export default Dashboard