import { useCatalog } from "@/lib/hooks"
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
    const { mutate } = useCatalog()

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
        }
        mutate()

    }

    return (
    <form onSubmit={handleSubmit} ref={formEl} style={{display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center"}}>
        <Typography variant="h6">Upload a new service</Typography>
        <div><TextField fullWidth name="eventName" placeholder="Service Name" required/></div>
        <div><TextField fullWidth name="description" multiline rows={4} placeholder="Description (optional)"/></div>
        <div><Button type="submit" variant="contained" disabled={uploading}>Upload</Button></div>
    </form>
    )
}