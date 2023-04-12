import { withSessionSsr } from "@/lib/session";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useRef, useState } from "react";

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


const SignUp = () => {

    const [errmessage, setErrMessage] = useState("")
    const [message, setMessage] = useState("")
    const [uploading, setUploading] = useState(false)
    const formEl = useRef<HTMLFormElement>(null)
    const router = useRouter()

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const formData = new FormData(formEl.current || undefined)

        const name = formData.get("name")?.toString()?.trim() || ''
        const username = formData.get("username")?.toString()?.trim() || ''
        const password = formData.get("password")?.toString() || ''
        const password2 = formData.get("password2")?.toString() || ''

        if (!username.match(/^[A-Za-z0-9_.-]{3,16}$/g)) {
            setErrMessage("Business ID has to be 3-16 characters long and can only contain numbers, letters, underscores, dashes, or periods.")
            return
        }

        if (password !== password2) {
            setErrMessage("Passwords do not match")
            return
        }

        setUploading(true)
        try {
            const res = await fetch("/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({businessID: username, name, password})
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data?.message || "Server error")
            }
            setErrMessage("")

            setMessage("Sign up successful! Redirecting to Login page...")
            setTimeout(() => router.push("/login"), 3000)
            formEl?.current?.reset()

        } catch (e) {
            if (e instanceof Error) {
                setErrMessage(e.message || "Server error")
            }
            else {
                setErrMessage("Server error")
            }
        }
        setUploading(false)
    }

    return (
        <Container maxWidth="xs">
            {errmessage && <Alert severity="error">{errmessage}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            <Typography variant="h4" sx={{margin: "1rem 0"}}>Create an account</Typography>
            <form ref={formEl} onSubmit={handleSubmit}>
                <TextField required sx={{marginBottom: "1rem"}} fullWidth name="username" placeholder="Business ID (will be used in your URL)"/>
                <TextField required sx={{marginBottom: "1rem"}} fullWidth name="name" placeholder="Business Name"/>
                <TextField required sx={{marginBottom: "1rem"}} fullWidth name="password" placeholder="Password" type="password"/>
                <TextField required sx={{marginBottom: "1rem"}} fullWidth name="password2" placeholder="Confirm Password" type="password"/>
                <Button sx={{marginBottom: "1rem"}} type="submit" disabled={uploading} fullWidth variant="contained">Register Account</Button>
            </form>
            <Box>
                Already have and account? <Link href={'/login'}>Log In</Link>
            </Box>
        </Container>
    )
}

export default SignUp