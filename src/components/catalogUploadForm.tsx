import { UploadServiceInput, UploadServiceResponse } from "@/pages/api/uploadService"
import { Button, TextField, Typography } from "@mui/material"
import { useRouter } from "next/router"
import { FormEventHandler, useRef, useState } from "react"

const fetchUploadService = async (input: UploadServiceInput) : Promise<UploadServiceResponse> => {
    try {
        return await fetch("/api/uploadService", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(input)
        }).then(r => r.json())
    }
    catch(e) {
        return {id: null, message: "An error occurred"}
    }
}

export default function CatalogUploadForm() {
    const [uploading, setUploading] = useState(false)
    const formEl = useRef<HTMLFormElement>(null)
    const router = useRouter()

    const handleSubmit : FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (uploading) {return}
        const data =  new FormData(e.currentTarget)

        const eventName = data.get("eventName")?.toString()?.trim()
        const description = data.get("description")?.toString()?.trim()

        if (!eventName) {return}

        setUploading(true)
        const res = await fetchUploadService({eventName, description})
        setUploading(false)
        if (res.id && formEl.current !== null) {
            formEl.current.reset()
            router.reload()
        }

    }

    return (
    <form onSubmit={handleSubmit} ref={formEl}>
        <Typography variant="h6">Upload a new service</Typography>
        <div><TextField name="eventName" style={{margin: "1rem 0"}} placeholder="Service Name" required/></div>
        <div><TextField name="description" multiline rows={4} style={{margin: "1rem 0"}} placeholder="Description (optional)"/></div>
        <div><Button type="submit" variant="contained" disabled={uploading}>Upload</Button></div>
    </form>
    )
}