import { withSessionSsr } from "@/lib/session";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { GetServerSidePropsResult } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { LoginInput, LoginResponse } from "./api/login";

async function fetchLogin(input: LoginInput) : Promise<LoginResponse> {
    try {
        return await fetch("/api/login", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(input)
        }).then(r => r.json())
    }
    catch(e) {
        return {message: "An error occurred"}
    }
}

// Redirect to /dashboard if logged in
export const getServerSideProps = withSessionSsr(({req}) : GetServerSidePropsResult<any> =>{

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


export default function Login() {

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
            const res = await fetchLogin({username, password})
            if (!res.id) {
                throw new Error(res.message)
            }
            router.push("/dashboard")
        }
        catch (e) {
            if (e instanceof Error) { 
                setMessage(e.message || 'An error occurred')
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
                Don&apos;t have an account? <Link href={'/signup'}>Sign up</Link>
            </Box>
        </Container>
    )
}