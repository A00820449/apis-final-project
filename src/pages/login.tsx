import { withSessionSsr } from "@/lib/session";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";

export const getServerSideProps = withSessionSsr(async ({req})=>{

    if (req.session.user_id) {
        return {
            redirect: {
                permanent: false,
                destination: "/dashboard"
            }
        }
    }

    return {
        props: {}
    }
})


const Login = () => {

    const [message, setMessage] = useState("")
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if (uploading) {return}

        const data = new FormData(e.currentTarget)

        const username = data.get("username")?.toString()?.trim() || ''
        const password = data.get("password")?.toString() || ''

        if (!username || !password) {return}

        setUploading(true)

        try {
            const res = await fetch("/api/login", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({username, password})
            })
            const data = await res.json()
            if (!res.ok) {
                setMessage(data?.message || 'An error occurred')
            }
            else {
                router.push("/dashboard")   
            }
        }
        catch (e) {
            if (e instanceof Error) { 
                setMessage(e?.message || 'An error occurred')
            }
            else {
                setMessage('An error occurred')
            }
        }
        setUploading(false)
    }

    return (
        <Container maxWidth="xs">
            {message && <Alert severity="error">{message}</Alert>}
            <Typography variant="h4" sx={{margin: "1rem 0"}}>Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField sx={{marginBottom: "1rem"}} fullWidth name="username" placeholder="Business ID"/>
                <TextField sx={{marginBottom: "1rem"}} fullWidth name="password" placeholder="Password" type="password"/>
                <Button sx={{marginBottom: "1rem"}} type="submit" disabled={uploading} fullWidth variant="contained">Log In</Button>
            </form>
            <Box>
                Don't have an account? <Link href={'/signup'}>Sign up</Link>
            </Box>
        </Container>
    )
}

export default Login