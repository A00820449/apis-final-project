import { withSessionSsr } from "@/lib/session";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useRef, useState } from "react";
import { SignUpInput, SignUpResponse } from "./api/signup";

async function fetchSignup(input: SignUpInput) : Promise<SignUpResponse> {
    try {
        return await fetch("/api/signup", {
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


export default function SignUp() {

    const [errmessage, setErrMessage] = useState("")
    const [message, setMessage] = useState("")
    const [uploading, setUploading] = useState(false)
    const formEl = useRef<HTMLFormElement>(null)
    const router = useRouter()

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()

        if (uploading) {return}

        setErrMessage("")

        const formData = new FormData(formEl.current || undefined)

        const name = formData.get("name")?.toString()?.trim() || ''
        const username = formData.get("username")?.toString()?.trim() || ''
        const password = formData.get("password")?.toString() || ''
        const password2 = formData.get("password2")?.toString() || ''
        const address = formData.get("address")?.toString()?.trim()
        const phoneNum = formData.get("phone_number")?.toString()?.trim()

        if (!username.match(/^[A-Za-z0-9_.-]{3,16}$/g)) {
            setErrMessage("Business ID has to be 3-16 characters long and can only contain numbers, letters, underscores, dashes, or periods.")
            return
        }

        if (phoneNum && !phoneNum.match(/^[0-9]{10}$/)) {
            setErrMessage("Phone number has to be exactly 10 digits long")
            return
        }

        if (password !== password2) {
            setErrMessage("Passwords do not match")
            return
        }

        setUploading(true)
        try {
            const res = await fetchSignup({businessID: username, password: password, name: name, address: address, phoneNum: phoneNum})

            if (!res.id) {
                throw new Error(res.message || "Server error")
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
                <TextField type="tel" required sx={{marginBottom: "1rem"}} fullWidth name="name" placeholder="Business Name"/>
                <TextField sx={{marginBottom: "1rem"}} fullWidth name="phone_number" placeholder="Phone Number (optional)" type="tel"/>
                <TextField multiline rows={4}  sx={{marginBottom: "1rem"}} fullWidth name="address" placeholder="Address (optional)" type="text" />
                <TextField required sx={{marginBottom: "1rem"}} fullWidth name="password" placeholder="Password" type="password"/>
                <TextField required sx={{marginBottom: "1rem"}} fullWidth name="password2" placeholder="Confirm Password" type="password"/>
                <Button sx={{marginBottom: "1rem"}} type="submit" disabled={uploading} fullWidth variant="contained">Register Account</Button>
            </form>
            <Box>
                Already have and account? <Link href={'/login'}>Log In</Link>
            </Box>
            <Box>
                <Link href={'/'}>← Go back</Link>
            </Box>
        </Container>
    )
}