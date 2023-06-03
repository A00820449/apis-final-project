import { useCreateAppointment } from "@/lib/hooks";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import { DateTime } from "luxon";
import { FormEventHandler, useState } from "react";

type AppointmentFormProps = {
    appointmentDate: DateTime | null,
    clearAppointmentDate: () => void,
    catalog: {id: string, name: string}[],
    businessUserID: string
}

export default function AppointmentForm({appointmentDate, clearAppointmentDate, catalog, businessUserID}:AppointmentFormProps) {
    const [msg, setMsg] = useState("")
    const {trigger, isMutating} = useCreateAppointment()

    const handleSubmit : FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (isMutating) {return}

        const formData = new FormData(e.currentTarget)

        const serviceID = formData.get("serviceID")?.toString() || "other"
        const notes = formData.get("notes")?.toString()?.trim() || undefined
        const contactEmail = formData.get("contactEmail")?.toString()?.trim() || undefined
        const timeStart = appointmentDate !== null ? appointmentDate.toMillis() : DateTime.now().toMillis()

        e.currentTarget.reset()

        try {
            const res = await trigger({businessUserID, serviceID, notes, timeStart, contactEmail})
            if (!res) {
                throw new Error("no server response")
            }

            if (res.id === null) {
                throw new Error(res.message)
            }
            setMsg("SUCCESS!")
            clearAppointmentDate()
        }
        catch(e) {
            console.error(e)
            let message = "unknown error"
            if (e instanceof Error) {
                message = e.message || message
            }
            setMsg(`ERROR: ${message}`)
        }
    }

    return (
        <>
        <Dialog open={appointmentDate !== null} onClose={clearAppointmentDate} fullWidth>
            <form onSubmit={handleSubmit}>
            <DialogTitle>Make Appointment</DialogTitle>
            <DialogContent>
                <div style={{marginBottom: "1rem"}}>Appointment date: {appointmentDate && appointmentDate.setLocale("us").toLocaleString(DateTime.DATETIME_FULL)}</div>
                <FormControl fullWidth>
                    <InputLabel id="service-select-label">Select Service</InputLabel>
                    <Select labelId="service-select-label" label="Select Service" name="serviceID" defaultValue={""} required>
                        {catalog.map((v)=>(
                        <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
                        ))}
                        <MenuItem value={"other"}>Other</MenuItem>
                    </Select>
                    <TextField placeholder="Contact email (optional)" type="email" name="contactEmail"/>
                    <TextField multiline rows={4} placeholder="Additional notes..." name="notes"/>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => {e.preventDefault(); clearAppointmentDate()}}>
                    Close
                </Button>
                <Button type="submit" disabled={isMutating}>
                    Make Appointment
                </Button>
            </DialogActions>
            </form>
        </Dialog>
        <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={!!msg} autoHideDuration={3000} onClose={() => setMsg("")}>
            <Alert sx={{width: "100%"}} severity={"info"} onClose={() => setMsg("")}>
                {msg}
            </Alert>
        </Snackbar>
        </>
    )
}